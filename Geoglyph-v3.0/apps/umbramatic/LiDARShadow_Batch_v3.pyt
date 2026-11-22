# -*- coding: utf-8 -*-
"""
LiDAR Shadow Analyzer - enhanced Python toolbox for ArcGIS Pro 3.5+

Input modes:
  * LAS dataset or LAS/LAZ/ZLAS file -> generate a DSM from first returns.
  * Existing DSM raster, with optional DTM raster.
  * Existing DTM raster only -> terrain-only shadows.

Output binary shadow raster: 1=shaded, 0=illuminated; NoData outside input surface.
Optional duration raster: approximate daylight hours in shadow in specified local-time window.

Requirements: ArcGIS Pro, Spatial Analyst extension; metre-based projected XY
and elevation values in metres. Uses only Python's standard library and ArcPy.
"""

import calendar
import csv
import datetime
import json
import math
import os
import re
import time
import uuid

import arcpy
from arcpy.sa import Con, Hillshade, IsNull, Raster, SetNull


MODES = ("LAS point cloud", "Existing DSM raster", "DTM raster (terrain only)")


class Toolbox:
    def __init__(self):
        self.label = "LiDAR Shadow Tools"
        self.alias = "lidarshadow"
        self.tools = [LiDARShadowAnalyzer, LiDARShadowBatch, ShadowWebMapExport]


