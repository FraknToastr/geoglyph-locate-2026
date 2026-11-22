/* Compact real historical sample from the public original report, generated 6 Aug 2026.
   This sample is intentionally not represented as current vehicle positions. */
(function(){'use strict';
const sample=[
['Bus','443','1027','1088008',-34.67835236,138.69503784,302.7,11.7],
['Bus','H30','1034','1029017',-34.9244194,138.60000610,261.77,11.1],
['Bus','168','1036','1134078',-34.92226410,138.60554504,179.31,3.5],
['Bus','106','1037','1133928',-34.91493607,138.63719177,86.36,13.9],
['Bus','H22','1039','1088275',-34.92119598,138.63604736,254.38,0],
['Bus','253','1041','1134539',-34.88822556,138.56962585,353.79,0],
['Bus','118','1046','1156700',-34.91857529,138.57861328,332.18,11],
['Bus','147','1047','1156938',-34.93929672,138.63191223,358.87,0],
['Bus','203B','1048','1174453',-34.83067703,138.64402771,97.54,12.7],
['Bus','202','1061','1174341',-34.88614655,138.61759949,227.08,12.4],
['Bus','206','1066','1092020',-34.88852692,138.61447144,228.07,0],
['Bus','254','1071','1134554',-34.84471893,138.50816345,76.15,0],
['Bus','241','1078','1174619',-34.97982025,138.56942749,266.83,10],
['Tram','BTANIC','108','1132350',-34.92112350,138.60792542,264.48,2.2],
['Tram','GLNELG','109','1132349',-34.92165756,138.59719849,264.87,0],
['Bus','229','1094','1024925',-34.8250618,138.63806152,107.43,13.4],
['Bus','200','1095','1091740',-34.93760681,138.60064697,356.27,12.9],
['Bus','230','1098','1145666',-34.85156250,138.52677917,268.22,6.3],
['Bus','J1','1107','1175836',-34.79098511,138.69348145,64.06,0],
['Bus','H30','1118','1028991',-34.90236664,138.68148804,86.36,11.1],
['Tram','BTANIC','112','1132570',-34.92110443,138.58459473,113.06,0],
['Bus','M44','1121','1175967',-34.83887482,138.68116760,62.02,23.7],
['Bus','H30C','1124','1029054',-34.88206482,138.49183655,273.82,8],
['Bus','J2','1128','1175941',-34.91014862,138.61286926,349.16,12.9],
['Train','OUTHA','3011','924805',-34.85082245,138.49761963,258.85,9.8],
['Train','GRNG','3017','924806',-34.88458252,138.5475769,313.06,15.1],
['Train','BEL','3026','683745',-34.95224380,138.58520508,143.66,8.2],
['Train','PTDOCK','3122','924683',-34.84484863,138.50883484,335.24,0],
['Train','OUTHA','3124','924684',-34.80540085,138.49911499,177.86,0],
['Train','BEL','3132','683744',-35.01604080,138.62040710,43.61,14.6],
['Train','BEL','3140','683699',-35.02369690,138.61906433,212.12,8.4]
];
const time='2026-08-06 12:26:40';
const vehicles=sample.map(([VehicleType,RouteID,VehicleID,TripID,Latitude,Longitude,Bearing,Speed],i)=>({VehicleType,RouteID,VehicleID,VehicleLabel:VehicleID,TripID,Latitude,Longitude,Bearing,Speed,EntityID:'snapshot-'+i,PositionTimestamp:time}));
const trips=[
 ['171','1023480','1919',27,'4389'],['171','1023495','1946',26,'3372'],['178','1023784','1153',24,'2259'],['178','1023834','1946',6,'3189'],['178','1023835','849',19,'3398']
].map(([RouteID,TripID,VehicleID,StopTimeUpdateCount,FirstStopID],i)=>({RouteID,TripID,VehicleID,VehicleLabel:VehicleID,StopTimeUpdateCount,FirstStopID,EntityID:'snapshot-trip-'+i,TripTimestamp:'2026-08-06 12:26:07',DelaySeconds:null}));
const alerts=[
 {EntityID:'A1786056341',HeaderText:'Stop change - Stop U1 Halifax Street - From Friday 28 February',DescriptionText:'Stop U1 Halifax St - South side will be relocated 30 metres west due to building works.',RouteIDs:'98C, 99C',ActiveStart:'2025-02-27 20:30:00'},
 {EntityID:'A1786056342',HeaderText:'Stop closure - Stops 2, 2A and 3 South Road - West side',DescriptionText:'Stops on the western side of South Road closed due to Torrens to Darlington Project works.',RouteIDs:'245, 248, AO31',ActiveStart:'2025-05-21 19:30:00'}
];
window.METRO_SNAPSHOT={generated:'2026-08-06 21:57:07',baseUrl:'https://gtfs.adelaidemetro.com.au/v1/realtime',selectedFeeds:['vehicle_positions','trip_updates','service_alerts'],countsOriginal:{vehicle_positions:153,trip_updates:234,service_alerts:61},vehicles,trips,alerts,outputs:{'Output GDB':'C:\\Temp\\GIS\\WCVP_temp_Pro_project\\WCVP_temp_Pro_project\\Default.gdb','Prefix':'AdelaideMetroRT','Vehicle Positions':'AdelaideMetroRT_VehiclePositions_20260806_215655','Trip Updates':'AdelaideMetroRT_TripUpdates_20260806_215658','Service Alerts':'AdelaideMetroRT_ServiceAlerts_20260806_215700'}};
})();
