
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const PREVIEW_SIZE = 1024;
  const FONT_ROW_HEIGHT = 39;
  const LOGO_SIZE_MAX = 28;
  const SYMBOL_REFERENCE_SIZE = 512;
  const QR_LIMITS = Object.freeze({ L: 2953, M: 2331, Q: 1663, H: 1273 });
  // Exact dark-module geometry extracted from magic_eye_qr.svg (SHA-256 c37c798c8d7d660959810767765224f583c77d27d31b753510144c0394e742c6).
  const MAGIC_EYE_SVG_MODULES = 177;
  const MAGIC_EYE_SVG_QUIET_ZONE = 4;
  const MAGIC_EYE_SVG_MATRIX_BASE64 = "/kP27kbfJZtWlG34U5XpxF8FG/aSP8FkVZamEVIYVAllEWCVVYZVFxkUGVBuiGBRACgl8MC5TgpPCiE8KKTQohuLt1Z8GoLaPoJ46QnitCeOkdo/UjjJNdumopf9GpJ/6EnR+wVkj78SsvzoScLsFdThRWM3HE3MVkY12dxXZ3NFmck1B/qqqqqqqqqqqqqqqqqqqqqqqqqqqv4AIvxxw/unHq/Icboh7xiDu7EOqskA++eq/5viYP+Bmb+Gpnj4G8Bv76GL1VTCu5yqRR1OFHEsUMWgR1KVHEoUdShYgqAkTNGxY05FhxEePMw48ZFhxkWPCC6x/wYmGlGIfCYh4BgCgGIeAcg8Fm+4VBeYJenAH6cCfhwBulClS8qfpwJdKr8zVd9LYn08ifXiNsfdi0oCfTyI911cDcF8k1by5VtJHW+s9byxdtDlW8ggBXsQwMIV3glCeHUN4YQ3xkCfGUN83qbkTnISuERK6TEjpEysExC6zErJMSSXPkuw5RFXiEVOEAUoRVClAFPARU5MzahWvAhx+SlH5pU/Gp7+alP5i03uhh2MOC8csdli1iGPGJc8YlzwiXOGNcr8C0pSfTdF9F0/UXx3xdH9F0/UXTlWBsRgnjGRa8YFq12GvGBfsdFKxgXqGL7+P+/xR09FtT00NvTR29NPd0w9nTVSbdzVEHm81MfiQ97dD280feyVs/NX+5Go/H+H61afrXp2tWn414Xr3L+tcBK6/Ny99SfXxI8fEg1sSPG1IsfAjw9A7huJ/sity2oXpoD8Oovy6o/JixkunxIrITAHkUgKVCA5VYDgUgecSEoVMHb+cyP+eKcf6hTV+FtWr834j/1KNN+Qx4zkRzWZZFbli0WOPGRcsdlG9iXMWqvuA2ucS4qzpClqGoeaqh5pqlmkgqSRHDHRAMk1EiXiUddNIxw0jXGWMcMcD9Hwv4ai/PqDck+F4Sj9BoD/kINy+nj6QXKhT4pEPikR+KVC49EPikR6aRD3lkdlWMx51ztH9OWdc5Z1zllVG0UU0ChR4gAWCsBIXgdhKQSEoBYCwFiOAWJko8iuqQDaLBtokG0ywRSpBtIOG2iTTW/KMI+k9j6T3PtOcuk9i/D3fpfcuPuwu5dQz43jti8O+JSz4lDPgUE8AQxYtiEkouOEDo9IajwgqPCCo8IOi0guB+XEKjYgfNiB++AH5QgVFoB++KHbYlzEapIxcgymyDJTMMtMg3E3DPTINtAPkoa1o0TgLxsCtGwKUbAJRsAlGwCV3SYf9XEXMNVM1ocjD1TNPVMw8UiHFXsjDB/v9ePf149+Xj11+FX1w9/XjT/YD/9A7d3DznYPOdks9mj3mcLOdg85nHiy2n+ZD17mtXkyfebF158PFkw9WTBSngGDQvCsjoeiak7YrXsgtOyOk/Ivqz+doRZxoZHGhkESkRxARtGpEeaGR2RhKI9qcxQJzVBHNEGM1UI3BFnJUOMIhz8wVFyxa3tVp+keH6RafJFp0kWn2ZHBpYGOmEMqcIzpwzKnCM6cY3o0jOc/HRGuQTKdBEr0EStQxA3pErcGaPQRrcHq/zdSxp1KH3eofMyts1KH3QofN4iMXVHoSlyjoWomjYqaFipoEImxQiQy2uEou/m9bufovpv37n/b+X8vovn/z64Kn7iy+/rD7Y+Htiz8WpD/4uPv+zRRvLRu5tTGm0JseCmoxWKnlFqbRkZasGeusFz8q3tipq3IH+sgft6h21BryxZvvxS8O9Hg/gsXrX8R8bx7EvGvEcb4RZr+BSiflKJo+gkhz4StCvoUom/V4phkYUToYQOhlA+GUCodAfhhA6WUTz1CV5atH9o092p7/aNP9o0/2hT9SNDAolt+GVi+dAfo0d63Rj6dHPo0M+iVDxKc311KBbWoBtYg01qhT8CntaoW1P7mNefEs64Az7gCPuEM68A3rjDLvAcC9Le04AykwToThsrsE6mwTKbhEpkEw6ssE7kEqtECumBe6RArhATukFO+AEi+R3PJtL+8wn7zF3pE/8kxXz7H/vsfxzopPoqD+CoP+oPu+g+/KHv6oP/6h5kOLtlg21wD5Sh7SDvvIO+0g5zwDpnL3PLCItsE3mkit5K9zk63eTqdoOs3PrC7M7/j7BebAXkwlm7gW5EjZu4HuebPQKItTu+1OrtSUqUGytAXK1VI7UUkleTgfRn8VH9Hx/DUfjdT2N1tw1U9oiBJtG4ugP/oXqUR61AO7VB7sUGukHonS/I7M2p08Kde1GllztW1G37U5/tOIBa0pmb2mW4pjaUg3kMXKVhZ5TV31mqKNMSNTopUwD45H+GbfmZF+5k1xkWiQscHMUqeEK3iHbRRykR3bRGdsEM222xHyGrLQay0FZYCsWgpCoCkaKKRoFCY1rnY38QtvCW2kKdoC3IFLZxA92R88kiJ0ph9kS9Tt+Jm3qZt6pm1ikTcjBAXd2gWAEVgUK8gFfIBXyAFOMAVosP90pD74AbfgE+Q/3gA/4Ct3vgf8C/eRgRURwCSnEkrAEWAHExFgcBHFgBEXCrOjCtw0wKlkE8rILaaq2kgKoSwlrDRbKUx8lq9FK1IUbWLaxi2pXGekeseH6oUz/eWZvlnSz+l5jr8S4X/jrdm+j6UMBJSraxqms1FNqnGf9gmqnXardZe136wlIlkCj5D8yCrcki3IKrcgolyEZxw4amMO/jG9o/7836/N/v82+O3HvHwfTh04ARGoEbUK1gCtYChVgCtWIQ2gRjjO3XXZx124ztMeqXHq1Me7Rx4tK1BY32tDxrT01oBq8CeFArq0AipQKl7q1i+4XKuEm+KbVBf1RTtVlO1EUjFk87XNXtEyr5MttmW0BntjkW0GZbaRBx8kgE68RwrEYViMq8C//icK6Iwroj5suxV31W1V3tU42qetuns2qexSpzNkbe3qlUHC+Bg/A4XgeB4O4Xg+lOHmFAn68cpbYOL+Dm/Bz9w89Xpz98HPfwaxfU0SFFLXFC3whPoMG9UgfgSVuBIX/z6vkMpH9wn9Ep3nK/nEL+cwtxxD/jhj/w/6cCuJi/CZVg7QiDZSIMlKkmEJ824hErqIEuoFLqBxioFGoi06CBTiObnHaXqTy34PP4DnoHuP1K9iQ/z4D/N6YR5ttDlumsW0Ge8S9zRDmtEG80Sx4Dlp4O+olrq2C7mGfqYZ+plE+mGHuY0pjFinK9O8jX5jV9mt024X15jdfmLrRhomOtyZazIljMiWs2dK3I1rMzXtn+J6SiAl88C9TwjfvCtW8K37Qj9nAkw/t+FW8Mdrg1mvHSe4dZ7h1muGWGMX9lRj/QYYPhhBk+EkQ74RhhvkGEG+eRgoNxITFNGMUxMVAEiRMCNFFIxTETmv2/msFnh6m8HwrQ9Hur0e8Kxz01rmRZ1xRY2O3HI/Kcb99yR23Y/Gdi9sWX8yuL/8ZUfzlR3+VlU/8VxG/xOVH+ZqQsGB0pOPWg48KHi0oOfClosbDj0pE0Q0orQBhVikF8ASXSJhdAEH0AwXYESa4P5CdqkBi/A2d4TZ6gJnuAmO8CdXmX1jumSzYdLPh008Hwxg9DvpUs+FXa/uZWSxkreGStodK2gsvKXCtoZC2h45wzUlFHh0U8Hxxw9HPj0ccPRxwVHGaopHlq2qOvK9q8ujry6Ovbo69uHr2BzBc3daDRpKFG+IU4ShRgoHumqUaYGz+6vhkRudFC43IPiUAuNAHokFLzUBs3T7dShl9QG1XoZf2Dt/YO3/gj92L3iGEvAcXoPBK0sE/DgT4PBfg8FuHgXLh5hwT+CadYJp/omh2gYX4Dt/CmH8F6DUH6Mgch2ByHIHIcgcliFiHZHZcgD6aghCQXwxC9DgBUuSPy7AdLkB0mYUrJNTWO9ucLi9iufiD5+YL35gvOGi9vgTvxVOPxIY3ErjUwmtxD43krjcSsS5mS3fJTR8kNHyQ0ONCR9kNGiQwfMDO1iUjSNQ5Q1gHpUC2PQrY9Avh0g2PVjtlrWU2ofZKlskvS2S4bZLlskuWmW4q2/6/he61P7rc/mtz84XtTr8fuPxZTCypY6Nhy82WKjdIuMlmo2GKzZZuNSylqZlQUkzDwTsFJMwckzByTMHpEwX6niFTStmELmcC+ZxCpyEKmcQuI1CtL/7hT7PWpP9amV/i5X35n9Sv91qZ/TR69WxAV5/FXm60eKvExvsXjG1ab8VGpFH2q9x8K3hSpqXIv6sC/l6p21Er2REHbRSNoNEmkgUfSRNxJE3lEfGWEdb5cZ38r2O/vYb4/htj38WlS/49hP/xqjO5WHRqQtGpD8ekPAqUqWp31akLBisE2k1UwprzgmsuK624rrbistmoy21DTy+tnGq2cKvIwvo3C+ycLrY0usvG/jv7QM3OxR+7HHzk8XuxD8TnPbsefIbc8W8v8VRrxUOvFA+sVHq1EOvBQ6slxbWZzpR9OntW4WfbrZ9Olnw4W9ThRDulGcjcEdNgVg3FWRY1ZNxFk3EWDcK0IIQLYSNohIWiEh4QyFCpCmKEpaIVxGUIcsRp1hCnWNOMcAp1gHjWFKdYBP6b0LJAi0iipSgKlIAuUgCJQAAlAAky263OEPM15o3CiiNfLs14szWuiNPPo+KFvgq2eWrZ6al3hi2UmpTqavnoqwg+RTPuRO8gA76RHutAO/gEr+QDvpBi72zic9Fta283gTb2dJvY029hT52FHJs1RNBcG+pgfqnBurcn6pwb6nAmrcRmmO7NpClokKWiQh4BiFAkDmiQpaLBLt0noa6YRPpxM+nI3qcXK9pM/jEzqbuTNm60wthzo2kMK4WwvhTC8VEpwUxoT4nIa0Ks+Aui4Hqfg/o+BqwMGuPkJtcfReqWDe5YN7lg1m2AW5Qt9lg2uXKcaR3g9jdr2N+vcm+sjXq2J+vY36t50B2OPh3t6n83o/7ej/t6P+1o35WzwgGJdLS/OPDs8sPnjw/+PD968PmngPV55qL47Dy/sPNk+00Tj5TsHvsy8W/ABuiBx+ACTEAYPEVg8ARHgVJHQBx8Q/u0tGoJ00qn5StrHoZ+uhnxakXlgr0EJgwRAEI3FAnI0Sc3ARzcAnG0CckWuse534NF/f0X9G/X0Vj9T0X/vRf2/F1vFQI7lr5qWvmoeuekq1qWvmpa/a0uqIX5+ZWkYV4Tpdrmvema1aBpVpmtEFkP6UcWgc1KNmFs3dWzdxbNmFs3MU/tow7lnOeCc54Jx3gnu8C8x6JTvAvQA=";
  const ESRI_FONT_PATH = "C:\\Program Files\\ArcGIS\\Pro\\Resources\\Fonts";
  const SETTINGS_VERSION = 15.9;
  const THEME_STORAGE_KEY = "geoglyph-locate2026.geoglyph-theme";
  const FAVOURITES_STORAGE_KEY = "geoglyph-locate2026.geoglyph-favourites";
  const QR_MATRIX_SOURCE_SIZE = 708;
  const LOGO_CROP_BUFFER_MIN = 0;
  const LOGO_CROP_BUFFER_MAX = 50;
  const LOGO_CROP_BUFFER_STEP = 1;
  const LOGO_CROP_EDGE_MIN = 0;
  const LOGO_CROP_EDGE_MAX = 24;
  const LOGO_CROP_EDGE_STEP = 1;
  const EMOJI_FONT_STACK = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",emoji,sans-serif';
  // Unicode WG2 N4384 / L2/12-368 legacy Webdings and Wingdings mappings.
  // Source slots remain internal so the original font draws its glyph; UI labels use mapped Unicode.
  const LEGACY_SYMBOL_MAP_DATA = Object.freeze({
    webdings: "33:1f577,34:1f578,35:1f572,36:1f576,37:1f3c6,38:1f396,39:1f587,40:1f5e8,41:1f5e9,42:1f5f0,43:1f5f1,44:1f336,45:1f397,46:1f67e,47:1f67c,48:1f5d5,49:1f5d6,50:1f5d7,51:23f4,52:23f5,53:23f6,54:23f7,55:23ea,56:23e9,57:23ee,58:23ed,59:23f8,60:23f9,61:23fa,62:1f5da,63:1f5f3,64:1f6e0,65:1f3d7,66:1f3d8,67:1f3d9,68:1f3da,69:1f3dc,70:1f3ed,71:1f3db,72:1f3e0,73:1f3d6,74:1f3dd,75:1f6e3,76:1f50d,77:1f3d4,78:1f441,79:1f442,80:1f3de,81:1f3d5,82:1f6e4,83:1f3df,84:1f6f3,85:1f56c,86:1f56b,87:1f568,88:1f508,89:1f394,90:1f395,91:1f5ec,92:1f67d,93:1f5ed,94:1f5ea,95:1f5eb,96:2b94,97:2714,98:1f6b2,99:2b1c,100:1f6e1,101:1f4e6,102:1f6f1,103:2b1b,104:1f691,105:1f6c8,106:1f6e9,107:1f6f0,108:1f7c8,109:1f574,110:2b24,111:1f6e5,112:1f694,113:1f5d8,114:1f5d9,115:2753,116:1f6f2,117:1f687,118:1f68d,119:26f3,120:29b8,121:2296,122:1f6ad,123:1f5ee,124:23d0,125:1f5ef,126:1f5f2,128:1f6b9,129:1f6ba,130:1f6c9,131:1f6ca,132:1f6bc,133:1f47d,134:1f3cb,135:26f7,136:1f3c2,137:1f3cc,138:1f3ca,139:1f3c4,140:1f3cd,141:1f3ce,142:1f698,143:1f5e0,144:1f6e2,145:1f4b0,146:1f3f7,147:1f4b3,148:1f46a,149:1f5e1,150:1f5e2,151:1f5e3,152:272f,153:1f584,154:1f585,155:1f583,156:1f586,157:1f5b9,158:1f5ba,159:1f5bb,160:1f575,161:1f570,162:1f5bd,163:1f5be,164:1f4cb,165:1f5d2,166:1f5d3,167:1f56e,168:1f4da,169:1f5de,170:1f5df,171:1f5c3,172:1f5c2,173:1f5bc,174:1f3ad,175:1f39c,176:1f398,177:1f399,178:1f3a7,179:1f4bf,180:1f39e,181:1f4f7,182:1f39f,183:1f3ac,184:1f4fd,185:1f4f9,186:1f4fe,187:1f4fb,188:1f39a,189:1f39b,190:1f4fa,191:1f4bb,192:1f5a5,193:1f5a6,194:1f5a7,195:1f579,196:1f3ae,197:1f57b,198:1f57c,199:1f4df,200:1f581,201:1f580,202:1f5a8,203:1f5a9,204:1f5bf,205:1f5aa,206:1f5dc,207:1f512,208:1f513,209:1f5dd,210:1f4e5,211:1f4e4,212:1f573,213:1f323,214:1f324,215:1f325,216:1f326,217:2601,218:1f328,219:1f327,220:1f329,221:1f32a,222:1f32c,223:1f32b,224:1f31c,225:1f321,226:1f6cb,227:1f6cf,228:1f37d,229:1f378,230:1f6ce,231:1f6cd,232:24c5,233:267f,234:1f6c6,235:1f588,236:1f393,237:1f5e4,238:1f5e5,239:1f5e6,240:1f5e7,241:1f6ea,242:1f43f,243:1f426,244:1f41f,245:1f415,246:1f408,247:1f66c,248:1f66e,249:1f66d,250:1f66f,251:1f5fa,252:1f30d,253:1f30f,254:1f30e,255:1f54a",
    wingdings: "33:1f589,34:2702,35:2701,36:1f453,37:1f56d,38:1f56e,39:1f56f,40:1f57f,41:2706,42:1f582,43:1f583,44:1f4ea,45:1f4eb,46:1f4ec,47:1f4ed,48:1f5c0,49:1f5c1,50:1f5ce,51:1f5cf,52:1f5d0,53:1f5c4,54:23f3,55:1f5ae,56:1f5b0,57:1f5b2,58:1f5b3,59:1f5b4,60:1f5ab,61:1f5ac,62:2707,63:270d,64:1f58e,65:270c,66:1f58f,67:1f44d,68:1f44e,69:261c,70:261e,71:261d,72:1f597,73:1f590,74:263a,75:1f610,76:2639,77:1f4a3,78:1f571,79:1f3f3,80:1f3f1,81:2708,82:263c,83:1f322,84:2744,85:1f546,86:271e,87:1f548,88:2720,89:2721,90:262a,91:262f,92:1f549,93:2638,94:2648,95:2649,96:264a,97:264b,98:264c,99:264d,100:264e,101:264f,102:2650,103:2651,104:2652,105:2653,106:1f670,107:1f675,108:26ab,109:1f53e,110:25fc,111:1f78f,112:1f790,113:2751,114:2752,115:1f79f,116:29eb,117:25c6,118:2756,119:1f799,120:2327,121:2bb9,122:2318,123:1f3f5,124:1f3f6,125:1f676,126:1f677,128:1f10b,129:2780,130:2781,131:2782,132:2783,133:2784,134:2785,135:2786,136:2787,137:2788,138:2789,139:1f10c,140:278a,141:278b,142:278c,143:278d,144:278e,145:278f,146:2790,147:2791,148:2792,149:2793,150:1f662,151:1f660,152:1f661,153:1f663,154:1f65e,155:1f65c,156:1f65d,157:1f65f,158:2219,159:2022,160:2b1d,161:2b58,162:1f786,163:1f788,164:1f78a,165:1f78b,166:1f53f,167:25aa,168:1f78e,169:1f7c1,170:1f7c5,171:2605,172:1f7cb,173:1f7cf,174:1f7d3,175:1f7d1,176:2bd0,177:2316,178:2bce,179:2bcf,180:2bd1,181:272a,182:2730,183:1f550,184:1f551,185:1f552,186:1f553,187:1f554,188:1f555,189:1f556,190:1f557,191:1f558,192:1f559,193:1f55a,194:1f55b,195:2bb0,196:2bb1,197:2bb2,198:2bb3,199:2bb4,200:2bb5,201:2bb6,202:2bb7,203:1f66a,204:1f66b,205:1f655,206:1f654,207:1f657,208:1f656,209:1f650,210:1f651,211:1f652,212:1f653,213:232b,214:2326,215:2b98,216:2b9a,217:2b99,218:2b9b,219:2b88,220:2b8a,221:2b89,222:2b8b,223:1f868,224:1f86a,225:1f869,226:1f86b,227:1f86c,228:1f86d,229:1f86f,230:1f86e,231:1f878,232:1f87a,233:1f879,234:1f87b,235:1f87c,236:1f87d,237:1f87f,238:1f87e,239:21e6,240:21e8,241:21e7,242:21e9,243:2b04,244:21f3,245:2b01,246:2b00,247:2b03,248:2b02,249:1f8ac,250:1f8ad,251:1f5f6,252:2713,253:1f5f7,254:1f5f9",
    wingdings2: "33:1f58a,34:1f58b,35:1f58c,36:1f58d,37:2704,38:2700,39:1f57e,40:1f57d,41:1f5c5,42:1f5c6,43:1f5c7,44:1f5c8,45:1f5c9,46:1f5ca,47:1f5cb,48:1f5cc,49:1f5cd,50:1f4cb,51:1f5d1,52:1f5d4,53:1f5b5,54:1f5b6,55:1f5b7,56:1f5b8,57:1f5ad,58:1f5af,59:1f5b1,60:1f592,61:1f593,62:1f598,63:1f599,64:1f59a,65:1f59b,66:1f448,67:1f449,68:1f59c,69:1f59d,70:1f59e,71:1f59f,72:1f5a0,73:1f5a1,74:1f446,75:1f447,76:1f5a2,77:1f5a3,78:1f591,79:1f5f4,80:1f5f8,81:1f5f5,82:2611,83:2bbd,84:2612,85:2bbe,86:2bbf,87:1f6c7,88:29b8,89:1f671,90:1f674,91:1f672,92:1f673,93:203d,94:1f679,95:1f67a,96:1f67b,97:1f666,98:1f664,99:1f665,100:1f667,101:1f65a,102:1f658,103:1f659,104:1f65b,105:24ea,106:2460,107:2461,108:2462,109:2463,110:2464,111:2465,112:2466,113:2467,114:2468,115:2469,116:24ff,117:2776,118:2777,119:2778,120:2779,121:277a,122:277b,123:277c,124:277d,125:277e,126:277f,128:2609,129:1f315,130:263d,131:263e,132:2e3f,133:271d,134:1f547,135:1f55c,136:1f55d,137:1f55e,138:1f55f,139:1f560,140:1f561,141:1f562,142:1f563,143:1f564,144:1f565,145:1f566,146:1f567,147:1f668,148:1f669,149:22c5,150:1f784,151:2981,152:25cf,153:25cb,154:1f785,155:1f787,156:1f789,157:2299,158:29bf,159:1f78c,160:1f78d,161:25fe,162:25a0,163:25a1,164:1f791,165:1f792,166:1f793,167:1f794,168:25a3,169:1f795,170:1f796,171:1f797,172:1f798,173:2b29,174:2b25,175:25c7,176:1f79a,177:25c8,178:1f79b,179:1f79c,180:1f79d,181:1f79e,182:2b2a,183:2b27,184:25ca,185:1f7a0,186:25d6,187:25d7,188:2bca,189:2bcb,190:2bc0,191:2bc1,192:2b1f,193:2bc2,194:2b23,195:2b22,196:2bc3,197:2bc4,198:1f7a1,199:1f7a2,200:1f7a3,201:1f7a4,202:1f7a5,203:1f7a6,204:1f7a7,205:1f7a8,206:1f7a9,207:1f7aa,208:1f7ab,209:1f7ac,210:1f7ad,211:1f7ae,212:1f7af,213:1f7b0,214:1f7b1,215:1f7b2,216:1f7b3,217:1f7b4,218:1f7b5,219:1f7b6,220:1f7b7,221:1f7b8,222:1f7b9,223:1f7ba,224:1f7bb,225:1f7bc,226:1f7bd,227:1f7be,228:1f7bf,229:1f7c0,230:1f7c2,231:1f7c4,232:1f7c6,233:1f7c9,234:1f7ca,235:2736,236:1f7cc,237:1f7ce,238:1f7d0,239:1f7d2,240:2739,241:1f7c3,242:1f7c7,243:272f,244:1f7cd,245:1f7d4,246:2bcc,247:2bcd,248:203b,249:2042",
    wingdings3: "33:2b60,34:2b62,35:2b61,36:2b63,37:2b66,38:2b67,39:2b69,40:2b68,41:2b70,42:2b72,43:2b71,44:2b73,45:2b76,46:2b78,47:2b7b,48:2b7d,49:2b64,50:2b65,51:2b6a,52:2b6c,53:2b6b,54:2b6d,55:2b4d,56:2ba0,57:2ba1,58:2ba2,59:2ba3,60:2ba4,61:2ba5,62:2ba6,63:2ba7,64:2b90,65:2b91,66:2b92,67:2b93,68:2b80,69:2b83,70:2b7e,71:2b7f,72:2b84,73:2b86,74:2b85,75:2b87,76:2b8f,77:2b8d,78:2b8e,79:2b8c,80:2b6e,81:2b6f,82:238b,83:2324,84:2303,85:2325,86:2423,87:237d,88:21ea,89:2bb8,90:1f8a0,91:1f8a1,92:1f8a2,93:1f8a3,94:1f8a4,95:1f8a5,96:1f8a6,97:1f8a7,98:1f8a8,99:1f8a9,100:1f8aa,101:1f8ab,102:1f850,103:1f852,104:1f851,105:1f853,106:1f854,107:1f855,108:1f857,109:1f856,110:1f858,111:1f859,112:25b2,113:25bc,114:25b3,115:25bd,116:25c0,117:25b6,118:25c1,119:25b7,120:25e3,121:25e2,122:25e4,123:25e5,124:1f780,125:1f782,126:1f781,128:1f783,129:2bc5,130:2bc6,131:2bc7,132:2bc8,133:2b9c,134:2b9e,135:2b9d,136:2b9f,137:1f810,138:1f812,139:1f811,140:1f813,141:1f814,142:1f816,143:1f815,144:1f817,145:1f818,146:1f81a,147:1f819,148:1f81b,149:1f81c,150:1f81e,151:1f81d,152:1f81f,153:1f800,154:1f802,155:1f801,156:1f803,157:1f804,158:1f806,159:1f805,160:1f807,161:1f808,162:1f80a,163:1f809,164:1f80b,165:1f820,166:1f822,167:1f824,168:1f826,169:1f828,170:1f82a,171:1f82c,172:1f89c,173:1f89d,174:1f89e,175:1f89f,176:1f82e,177:1f830,178:1f832,179:1f834,180:1f836,181:1f838,182:1f83a,183:1f839,184:1f83b,185:1f898,186:1f89a,187:1f899,188:1f89b,189:1f83c,190:1f83e,191:1f83d,192:1f83f,193:1f840,194:1f842,195:1f841,196:1f843,197:1f844,198:1f846,199:1f845,200:1f847,201:2ba8,202:2ba9,203:2baa,204:2bab,205:2bac,206:2bad,207:2bae,208:2baf,209:1f860,210:1f862,211:1f861,212:1f863,213:1f864,214:1f865,215:1f867,216:1f866,217:1f870,218:1f872,219:1f871,220:1f873,221:1f874,222:1f875,223:1f877,224:1f876,225:1f880,226:1f882,227:1f881,228:1f883,229:1f884,230:1f885,231:1f887,232:1f886,233:1f890,234:1f892,235:1f891,236:1f893,237:1f894,238:1f896,239:1f895,240:1f897"
  });

  const BASE_KEYS = [
    [["`","~"],["1","!"],["2","@"],["3","#"],["4","$"],["5","%"],["6","^"],["7","&"],["8","*"],["9","("],["0",")"],["-","_"],["=","+"],["Backspace","Backspace",2]],
    [["Tab","Tab",2],["q","Q"],["w","W"],["e","E"],["r","R"],["t","T"],["y","Y"],["u","U"],["i","I"],["o","O"],["p","P"],["[","{"],["]","}"],["\\","|"]],
    [["Caps","Caps",2],["a","A"],["s","S"],["d","D"],["f","F"],["g","G"],["h","H"],["j","J"],["k","K"],["l","L"],[";",":"],["'","\""],["Enter","Enter",2]],
    [["Shift","Shift",2],["z","Z"],["x","X"],["c","C"],["v","V"],["b","B"],["n","N"],["m","M"],[",","<"],[".",">"],["/","?"],["Shift","Shift",2]],
    [["Ctrl","Ctrl",2],["Alt","Alt",2],["Space"," ",5],["AltGr","AltGr",2],["Menu","Menu",2],["Ctrl","Ctrl",2]]
  ];

  const defaultGradient = () => ({ colors: ["#31A765", "#76AEFE", "#D2A6FF", "#F47D22"], stops: [0, 33, 67, 100], direction: "horizontal", target: "off" });
  const defaultColourTarget = solid => ({ solid, mode: "solid", gradient: { colors: ["#31A765", "#76AEFE", "#D2A6FF", "#F47D22"], stops: [0, 33, 67, 100], direction: "horizontal" } });
  const state = {
    fonts: [], selectedFontId: null, selectedCode: 65, selectedKey: { base: "a", shifted: "A" }, selectedLabel: "A",
    qualifiers: { shift: false }, drawerMode: "grid", detailSize: 9, gridPreviewSize: 12, characterSet: "all", rangeStart: 32, rangeCount: 224, density: 96, colourView: "palette", gridView: "grid",
    favourites: loadStoredFavourites(), theme: localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark",
    preview: "symbol", qrMode: "square", qrLevel: "H", quietZone: 4, exportSize: 1024,
    logoMode: "symbol", externalLogoDataUrl: "", logoName: "Font symbol", logoCrop: true, logoCropBufferPercent: 5, logoCropCorner: "sharp", logoCropEdgeColor: "#000000", logoCropEdgeWidth: 0, logoSize: 20, safeSize: 8, zone: "logo",
    magicEyeDataUrl: "", magicEyeName: "", magicEyeImage: null,
    symbolShape: "circle", symbolBorder: true, symbolCanvasTransparent: false, borderWidth: 4, symbolScale: 100, bgScale: 70,
    offsetTarget: "symbol", offsetStep: 1, bgOffset: { x: 0, y: 0 }, symbolOffset: { x: 0, y: 0 },
    palettes: {
      symbol: { fg: "#0D0D0B", bg: "#FFFFFF", gradient: defaultGradient() },
      qr: { fg: "#000000", bg: "#FFFFFF", gradient: defaultGradient() },
      image: { fg: "#FFFFFF", bg: "#0E1417", gradient: defaultGradient() }
    },
    colourTarget: "qrFg",
    colourTargets: {
      qrBg: defaultColourTarget("#FFFFFF"),
      qrFg: defaultColourTarget("#000000"),
      symbolBg: defaultColourTarget("#FFFFFF"),
      symbolEdge: defaultColourTarget("#0D0D0B"),
      symbol: defaultColourTarget("#0D0D0B")
    },
    renderToken: 0,
    qreverse: { rows: [], nextId: 1, scanner: null, scannerMode: "", scanning: false, exporting: false, importing: false, stub: "geoglyph-batch", lastDesignPreview: "combined" }
  };

  const fontById = new Map(), fontByResource = new Map();
  let fontSelectionGeneration = 0;
  let externalLogoAssetCache = { src: "", promise: null };
  const activeRangeDrags = new Set();
  const rangeIsDragging = id => activeRangeDrags.has(id);
  let backdropDragging = false;

  window.addEventListener("DOMContentLoaded", init);

  function init() {
    seedFonts();
    bindEvents();
    setTheme(state.theme, false);
    syncControlsFromState();
    renderAll();
    initialiseQReverseScanner();
  }

  function seedFonts() {
    [
      { name: "Segoe UI Symbol", family: "Segoe UI Symbol", source: "preset" },
      { name: "Segoe UI Emoji", family: "Segoe UI Emoji", source: "preset" },
      { name: "Arial Unicode MS", family: "Arial Unicode MS", source: "preset" },
      { name: "Bahnschrift", family: "Bahnschrift", source: "preset" },
      { name: "Cascadia Code", family: "Cascadia Code", source: "preset" },
      { name: "Consolas", family: "Consolas", source: "preset" },
      { name: "Wingdings", family: "Wingdings", source: "preset" },
      { name: "Webdings", family: "Webdings", source: "preset" },
      { name: "Noto Sans Symbols", family: "Noto Sans Symbols", source: "preset" },
      { name: "System UI", family: "system-ui", source: "preset" }
    ].forEach(addFontRecord);
    state.selectedFontId = state.fonts[0]?.id || null;
  }

  function addFontRecord(record) {
    const key = window.GeoGlyphFontService.keyFor(record);
    if (fontByResource.has(key)) return fontByResource.get(key);
    const id = record.id || `${record.source}-${record.name}-${state.fonts.length}`.replace(/\s+/g, '-').toLowerCase();
    const font = { cssFamily: record.family, ...record, id };
    state.fonts.push(font); fontById.set(id, font); fontByResource.set(key, font);
    window.GeoGlyphFontService.register(font); return font;
  }

  function selectedFont() { return fontById.get(state.selectedFontId) || state.fonts[0] || null; }

  let fontCatalogOperation=0, fontProgress={active:false,done:0,total:0}, lastFontAnnouncement=0;
  function updateFontProgress(value={}) {
    Object.assign(fontProgress,value);
    let status=$('fontLoadingStatus');
    if(!status) {
      status=document.createElement('div');status.id='fontLoadingStatus';status.className='font-loading-status';
      status.innerHTML='<span id="fontLoadingText" aria-live="off"></span><button id="stopFontLoading" class="square-btn" type="button">Stop loading</button><button id="retryFontLoading" class="square-btn" type="button" hidden>Retry font</button><span id="fontLoadingAnnouncement" class="sr-only" role="status"></span>';
      ($('fontSearch').closest('.search-line')||$('fontSearch').parentElement).append(status);
      status.closest('.panel-body')?.classList.add('has-font-progress');
      $('stopFontLoading').addEventListener('click',()=>{fontCatalogOperation++;window.GeoGlyphFontService.cancelCatalog();updateFontProgress({active:false,message:'Loading stopped · '+fontProgress.done+' fonts catalogued'});});
      $('retryFontLoading').addEventListener('click',()=>prepareSelectedFont({retry:true}));
    }
    const ready=state.fonts.filter(f=>f.exactFace).length,failed=state.fonts.filter(f=>f.faceError).length;
    const text=(fontProgress.message||fontProgress.done+'/'+fontProgress.total+' fonts catalogued')+(!fontProgress.active?' · '+ready+' exact faces ready'+(failed?' · '+failed+' failed':''):'');
    $('fontLoadingText').textContent=text;$('stopFontLoading').hidden=!fontProgress.active;
    $('retryFontLoading').hidden=!selectedFont()?.faceError;
    if(!fontProgress.active||performance.now()-lastFontAnnouncement>1000){$('fontLoadingAnnouncement').textContent=text;lastFontAnnouncement=performance.now();}
  }

  async function prepareSelectedFont(options={}) {
    const font = selectedFont(), generation = ++fontSelectionGeneration;
    if(font) window.GeoGlyphFontService.pin(font,'canvas');
    if (!font || !(font.file || font.metadata || font.arrayBuffer)) return;
    const previousFamily=font.cssFamily, previouslyExact=font.exactFace;
    try { await window.GeoGlyphFontService.ensureFace(font, { ...options,isCurrent: () => generation === fontSelectionGeneration }); delete font.faceError; }
    catch (error) { if (generation === fontSelectionGeneration) {font.faceError=error.message;showToast('Exact font unavailable · ' + error.message);} }
    if (generation !== fontSelectionGeneration) return;
    if(!previouslyExact||previousFamily!==font.cssFamily) { renderFontList(); renderGlyphGrid(); renderGridSelectionPreview(); renderPreview(); }
    if($('fontLoadingStatus'))updateFontProgress();
  }

  function selectFont(fontId) {
    const font=fontById.get(fontId); if(!font)return;
    const changed=state.selectedFontId!==fontId; state.selectedFontId=fontId;
    if(changed) { renderFontList(); renderGlyphGrid(); renderGridSelectionPreview(); renderPreview(); }
    prepareSelectedFont();
  }

  function revealFontSelection() {
    const list=$('fontList'); if(list.querySelector('.font-row.is-active'))return;
    const index=filteredFonts().findIndex(f=>f.id===state.selectedFontId);
    if(index>=0) { list.scrollTop=index*FONT_ROW_HEIGHT; renderFontList(); }
  }

  function handleExplorerKeydown(event) {
    if(event.defaultPrevented||event.isComposing||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)||!document.body.classList.contains('drawer-open'))return;
    const target=event.target,drawer=$('explorerDrawer');
    if(!(target instanceof Element)||(!drawer.contains(target)&&target!==document.body&&!target.closest('.workflow-font-btn')))return;
    if(target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="slider"]'))return;
    if(document.querySelector('dialog[open],.modal-backdrop:not([hidden]),.export-panel.is-open,.magic-eye-fullscreen:not([hidden])'))return;
    event.preventDefault();event.stopPropagation();
    if(event.key==='ArrowUp'||event.key==='ArrowDown') {
      const fonts=filteredFonts();if(!fonts.length)return;
      const direction=event.key==='ArrowDown'?1:-1;
      const current=fonts.findIndex(font=>font.id===state.selectedFontId);
      const index=current<0?(direction>0?0:fonts.length-1):Math.max(0,Math.min(fonts.length-1,current+direction));
      if(index===current)return;
      const font=fonts[index],list=$('fontList');
      const top=index*FONT_ROW_HEIGHT;
      if(top<list.scrollTop)list.scrollTop=top;
      else if(top+FONT_ROW_HEIGHT>list.scrollTop+list.clientHeight)list.scrollTop=top+FONT_ROW_HEIGHT-list.clientHeight;
      renderFontList();
      // Use the same click path as pointer selection, including favourite
      // ownership and asynchronous face preparation supplied by the UI layer.
      [...list.querySelectorAll('[data-font-id]')].find(row=>row.dataset.fontId===font.id)?.click();
      [...list.querySelectorAll('[data-font-id]')].find(row=>row.dataset.fontId===font.id)?.focus({preventScroll:true});
    } else {
      const grid=$('glyphGrid'),stride=grid._virtualStride,gridFocused=grid.contains(target);
      if(!stride||!grid.clientHeight)return;
      grid._pageNavigationVersion=(grid._pageNavigationVersion||0)+1;
      const rows=Math.max(1,Math.floor(grid.clientHeight/stride));
      grid.scrollTop=Math.max(0,Math.min(grid.scrollHeight-grid.clientHeight,grid.scrollTop+(event.key==='ArrowRight'?1:-1)*rows*stride));
      renderGlyphGrid();
      if(gridFocused)grid.focus({preventScroll:true});
    }
  }

  function bindEvents() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener("pointerdown", () => activeRangeDrags.add(slider.id));
      const finishRangeDrag = () => activeRangeDrags.delete(slider.id);
      slider.addEventListener("pointerup", finishRangeDrag);
      slider.addEventListener("pointercancel", finishRangeDrag);
      slider.addEventListener("change", finishRangeDrag);
    });
    $("themeDarkBtn").addEventListener("click", () => setTheme("dark", true));
    $("themeLightBtn").addEventListener("click", () => setTheme("light", true));
    $("aboutBtn").addEventListener("click", openAbout);
    $("closeAboutBtn").addEventListener("click", closeAbout);
    $("aboutModal").addEventListener("pointerdown", event => { if (event.target === $("aboutModal")) closeAbout(); });
    $("codeGridBtn").addEventListener("click", () => setGridView("grid"));
    $("favouritesBtn").addEventListener("click", () => setGridView("favourites"));
    $("addFavouriteBtn").addEventListener("click", toggleSelectedFavourite);
    $("fontSearch").addEventListener("input", renderFontList);
    $("clearFontSearch").addEventListener("click", () => { $("fontSearch").value = ""; renderFontList(); });
    $("scanBtn").addEventListener("click", scanWindowsFonts);
    $("copyBtn").addEventListener("click", copyEsriFontPath);
    $("fontFile").addEventListener("change", onFontFiles);
    $("fontImportBtn")?.addEventListener('click',()=>$('fontFile').click());
    $("openDrawerBtn").addEventListener("click", () => setDrawer(true));
    $("closeDrawerBtn").addEventListener("click", () => setDrawer(false));
    $("drawerScrim").addEventListener("click", () => setDrawer(false));
    document.addEventListener("keydown", event => { if (event.key === "Escape") { setDrawer(false); closeAbout(); } });
    document.addEventListener('keydown',handleExplorerKeydown,true);
    window.addEventListener("resize", syncDrawerEdge);

    document.querySelectorAll("button[data-preview]").forEach(btn => btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (btn.dataset.preview === "magic-eye") { $("magicEyeInput").click(); return; }
      if (btn.dataset.preview === "qreverse" && ["qr", "combined"].includes(state.preview)) state.qreverse.lastDesignPreview = state.preview;
      state.preview = btn.dataset.preview;
      syncPreviewButtons();
      syncPaletteControls();
      syncQrControlAvailability();
      renderPreview();
    }));
    $("magicEyeInput").addEventListener("change", onMagicEyeFile);

        $("applyRange").addEventListener("click", applyRange);
    $("resetRange").addEventListener("click", resetRange);
    $("emojiRange").addEventListener("click", applyEmojiRange);
    $("glyphSearch").addEventListener("input", renderGlyphGrid);
    $("densityBar").querySelectorAll("[data-density]").forEach(btn => btn.addEventListener("click", () => {
      state.density = Number(btn.dataset.density);
      $("densityBar").querySelectorAll("[data-density]").forEach(b => b.classList.toggle("is-active", b === btn));
      applyGlyphGridDensity();
    }));
    $("useSymbolBtn").addEventListener("click", () => { state.logoMode = "symbol"; state.logoName = "Font symbol"; showToast("Selected glyph is now the QR logo source"); renderAll(); });
    $("copyCodeBtn").addEventListener("click", () => copyText(selectedUnicodeLabel(), "Unicode copied"));
    document.querySelectorAll("[data-character-set]").forEach(btn => btn.addEventListener("click", () => applyCharacterSet(btn.dataset.characterSet)));
    $("gridPreviewMinusBtn").addEventListener("click", () => setGridPreviewSize(state.gridPreviewSize - 2));
    $("gridPreviewResetBtn").addEventListener("click", () => setGridPreviewSize(12));
    $("gridPreviewPlusBtn").addEventListener("click", () => setGridPreviewSize(state.gridPreviewSize + 2));
    $("gridPreviewFindBtn").addEventListener("click", findSelectedGlyph);
    document.querySelectorAll("[data-colour-view]").forEach(btn => btn.addEventListener("click", () => {
      state.colourView = btn.dataset.colourView;
      activeColourTarget().mode = state.colourView === "gradient" ? "gradient" : "solid";
      syncPaletteControls();
      renderPreview();
    }));
    document.querySelectorAll("[data-colour-target]").forEach(btn => btn.addEventListener("click", () => {
      state.colourTarget = btn.dataset.colourTarget;
      state.colourView = activeColourTarget().mode === "gradient" ? "gradient" : "palette";
      syncPaletteControls();
    }));

    $("fgColor").addEventListener("input", event => updatePaletteColor(event.target.value));
    $("fgHex").addEventListener("change", event => commitHex(event.target));
    document.querySelectorAll("[data-palette]").forEach(btn => btn.addEventListener("click", () => {
      const colour = btn.dataset.palette.toUpperCase();
      if (!validHex(colour)) return;
      activeColourTarget().solid = colour;
      activeColourTarget().mode = "solid";
      state.colourView = "palette";
      syncPaletteControls(); renderPreview();
    }));

    ["A","B","C","D"].forEach((label,index) => {
      $(`grad${label}Color`).addEventListener("input", event => updateGradientColor(index, event.target.value));
      $(`grad${label}Hex`).addEventListener("change", event => commitGradientHex(index, event.target));
    });
    document.querySelectorAll("[data-gradient-preset]").forEach(btn => btn.addEventListener("click", () => {
      const colors = btn.dataset.gradientPreset.split(",").map(value => value.toUpperCase());
      if (colors.length === 4 && colors.every(validHex)) activeColourTarget().gradient.colors = colors;
      syncPaletteControls(); renderPreview();
    }));
    document.querySelectorAll("[data-gradient-direction]").forEach(btn => btn.addEventListener("click", () => {
      activeColourTarget().gradient.direction = btn.dataset.gradientDirection; activeColourTarget().mode = "gradient"; state.colourView = "gradient"; syncPaletteControls(); renderPreview();
    }));
    $("gradientStopB").addEventListener("input", updateGradientStops);
    $("gradientStopC").addEventListener("input", updateGradientStops);

    $("qrInput").addEventListener("input", renderPreview);
    $("clearContentBtn").addEventListener("click", clearQrContent);
    $("fileName").addEventListener("input", () => {});
    document.querySelectorAll("[data-qr-mode]").forEach(btn => btn.addEventListener("click", () => {
      state.qrMode = btn.dataset.qrMode; syncQrControls(); renderPreview();
    }));
    document.querySelectorAll("[data-qr-level]").forEach(btn => btn.addEventListener("click", () => {
      state.qrLevel = btn.dataset.qrLevel; syncQrControls(); renderPreview();
    }));
    document.querySelectorAll("[data-zone]").forEach(btn => btn.addEventListener("click", () => { state.zone = btn.dataset.zone; syncZoneControls(); }));
    $("zoneSlider").addEventListener("input", event => {
      if (state.zone === "logo") state.logoSize = Number(event.target.value); else state.safeSize = Number(event.target.value);
      syncZoneControls(); renderPreview();
    });
    $("quietSlider").addEventListener("input", event => { state.quietZone = Math.max(1, Math.min(12, Number(event.target.value) || 4)); syncQrControls(); renderPreview(); });
    $("logoInput").addEventListener("change", onLogoFile);
    document.querySelectorAll("[data-logo-crop]").forEach(btn => btn.addEventListener("click", () => {
      state.logoCrop = btn.dataset.logoCrop === "on";
      syncLogoCropControls();
      syncZoneControls();
      renderPreview();
    }));
    $("logoCropBufferDown").addEventListener("click", () => stepLogoCropBuffer(-LOGO_CROP_BUFFER_STEP));
    $("logoCropBufferUp").addEventListener("click", () => stepLogoCropBuffer(LOGO_CROP_BUFFER_STEP));
    $("logoCropEdgeColor").addEventListener("input", event => updateLogoCropEdgeColor(event.target.value));
    $("logoCropEdgeHex").addEventListener("change", event => commitLogoCropEdgeHex(event.target));
    $("logoCropEdgeDown").addEventListener("click", () => stepLogoCropEdge(-LOGO_CROP_EDGE_STEP));
    $("logoCropEdgeUp").addEventListener("click", () => stepLogoCropEdge(LOGO_CROP_EDGE_STEP));
    document.querySelectorAll("[data-logo-corner]").forEach(btn => btn.addEventListener("click", () => {
      state.logoCropCorner = sanitizeLogoCropCorner(btn.dataset.logoCorner);
      syncLogoCropControls();
      renderPreview();
    }));
    $("useSymbolLogoBtn").addEventListener("click", () => {
      state.logoMode = "symbol";
      state.logoName = "Font symbol";
      if (state.preview === "qr") {
        state.preview = "combined";
        state.qreverse.lastDesignPreview = "combined";
      }
      resetExternalLogoAssetCache();
      renderAll();
      showToast("Font symbol logo active");
    });
    $("clearLogoBtn").addEventListener("click", () => { state.logoMode = "none"; state.externalLogoDataUrl = ""; state.logoName = "No logo"; resetExternalLogoAssetCache(); $("logoInput").value = ""; renderAll(); });

    document.querySelectorAll("#shapeBar [data-shape]").forEach(btn => btn.addEventListener("click", () => {
      if (btn.disabled) return; state.symbolShape = btn.dataset.shape; syncSymbolControls(); renderPreview();
    }));
    $("edgeOffBtn").addEventListener("click", () => { state.symbolBorder = false; syncSymbolControls(); renderPreview(); });
    $("borderBtn").addEventListener("click", () => { state.symbolBorder = true; syncSymbolControls(); renderPreview(); });
    $("borderWidth").addEventListener("input", event => { state.borderWidth = Number(event.target.value); syncSymbolControls(); renderPreview(); });
    $("symbolSize").addEventListener("input", event => { state.symbolScale = Number(event.target.value); syncSymbolControls(); renderPreview(); });
    let backdropRenderFrame = 0;
    const backdropSlider = $("backdropSize");
    const queueBackdropRender = () => {
      if (backdropRenderFrame) return;
      backdropRenderFrame = requestAnimationFrame(() => { backdropRenderFrame = 0; renderPreview(); });
    };
    backdropSlider.addEventListener("pointerdown", () => { backdropDragging = true; });
    backdropSlider.addEventListener("input", event => {
      state.bgScale = Number(event.currentTarget.value);
      $("backdropValue").textContent = `${state.bgScale}%`;
      queueBackdropRender();
    });
    const finishBackdropDrag = () => {
      if (!backdropDragging) return;
      backdropDragging = false;
      syncSymbolControls();
      queueBackdropRender();
    };
    backdropSlider.addEventListener("change", finishBackdropDrag);
    backdropSlider.addEventListener("pointerup", finishBackdropDrag);
    backdropSlider.addEventListener("pointercancel", finishBackdropDrag);
    document.querySelectorAll("[data-offset-target]").forEach(btn => btn.addEventListener("click", () => { state.offsetTarget = btn.dataset.offsetTarget; syncSymbolControls(); }));
    document.querySelectorAll("[data-offset-step]").forEach(btn => btn.addEventListener("click", () => { state.offsetStep = Number(btn.dataset.offsetStep); syncSymbolControls(); }));
    document.querySelectorAll("[data-move]").forEach(btn => btn.addEventListener("click", () => {
      const [x, y] = btn.dataset.move.split(",").map(Number); moveOffset(x, y);
    }));
    $("centerOffsetsBtn").addEventListener("click", centerOffsets);

    document.querySelectorAll("[data-export-size]").forEach(btn => btn.addEventListener("click", () => {
      state.exportSize = Number(btn.dataset.exportSize); syncExportControls();
    }));
    $("exportQrPngBtn").addEventListener("click", exportPreviewPng);
    $("exportQrSvgBtn").addEventListener("click", exportPreviewSvg);
    $("exportQrExperimentalSvgBtn").addEventListener("click", exportQrExperimentalSvg);
    $("exportSymbolPngBtn").addEventListener("click", exportSymbolPng);
    $("exportSymbolSvgBtn").addEventListener("click", exportSymbolSvg);
    $("sendSymbolToQrBtn").addEventListener("click", () => { Object.assign(state,getQartDefaults(),{zone:'logo'}); state.logoMode = "symbol"; state.logoName = "Font symbol"; state.preview = "combined"; syncControlsFromState(); renderPreview(); showToast("Symbol sent to QART"); });
    $("opaqueCanvasBtn").addEventListener("click", () => setSymbolCanvasTransparency(false));
    $("transparentCanvasBtn").addEventListener("click", () => setSymbolCanvasTransparency(true));
    $("saveSettingsBtn")?.addEventListener("click", saveSettings);
    $("headerSaveBtn").addEventListener("click", saveSettings);
    $("settingsFileInput").addEventListener("change", loadSettingsFile);
    bindQReverseEvents();
  }

  function renderAll() {
    renderFontList(); renderGlyphGrid(); renderGridSelectionPreview(); syncControlsFromState(); renderPreview(); renderQReverse();
  }

  function syncControlsFromState() {
    syncPreviewButtons(); syncSelection(); syncColourView(); syncPaletteControls(); syncControlModuleVisibility(); syncQrControls(); syncZoneControls(); syncSymbolControls(); syncExportControls(); syncLogoStatus(); syncLogoCropControls(); syncCharacterSetButtons(); syncFavouriteControls(); syncThemeControls();
  }

  function syncControlModuleVisibility() {
    const symbolVisible = state.preview === "symbol";
    const qrVisible = state.preview === "qr" || state.preview === "combined" || state.preview === "magic-eye";
    const symbolModule = $("symbolControlModule");
    const qrModule = $("qrControlModule");
    if (symbolModule) symbolModule.hidden = !symbolVisible;
    if (qrModule) qrModule.hidden = !qrVisible;
    document.querySelector(".workspace")?.classList.toggle("qreverse-active", state.preview === "qreverse");
  }

  const COLOUR_TARGET_LABELS = Object.freeze({ qrBg:"QR BG", qrFg:"QR FG", symbolBg:"Symbol BG", symbolEdge:"Symbol Edge", symbol:"Symbol" });
  function activeTarget() { return state.preview === "symbol" ? "symbol" : state.preview === "magic-eye" ? "image" : "qr"; }
  function activePalette() { return state.palettes[activeTarget()]; }
  function activeColourTarget() { return state.colourTargets[state.colourTarget] || state.colourTargets.qrFg; }
  function targetPaint(ctx, size, key) { const item = state.colourTargets[key]; return item.mode === "gradient" ? makeCanvasGradient(ctx, size, item.gradient) : item.solid; }
  function targetSolid(key) { return state.colourTargets[key]?.solid || "#000000"; }

  function setTheme(theme, persist = true) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    if (persist) localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    syncThemeControls();
    renderGlyphGrid();
    renderGridSelectionPreview();
  }

  function syncThemeControls() {
    const dark = state.theme !== "light";
    $("themeDarkBtn").classList.toggle("is-active", dark);
    $("themeDarkBtn").setAttribute("aria-pressed", String(dark));
    $("themeLightBtn").classList.toggle("is-active", !dark);
    $("themeLightBtn").setAttribute("aria-pressed", String(!dark));
  }

  function openAbout() {
    $("aboutModal").hidden = false;
    document.body.classList.add("modal-open");
    window.setTimeout(() => $("aboutDialog").focus({ preventScroll:true }), 0);
  }

  function closeAbout() {
    const modal = $("aboutModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    $("aboutBtn").focus();
  }

  function loadStoredFavourites() {
    try {
      const values = JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY) || "[]");
      return Array.isArray(values) ? [...new Set(values.map(Number).filter(code => Number.isInteger(code) && code >= 0 && code <= 0x10FFFF))] : [];
    } catch { return []; }
  }

  function persistFavourites() {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(state.favourites));
  }

  function setGridView(view) {
    state.gridView = view === "favourites" ? "favourites" : "grid";
    syncFavouriteControls();
    renderGlyphGrid();
  }

  function toggleSelectedFavourite() {
    const code = Number(state.selectedCode);
    if (!Number.isInteger(code)) return;
    const index = state.favourites.indexOf(code);
    if (index >= 0) {
      state.favourites.splice(index, 1);
      showToast(`${selectedUnicodeLabel(code)} removed from Favourites`);
    } else {
      state.favourites.push(code);
      state.favourites.sort((a, b) => a - b);
      showToast(`${selectedUnicodeLabel(code)} added to Favourites`);
    }
    persistFavourites();
    syncFavouriteControls();
    renderGlyphGrid();
  }

  function syncFavouriteControls() {
    const isFavourites = state.gridView === "favourites";
    $("codeGridBtn").classList.toggle("is-active", !isFavourites);
    $("codeGridBtn").setAttribute("aria-pressed", String(!isFavourites));
    $("favouritesBtn").classList.toggle("is-active", isFavourites);
    $("favouritesBtn").setAttribute("aria-pressed", String(isFavourites));
    $("favouritesCount").textContent = String(state.favourites.length);
    const selected = state.favourites.includes(Number(state.selectedCode));
    $("addFavouriteBtn").classList.toggle("is-active", selected);
    $("addFavouriteBtn").classList.toggle("is-favourite", selected);
    $("addFavouriteBtn").textContent = "Favourite";
    $("addFavouriteBtn").setAttribute("aria-pressed", String(selected));
    $("addFavouriteBtn").title = selected ? "Remove selected character from Favourites" : "Add selected character to Favourites";
  }

  async function scanWindowsFonts() {
    if(typeof window.queryLocalFonts!=='function'){showToast('Browser font scan unavailable — choose font files instead');$('fontFile').click();return;}
    const button=$('scanBtn'),operation=++fontCatalogOperation;
    button.disabled=true;updateFontProgress({active:true,done:0,total:0,message:'Requesting local font access…'});
    try {
      const descriptors=await window.queryLocalFonts();if(operation!==fontCatalogOperation)return;
      const records=descriptors.map(font=>({name:font.fullName||font.postscriptName||font.family,family:font.family,cssFamily:font.family,source:'windows',metadata:font,postscriptName:font.postscriptName||'',style:font.style||''}));
      updateFontProgress({message:'',total:records.length});
      const result=await window.GeoGlyphFontService.catalog(records,addFontRecord,{progress:(done,total)=>{if(operation===fontCatalogOperation)updateFontProgress({done,total});}});
      renderFontList();
      if(operation===fontCatalogOperation){updateFontProgress({active:false,done:result.done,message:result.cancelled?'Loading stopped · '+result.done+' fonts catalogued':''});prepareSelectedFont();button.textContent=String(result.done);button.dataset.hoverTip=result.done+' font faces catalogued · exact faces load when selected';}
    } catch(error){if(operation===fontCatalogOperation){showToast('Windows font scan cancelled or unavailable');updateFontProgress({active:false,message:'Font scan cancelled or unavailable'});}}
    finally{button.disabled=false;}
  }

  async function copyEsriFontPath() { await copyText(ESRI_FONT_PATH, "Esri font path copied"); }

  async function onFontFiles(event) {
    const files=Array.from(event.target.files||[]).filter(f=>/\.(ttf|otf|ttc|otc)$/i.test(f.name));
    const previousSelection=state.selectedFontId,operation=++fontCatalogOperation;let added=0,last=null;
    updateFontProgress({active:true,done:0,total:files.length,message:''});
    try {
      const result=await window.GeoGlyphFontService.catalog(files.map(file=>({name:file.name.replace(/\.(ttf|otf|ttc|otc)$/i,''),family:file.name.replace(/\.(ttf|otf|ttc|otc)$/i,''),source:'file',file})),record=>{const before=state.fonts.length;last=addFontRecord(record);if(state.fonts.length>before)added++;return last;},{progress:(done,total)=>{if(operation===fontCatalogOperation)updateFontProgress({done,total});}});
      if(operation===fontCatalogOperation){if(!result.cancelled&&last&&state.selectedFontId===previousSelection)state.selectedFontId=last.id;updateFontProgress({active:false,done:result.done,message:result.cancelled?'Loading stopped · '+result.done+' fonts catalogued':added+' added · '+(result.done-added)+' reused'});renderAll();prepareSelectedFont();}
    } catch(error){if(operation===fontCatalogOperation){updateFontProgress({active:false,message:'Font import failed · completed fonts were kept'});showToast(error.message);}}
    finally{event.target.value='';}
  }

  async function loadFontFile(file) {
    const font = addFontRecord({ name: file.name.replace(/\.(ttf|otf|ttc)$/i, ''), family: file.name.replace(/\.(ttf|otf|ttc)$/i, ''), source: 'file', file });
    state.selectedFontId = font.id; await prepareSelectedFont(); return font;
  }


  function filteredFonts() {
    const query=$('fontSearch').value.trim().toLowerCase();
    return state.fonts.filter(font=>!query||font.name.toLowerCase().includes(query)||font.source.toLowerCase().includes(query));
  }

  function renderFontList() {
    const list = $('fontList'), focusedId=list.contains(document.activeElement)?document.activeElement.closest('[data-font-id]')?.dataset.fontId:null;
    const fonts = filteredFonts();
    const rowHeight = FONT_ROW_HEIGHT, count = Math.min(48, Math.ceil((list.clientHeight || 500) / rowHeight) * 3);
    const start = Math.max(0, Math.min(Math.max(0, fonts.length - count), Math.floor(list.scrollTop / rowHeight) - Math.floor(count / 3)));
    list.dataset.virtualized = 'true';
    list.innerHTML = '<div aria-hidden="true" style="height:' + (start * rowHeight) + 'px"></div>' + fonts.slice(start, start + count).map(font => '<button class="font-row ' + (font.id === state.selectedFontId ? 'is-active' : '') + '" style="height:' + rowHeight + 'px;min-height:' + rowHeight + 'px" data-font-id="' + escapeAttr(font.id) + '"><strong style="font-family:' + escapeAttr(quoteFont(font.cssFamily)) + '">' + escapeHtml(font.name) + '</strong><span>' + escapeHtml(fontSourceLabel(font)) + '</span></button>').join('') + '<div aria-hidden="true" style="height:' + Math.max(0, (fonts.length - start - count) * rowHeight) + 'px"></div>';
    if(focusedId)[...list.querySelectorAll('[data-font-id]')].find(row=>row.dataset.fontId===focusedId)?.focus({preventScroll:true});
    if (!list.dataset.fontEvents) {
      list.dataset.fontEvents = 'true';
      let frame = 0; list.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; renderFontList(); }); }, { passive: true });
      list.addEventListener('click', event => {
        const row = event.target.closest('[data-font-id]'); if (!row || !fontById.has(row.dataset.fontId)) return;
        selectFont(row.dataset.fontId);
        showToast((selectedFont()?.name || 'Font') + ' selected');
      });
    }
  }


  function fontSourceLabel(font) {
    if (font?.opentypeFont) return "Esri"; if (font?.source === "windows") return "Windows"; if (font?.source === "file") return "File"; return "Preset";
  }

  function setDrawer(open) {
    syncDrawerEdge(); document.body.classList.toggle("drawer-open", open); $("explorerDrawer").setAttribute("aria-hidden", String(!open)); if (open) renderAll();
  }

  function syncDrawerEdge() {
    const middle = document.querySelector(".middle-column"); if (!middle) return;
    document.documentElement.style.setProperty("--drawer-left", `${Math.round(middle.getBoundingClientRect().left)}px`);
  }

  function setDrawerMode() { state.drawerMode = "grid"; renderGlyphGrid(); }

  function syncDrawerMode() {}

  function applyRange() {
    state.rangeStart = Math.max(0, parseInt($("rangeStart").value, 10) || 0);
    state.rangeCount = Math.min(4096, Math.max(16, parseInt($("rangeCount").value, 10) || 224));
    state.characterSet = "custom";
    $("rangeStart").value = state.rangeStart; $("rangeCount").value = state.rangeCount; renderGlyphGrid();
  }

  function resetRange() { applyCharacterSet("all"); }
  function applyEmojiRange() { applyCharacterSet("emoji"); }
  function applyCharacterSet(name) {
    const ranges = {
      all: { start: 32, count: 224 },
      letters: { start: 65, count: 58 },
      symbols: { start: 0x2000, count: 0x700 },
      emoji: { start: 0x1F300, count: 0x800 }
    };
    const range = ranges[name] || ranges.all;
    state.characterSet = name in ranges ? name : "all";
    state.rangeStart = range.start; state.rangeCount = range.count;
    $("rangeStart").value = String(range.start); $("rangeCount").value = String(range.count);
    if (state.characterSet === "emoji") {
      const emojiFont = state.fonts.find(font => /Segoe UI Emoji/i.test(font.name));
      if (emojiFont) state.selectedFontId = emojiFont.id;
    }
    syncCharacterSetButtons(); renderFontList(); renderGlyphGrid(); renderGridSelectionPreview();
  }
  function syncCharacterSetButtons() { document.querySelectorAll("[data-character-set]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.characterSet === state.characterSet)); }


  function renderGlyphGrid() {
    const focusedCode=$('glyphGrid').contains(document.activeElement)&&document.activeElement.dataset.code?Number(document.activeElement.dataset.code):null;
    const font = selectedFont();
    const legacyFamily = legacySymbolFamily(font);
    const query = $("glyphSearch").value.trim().toLowerCase();
    const items = [];
    let codes = state.gridView === "favourites"
      ? [...state.favourites]
      : Array.from({ length: state.rangeCount }, (_, index) => state.rangeStart + index);
    const exactUnicodeSearch = query.match(/^u\+([0-9a-f]{1,6})$/i);
    if (state.gridView !== "favourites" && exactUnicodeSearch) {
      const requestedCode = parseInt(exactUnicodeSearch[1], 16);
      if (requestedCode <= 0x10FFFF && !codes.includes(requestedCode)) codes.unshift(requestedCode);
    }
    const selectedCode = Number(state.selectedCode);
    if (state.gridView !== "favourites" && Number.isInteger(selectedCode) && !codes.includes(selectedCode)) codes.unshift(selectedCode);
    codes=codes.filter(code=>{
      if(code>0x10FFFF||(code>=0xD800&&code<=0xDFFF))return false;
      if(!query)return true;
      const mapped=mappedUnicodeCode(code,font), unicode=mapped==null?'Slot '+Number(code).toString(16):formatUnicode(mapped);
      return displayGlyph(code).toLowerCase().includes(query)||unicode.toLowerCase().includes(query)||String(code).includes(query);
    });
    const grid=$('glyphGrid'), size=Math.max(64,Math.min(220,Number(state.density)||96));
    applyGlyphGridDensity();
    const computed=getComputedStyle(grid), gap=parseFloat(computed.rowGap)||6;
    const columns=Math.max(1,Math.floor((grid.clientWidth-parseFloat(computed.paddingLeft||0)-parseFloat(computed.paddingRight||0)+gap)/(size+gap)));
    const viewKey=[state.gridView,state.rangeStart,state.rangeCount,query,size].join('|');
    if(grid.dataset.viewKey!==viewKey) { grid.scrollTop=0; grid.dataset.viewKey=viewKey; }
    const stride=size+gap, firstRow=Math.max(0,Math.floor(grid.scrollTop/stride)-2), rows=Math.ceil((grid.clientHeight||700)/stride)+4;
    const start=firstRow*columns, end=Math.min(codes.length,(firstRow+rows)*columns), visibleCodes=codes.slice(start,end);
    grid._virtualCodes=codes; grid._virtualColumns=columns; grid._virtualStride=stride;
    // Scrolling inside the same window must not continually detach focused cells.
    const renderSignature=JSON.stringify([viewKey,font?.id,font?.cssFamily,font?.exactFace,columns,visibleCodes]);
    if(grid.dataset.renderSignature===renderSignature){
      grid.querySelectorAll('[data-code]').forEach((cell,i)=>{const active=Number(cell.dataset.code)===Number(state.selectedCode);cell.classList.toggle('is-active',active);cell.setAttribute('aria-current',String(active));cell.tabIndex=active||(!visibleCodes.includes(Number(state.selectedCode))&&i===0)?0:-1;});
      return;
    }
    grid.dataset.renderSignature=renderSignature;
    grid.dataset.virtualized='true'; grid.style.gridAutoRows='auto';
    const spacer=height=>height>0?'<div class="glyph-grid-spacer" aria-hidden="true" style="grid-column:1/-1;height:'+height+'px;min-height:0"></div>':'';
    for (const code of visibleCodes) {
      if (code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) continue;
      let char; try { char = displayGlyph(code); } catch { continue; }
      const mappedCode = mappedUnicodeCode(code, font);
      const unicode = mappedCode == null ? `Slot ${Number(code).toString(16).toUpperCase().padStart(2, "0")} · unmapped` : formatUnicode(mappedCode);
      const emoji = !legacyFamily && isEmojiCodePoint(code);
      const controlCharacter = !legacyFamily && isNonPrintingUnicode(code);
      if (query && !char.toLowerCase().includes(query) && !unicode.toLowerCase().includes(query) && !String(code).includes(query)) continue;
      const family = emoji ? EMOJI_FONT_STACK : quoteFont(font?.cssFamily || "system-ui");
      const glyph = controlCharacter
        ? `<span class="nonprinting-glyph"><b>${escapeHtml(nonPrintingKind(code))}</b><em>${escapeHtml(controlCharacterLabel(code))}</em></span>`
        : legacyFamily
        ? `<canvas aria-label="${escapeAttr(unicode)}" data-legacy-slot="${code}"></canvas>`
        : escapeHtml(char);
      items.push(`<button aria-label="${escapeAttr(`${font?.name || "Font"} ${unicode}${controlCharacter ? ` ${nonPrintingKind(code)} ${controlCharacterLabel(code)}; selectable control character` : ""}`)}" class="glyph-cell ${code === state.selectedCode ? "is-active" : ""} ${controlCharacter ? "is-control-character" : ""}" data-code="${code}"><strong class="${emoji ? "emoji-glyph" : ""}" style="font-family:${escapeAttr(family)}">${glyph}</strong><small>${unicode}</small></button>`);
    }
    $("glyphGrid").innerHTML = items.length
      ? spacer(start?firstRow*stride-gap:0)+items.join("")+spacer(Math.max(0,(Math.ceil(codes.length/columns)-Math.ceil(end/columns))*stride-gap))
      : `<div class="empty-favourites">${state.gridView === "favourites" ? "No favourite characters yet. Select a character and use Favourite." : "No characters match this filter."}</div>`;
    grid.querySelectorAll('[data-code]').forEach((cell,i)=>{const active=Number(cell.dataset.code)===Number(state.selectedCode);cell.style.height=size+'px';cell.setAttribute('aria-current',String(active));cell.tabIndex=active||(!visibleCodes.includes(Number(state.selectedCode))&&i===0)?0:-1;});
    if(focusedCode!==null)grid.querySelector('[data-code="'+focusedCode+'"]')?.focus({preventScroll:true});
    drawLegacyGridGlyphs(font);
    if(!grid.dataset.delegated) {
      grid.dataset.delegated='true'; let frame=0;
      const scheduleGridRender=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;renderGlyphGrid();});};
      grid.addEventListener('scroll',scheduleGridRender,{passive:true});
      // Startup layout and drawer transitions can resize the grid after its
      // first render. Recalculate the virtual window once per animation frame.
      const gridResizeObserver=new ResizeObserver(()=>{
        if(grid.clientWidth>0&&grid.clientHeight>0)scheduleGridRender();
      });
      gridResizeObserver.observe(grid);
      grid.addEventListener('click',event=>{const cell=event.target.closest('[data-code]');if(cell&&!cell.dataset.ownerFont)selectCode(Number(cell.dataset.code));});
      grid.addEventListener('keydown',event=>{
        const cell=event.target.closest('[data-code]');if(!cell||cell.dataset.ownerFont)return;
        const steps={PageDown:grid._virtualColumns*5,PageUp:-grid._virtualColumns*5};
        let index=grid._virtualCodes.indexOf(Number(cell.dataset.code));
        if(event.key==='Home')index=0;else if(event.key==='End')index=grid._virtualCodes.length-1;else if(steps[event.key])index+=steps[event.key];else return;
        event.preventDefault();index=Math.max(0,Math.min(grid._virtualCodes.length-1,index));
        const top=Math.floor(index/grid._virtualColumns)*grid._virtualStride;
        if(top<grid.scrollTop)grid.scrollTop=top;
        else if(top+size>grid.scrollTop+grid.clientHeight)grid.scrollTop=top+size-grid.clientHeight;
        selectCode(grid._virtualCodes[index]); requestAnimationFrame(()=>grid.querySelector('[data-code="'+state.selectedCode+'"]')?.focus({preventScroll:true}));
      });
    }
  }

  function applyGlyphGridDensity() {
    const grid = $("glyphGrid");
    const size = Math.max(64, Math.min(220, Number(state.density) || 96));
    const fontSize = Math.max(28, Math.min(82, Math.round(size * .43)));
    grid.style.setProperty("--glyph-cell-size", `${size}px`);
    grid.style.setProperty("--glyph-font-size", `${fontSize}px`);
    grid.style.gridTemplateColumns = `repeat(auto-fill,minmax(${size}px,1fr))`;
    grid.style.gridAutoRows = grid.dataset.virtualized==='true'?'auto':`${size}px`;
  }

  function renderGridSelectionPreview() {
    const code = state.selectedCode || 65; const emoji = isEmojiCodePoint(code); const font = selectedFont();
    const nonPrinting = false;
    $("gridSelectionGlyph").textContent = nonPrinting ? nonPrintingKind(code) : displayGlyph(code);
    $("gridSelectionGlyph").classList.toggle("is-nonprinting", nonPrinting);
    $("gridSelectionGlyph").classList.toggle("emoji-glyph", emoji);
    $("gridSelectionGlyph").style.fontFamily = emoji ? EMOJI_FONT_STACK : quoteFont(font?.cssFamily || "system-ui");
    $("gridSelectionGlyph").style.setProperty("--grid-preview-size", `${state.gridPreviewSize}rem`);
    $("gridPreviewStatus").textContent = `${state.gridPreviewSize} rem · ${selectedUnicodeLabel(code, font)}`;
  }

  function setGridPreviewSize(value) { state.gridPreviewSize = Math.max(2, Math.min(40, Number(value) || 12)); renderGridSelectionPreview(); }

  function findSelectedGlyph() {
    const code = Number(state.selectedCode);
    if (!Number.isInteger(code)) return;
    if (state.gridView === "favourites" && !state.favourites.includes(code)) setGridView("grid");
    if (state.gridView === "grid" && (code < state.rangeStart || code >= state.rangeStart + state.rangeCount)) {
      state.rangeStart = Math.max(0, code - Math.floor(state.rangeCount / 2));
      $("rangeStart").value = String(state.rangeStart);
      renderGlyphGrid();
    }
    requestAnimationFrame(() => {
      const grid = $("glyphGrid");
      if(grid._virtualCodes) { const index=grid._virtualCodes.indexOf(code); if(index>=0){grid.scrollTop=Math.floor(index/grid._virtualColumns)*grid._virtualStride;renderGlyphGrid();} }
      const cell = grid.querySelector(`[data-code="${code}"]`);
      if (!cell) { showToast("Selected character is outside the active grid"); return; }
      grid.scrollTo({
        top: Math.max(0, cell.offsetTop - (grid.clientHeight - cell.offsetHeight) / 2),
        left: Math.max(0, cell.offsetLeft - (grid.clientWidth - cell.offsetWidth) / 2),
        behavior: grid._virtualCodes ? "instant" : "smooth"
      });
      cell.focus({ preventScroll: true });
      showToast(`${selectedUnicodeLabel(code)} located`);
    });
  }

  function backdropExceedsPreview() {
    const size = PREVIEW_SIZE;
    const referenceScale = size / SYMBOL_REFERENCE_SIZE;
    const half = size * state.bgScale / 200 + (state.symbolBorder ? Math.max(1, state.borderWidth * referenceScale) / 2 : 0);
    const cx = size / 2 + state.bgOffset.x * referenceScale;
    const cy = size / 2 + state.bgOffset.y * referenceScale;
    return cx - half < 0 || cy - half < 0 || cx + half > size || cy + half > size;
  }

  function isEmojiCodePoint(code) {
    try { return /\p{Emoji_Presentation}/u.test(String.fromCodePoint(Number(code))); }
    catch { return false; }
  }
  function displayGlyph(code) { const char = String.fromCodePoint(code); return isEmojiCodePoint(code) ? `${char}️` : char; }

  function isNonPrintingUnicode(code) {
    code = Number(code);
    return code <= 0x001F ||
      (code >= 0x007F && code <= 0x009F) ||
      code === 0x00AD || code === 0x061C || code === 0x180E ||
      (code >= 0x200B && code <= 0x200F) ||
      (code >= 0x2028 && code <= 0x202E) ||
      (code >= 0x2060 && code <= 0x206F) ||
      (code >= 0xFE00 && code <= 0xFE0F) || code === 0xFEFF ||
      (code >= 0xFFF9 && code <= 0xFFFB) ||
      (code >= 0xE0100 && code <= 0xE01EF);
  }

  function nonPrintingKind(code) {
    if (code <= 0x001F || (code >= 0x007F && code <= 0x009F)) return "CONTROL";
    if (code === 0x2028 || code === 0x2029) return "SEPARATOR";
    if ((code >= 0xFE00 && code <= 0xFE0F) || (code >= 0xE0100 && code <= 0xE01EF)) return "VARIATION";
    return "FORMAT";
  }

  function controlCharacterLabel(code) {
    const c0 = ["NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL","BS","TAB","LF","VT","FF","CR","SO","SI","DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB","CAN","EM","SUB","ESC","FS","GS","RS","US"];
    const c1 = ["PAD","HOP","BPH","NBH","IND","NEL","SSA","ESA","HTS","HTJ","VTS","PLD","PLU","RI","SS2","SS3","DCS","PU1","PU2","STS","CCH","MW","SPA","EPA","SOS","SGCI","SCI","CSI","ST","OSC","PM","APC"];
    code = Number(code);
    if (code >= 0 && code <= 0x1F) return c0[code];
    if (code === 0x7F) return "DEL";
    if (code >= 0x80 && code <= 0x9F) return c1[code - 0x80];
    if (code === 0x00AD) return "SHY";
    return `U+${code.toString(16).toUpperCase().padStart(4,"0")}`;
  }

  const legacySymbolMaps = Object.fromEntries(Object.entries(LEGACY_SYMBOL_MAP_DATA).map(([family, data]) => [
    family,
    new Map(data.split(",").filter(Boolean).map(pair => {
      const [slot, unicode] = pair.split(":");
      return [Number(slot), parseInt(unicode, 16)];
    }))
  ]));

  function legacySymbolFamily(font = selectedFont()) {
    const name = `${font?.name || ""} ${font?.cssFamily || ""}`.toLowerCase().replace(/[\s_-]+/g, "");
    if (name.includes("wingdings3")) return "wingdings3";
    if (name.includes("wingdings2")) return "wingdings2";
    if (name.includes("webdings")) return "webdings";
    if (name.includes("wingdings")) return "wingdings";
    return "";
  }

  function mappedUnicodeCode(code, font = selectedFont()) {
    const family = legacySymbolFamily(font);
    return family ? legacySymbolMaps[family]?.get(Number(code)) ?? null : Number(code);
  }

  function selectedUnicodeLabel(code = state.selectedCode, font = selectedFont()) {
    const mapped = mappedUnicodeCode(code, font);
    return mapped == null ? `Legacy slot 0x${Number(code).toString(16).toUpperCase().padStart(2, "0")} · unmapped` : formatUnicode(mapped);
  }

  function drawLegacyGridGlyphs(font = selectedFont()) {
    if (!legacySymbolFamily(font)) return;
    $("glyphGrid").querySelectorAll("canvas[data-legacy-slot]").forEach(canvas => {
      const slot = Number(canvas.dataset.legacySlot);
      const width = 160, height = 112;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas.closest("strong")).color;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `72px ${quoteFont(font?.cssFamily || font?.name || "system-ui")}`;
      ctx.fillText(String.fromCodePoint(slot), width / 2, height / 2);
    });
  }

  function selectCode(code) {
    state.selectedCode = code; state.selectedLabel = displayChar(code); state.selectedKey = findKeyboardKeyForCode(code) || { base: String.fromCodePoint(code), shifted: String.fromCodePoint(code) };
    renderAll();
  }

  function renderKeyboard() {
    const font = selectedFont(); $("shiftBtn").setAttribute("aria-pressed", String(state.qualifiers.shift)); $("shiftBtn").classList.toggle("is-active", state.qualifiers.shift);
    $("keyboardGrid").innerHTML = BASE_KEYS.map(row => `<div class="key-row">${row.map(key => {
      const [base, shifted, wide = 0] = key; const char = resolveKeyChar(base, shifted); const active = state.selectedKey.base === base;
      const display = char.length === 1 ? (char === " " ? "&nbsp;" : escapeHtml(char)) : escapeHtml(keyLabelForDisplay(base, char));
      const style = char.length === 1 ? ` style="font-family:${quoteFont(font?.cssFamily || "system-ui")}"` : "";
      return `<button class="key-button ${active ? "is-active" : ""}" data-base="${escapeAttr(base)}" data-shifted="${escapeAttr(shifted)}" ${wide ? `data-wide="${wide}"` : ""}><span class="key-label">${escapeHtml(formatKeyLabel(base, char))}</span><span class="key-symbol"${style}>${display}</span></button>`;
    }).join("")}</div>`).join("");
    $("keyboardGrid").querySelectorAll("[data-base]").forEach(btn => btn.addEventListener("click", () => { state.selectedKey = { base: btn.dataset.base, shifted: btn.dataset.shifted }; syncSelectedFromKey(); renderAll(); }));
  }

  function syncSelectedFromKey() {
    const char = resolveKeyChar(state.selectedKey.base, state.selectedKey.shifted);
    if (Array.from(char).length === 1) { state.selectedCode = char.codePointAt(0); state.selectedLabel = displayChar(state.selectedCode); }
  }

  function renderDetails() {
    const font = selectedFont(); const char = String.fromCodePoint(state.selectedCode || 65);
    const nonPrinting = false;
    $("detailSymbol").textContent = nonPrinting ? nonPrintingKind(state.selectedCode) : char; $("detailSymbol").style.fontFamily = quoteFont(font?.cssFamily || "system-ui"); $("detailSymbol").style.setProperty("--detail-size", `${state.detailSize}rem`);
    $("detailSymbol").classList.toggle("is-nonprinting", nonPrinting);
    const mappedCode = mappedUnicodeCode(state.selectedCode, font);
    $("detailTitle").textContent = state.selectedLabel || char; $("detailSubcopy").textContent = `${font?.name || "Font"} · ${selectedUnicodeLabel(state.selectedCode, font)}`;
    const codes = legacySymbolFamily(font)
      ? [["Legacy slot", `0x${state.selectedCode.toString(16).toUpperCase().padStart(2,"0")}`],["Unicode", selectedUnicodeLabel(state.selectedCode, font)],["Decimal", mappedCode == null ? "Unmapped" : String(mappedCode)],["Hex", mappedCode == null ? "Unmapped" : mappedCode.toString(16).toUpperCase()]]
      : [["Character", state.selectedLabel || char],["Decimal", String(state.selectedCode)],["Unicode", formatUnicode(state.selectedCode)],["Hex", state.selectedCode.toString(16).toUpperCase()]];
    $("detailCodes").innerHTML = codes.map(([label,value]) => `<button class="detail-code" data-copy="${escapeAttr(value)}">${escapeHtml(label)} ${escapeHtml(value)}</button>`).join("");
    $("detailCodes").querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", () => copyText(btn.dataset.copy, `${btn.dataset.copy} copied`)));
  }

  function setDetailSize(value) { state.detailSize = Math.max(2, Math.min(18, value)); renderDetails(); }

  function syncSelection() {
    $("selectedCharacter").textContent = state.selectedLabel || displayChar(state.selectedCode); $("selectedUnicode").textContent = selectedUnicodeLabel();
    $("fontStatus").textContent = selectedFont()?.name || "No font"; $("codeStatus").textContent = selectedUnicodeLabel(); $("symbolStatus").textContent = state.selectedLabel || displayChar(state.selectedCode);
  }

  function syncPreviewButtons() {
    $("previewStage").dataset.preview = state.preview;
    document.querySelectorAll("button[data-preview]").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.preview === state.preview)));
    document.querySelectorAll("button[data-preview]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.preview === state.preview));
    document.querySelector(".workspace")?.classList.toggle("qreverse-active", state.preview === "qreverse");
    syncQrControlAvailability();
    syncExportControls();
  }

  function syncColourView() {
    document.querySelectorAll("[data-colour-view]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.colourView === state.colourView));
    document.querySelectorAll("[data-colour-pane]").forEach(pane => pane.hidden = pane.dataset.colourPane !== state.colourView);
  }

  function syncPaletteControls() {
    const target = activeColourTarget(); const gradient = target.gradient;
    const status = $("colourTargetStatus"); if (status) status.textContent = COLOUR_TARGET_LABELS[state.colourTarget] || "Target";
    document.querySelectorAll("[data-colour-target]").forEach(btn => {
      const active = btn.dataset.colourTarget === state.colourTarget;
      btn.classList.toggle("is-active", active); btn.setAttribute("aria-pressed", String(active));
    });
    $("fgColor").value = target.solid; $("fgHex").value = target.solid;
    ["A","B","C","D"].forEach((label,index) => { $(`grad${label}Color`).value = gradient.colors[index]; $(`grad${label}Hex`).value = gradient.colors[index]; });
    if (!rangeIsDragging("gradientStopB")) $("gradientStopB").value = gradient.stops[1];
    if (!rangeIsDragging("gradientStopC")) $("gradientStopC").value = gradient.stops[2];
    $("gradientStopBValue").textContent = `${gradient.stops[1]}%`; $("gradientStopCValue").textContent = `${gradient.stops[2]}%`;
    document.querySelectorAll("[data-gradient-direction]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.gradientDirection === gradient.direction));
    $("gradientPreview").style.background = gradientCss(gradient);
    state.colourView = target.mode === "gradient" ? "gradient" : "palette";
    syncColourView();
  }

  function updatePaletteColor(value) { if (!validHex(value)) return; activeColourTarget().solid = value.toUpperCase(); activeColourTarget().mode = "solid"; state.colourView = "palette"; syncPaletteControls(); renderPreview(); }
  function commitHex(input) { if (validHex(input.value)) updatePaletteColor(input.value); else { input.value = activeColourTarget().solid; showToast("Invalid hex colour"); } }
  function updateGradientColor(index, value) { if (!validHex(value)) return; activeColourTarget().gradient.colors[index] = value.toUpperCase(); activeColourTarget().mode = "gradient"; state.colourView = "gradient"; syncPaletteControls(); renderPreview(); }
  function commitGradientHex(index, input) { if (validHex(input.value)) updateGradientColor(index, input.value); else { input.value = activeColourTarget().gradient.colors[index]; showToast("Invalid gradient hex colour"); } }
  function updateGradientStops() { const gradient = activeColourTarget().gradient; let b = Number($("gradientStopB").value), c = Number($("gradientStopC").value); if (b >= c) b = Math.max(10, c - 1); if (c <= b) c = Math.min(90, b + 1); gradient.stops = [0, b, c, 100]; activeColourTarget().mode = "gradient"; state.colourView = "gradient"; syncPaletteControls(); renderPreview(); }

  function syncQrControlAvailability() {
    const disabled = state.preview === "symbol";
    const module = $("qrControlModule");
    if (!module) return;
    module.classList.toggle("is-disabled", disabled);
    module.setAttribute("aria-disabled", String(disabled));
    module.querySelectorAll("button,input,textarea,select").forEach(control => { control.disabled = disabled; });
  }

  function syncQrControls() {
    syncQrControlAvailability();
    document.querySelectorAll("[data-qr-mode]").forEach(btn => { btn.classList.toggle("is-active", btn.dataset.qrMode === state.qrMode); btn.setAttribute("aria-pressed", String(btn.dataset.qrMode === state.qrMode)); });
    document.querySelectorAll("[data-qr-level]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.qrLevel === state.qrLevel));
    updateQrStats();    if (!rangeIsDragging("quietSlider")) $("quietSlider").value = state.quietZone; $("quietValue").textContent = String(state.quietZone);
    syncLogoCropControls();
  }

  function updateQrStats() {
    const used = Array.from($("qrInput").value).length; const limit = QR_LIMITS[state.qrLevel] || QR_LIMITS.H; const over = Math.max(0, used - limit);
    $("qrCharacterStats").textContent = `${used}/${limit} characters used${over ? ` · ${over} character${over === 1 ? '' : 's'} over limit` : ''}`; $("qrCharacterStats").classList.toggle("qr-error", over > 0);
    $("qrStateStatus").textContent = over ? "Too long" : window.QRious ? "Ready" : "Library unavailable"; $("qrStateStatus").classList.toggle("qr-error", over > 0 || !window.QRious);
    return { used, limit, over };
  }

  function getQartDefaults() {
    return {logoSize:LOGO_SIZE_MAX,quietZone:Number($('quietSlider').min),bgScale:Number($('backdropSize').max)};
  }

  function syncZoneControls() {
    const cropActive = isExternalLogoCropActive();
    document.querySelectorAll("[data-zone]").forEach(btn => {
      const selected = btn.dataset.zone === state.zone;
      btn.classList.toggle("is-active", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
    if (state.zone === "logo") {
      $("zoneSlider").disabled = false;
      $("zoneSlider").min = "10";
      $("zoneSlider").max = String(LOGO_SIZE_MAX);
      if (!rangeIsDragging("zoneSlider")) $("zoneSlider").value = state.logoSize;
      $("zoneLabel").textContent = "Logo size";
      $("zoneValue").textContent = `${state.logoSize}%`;
    } else if (cropActive) {
      $("zoneSlider").disabled = true;
      $("zoneSlider").min = String(LOGO_CROP_BUFFER_MIN);
      $("zoneSlider").max = String(LOGO_CROP_BUFFER_MAX);
      if (!rangeIsDragging("zoneSlider")) $("zoneSlider").value = String(state.logoCropBufferPercent);
      $("zoneLabel").textContent = "Logo buffer";
      $("zoneValue").textContent = `${state.logoCropBufferPercent}%`;
    } else {
      $("zoneSlider").disabled = false;
      $("zoneSlider").min = "0";
      $("zoneSlider").max = "48";
      if (!rangeIsDragging("zoneSlider")) $("zoneSlider").value = state.safeSize;
      $("zoneLabel").textContent = "Safe zone";
      $("zoneValue").textContent = `${state.safeSize}px`;
    }
  }

  function isExternalLogoCropActive() {
    return state.logoMode === "image" && Boolean(state.externalLogoDataUrl) && state.logoCrop;
  }

  function resetExternalLogoAssetCache() {
    externalLogoAssetCache = { src: "", promise: null };
  }

  function sanitizeLogoCropBuffer(value) {
    return Math.max(LOGO_CROP_BUFFER_MIN, Math.min(LOGO_CROP_BUFFER_MAX, Math.round(Number(value) || 0)));
  }

  function sanitizeLogoCropCorner(value) {
    return ["sharp", "rounded", "angular", "bsg"].includes(value) ? value : "sharp";
  }

  function sanitizeLogoCropEdgeWidth(value) {
    return Math.max(LOGO_CROP_EDGE_MIN, Math.min(LOGO_CROP_EDGE_MAX, Math.round(Number(value) || 0)));
  }

  function stepLogoCropBuffer(delta) {
    if (!isExternalLogoCropActive()) return;
    state.logoCropBufferPercent = sanitizeLogoCropBuffer(state.logoCropBufferPercent + delta);
    syncLogoCropControls();
    syncZoneControls();
    renderPreview();
  }

  function updateLogoCropEdgeColor(value) {
    if (!validHex(value)) return;
    state.logoCropEdgeColor = value.toUpperCase();
    syncLogoCropControls();
    renderPreview();
  }

  function commitLogoCropEdgeHex(input) {
    const value = String(input.value || "").trim();
    if (!validHex(value)) {
      input.value = state.logoCropEdgeColor;
      showToast("Enter a six-digit hex colour");
      return;
    }
    state.logoCropEdgeColor = value.toUpperCase();
    syncLogoCropControls();
    renderPreview();
  }

  function stepLogoCropEdge(delta) {
    if (!isExternalLogoCropActive()) return;
    state.logoCropEdgeWidth = sanitizeLogoCropEdgeWidth(state.logoCropEdgeWidth + delta);
    syncLogoCropControls();
    renderPreview();
  }

  function syncLogoCropControls() {
    const qrAvailable = state.preview !== "symbol";
    const available = qrAvailable && state.logoMode === "image" && Boolean(state.externalLogoDataUrl);
    const optionsAvailable = available && state.logoCrop;
    const row = $("logoCropRow");
    const optionsRow = $("logoCropOptionsRow");
    const edgeRow = $("logoCropEdgeRow");
    if (row) row.classList.toggle("is-disabled", !available);
    if (optionsRow) optionsRow.classList.toggle("is-disabled", !optionsAvailable);
    if (edgeRow) edgeRow.classList.toggle("is-disabled", !optionsAvailable);
    document.querySelectorAll("[data-logo-crop]").forEach(btn => {
      const active = (btn.dataset.logoCrop === "on") === state.logoCrop;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.disabled = !available;
    });
    state.logoCropBufferPercent = sanitizeLogoCropBuffer(state.logoCropBufferPercent);
    $("logoCropBufferValue").textContent = `${state.logoCropBufferPercent}%`;
    $("logoCropBufferDown").disabled = !optionsAvailable || state.logoCropBufferPercent <= LOGO_CROP_BUFFER_MIN;
    $("logoCropBufferUp").disabled = !optionsAvailable || state.logoCropBufferPercent >= LOGO_CROP_BUFFER_MAX;
    state.logoCropEdgeWidth = sanitizeLogoCropEdgeWidth(state.logoCropEdgeWidth);
    state.logoCropEdgeColor = validHex(state.logoCropEdgeColor) ? state.logoCropEdgeColor.toUpperCase() : "#000000";
    $("logoCropEdgeColor").value = state.logoCropEdgeColor;
    $("logoCropEdgeHex").value = state.logoCropEdgeColor;
    $("logoCropEdgeValue").textContent = `${state.logoCropEdgeWidth} px`;
    $("logoCropEdgeColor").disabled = !optionsAvailable;
    $("logoCropEdgeHex").disabled = !optionsAvailable;
    $("logoCropEdgeDown").disabled = !optionsAvailable || state.logoCropEdgeWidth <= LOGO_CROP_EDGE_MIN;
    $("logoCropEdgeUp").disabled = !optionsAvailable || state.logoCropEdgeWidth >= LOGO_CROP_EDGE_MAX;
    document.querySelectorAll("[data-logo-corner]").forEach(btn => {
      const active = btn.dataset.logoCorner === state.logoCropCorner;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.disabled = !optionsAvailable;
    });
    document.dispatchEvent(new Event('geoglyph:logo-controls-synced'));
  }

  async function onLogoFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    state.externalLogoDataUrl = await readFile(file);
    state.logoMode = "image";
    state.logoName = file.name;
    state.logoCrop = true;
    state.logoCropBufferPercent = 5;
    state.logoCropCorner = "sharp";
    resetExternalLogoAssetCache();
    renderAll();
    showToast(`${file.name} loaded · ${state.logoCropBufferPercent}% logo buffer active`);
  }

  function clearQrContent() {
    const input = $("qrInput");
    input.value = "";
    input.style.height = "";
    input.style.minHeight = "";
    renderPreview();
    showToast("QR content cleared");
  }

  async function onMagicEyeFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) { showToast("Choose an image file"); event.target.value = ""; return; }
    try {
      state.magicEyeDataUrl = await readFile(file);
      state.magicEyeImage = await loadImage(state.magicEyeDataUrl);
      state.magicEyeName = file.name;
      state.preview = "magic-eye";
      syncControlsFromState();
      await renderPreview();
      showToast(`${file.name} loaded into QR pixels`);
    } catch (error) {
      console.error(error);
      showToast("Image could not be loaded");
    } finally {
      event.target.value = "";
    }
  }

  function syncLogoStatus() {
    const status = state.logoMode === "symbol" ? "Font symbol" : state.logoMode === "image" ? state.logoName : "None";
    $("logoSourceStatus").textContent = isExternalLogoCropActive() ? `${status} · buffer ${state.logoCropBufferPercent}% · ${state.logoCropCorner}${state.logoCropEdgeWidth ? ` · edge ${state.logoCropEdgeWidth}px` : ""}` : status;
  }

  function syncSymbolControls() {
    document.querySelectorAll("#shapeBar [data-shape]").forEach(btn => { btn.classList.toggle("is-active", btn.dataset.shape === state.symbolShape); btn.setAttribute("aria-pressed", String(btn.dataset.shape === state.symbolShape)); });
    $("borderBtn").classList.toggle("is-active", state.symbolBorder); $("edgeOffBtn").classList.toggle("is-active", !state.symbolBorder);
    if (!rangeIsDragging("borderWidth")) $("borderWidth").value = state.borderWidth; $("borderWidthValue").textContent = `${state.borderWidth} px`;
    if (!rangeIsDragging("symbolSize")) $("symbolSize").value = state.symbolScale; $("symbolSizeValue").textContent = `${state.symbolScale}%`;
    if (!backdropDragging && !rangeIsDragging("backdropSize")) $("backdropSize").value = state.bgScale; $("backdropValue").textContent = `${state.bgScale}%`;
    const backdropOverflow = backdropExceedsPreview();
    $("backdropValue").classList.toggle("is-overflow", backdropOverflow);
    $("backdropValue").title = backdropOverflow ? "Backdrop extends outside the preview canvas" : "Backdrop fits inside the preview canvas";
    document.querySelectorAll("[data-offset-target]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.offsetTarget === state.offsetTarget));
    document.querySelectorAll("[data-offset-step]").forEach(btn => btn.classList.toggle("is-active", Number(btn.dataset.offsetStep) === state.offsetStep));
    const offset = state.offsetTarget === "symbol" ? state.symbolOffset : state.bgOffset; $("offsetStatus").textContent = `${state.offsetTarget === "symbol" ? "Symbol" : "Backdrop"} offset ${offset.x}, ${offset.y}`;
  }

  function moveOffset(dx, dy) { const offset = state.offsetTarget === "symbol" ? state.symbolOffset : state.bgOffset; offset.x += dx * state.offsetStep; offset.y += dy * state.offsetStep; syncSymbolControls(); renderPreview(); }
  function centerOffsets() { state.symbolOffset = { x: 0, y: 0 }; state.bgOffset = { x: 0, y: 0 }; syncSymbolControls(); renderPreview(); }

  function setSymbolCanvasTransparency(transparent) {
    state.symbolCanvasTransparent = Boolean(transparent);
    syncExportControls();
    if (state.preview === "symbol") renderPreview();
  }

  function syncExportControls() {
    document.querySelectorAll("[data-export-size]").forEach(btn => btn.classList.toggle("is-active", Number(btn.dataset.exportSize) === state.exportSize));
    const transparent = Boolean(state.symbolCanvasTransparent);
    $("opaqueCanvasBtn").classList.toggle("is-active", !transparent);
    $("opaqueCanvasBtn").setAttribute("aria-pressed", String(!transparent));
    $("transparentCanvasBtn").classList.toggle("is-active", transparent);
    $("transparentCanvasBtn").setAttribute("aria-pressed", String(transparent));
    const vectorButton = $("exportQrExperimentalSvgBtn");
    if (vectorButton) {
      vectorButton.disabled = state.preview === "magic-eye";
      vectorButton.title = state.preview === "magic-eye" ? "Magic Eye uses a raster image mask; use PNG or SVG" : "Export true vector QR SVG";
    }
  }

  async function renderPreview() {
    const token = ++state.renderToken; syncSelection(); syncLogoStatus(); syncPaletteControls(); syncControlModuleVisibility(); syncQrControls();
    const canvas = document.createElement('canvas');
    try {
      if (state.preview === "symbol") await drawSymbolToCanvas(canvas, PREVIEW_SIZE, !state.symbolCanvasTransparent);
      else if (state.preview === "qr") await drawQrToCanvas(canvas, PREVIEW_SIZE, false);
      else if (state.preview === "magic-eye") await drawMagicEyeToCanvas(canvas, PREVIEW_SIZE);
      else await drawQrToCanvas(canvas, PREVIEW_SIZE, true);
    } catch (error) {
      if(token===state.renderToken){console.error(error); drawMessage(canvas, "Preview unavailable");}
    }
    if (token !== state.renderToken) return;
    const visible=$('qrCanvas');visible.width=canvas.width;visible.height=canvas.height;visible.getContext('2d').drawImage(canvas,0,0);
  }

  async function drawSymbolToCanvas(canvas, size, fillCanvas) {
    const font = selectedFont(); const code = state.selectedCode || 65;
    if(font&&(font.file||font.metadata||font.arrayBuffer))await window.GeoGlyphFontService.ensureFace(font).catch(()=>null);
    else if(document.fonts.load)await document.fonts.load('32px '+quoteFont(font?.cssFamily||'system-ui'),displayGlyph(code)).catch(()=>null);
    canvas.width = size; canvas.height = size; const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, size, size);
    if (fillCanvas) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0,0,size,size); }
    const referenceScale = size / SYMBOL_REFERENCE_SIZE; const bgSize = size * state.bgScale / 100; const bgX = size / 2 + state.bgOffset.x * referenceScale; const bgY = size / 2 + state.bgOffset.y * referenceScale;
    ctx.save(); symbolShapePath(ctx, state.symbolShape, bgX, bgY, bgSize); ctx.fillStyle = targetPaint(ctx, size, "symbolBg"); ctx.fill();
    if (state.symbolBorder) { symbolShapePath(ctx, state.symbolShape, bgX, bgY, bgSize); ctx.strokeStyle = targetPaint(ctx, size, "symbolEdge"); ctx.lineWidth = Math.max(1, state.borderWidth * referenceScale); ctx.stroke(); } ctx.restore();
    const char = displayGlyph(code); ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `${Math.round(size * .46 * (state.symbolScale / 100))}px ${isEmojiCodePoint(code) ? EMOJI_FONT_STACK : quoteFont(font?.cssFamily || "system-ui")}`;
    ctx.fillStyle = targetPaint(ctx, size, "symbol");
    ctx.fillText(char, size / 2 + state.symbolOffset.x * referenceScale, size / 2 + state.symbolOffset.y * referenceScale); ctx.restore();
  }

  function symbolShapePath(ctx, shape, cx, cy, size) {
    const r = size / 2; ctx.beginPath();
    if (shape === "square") ctx.rect(cx-r, cy-r, size, size);
    else if (shape === "diamond") { ctx.moveTo(cx,cy-r); ctx.lineTo(cx+r,cy); ctx.lineTo(cx,cy+r); ctx.lineTo(cx-r,cy); }
    else if (shape === "hexagon") { for(let i=0;i<6;i+=1){const a=Math.PI/3*i-Math.PI/2;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);} }
    else ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.closePath();
  }

  function symbolShapeSvg(shape,cx,cy,size,fill,stroke,strokeWidth) {
    const r=size/2, attrs=`fill="${fill}" stroke="${stroke}" stroke-width="${formatNumber(strokeWidth)}"`;
    if(shape==="square")return`<rect x="${formatNumber(cx-r)}" y="${formatNumber(cy-r)}" width="${formatNumber(size)}" height="${formatNumber(size)}" ${attrs}/>`;
    if(shape==="diamond")return`<polygon points="${formatNumber(cx)},${formatNumber(cy-r)} ${formatNumber(cx+r)},${formatNumber(cy)} ${formatNumber(cx)},${formatNumber(cy+r)} ${formatNumber(cx-r)},${formatNumber(cy)}" ${attrs}/>`;
    if(shape==="hexagon"){const points=Array.from({length:6},(_,i)=>{const a=Math.PI/3*i-Math.PI/2;return`${formatNumber(cx+Math.cos(a)*r)},${formatNumber(cy+Math.sin(a)*r)}`;}).join(" ");return`<polygon points="${points}" ${attrs}/>`;}
    return`<circle cx="${formatNumber(cx)}" cy="${formatNumber(cy)}" r="${formatNumber(r)}" ${attrs}/>`;
  }

  async function drawQrToCanvas(canvas, size, includeLogo) {
    const stats = updateQrStats(); canvas.width = size; canvas.height = size; const ctx = canvas.getContext("2d"); ctx.clearRect(0,0,size,size);
    ctx.fillStyle = targetPaint(ctx, size, "qrBg"); ctx.fillRect(0,0,size,size);
    const text = $("qrInput").value.trim(); if (!text) { drawMessage(canvas, "Enter QR content"); return; } if (stats.over > 0) { drawMessage(canvas, "QR content exceeds selected correction limit"); return; }
    if (!window.QRious) { drawMessage(canvas, "QRious library unavailable"); return; }
    const matrix = createQrMatrix(text, state.qrLevel); const fgStyle = targetPaint(ctx, size, "qrFg");
    drawQrMatrix(ctx, matrix, size, state.quietZone, state.qrMode, fgStyle);
    if (includeLogo && state.logoMode !== "none") await drawLogo(ctx, size, matrix.modules);
  }

  async function drawMagicEyeToCanvas(canvas, size) {
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = targetPaint(ctx, size, "qrBg");
    ctx.fillRect(0, 0, size, size);
    drawQrMatrix(ctx, magicEyeSvgMatrix(), size, MAGIC_EYE_SVG_QUIET_ZONE, state.qrMode, targetPaint(ctx, size, "qrFg"));
  }

  let magicEyeSvgMatrixCache = null;
  function magicEyeSvgMatrix() {
    if (magicEyeSvgMatrixCache) return magicEyeSvgMatrixCache;
    const binary = atob(MAGIC_EYE_SVG_MATRIX_BASE64);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const matrix = Array.from({ length: MAGIC_EYE_SVG_MODULES }, (_, row) => Array.from({ length: MAGIC_EYE_SVG_MODULES }, (_, col) => {
      const index = row * MAGIC_EYE_SVG_MODULES + col;
      return Boolean(bytes[index >> 3] & (1 << (7 - (index & 7))));
    }));
    magicEyeSvgMatrixCache = { modules: MAGIC_EYE_SVG_MODULES, matrix, source: "magic_eye_qr.svg" };
    return magicEyeSvgMatrixCache;
  }

  function drawImageCover(ctx, image, width, height) {
    const iw = image.naturalWidth || image.width || 1, ih = image.naturalHeight || image.height || 1;
    const scale = Math.max(width / iw, height / ih);
    const w = iw * scale, h = ih * scale;
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
  }

  function createQrMatrix(text, level) {
    const qr = new QRious({ value: text, size: QR_MATRIX_SOURCE_SIZE, padding: 0, level, foreground: "#000000", background: "#ffffff" });
    return extractQrMatrix(qr.canvas);
  }

  function extractQrMatrix(sourceCanvas) {
    const source = sourceCanvas.getContext("2d");
    const image = source.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const { width, height, data } = image;
    const isDark = (x, y) => {
      const i = (y * width + x) * 4;
      return data[i] < 128 && data[i + 1] < 128 && data[i + 2] < 128 && data[i + 3] > 0;
    };

    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!isDark(x, y)) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < minX || maxY < minY) throw new Error("QR matrix is empty");

    // The top edge of the top-left finder is seven contiguous dark modules.
    // Deriving the module scale from that run is stable for every QR version and
    // avoids the previous best-score guess that could select the wrong matrix size.
    let finderRun = 0;
    while (minX + finderRun <= maxX && isDark(minX + finderRun, minY)) finderRun += 1;
    let moduleScale = Math.round(finderRun / 7);
    if (!Number.isFinite(moduleScale) || moduleScale < 1) throw new Error("Unable to determine QR module scale");

    const spanX = maxX - minX + 1;
    const spanY = maxY - minY + 1;
    let modules = Math.round(Math.max(spanX, spanY) / moduleScale);
    const validVersionSize = value => value >= 21 && value <= 177 && (value - 21) % 4 === 0;

    if (!validVersionSize(modules)) {
      // Choose the nearest legal QR size while retaining the measured finder scale.
      let best = 21;
      let bestDelta = Infinity;
      for (let candidate = 21; candidate <= 177; candidate += 4) {
        const delta = Math.abs(candidate * moduleScale - Math.max(spanX, spanY));
        if (delta < bestDelta) { best = candidate; bestDelta = delta; }
      }
      modules = best;
    }

    const matrix = [];
    for (let row = 0; row < modules; row += 1) {
      const line = [];
      for (let col = 0; col < modules; col += 1) {
        const sampleX = Math.min(width - 1, minX + Math.floor((col + 0.5) * moduleScale));
        const sampleY = Math.min(height - 1, minY + Math.floor((row + 0.5) * moduleScale));
        line.push(isDark(sampleX, sampleY));
      }
      matrix.push(line);
    }

    // Reject a bad read rather than drawing a visually plausible but corrupt QR.
    const finderScore = scoreQrMatrix(matrix);
    if (finderScore < 250) throw new Error("QR finder patterns could not be read reliably");
    return { modules, matrix, score: finderScore, moduleScale };
  }

  function scoreQrMatrix(matrix){
    const n=matrix.length;let score=0,total=0;
    const finder=(r0,c0)=>{for(let r=0;r<7;r+=1)for(let c=0;c<7;c+=1){const expected=r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4);score+=matrix[r0+r]?.[c0+c]===expected?4:-6;total+=1;}};
    finder(0,0);finder(0,n-7);finder(n-7,0);
    for(let i=8;i<n-8;i+=1){const expected=i%2===0;score+=matrix[6]?.[i]===expected?1:-1;score+=matrix[i]?.[6]===expected?1:-1;}
    return score+total;
  }

  function drawQrMatrix(ctx, qr, size, quietModules, mode, fillStyle){
    const modules=qr.modules,total=modules+quietModules*2,cell=size/total,offset=quietModules*cell;ctx.save();ctx.fillStyle=fillStyle;
    for(let row=0;row<modules;row+=1)for(let col=0;col<modules;col+=1){if(!qr.matrix[row][col])continue;const x=offset+col*cell,y=offset+row*cell;drawQrModule(ctx,x,y,cell,isFinderZone(row,col,modules)?"square":mode);}
    ctx.restore();
  }

  function isFinderZone(row,col,modules){return(row<8&&col<8)||(row<8&&col>=modules-8)||(row>=modules-8&&col<8);}

  function drawQrModule(ctx,x,y,cell,mode){
    const inset=cell*.07,s=cell-inset*2,cx=x+cell/2,cy=y+cell/2;
    if(mode==="circle"){ctx.beginPath();ctx.arc(cx,cy,cell*.43,0,Math.PI*2);ctx.fill();return;}
    if(mode==="rounded"){roundedRectPath(ctx,x+inset,y+inset,s,s,cell*.25);ctx.fill();return;}
    if(mode==="diamond"){ctx.beginPath();ctx.moveTo(cx,y+inset);ctx.lineTo(x+cell-inset,cy);ctx.lineTo(cx,y+cell-inset);ctx.lineTo(x+inset,cy);ctx.closePath();ctx.fill();return;}
    ctx.fillRect(x,y,cell+.15,cell+.15);
  }

  function roundedRectPath(ctx,x,y,w,h,r){const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.arcTo(x+w,y,x+w,y+h,radius);ctx.arcTo(x+w,y+h,x,y+h,radius);ctx.arcTo(x,y+h,x,y,radius);ctx.arcTo(x,y,x+w,y,radius);ctx.closePath();}

  function qrLogoMetrics(size, modules, quietModules = state.quietZone) {
    const activeExtent = size * modules / (modules + quietModules * 2);
    return {
      activeExtent,
      logoSize: activeExtent * state.logoSize / 100,
      safe: state.safeSize * (activeExtent / PREVIEW_SIZE)
    };
  }

  function safeZoneShape() {
    return state.logoMode === "symbol" ? state.symbolShape : "circle";
  }

  function drawSafeZonePath(ctx, size, logoSize, safe) {
    symbolShapePath(ctx, safeZoneShape(), size / 2, size / 2, logoSize + safe * 2);
  }

  function safeZoneSvgElement(size, logoSize, safe, fill) {
    return symbolShapeSvg(safeZoneShape(), size / 2, size / 2, logoSize + safe * 2, fill, "none", 0);
  }

  async function drawLogo(ctx, size, modules) {
    const { logoSize, safe } = qrLogoMetrics(size, modules);
    const backgroundFill = targetPaint(ctx, size, "qrBg");

    if (isExternalLogoCropActive()) {
      const asset = await getExternalLogoAsset();
      const layout = externalLogoCropLayout(size, logoSize, safe, asset);
      ctx.save();
      drawCropBufferPath(ctx, layout, state.logoCropCorner);
      ctx.fillStyle = backgroundFill;
      ctx.fill();
      ctx.restore();
      drawCropBufferEdge(ctx, layout, state.logoCropCorner, size);
      ctx.drawImage(asset.canvas, layout.imageX, layout.imageY, layout.imageW, layout.imageH);
      return;
    }

    ctx.save();
    drawSafeZonePath(ctx, size, logoSize, safe);
    ctx.fillStyle = backgroundFill;
    ctx.fill();
    ctx.restore();

    if (state.logoMode === "symbol") {
      const temp = document.createElement("canvas");
      await drawSymbolToCanvas(temp, 1024, false);
      ctx.drawImage(temp, size / 2 - logoSize / 2, size / 2 - logoSize / 2, logoSize, logoSize);
    } else if (state.logoMode === "image" && state.externalLogoDataUrl) {
      const image = await loadImage(state.externalLogoDataUrl);
      const ratio = Math.min(logoSize / image.naturalWidth, logoSize / image.naturalHeight);
      const w = image.naturalWidth * ratio, h = image.naturalHeight * ratio;
      ctx.drawImage(image, size / 2 - w / 2, size / 2 - h / 2, w, h);
    }
  }

  async function getExternalLogoAsset() {
    const src = state.externalLogoDataUrl;
    if (!src) throw new Error("No external logo is loaded");
    if (externalLogoAssetCache.src === src && externalLogoAssetCache.promise) return externalLogoAssetCache.promise;
    externalLogoAssetCache = {
      src,
      promise: (async () => {
        const image = await loadImage(src);
        const crop = detectLogoPixelBounds(image);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, crop.width);
        canvas.height = Math.max(1, crop.height);
        const cropCtx = canvas.getContext("2d");
        cropCtx.clearRect(0, 0, canvas.width, canvas.height);
        cropCtx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
        return { image, canvas, width: canvas.width, height: canvas.height, crop };
      })()
    };
    return externalLogoAssetCache.promise;
  }

  function detectLogoPixelBounds(image) {
    const naturalWidth = Math.max(1, image.naturalWidth || image.width || 1);
    const naturalHeight = Math.max(1, image.naturalHeight || image.height || 1);
    const maxAnalysis = 1024;
    const analysisScale = Math.min(1, maxAnalysis / Math.max(naturalWidth, naturalHeight));
    const width = Math.max(1, Math.round(naturalWidth * analysisScale));
    const height = Math.max(1, Math.round(naturalHeight * analysisScale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    const pixels = ctx.getImageData(0, 0, width, height).data;

    let minAlpha = 255;
    for (let i = 3; i < pixels.length; i += 4) minAlpha = Math.min(minAlpha, pixels[i]);
    const transparentBackground = minAlpha < 250;

    let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
    const borderSamples = [];
    const addBorder = (x, y) => {
      const i = (y * width + x) * 4;
      const sample = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
      borderSamples.push(sample);
      if (sample[3] > 16) { bgR += sample[0]; bgG += sample[1]; bgB += sample[2]; bgCount += 1; }
    };
    const borderStep = Math.max(1, Math.floor(Math.max(width, height) / 400));
    for (let x = 0; x < width; x += borderStep) { addBorder(x, 0); if (height > 1) addBorder(x, height - 1); }
    for (let y = borderStep; y < height - 1; y += borderStep) { addBorder(0, y); if (width > 1) addBorder(width - 1, y); }
    if (bgCount) { bgR /= bgCount; bgG /= bgCount; bgB /= bgCount; }
    let variance = 0, varianceCount = 0;
    for (const [r, g, b, a] of borderSamples) {
      if (a <= 16) continue;
      variance += (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
      varianceCount += 1;
    }
    variance = varianceCount ? variance / varianceCount : Infinity;
    const uniformOpaqueBackground = !transparentBackground && variance < 500;
    const colourToleranceSquared = 34 ** 2;

    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const alpha = pixels[i + 3];
        let content = false;
        if (transparentBackground) {
          content = alpha > 18;
        } else if (uniformOpaqueBackground) {
          const dr = pixels[i] - bgR, dg = pixels[i + 1] - bgG, db = pixels[i + 2] - bgB;
          content = alpha > 18 && (dr * dr + dg * dg + db * db) > colourToleranceSquared;
        } else {
          content = alpha > 18;
        }
        if (!content) continue;
        minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    }

    if (maxX < minX || maxY < minY) return { x: 0, y: 0, width: naturalWidth, height: naturalHeight };
    minX = Math.max(0, minX - 1); minY = Math.max(0, minY - 1);
    maxX = Math.min(width - 1, maxX + 1); maxY = Math.min(height - 1, maxY + 1);
    const inverseScale = 1 / analysisScale;
    const x = Math.max(0, Math.floor(minX * inverseScale));
    const y = Math.max(0, Math.floor(minY * inverseScale));
    const right = Math.min(naturalWidth, Math.ceil((maxX + 1) * inverseScale));
    const bottom = Math.min(naturalHeight, Math.ceil((maxY + 1) * inverseScale));
    return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y) };
  }

  function externalLogoCropLayout(size, logoSize, safe, asset) {
    const requestedBufferRatio = sanitizeLogoCropBuffer(state.logoCropBufferPercent) / 100;
    const logoZoneExtent = Math.max(1, Math.min(size, logoSize));
    const safeZoneExtent = Math.max(logoZoneExtent, Math.min(size, logoSize + safe * 2));

    // The cropped logo always uses the full logo zone. Buffer is added outside it and
    // is reduced only when required to remain inside the safe zone and canvas.
    const imageScale = Math.min(logoZoneExtent / asset.width, logoZoneExtent / asset.height);
    const imageW = Math.max(1, asset.width * imageScale);
    const imageH = Math.max(1, asset.height * imageScale);
    const availablePadX = Math.max(0, (safeZoneExtent - imageW) / 2);
    const availablePadY = Math.max(0, (safeZoneExtent - imageH) / 2);
    const requestedPadX = imageW * requestedBufferRatio;
    const requestedPadY = imageH * requestedBufferRatio;
    const padX = Math.min(requestedPadX, availablePadX);
    const padY = Math.min(requestedPadY, availablePadY);
    const clearW = imageW + padX * 2;
    const clearH = imageH + padY * 2;
    const clearX = size / 2 - clearW / 2;
    const clearY = size / 2 - clearH / 2;
    const effectiveBufferRatio = Math.min(
      imageW ? padX / imageW : 0,
      imageH ? padY / imageH : 0
    );
    return {
      clearX, clearY, clearW, clearH,
      imageX: size / 2 - imageW / 2,
      imageY: size / 2 - imageH / 2,
      imageW, imageH,
      padX, padY,
      logoZoneExtent,
      safeZoneExtent,
      requestedBufferRatio,
      effectiveBufferRatio
    };
  }

  function cropCornerCut(layout) {
    // Corner shaping may consume restored buffer, but never the cropped logo pixels.
    return Math.max(0, Math.min(layout.padX, layout.padY, Math.min(layout.clearW, layout.clearH) * 0.12));
  }

  function drawCropBufferPath(ctx, layout, cornerStyle) {
    const { clearX:x, clearY:y, clearW:w, clearH:h } = layout;
    const cut = cropCornerCut(layout);
    ctx.beginPath();
    if (cornerStyle === "rounded") {
      roundedRectPath(ctx, x, y, w, h, cut);
      return;
    }
    if (cornerStyle === "angular") {
      ctx.moveTo(x + cut, y); ctx.lineTo(x + w - cut, y); ctx.lineTo(x + w, y + cut);
      ctx.lineTo(x + w, y + h - cut); ctx.lineTo(x + w - cut, y + h); ctx.lineTo(x + cut, y + h);
      ctx.lineTo(x, y + h - cut); ctx.lineTo(x, y + cut); ctx.closePath();
      return;
    }
    if (cornerStyle === "bsg") {
      ctx.moveTo(x + cut, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h - cut);
      ctx.lineTo(x + w - cut, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + cut); ctx.closePath();
      return;
    }
    ctx.rect(x, y, w, h);
  }

  function cropBufferSvgElement(layout, cornerStyle, fill) {
    const x = layout.clearX, y = layout.clearY, w = layout.clearW, h = layout.clearH;
    const cut = cropCornerCut(layout);
    const attrs = `fill="${fill}"`;
    if (cornerStyle === "rounded") return `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(w)}" height="${formatNumber(h)}" rx="${formatNumber(cut)}" ${attrs}/>`;
    if (cornerStyle === "angular") return `<polygon points="${formatNumber(x+cut)},${formatNumber(y)} ${formatNumber(x+w-cut)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y+cut)} ${formatNumber(x+w)},${formatNumber(y+h-cut)} ${formatNumber(x+w-cut)},${formatNumber(y+h)} ${formatNumber(x+cut)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+h-cut)} ${formatNumber(x)},${formatNumber(y+cut)}" ${attrs}/>`;
    if (cornerStyle === "bsg") return `<polygon points="${formatNumber(x+cut)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y+h-cut)} ${formatNumber(x+w-cut)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+cut)}" ${attrs}/>`;
    return `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(w)}" height="${formatNumber(h)}" ${attrs}/>`;
  }

  function cropBufferEdgeMetrics(layout, size) {
    const requested = sanitizeLogoCropEdgeWidth(state.logoCropEdgeWidth) * (size / PREVIEW_SIZE);
    // Keep the complete edge inside the restored buffer so it cannot cover logo pixels
    // or cross the safe-zone boundary.
    const thickness = Math.max(0, Math.min(requested, layout.padX, layout.padY));
    const inset = thickness / 2;
    return {
      thickness,
      layout: {
        ...layout,
        clearX: layout.clearX + inset,
        clearY: layout.clearY + inset,
        clearW: Math.max(0, layout.clearW - thickness),
        clearH: Math.max(0, layout.clearH - thickness),
        padX: Math.max(0, layout.padX - inset),
        padY: Math.max(0, layout.padY - inset)
      }
    };
  }

  function drawCropBufferEdge(ctx, layout, cornerStyle, size) {
    const edge = cropBufferEdgeMetrics(layout, size);
    if (edge.thickness <= 0 || edge.layout.clearW <= 0 || edge.layout.clearH <= 0) return;
    ctx.save();
    drawCropBufferPath(ctx, edge.layout, cornerStyle);
    ctx.strokeStyle = state.logoCropEdgeColor;
    ctx.lineWidth = edge.thickness;
    ctx.stroke();
    ctx.restore();
  }

  function cropBufferSvgEdgeElement(layout, cornerStyle, stroke, size) {
    const edge = cropBufferEdgeMetrics(layout, size);
    if (edge.thickness <= 0 || edge.layout.clearW <= 0 || edge.layout.clearH <= 0) return "";
    const x = edge.layout.clearX, y = edge.layout.clearY, w = edge.layout.clearW, h = edge.layout.clearH;
    const cut = cropCornerCut(edge.layout);
    const attrs = `fill="none" stroke="${stroke}" stroke-width="${formatNumber(edge.thickness)}"`;
    if (cornerStyle === "rounded") return `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(w)}" height="${formatNumber(h)}" rx="${formatNumber(cut)}" ${attrs}/>`;
    if (cornerStyle === "angular") return `<polygon points="${formatNumber(x+cut)},${formatNumber(y)} ${formatNumber(x+w-cut)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y+cut)} ${formatNumber(x+w)},${formatNumber(y+h-cut)} ${formatNumber(x+w-cut)},${formatNumber(y+h)} ${formatNumber(x+cut)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+h-cut)} ${formatNumber(x)},${formatNumber(y+cut)}" ${attrs}/>`;
    if (cornerStyle === "bsg") return `<polygon points="${formatNumber(x+cut)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y)} ${formatNumber(x+w)},${formatNumber(y+h-cut)} ${formatNumber(x+w-cut)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+h)} ${formatNumber(x)},${formatNumber(y+cut)}" ${attrs}/>`;
    return `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(w)}" height="${formatNumber(h)}" ${attrs}/>`;
  }

  function makeCanvasGradient(ctx,size,gradient) {
    let result; if (gradient.direction === "vertical") result=ctx.createLinearGradient(0,0,0,size); else if (gradient.direction === "diagonal") result=ctx.createLinearGradient(0,0,size,size); else if (gradient.direction === "radial") result=ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size*.7); else result=ctx.createLinearGradient(0,0,size,0);
    gradient.colors.forEach((color,index)=>result.addColorStop(Math.max(0,Math.min(1,gradient.stops[index]/100)),color)); return result;
  }

  function gradientCss(gradient) { const angle=gradient.direction==="vertical"?"180deg":gradient.direction==="diagonal"?"135deg":"90deg";const stops=gradient.colors.map((color,index)=>`${color} ${gradient.stops[index]}%`).join(",");return gradient.direction==="radial"?`radial-gradient(circle,${stops})`:`linear-gradient(${angle},${stops})`; }

  function drawMessage(canvas,text) { const ctx=canvas.getContext("2d"); const symbolMode=state.preview==="symbol"; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle=targetPaint(ctx,canvas.width,symbolMode?"symbolBg":"qrBg"); ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle=targetPaint(ctx,canvas.width,symbolMode?"symbol":"qrFg"); ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font=`600 ${Math.round(canvas.width*.032)}px Oxanium, sans-serif`; ctx.fillText(text,canvas.width/2,canvas.height/2); }

  async function renderCurrentPreviewToCanvas(canvas, size) {
    if (state.preview === "symbol") await drawSymbolToCanvas(canvas, size, false);
    else if (state.preview === "magic-eye") await drawMagicEyeToCanvas(canvas, size);
    else await drawQrToCanvas(canvas, size, state.preview === "combined");
  }

  function blockNonPrintingSymbolExport() {
    return false;
  }

  async function exportPreviewPng() {
    if (blockNonPrintingSymbolExport()) return;
    const canvas=document.createElement("canvas"); await renderCurrentPreviewToCanvas(canvas,state.exportSize); download(canvas.toDataURL("image/png"),`${sanitizeFilename($("fileName").value)}-${state.preview}.png`);
  }

  async function exportPreviewSvg() {
    if (blockNonPrintingSymbolExport()) return;
    const canvas=document.createElement("canvas"); await renderCurrentPreviewToCanvas(canvas,state.exportSize); const png=canvas.toDataURL("image/png"); const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${state.exportSize}" height="${state.exportSize}" viewBox="0 0 ${state.exportSize} ${state.exportSize}"><image width="${state.exportSize}" height="${state.exportSize}" href="${png}"/></svg>`; download(URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})),`${sanitizeFilename($("fileName").value)}-${state.preview}.svg`,true);
  }

  async function exportSymbolPng() { if(blockNonPrintingSymbolExport())return;const canvas=document.createElement("canvas"); await drawSymbolToCanvas(canvas,state.exportSize,!state.symbolCanvasTransparent); download(canvas.toDataURL("image/png"),`${sanitizeFilename($("symbolFileName").value)}.png`); }

  async function exportSymbolSvg() {
    if (blockNonPrintingSymbolExport()) return;
    const size=state.exportSize; const font=selectedFont(); const char=String.fromCodePoint(state.selectedCode||65); const referenceScale=size/SYMBOL_REFERENCE_SIZE; const bgSize=size*state.bgScale/100; const bgX=size/2+state.bgOffset.x*referenceScale; const bgY=size/2+state.bgOffset.y*referenceScale; const symbolX=size/2+state.symbolOffset.x*referenceScale; const symbolY=size/2+state.symbolOffset.y*referenceScale;
    const backdropStyle=svgTargetStyle("symbolBackdrop","symbolBg"), edgeStyle=svgTargetStyle("symbolEdge","symbolEdge"), glyphStyle=svgTargetStyle("symbolGlyph","symbol");
    const defs=backdropStyle.defs+edgeStyle.defs+glyphStyle.defs;
    const shape=symbolShapeSvg(state.symbolShape,bgX,bgY,bgSize,backdropStyle.fill,state.symbolBorder?edgeStyle.fill:"none",state.symbolBorder?state.borderWidth*referenceScale:0);
    const canvasFill=state.symbolCanvasTransparent?"":'<rect width="100%" height="100%" fill="#FFFFFF"/>';
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs}${canvasFill}${shape}<text x="${formatNumber(symbolX)}" y="${formatNumber(symbolY)}" fill="${glyphStyle.fill}" font-family="${escapeAttr(font?.name||"system-ui")}" font-size="${formatNumber(size*.46*(state.symbolScale/100))}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(char)}</text></svg>`;
    download(URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})),`${sanitizeFilename($("symbolFileName").value)}.svg`,true);
  }

  async function exportQrExperimentalSvg() {
    const text=$("qrInput").value.trim();if(!text||!window.QRious){showToast("QR content or library unavailable");return;}const size=state.exportSize,bgStyle=svgTargetStyle("qrBg","qrBg"),fgStyle=svgTargetStyle("qrFg","qrFg"),defs=bgStyle.defs+fgStyle.defs,bgFill=bgStyle.fill,fgFill=fgStyle.fill,qr=createQrMatrix(text,state.qrLevel),cells=renderQrSvgCells(qr,size,state.quietZone,state.qrMode);
    let logo="";if(state.preview==="combined"&&state.logoMode!=="none"){const metrics=qrLogoMetrics(size,qr.modules,state.quietZone),logoSize=metrics.logoSize,safe=metrics.safe;if(isExternalLogoCropActive()){const asset=await getExternalLogoAsset(),layout=externalLogoCropLayout(size,logoSize,safe,asset),croppedDataUrl=asset.canvas.toDataURL("image/png");logo+=`${cropBufferSvgElement(layout,state.logoCropCorner,bgFill)}${cropBufferSvgEdgeElement(layout,state.logoCropCorner,state.logoCropEdgeColor,size)}<image x="${formatNumber(layout.imageX)}" y="${formatNumber(layout.imageY)}" width="${formatNumber(layout.imageW)}" height="${formatNumber(layout.imageH)}" preserveAspectRatio="none" href="${croppedDataUrl}"/>`;}else{logo+=safeZoneSvgElement(size,logoSize,safe,bgFill);if(state.logoMode==="symbol")logo+=await renderSymbolSvgFragment(size,logoSize);else if(state.logoMode==="image"&&state.externalLogoDataUrl)logo+=`<image x="${formatNumber(size/2-logoSize/2)}" y="${formatNumber(size/2-logoSize/2)}" width="${formatNumber(logoSize)}" height="${formatNumber(logoSize)}" preserveAspectRatio="xMidYMid meet" href="${state.externalLogoDataUrl}"/>`;}}
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs}<rect width="100%" height="100%" fill="${bgFill}"/><g fill="${fgFill}">${cells}</g>${logo}</svg>`;download(URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})),`${sanitizeFilename($("fileName").value)}-vector.svg`,true);
  }

  function renderQrSvgCells(qr,size,quietModules,mode){const total=qr.modules+quietModules*2,cell=size/total,offset=quietModules*cell,p=[];for(let row=0;row<qr.modules;row+=1)for(let col=0;col<qr.modules;col+=1){if(!qr.matrix[row][col])continue;const x=offset+col*cell,y=offset+row*cell,shape=isFinderZone(row,col,qr.modules)?"square":mode,cx=x+cell/2,cy=y+cell/2,inset=cell*.07,s=cell-inset*2;if(shape==="circle")p.push(`<circle cx="${formatNumber(cx)}" cy="${formatNumber(cy)}" r="${formatNumber(cell*.43)}"/>`);else if(shape==="rounded")p.push(`<rect x="${formatNumber(x+inset)}" y="${formatNumber(y+inset)}" width="${formatNumber(s)}" height="${formatNumber(s)}" rx="${formatNumber(cell*.25)}"/>`);else if(shape==="diamond")p.push(`<polygon points="${formatNumber(cx)},${formatNumber(y+inset)} ${formatNumber(x+cell-inset)},${formatNumber(cy)} ${formatNumber(cx)},${formatNumber(y+cell-inset)} ${formatNumber(x+inset)},${formatNumber(cy)}"/>`);else p.push(`<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(cell+.15)}" height="${formatNumber(cell+.15)}"/>`);}return p.join("");}

  async function renderSymbolSvgFragment(size,logoSize){const font=selectedFont(),char=String.fromCodePoint(state.selectedCode||65),scale=logoSize/SYMBOL_REFERENCE_SIZE,cx=size/2,cy=size/2,bgSize=logoSize*state.bgScale/100,bgX=cx+state.bgOffset.x*scale,bgY=cy+state.bgOffset.y*scale,symbolX=cx+state.symbolOffset.x*scale,symbolY=cy+state.symbolOffset.y*scale,backdropStyle=svgTargetStyle("logoBackdrop","symbolBg"),edgeStyle=svgTargetStyle("logoEdge","symbolEdge"),glyphStyle=svgTargetStyle("logoGlyph","symbol"),defs=backdropStyle.defs+edgeStyle.defs+glyphStyle.defs,shape=symbolShapeSvg(state.symbolShape,bgX,bgY,bgSize,backdropStyle.fill,state.symbolBorder?edgeStyle.fill:"none",state.symbolBorder?state.borderWidth*scale:0);return `${defs}<g>${shape}<text x="${formatNumber(symbolX)}" y="${formatNumber(symbolY)}" fill="${glyphStyle.fill}" font-family="${escapeAttr(font?.name||"system-ui")}" font-size="${formatNumber(logoSize*.46*(state.symbolScale/100))}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(char)}</text></g>`;}

  function svgGradientDefs(prefix,gradient){const id=`${prefix}Gradient`,stops=gradient.colors.map((color,index)=>`<stop offset="${gradient.stops[index]}%" stop-color="${color}"/>`).join("");if(gradient.direction==="radial")return`<defs><radialGradient id="${id}" cx="50%" cy="50%" r="70%">${stops}</radialGradient></defs>`;const coords=gradient.direction==="vertical"?`x1="0" y1="0" x2="0" y2="1"`:gradient.direction==="diagonal"?`x1="0" y1="0" x2="1" y2="1"`:`x1="0" y1="0" x2="1" y2="0"`;return`<defs><linearGradient id="${id}" ${coords}>${stops}</linearGradient></defs>`;}
  function svgTargetStyle(prefix,key){const target=state.colourTargets[key];return target.mode==="gradient"?{defs:svgGradientDefs(prefix,target.gradient),fill:`url(#${prefix}Gradient)`}:{defs:"",fill:escapeAttr(target.solid)};}

  function bindQReverseEvents() {
    $("qreverseImportImagesBtn").addEventListener("click", () => $("qreverseImageInput").click());
    $("qreverseImportFolderBtn").addEventListener("click", () => $("qreverseFolderInput").click());
    $("qreverseImportCsvBtn").addEventListener("click", () => $("qreverseCsvInput").click());
    $("qreverseImageInput").addEventListener("change", event => importQReverseImages([...event.target.files], event.target));
    $("qreverseFolderInput").addEventListener("change", event => importQReverseImages([...event.target.files], event.target));
    $("qreverseCsvInput").addEventListener("change", importQReverseCsv);
    $("qreverseScanBtn").addEventListener("click", scanQReverseQueue);
    $("qreverseResetBtn").addEventListener("click", resetSelectedQReverseRows);
    $("qreverseResetModuleBtn").addEventListener("click", resetQReverseModule);
    $("qreverseClearResultsBtn").addEventListener("click", clearQReverseResults);
    $("qreverseExportCsvBtn").addEventListener("click", exportQReverseCsv);
    $("qreverseMakeQrBtn").addEventListener("click", () => sendQReverseValueToDesigner("qr"));
    $("qreverseDesignBtn").addEventListener("click", () => sendQReverseValueToDesigner(state.qreverse.lastDesignPreview || "combined"));
    $("qreverseBatchDownloadBtn").addEventListener("click", () => exportQReverseBatch("download"));
    $("qreverseBatchFolderBtn").addEventListener("click", () => exportQReverseBatch("files"));
    $("qreverseBatchZipFolderBtn").addEventListener("click", () => exportQReverseBatch("zip-folder"));
    $("qreverseStub").addEventListener("input", event => { state.qreverse.stub = event.target.value; });
    $("qreverseSelectAll").addEventListener("change", event => { state.qreverse.rows.forEach(row => { row.selected = event.target.checked; }); renderQReverse(); });
    $("qreverseBody").addEventListener("change", event => {
      const box = event.target.closest("[data-qreverse-id]");
      if (!box) return;
      const row = state.qreverse.rows.find(item => item.id === Number(box.dataset.qreverseId));
      if (row) { row.selected = box.checked; renderQReverse(); }
    });
  }

  function restoreQReverseSettings(settings) {
    const saved = settings?.qreverse;
    if (!saved || typeof saved !== "object") return;
    state.qreverse.stub = typeof saved.stub === "string" ? saved.stub : "geoglyph-batch";
    state.qreverse.lastDesignPreview = ["qr", "combined"].includes(saved.lastDesignPreview) ? saved.lastDesignPreview : "combined";
    if (!Array.isArray(saved.rows)) return;
    state.qreverse.rows = saved.rows.slice(0, 10000).map((source, index) => {
      const row = source && typeof source === "object" ? source : {};
      const type = ["CSV", "Pasted"].includes(row.source) ? row.source : "Image";
      let status = typeof row.status === "string" ? row.status : type === "Image" ? "Needs reattachment" : "Processed";
      if (type === "Image" && ["Queued", "Scanning"].includes(status)) status = "Needs reattachment";
      return {
        id: Number.isInteger(Number(row.id)) ? Number(row.id) : index + 1,
        groupId: typeof row.groupId === "string" ? row.groupId : `loaded-${index + 1}`,
        source: type,
        value: typeof row.value === "string" ? row.value : "",
        selected: row.selected !== false,
        status,
        error: typeof row.error === "string" ? row.error : "",
        filename: typeof row.filename === "string" ? row.filename : "",
        path: typeof row.path === "string" ? row.path : "",
        size: Number.isFinite(Number(row.size)) ? Number(row.size) : 0,
        lastModified: Number.isFinite(Number(row.lastModified)) ? Number(row.lastModified) : 0,
        file: null
      };
    });
    state.qreverse.nextId = Math.max(0, ...state.qreverse.rows.map(row => row.id)) + 1;
  }

  async function initialiseQReverseScanner() {
    const status = $("qreverseScannerStatus");
    try {
      if ("BarcodeDetector" in window) {
        const formats = await BarcodeDetector.getSupportedFormats();
        if (formats.includes("qr_code")) {
          state.qreverse.scanner = new BarcodeDetector({ formats: ["qr_code"] });
          state.qreverse.scannerMode = "native";
          status.textContent = "Scanner ready · native";
          status.className = "small-status green";
          renderQReverse();
          return;
        }
      }
    } catch (error) { console.warn("Native QR scanner unavailable", error); }
    if (typeof window.jsQR === "function") {
      state.qreverse.scanner = { detect: detectQReverseWithJsQr };
      state.qreverse.scannerMode = "jsqr";
      status.textContent = "Scanner ready · offline jsQR";
      status.className = "small-status green";
    } else {
      status.textContent = "Scanner unavailable";
      status.className = "small-status red";
    }
    renderQReverse();
  }

  function qreverseFileMetadata(file) {
    return { filename: file.name, path: file.webkitRelativePath || file._dropPath || file.name, size: file.size, lastModified: file.lastModified };
  }

  function qreverseFileKey(meta) { return `${meta.path}|${meta.size}|${meta.lastModified}`; }

  function isQReverseBusy() { return state.qreverse.scanning || state.qreverse.exporting || state.qreverse.importing; }

  async function runQReverseImport(importer) {
    if (isQReverseBusy()) return;
    state.qreverse.importing = true;
    renderQReverse();
    try { return await importer(); }
    finally { state.qreverse.importing = false; renderQReverse(); }
  }

  function importQReverseImages(files, input) {
    if (isQReverseBusy()) { input.value = ''; return; }
    const images = files.filter(file => file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|avif)$/i.test(file.name));
    const existing = new Set(state.qreverse.rows.filter(row => row.source === "Image" && row.file).map(row => qreverseFileKey(row)));
    for (const file of images) {
      const meta = qreverseFileMetadata(file);
      const waiting = state.qreverse.rows.find(row => row.source === "Image" && !row.file && row.status === "Needs reattachment" && qreverseFileKey(row) === qreverseFileKey(meta));
      if (waiting) {
        waiting.file = file; waiting.status = "Queued"; waiting.error = ""; waiting.value = ""; waiting.selected = true;
        continue;
      }
      if (existing.has(qreverseFileKey(meta))) continue;
      existing.add(qreverseFileKey(meta));
      state.qreverse.rows.push({ id: state.qreverse.nextId++, groupId: `image-${state.qreverse.nextId}`, source: "Image", value: "", selected: true, status: "Queued", error: "", file, ...meta });
    }
    input.value = "";
    if (files.length && !images.length) showToast("No supported image files found");
    else if (images.length) showToast(`${images.length} image${images.length === 1 ? "" : "s"} queued`);
    renderQReverse();
  }

  async function importQReverseCsv(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    return runQReverseImport(async () => {
    try {
      const values = parseSingleColumnCsv(await readTextFile(file));
      values.forEach(value => state.qreverse.rows.push({ id: state.qreverse.nextId++, groupId: "", source: "CSV", value, selected: true, status: "Processed", error: "", filename: file.name, path: file.name, size: file.size, lastModified: file.lastModified, file: null }));
      showToast(`${values.length} CSV value${values.length === 1 ? "" : "s"} imported`);
    } catch (error) { showToast(error.message || "CSV could not be imported"); }
    finally { event.target.value = ""; renderQReverse(); }
    });
  }

  function parseSingleColumnCsv(text) {
    const rows = []; let row = [], field = "", quoted = false;
    const source = String(text || "").replace(/^\uFEFF/, "");
    for (let i = 0; i <= source.length; i += 1) {
      const char = source[i] ?? "\n";
      if (quoted) {
        if (char === '"' && source[i + 1] === '"') { field += '"'; i += 1; }
        else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"' && field === "") quoted = true;
      else if (char === ",") { row.push(field); field = ""; }
      else if (char === "\n" || char === "\r") {
        if (char === "\r" && source[i + 1] === "\n") i += 1;
        row.push(field); field = "";
        if (row.some(value => value.trim() !== "")) {
          if (row.length !== 1) throw new Error("CSV must contain exactly one column");
          rows.push(row[0]);
        }
        row = [];
      } else field += char;
    }
    if (quoted) throw new Error("CSV contains an unterminated quoted value");
    return rows;
  }

  async function detectQReverseWithJsQr(bitmap) {
    const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { willReadFrequently: true }); context.drawImage(bitmap, 0, 0);
    const detections = [];
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(image.data, image.width, image.height, { inversionAttempts: "attemptBoth" });
      if (!code) break;
      detections.push({ rawValue: code.data || "", format: "qr_code" });
      maskQReverseRegion(context, code.location, canvas.width, canvas.height);
    }
    return detections;
  }

  function maskQReverseRegion(context, location, width, height) {
    const points = [location.topLeftCorner, location.topRightCorner, location.bottomRightCorner, location.bottomLeftCorner];
    const xs = points.map(point => point.x), ys = points.map(point => point.y);
    const padding = Math.max(12, Math.round(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * .18));
    const left = Math.max(0, Math.floor(Math.min(...xs) - padding)), top = Math.max(0, Math.floor(Math.min(...ys) - padding));
    const right = Math.min(width, Math.ceil(Math.max(...xs) + padding)), bottom = Math.min(height, Math.ceil(Math.max(...ys) + padding));
    context.fillStyle = "#fff"; context.fillRect(left, top, right - left, bottom - top);
  }

  async function scanQReverseQueue() {
    if (isQReverseBusy()) return;
    const queue = state.qreverse.rows.filter(row => row.source === "Image" && row.status === "Queued" && row.file);
    if (!state.qreverse.scanner) { showToast("QR scanner is unavailable"); return; }
    if (!queue.length || state.qreverse.scanning) { showToast(queue.length ? "Scan already running" : "No queued images to scan"); return; }
    state.qreverse.scanning = true; renderQReverse();
    for (let index = 0; index < queue.length; index += 1) {
      const row = queue[index]; row.status = "Scanning"; setQReverseProgress(index, queue.length, `Scanning ${row.filename}`); renderQReverse();
      try {
        const bitmap = await createImageBitmap(row.file); let codes;
        try { codes = await state.qreverse.scanner.detect(bitmap); } finally { bitmap.close?.(); }
        if (!codes.length) { row.status = "No QR found"; row.value = ""; }
        else {
          row.value = codes[0].rawValue ?? ""; row.status = "Processed"; row.error = "";
          const position = state.qreverse.rows.indexOf(row);
          const siblings = codes.slice(1).map(code => ({ ...row, id: state.qreverse.nextId++, value: code.rawValue ?? "", file: row.file }));
          state.qreverse.rows.splice(position + 1, 0, ...siblings);
        }
      } catch (error) { row.status = "Error"; row.error = error?.message || String(error); row.value = ""; }
      renderQReverse();
    }
    state.qreverse.scanning = false; setQReverseProgress(queue.length, queue.length, "Scan complete"); renderQReverse(); showToast("QReverse scan complete");
  }

  function resetSelectedQReverseRows() {
    if (isQReverseBusy()) return;
    const groups = new Set(state.qreverse.rows.filter(row => row.selected && row.source === "Image").map(row => row.groupId));
    if (!groups.size) { showToast("Select processed image rows to reset"); return; }
    const rebuilt = [];
    for (const row of state.qreverse.rows) {
      if (!groups.has(row.groupId)) { rebuilt.push(row); continue; }
      if (rebuilt.some(item => item.groupId === row.groupId)) continue;
      rebuilt.push({ ...row, value: "", error: "", status: row.file ? "Queued" : "Needs reattachment", selected: true });
    }
    state.qreverse.rows = rebuilt; renderQReverse(); showToast("Selected image rows reset");
  }

  function resetQReverseModule() {
    if (isQReverseBusy()) return;
    Object.assign(state.qreverse, { rows:[], nextId:1, stub:'geoglyph-batch', lastDesignPreview:'combined' });
    ['qreverseImageInput','qreverseFolderInput','qreverseCsvInput'].forEach(id => { $(id).value = ''; });
    document.dispatchEvent(new CustomEvent('geoglyph:qreverse-reset', {detail:{module:true}}));
    renderQReverse();
    showToast('Scan QR module reset');
  }

  function clearQReverseResults() {
    if (isQReverseBusy()) return;
    const groups = new Map(), rebuilt = [];
    for (const row of state.qreverse.rows) {
      if (row.source !== 'Image') { rebuilt.push(row); continue; }
      const key = row.groupId || `row-${row.id}`;
      const existing = groups.get(key);
      if (existing) {
        existing.file ||= row.file;
        existing.selected ||= row.selected;
        if (existing.file) existing.status = 'Queued';
        continue;
      }
      const input = {...row, value:'', error:'', status:row.file ? 'Queued' : 'Needs reattachment'};
      groups.set(key, input);
      rebuilt.push(input);
    }
    state.qreverse.rows = rebuilt;
    document.dispatchEvent(new CustomEvent('geoglyph:qreverse-reset', {detail:{module:false}}));
    renderQReverse();
    showToast('Image results cleared; inputs retained');
  }

  function selectedQReverseValues() { return state.qreverse.rows.filter(row => row.selected && row.value).map(row => row.value); }

  function sendQReverseValueToDesigner(preview) {
    const value = selectedQReverseValues()[0];
    if (!value) { showToast("Select a row containing a QR value"); return; }
    $("qrInput").value = value; state.preview = preview === "combined" ? "combined" : "qr"; state.qreverse.lastDesignPreview = state.preview;
    syncControlsFromState(); updateQrStats(); renderPreview(); showToast(preview === "qr" ? "Value sent to QR maker" : "Batch template ready for design");
  }

  function exportQReverseCsv() {
    const values = selectedQReverseValues();
    if (!values.length) { showToast("No selected QR values to export"); return; }
    const csv = ["qr_value", ...values.map(value => `"${String(value).replace(/"/g, '""')}"`)].join("\r\n");
    download(URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), `${sanitizeFilename(state.qreverse.stub)}.csv`, true);
  }

  function canvasToBlob(canvas) { return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG encoding failed")), "image/png")); }

  async function buildQReverseBatch() {
    const values = selectedQReverseValues();
    if (!values.length) throw new Error("No selected QR values to export");
    const original = $("qrInput").value, files = [], stub = sanitizeFilename(state.qreverse.stub || "geoglyph-batch");
    try {
      for (let index = 0; index < values.length; index += 1) {
        $("qrInput").value = values[index]; setQReverseProgress(index, values.length, `Rendering ${index + 1} of ${values.length}`);
        const canvas = document.createElement("canvas"); await drawQrToCanvas(canvas, 1024, state.qreverse.lastDesignPreview === "combined");
        files.push({ name: `${stub}-${String(index + 1).padStart(3, "0")}.png`, blob: await canvasToBlob(canvas) });
      }
      return files;
    } finally { $("qrInput").value = original; renderPreview(); }
  }

  async function zipQReverseFiles(files) {
    if (typeof window.JSZip !== "function") throw new Error("ZIP library unavailable");
    const zip = new JSZip(); files.forEach(file => zip.file(file.name, file.blob));
    return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  }

  async function exportQReverseBatch(destination) {
    if (isQReverseBusy()) return;
    state.qreverse.exporting = true; renderQReverse();
    try {
      let directory = null;
      if (destination !== "download") {
        if (typeof window.showDirectoryPicker !== "function") { showToast("Folder output unsupported; downloading ZIP instead"); destination = "download"; }
        else { try { directory = await window.showDirectoryPicker({ mode: "readwrite" }); } catch (error) { if (error.name === "AbortError") throw error; showToast("Folder unavailable; downloading ZIP instead"); destination = "download"; } }
      }
      const files = await buildQReverseBatch();
      if (destination === "files" && directory) {
        for (let index = 0; index < files.length; index += 1) { const handle = await directory.getFileHandle(files[index].name, { create: true }); const writable = await handle.createWritable(); await writable.write(files[index].blob); await writable.close(); setQReverseProgress(index + 1, files.length, `Writing ${files[index].name}`); }
      } else {
        const zipBlob = await zipQReverseFiles(files), zipName = `${sanitizeFilename(state.qreverse.stub || "geoglyph-batch")}.zip`;
        if (destination === "zip-folder" && directory) { const handle = await directory.getFileHandle(zipName, { create: true }); const writable = await handle.createWritable(); await writable.write(zipBlob); await writable.close(); }
        else download(URL.createObjectURL(zipBlob), zipName, true);
      }
      setQReverseProgress(files.length, files.length, "Batch export complete"); showToast(`${files.length} QR image${files.length === 1 ? "" : "s"} exported`);
    } catch (error) { if (error?.name !== "AbortError") { console.error(error); showToast(error.message || "Batch export failed"); } }
    finally { state.qreverse.exporting = false; renderQReverse(); }
  }

  function setQReverseProgress(done, total, label) { $("qreverseProgress").firstChild.textContent = label; $("qreverseProgressCount").textContent = `${done} / ${total}`; }

  function renderQReverse() {
    if (!$("qreverseBody")) return;
    const rows = state.qreverse.rows, selected = rows.filter(row => row.selected).length, values = selectedQReverseValues().length;
    $("qreverseStub").value = state.qreverse.stub;
    $("qreverseSummary").textContent = `${rows.length} row${rows.length === 1 ? "" : "s"} · ${selected} selected`;
    $("qreverseSelectAll").checked = rows.length > 0 && selected === rows.length;
    $("qreverseSelectAll").indeterminate = selected > 0 && selected < rows.length;
    $("qreverseBody").innerHTML = rows.length ? rows.map((row, index) => {
      const statusClass = row.status === "Processed" ? "ok" : ["Error", "No QR found", "Needs reattachment"].includes(row.status) ? "error" : "wait";
      const displayValue = row.value || row.error || (row.status === "Queued" ? "Awaiting scan" : "—");
      return `<tr class="${row.selected ? "is-selected" : ""}"><td class="select-col"><input aria-label="Include row ${index + 1}" data-qreverse-id="${row.id}" type="checkbox" ${row.selected ? "checked" : ""}></td><td class="index-col">${index + 1}</td><td title="${escapeAttr(displayValue)}">${escapeHtml(displayValue)}</td><td><span class="qreverse-source">${escapeHtml(row.source)}</span></td><td title="${escapeAttr(row.error || row.status)}"><span class="qreverse-status ${statusClass}">${escapeHtml(row.status)}</span></td><td title="${escapeAttr(row.path || row.filename || "")}">${escapeHtml(row.path || row.filename || "—")}</td></tr>`;
    }).join("") : '<tr><td class="qreverse-empty" colspan="6">Use <strong>Add Images</strong> to choose QR code images or a folder, then select <strong>Scan queued</strong> to reverse the QR codes and read their contents.</td></tr>';
    const busy = isQReverseBusy();
    ["qreverseImportImagesBtn","qreverseImportFolderBtn","qreverseImportCsvBtn","qreverseScanBtn","qreverseResetBtn","qreverseExportCsvBtn","qreverseMakeQrBtn","qreverseDesignBtn","qreverseBatchDownloadBtn","qreverseBatchFolderBtn","qreverseBatchZipFolderBtn"].forEach(id => $(id).disabled = busy);
    $("qreverseScanBtn").disabled = busy || !state.qreverse.scanner || !rows.some(row => row.source === "Image" && row.status === "Queued" && row.file);
    $("qreverseExportCsvBtn").disabled = busy || values === 0; $("qreverseMakeQrBtn").disabled = busy || values === 0; $("qreverseDesignBtn").disabled = busy || values === 0;
    $("qreverseBatchDownloadBtn").disabled = busy || values === 0; $("qreverseBatchFolderBtn").disabled = busy || values === 0; $("qreverseBatchZipFolderBtn").disabled = busy || values === 0;
    $("qreverseResetModuleBtn").disabled = busy;
    $("qreverseClearResultsBtn").disabled = busy || !rows.some(row => row.source === 'Image');
    if (state.qreverse.importing) setQReverseProgress(0, 0, 'Importing values');
    else if (!state.qreverse.scanning && !state.qreverse.exporting) setQReverseProgress(rows.filter(row => row.status === "Processed").length, rows.length, rows.length ? `${rows.length} row${rows.length === 1 ? "" : "s"} ready` : "No rows queued");
  }

  function collectSettings(){return{version:SETTINGS_VERSION,savedAt:new Date().toISOString(),theme:state.theme,favourites:state.favourites,gridView:state.gridView,selectedFontId:state.selectedFontId,selectedCode:state.selectedCode,characterSet:state.characterSet,gridPreviewSize:state.gridPreviewSize,colourView:state.colourView,colourTarget:state.colourTarget,colourTargets:state.colourTargets,preview:state.preview,qrMode:state.qrMode,qrLevel:state.qrLevel,quietZone:state.quietZone,qrContent:$("qrInput").value,fileName:$("fileName").value,exportSize:state.exportSize,logoMode:state.logoMode,externalLogoDataUrl:state.externalLogoDataUrl,logoName:state.logoName,logoCrop:state.logoCrop,logoCropBufferPercent:state.logoCropBufferPercent,logoCropCorner:state.logoCropCorner,logoCropEdgeColor:state.logoCropEdgeColor,logoCropEdgeWidth:state.logoCropEdgeWidth,magicEyeDataUrl:"",magicEyeName:"magic_eye_qr_large.png",logoSize:state.logoSize,safeSize:state.safeSize,symbolShape:state.symbolShape,symbolBorder:state.symbolBorder,symbolCanvasTransparent:state.symbolCanvasTransparent,borderWidth:state.borderWidth,symbolScale:state.symbolScale,bgScale:state.bgScale,bgOffset:state.bgOffset,symbolOffset:state.symbolOffset,palettes:state.palettes,map:window.GeoGlyphUi?.collectMapSettings() || null,qreverse:{stub:state.qreverse.stub,lastDesignPreview:state.qreverse.lastDesignPreview,rows:state.qreverse.rows.map(({file,...row})=>row)}};}
  function settingsIdentity() {
    if (state.logoMode === "image" && state.logoName) return sanitizeFilename(state.logoName.replace(/\.[^.]+$/, ""));
    const fontName = selectedFont()?.name || "font-symbol";
    return sanitizeFilename(fontName);
  }
  function saveSettings(){
    const filename = `geoglyph-settings-${settingsIdentity()}.json`;
    download(URL.createObjectURL(new Blob([JSON.stringify(collectSettings(),null,2)],{type:"application/json"})),filename,true);
    showToast(`${filename} saved`);
  }
  async function loadSettingsFile(event){const file=event.target.files?.[0];if(!file)return;try{const settings=JSON.parse(await readTextFile(file));applySettings(settings);showToast("Settings loaded");}catch(error){console.error(error);showToast("Settings file could not be loaded");}finally{event.target.value="";}}
  function applySettings(s){if(!s||typeof s!=="object")throw new Error("Invalid settings");if(["dark","light"].includes(s.theme))setTheme(s.theme,true);if(Array.isArray(s.favourites)){state.favourites=[...new Set(s.favourites.map(Number).filter(code=>Number.isInteger(code)&&code>=0&&code<=0x10FFFF))];persistFavourites();}if(["grid","favourites"].includes(s.gridView))state.gridView=s.gridView;if(s.selectedFontId&&state.fonts.some(f=>f.id===s.selectedFontId))state.selectedFontId=s.selectedFontId;if(Number.isFinite(Number(s.selectedCode)))state.selectedCode=Number(s.selectedCode);if(["symbol","qr","combined","qreverse","magic-eye"].includes(s.preview))state.preview=s.preview;if(["square","circle","rounded","diamond"].includes(s.qrMode))state.qrMode=s.qrMode;if(Number.isFinite(Number(s.quietZone)))state.quietZone=Math.max(1,Math.min(12,Number(s.quietZone)));if(QR_LIMITS[s.qrLevel])state.qrLevel=s.qrLevel;if(typeof s.qrContent==="string")$("qrInput").value=s.qrContent;if(typeof s.fileName==="string")$("fileName").value=s.fileName;if(["all","letters","symbols","emoji","custom"].includes(s.characterSet))state.characterSet=s.characterSet;if(Number.isFinite(Number(s.gridPreviewSize)))state.gridPreviewSize=Math.max(2,Math.min(40,Number(s.gridPreviewSize)));if(["palette","gradient"].includes(s.colourView))state.colourView=s.colourView;if(Object.prototype.hasOwnProperty.call(state.colourTargets,s.colourTarget))state.colourTarget=s.colourTarget;if(s.colourTargets&&typeof s.colourTargets==="object")Object.keys(state.colourTargets).forEach(key=>{if(s.colourTargets[key])state.colourTargets[key]=sanitizeColourTarget(s.colourTargets[key],state.colourTargets[key]);});if(s.colourTargets?.symbolFg)state.colourTargets.symbolBg=sanitizeColourTarget(s.colourTargets.symbolFg,state.colourTargets.symbolBg);if([512,1024,2048,4096].includes(Number(s.exportSize)))state.exportSize=Number(s.exportSize);if(["symbol","image","none"].includes(s.logoMode))state.logoMode=s.logoMode;if(typeof s.externalLogoDataUrl==="string")state.externalLogoDataUrl=s.externalLogoDataUrl;if(typeof s.logoName==="string")state.logoName=s.logoName;if(typeof s.logoCrop==="boolean")state.logoCrop=s.logoCrop;if(Number.isFinite(Number(s.logoCropBufferPercent)))state.logoCropBufferPercent=sanitizeLogoCropBuffer(s.logoCropBufferPercent);if(typeof s.logoCropCorner==="string")state.logoCropCorner=sanitizeLogoCropCorner(s.logoCropCorner);if(validHex(s.logoCropEdgeColor))state.logoCropEdgeColor=s.logoCropEdgeColor.toUpperCase();if(Number.isFinite(Number(s.logoCropEdgeWidth)))state.logoCropEdgeWidth=sanitizeLogoCropEdgeWidth(s.logoCropEdgeWidth);resetExternalLogoAssetCache();state.magicEyeImage=null;["logoSize","safeSize","borderWidth","symbolScale","bgScale"].forEach(k=>{if(Number.isFinite(Number(s[k])))state[k]=Number(s[k]);});if(["circle","square","diamond","hexagon"].includes(s.symbolShape))state.symbolShape=s.symbolShape;state.symbolBorder=Boolean(s.symbolBorder);state.symbolCanvasTransparent=Boolean(s.symbolCanvasTransparent);state.bgOffset=sanitizeOffset(s.bgOffset);state.symbolOffset=sanitizeOffset(s.symbolOffset);if(s.palettes?.symbol)state.palettes.symbol=sanitizePalette(s.palettes.symbol,state.palettes.symbol);if(s.palettes?.qr)state.palettes.qr=sanitizePalette(s.palettes.qr,state.palettes.qr);if(s.palettes?.image)state.palettes.image=sanitizePalette(s.palettes.image,state.palettes.image);if(!s.colourTargets&&s.palettes){const qr=state.palettes.qr,symbol=state.palettes.symbol;state.colourTargets.qrBg.solid=qr.bg;state.colourTargets.qrFg.solid=qr.fg;state.colourTargets.symbolBg.solid=symbol.bg;state.colourTargets.symbolEdge.solid=symbol.fg;state.colourTargets.symbol.solid=symbol.fg;if(qr.gradient?.target==="background"){state.colourTargets.qrBg.mode="gradient";state.colourTargets.qrBg.gradient=sanitizeColourTarget({solid:qr.bg,mode:"gradient",gradient:qr.gradient},state.colourTargets.qrBg).gradient;}else if(qr.gradient?.target==="foreground"){state.colourTargets.qrFg.mode="gradient";state.colourTargets.qrFg.gradient=sanitizeColourTarget({solid:qr.fg,mode:"gradient",gradient:qr.gradient},state.colourTargets.qrFg).gradient;}if(symbol.gradient?.target==="background"){state.colourTargets.symbolBg.mode="gradient";state.colourTargets.symbolBg.gradient=sanitizeColourTarget({solid:symbol.bg,mode:"gradient",gradient:symbol.gradient},state.colourTargets.symbolBg).gradient;}else if(symbol.gradient?.target==="foreground"){state.colourTargets.symbol.mode="gradient";state.colourTargets.symbol.gradient=sanitizeColourTarget({solid:symbol.fg,mode:"gradient",gradient:symbol.gradient},state.colourTargets.symbol).gradient;}}restoreQReverseSettings(s);window.GeoGlyphUi?.applyMapSettings(s.map);document.dispatchEvent(new CustomEvent("geoglyph:settings-loaded"));if(state.preview==="magic-eye"&&!state.magicEyeDataUrl)state.preview="combined";renderAll();}
  function sanitizeOffset(value){return{x:Number.isFinite(Number(value?.x))?Number(value.x):0,y:Number.isFinite(Number(value?.y))?Number(value.y):0};}
  function sanitizeColourTarget(value,fallback){const gradient=value?.gradient||{},colors=Array.isArray(gradient.colors)?gradient.colors.slice(0,4):fallback.gradient.colors.slice(),cleanColors=colors.map((color,index)=>validHex(color)?color.toUpperCase():fallback.gradient.colors[index]);while(cleanColors.length<4)cleanColors.push(fallback.gradient.colors[cleanColors.length]);let stops=Array.isArray(gradient.stops)?gradient.stops.slice(0,4).map(Number):fallback.gradient.stops.slice();if(stops.length<4||stops.some(v=>!Number.isFinite(v)))stops=fallback.gradient.stops.slice();stops=[0,Math.max(10,Math.min(85,stops[1])),Math.max(15,Math.min(90,stops[2])),100];if(stops[1]>=stops[2])stops=[0,33,67,100];return{solid:validHex(value.solid)?value.solid.toUpperCase():fallback.solid,mode:value.mode==="gradient"?"gradient":"solid",gradient:{colors:cleanColors,stops,direction:["horizontal","vertical","diagonal","radial"].includes(gradient.direction)?gradient.direction:fallback.gradient.direction}};}

  function sanitizePalette(value,fallback){const source=value?.gradient||{},legacyA=source.a,legacyB=source.b,colors=Array.isArray(source.colors)?source.colors:[legacyA,fallback.gradient.colors[1],fallback.gradient.colors[2],legacyB],cleanColors=colors.slice(0,4).map((color,index)=>validHex(color)?color.toUpperCase():fallback.gradient.colors[index]);while(cleanColors.length<4)cleanColors.push(fallback.gradient.colors[cleanColors.length]);let stops=Array.isArray(source.stops)?source.stops.slice(0,4).map(Number):[0,33,67,100];if(stops.length<4||stops.some(v=>!Number.isFinite(v)))stops=[0,33,67,100];stops=[0,Math.max(10,Math.min(85,stops[1])),Math.max(15,Math.min(90,stops[2])),100];if(stops[1]>=stops[2])stops=[0,33,67,100];return{fg:validHex(value.fg)?value.fg.toUpperCase():fallback.fg,bg:validHex(value.bg)?value.bg.toUpperCase():fallback.bg,gradient:{colors:cleanColors,stops,direction:["horizontal","vertical","diagonal","radial"].includes(source.direction)?source.direction:fallback.gradient.direction,target:["off","foreground","background"].includes(source.target)?source.target:fallback.gradient.target}};}

  function resolveKeyChar(base,shifted){if(state.qualifiers.shift&&shifted)return shifted;if(base==="Space")return" ";if(["Backspace","Tab","Caps","Enter","Shift","Ctrl","Alt","AltGr","Menu"].includes(base))return base;return base;}
  function findKeyboardKeyForCode(code){const char=String.fromCodePoint(code);for(const row of BASE_KEYS)for(const[base,shifted]of row)if(base===char||shifted===char||(base==="Space"&&char===" "))return{base,shifted};return null;}
  function keyLabelForDisplay(base,char){if(base==="Space"||char===" ")return"Space";if(base.length>1)return base;return char;}
  function formatKeyLabel(base,char){if(char.length===1)return`${base} / ${displayChar(char.codePointAt(0))}`;return keyLabelForDisplay(base,char);}
  function displayChar(code){if(code===32)return"Space";if(code===9)return"Tab";if(code===10)return"Line Feed";if(code===13)return"Enter";if(code<32||code===127)return`Control ${code}`;return String.fromCodePoint(code);}
  function formatUnicode(code){return`U+${Number(code||0).toString(16).toUpperCase().padStart(4,"0")}`;}
  function validHex(value){return/^#[0-9a-f]{6}$/i.test(String(value||"").trim());}
  function sanitizeFilename(value){return String(value||"geoglyph-qr").trim().replace(/[^\w.-]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"geoglyph-qr";}
  async function copyText(value,message){try{await navigator.clipboard.writeText(value);showToast(message);}catch{window.prompt("Copy value:",value);}}
  function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
  function readTextFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(file);});}
  function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
  function download(url,name,revoke){const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();if(revoke)setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function quoteFont(name){return String(name||"system-ui").split(",").map(part=>{const value=part.trim();return/^(system-ui|serif|sans-serif|monospace|cursive|fantasy)$/i.test(value)?value:`"${value.replace(/"/g,'\\"')}"`;}).join(",");}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
  function escapeAttr(value){return escapeHtml(value).replace(/`/g,"&#96;");}
  function formatNumber(value){return Number(value).toFixed(3).replace(/\.?0+$/,"");}
  function showToast(text){const toast=$("toast");toast.textContent=text;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),1500);}

  window.GeoGlyphStudio = Object.freeze({
    state,
    registerFonts: records => { const fonts = records.map(addFontRecord); renderFontList(); return fonts; },
    renderPreview,
    renderGlyphGrid,
    renderGridSelectionPreview,
    renderQReverse,
    runQReverseImport,
    syncControlsFromState,
    showToast,
    copyEsriFontPath,
    drawQrToCanvas,
    prepareSelectedFont,
    getFontById: id => fontById.get(id),
    selectFont,
    getQartDefaults,
    revealFontSelection,
    cancelFontImport: () => window.GeoGlyphFontService.cancelCatalog()
  });
})();
