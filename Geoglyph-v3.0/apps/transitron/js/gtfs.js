/* Dependency-free GTFS-Realtime protobuf decoder, adapted from the source report's
   vanilla JS message-field parser. Browser-safe, no third-party decoder. */
(function(){'use strict';
const decoder=new TextDecoder('utf-8');
function readVar(buffer,i){let value=0n,shift=0n;while(i<buffer.length){const byte=buffer[i++];value|=BigInt(byte&127)<<shift;if(!(byte&128))return [value<=BigInt(Number.MAX_SAFE_INTEGER)?Number(value):value,i];shift+=7n;if(shift>70n)throw new Error('Invalid varint');}throw new Error('Unexpected EOF while reading varint');}
function decodeMsg(buffer){let i=0,out={};while(i<buffer.length){let key;[key,i]=readVar(buffer,i);if(typeof key!=='number')throw new Error('Invalid protobuf field key');const field=key>>3,wire=key&7;let val;if(wire===0){[val,i]=readVar(buffer,i);}else if(wire===1){if(i+8>buffer.length)throw new Error('Truncated protobuf 64-bit value');val=new DataView(buffer.buffer,buffer.byteOffset+i,8).getFloat64(0,true);i+=8;}else if(wire===2){let len;[len,i]=readVar(buffer,i);if(typeof len!=='number'||len<0||i+len>buffer.length)throw new Error('Invalid protobuf length');val=buffer.subarray(i,i+len);i+=len;}else if(wire===5){if(i+4>buffer.length)throw new Error('Truncated protobuf float');val=new DataView(buffer.buffer,buffer.byteOffset+i,4).getFloat32(0,true);i+=4;}else throw new Error('Unsupported protobuf wire type '+wire);(out[field]??=[]).push(val);}return out;}
const subs=(m,f)=>(m[f]||[]).filter(v=>v instanceof Uint8Array).map(decodeMsg);
const str=(m,f)=>{const v=(m[f]||[])[0];return v instanceof Uint8Array?decoder.decode(v):null;};
const varint=(m,f)=>{const v=(m[f]||[])[0];return typeof v==='number'||typeof v==='bigint'?v:null;};
const f32=(m,f)=>typeof(m[f]||[])[0]==='number'?(m[f]||[])[0]:null;
const f64=f32;
const epoch=s=>s==null?null:new Date(Number(s)*1000).toISOString();
const classify=id=>{if(!id)return'Unknown';const v=String(id).toUpperCase();if(v==='GLNELG'||v==='BTANIC')return'Tram';if(/^[A-Z]+$/.test(v))return'Train';return'Bus';};
const signed32=v=>{if(v==null)return null;const n=typeof v==='bigint'?Number(v&0xffffffffn):Number(v)>>>0;return n>=0x80000000?n-0x100000000:n;};
function translation(obj){const t=subs(obj,1)[0]||{};return (str(t,1)||'').replace(/(^|[\s|>])en:\s*/gi,'$1');}
function feed(bytes){const root=decodeMsg(bytes instanceof Uint8Array?bytes:new Uint8Array(bytes));const header=subs(root,1)[0]||{};return {root,feedTimestamp:epoch(varint(header,3))};}
function parseVehicles(bytes){const {root,feedTimestamp}=feed(bytes),rows=[];
  for(const ent of subs(root,2)){const veh=subs(ent,4)[0];if(!veh)continue;const trip=subs(veh,1)[0]||{},pos=subs(veh,2)[0]||{},desc=subs(veh,8)[0]||{};const lat=f32(pos,1),lon=f32(pos,2);if(lat==null||lon==null||lat< -36.5||lat> -33.5||lon<137.5||lon>140.5)continue;
  const row={FeedTimestamp:feedTimestamp,EntityID:str(ent,1),VehicleID:str(desc,1),VehicleLabel:str(desc,2),LicensePlate:str(desc,3),TripID:str(trip,1),RouteID:str(trip,5),DirectionID:varint(trip,6),StartTime:str(trip,2),StartDate:str(trip,3),Latitude:lat,Longitude:lon,Bearing:f32(pos,3),Speed:f32(pos,5),Odometer:f64(pos,4),CurrentStopID:str(veh,7),CurrentStopSeq:varint(veh,3),CurrentStatus:varint(veh,4),PositionTimestamp:epoch(varint(veh,5))};row.VehicleType=classify(row.RouteID);rows.push(row);}
  return rows;
}
function parseTrips(bytes){
  const {root,feedTimestamp}=feed(bytes),rows=[];
  for(const entity of subs(root,2)){
    const update=subs(entity,3)[0];
    if(!update)continue;
    const trip=subs(update,1)[0]||{},vehicle=subs(update,3)[0]||{};
    const stops=subs(update,2).map(stop=>{
      const arrival=subs(stop,2)[0]||{},departure=subs(stop,3)[0]||{};
      return {
        StopID:str(stop,4),
        StopSequence:varint(stop,1),
        ScheduleRelationship:varint(stop,5),
        ArrivalTime:epoch(varint(arrival,2)),
        DepartureTime:epoch(varint(departure,2)),
        ArrivalDelaySeconds:signed32(varint(arrival,1)),
        DepartureDelaySeconds:signed32(varint(departure,1))
      };
    });
    rows.push({
      FeedTimestamp:feedTimestamp,EntityID:str(entity,1),TripID:str(trip,1),RouteID:str(trip,5),
      DirectionID:varint(trip,6),StartTime:str(trip,2),StartDate:str(trip,3),
      ScheduleRelationship:varint(trip,4),
      VehicleID:str(vehicle,1),VehicleLabel:str(vehicle,2),TripTimestamp:epoch(varint(update,4)),
      DelaySeconds:signed32(varint(update,5)),StopTimeUpdateCount:stops.length,StopTimeUpdates:stops,
      FirstStopID:stops[0]?.StopID??null,FirstArrivalTime:stops[0]?.ArrivalTime??null,
      FirstDepartureTime:stops[0]?.DepartureTime??null
    });
  }
  return rows;
}
function parseAlerts(bytes){const {root,feedTimestamp}=feed(bytes),rows=[];for(const ent of subs(root,2)){const alert=subs(ent,5)[0];if(!alert)continue;const periods=subs(alert,1),inf=subs(alert,5),first=periods[0]||{};const routeIds=new Set(),stopIds=new Set(),tripIds=new Set();for(const e of inf){if(str(e,2))routeIds.add(str(e,2));if(str(e,5))stopIds.add(str(e,5));const tr=subs(e,4)[0]||{};if(str(tr,1))tripIds.add(str(tr,1));}rows.push({FeedTimestamp:feedTimestamp,EntityID:str(ent,1),Cause:varint(alert,6),Effect:varint(alert,7),Severity:varint(alert,14),HeaderText:translation(subs(alert,10)[0]||{}),DescriptionText:translation(subs(alert,11)[0]||{}),UrlText:translation(subs(alert,8)[0]||{}),ActiveStart:epoch(varint(first,1)),ActiveEnd:epoch(varint(first,2)),InformedEntityCount:inf.length,RouteIDs:[...routeIds].sort().join(', '),StopIDs:[...stopIds].sort().join(', '),TripIDs:[...tripIds].sort().join(', ')});}return rows;}
const api={parseVehicles,parseTrips,parseAlerts,classify};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else window.MetroGTFS=api;
})();