class LiDARShadowAnalyzer:
    """Solar-shadow snapshot and daylight shadow-duration analysis."""

    # Fixed indexes make validation and execution consistent.
    MODE = 0
    LAS = 1
    DSM = 2
    DTM = 3
    CELL = 4
    DATE = 5
    TIME = 6
    TZ = 7
    HEIGHT = 8
    INTERVAL = 9
    START = 10
    END = 11
    OUT_DSM = 12
    OUT_DTM = 13
    OUT_SHADOW = 14
    OUT_DURATION = 15

    def __init__(self):
        self.label = "LiDAR Shadow Analyzer (LAS / DSM / DTM)"
        self.description = (
            "Models terrain and surface shadows from an existing DSM, an existing DTM, "
            "or a DSM built from LAS first returns. Optional DTM supports an "
            "above-ground object-height threshold. Provides a snapshot and approximate "
            "daylight shadow-duration raster. Requires projected metre-based data."
        )
        self.canRunInBackground = False

    @staticmethod
    def _param(name, label, datatype, ptype="Optional", direction="Input"):
        return arcpy.Parameter(
            displayName=label,
            name=name,
            datatype=datatype,
            parameterType=ptype,
            direction=direction,
        )

    def getParameterInfo(self):
        mode = self._param("source_mode", "Elevation source", "GPString", "Required")
        mode.filter.type = "ValueList"
        mode.filter.list = list(MODES)
        mode.value = MODES[1]

        # Composite data type permits a prebuilt LAS dataset OR raw LAS/LAZ/ZLAS.
        # Do not use .filter.list on this parameter: its filter may be None.
        las = self._param(
            "las_source", "LAS dataset (.lasd) or point-cloud file (.las/.laz/.zlas)",
            ["DELasDataset", "DEFile"],
        )
        dsm = self._param("dsm_source", "Existing DSM (surface raster)", "GPRasterLayer")
        dtm = self._param("dtm_source", "Existing DTM (bare-earth raster)", "GPRasterLayer")

        cell = self._param("cell_size", "LAS raster cell size (metres)", "GPDouble")
        cell.value = 1.0
        cell.filter.type = "Range"
        cell.filter.list = [0.01, 10000]

        date = self._param("analysis_date", "Analysis date (local)", "GPDate", "Required")
        date.value = datetime.datetime.now()
        time = self._param("analysis_time", "Snapshot time (24-hour HH:MM)", "GPString", "Required")
        time.value = "15:00"

        tz = self._param("utc_offset", "UTC offset in hours (Adelaide: 9.5 standard / 10.5 DST)", "GPDouble", "Required")
        tz.value = 10.5
        tz.filter.type = "Range"
        tz.filter.list = [-12, 14]

        height = self._param("minimum_height", "Ignore surface objects below this height (metres; 0 = off)", "GPDouble")
        height.value = 0.0
        height.filter.type = "Range"
        height.filter.list = [0, 1000]

        interval = self._param("interval_minutes", "Daily sampling interval (minutes)", "GPLong")
        interval.value = 30
        interval.filter.type = "ValueList"
        interval.filter.list = [15, 30, 60]
        start = self._param("start_time", "Daily window start (HH:MM)", "GPString")
        start.value = "08:00"
        end = self._param("end_time", "Daily window end (HH:MM)", "GPString")
        end.value = "18:00"

        out_dsm = self._param("out_dsm", "Generated DSM output (LAS mode)", "DERasterDataset", direction="Output")
        out_dtm = self._param("out_dtm", "Generated DTM output (optional; LAS mode)", "DERasterDataset", direction="Output")
        out_shadow = self._param("out_shadow", "Snapshot shadow raster (1 = shadow)", "DERasterDataset", "Required", "Output")
        out_duration = self._param("out_duration", "Daylight shadow duration (hours; optional)", "DERasterDataset", direction="Output")

        params = [mode, las, dsm, dtm, cell, date, time, tz, height,
                  interval, start, end, out_dsm, out_dtm, out_shadow, out_duration]
        self.updateParameters(params)
        return params

    def isLicensed(self):
        # No checkout during toolbox validation. Do it only while executing.
        try:
            return arcpy.CheckExtension("Spatial") in ("Available", "CheckedOut")
        except Exception:
            return False

    @staticmethod
    def _text(param):
        value = param.valueAsText
        return str(value).strip() if value is not None else ""

    @staticmethod
    def _time_minutes(value):
        if not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", str(value or "")):
            raise ValueError("Enter a 24-hour time as HH:MM (e.g. 15:30).")
        hours, minutes = map(int, str(value).split(":"))
        return 60 * hours + minutes

    @staticmethod
    def _date(value):
        if isinstance(value, datetime.datetime):
            return value.date()
        if isinstance(value, datetime.date):
            return value
        text = str(value or "").strip()
        for pattern in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y",
                        "%m/%d/%Y", "%d/%m/%Y %H:%M:%S", "%m/%d/%Y %I:%M:%S %p"):
            try:
                return datetime.datetime.strptime(text, pattern).date()
            except ValueError:
                pass
        try:
            return datetime.datetime.fromisoformat(text).date()
        except ValueError:
            raise ValueError("Could not parse the analysis date: {}".format(text))

    def updateParameters(self, parameters):
        p = parameters
        mode = self._text(p[self.MODE]) or MODES[1]
        is_las = mode == MODES[0]
        is_dsm = mode == MODES[1]
        is_dtm = mode == MODES[2]

        p[self.LAS].enabled = is_las
        p[self.DSM].enabled = is_dsm
        p[self.DTM].enabled = is_dsm or is_dtm
        p[self.CELL].enabled = is_las
        p[self.OUT_DSM].enabled = is_las
        p[self.OUT_DTM].enabled = is_las
        p[self.HEIGHT].enabled = not is_dtm

        # The time-sampling controls matter only for duration output.
        do_duration = bool(self._text(p[self.OUT_DURATION]))
        for index in (self.INTERVAL, self.START, self.END):
            p[index].enabled = do_duration

        # Always use a geodatabase for defaults (avoid legacy Esri GRID restrictions).
        ws = arcpy.env.scratchGDB or arcpy.env.workspace
        if ws:
            paths = {
                self.OUT_SHADOW: "Shadow_snapshot",
                self.OUT_DURATION: "Shadow_daylight_hours",
                self.OUT_DSM: "DSM_from_LAS",
                self.OUT_DTM: "DTM_from_LAS",
            }
            # Do not create optional outputs automatically.
            for idx in (self.OUT_SHADOW,):
                if not p[idx].altered and not self._text(p[idx]):
                    p[idx].value = os.path.join(ws, paths[idx])
            if is_las and not p[self.OUT_DSM].altered and not self._text(p[self.OUT_DSM]):
                p[self.OUT_DSM].value = os.path.join(ws, paths[self.OUT_DSM])
        return

    def updateMessages(self, parameters):
        p = parameters
        mode = self._text(p[self.MODE]) or MODES[1]
        if mode == MODES[0]:
            if not self._text(p[self.LAS]):
                p[self.LAS].setErrorMessage("Select a LAS dataset or a LAS/LAZ/ZLAS file.")
            elif os.path.splitext(self._text(p[self.LAS]))[1].lower() not in (".lasd", ".las", ".laz", ".zlas"):
                p[self.LAS].setErrorMessage("Use a .lasd, .las, .laz or .zlas file.")
            if not self._text(p[self.OUT_DSM]):
                p[self.OUT_DSM].setErrorMessage("LAS mode requires a generated DSM output path.")
        elif mode == MODES[1]:
            if not self._text(p[self.DSM]):
                p[self.DSM].setErrorMessage("Select an existing DSM raster.")
            try:
                threshold = float(self._text(p[self.HEIGHT]) or 0)
            except ValueError:
                threshold = 0
            if threshold > 0 and not self._text(p[self.DTM]):
                p[self.DTM].setErrorMessage("A DTM is required to apply the minimum object-height filter.")
        elif mode == MODES[2]:
            if not self._text(p[self.DTM]):
                p[self.DTM].setErrorMessage("Select a DTM raster for terrain-only shadows.")

        for idx in (self.TIME, self.START, self.END):
            if idx in (self.START, self.END) and not self._text(p[self.OUT_DURATION]):
                continue
            try:
                self._time_minutes(self._text(p[idx]))
            except ValueError:
                p[idx].setErrorMessage("Enter HH:MM using 24-hour time (e.g. 08:00).")
        if self._text(p[self.OUT_DURATION]):
            try:
                if self._time_minutes(self._text(p[self.START])) >= self._time_minutes(self._text(p[self.END])):
                    p[self.END].setErrorMessage("End time must be later than start time on the same date.")
            except ValueError:
                pass
        return

    @staticmethod
    def sun_position(lat, lon, utc_dt):
        """Approximate NOAA solar azimuth clockwise from true N, altitude degrees.

        utc_dt must be naive UTC datetime. Uses the correct Julian-day epoch and
        a vector-based azimuth to avoid quadrant errors near solar noon.
        """
        utc_hours = (utc_dt.hour + utc_dt.minute / 60.0 +
                     utc_dt.second / 3600.0 + utc_dt.microsecond / 3.6e9)
        jd = utc_dt.toordinal() + 1721424.5 + utc_hours / 24.0
        t = (jd - 2451545.0) / 36525.0
        l0 = (280.46646 + t * (36000.76983 + 0.0003032 * t * t)) % 360.0
        m = 357.52911 + t * (35999.05029 - 0.0001537 * t)
        e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
        c = (math.sin(math.radians(m)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
             math.sin(math.radians(2 * m)) * (0.019993 - 0.000101 * t) +
             math.sin(math.radians(3 * m)) * 0.000289)
        omega = 125.04 - 1934.136 * t
        apparent_lon = l0 + c - 0.00569 - 0.00478 * math.sin(math.radians(omega))
        eps0 = 23.0 + (26.0 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60.0) / 60.0
        eps = eps0 + 0.00256 * math.cos(math.radians(omega))
        decl = math.asin(math.sin(math.radians(eps)) * math.sin(math.radians(apparent_lon)))
        y = math.tan(math.radians(eps / 2.0)) ** 2
        eqtime = 4 * math.degrees(
            y * math.sin(2 * math.radians(l0)) - 2 * e * math.sin(math.radians(m)) +
            4 * e * y * math.sin(math.radians(m)) * math.cos(2 * math.radians(l0)) -
            0.5 * y * y * math.sin(4 * math.radians(l0)) -
            1.25 * e * e * math.sin(2 * math.radians(m))
        )
        solar_minutes = (utc_hours * 60.0 + eqtime + 4 * lon) % 1440.0
        hour_angle = math.radians(solar_minutes / 4.0 - 180.0)
        phi = math.radians(lat)
        sin_alt = math.sin(phi) * math.sin(decl) + math.cos(phi) * math.cos(decl) * math.cos(hour_angle)
        alt = math.degrees(math.asin(max(-1.0, min(1.0, sin_alt))))
        east = -math.cos(decl) * math.sin(hour_angle)
        north = math.cos(phi) * math.sin(decl) - math.sin(phi) * math.cos(decl) * math.cos(hour_angle)
        az = (math.degrees(math.atan2(east, north)) + 360.0) % 360.0
        return az, alt

    @staticmethod
    def _check_surface(path, label):
        desc = arcpy.Describe(path)
        sr = desc.spatialReference
        if not sr or sr.name == "Unknown" or sr.type != "Projected":
            raise ValueError("{} must have a known, projected coordinate system.".format(label))
        units = str(sr.linearUnitName or "").lower()
        if "meter" not in units and "metre" not in units:
            raise ValueError("{} XY coordinates must be in metres, not {}.".format(label, sr.linearUnitName))
        return desc

    @staticmethod
    def _same_grid(a_desc, b_desc):
        if a_desc.spatialReference.exportToString() != b_desc.spatialReference.exportToString():
            return False
        a = arcpy.Raster(a_desc.catalogPath)
        b = arcpy.Raster(b_desc.catalogPath)
        if abs(a.meanCellWidth - b.meanCellWidth) > 1e-6 or abs(a.meanCellHeight - b.meanCellHeight) > 1e-6:
            return False
        dx, dy = a.meanCellWidth, a.meanCellHeight
        e1, e2 = a.extent, b.extent
        # Origin alignment; extents may differ, so long as both share a grid.
        def integral(v):
            return abs(v - round(v)) < 1e-5
        return integral((e1.XMin - e2.XMin) / dx) and integral((e1.YMin - e2.YMin) / dy)

    @staticmethod
    def _binary_shadow(surface, azimuth, altitude):
        if altitude <= 0.0:
            # No direct sunlight anywhere, but preserve raster NoData.
            return SetNull(IsNull(surface), 1)
        shaded_hillshade = Hillshade(
            in_raster=surface,
            azimuth=azimuth,
            altitude=altitude,
            model_shadows="SHADOWS",
            z_factor=1.0,
        )
        # Hillshade 0 includes terrain occlusion and unilluminated local slopes.
        return SetNull(IsNull(surface) | IsNull(shaded_hillshade),
                       Con(shaded_hillshade == 0, 1, 0))

    def execute(self, parameters, messages):
        p = parameters
        mode = self._text(p[self.MODE]) or MODES[1]
        las = self._text(p[self.LAS])
        in_dsm = self._text(p[self.DSM])
        in_dtm = self._text(p[self.DTM])
        out_dsm = self._text(p[self.OUT_DSM])
        out_dtm = self._text(p[self.OUT_DTM])
        out_shadow = self._text(p[self.OUT_SHADOW])
        out_duration = self._text(p[self.OUT_DURATION])
        cell_size = float(self._text(p[self.CELL]) or 1)
        min_height = 0.0 if mode == MODES[2] else float(self._text(p[self.HEIGHT]) or 0)
        interval = int(self._text(p[self.INTERVAL]) or 30)
        time_minutes = self._time_minutes(self._text(p[self.TIME]))
        tz_offset = float(self._text(p[self.TZ]))
        day = self._date(p[self.DATE].value)
        duration_start = self._time_minutes(self._text(p[self.START]) or "08:00")
        duration_end = self._time_minutes(self._text(p[self.END]) or "18:00")

        if mode not in MODES:
            raise ValueError("Invalid elevation source mode: {}".format(mode))
        if not out_shadow:
            raise ValueError("A snapshot shadow output path is required.")
        if min_height < 0:
            raise ValueError("Minimum height cannot be negative.")
        if mode == MODES[0] and (not las or not out_dsm or cell_size <= 0):
            raise ValueError("LAS mode requires LAS input, a positive cell size, and output DSM path.")
        if mode == MODES[1] and not in_dsm:
            raise ValueError("Existing DSM mode requires a DSM raster.")
        if mode == MODES[1] and min_height > 0 and not in_dtm:
            raise ValueError("Minimum object height > 0 needs both DSM and DTM rasters.")
        if mode == MODES[2] and not in_dtm:
            raise ValueError("Terrain-only mode requires a DTM raster.")
        if out_duration and (interval not in (15, 30, 60) or duration_start >= duration_end):
            raise ValueError("Set a sampling interval of 15, 30 or 60 minutes and start < end.")
        extension_status = arcpy.CheckExtension("Spatial")
        if extension_status not in ("Available", "CheckedOut"):
            raise RuntimeError("Spatial Analyst extension is required and is not available.")

        # Never overwrite a supplied input dataset with an output raster.
        source_paths = ([las] if mode == MODES[0] else
                        ([in_dsm, in_dtm] if mode == MODES[1] else [in_dtm]))
        output_paths = ([out_shadow, out_duration] +
                        ([out_dsm, out_dtm] if mode == MODES[0] else []))
        def normalized(path):
            return os.path.normcase(os.path.normpath(os.path.abspath(path)))
        sources = {normalized(path) for path in source_paths if path}
        outputs = [normalized(path) for path in output_paths if path]
        if len(set(outputs)) != len(outputs):
            raise ValueError("Output raster paths must all be different.")
        if any(path in sources for path in outputs):
            raise ValueError("An output path matches an input dataset; choose a different output.")

        scratch_gdb = arcpy.env.scratchGDB
        scratch_folder = arcpy.env.scratchFolder
        if not scratch_gdb or not scratch_folder:
            raise RuntimeError("An ArcGIS scratch geodatabase and scratch folder are required.")
        uid = uuid.uuid4().hex[:12]
        temp_paths = []
        las_layers = []
        checked_out = False

        try:
            if extension_status == "Available":
                arcpy.CheckOutExtension("Spatial")
                checked_out = True
            with arcpy.EnvManager(overwriteOutput=True):
                dsm_path = in_dsm
                dtm_path = in_dtm

                if mode == MODES[0]:
                    source_las = las
                    if os.path.splitext(las)[1].lower() != ".lasd":
                        if os.path.splitext(las)[1].lower() not in (".las", ".laz", ".zlas"):
                            raise ValueError("Input must be .lasd, .las, .laz or .zlas.")
                        source_las = os.path.join(scratch_folder, "shadow_src_{}.lasd".format(uid))
                        arcpy.AddMessage("Creating temporary LAS dataset from {}".format(las))
                        temp_paths.append(source_las)
                        arcpy.management.CreateLasDataset(las, source_las)

                    first_layer = "shadow_first_{}".format(uid)
                    # Return number 1 includes single-return and first-of-many points.
                    las_layers.append(first_layer)
                    arcpy.management.MakeLasDatasetLayer(
                        in_las_dataset=source_las,
                        out_layer=first_layer,
                        return_values=["1"],
                    )
                    arcpy.AddMessage("Generating DSM from first-return points (maximum binning)...")
                    arcpy.conversion.LasDatasetToRaster(
                        in_las_dataset=first_layer,
                        out_raster=out_dsm,
                        value_field="ELEVATION",
                        interpolation_type="BINNING MAXIMUM LINEAR",
                        data_type="FLOAT",
                        sampling_type="CELLSIZE",
                        sampling_value=cell_size,
                        z_factor=1.0,
                    )
                    dsm_path = out_dsm
                    arcpy.AddMessage("DSM: {}".format(dsm_path))

                    if min_height > 0 or out_dtm:
                        dtm_path = out_dtm or os.path.join(scratch_gdb, "_shd_dtm_{}".format(uid))
                        if not out_dtm:
                            temp_paths.append(dtm_path)
                        ground_layer = "shadow_ground_{}".format(uid)
                        las_layers.append(ground_layer)
                        arcpy.management.MakeLasDatasetLayer(
                            in_las_dataset=source_las,
                            out_layer=ground_layer,
                            class_code=[2],
                        )
                        arcpy.AddMessage("Generating DTM from ground-class (2) points...")
                        with arcpy.EnvManager(snapRaster=dsm_path, cellSize=dsm_path):
                            arcpy.conversion.LasDatasetToRaster(
                                in_las_dataset=ground_layer,
                                out_raster=dtm_path,
                                value_field="ELEVATION",
                                interpolation_type="BINNING AVERAGE LINEAR",
                                data_type="FLOAT",
                                sampling_type="CELLSIZE",
                                sampling_value=cell_size,
                                z_factor=1.0,
                            )
                        arcpy.AddMessage("DTM: {}".format(dtm_path))
                    else:
                        dtm_path = ""

                if mode == MODES[2]:
                    dsm_path = in_dtm  # A DTM is the only available elevation surface.
                    dtm_path = ""
                    arcpy.AddWarning("DTM-only mode models terrain shadows; it cannot include buildings or trees.")
                elif mode == MODES[1] and not in_dtm:
                    arcpy.AddMessage("DSM-only mode: building/vegetation shadows and terrain shadows are included.")

                dsm_desc = self._check_surface(dsm_path, "Elevation surface")
                if dtm_path and min_height > 0:
                    dtm_desc = self._check_surface(dtm_path, "DTM")
                    if not self._same_grid(dsm_desc, dtm_desc):
                        raise ValueError(
                            "DSM and DTM have different projections, cell sizes, or pixel-grid origins. "
                            "Align the DTM to the DSM with Project Raster/Resample using the DSM as "
                            "Snap Raster, or set minimum object height to zero."
                        )

                sr = dsm_desc.spatialReference
                extent = dsm_desc.extent
                center = arcpy.PointGeometry(
                    arcpy.Point((extent.XMin + extent.XMax) / 2.0,
                                (extent.YMin + extent.YMax) / 2.0),
                    sr,
                ).projectAs(arcpy.SpatialReference(4326)).centroid
                lat, lon = center.Y, center.X
                arcpy.AddMessage("Analysis centre: {:.6f} latitude, {:.6f} longitude".format(lat, lon))
                arcpy.AddMessage("Date: {} | fixed UTC offset: {:+g} hours".format(day.isoformat(), tz_offset))
                arcpy.AddWarning(
                    "UTC offset is fixed for this run. For Adelaide use +10.5 in daylight "
                    "saving time and +9.5 in standard time."
                )
                arcpy.AddWarning(
                    "Hillshade zero values approximate shadow (cast shade + slopes receiving "
                    "no direct illumination); they are not a ray-traced solar exposure model."
                )

                with arcpy.EnvManager(snapRaster=dsm_path, cellSize=dsm_path, extent=extent):
                    surface = Raster(dsm_path)
                    if min_height > 0:
                        if not dtm_path:
                            raise ValueError("Height filtering requires a DTM.")
                        arcpy.AddMessage("Suppressing DSM objects shorter than {:.2f} m above DTM...".format(min_height))
                        terrain = Raster(dtm_path)
                        # If the DTM is missing in a valid DSM cell, leave DSM unchanged.
                        surface = Con(
                            IsNull(terrain),
                            surface,
                            Con(surface - terrain >= min_height, surface, terrain),
                        )

                    def utc_at(minutes):
                        local = datetime.datetime.combine(day, datetime.time.min) + datetime.timedelta(minutes=minutes)
                        return local - datetime.timedelta(hours=tz_offset)

                    az, alt = self.sun_position(lat, lon, utc_at(time_minutes))
                    arcpy.AddMessage("Snapshot {} -> solar azimuth {:.2f} deg, altitude {:.2f} deg".format(
                        self._text(p[self.TIME]), az, alt))
                    if alt <= 0:
                        arcpy.AddWarning("Sun below horizon: snapshot has shadow value 1 at every valid cell.")
                    self._binary_shadow(surface, az, alt).save(out_shadow)
                    arcpy.AddMessage("Saved binary shadow: {}".format(out_shadow))

                    if out_duration:
                        arcpy.AddMessage("Calculating approximate daylight shadow hours: {} to {}, {}-minute sampling".format(
                            self._text(p[self.START]), self._text(p[self.END]), interval))
                        # Midpoint samples avoid overcounting end points as full hours.
                        slices = []
                        for minute in range(duration_start, duration_end, interval):
                            width = min(interval, duration_end - minute)
                            slices.append((minute + width / 2.0, width / 60.0))
                        arcpy.SetProgressor("step", "Calculating daylight shadow duration", 0, len(slices), 1)
                        accumulator = None
                        active = 0
                        daylight_hours = 0.0
                        try:
                            for mid, hours in slices:
                                az_i, alt_i = self.sun_position(lat, lon, utc_at(mid))
                                if alt_i > 0:
                                    current = self._binary_shadow(surface, az_i, alt_i) * float(hours)
                                    if accumulator:
                                        expr = Raster(accumulator) + current
                                    else:
                                        expr = current
                                    next_accum = os.path.join(scratch_gdb, "_shd_sum_{}_{}".format(uid, active))
                                    temp_paths.append(next_accum)
                                    expr.save(next_accum)
                                    if accumulator and arcpy.Exists(accumulator):
                                        arcpy.management.Delete(accumulator)
                                        temp_paths.remove(accumulator)
                                    accumulator = next_accum
                                    active += 1
                                    daylight_hours += hours
                                arcpy.SetProgressorPosition()
                            if accumulator:
                                Raster(accumulator).save(out_duration)
                            else:
                                # No sun within user-defined window: 0 daylight shadow hours.
                                SetNull(IsNull(surface), 0.0).save(out_duration)
                            arcpy.AddMessage("Saved daylight shadow duration (hours): {}".format(out_duration))
                            arcpy.AddMessage("Sampled sun-above-horizon time: {:.2f} hours".format(daylight_hours))
                            arcpy.AddMessage("Duration is a midpoint approximation; 15 minutes improves temporal resolution.")
                        finally:
                            arcpy.ResetProgressor()

                arcpy.AddMessage("Finished. Shadow = 1 (shade), 0 (directly illuminated).")
                arcpy.AddMessage("Valid NoData regions remain NoData; check the raster boundary and data coverage.")
        finally:
            for name in reversed(las_layers):
                try:
                    if arcpy.Exists(name):
                        arcpy.management.Delete(name)
                except Exception:
                    pass
            for path in reversed(temp_paths):
                try:
                    if arcpy.Exists(path):
                        arcpy.management.Delete(path)
                except Exception:
                    pass
            if checked_out:
                try:
                    arcpy.CheckInExtension("Spatial")
                except Exception:
                    pass


class LiDARShadowBatch(LiDARShadowAnalyzer):
    """Scheduled shadow snapshots with resumable runs and aggregate statistics.

    This is a separate tool: existing single-snapshot parameter indices and
    execution are intentionally unchanged.
    """

    MODE = 0
    LAS = 1
    DSM = 2
    DTM = 3
    CELL = 4
    HEIGHT = 5
    DATE = 6
    TIME = 7
    SCHEDULE = 8
    INTERVAL = 9
    CAPTURES = 10
    END_DATE = 11
    WINDOW_END = 12
    DAY_STEP = 13
    TZ_MODE = 14
    TZ_OFFSET = 15
    SUN_LIMIT = 16
    OUTPUT_FOLDER = 17
    RUN_LABEL = 18
    OUTPUT_FORMAT = 19
    SAVE_CAPTURES = 20
    AGGREGATES = 21
    EXISTING = 22
    CONTINUE = 23
    PREVIEW = 24

    FIXED = "Fixed number of captures"
    DAILY = "Repeated daily window"
    ADELAIDE = "Adelaide automatic DST"
    MANUAL = "Fixed UTC offset"
    TIFF = "GeoTIFF (.tif)"
    GDB = "File geodatabase rasters"
    POLICIES = ("Skip existing", "Overwrite existing", "Stop if existing")
    MAX_CAPTURES = 5000

    def __init__(self):
        self.label = "Batch Shadow Capture (LAS / DSM / DTM)"
        self.description = (
            "Generate many dated shadow rasters from a LAS, DSM or DTM. Supports "
            "fixed-count sequences and daily windows, Adelaide daylight-saving "
            "time, minimum solar altitude, resume/overwrite, a CSV capture log, "
            "schedule preview and aggregate shadow frequency and sampled hours. "
            "Existing single-snapshot tool is retained unchanged."
        )
        self.canRunInBackground = False

    def getParameterInfo(self):
        make = self._param
        mode = make("source_mode", "Elevation source", "GPString", "Required")
        mode.filter.type = "ValueList"
        mode.filter.list = list(MODES)
        mode.value = MODES[1]
        las = make("las_source", "LAS dataset (.lasd) / LAS point cloud", ["DELasDataset", "DEFile"])
        dsm = make("dsm_source", "DSM raster", "GPRasterLayer")
        dtm = make("dtm_source", "DTM raster (optional except terrain-only mode)", "GPRasterLayer")
        cell = make("las_cell_size", "LAS raster cell size (metres)", "GPDouble")
        cell.value = 1.0
        cell.filter.type = "Range"
        cell.filter.list = [0.01, 10000]
        height = make("min_object_height", "Suppress objects shorter than (metres; 0 = off)", "GPDouble")
        height.value = 0.0
        height.filter.type = "Range"
        height.filter.list = [0, 1000]

        date = make("start_date", "Start date (local)", "GPDate", "Required")
        date.value = datetime.datetime.now()
        start = make("start_time", "Start time (local, HH:MM)", "GPString", "Required")
        start.value = "08:00"
        schedule = make("schedule_mode", "Schedule type", "GPString", "Required")
        schedule.filter.type = "ValueList"
        schedule.filter.list = [self.FIXED, self.DAILY]
        schedule.value = self.FIXED
        interval = make("interval_minutes", "Time between captures (minutes)", "GPLong", "Required")
        interval.value = 30
        interval.filter.type = "Range"
        interval.filter.list = [1, 10080]
        captures = make("capture_count", "Number of captures (fixed-count mode)", "GPLong")
        captures.value = 20
        captures.filter.type = "Range"
        captures.filter.list = [1, self.MAX_CAPTURES]
        end_date = make("end_date", "End date inclusive (daily-window mode)", "GPDate")
        end_date.value = datetime.datetime.now()
        window_end = make("daily_end_time", "Daily window end (HH:MM, inclusive)", "GPString")
        window_end.value = "17:30"
        day_step = make("day_step", "Repeat window every N days", "GPLong")
        day_step.value = 1
        day_step.filter.type = "Range"
        day_step.filter.list = [1, 365]

        tz_mode = make("time_zone_mode", "Local-time conversion", "GPString", "Required")
        tz_mode.filter.type = "ValueList"
        tz_mode.filter.list = [self.ADELAIDE, self.MANUAL]
        tz_mode.value = self.ADELAIDE
        tz_offset = make("utc_offset", "Fixed UTC offset (decimal hours)", "GPDouble")
        tz_offset.value = 9.5
        tz_offset.filter.type = "Range"
        tz_offset.filter.list = [-12, 14]
        min_sun = make("minimum_sun_altitude", "Skip captures if sun is below this altitude (degrees)", "GPDouble")
        min_sun.value = 2.0
        min_sun.filter.type = "Range"
        min_sun.filter.list = [-90, 90]

        folder = make("output_folder", "Output parent folder (must exist)", "DEFolder", "Required")
        run_label = make("run_label", "Optional run name (blank = automatic)", "GPString")
        fmt = make("output_format", "Raster output format", "GPString", "Required")
        fmt.filter.type = "ValueList"
        fmt.filter.list = [self.TIFF, self.GDB]
        fmt.value = self.TIFF
        save = make("save_captures", "Keep every shadow capture", "GPBoolean")
        save.value = True
        aggregates = make("create_aggregates", "Create aggregate count, frequency and hours rasters", "GPBoolean")
        aggregates.value = True
        existing = make("existing_captures", "When an output capture already exists", "GPString", "Required")
        existing.filter.type = "ValueList"
        existing.filter.list = list(self.POLICIES)
        existing.value = "Skip existing"
        continue_errors = make("continue_on_error", "Continue when one capture fails", "GPBoolean")
        continue_errors.value = True
        preview = make("preview_only", "Preview schedule only (no rasters or folders written)", "GPBoolean")
        preview.value = False
        params = [mode, las, dsm, dtm, cell, height, date, start, schedule, interval,
                  captures, end_date, window_end, day_step, tz_mode, tz_offset,
                  min_sun, folder, run_label, fmt, save, aggregates, existing,
                  continue_errors, preview]
        self.updateParameters(params)
        return params

    @staticmethod
    def _bool(param):
        return str(param.valueAsText or "").strip().lower() in ("true", "1", "yes")

    @staticmethod
    def _first_sunday(year, month):
        day = 1
        while datetime.date(year, month, day).weekday() != calendar.SUNDAY:
            day += 1
        return datetime.date(year, month, day)

    @classmethod
    def _local_to_utc(cls, local_dt, zone_mode, manual_offset):
        """Adelaide current civil DST rules; no external time-zone libraries.

        On the autumn transition, the repeated 02:00 hour is treated as the
        first occurrence (UTC+10:30). Nonexistent spring 02:xx is skipped.
        """
        note = ""
        if zone_mode == cls.MANUAL:
            offset = manual_offset
        elif zone_mode == cls.ADELAIDE:
            day = local_dt.date()
            clock = local_dt.time()
            oct_sunday = cls._first_sunday(day.year, 10)
            apr_sunday = cls._first_sunday(day.year, 4)
            if day == oct_sunday and datetime.time(2) <= clock < datetime.time(3):
                return None, None, "Nonexistent Adelaide local time (DST spring-forward)"
            if day == apr_sunday and datetime.time(2) <= clock < datetime.time(3):
                note = "Repeated Adelaide local hour; using first (daylight) occurrence"
            if apr_sunday < day < oct_sunday:
                offset = 9.5
            elif day < apr_sunday or day > oct_sunday:
                offset = 10.5
            elif day == apr_sunday:
                offset = 10.5 if clock < datetime.time(3) else 9.5
            else:  # October DST start
                offset = 9.5 if clock < datetime.time(2) else 10.5
        else:
            raise ValueError("Unknown time zone mode: {}".format(zone_mode))
        return local_dt - datetime.timedelta(hours=offset), offset, note

    @classmethod
    def _scheduled_datetimes(cls, first, mode, interval, capture_count,
                             end_date, daily_window_end, day_step):
        if interval < 1 or interval > 10080:
            raise ValueError("Capture interval must be between 1 and 10080 minutes.")
        if mode == cls.FIXED:
            if not (1 <= capture_count <= cls.MAX_CAPTURES):
                raise ValueError("Capture count must be 1 to {}.".format(cls.MAX_CAPTURES))
            return [first + datetime.timedelta(minutes=i * interval) for i in range(capture_count)]
        if mode != cls.DAILY:
            raise ValueError("Unknown schedule type: {}".format(mode))
        if day_step < 1 or day_step > 365:
            raise ValueError("Repeat days must be between 1 and 365.")
        if end_date < first.date():
            raise ValueError("Daily end date must be on or after start date.")
        start_min = first.hour * 60 + first.minute
        if daily_window_end < start_min:
            raise ValueError("Daily end time must not precede daily start time.")
        offsets = list(range(start_min, daily_window_end + 1, interval))
        if not offsets:
            raise ValueError("Daily window has no captures.")
        days = (end_date - first.date()).days // day_step + 1
        if len(offsets) * days > cls.MAX_CAPTURES:
            raise ValueError("The daily schedule exceeds {} captures; increase the "
                             "time interval/day step or shorten the date range.".format(cls.MAX_CAPTURES))
        out = []
        for i in range(days):
            date = first.date() + datetime.timedelta(days=i * day_step)
            for minute in offsets:
                out.append(datetime.datetime.combine(date, datetime.time.min) +
                           datetime.timedelta(minutes=minute))
        return out

    @staticmethod
    def _run_name(label, local_start, interval, schedule):
        if label.strip():
            name = re.sub(r"[^A-Za-z0-9_-]+", "_", label.strip()).strip("_-")
            if not name:
                raise ValueError("Run name must contain letters or numbers.")
            return name[:70]
        token = "daily" if schedule == LiDARShadowBatch.DAILY else "fixed"
        return "ShadowBatch_{}_{}m_{}".format(local_start.strftime("%Y%m%d_%H%M"), interval, token)

    def updateParameters(self, parameters):
        p = parameters
        mode = self._text(p[self.MODE]) or MODES[1]
        las_mode, dsm_mode, dtm_mode = (mode == MODES[i] for i in range(3))
        p[self.LAS].enabled = las_mode
        p[self.DSM].enabled = dsm_mode
        p[self.DTM].enabled = dsm_mode or dtm_mode
        p[self.CELL].enabled = las_mode
        p[self.HEIGHT].enabled = not dtm_mode
        daily = self._text(p[self.SCHEDULE]) == self.DAILY
        p[self.CAPTURES].enabled = not daily
        for i in (self.END_DATE, self.WINDOW_END, self.DAY_STEP):
            p[i].enabled = daily
        p[self.TZ_OFFSET].enabled = self._text(p[self.TZ_MODE]) == self.MANUAL
        save = self._bool(p[self.SAVE_CAPTURES])
        p[self.EXISTING].enabled = save
        p[self.OUTPUT_FORMAT].enabled = save or self._bool(p[self.AGGREGATES])

    def updateMessages(self, parameters):
        p = parameters
        mode = self._text(p[self.MODE]) or MODES[1]
        if mode == MODES[0]:
            if not self._text(p[self.LAS]):
                p[self.LAS].setErrorMessage("Select LAS (.las/.laz/.zlas/.lasd).")
            elif os.path.splitext(self._text(p[self.LAS]))[1].lower() not in (".lasd", ".las", ".laz", ".zlas"):
                p[self.LAS].setErrorMessage("Unsupported LAS extension.")
        elif mode == MODES[1]:
            if not self._text(p[self.DSM]):
                p[self.DSM].setErrorMessage("A DSM raster is required.")
            try:
                threshold = float(self._text(p[self.HEIGHT]) or 0)
            except ValueError:
                threshold = 0  # ArcGIS validates numeric entry as it is typed.
            if threshold > 0 and not self._text(p[self.DTM]):
                p[self.DTM].setErrorMessage("Height filtering requires a DTM.")
        elif mode == MODES[2] and not self._text(p[self.DTM]):
            p[self.DTM].setErrorMessage("A DTM raster is required.")
        for i in (self.TIME, self.WINDOW_END):
            if i == self.WINDOW_END and self._text(p[self.SCHEDULE]) != self.DAILY:
                continue
            try:
                self._time_minutes(self._text(p[i]))
            except ValueError:
                p[i].setErrorMessage("Enter time as HH:MM, 24-hour clock.")
        if not self._text(p[self.OUTPUT_FOLDER]):
            p[self.OUTPUT_FOLDER].setErrorMessage("Select an existing parent output folder.")
        if not self._bool(p[self.SAVE_CAPTURES]) and not self._bool(p[self.AGGREGATES]):
            p[self.AGGREGATES].setErrorMessage("Enable capture outputs, aggregates, or both.")
        try:
            first = datetime.datetime.combine(self._date(p[self.DATE].value), datetime.time.min)
            first += datetime.timedelta(minutes=self._time_minutes(self._text(p[self.TIME])))
            current_schedule = self._text(p[self.SCHEDULE]) or self.FIXED
            end_date = (self._date(p[self.END_DATE].value)
                        if current_schedule == self.DAILY else first.date())
            end_minute = (self._time_minutes(self._text(p[self.WINDOW_END]) or "17:30")
                          if current_schedule == self.DAILY else 0)
            schedule = self._scheduled_datetimes(
                first, current_schedule,
                int(self._text(p[self.INTERVAL]) or 30), int(self._text(p[self.CAPTURES]) or 20),
                end_date, end_minute, int(self._text(p[self.DAY_STEP]) or 1))
            if len(schedule) >= 500:
                p[self.INTERVAL].setWarningMessage(
                    "This schedule will run {} shadow calculations; start with a small test area.".format(len(schedule)))
        except (ValueError, TypeError, OverflowError) as exc:
            if self._text(p[self.DATE]) and self._text(p[self.TIME]):
                p[self.SCHEDULE].setErrorMessage(str(exc))

    def isLicensed(self):
        # Preview mode requires no Spatial Analyst licence. Validate on execution.
        return True

    @staticmethod
    def _raster_name(basename, workspace, fmt):
        return os.path.join(workspace, basename + (".tif" if fmt == LiDARShadowBatch.TIFF else ""))

    @staticmethod
    def _write_manifest(writer, stream, number, local, utc, offset, az, alt,
                        status, path, note="", elapsed=0):
        writer.writerow({
            "capture": number,
            "local_datetime": local.isoformat(sep=" ", timespec="minutes"),
            "utc_datetime": utc.isoformat(sep=" ", timespec="minutes") if utc else "",
            "utc_offset_hours": offset if offset is not None else "",
            "solar_azimuth_deg": "{:.3f}".format(az) if az is not None else "",
            "solar_altitude_deg": "{:.3f}".format(alt) if alt is not None else "",
            "status": status,
            "raster_path": path or "",
            "note": note,
            "elapsed_seconds": "{:.2f}".format(elapsed),
        })
        stream.flush()  # keep the log readable if a long run is interrupted

    def execute(self, parameters, messages):
        p = parameters
        txt = lambda key: self._text(p[key])
        mode = txt(self.MODE) or MODES[1]
        las, in_dsm, in_dtm = txt(self.LAS), txt(self.DSM), txt(self.DTM)
        cell_size = float(txt(self.CELL) or 1)
        height = 0.0 if mode == MODES[2] else float(txt(self.HEIGHT) or 0)
        first_date = self._date(p[self.DATE].value)
        first = datetime.datetime.combine(first_date, datetime.time.min) + datetime.timedelta(
            minutes=self._time_minutes(txt(self.TIME)))
        schedule_mode = txt(self.SCHEDULE) or self.FIXED
        interval = int(txt(self.INTERVAL) or 30)
        number = int(txt(self.CAPTURES) or 20)
        last_date = (self._date(p[self.END_DATE].value)
                     if schedule_mode == self.DAILY else first_date)
        last_minute = (self._time_minutes(txt(self.WINDOW_END) or "17:30")
                       if schedule_mode == self.DAILY else 0)
        day_step = int(txt(self.DAY_STEP) or 1)
        tz_mode = txt(self.TZ_MODE) or self.ADELAIDE
        utc_offset = float(txt(self.TZ_OFFSET) or 0)
        min_sun = float(txt(self.SUN_LIMIT) or 0)
        folder = txt(self.OUTPUT_FOLDER)
        fmt = txt(self.OUTPUT_FORMAT) or self.TIFF
        keep = self._bool(p[self.SAVE_CAPTURES])
        aggregate = self._bool(p[self.AGGREGATES])
        policy = txt(self.EXISTING) or self.POLICIES[0]
        proceed_on_error = self._bool(p[self.CONTINUE])
        preview = self._bool(p[self.PREVIEW])

        if mode not in MODES or tz_mode not in (self.ADELAIDE, self.MANUAL) or fmt not in (self.TIFF, self.GDB):
            raise ValueError("Invalid mode, time zone or output format.")
        if not folder or not os.path.isdir(folder):
            raise ValueError("Select a parent output folder that already exists.")
        if height < 0 or not -90 <= min_sun <= 90:
            raise ValueError("Object-height or solar-altitude parameter is out of range.")
        if not keep and not aggregate:
            raise ValueError("Select 'Keep every shadow capture' or 'Create aggregates'.")
        if mode == MODES[0] and (not las or cell_size <= 0):
            raise ValueError("LAS source and positive LAS raster cell size required.")
        if mode == MODES[1] and (not in_dsm or (height > 0 and not in_dtm)):
            raise ValueError("DSM source required; a DTM is also required for height filtering.")
        if mode == MODES[2] and not in_dtm:
            raise ValueError("A DTM is required in terrain-only mode.")
        if policy not in self.POLICIES:
            raise ValueError("Unknown existing-capture handling option.")

        dates = self._scheduled_datetimes(first, schedule_mode, interval, number,
                                          last_date, last_minute, day_step)
        run_name = self._run_name(txt(self.RUN_LABEL), first, interval, schedule_mode)
        run_dir = os.path.join(folder, run_name)
        arcpy.AddMessage("Schedule: {} captures; {} through {} (local)".format(
            len(dates), dates[0].isoformat(sep=" ", timespec="minutes"),
            dates[-1].isoformat(sep=" ", timespec="minutes")))
        arcpy.AddMessage("Run folder: {}".format(run_dir))
        if schedule_mode == self.DAILY:
            arcpy.AddMessage("Daily window: {} - {}; every {} day(s).".format(
                txt(self.TIME), txt(self.WINDOW_END), day_step))
        arcpy.AddMessage("Local time: {}; skip solar altitude below {:.1f} degrees.".format(tz_mode, min_sun))
        if preview:
            for i, local_dt in enumerate(dates[:min(12, len(dates))], 1):
                utc, off, note = self._local_to_utc(local_dt, tz_mode, utc_offset)
                arcpy.AddMessage("  {:4}  {}  -> UTC {}{}".format(
                    i, local_dt.isoformat(sep=" ", timespec="minutes"),
                    utc.isoformat(sep=" ", timespec="minutes") if utc else "SKIP",
                    " ({})".format(note) if note else ""))
            if len(dates) > 12:
                arcpy.AddMessage("... {} more scheduled captures.".format(len(dates) - 12))
            arcpy.AddMessage("PREVIEW ONLY: No folders, rasters or logs created.")
            return

        ext = arcpy.CheckExtension("Spatial")
        if ext not in ("Available", "CheckedOut"):
            raise RuntimeError("Spatial Analyst extension is unavailable.")
        sgdb, sfolder = arcpy.env.scratchGDB, arcpy.env.scratchFolder
        if not sgdb or not sfolder:
            raise RuntimeError("ArcGIS scratch geodatabase and scratch folder are required.")
        if getattr(arcpy.env, "mask", None):
            arcpy.AddWarning("A geoprocessing Mask is set. Batch tool will clear it to avoid truncating shadow-casting surfaces.")
        if getattr(arcpy.env, "extent", None):
            arcpy.AddWarning("Processing Extent is overridden to the input surface extent so shadows are not cropped.")

        # A stable run folder and settings manifest allow a partially completed
        # batch to be resumed without mixing snapshots made from other sources.
        identity = {
            "version": 1, "source_mode": mode,
            "las": os.path.normcase(os.path.abspath(las)) if las else "",
            "dsm": os.path.normcase(os.path.abspath(in_dsm)) if in_dsm else "",
            "dtm": os.path.normcase(os.path.abspath(in_dtm)) if in_dtm else "",
            "cell_size_m": cell_size, "min_height_m": height,
            "start_local": first.isoformat(), "schedule_mode": schedule_mode,
            "interval_minutes": interval,
            "daily_start_minutes": first.hour * 60 + first.minute,
            "daily_end_minutes": last_minute if schedule_mode == self.DAILY else None,
            "every_n_days": day_step if schedule_mode == self.DAILY else None,
            "zone_mode": tz_mode, "fixed_utc_offset": utc_offset if tz_mode == self.MANUAL else None,
            "minimum_solar_altitude": min_sun, "format": fmt,
        }
        os.makedirs(run_dir, exist_ok=True)
        settings_path = os.path.join(run_dir, "batch_settings.json")
        if os.path.exists(settings_path):
            with open(settings_path, "r", encoding="utf-8") as inp:
                old = json.load(inp)
            if old != identity:
                raise RuntimeError(
                    "This run folder contains captures with different analysis settings. "
                    "Provide a new run label/output folder to avoid mixing results.")
        # For a new run, save its identity only after verifying elevation inputs.
        # An invalid DSM/DTM should not leave a config that prevents correcting it.

        captures_dir = os.path.join(run_dir, "captures")
        if keep and fmt == self.TIFF:
            os.makedirs(captures_dir, exist_ok=True)
        elif keep and fmt == self.GDB:
            captures_dir = os.path.join(run_dir, "captures.gdb")
            if not arcpy.Exists(captures_dir):
                arcpy.management.CreateFileGDB(run_dir, "captures.gdb")
        aggregate_dir = os.path.join(run_dir, "aggregates")
        if aggregate:
            if fmt == self.TIFF:
                os.makedirs(aggregate_dir, exist_ok=True)
            else:
                aggregate_dir = os.path.join(run_dir, "aggregates.gdb")
                if not arcpy.Exists(aggregate_dir):
                    arcpy.management.CreateFileGDB(run_dir, "aggregates.gdb")

        fields = ["capture", "local_datetime", "utc_datetime", "utc_offset_hours",
                  "solar_azimuth_deg", "solar_altitude_deg", "status", "raster_path",
                  "note", "elapsed_seconds"]
        manifest = os.path.join(run_dir, "captures_manifest.csv")
        new_manifest = not os.path.exists(manifest) or os.path.getsize(manifest) == 0
        uid = uuid.uuid4().hex[:10]
        temporary = []
        las_layers = []
        checked_out = False
        accumulator = None
        aggregated_count = 0
        counts = {"created": 0, "reused": 0, "filtered": 0, "invalid_time": 0, "failed": 0}
        try:
            if ext == "Available":
                arcpy.CheckOutExtension("Spatial")
                checked_out = True
            with arcpy.EnvManager(overwriteOutput=True):
                dsm_path, dtm_path = in_dsm, in_dtm
                if mode == MODES[0]:
                    src = las
                    if os.path.splitext(las)[1].lower() != ".lasd":
                        if os.path.splitext(las)[1].lower() not in (".las", ".laz", ".zlas"):
                            raise ValueError("LAS input must end with .lasd, .las, .laz or .zlas")
                        src = os.path.join(sfolder, "batch_src_{}.lasd".format(uid))
                        temporary.append(src)
                        arcpy.management.CreateLasDataset(las, src)
                    dsm_path = os.path.join(run_dir, "SourceDSM.tif")
                    if not arcpy.Exists(dsm_path):
                        las_first = "batch_first_{}".format(uid)
                        las_layers.append(las_first)
                        arcpy.management.MakeLasDatasetLayer(src, las_first, return_values=["1"])
                        arcpy.AddMessage("Generating the DSM once from LAS first returns...")
                        arcpy.conversion.LasDatasetToRaster(
                            las_first, dsm_path, "ELEVATION", "BINNING MAXIMUM LINEAR",
                            "FLOAT", "CELLSIZE", cell_size, 1.0)
                    else:
                        arcpy.AddMessage("Reusing existing SourceDSM.tif from this run.")
                    dtm_path = ""
                    if height > 0:
                        dtm_path = os.path.join(run_dir, "SourceDTM.tif")
                        if not arcpy.Exists(dtm_path):
                            ground = "batch_ground_{}".format(uid)
                            las_layers.append(ground)
                            arcpy.management.MakeLasDatasetLayer(src, ground, class_code=[2])
                            arcpy.AddMessage("Generating DTM once from ground-class LAS returns...")
                            with arcpy.EnvManager(snapRaster=dsm_path, cellSize=dsm_path):
                                arcpy.conversion.LasDatasetToRaster(
                                    ground, dtm_path, "ELEVATION", "BINNING AVERAGE LINEAR",
                                    "FLOAT", "CELLSIZE", cell_size, 1.0)
                        else:
                            arcpy.AddMessage("Reusing existing SourceDTM.tif from this run.")
                elif mode == MODES[2]:
                    dsm_path, dtm_path = in_dtm, ""
                    arcpy.AddWarning("Terrain-only batch: no building or tree shadows are represented.")
                surface_desc = self._check_surface(dsm_path, "Elevation surface")
                if dtm_path and height > 0:
                    dtm_desc = self._check_surface(dtm_path, "DTM")
                    if not self._same_grid(surface_desc, dtm_desc):
                        raise ValueError("DSM and DTM must share projection, cell size and grid alignment.")
                if not os.path.exists(settings_path):
                    with open(settings_path, "w", encoding="utf-8") as out:
                        json.dump(identity, out, indent=2)
                extent = surface_desc.extent
                sr = surface_desc.spatialReference
                central = arcpy.PointGeometry(arcpy.Point(
                    (extent.XMin + extent.XMax) / 2,
                    (extent.YMin + extent.YMax) / 2), sr).projectAs(
                        arcpy.SpatialReference(4326)).centroid
                lat, lon = central.Y, central.X
                arcpy.AddMessage("Solar calculations use raster centre: {:.6f}, {:.6f}".format(lat, lon))
                arcpy.AddWarning("Hillshade gives approximate surface/terrain shadows; use the same grid and valid metre-based vertical values.")

                # Force full source extent and an unmasked surface so structures
                # outside a requested AOI can cast shadows into it.
                with arcpy.EnvManager(snapRaster=dsm_path, cellSize=dsm_path,
                                      extent=extent, mask=None):
                    surface = Raster(dsm_path)
                    if height > 0:
                        ground = Raster(dtm_path)
                        prepared_path = os.path.join(sgdb, "_bsurface_{}".format(uid))
                        temporary.append(prepared_path)
                        # Materialise filtered DSM ONCE. Re-evaluating map algebra
                        # for every capture is prohibitively expensive in a batch.
                        Con(IsNull(ground), surface,
                            Con(surface - ground >= height, surface, ground)).save(prepared_path)
                        surface = Raster(prepared_path)
                        arcpy.AddMessage("Prepared object-height-filtered surface once for the entire batch.")
                    with open(manifest, "a", newline="", encoding="utf-8-sig" if new_manifest else "utf-8") as stream:
                        writer = csv.DictWriter(stream, fieldnames=fields)
                        if new_manifest:
                            writer.writeheader()
                            stream.flush()
                        arcpy.SetProgressor("step", "Calculating scheduled shadow snapshots", 0, len(dates), 1)
                        try:
                            for capture_id, local in enumerate(dates, 1):
                                started = time.perf_counter()
                                utc, off, note = self._local_to_utc(local, tz_mode, utc_offset)
                                az = alt = None
                                dest = ""
                                status = ""
                                try:
                                    if utc is None:
                                        status = "invalid_time"
                                    else:
                                        az, alt = self.sun_position(lat, lon, utc)
                                        if alt < min_sun:
                                            status = "filtered"
                                            note = "Solar altitude {:.2f} is below limit {:.2f}".format(alt, min_sun)
                                        else:
                                            basename = "Shadow_{}".format(local.strftime("%Y%m%d_%H%M"))
                                            if keep:
                                                dest = self._raster_name(basename, captures_dir, fmt)
                                                if arcpy.Exists(dest):
                                                    if policy == "Skip existing":
                                                        status = "reused"
                                                    elif policy == "Stop if existing":
                                                        raise FileExistsError("Capture already exists: {}".format(dest))
                                                    else:
                                                        arcpy.management.Delete(dest)
                                            else:
                                                dest = os.path.join(sgdb, "_bsh_{}_{}".format(uid, capture_id))
                                                temporary.append(dest)
                                            if not status:
                                                shadow = self._binary_shadow(surface, az, alt)
                                                shadow.save(dest)
                                                status = "created"
                                            if aggregate:
                                                # Stream the accumulation; only one working sum
                                                # is retained even for thousands of captures.
                                                next_sum = os.path.join(
                                                    sgdb, "_bsum_{}_{}".format(uid, capture_id))
                                                temporary.append(next_sum)
                                                expression = (Raster(dest) if accumulator is None
                                                              else Raster(accumulator) + Raster(dest))
                                                expression.save(next_sum)
                                                if accumulator is not None:
                                                    arcpy.management.Delete(accumulator)
                                                    temporary.remove(accumulator)
                                                accumulator = next_sum
                                                aggregated_count += 1
                                                if not keep:
                                                    arcpy.management.Delete(dest)
                                                    temporary.remove(dest)
                                    counts[status] += 1
                                    if status in ("created", "reused"):
                                        arcpy.AddMessage("{}/{} {} | az {:.1f} alt {:.1f} | {}".format(
                                            capture_id, len(dates), local.strftime("%Y-%m-%d %H:%M"),
                                            az, alt, status))
                                except Exception as exc:
                                    status = "failed"
                                    note = str(exc)
                                    counts["failed"] += 1
                                    arcpy.AddWarning("Capture {}/{} failed: {}".format(capture_id, len(dates), note))
                                    if not proceed_on_error or isinstance(exc, FileExistsError):
                                        self._write_manifest(writer, stream, capture_id, local, utc, off, az, alt,
                                                             status, dest, note, time.perf_counter() - started)
                                        raise
                                self._write_manifest(writer, stream, capture_id, local, utc, off, az, alt,
                                                     status, dest, note, time.perf_counter() - started)
                                arcpy.SetProgressorPosition()
                        finally:
                            arcpy.ResetProgressor()

                    if aggregate and aggregated_count:
                        arcpy.AddMessage("Finalising aggregate rasters from {} captures...".format(aggregated_count))
                        sum_raster = Raster(accumulator)
                        output_specs = {
                            "Shadow_capture_count": sum_raster,
                            "Shadow_frequency_percent": sum_raster * (100.0 / aggregated_count),
                            "Shadow_sampled_hours": sum_raster * (interval / 60.0),
                            "Sunlight_sampled_hours": (float(aggregated_count) - sum_raster) * (interval / 60.0),
                        }
                        for name, data in output_specs.items():
                            path = self._raster_name(name, aggregate_dir, fmt)
                            if arcpy.Exists(path):
                                arcpy.management.Delete(path)
                            data.save(path)
                            arcpy.AddMessage("Aggregate saved: {}".format(path))
                        arcpy.AddWarning(
                            "Sampled hours = number of valid daylight captures x interval hours. "
                            "These are approximations, not continuous time-integrated exposure.")
                    elif aggregate:
                        arcpy.AddWarning("No qualifying snapshots; no aggregate rasters could be calculated.")

            summary = {
                "run_folder": run_dir, "planned": len(dates),
                "counts": counts, "aggregate_daylight_captures": aggregated_count,
                "interval_minutes": interval, "aggregate_written": bool(aggregate and aggregated_count),
                "finished_at_local_system_time": datetime.datetime.now().isoformat(timespec="seconds"),
            }
            with open(os.path.join(run_dir, "batch_summary.json"), "w", encoding="utf-8") as f:
                json.dump(summary, f, indent=2)
            arcpy.AddMessage("BATCH COMPLETE | {}".format(
                ", ".join("{}={}".format(key, value) for key, value in counts.items())))
            arcpy.AddMessage("CSV manifest: {}".format(manifest))
        finally:
            for lyr in reversed(las_layers):
                try:
                    if arcpy.Exists(lyr):
                        arcpy.management.Delete(lyr)
                except Exception:
                    pass
            for item in reversed(temporary):
                try:
                    if arcpy.Exists(item):
                        arcpy.management.Delete(item)
                except Exception:
                    pass
            if checked_out:
                try:
                    arcpy.CheckInExtension("Spatial")
                except Exception:
                    pass


class ShadowWebMapExport(LiDARShadowAnalyzer):
    """Render binary shadow captures into browser-ready georeferenced image tiles.

    All exported pixels retain their original raster grid geometry. JGW/PGW/WLD
    companions support desktop GIS use; the manifest holds WGS84 corners needed
    for MapLibre image sources. Export tiles from NumPy blocks, never entire DSM.
    """

    BATCH_FOLDER = 0
    SINGLE = 1
    SINGLE_DATE = 2
    OUTPUT_FOLDER = 3
    EXPORT_NAME = 4
    IMAGE_FORMAT = 5
    QUALITY = 6
    TILE_SIZE = 7
    DOWNSAMPLE = 8
    EVERY_N = 9
    SHADOW_COLOR = 10
    SHADOW_ALPHA = 11
    RESUME = 12
    CONTINUE = 13

    WEBP = "WebP (transparent, compact)"
    PNG = "PNG (transparent, lossless)"
    JPG = "JPEG (opaque, compact)"
    FORMATS = (WEBP, PNG, JPG)

    def __init__(self):
        self.label = "Export Shadow Images for MapLibre (World Files + Manifest)"
        self.description = (
            "Export georeferenced image tiles from a Shadow Batch run or a single "
            "binary shadow raster. Each image receives its own world file. A "
            "JSON manifest supplies MapLibre WGS84 corner coordinates and times. "
            "Transparent WebP/PNG is recommended; JPEG is available but opaque. "
            "Supports downsampling, tiled large rasters, and safe resume. "
            "Uses NumPy and Pillow already supplied with standard ArcGIS Pro Python."
        )
        self.canRunInBackground = False

    def getParameterInfo(self):
        make = self._param
        batch = make("batch_run_folder", "Shadow Batch run folder (contains captures_manifest.csv)", "DEFolder")
        single = make("single_shadow_raster", "OR one binary shadow raster (1=shade, 0=sun)", "GPRasterLayer")
        dt = make("single_capture_time", "Single-raster timestamp (local)", "GPDate")
        dt.value = datetime.datetime.now()
        folder = make("export_parent_folder", "Existing export parent folder", "DEFolder", "Required")
        label = make("export_name", "Export subfolder name (blank = source name)", "GPString")
        fmt = make("image_format", "Image format", "GPString", "Required")
        fmt.filter.type = "ValueList"
        fmt.filter.list = list(self.FORMATS)
        fmt.value = self.WEBP
        quality = make("compression_quality", "WebP/JPEG quality (1-100)", "GPLong")
        quality.value = 83
        quality.filter.type = "Range"
        quality.filter.list = [1, 100]
        tile = make("tile_pixels", "Tile edge (output pixels)", "GPLong")
        tile.filter.type = "ValueList"
        tile.filter.list = [512, 1024, 2048, 4096]
        tile.value = 2048
        scale = make("downsample_factor", "Pixel downsample factor (1 = full native resolution)", "GPLong")
        scale.filter.type = "ValueList"
        scale.filter.list = [1, 2, 4, 8]
        scale.value = 1
        every = make("every_nth_capture", "Export every Nth successful capture", "GPLong")
        every.value = 1
        every.filter.type = "Range"
        every.filter.list = [1, 1000]
        color = make("shade_hex_color", "Shadow colour (hex, e.g. #182b4a)", "GPString")
        color.value = "#15263F"
        alpha = make("shade_alpha", "Shadow opacity baked into transparent image (0-255)", "GPLong")
        alpha.value = 185
        alpha.filter.type = "Range"
        alpha.filter.list = [0, 255]
        resume = make("skip_existing_tiles", "Reuse existing images (resume export)", "GPBoolean")
        resume.value = True
        proceed = make("continue_on_error", "Continue after individual image failures", "GPBoolean")
        proceed.value = False
        params = [batch, single, dt, folder, label, fmt, quality, tile, scale, every,
                  color, alpha, resume, proceed]
        self.updateParameters(params)
        return params

    def isLicensed(self):
        # Raster-to-array does not require a Spatial Analyst checkout.
        return True

    def updateParameters(self, parameters):
        p = parameters
        has_batch = bool(self._text(p[self.BATCH_FOLDER]))
        has_single = bool(self._text(p[self.SINGLE]))
        p[self.SINGLE].enabled = not has_batch
        p[self.BATCH_FOLDER].enabled = not has_single
        p[self.SINGLE_DATE].enabled = not has_batch
        p[self.EVERY_N].enabled = not has_single
        p[self.SHADOW_ALPHA].enabled = self._text(p[self.IMAGE_FORMAT]) != self.JPG
        p[self.QUALITY].enabled = self._text(p[self.IMAGE_FORMAT]) != self.PNG

    def updateMessages(self, parameters):
        p = parameters
        a = self._text(p[self.BATCH_FOLDER])
        b = self._text(p[self.SINGLE])
        if not a and not b:
            p[self.BATCH_FOLDER].setErrorMessage("Choose a completed Shadow Batch run or a single shadow raster.")
        if a and b:
            p[self.BATCH_FOLDER].setErrorMessage("Choose only one input source.")
        if a and not os.path.isfile(os.path.join(a, "captures_manifest.csv")):
            p[self.BATCH_FOLDER].setErrorMessage("The folder must contain captures_manifest.csv.")
        folder = self._text(p[self.OUTPUT_FOLDER])
        if not folder or not os.path.isdir(folder):
            p[self.OUTPUT_FOLDER].setErrorMessage("Select an existing export parent folder.")
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", self._text(p[self.SHADOW_COLOR])):
            p[self.SHADOW_COLOR].setErrorMessage("Use a six-digit hex colour, e.g. #15263F.")

    @staticmethod
    def _safe_filename(text_value):
        text_value = re.sub(r"[^A-Za-z0-9_-]+", "_", str(text_value).strip()).strip("_-")
        return (text_value or "ShadowExports")[:96]

    @staticmethod
    def _decode_date(dt_value):
        if isinstance(dt_value, datetime.datetime):
            return dt_value.replace(tzinfo=None)
        value = str(dt_value or "").strip()
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%d/%m/%Y %I:%M:%S %p",
                    "%d/%m/%Y %H:%M:%S", "%Y-%m-%d"):
            try:
                return datetime.datetime.strptime(value, fmt)
            except ValueError:
                pass
        return datetime.datetime.fromisoformat(value).replace(tzinfo=None)

    @staticmethod
    def _load_batch_frames(run_folder):
        """Select most recent manifest record per local time; ignore filtered failures."""
        manifest_path = os.path.join(run_folder, "captures_manifest.csv")
        if not os.path.isfile(manifest_path):
            raise ValueError("Batch folder has no captures_manifest.csv: {}".format(run_folder))
        last = {}
        with open(manifest_path, encoding="utf-8-sig", newline="") as stream:
            for row in csv.DictReader(stream):
                dt = (row.get("local_datetime") or "").strip()
                if dt:
                    last[dt] = row
        results = []
        for timestamp, row in sorted(last.items()):
            if row.get("status") not in ("created", "reused"):
                continue
            path = (row.get("raster_path") or "").strip()
            if not path or not arcpy.Exists(path):
                base = "Shadow_{}".format(
                    datetime.datetime.fromisoformat(timestamp.replace(" ", "T")).strftime("%Y%m%d_%H%M"))
                candidates = [os.path.join(run_folder, "captures", base + ".tif"),
                              os.path.join(run_folder, "captures.gdb", base)]
                path = next((p for p in candidates if arcpy.Exists(p)), "")
            if not path:
                arcpy.AddWarning("Missing capture, omitted from export: {}".format(timestamp))
                continue
            results.append({
                "local_datetime": datetime.datetime.fromisoformat(timestamp.replace(" ", "T")),
                "utc_datetime": (row.get("utc_datetime") or "").strip().replace(" ", "T"),
                "utc_offset_hours": row.get("utc_offset_hours") or "",
                "solar_azimuth_deg": row.get("solar_azimuth_deg") or "",
                "solar_altitude_deg": row.get("solar_altitude_deg") or "",
                "raster": path,
            })
        return results

    @staticmethod
    def _geo_corners(sr, x_left, x_right, y_bottom, y_top):
        wgs84 = arcpy.SpatialReference(4326)
        output = []
        for x, y in ((x_left, y_top), (x_right, y_top),
                     (x_right, y_bottom), (x_left, y_bottom)):
            pt = arcpy.PointGeometry(arcpy.Point(x, y), sr).projectAs(wgs84).centroid
            output.append([round(float(pt.X), 9), round(float(pt.Y), 9)])
        return output

    @staticmethod
    def _write_worldfile(path, xleft, ytop, dx, dy):
        extension = os.path.splitext(path)[1].lower()
        world = os.path.splitext(path)[0] + {
            ".jpg": ".jgw", ".png": ".pgw", ".webp": ".wld"}[extension]
        with open(world, "w", encoding="ascii", newline="\n") as out:
            out.write("{:.12f}\n0.0\n0.0\n{:.12f}\n{:.12f}\n{:.12f}\n".format(
                dx, -dy, xleft + dx / 2.0, ytop - dy / 2.0))
        return world

    @staticmethod
    def _save_tile(image_path, numpy_array, fmt, quality, alpha, rgb):
        import numpy as np
        from PIL import Image
        # Source is a binary 1/0 shadow raster. 255 represents source NoData.
        shade = (numpy_array >= 0.5) & (numpy_array < 1.5)
        lit = (numpy_array >= -0.5) & (numpy_array < 0.5)
        valid = shade | lit
        if fmt == ShadowWebMapExport.JPG:
            pixels = np.full(numpy_array.shape, 246, dtype=np.uint8)
            pixels[shade] = 25
            image = Image.fromarray(pixels, mode="L")
            image.save(image_path, format="JPEG", quality=quality, optimize=True, subsampling=0)
        else:
            pixels = np.empty(numpy_array.shape + (4,), dtype=np.uint8)
            pixels[:, :, 0] = rgb[0]
            pixels[:, :, 1] = rgb[1]
            pixels[:, :, 2] = rgb[2]
            pixels[:, :, 3] = np.where(shade, alpha, 0).astype(np.uint8)
            # NoData and lit cells are transparent, preserving the basemap.
            pixels[:, :, 3][~valid] = 0
            image = Image.fromarray(pixels, mode="RGBA")
            if fmt == ShadowWebMapExport.WEBP:
                image.save(image_path, format="WEBP", quality=quality, method=4)
            else:
                image.save(image_path, format="PNG", optimize=True, compress_level=6)

    def execute(self, parameters, messages):
        p = parameters
        txt = lambda i: self._text(p[i])
        batch = txt(self.BATCH_FOLDER)
        single = txt(self.SINGLE)
        root = txt(self.OUTPUT_FOLDER)
        name = txt(self.EXPORT_NAME)
        fmt = txt(self.IMAGE_FORMAT) or self.WEBP
        quality = int(txt(self.QUALITY) or 83)
        tile_px = int(txt(self.TILE_SIZE) or 2048)
        downsample = int(txt(self.DOWNSAMPLE) or 1)
        every = int(txt(self.EVERY_N) or 1)
        alpha = int(txt(self.SHADOW_ALPHA) or 0)
        color = txt(self.SHADOW_COLOR) or "#15263F"
        reuse = LiDARShadowBatch._bool(p[self.RESUME])
        proceed = LiDARShadowBatch._bool(p[self.CONTINUE])
        if bool(batch) == bool(single):
            raise ValueError("Select either a batch folder OR one raster.")
        if not os.path.isdir(root):
            raise ValueError("The export parent folder must exist.")
        if fmt not in self.FORMATS or tile_px not in (512, 1024, 2048, 4096) or downsample not in (1, 2, 4, 8):
            raise ValueError("Invalid image format or tile/downsample setting.")
        if not 1 <= quality <= 100 or not 0 <= alpha <= 255 or not 1 <= every <= 1000:
            raise ValueError("Quality, opacity or frame-sampling setting out of range.")
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            raise ValueError("Shadow colour must be six-digit #RRGGBB.")
        try:
            import numpy as np  # noqa: F401
            from PIL import Image  # noqa: F401
        except ImportError as exc:
            raise RuntimeError("Export requires NumPy and Pillow, included in the normal ArcGIS Pro 'arcgispro-py3' environment. {}".format(exc))

        if batch:
            records = self._load_batch_frames(batch)
            identity_source = os.path.normcase(os.path.abspath(batch))
            subname = name or (os.path.basename(os.path.normpath(batch)) + "_web")
        else:
            if not arcpy.Exists(single):
                raise ValueError("Selected shadow raster does not exist.")
            dt = self._decode_date(p[self.SINGLE_DATE].value)
            records = [{"local_datetime": dt, "utc_datetime": "", "utc_offset_hours": "",
                        "solar_azimuth_deg": "", "solar_altitude_deg": "", "raster": single}]
            identity_source = os.path.normcase(os.path.abspath(single))
            subname = name or (os.path.splitext(os.path.basename(single))[0] + "_web")
        records = records[::every]
        if not records:
            raise ValueError("There are no successful, existing shadow captures to export.")
        destination = os.path.join(root, self._safe_filename(subname))
        os.makedirs(destination, exist_ok=True)
        exts = {self.WEBP: ".webp", self.PNG: ".png", self.JPG: ".jpg"}
        ext = exts[fmt]
        rgb = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
        identity = {"version": 1, "source": identity_source, "image_format": fmt,
                    "quality": quality, "tile_pixels": tile_px,
                    "downsample": downsample, "every_nth": every,
                    "shadow_color": color, "shadow_alpha": alpha}
        settings = os.path.join(destination, "export_settings.json")
        if os.path.isfile(settings):
            with open(settings, encoding="utf-8") as stream:
                old = json.load(stream)
            if old != identity:
                raise ValueError(
                    "This export subfolder uses different settings. Choose a NEW export "
                    "name, or remove the old export folder before changing settings.")
        else:
            with open(settings, "w", encoding="utf-8") as stream:
                json.dump(identity, stream, indent=2)
        crs_file = "source.prj"
        manifest_path = os.path.join(destination, "shadow_player_manifest.json")
        arcpy.AddMessage("Exporting {} captures to: {}".format(len(records), destination))
        arcpy.AddWarning("Image world files do not encode CRS; source.prj and the JSON WGS84 corners are essential companions.")
        if fmt == self.JPG:
            arcpy.AddWarning("JPEG is opaque: bright pixels will obscure basemap detail. WebP/PNG are recommended for shadow overlays.")
        arcpy.SetProgressor("step", "Writing MapLibre georeferenced images", 0, len(records), 1)
        frames = []
        total_tiles = 0
        total_bytes = 0
        failed = []
        start = time.perf_counter()
        initial_grid = None
        corner_cache = {}
        try:
            for capture_number, rec in enumerate(records, 1):
                raster_name = rec["raster"]
                stamp = rec["local_datetime"].strftime("%Y%m%d_%H%M")
                frame_relative = "frames/{}".format(stamp)
                frame_folder = os.path.join(destination, "frames", stamp)
                os.makedirs(frame_folder, exist_ok=True)
                tiles = []
                try:
                    desc = self._check_surface(raster_name, "Shadow capture")
                    cx, cy = float(desc.meanCellWidth), float(desc.meanCellHeight)
                    width, height = int(desc.width), int(desc.height)
                    bounds = desc.extent
                    sr = desc.spatialReference
                    grid = (width, height, round(cx, 9), round(cy, 9),
                            round(bounds.XMin, 5), round(bounds.YMax, 5), sr.factoryCode)
                    if initial_grid is None:
                        initial_grid = grid
                        with open(os.path.join(destination, crs_file), "w", encoding="utf-8") as stream:
                            stream.write(sr.exportToString())
                    elif grid != initial_grid:
                        raise ValueError("Capture grid differs from first frame; use separate exports for incompatible grids.")
                    row_increment = tile_px * downsample
                    column_increment = tile_px * downsample
                    rows = (height + row_increment - 1) // row_increment
                    cols = (width + column_increment - 1) // column_increment
                    if rows * cols > 750:
                        arcpy.AddWarning("{} image tiles per frame is large; use downsample 2/4 for smoother playback.".format(rows * cols))
                    for row_i in range(rows):
                        row = row_i * row_increment
                        read_rows = min(row_increment, height - row)
                        for col_i in range(cols):
                            col = col_i * column_increment
                            read_cols = min(column_increment, width - col)
                            basename = "tile_r{:03}_c{:03}".format(row_i, col_i)
                            img_path = os.path.join(frame_folder, basename + ext)
                            rel = frame_relative + "/" + basename + ext
                            # Round geographic dimensions to the actual number of exported pixels.
                            tile_w = (read_cols + downsample - 1) // downsample
                            tile_h = (read_rows + downsample - 1) // downsample
                            x_left = bounds.XMin + col * cx
                            y_top = bounds.YMax - row * cy
                            dx, dy = cx * downsample, cy * downsample
                            x_right = x_left + tile_w * dx
                            y_bottom = y_top - tile_h * dy
                            world_path = os.path.splitext(img_path)[0] + {
                                ".jpg": ".jgw", ".png": ".pgw", ".webp": ".wld"}[ext]
                            if not (reuse and os.path.isfile(img_path) and os.path.isfile(world_path)):
                                lower_left = arcpy.Point(x_left, bounds.YMax - (row + read_rows) * cy)
                                matrix = arcpy.RasterToNumPyArray(
                                    raster_name, lower_left_corner=lower_left,
                                    ncols=read_cols, nrows=read_rows,
                                    nodata_to_value=255)
                                if len(matrix.shape) != 2:
                                    raise ValueError("Expected a single-band binary shadow raster: {}".format(raster_name))
                                block = matrix[::downsample, ::downsample]
                                temp_path = img_path + ".writing"
                                try:
                                    self._save_tile(temp_path, block, fmt, quality, alpha, rgb)
                                    os.replace(temp_path, img_path)
                                finally:
                                    if os.path.exists(temp_path):
                                        os.remove(temp_path)
                                self._write_worldfile(img_path, x_left, y_top, dx, dy)
                            # An individual .prj ensures the image + world file can also
                            # be relocated independently into desktop GIS software.
                            projection_path = os.path.splitext(img_path)[0] + ".prj"
                            if not os.path.isfile(projection_path):
                                with open(projection_path, "w", encoding="utf-8") as project:
                                    project.write(sr.exportToString())
                            cache_key = (row_i, col_i)
                            if cache_key not in corner_cache:
                                corner_cache[cache_key] = self._geo_corners(
                                    sr, x_left, x_right, y_bottom, y_top)
                            corners = corner_cache[cache_key]
                            tiles.append({
                                "path": rel, "world_file": frame_relative + "/" + os.path.basename(world_path),
                                "projection_file": frame_relative + "/" + os.path.basename(projection_path),
                                "coordinates": corners, "width": tile_w, "height": tile_h,
                                "row": row_i, "column": col_i,
                            })
                            total_tiles += 1
                            total_bytes += os.path.getsize(img_path)
                    local = rec["local_datetime"]
                    frames.append({
                        "index": len(frames) + 1,
                        "id": stamp,
                        "local_datetime": local.isoformat(timespec="minutes"),
                        "date": local.date().isoformat(),
                        "time": local.strftime("%H:%M"),
                        "utc_datetime": rec["utc_datetime"],
                        "utc_offset_hours": rec["utc_offset_hours"],
                        "solar_azimuth_deg": rec["solar_azimuth_deg"],
                        "solar_altitude_deg": rec["solar_altitude_deg"],
                        "tiles": tiles,
                    })
                    arcpy.AddMessage("{}/{} | {} | {} tiles".format(
                        capture_number, len(records), local.strftime("%Y-%m-%d %H:%M"), len(tiles)))
                except Exception as exc:
                    failed.append({"capture": stamp, "error": str(exc)})
                    arcpy.AddWarning("Export failed for {}: {}".format(stamp, exc))
                    if not proceed:
                        raise
                arcpy.SetProgressorPosition()
        finally:
            arcpy.ResetProgressor()
        if not frames:
            raise RuntimeError("No images exported successfully.")
        manifest = {
            "schema": "uos-shadow-player-v1",
            "title": self._safe_filename(subname).replace("_", " "),
            "generated_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
            "source_kind": "shadow_batch" if batch else "single_raster",
            "source_crs": {"name": sr.name, "wkid": sr.factoryCode, "wkt_file": crs_file},
            "grid": {"columns": initial_grid[0], "rows": initial_grid[1],
                     "native_cell_x": initial_grid[2], "native_cell_y": initial_grid[3]},
            "encoding": {"format": ext.lstrip("."), "quality": quality, "tile_pixels": tile_px,
                         "downsample": downsample, "shadow_color": color, "shadow_alpha": alpha,
                         "binary_values": {"shadow": 1, "sunlight": 0},
                         "transparent_sunlit": fmt != self.JPG},
            "frames": frames,
            "statistics": {"frames": len(frames), "tiles": total_tiles,
                           "compressed_bytes": total_bytes,
                           "failed": failed, "runtime_seconds": round(time.perf_counter() - start, 2)},
        }
        temp_manifest = manifest_path + ".writing"
        with open(temp_manifest, "w", encoding="utf-8") as stream:
            json.dump(manifest, stream, indent=2, ensure_ascii=False)
        os.replace(temp_manifest, manifest_path)
        arcpy.AddMessage("MAPLIBRE EXPORT COMPLETE: {} frames, {} image tiles, {:.1f} MB".format(
            len(frames), total_tiles, total_bytes / 1048576))
        arcpy.AddMessage("MapLibre manifest: {}".format(manifest_path))
        arcpy.AddMessage("In ShadowPlayer, choose 'Open export folder' and select this folder.")
        if failed:
            arcpy.AddWarning("{} frames could not be exported; see manifest statistics.failed.".format(len(failed)))
