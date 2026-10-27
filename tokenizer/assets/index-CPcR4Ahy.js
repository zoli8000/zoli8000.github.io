import{createJSONEditor as bt}from"https://cdn.jsdelivr.net/npm/vanilla-jsoneditor@latest/+esm";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();var v=(o=>(o[o.scopeString=0]="scopeString",o[o.scopeCommand=1]="scopeCommand",o[o.scopeRem=2]="scopeRem",o[o.scopeArgs=3]="scopeArgs",o))(v||{});function yt(o){const e={};let t=0;const r=/(['"])(?:\\.|(?!\1).)*\1/g;return{expr:o.replace(r,n=>{t++;const i=`_str_${t}`,a=n.slice(1,-1);return e[i]=a,i}),strings:e}}function Xe(o,e={},t={}){let{expr:r,strings:s}=yt(o);const n=/^(?<valid>[0-9A-Za-z_+\-*/%()\s',]*)(?<error>.*)$/u,i=r.match(n);if(!i||!i.groups)throw new Error("Invalid expression");if(i.groups.valid,i.groups.error)throw new Error("Invalid character in expression: "+i.groups.error[0]);r=r.replace(/\b0x[0-9a-fA-F]+/g,l=>parseInt(l,16).toString());const a=r.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g,l=>{if(l in e){const d=e[l];return typeof d=="string"?JSON.stringify(d):String(d)}if(l in t)return l;if(l in s)return JSON.stringify(s[l]);throw new Error(`Unknown identifier: ${l}`)});try{return Function(...Object.keys(t),`"use strict"; return (${a});`)(...Object.values(t))}catch{throw new Error("Invalid expression")}}function je(o,e){return o.replace(/{([^}]*)}/g,(t,r)=>`{${r.split(/\s+/).map(n=>n in e&&typeof e[n]=="number"?String(e[n]):n).join(" ")}}`)}function $t(o){let e="",t=!1;for(let r=0;r<o.length;r++){const s=o[r];if(e){t?t=!1:s==="\\"?t=!0:s===e&&(e="");continue}if(s==="'"||s==='"'){e=s;continue}if(o.slice(r,r+2)==="--"||o.slice(r,r+2)==="//")return{source:o.slice(0,r).trimEnd(),comment:o.slice(r+2).trim()}}return{source:o.trimEnd(),comment:""}}class qe{constructor({evaluationMode:e="safe"}={}){this.constants={},this.evaluationMode=e}parseBlock(e){const t={},r={};e.split(/\r\n|\r|\n/).forEach(l=>{const{source:d,comment:x}=$t(l);let c=d.trim();if(!c)return;c.endsWith(",")&&(c=c.slice(0,-1).trimEnd());const p=c.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);if(!p)throw new Error(`Invalid constant definition: "${c}"`);const[,u,f]=p;t[u]=f.trim(),r[u]=x});const s={},n=new Set,i=()=>Object.fromEntries(Object.entries(s).map(([l,d])=>[l,d.value])),a=l=>{if(l in s)return s[l].value;if(!(l in t))throw new Error(`Unknown constant: ${l}`);if(n.has(l))throw new Error(`Circular reference: ${l}`);n.add(l);const d=t[l],x=d.match(/^"([^"]*?)"$|^'([^']*?)'$/);let c;if(x)c=je(x[0].slice(1,-1),i());else{const p=d.replace(/\$([0-9A-Fa-f]+)/g,(u,f)=>`0x${f}`).replace(/\b([A-Z_][A-Z0-9_]*)\b/g,u=>{const f=a(u);return typeof f=="string"?JSON.stringify(f):String(f)}).replace(/{(.*?)}/g,"($1)");try{c=this.evaluationMode==="safe"?Xe(p):Function(`"use strict"; return (${p});`)()}catch{throw new Error(`Failed to evaluate expression: "${p}"`)}typeof c=="string"&&(c=je(c,i()))}if(typeof c!="number"&&typeof c!="string")throw new Error(`Expression did not evaluate to string or number: ${d}`);return s[l]={rawExpression:d,value:c,comment:r[l]},n.delete(l),c};Object.keys(t).forEach(a),this.constants=s}getConstants(){return{...this.constants}}getValues(){return Object.fromEntries(Object.entries(this.constants).map(([e,t])=>[e,t.value]))}get(e){return this.constants[e]?.value}}const oe=class oe{constructor(e,t,r,s,n,i,a,l=null){this.key=e,this.value=t,this.pos=r,this.repr=s,this.reprPretty=n,this.category=i,this.spanClass=a,this.byteData=[],this.typeMapper=l||oe.defaultMapper}static createFromDict(e){return new oe(e.key||"",e.value||"",e.pos||0,e.repr||"",e.reprPretty||"",e.category||"",e.spanClass||"",e.typeMapper)}isRemark(){return this.typeMapper.remark.indexOf(this.key)>=0}isNumber(){return this.typeMapper.number.indexOf(this.key)>=0}isString(){return this.typeMapper.string.indexOf(this.key)>=0}isUnaryOperation(){return this.typeMapper.unaryOp.indexOf(this.value)>=0}isBinaryOperation(){return this.typeMapper.binaryOp.indexOf(this.value)>=0}isAssignment(){return this.typeMapper.assignment.indexOf(this.value)>=0}isType(e){return this.typeMapper[e].indexOf(this.key)>=0||this.typeMapper[e].indexOf(this.value)>=0}};oe.defaultMapper={remark:["remark","rem_multi","docstr"],number:["hexNum","floatNum","intNum"],string:["strDQuote","strSQuote","strBQuote"],binaryOp:["+","-","<","<=","==",">",">=","!=","!==","===","||","&&","*","/","%","|","&"],unaryOp:["(","-","~"],assignment:["=","|=","&=","+=","-=","*=","/=","^="]};let ie=oe;const me=class me{constructor(){this.state={}}static encodeTextAsBytes(e){return[0]}static voidEncoder(e){return[]}static encodeTokens(e,t){return[]}static evalExpr(e,t){return Xe(e,t||{})}static constEncoder(e,t){const r=new qe({evaluationMode:t.constEvaluationMode||"safe"});return r.parseBlock(e.value),t.consts=r.getValues(),[]}static encode(e,t){let r=this.encoders[e.key]||this.encoders[e.category];if(r){r=r.bind(this);let s=[];try{return s=r(e,t),e.byteData=s,s}catch(n){throw Error(`Error in encoder for ${e.key}, ${e.category} for value ${e.value.slice(0,20)}: ${n}at position ${e.pos}`)}}else throw Error(`Encoder needed for ${e.key}, ${e.category} for value ${e.value}!`)}static exprEncoder(e,t){const r=me.evalExpr(e.value,t.consts||{}),s=ie.createFromDict({...e,repr:r.toString(),reprPretty:r.toString(),value:r.toString()});if(typeof r=="string")s.category="STR",s.key="STRING";else if(typeof r=="number")s.category="NUM",s.key="intNum";else throw Error(`Expression did not evaluate to string or number: ${e.value} => ${r}`);return this.encode(s,t)}};me.encoders={};let E=me;class w{static screenCodeToChar(e,t=!1){return t?[`@ABCDEFGHIJKLMNOPQRSTUVWXYZ[£]↑← !"#$%&'()*+,-./0123456789:;<=>?━♠│─▔▔▁▍▕╮╰╯└╲╱┌┐●▁♥▏╭╳○♣▕♦➕⡇|.. ▌▄‾▁▎▒▕⣤.▕┣▗┗┓▂┏┻┳┫▎▍▐‾▀▃.▖▝┛▘▚`[e&127],(e&128)>0]:[`@abcdefghijklmnopqrstuvwxyz[£]↑← !"#$%&'()*+,-./0123456789:;<=>?━ABCDEFGHIJKLMNOPQRSTUVWXYZ➕⡇|π◥ ▌▄‾▁▎▒▕⣤◤▕┣▗┗┓▂┏┻┳┫▎▍▐‾▀▃⅃▖▝┛▘▚`[e&127],(e&128)>0]}static petsciiCodeToScreen(e){let t=0;return e<32?t=e+128:32<=e&&e<64?t=e:64<=e&&e<96?t=e-64:96<=e&&e<128?t=e-32:128<=e&&e<160?t=e+64:160<=e&&e<192?t=e-64:192<=e&&e<224||224<=e&&e<255?t=e-128:e==255&&(t=94),t}static textToPetscii(e){let t=e.charCodeAt(0);return(65<=t&&t<=90||97<=t&&t<=122)&&(t^=32),t}static textToScreen(e){const t=w.textToPetscii(e);return w.petsciiCodeToScreen(t)}static petsciiCodeToChar(e,t=!1){return w.screenCodeToChar(w.petsciiCodeToScreen(e),t)}static screenCodeToEscaped(e,t=!1){if(t)throw Error("Small character conversion not implemented!");return e==64||e>=91?["code",e]:["chr",`@abcdefghijklmnopqrstuvwxyz[£]↑← !"#$%&'()*+,-./0123456789:;<=>?━ABCDEFGHIJKLMNOPQRSTUVWXYZ`[e]]}static petsciiCodeToEscaped(e,t=!1){const r=w.petsciiCodeToScreen(e),s=w.screenCodeToEscaped(r,t);return s[0]=="code"&&(s[1]=e),s}static petsciiCodeToSafe(e,t=!1){const[r,s]=w.petsciiCodeToEscaped(e,t);return r=="chr"?s:"?"}}const ce={locate:[128,130],read:[129,128],break:[130,192],call:[131,128],def:[132,160],endif:[133,192],for:[134,160],goto:[135,129],local:[136,128],if:[137,176],fend:[138,192],clr:[139,128],let:[140,128],memset:[141,130],next:[142,192],on:[143,128],poke:[144,129],continue:[145,192],repeat:[146,160],set:[147,128],then:[148,192],until:[149,129],voice:[150,136],while:[151,129],exec:[152,129],input:[153,129],sys:[154,128],CHAR:[160,0],F08:[161,24],DQUOTE:[162,2],WORD:[163,21],UWORD:[164,17],F2416:[165,30],BYTE:[166,16],SQUOTE:[167,2],F88:[168,29],FLOAT:[169,31],DCHAR:[170,1],inc:[171,128],QQUOTE:[172,2],dec:[173,128],_label:[174,128],rem:[175,128],"+":[176,34],"-":[177,34],"*":[178,35],AND:[179,32],"&&":[179,32],div:[180,35],"/":[180,35],OR:[181,32],"||":[181,32],mod:[182,35],"%":[182,35],xor:[183,36],"^":[183,36],and:[184,36],"&":[184,36],or:[185,36],"|":[185,36],"<":[186,33],"==":[187,33],"=":[187,33],">=":[188,33],"!=":[189,33],"<>":[189,33],"<=":[190,33],">":[191,33],print:[192,128],data:[193,128],bitmap:[194,136],fcall:[195,128],dend:[196,192],else:[197,144],fast:[198,160],gosub:[199,129],elif:[200,144],dim:[201,160],open:[202,128],color:[203,130],loop:[204,192],memcopy:[205,130],end:[206,192],do:[207,224],dpoke:[208,129],close:[209,129],return:[210,129],sprite:[211,136],timer:[212,128],get:[213,128],font:[214,136],wait:[215,130],inkey:[217,128],settings:[218,128],to:[220,64],pi:[222,64],right:[223,98],_lf:[224,192],cos:[225,97],int:[226,97],tan:[227,97],addr:[228,64],sgn:[229,97],limit:[230,98],mid:[231,98],step:[232,64],fpi:[233,64],atn:[234,97],frac:[235,97],dpeek:[236,98],spc:[237,97],sin:[238,97],peek:[239,98],abs:[240,97],left:[241,98],rnd:[242,98],when:[243,98],has:[244,98],tab:[245,97],len:[246,97],time:[247,64],sub:[248,96],ord:[249,97],_sh_lf:[250,0],fn:[251,64],chr:[252,97],find:[253,96],val:[254,97],between:[255,98]},St={128:["locate",130],129:["read",128],130:["break",192],131:["call",128],132:["def",160],133:["endif",192],134:["for",160],135:["goto",129],136:["local",128],137:["if",176],138:["fend",192],139:["clr",128],140:["let",128],141:["memset",130],142:["next",192],143:["on",128],144:["poke",129],145:["continue",192],146:["repeat",160],147:["set",128],148:["then",192],149:["until",129],150:["voice",136],151:["while",129],152:["exec",129],153:["input",129],154:["sys",128],160:["CHAR",0],161:["F08",24],162:["DQUOTE",2],163:["WORD",21],164:["UWORD",17],165:["F2416",30],166:["BYTE",16],167:["SQUOTE",2],168:["F88",29],169:["FLOAT",31],170:["DCHAR",1],171:["inc",128],172:["QQUOTE",2],173:["dec",128],174:["_label",128],175:["rem",128],176:["+",34],177:["-",34],178:["*",35],179:["&&",32],180:["/",35],181:["||",32],182:["%",35],183:["^",36],184:["&",36],185:["|",36],186:["<",33],187:["=",33],188:[">=",33],189:["<>",33],190:["<=",33],191:[">",33],192:["print",128],193:["data",128],194:["bitmap",136],195:["fcall",128],196:["dend",192],197:["else",144],198:["fast",160],199:["gosub",129],200:["elif",144],201:["dim",160],202:["open",128],203:["color",130],204:["loop",192],205:["memcopy",130],206:["end",192],207:["do",224],208:["dpoke",129],209:["close",129],210:["return",129],211:["sprite",136],212:["timer",128],213:["get",128],214:["font",136],215:["wait",130],217:["inkey",128],218:["settings",128],220:["to",64],222:["pi",64],223:["right",98],224:["_lf",192],225:["cos",97],226:["int",97],227:["tan",97],228:["addr",64],229:["sgn",97],230:["limit",98],231:["mid",98],232:["step",64],233:["fpi",64],234:["atn",97],235:["frac",97],236:["dpeek",98],237:["spc",97],238:["sin",97],239:["peek",98],240:["abs",97],241:["left",98],242:["rnd",98],243:["when",98],244:["has",98],245:["tab",97],246:["len",97],247:["time",64],248:["sub",96],249:["ord",97],250:["_sh_lf",0],251:["fn",64],252:["chr",97],253:["find",96],254:["val",97],255:["between",98]},vt={print:[192,128],locate:[128,130],inc:[171,128],dec:[173,128],let:[140,128],set:[147,128],for:[134,160],next:[142,192],repeat:[146,160],if:[137,176],then:[148,192],endif:[133,192],else:[197,144],elif:[200,144],do:[207,224],loop:[204,192],while:[151,129],until:[149,129],fast:[198,160],fcall:[195,128],fend:[138,192],poke:[144,129],dpoke:[208,129],read:[129,128],def:[132,160],call:[131,128],dend:[196,192],goto:[135,129],gosub:[199,129],on:[143,128],return:[210,129],end:[206,192],clr:[139,128],dim:[201,160],local:[136,128],inkey:[217,128],sys:[154,128],wait:[215,130],input:[153,129],timer:[212,128],memcopy:[205,130],memset:[141,130],color:[203,130],data:[193,128],exec:[152,129],open:[202,128],get:[213,128],close:[209,129],break:[130,192],continue:[145,192],sprite:[211,136],voice:[150,136],bitmap:[194,136],font:[214,136],settings:[218,128]},Ge={print:192,locate:128,inc:171,dec:173,let:140,set:147,for:134,next:142,repeat:146,if:137,then:148,endif:133,else:197,elif:200,do:207,loop:204,while:151,until:149,fast:198,fcall:195,fend:138,poke:144,dpoke:208,read:129,def:132,call:131,dend:196,goto:135,gosub:199,on:143,return:210,end:206,clr:139,dim:201,local:136,inkey:217,sys:154,wait:215,input:153,timer:212,memcopy:205,memset:141,color:203,data:193,exec:152,open:202,get:213,close:209,break:130,continue:145,sprite:211,voice:150,bitmap:194,font:214,settings:218},Te={BYTE:{shortCode:"b",longCode:"BYTE",tokenValue:166,type_value:16,rangeMin:0,rangeMax:256,description:"8bit integer number, values: 0..255"},WORD:{shortCode:"W",longCode:"WORD",tokenValue:163,type_value:21,rangeMin:-32768,rangeMax:32768,description:"16bit signed integer number, values: -32768..32767"},UWORD:{shortCode:"w",longCode:"UWORD",tokenValue:164,type_value:17,rangeMin:0,rangeMax:65536,description:"16bit unsigned integer number, values: 0..65535"},F08:{shortCode:"f",longCode:"F08",tokenValue:0,type_value:24,rangeMin:0,rangeMax:1,description:"8bit unsigned fractional number, values: 0.0..1.0"},F88:{shortCode:"S",longCode:"F88",tokenValue:0,type_value:29,rangeMin:-128,rangeMax:128,description:"16bit signed fractional number, values: -128.0..128.0"},F2416:{shortCode:"L",longCode:"F2416",tokenValue:165,type_value:30,rangeMin:null,rangeMax:null,description:"5 bytes signed number, 24bit integer and 16 bit fractional part"},FLOAT:{shortCode:"%",longCode:"FLOAT",tokenValue:0,type_value:31,rangeMin:null,rangeMax:null,description:"Legacy float number"},CHAR:{shortCode:"c",longCode:"CHAR",tokenValue:160,type_value:0,rangeMin:null,rangeMax:null,description:"8bit single character"},DCHAR:{shortCode:"d",longCode:"DCHAR",tokenValue:0,type_value:1,rangeMin:null,rangeMax:null,description:"16bit, 2 characters"},VARSTR:{shortCode:"&",longCode:"VARSTR",tokenValue:-1,type_value:2,rangeMin:null,rangeMax:null,description:"Variable length string. Data: [len][STR...]. Currently only inline const strings are supported."},FIXSTR:{shortCode:"$",longCode:"FIXSTR",tokenValue:-1,type_value:3,rangeMin:null,rangeMax:null,description:"Fixed length string, always uses the same memory. Data: [maxlen][len][STR...][unused...]"},NONE:{shortCode:"0",longCode:"NONE",tokenValue:0,type_value:0,rangeMin:0,rangeMax:0,description:""},UBYTE:{shortCode:"b",longCode:"UBYTE",tokenValue:0,type_value:16,rangeMin:0,rangeMax:256,description:""},SBYTE:{shortCode:"B",longCode:"SBYTE",tokenValue:0,type_value:20,rangeMin:-128,rangeMax:128,description:""},SWORD:{shortCode:"W",longCode:"SWORD",tokenValue:0,type_value:21,rangeMin:-32768,rangeMax:32768,description:""},UF08:{shortCode:"f",longCode:"UF08",tokenValue:0,type_value:24,rangeMin:0,rangeMax:1,description:""},SF08:{shortCode:"F",longCode:"SF08",tokenValue:0,type_value:28,rangeMin:null,rangeMax:null,description:""},UF88:{shortCode:"s",longCode:"UF88",tokenValue:0,type_value:25,rangeMin:0,rangeMax:256,description:""},SF88:{shortCode:"S",longCode:"SF88",tokenValue:0,type_value:29,rangeMin:-128,rangeMax:128,description:""},UF2416:{shortCode:"l",longCode:"UF2416",tokenValue:0,type_value:26,rangeMin:null,rangeMax:null,description:""},SF2416:{shortCode:"L",longCode:"SF2416",tokenValue:0,type_value:30,rangeMin:null,rangeMax:null,description:""}},Ee={b:{shortCode:"b",longCode:"UBYTE",tokenValue:0,type_value:16,rangeMin:0,rangeMax:256,description:""},W:{shortCode:"W",longCode:"SWORD",tokenValue:0,type_value:21,rangeMin:-32768,rangeMax:32768,description:""},w:{shortCode:"w",longCode:"UWORD",tokenValue:164,type_value:17,rangeMin:0,rangeMax:65536,description:"16bit unsigned integer number, values: 0..65535"},f:{shortCode:"f",longCode:"UF08",tokenValue:0,type_value:24,rangeMin:0,rangeMax:1,description:""},S:{shortCode:"S",longCode:"SF88",tokenValue:0,type_value:29,rangeMin:-128,rangeMax:128,description:""},L:{shortCode:"L",longCode:"SF2416",tokenValue:0,type_value:30,rangeMin:null,rangeMax:null,description:""},"%":{shortCode:"%",longCode:"FLOAT",tokenValue:0,type_value:31,rangeMin:null,rangeMax:null,description:"Legacy float number"},c:{shortCode:"c",longCode:"CHAR",tokenValue:160,type_value:0,rangeMin:null,rangeMax:null,description:"8bit single character"},d:{shortCode:"d",longCode:"DCHAR",tokenValue:0,type_value:1,rangeMin:null,rangeMax:null,description:"16bit, 2 characters"},"&":{shortCode:"&",longCode:"VARSTR",tokenValue:-1,type_value:2,rangeMin:null,rangeMax:null,description:"Variable length string. Data: [len][STR...]. Currently only inline const strings are supported."},$:{shortCode:"$",longCode:"FIXSTR",tokenValue:-1,type_value:3,rangeMin:null,rangeMax:null,description:"Fixed length string, always uses the same memory. Data: [maxlen][len][STR...][unused...]"},0:{shortCode:"0",longCode:"NONE",tokenValue:0,type_value:0,rangeMin:0,rangeMax:0,description:""},B:{shortCode:"B",longCode:"SBYTE",tokenValue:0,type_value:20,rangeMin:-128,rangeMax:128,description:""},F:{shortCode:"F",longCode:"SF08",tokenValue:0,type_value:28,rangeMin:null,rangeMax:null,description:""},s:{shortCode:"s",longCode:"UF88",tokenValue:0,type_value:25,rangeMin:0,rangeMax:256,description:""},l:{shortCode:"l",longCode:"UF2416",tokenValue:0,type_value:26,rangeMin:null,rangeMax:null,description:""}},Tt={font_set_source0_target0:0,font_set_source0_target1:1,font_set_source1_target0:4,font_set_source1_target1:5,font_set_source_rom_target0:8,font_set_source_rom_target1:9,font_def_uncompressed_multi:16,font_def_uncompressed_1:17,font_def_uncompressed_2:18,font_def_uncompressed_3:19,font_def_uncompressed_4:20,font_def_uncompressed_5:21,font_def_uncompressed_6:22,font_def_uncompressed_7:23,font_copy_full:24,font_copy_lo:25,font_copy_hi:26,font_copy_range_same_index:27,font_copy_range:28,font_create_2x1:32,font_create_2x2:33,font_map_4x4_from:35,font_map_4x4_full:36,font_map_4x8_default:37,font_map_4x8_full:38,font_map_8x4_default:39,font_map_8x4_full:40,font_set_8x8_fill:41,font_use_1x1:48,font_use_2x1:49,font_use_2x2:50,font_use_4x4:51,font_use_4x8:52,font_use_8x4:53,font_use_8x8:54,font_invert_all:64,font_invert_range:65,font_create_from_spr_3x3:81,font_create_from_spr_3x2:82,font_create_from_spr_2x3:83,font_create_from_spr_2x2:84},Je={pi:[222,64],fpi:[233,64],to:[220,64],step:[232,64],peek:[239,98],dpeek:[236,98],rnd:[242,98],cos:[225,97],sin:[238,97],tan:[227,97],atn:[234,97],int:[226,97],frac:[235,97],ord:[249,97],chr:[252,97],when:[243,98],addr:[228,64],len:[246,97],val:[254,97],abs:[240,97],left:[241,98],mid:[231,98],right:[223,98],find:[253,96],sub:[248,96],time:[247,64],tab:[245,97],spc:[237,97],sgn:[229,97],fn:[251,64],has:[244,98],between:[255,98],limit:[230,98]},Ue={type:["t",0,0],size:["S",0,0],addr:["@",0,0],word:["w",32,0],byte:["b",32,0],fx2:["f",32,0],fx5:["F",32,0],frac:["F×",32,0],chr:["$",48,16],str:["s",48,16],int:["i",48,16],abs:["a",48,16],sign:["n",48,16],rdn:["r",48,16],rup:["R",48,16],minus:["M×",48,16],plus:["P×",48,16],dbl:["d",48,16],div2:["D",48,16],ord:["o",48,0],ucase:["C",48,0],lcase:["c",48,0],lo:["l",0,0],hi:["h",0,0],lnib:["L",0,0],hnib:["H",0,0],lnib2:["L×",0,0],hnib2:["H×",0,0],getw:["G",24,16],getb:["g",24,16],avg:["A",32,32],sum:["S×",32,32],min:["m",255,1],max:["M",255,1],ix:["I×",255,1],jx:["J×",255,1],kx:["K×",255,1],push:["p",255,1],pop:["P",255,1],ax:["A×",255,1],axm:["x",255,1]},Et={tab:128,transparent:129,recolor_only:130,stop:131,scroll_actual_column:132,white:133,home_current_line:134,end_current_line:135,disable_c_shift:136,enable_c_shift:137,rep_next:138,rep_double:139,rep_between:140,return:141,lo_up_charset:142,scroll_circular_on:143,scroll_actual_line:144,down:145,reverse_on:146,home:147,delete:148,clear_line_content:149,remove_line:150,scroll_left:151,scroll_right:152,scroll_up:153,scroll_down:154,setx:155,red:156,right:157,green:158,blue:159,stamp_set_mode:160,stamp_use:161,stamp_use_last:162,window_start:163,window_stop:164,box_set_single:165,box_set_style:166,box_user_def:167,box_draw_filled:168,box_draw_empty:169,box_set_sides:170,box_box_filled_compr:171,box_box_empty_compr:172,use_fn:173,setxy:174,typewriter_mode:175,buffer_def:176,buffer_opt:177,buffer_copy:178,buffer_paste:179,input_rx:180,input_cursor:181,format_str:182,format_dec:183,format_hex:184,decompress:185,set_mode_a:186,set_mode_b:187,set_mode_c:188,scroll_set_area:189,scroll_window:190,scroll_screen:191,background:192,orange:193,border:194,run:195,sety:196,f1:197,f3:198,f5:199,f7:200,f2:201,f4:202,f6:203,f8:204,shift_return:205,up_gfx_charset:206,scroll_circular_off:207,black:208,up:209,reverse_off:210,clear:211,insert:212,brown:213,pink:214,dark_gray:215,gray:216,light_green:217,light_blue:218,light_gray:219,purple:220,cursor_left:221,yellow:222,cyan:223,set_addr0:224,set_addr1:225,set_addr2:226,set_addr3:227,push_one:228,push_two:229,push_multi:230,print_src_var:231,print_src_addr:232,print_db:233,print_dw:234,print_hb:235,print_hw:236,print_s:237,print_f:238,format_f:239,def_f1:240,def_f3:241,def_f5:242,def_f7:243,def_f2:244,def_f4:245,def_f6:246,def_f8:247,parambuff_susp:248,parambuff_on:249,parambuff_off:250,set_col_bckg:251,set_col_bord:252,set_col_bcbd:253,decode:254,extra_ff:255,pos_save:65281,pos_load:65282,qsys:65283,qsys_bank:65284,set_tab:65285,poke_single:65286,set_mem:65287,fill_mem:65288},we={0:"@",1:"a",2:"b",3:"c",4:"d",5:"e",6:"f",7:"g",8:"h",9:"i",10:"j",11:"k",12:"l",13:"m",14:"n",15:"o",16:"p",17:"q",18:"r",19:"s",20:"t",21:"u",22:"v",23:"w",24:"x",25:"y",26:"z",27:"[",29:"]",32:" ",33:"!",34:'"',35:"#",36:"$",37:"%",38:"&",39:"'",40:"(",41:")",42:"*",43:"+",44:",",45:"-",46:".",47:"/",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",58:":",59:";",60:"<",61:"=",62:">",63:"?",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",97:"K×",98:"I×",99:"T×",101:"G×",103:"M×",106:"N×",107:"Q×",108:"D×",109:"Z×",110:"S×",111:"P×",112:"A×",113:"E×",114:"R×",115:"W×",116:"H×",117:"J×",118:"L×",119:"Y×",120:"U×",121:"O×",123:"F×",124:"C×",125:"X×",126:"V×",127:"B×",28:"{POUND}",30:"{ARR UP}",31:"{ARR LEFT}",64:"{SH *}",91:"{SH +}",92:"{CM -}",93:"{SH -}",94:"{PI}",95:"{CM *}",96:"{SH SPACE}",100:"{CM @}",102:"{CM +}",104:"{CM POUND}",105:"{SH POUND}",122:"{SH @}"},D={"@":0,a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26,"[":27,"]":29," ":32,"!":33,'"':34,"#":35,$:36,"%":37,"&":38,"'":39,"(":40,")":41,"*":42,"+":43,",":44,"-":45,".":46,"/":47,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,":":58,";":59,"<":60,"=":61,">":62,"?":63,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,"K×":97,"I×":98,"T×":99,"G×":101,"M×":103,"N×":106,"Q×":107,"D×":108,"Z×":109,"S×":110,"P×":111,"A×":112,"E×":113,"R×":114,"W×":115,"H×":116,"J×":117,"L×":118,"Y×":119,"U×":120,"O×":121,"F×":123,"C×":124,"X×":125,"V×":126,"B×":127,"{POUND}":28,"{ARR UP}":30,"{ARR LEFT}":31,"{SH *}":64,"{SH +}":91,"{CM -}":92,"{SH -}":93,"{PI}":94,"{CM *}":95,"{SH SPACE}":96,"{CM @}":100,"{CM +}":102,"{CM POUND}":104,"{SH POUND}":105,"{SH @}":122,Ł:28,"^":30,"~":31,"<==":31,"<_":31,"<--":31},ze=`@abcdefghijklmnopqrstuvwxyz[£]↑← !"#$%&'()*+,-./0123456789:;<=>?━ABCDEFGHIJKLMNOPQRSTUVWXYZ➕⡇|π◥ ▌▄‾▁▎▒▕⣤◤▕┣▗┗┓▂┏┻┳┫▎▍▐‾▀▃⅃▖▝┛▘▚`,wt={spr_autoinc_0:0,spr_copy_idx:3,spr_rot_fill:4,spr_mirr_fill_multi:5,spr_mirr_fill_sing:6,spr_spec:15,spr_mirr_h_mult:16,spr_mirr_h_sing:17,spr_mirr_v:18,spr_rot90:19,spr_rot180_sing:20,spr_rot180_mult:21,spr_rot270:22,spr_rot90_mirr_h_sing:23,spr_rot90_mirr_v_sing:24,spr_sh_left_mult:26,spr_sh_right_mult:27,spr_sh_left_sing:28,spr_sh_right_sing:29,spr_sh_up:30,spr_sh_down:31,spr_def_raw:33,spr_copy:34,spr_def_cmp0:35,spr_def_cmp_base:36,spr_double_x:41,spr_double_y:42,spr_double_xy:43,spr_use_predef0:48,spr_use_predef1:49,spr_use_predef2:50,spr_use_predef3:51,spr_use_predef4:52,spr_use_predef5:53,spr_use_predef6:54,spr_use_predef7:55,spr_set_predef0:56,spr_set_predef1:57,spr_set_predef2:58,spr_set_predef3:59,spr_set_predef4:60,spr_set_predef5:61,spr_set_predef6:62,spr_set_predef7:63,spr_autoinc_S:64,spr_inc_S:65,spr_dec_S:66,spr_copy_idx_S:67,spr_rot_fill_S:68,spr_mirr_fill_multi_S:69,spr_mirr_fill_sing_S:70,spr_spec_S:79,spr_mirr_h_mult_S:80,spr_mirr_h_sing_S:81,spr_mirr_v_S:82,spr_rot90_S:83,spr_rot180_sing_S:84,spr_rot180_mult_S:85,spr_rot270_S:86,spr_rot90_mirr_h_sing_S:87,spr_rot90_mirr_v_sing_S:88,spr_sh_left_mult_S:90,spr_sh_right_mult_S:91,spr_sh_left_sing_S:92,spr_sh_right_sing_S:93,spr_sh_up_S:94,spr_sh_down_S:95,spr_set_idx_S:96,spr_def_raw_S:97,spr_copy_S:98,spr_def_cmp0_S:99,spr_def_cmp_base_S:100,spr_double_x_S:105,spr_double_y_S:106,spr_double_xy_S:107,spr_use_predef0_S:112,spr_use_predef1_S:113,spr_use_predef2_S:114,spr_use_predef3_S:115,spr_use_predef4_S:116,spr_use_predef5_S:117,spr_use_predef6_S:118,spr_use_predef7_S:119,spr_set_predef0_S:120,spr_set_predef1_S:121,spr_set_predef2_S:122,spr_set_predef3_S:123,spr_set_predef4_S:124,spr_set_predef5_S:125,spr_set_predef6_S:126,spr_set_predef7_S:127,spr_autoinc_T:128,spr_inc_T:129,spr_dec_T:130,spr_copy_idx_T:131,spr_rot_fill_T:132,spr_mirr_fill_multi_T:133,spr_mirr_fill_sing_T:134,spr_spec_T:143,spr_mirr_h_mult_T:144,spr_mirr_h_sing_T:145,spr_mirr_v_T:146,spr_rot90_T:147,spr_rot180_sing_T:148,spr_rot180_mult_T:149,spr_rot270_T:150,spr_rot90_mirr_h_sing_T:151,spr_rot90_mirr_v_sing_T:152,spr_sh_left_mult_T:154,spr_sh_right_mult_T:155,spr_sh_left_sing_T:156,spr_sh_right_sing_T:157,spr_sh_up_T:158,spr_sh_down_T:159,spr_set_idx_T:160,spr_def_raw_T:161,spr_copy_T:162,spr_def_cmp0_T:163,spr_def_cmp_base_T:164,spr_double_x_T:169,spr_double_y_T:170,spr_double_xy_T:171,spr_use_predef0_T:176,spr_use_predef1_T:177,spr_use_predef2_T:178,spr_use_predef3_T:179,spr_use_predef4_T:180,spr_use_predef5_T:181,spr_use_predef6_T:182,spr_use_predef7_T:183,spr_set_predef0_T:184,spr_set_predef1_T:185,spr_set_predef2_T:186,spr_set_predef3_T:187,spr_set_predef4_T:188,spr_set_predef5_T:189,spr_set_predef6_T:190,spr_set_predef7_T:191,spr_autoinc_TS:192,spr_inc_TS:193,spr_dec_TS:194,spr_copy_idx_TS:195,spr_rot_fill_TS:196,spr_mirr_fill_multi_TS:197,spr_mirr_fill_sing_TS:198,spr_spec_TS:207,spr_mirr_h_mult_TS:208,spr_mirr_h_sing_TS:209,spr_mirr_v_TS:210,spr_rot90_TS:211,spr_rot180_sing_TS:212,spr_rot180_mult_TS:213,spr_rot270_TS:214,spr_rot90_mirr_h_sing_TS:215,spr_rot90_mirr_v_sing_TS:216,spr_sh_left_mult_TS:218,spr_sh_right_mult_TS:219,spr_sh_left_sing_TS:220,spr_sh_right_sing_TS:221,spr_sh_up_TS:222,spr_sh_down_TS:223,spr_set_idx_TS:224,spr_def_raw_TS:225,spr_copy_TS:226,spr_def_cmp0_TS:227,spr_def_cmp_base_TS:228,spr_double_x_TS:233,spr_double_y_TS:234,spr_double_xy_TS:235,spr_use_predef0_TS:240,spr_use_predef1_TS:241,spr_use_predef2_TS:242,spr_use_predef3_TS:243,spr_use_predef4_TS:244,spr_use_predef5_TS:245,spr_use_predef6_TS:246,spr_use_predef7_TS:247,spr_set_predef0_TS:248,spr_set_predef1_TS:249,spr_set_predef2_TS:250,spr_set_predef3_TS:251,spr_set_predef4_TS:252,spr_set_predef5_TS:253,spr_set_predef6_TS:254,spr_set_predef7_TS:255},W={NEXT_ADDR:32,BRANCH_ADDR:16,FN_WITH_BRACKET:32,COMMAND:128},te={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26,A:27,B:28,C:29,D:30,E:31,F:32,G:33,H:34,I:35,J:36,K:37,L:38,M:39,N:40,O:41,P:42,Q:43,R:44,S:45,T:46,U:47,V:48,W:49,X:50,Y:51,Z:52,Ax:53,Bx:54,Cx:55,Dx:56,Ex:57,Fx:58,Gx:59,Hx:60,Ix:61,Jx:62,Kx:63,Lx:64,Mx:65,Nx:66,Ox:67,Px:68,Qx:69,Rx:70,Sx:71,Tx:72,Ux:73,Vx:74,Wx:75,Xx:76,Yx:77,Zx:78},Ct={a:["rega",128],A:["regx",128],Ax:["regy",128],Px:["regp",128],p:["pcnt",0],P:["param",192],t:["time",128],T:["timehi",128],Tx:["timer",128],x:["scrx",128],y:["scry",128],c:["scrcol",128],z:["scrmode",128],i:["raster",0],Z:["selspr",128],q:["sprcolf",128],Q:["spr#col",0],Qx:["sprcol",0],n:["sprbgcolf",128],N:["spr#bgcol",0],Nx:["sprbgcol",0],Xx:["sprx",128],X:["spr#x",192],Yx:["spry",128],Y:["spr#y",192],Sx:["sprshape",128],S:["spr#shape",192],Cx:["sprcolor",128],C:["spr#color",192],e:["sprenablef",128],E:["spr#enable",192],Ex:["sprenable",128],o:["sprtallf",128],O:["spr#tall",192],Ox:["sprtall",128],w:["sprwidef",128],W:["spr#wide",192],Wx:["sprwide",128],m:["sprmovingf",128],Mx:["sprmoving",128],M:["spr#moving",128],k:["kescr",0],K:["keyscan",0],Zx:["seljoy",128],b:["joyba",0],B:["joybb",0],Bx:["joybx",0],u:["joyua",0],U:["joyub",0],Ux:["joyux",0],l:["joyla",0],L:["joylb",0],Lx:["joylx",0],r:["joyra",0],R:["joyrb",0],Rx:["joyrx",0],d:["joyda",0],D:["joydb",0],Dx:["joydx",0],h:["joyha",0],H:["joyhb",0],Hx:["joyhx",0],v:["joyva",0],V:["joyvb",0],Vx:["joyvx",0],g:["rseed",128],G:["rbool",0],Gx:["rprob",64],I:["rbyte",0],Ix:["rword",0]},kt={rega:["a",128],regx:["A",128],regy:["Ax",128],regp:["Px",128],pcnt:["p",0],param:["P",192],time:["t",128],timehi:["T",128],timer:["Tx",128],scrx:["x",128],scry:["y",128],scrcol:["c",128],scrmode:["z",128],raster:["i",0],selspr:["Z",128],sprcolf:["q",128],"spr#col":["Q",0],sprcol:["Qx",0],sprbgcolf:["n",128],"spr#bgcol":["N",0],sprbgcol:["Nx",0],sprx:["Xx",128],"spr#x":["X",192],spry:["Yx",128],"spr#y":["Y",192],sprshape:["Sx",128],"spr#shape":["S",192],sprcolor:["Cx",128],"spr#color":["C",192],sprenablef:["e",128],"spr#enable":["E",192],sprenable:["Ex",128],sprtallf:["o",128],"spr#tall":["O",192],sprtall:["Ox",128],sprwidef:["w",128],"spr#wide":["W",192],sprwide:["Wx",128],sprmovingf:["m",128],sprmoving:["Mx",128],"spr#moving":["M",128],kescr:["k",0],keyscan:["K",0],seljoy:["Zx",128],joyba:["b",0],joybb:["B",0],joybx:["Bx",0],joyua:["u",0],joyub:["U",0],joyux:["Ux",0],joyla:["l",0],joylb:["L",0],joylx:["Lx",0],joyra:["r",0],joyrb:["R",0],joyrx:["Rx",0],joyda:["d",0],joydb:["D",0],joydx:["Dx",0],joyha:["h",0],joyhb:["H",0],joyhx:["Hx",0],joyva:["v",0],joyvb:["V",0],joyvx:["Vx",0],rseed:["g",128],rbool:["G",0],rprob:["Gx",64],rbyte:["I",0],rword:["Ix",0]},Ot={rega:1,regx:65,regy:112,regp:111,pcnt:16,param:80,time:20,timehi:84,timer:99,scrx:24,scry:25,scrcol:3,scrmode:26,raster:9,selspr:90,sprcolf:17,"spr#col":81,sprcol:107,sprbgcolf:14,"spr#bgcol":78,sprbgcol:106,sprx:125,"spr#x":88,spry:119,"spr#y":89,sprshape:110,"spr#shape":83,sprcolor:124,"spr#color":67,sprenablef:5,"spr#enable":69,sprenable:113,sprtallf:15,"spr#tall":79,sprtall:121,sprwidef:23,"spr#wide":87,sprwide:115,sprmovingf:13,sprmoving:103,"spr#moving":77,kescr:11,keyscan:75,seljoy:109,joyba:2,joybb:66,joybx:127,joyua:21,joyub:85,joyux:120,joyla:12,joylb:76,joylx:118,joyra:18,joyrb:82,joyrx:114,joyda:4,joydb:68,joydx:108,joyha:8,joyhb:72,joyhx:116,joyva:22,joyvb:86,joyvx:126,rseed:7,rbool:71,rprob:101,rbyte:73,rword:98},g=class g{static expandStringConstants(e,t){return e.replace(/{([^}]*)}/g,(r,s)=>{const n=/[a-zA-Z_][a-zA-Z0-9_]*/g;let i="",a="",l=0,d;const x=()=>{a&&(i+=`{${a}}`,a="")};for(;d=n.exec(s);){const c=d[0],p=s.slice(d.index+c.length);if(a+=s.slice(l,d.index),l=d.index+c.length,!(c in t)||p.trimStart().startsWith("(")){a+=c;continue}const u=t[c];if(typeof u=="string"){x(),i+=u;continue}if(!Number.isInteger(u)||u<0)throw new Error(`String constant ${c} must be a non-negative integer or string`);a+=`0x${u.toString(16).padStart(2,"0")}`}return a+=s.slice(l),x(),i})}};g.CTT_COMMAND_TOKENS=St,g.TTC_COMMAND_TOKENS=Object.fromEntries(Object.entries(ce).map(([e,t])=>[e,t[0]])),g.TTC_SCREEN_TOKENS={...Et,...wt,...Tt,...D},g.TTC_STRING_TOKENS=g.TTC_SCREEN_TOKENS,g.TTC_STRING_TOKENS_UPPER=Object.fromEntries(Object.entries(g.TTC_STRING_TOKENS).map(([e,t])=>[e.toUpperCase(),t])),g.TTC_SYSTEM_VARS={...Ot,...Object.fromEntries(Object.entries(kt).map(([e,t])=>[e.toUpperCase(),D[t[0]]])),...Object.fromEntries(Object.entries(Ct).map(([e,t])=>[e,D[t[0]]]))},g.CTT_STRING_TOKENS=Object.fromEntries(Object.entries(g.TTC_STRING_TOKENS).filter(([e,t])=>e.indexOf("spr_")!==0).map(([e,t])=>[t,e])),g.EXTRA_ZEROS=Object.fromEntries(Object.entries(ce).map(([e,t])=>{let r=0;return t[1]&W.COMMAND&&t[1]&(W.NEXT_ADDR|W.BRANCH_ADDR)&&(t[1]&W.NEXT_ADDR&&r++,t[1]&W.BRANCH_ADDR&&r++),[e,r*2]})),g.IS_COMMAND=Object.fromEntries(Object.entries(ce).map(([e,t])=>[e,!!(t[1]&W.COMMAND)])),g.CTT_SPRITE_TOKENS=Object.fromEntries(Object.entries(g.TTC_STRING_TOKENS).filter(([e,t])=>e.indexOf("spr_")==0).map(([e,t])=>[t,e])),g.blockEndToken=g.TTC_COMMAND_TOKENS._lf,g.finalToken=g.TTC_COMMAND_TOKENS.end,g.strDQuote=g.TTC_COMMAND_TOKENS.DQUOTE,g.strSQuote=g.TTC_COMMAND_TOKENS.SQUOTE,g.strBQuote=g.TTC_COMMAND_TOKENS.SQUOTE,g.strQQuote=g.TTC_COMMAND_TOKENS.QQUOTE,g.cmdParams={...vt},g.gbFuncs={SETPOS(e,t){const r=parseInt(e,10)+parseInt(t,10)*40;return[g.TTC_SCREEN_TOKENS.set_addr0+(r>>8),r&255]},COMPRESS(e){return Array.from(e,w.textToScreen)},VB(e,t){const r=Object.values(t).find(({longvar:s})=>s===e);if(!r)throw new Error(`Variable ${e} not found in DIM declaration`);return[g.TTC_SCREEN_TOKENS[r.shortvar]]}};let b=g;const ae=class ae{static getTokensFromMemory(e,t=2049){const r=function(l,d){return l+d*256},s=[];let n=0,i=t,a="";for(;n<e.length;){let l=function(u){if(p>=128){const f=b.CTT_COMMAND_TOKENS[p];if(!f)return;u.key=p>162?"func":"command",u.value=f,a=f}p>=65&&p<=90&&(u.key="identifier",u.value=u.escapedValue),p==32&&(u.key="whiteSpc",u.value=u.escapedValue)};if(i<n+t||i<t||i>t+e.length){console.log(`Invalid address ${i}`);break}if(n=i-t,i=r(e[n],e[n+1]),i==0)break;const d=r(e[n+2],e[n+3]);s.push({key:"label",value:d.toString(10),pos:n+t}),n+=4;let x;x=v.scopeCommand;const c={key:"error",value:"error",escapedMode:"",escapedValue:""};let p=0;for(;n+t<i&&(p=e[n],p!=0);){switch(c.value="error",c.key="error",[c.escapedMode,c.escapedValue]=w.petsciiCodeToEscaped(p),x){case v.scopeCommand:l(c),x=v.scopeArgs,c.value=="rem"&&(x=v.scopeRem);break;case v.scopeRem:c.key="rem",c.value=c.escapedValue;break;case v.scopeString:if(c.escapedValue=='"'?(x=v.scopeArgs,c.key="other"):c.key="strDQuote",c.escapedMode=="code"){const u=ae.STR_CODES[a]||ae.STR_CODES.print;c.value=u[p]?`{${u[p]}}`:`{${c.escapedValue}}`}else c.value=c.escapedValue;break;case v.scopeArgs:c.value=c.escapedValue,c.key="other",l(c),c.value=='"'?x=v.scopeString:c.value==":"?x=v.scopeCommand:(c.value>="0"&&c.value<="9"||c.value==".")&&(c.key="floatNum");break}s.push({key:c.key,value:c.value,pos:n+t}),n++}s.push({key:"newLines",value:`
`,pos:n+t})}return s}static tokenArrayToRepr(e){let t="";return e.forEach(r=>{t+=r.value}),t}};ae.STR_CODES={print:b.CTT_STRING_TOKENS,sprite:b.CTT_SPRITE_TOKENS,font:b.CTT_STRING_TOKENS};let xe=ae;class De extends Error{constructor(e,t){super(e),this.name="ErrorWithMeta",Object.setPrototypeOf(this,De.prototype),t&&(this.file=t.file,this.line=t.line,this.column=t.column,this.token=t.token,this.pos=t.pos)}}const H=class H{static getGroups(e){const t={};return e===void 0||e?.groups===void 0?{}:(Object.keys(e.groups).forEach(r=>{if(e.groups&&e.groups[r]!==void 0&&e.groups[r]!==""){const s=e.groups[r];t[r]=s}}),t)}static verboseRegexp(e,t){const r=new RegExp("(?<!\\\\)\\s|[/][/].*|[/][*][\\s\\S]*[*][/]","g"),s=e.replace(r,"");return new RegExp(s,t)}static convertSpecToBytes(e,t){const r=t.tokens||{},s=t.funcs||{},n=t.worldLH===void 0?!0:t.worldLH;t.useUppercase===void 0||t.useUppercase;const i=[];let a;function l(p,u=!1){return!u&&p<256?[p]:n?[p&255,p>>8&255]:[p>>8&255,p&255]}H.STRING_PARSER.lastIndex=0;let d=1e4;const x=[];for(;a=H.STRING_PARSER.exec(e);){if(d--,d<0)throw"Too many iterations!";const p=H.getGroups(a),u=a[0];if(u===""||u==null)break;let f=[];if(p.deci!==void 0){const _=p.deci.trim();f=l(parseInt(_,10),_.slice(-1).toLowerCase()=="w")}else if(p.hexa!==void 0){const _=p.hexa.replace(/[$]|(0x)/,"");f=l(parseInt(_,16),_.slice(-1).toLowerCase()=="w")}else if(p.str_extra_fn!==void 0)if(s[p.str_extra_fn]===void 0){const _=Object.keys(s).map($=>$.toLowerCase()),h=p.str_extra_fn.toLowerCase();if(_.includes(h)){const $=Object.keys(s)[_.indexOf(h)];f=s[$](...p.str_extra_fnparam.split(/,\s*/g))}else throw new Error(`Function not implemented: ${p.str_extra_fn}`)}else f=s[p.str_extra_fn](...p.str_extra_fnparam.split(/,\s*/g));else if(p.code!==void 0){if(r[p.code]!==void 0)f=r[p.code];else{f=r.undefined;const _=p.code.toLowerCase(),$=Object.keys(r).map(M=>M.toLowerCase()).indexOf(_);$>=0&&(f=Object.values(r)[$])}f===void 0&&(x.push({code:p.code,pos:(t.pos||0)+a.index}),f=[63])}else p.sep&&p.sep.trim()==","&&(f=[0]);let y=1;p.multi&&(y=parseInt(p.multi,10)),typeof f=="number"&&(f=[f]);for(let _=0;_<y;_++)i.push(...f)}const c=x.length>0?"ERROR":"OK";return{byteArray:i,status:c,invalidCodes:x}}static convertStringToBytes(e,t){const r=[],s=[];let n,i,a="OK";const l=t.normalConverter||(x=>String.prototype.charCodeAt.bind(x)(0)),d=/({[^}]+})|(.)/g;for(;n=d.exec(e);){const[x,c,p]=n;if(c){t.pos=n.index;const{byteArray:u,status:f,invalidCodes:y}=H.convertSpecToBytes(c.slice(1,-1),t);f!=="OK"&&(a=f,s.push(...y)),r.push(...u)}else i=l(p),r.push(i)}return{byteArray:r,status:a,invalidCodes:s}}};H.STRING_PARSER=H.verboseRegexp(String.raw`
         (\s*?)(
          (?<rem>(([-]{2}|[/]{2}).*$)|[/][*][\s\S]*?[*][/]) |

          ( (?<str_extra_fn>\w+\s*)[(]
            (?<str_extra_fnparam>[^)][^)]*?)
            (?<str_extra_end>[)])
          ) |

          (
            (?<code>[a-zA-Z_][a-zA-Z_0-9]*) |
            (?<hexa>(?:[$]|0x)[0-9a-fA-F]+[w]{0,1}) |
            (?<deci>[0-9]+[w]{0,1})

          )?
          (?:[*]?)
          (?<multi>[0-9]+)?
          (?<sep>[,;]\s*|$|\s+)?
        )
        `,"gm");let K=H;class Nt extends Array{}class Mt extends Error{constructor(e,t,r,s){super(r),this.name="TokenizerError",this.code=e,this.type=t,this.location=s,Object.setPrototypeOf(this,new.target.prototype)}format(){const{file:e,line:t,column:r}=this.location;return`${this.code} - ${this.type} - ${e} L${t} C${r}. ${this.message}`}}var N=(o=>(o.remark="remark",o.docstr="docstr",o.remMulti="remMulti",o.strDQuote="strDQuote",o.strSQuote="strSQuote",o.strBQuote="strBQuote",o.whiteSpc="whiteSpc",o.numHex="hexNum",o.numFloat="floatNum",o.numFloatV2="floatNumV2",o.numInt="intNum",o.constData="constData",o.identifier="identifier",o.other="other",o))(N||{});const At={remark:[1100,String.raw`(?<remark>\/\/.*$)`],remDash:[1150,String.raw`(?<remark>[\-]{2}.*$)`],docstr:[1200,String.raw`(?<docstr>\/[*]{2}[\S\s]*?[*]\/)`],remMulti:[1300,String.raw`(?<rem_multi>\/[*][\S\s]*?[*]\/)`],constData:[1200,String.raw`(?<skip__constStart>[#]const)(?<constData>[^;]+?)(?<skip__constEnd>[;])`],strDQuote:[2100,String.raw`(?<other__strDO>\")(?<strDQuote>[^\"]*?)(?<other__strDC>\")`],strSQuote:[2200,String.raw`(?<other__strSO>\')(?<strSQuote>[^\']*?)(?<other__strSC>\')`],strBQuote:[2300,String.raw`(?<other__strBO>\`)(?<strBQuote>[^\`]*?)(?<other__strBC>\`)`],whiteSpc:[3100,String.raw`(?<whiteSpc>\s+)`],hexNum:[4100,String.raw`(?<hexNum>(0x[0-9a-f]+))`],floatNum:[4200,String.raw`(?<floatNum>(\d+[.]\d+|\d+[.]|[.]\d+))`],floatNumV2:[4200,String.raw`(?<floatNum>(\d*[.]\d*))`],intNum:[4300,String.raw`(?<intNum>(\d+))`],identifier:[8100,String.raw`(?<identifier>[\w.]+)`]};class R{constructor(e){if(this.errors=[],this.constants={},!e.TokenClass||!e.splitFunc||!e.rxPattern)throw Error("Invalid TokenizerSettings object. Use class to create one!");this.settings=e,this.TokenClass=this.settings.TokenClass,this.rxPattern=new RegExp(this.settings.rxPattern,"gm"),Object.keys(e.subFormatPatterns).length>0?this.subFormatPatterns=Object.fromEntries(Object.entries(e.subFormatPatterns).map(([t,r])=>[t,R.convertTokenizerFunction(r)])):this.subFormatPatterns={},this.rawText="",this.tokens=new Nt,this.linePosTable=[],this.tokenizedRaw=""}reset(){this.tokens=[],this.linePosTable=[],this.constants={}}static convertTokenizerFunction(e){return typeof e=="string"?R.verboseRegexp(e,"gm"):e}static verboseRegexp(e,t){const r=new RegExp("(?<!\\\\)\\s|[/][/].*|[/][*][\\s\\S]*[*][/]","g"),s=e.replace(r,"");return new RegExp(s,t)}static buildRxString(e,t=null,r="(?<other>.)"){const s=[];e.forEach(a=>{let l=t?.[a];if(l||(l=At[a]),!l)throw Error(`Invalid item: ${a}`);s.push(l)});const n=s.sort((a,l)=>a[0]-l[0]).map(a=>a[1]);r&&n.push(r);const i=n.join(" | ");return R.verboseRegexp(i,"gm")}static noSplitter(e,t,r){return[e]}static lineSplitter(e,t,r){const s=e.value.split(/\r\n|\r|\n/gm);if(s.length==1)return[e];const n=[];return s.forEach((i,a)=>{if(a){const c=R.createToken("addNewLine","",e.pos,t,r);n.push(c)}const d=e.pos+0,x=R.createToken(e.key,i,d,t,r);n.push(x)}),n}getRxString(){return this.rxPattern.toString()}addToken(e,t,r){const s=R.createToken(e,t,r,this.settings,this.TokenClass);this.tokens.push(s)}static createToken(e,t,r,s,n){const i=s.mapper[e]||e,a=s.htmlClassPrefix+i,l=t,d=s.PrettifierClass.prettifyToken(e,i,l);return new n(e,t,r,l,d,i,a,s.tokenTypeMapper)}get currentPos(){const e=this.tokens[this.tokens.length-1].pos;return this.posToString(e)}addSyntaxError(e,t,r){this.addError("E101","Syntax Error",e,t,r)}addTokenizerError(e,t,r){this.addError("E102","Tokenizer Error",e,t,r)}addWarning(e,t,r){this.addError("W101","Warning",e,t,r)}addError(e,t,r,s,n){const[i,a]=this.getLineInfo(s);this.errors.push(new Mt(e,t,r,{file:n,line:i+1,column:s-a+1,pos:s}))}tokenizeString(e,t="<input>"){this.rawText=e,this.reset(),this.tokenizedRaw="",this.errors=[],this.collectLineInfo();let r;this.rxPattern.lastIndex=0;let s=-1,n=1;for(;r=this.rxPattern.exec(this.rawText);){let i,a;if(!r.groups)return this.addTokenizerError("Tokenizer pattern must use named capturing blocks",r.index,t),this.errors;const l=Object.entries(r.groups).filter(([c,p])=>p!=null),d=Object.values(l).reduce((c,p)=>c+p[1].length,0);if(d!==r[0].length)return this.addTokenizerError(`Tokenizer pattern did not capture all matched text: ${JSON.stringify(r[0])}`,r.index+d,t),this.errors;if(!r[0].length||r.index==s)return this.addTokenizerError("Tokenizer pattern produced an empty match",r.index,t),this.errors;if(r.index!=s+n){const c=s+n,p=e.slice(c,r.index);this.addToken("_guard",p,c),this.addSyntaxError(`Unrecognized text: ${JSON.stringify(p)}`,c,t),this.tokenizedRaw+=p}let x=r.index;l.forEach(c=>{[i,a]=c,i=i.replace(/__.*$/,""),(!this.settings.skipEmpty||a)&&(this.addToken(i,a,x),i==="_guard"&&this.addSyntaxError(`Unrecognized text: ${JSON.stringify(a)}`,x,t),this.tokenizedRaw+=a),x+=a.length}),s=r.index||0,n=r[0].length||0}if(s+n<e.length){const i=s+n,a=e.slice(i);this.addToken("_guard",a,i),this.addSyntaxError(`Unrecognized text: ${JSON.stringify(a)}`,i,t),this.tokenizedRaw+=a}if(this.tokenizedRaw!==e){let i=0;for(;i<this.tokenizedRaw.length&&i<e.length&&this.tokenizedRaw[i]===e[i];)i++;return this.addTokenizerError("Tokenizer output did not cover the complete input",i,t),this.errors}return this.checkStringCharset(t),this.collectConstants(t),this.errors}collectConstants(e){this.tokens.filter(t=>t.key==="constData").forEach(t=>{const r=new qe({evaluationMode:this.settings.constEvaluationMode});try{r.parseBlock(t.value),this.constants={...this.constants,...r.getConstants()}}catch(s){const n=s instanceof Error?s.message:String(s);this.addTokenizerError(n,t.pos,e)}})}checkStringCharset(e){const t=["strDQuote","strSQuote","strBQuote","strQQuote","other"];this.tokens.filter(r=>t.includes(r.key)).forEach(r=>{for(let s=0;s<r.value.length;s++){const n=r.value[s];n.charCodeAt(0)>127&&this.addTokenizerError(`Unsupported non-ASCII character: ${JSON.stringify(n)}`,r.pos+s,e)}})}collectLineInfo(){this.linePosTable=[];const e=this.rawText.split(`
`);let t=0,r=0;e.forEach(s=>{r=t+s.length;const n={start:t,end:r};this.linePosTable.push(n),t=r+1})}getLineInfo(e){let t=-1,r=-1;for(;e>t;)r++,t=this.linePosTable[r].end;return[r,this.linePosTable[r--].start]}posToString(e,t="ln %ln col %col",r=1){const[s,n]=this.getLineInfo(e),i=e-n;return t.replace("%ln",(s+r).toString()).replace("%pos",e.toString()).replace("%col",(i+r).toString())}static getNewLines(e){return e.key!=="whiteSpc"?0:e.value.match(/\r\n|\n|\r/g)?.length||0}getFormattedFromTokens(e="reprPretty"){const t=this.tokens,r=[""],s=[""],n=[""],i=[""],a=[""];return t.forEach((l,d,x)=>{const[c,p]=this.settings.PrettifierClass.getNewLineCountFunction(l,x,d);p?u(p):c&&this.settings.splitFunc(c,this.settings,this.TokenClass).forEach((h,$)=>{h.key=="addNewLine"?u(1):(h.value!=""||!this.settings.skipEmpty)&&y(h,this)});function u(_){for(let h=0;h<_;h++)r.push(""),s.push(""),n.push(""),i.push(""),a.push("")}function f(_,h,$,M,F){if(h in M){let Y=function(j,I){const m=$.slice(j,I);B+=m.length,f(_,"error",m,M,F)};const V=M[h];if(typeof V=="function"){const[j,I]=V(h,$);return f(_,j,I,M,F),_}if(!(V instanceof RegExp))throw Error("Not a regexp value!");let C;V.lastIndex=0;let B=0,k=0;for(;C=V.exec($);){if(!C||!C.groups||!C[0].length||C.index==null)throw Error("Update regexp - empty result!");Object.entries(C.groups).forEach(([j,I])=>{I&&(B+=I.length,f(_,j,I,M,F))}),C.index!=k&&Y(k,C.index),k=C.index+C[0].length}if(k!=$.length&&Y(k,$.length),B!=$.length)throw Error("Update regexp - characters are missing!");return _}else{const Y=F.mapper[h.replace(/__.*$/,"")]||h.replace(/__.*$/,""),V=F.htmlClassPrefix+Y;return $.replace(/ /g," ").split(`
`).forEach((k,j)=>{if(j>0&&u(1),k.length>0){const I=`<span class='${V}'>${k}</span>`;r[r.length-1]+=I,s[s.length-1]+=k,n[n.length-1]+=k,i[i.length-1]+=k,a[a.length-1]+=k}}),_}}function y(_,h){c!=null&&f([[]],_.key,_.value,h.subFormatPatterns,h.settings)}}),{allFormattedHTML:r,allTexts:s,allRepr:i,allReprPretty:a,allValues:n}}}const re={0:[],1:[b.TTC_COMMAND_TOKENS.BYTE],2:[b.TTC_COMMAND_TOKENS.WORD],3:[b.TTC_COMMAND_TOKENS.F08],4:[b.TTC_COMMAND_TOKENS.F88]};class se{constructor(e,t){this.typeCodes=e,this.settings=t}digitToArray(e){const t=parseInt(e);if(t<0||t>9)throw TypeError(`Invalid digit for byte parsing: ${e}`);return[w.textToScreen(e)]}byteToArray(e){const t=parseInt(e);if(t<-128||t>255)throw TypeError(`Invalid value for byte parsing: ${e}`);return[...this.typeCodes[1],t+256&255]}wordToArray(e){const t=parseInt(e);if(t<-32768||t>65535)throw TypeError(`Invalid value for word parsing: ${e}`);const r=t+65536&65535;return[...this.typeCodes[2],r&255,r>>8]}integerToArray(e){return this.settings.integerEncoders.map(r=>{try{return r.bind(this)(e)}catch{return[]}}).filter(r=>r.length>0)[0]}}const Le={allowDigits:!0,allowTokens:!0,integerEncoders:[se.prototype.digitToArray,se.prototype.byteToArray,se.prototype.wordToArray]},Rt=254;class J extends Error{constructor(e,t){const r=`Invalid variable name: ${e}. ${t}`;super(r),this.name="InvalidVariableNameError",Object.setPrototypeOf(this,new.target.prototype)}}function Dt(o){return o.sort((r,s)=>te[r]-te[s]).reduce((r,s)=>{if(r.length===0)return[[s]];const n=r[r.length-1],i=n[n.length-1];return te[s]===te[i]+1?n.push(s):r.push([s]),r},[]).map(r=>r.length>2?`${r[0]}-${r[r.length-1]}`:r.join("")).join("")}class pe{constructor(){this.rxTypesLong=Object.keys(Te).join("|"),this.rxTypesShort=Object.keys(Ee).join("").replace(/0/,""),this.defaultSizePostfix={128:"$",254:""},this.numberTokenizer=new se(re,Le),this.variableMapping={}}getDimText(e){let t="";return e.forEach(r=>{r.category==="dimDetailsLong"&&(t+=r.value+`
`)}),t}getDimSourcePos(e,t){let r=0,s=0;for(const n of e){if(n.category!=="dimDetailsLong")continue;const i=r+n.value.length+1;if(t<i)return n.pos+Math.min(t-r,n.value.length);r=i,s=n.pos+n.value.length}return s}reportDimErrors(e,t,r,s="<input>"){e.forEach(([n,i,a])=>{r.addSyntaxError(String(a??"Invalid DIM declaration").trim()||"Invalid DIM declaration",this.getDimSourcePos(t,n),s)})}getType(e){const t={dataLength:1,memBytes:1},r=/^(?<baseType>\$|FIXSTR|.*)[.]?(?<dataLength>\d+)?$/,s=e.match(r);let n=1;if(!s?.groups)throw new Error(`Invalid type string format: ${e}`);(s.groups.baseType==="$"||s.groups.baseType==="FIXSTR")&&(s?.groups.dataLength?n=Number(s.groups.dataLength):n=Rt,t.dataLength=n,t.memBytes=n+2);const i=s.groups.baseType;if(i in Ee)return{...Ee[i],...t};if(i.toUpperCase()in Te)return{...Te[i.toUpperCase()],...t};throw new Error(`Invalid type string format: ${e}`)}parseDimShort(e){throw Error("Not implemented dim short parse!")}parseDimLong(e,t){const r=R.verboseRegexp(String.raw`
            (?<wspc3>\s*)(?<type>
                ${this.rxTypesLong} |
                ([$]\d+) |
                [${this.rxTypesShort}][:] |
                [$&%]
            )
            (?<arr_sign>(<[=-]{1,2}))?
            (?<arr_size>\d*)
            (?=$|\s+) |
            (
                (?<var_name>
                    [a-zA-Z][a-zA-Z_×]*
                )
                (?<wspc1>\s*[,;]?\s*)
                (
                    (?<comment>[-|\/]{2}.*?$) |
                    (?<break>,|$)
                )
            ) |
            (?<wspc2>[\t\x20]+\n?|\n) |

            (?<error_word>\w+) |
            (?<error>.)`,"gmi");r.lastIndex=0;let s,n=0,i=0;const a=[],l={};let d=null,x=0,c=null,p=0;for(;s=r.exec(e);){if(!s||!s.groups||!s[0].length||s.index==null)throw Error("Update regexp - empty result!");Object.entries(s.groups).forEach(([u,f])=>{if(f){if(n+=f.length,u==="type"&&(f=f.replace(/:/g,""),d=this.getType(f),x=0),u==="arr_size"&&(x=parseInt(f,10)),u==="var_name"){this.assertVarNameValid(f,t,!0),c=f;const y=c.replace(/×/g,"x"),_=te[y]||p+100;l[c]={type:d,arr_size:x,comment:"",idx:p,idxScore:_,varIndex:-1},p++}u==="comment"&&c&&(l[c].comment=f.replace(/^--\s*/g,"")||""),u==="error"&&a.push([i,s?.index,f]),u==="error_word"&&a.push([i,s?.index,`Invalid word: ${f}`])}}),s.index!=i&&a.push([i,s.index,s[0]]),i=s.index+s[0].length,n!=i&&a.push([i,s?.index,e.substring(i,s?.index)])}if(i!=e.length&&a.push([i,0]),n!=e.length)throw Error("Update regexp - characters are missing!");return this.variableMapping=l,{vars:l,errors:a}}getVariableMapping(){return this.variableMapping}assertVarNameValid(e,t,r){const s=/^[a-zA-Z]×?$/.test(e),n=/^[a-zA-Z][a-zA-Z_]{1,}$/.test(e);if(!r&&!s)throw new J(e,"Only a single letter or a letter with × is allowed.");if(e in ce)throw new J(e,"Variable name cannot be a keyword.");if(r&&!t&&s)throw new J(e,"No single letter variable names are allowed. Use #directshort directive to allow them.");if(r&&n||r&&t&&s||!r&&s)return;throw new J(e,"Invalid variable name, ony a-z,A-Z, A×-Z×, _ are allowed.")}assignVariableNames(e,t=[]){const r=Object.entries(e).sort((a,l)=>a[1].idxScore-l[1].idxScore),s=[...Object.keys(te)].map(a=>a.length==2?a.replace(/x/g,"×"):a).filter(a=>!t.includes(a)),n={},i=Object.fromEntries(s.map((a,l)=>[a,l]));return r.forEach(([a,l])=>{const d=l.idxScore<100;let x=a;if(d){const c=s.indexOf(a);if(c!==-1)s.splice(c,1);else throw new J(a,"Short variable name not found in possible variables.")}else if(x=s.shift()||"",!x)throw new J(a,"No more short variable names available.");n[x]={...l,varName:a,transformedVarName:x,isShortVar:d,varIndex:i[x]}}),n}encodeDimLong(e){const t=[],s={};Object.values(e).forEach(a=>{const{type:l,arr_size:d}=a,{encodedType:x,encodedTypeBytes:c}=this.getTypeCode(l,d);a.typeCode=x,a.encodedTypeBytes=c;const p=x;s[p]=s[p]||[],s[p].push(a)});const n=Object.values(e).sort((a,l)=>a.idx-l.idx).map(a=>a.typeCode).filter((a,l,d)=>d.indexOf(a)===l),i={};return Object.entries(s).forEach(([a,l])=>{if(a===null)return;const d=[];if(l[0].type==null)return;d.push(...l[0].encodedTypeBytes),i[a]=d;const x=l.map(u=>u.transformedVarName),c=Dt(x),p=K.convertStringToBytes(c,Oe).byteArray;d.push(...p)}),n.forEach(a=>{const l=i[a];t.push(...l,D[","])}),t.pop(),t}getTypeCode(e,t){let r="";const s=[];if(e.shortCode!="$")r+=e.shortCode,s.push(D[e.shortCode]);else if(Object.keys(this.defaultSizePostfix).includes(e.dataLength.toString(10))){const n=this.defaultSizePostfix[e.dataLength];r+=`$${n}`,s.push(D.$,...K.convertStringToBytes(n,Oe).byteArray)}else r+=`$${e.dataLength}`,s.push(D.$,...this.numberTokenizer.integerToArray(e.dataLength.toString(10)));return t>0&&(r+=`{'<=='}${t.toString()}}`,e.shortCode=="$"&&s.push(D["<=="]),s.push(...this.numberTokenizer.integerToArray(t.toString(10)))),{encodedType:r,encodedTypeBytes:s}}}var A=(o=>(o[o.unset=0]="unset",o[o.mutableTrue=1]="mutableTrue",o[o.mutableFalse=2]="mutableFalse",o[o.finalTrue=3]="finalTrue",o[o.finalFalse=4]="finalFalse",o))(A||{});class z{constructor(e=0){this._value=0,this._value=e}isTrue(){return this._value===1||this._value===3}isFalse(){return this._value===2||this._value===4}isFinal(){return this._value===3||this._value===4}set value(e){this.isFinal()||(e===!0?this._value=1:e===!1?this._value=2:this._value=e)}}const Lt=["const"];class et{constructor(e){this.text=e,this.directives={},this.directiveDescriptions={},this.directiveValues=[],this.directiveFunctions={}}process(){this.readGlobalDirectiveValues()}analyzeVarsFromTokenized(e){return{}}readGlobalDirectiveValues(){const e=/(?:^[\n\s]*)((#\S*\s*)+)/m,t=this.text.match(e);if(!t)return{result:[],error:null};const r=t[1].split(/\s+/).map(n=>n.trim().replace(/#/g,"")).filter(n=>n.length>0&&Lt.indexOf(n)==-1),s=[];return r.forEach(n=>{Object.keys(this.directives).indexOf(n)===-1&&s.push(n)}),s.length>0?{result:[],error:`Invalid directive(s): ${s.join(", ")}`}:{result:r,error:null}}useGlobalDirectives(){const e=this.readGlobalDirectiveValues();if(e.error)throw new Error(e.error);this.directiveValues=e.result,this.directiveValues.forEach(t=>{this.directiveFunctions[t]()})}getFinalDirectives(){const e={};return Object.entries(this.directives).forEach(([t,r])=>{r instanceof z&&(r=r.isTrue()),e[t]=r}),e}}class Pe{static prettifyToken(e,t,r){return""}static getIndentOffset(e,t){return[0,0]}static getNewLineCountFunction(e,t,r){return[e,0]}}class Pt extends Pe{static prettifyToken(e,t,r){return r}static getIndentOffset(e,t){return[0,0]}static getNewLineCountFunction(e,t,r){return e.key!=="whiteSpc"?[e,0]:[null,e.value.match(/\r\n|\n|\r/g)?.length||0]}}class tt{constructor(e){Object.keys(e).forEach(t=>{if(["rxPattern","subFormatPatterns","skipEmpty","mapper","PrettifierClass","TokenClass","splitFunc","getNewLineCountFunction","tokenTypeMapper","htmlClassPrefix","constEvaluationMode"].indexOf(t)==-1)throw Error(`Invalid key ${t} for tokenizer settings!`)}),this.rxPattern=e.rxPattern||/(?<symbol>.)/g,this.subFormatPatterns=e.subFormatPatterns||{},this.skipEmpty=e.skipEmpty===void 0?!0:e.skipEmpty,this.mapper=e.mapper||{},this.htmlClassPrefix=e.htmlClassPrefix||"",this.splitFunc=e.splitFunc||R.noSplitter,this.tokenTypeMapper=e.tokenTypeMapper||ie.defaultMapper,this.constEvaluationMode=e.constEvaluationMode||"safe",this.TokenClass=e.TokenClass||ie,this.PrettifierClass=e.PrettifierClass||Pt,this.getNewLineCountFunction=e.getNewLineCountFunction||null}}const be=class be extends Pe{static prettifyToken(e,t,r){return e!=="func"&&e!=="command"&&e!=="other"?r:e=="command"?r+" ":be.PRETTIFY_REPL[r]||r}static getIndentOffset(e,t){return[0,0]}static getNewLineCountFunction(e,t,r){return e.key!=="newLines"?[e,0]:[null,e.value.match(/\r\n|\n|\r/g)?.length||0]}};be.PRETTIFY_REPL={"=":" = ","+":" + ","-":" - ","*":" * ","/":" / ",",":", ",to:" to ",step:" step ",and:" and ",or:" or ",fn:"fn ",then:" then "};let ue=be;const rt=(o,e)=>e.length-o.length,It=Object.keys(Ge).sort(rt).join("|"),Ft=Object.entries(Je).map(([o,e])=>{const[t,r]=e;return r&W.FN_WITH_BRACKET?String.raw`${o}\(`:o}).sort(rt).map(o=>o.slice(-1)=="("?o:o+"(?![a-zA-Z_])").join("|");var le=(o=>(o[o.AUTO=0]="AUTO",o[o.VERBOSE=1]="VERBOSE",o[o.SHORT=2]="SHORT",o))(le||{});class Se extends R{constructor(e={}){const t={1:{gbIdentifier:"gbIdentifierLong",gbDim:"gbDimLong"},2:{gbIdentifier:"gbIdentifierShort",gbDim:"gbDimShort"},0:{}};let r=e.verboseMode||0;r===0&&(r=1);const s={gbIdentifierLong:[8e3,String.raw`(?<identifier>[\w×]+)`],gbIdentifierShort:[8e3,String.raw`(?<identifier>[\w][×]?)`],gbSysVar:[8100,String.raw`(?<skip__sysid>[@])(?<sysId>[a-zA-Z_×#]+)`],gbPostfix:[8200,String.raw`(?<postfix>\.[\w×]+)`],gbLabel:[4e3,String.raw`(?<label>^[\w]+\s*[:]$)`],gbDimLong:[6e3,String.raw`(?<command__dim>dim)(?<dimDetailsLong>[^;]*)(?<whiteSpc__dim>;)`],gbDimShort:[6e3,String.raw`(?<command__dim>dim)(?<dimDetailsShort>[^;]*)(?<whiteSpc__dim>;)`],gbLocalLong:[6001,String.raw`(?<command__local>local)(?<localDetailsLong>[^;]*)(?<whiteSpc__local>;)`],gbSubCommand:[6040,String.raw`(?<command__sub>sprite|voice|bitmap|font)(?<whiteSpc__sub>[\t\ \xA0]*)(?<subCmd>[a-zA-Z]×?)(?![\w×])`],gbCommand:[6050,String.raw`(?<command>\?|${It})(?![a-zA-Z_])`],gbFunction:[6100,String.raw`(?<func>${Ft})`],gbOperator:[6200,String.raw`(?<operator>(AND|OR|div|mod|xor|and|or)(?![a-zA-Z_])|[+\-*\/^>=<&])`],v2Sep:[7e3,String.raw`(?<commandSep>[:])`],newLines:[3050,String.raw`(?<newLines>(\r\n|\n|\r)+)`],whiteSpace:[3100,String.raw`(?<whiteSpc>[\t\ \xA0]+)`],gbTypes:[6300,String.raw`(?<idType>([us]?(byte|word|f08|f88|f2416|float))|char|dchar|varstr|fixstr|[$])`],gbRemDash:[1150,String.raw`(?<remarkDash>[\-]{2}.*$)`],gbSysBlock:[1e3,String.raw`(?<sysBlock>[#]start.*?[#]end\s*)`],gbSysUse:[1200,String.raw`(?<use>^\s*[#]use\s+[\w=,]+)`],gbSysCmdOther:[1250,String.raw`(?<sysCmd__other>[#].*$)`],gbExpr:[6300,String.raw`(?<expr_br__start>[{])(?<expr>[^}]*?)(?<expr_br__end>[}])`],gbOther:[8500,String.raw`(?<other__8500>[@,;\(\)\[\]])`],gbStrQQuote:[2050,String.raw`(?<other_quote__strQO>\"\")(?<strQQuote>(?:[{][^}]*?[}]|.)*?)(?<other_quote__strQC>\"\")`],gbStrDQuote:[2100,String.raw`(?<other_quote__strDO>\")(?<strDQuote>(?:[{][^}]*?[}]|[^\"])*?)(?<other_quote__strDC>\")`],gbStrSQuote:[2200,String.raw`(?<other_quote__strSO>\')(?<strSQuote>(?:[{][^}]*?[}]|[^\'])*?)(?<other_quote__strSC>\')`],gbStrBQuote:[2300,String.raw`(?<other_quote__strBO>\`)(?<strBQuote>(?:[{][^}]*?[}]|[^\`])*?)(?<other_quote__strBC>\`)`]},n=R.buildRxString([N.remark,N.docstr,N.remMulti,N.numInt,N.numFloat,N.constData,"gbSysCmdOther","gbSysBlock","gbSysUse","gbStrQQuote","gbStrDQuote","gbStrSQuote","gbStrBQuote","gbExpr","gbOther","gbRemDash","gbSysVar",t[r].gbIdentifier,"gbPostfix","gbLabel","gbOperator","gbTypes",t[r].gbDim,"gbLocalLong","gbSubCommand","gbCommand","gbFunction","newLines","v2Sep","whiteSpace"],s,""),i={strDQuote:String.raw`  (
                                      (?<other__sp_open>[{])
                                      (?<strSpecial>[^}]*?)
                                      (?<other__sp_close>[}])
                                    ) |
                                    (?<strNormal>[^{]+)`,strSpecial:String.raw`
            (?<whiteSpc__100>\s*?)(
             (?<remark__str>(([-]{2}|[/]{2}).*$)|[/][*][\s\S]*?[*][/]) |

             ( (?<func__str>\w+\s*)
                (?<other__bropen>[(])
                (?<strfunc_params>[^)]*?)
               (?<other__brclose>[)])
             ) |

             (
               (?<strSpecCheck>\w+) |
               (?<intNum__1>[a-zA-Z_][a-zA-Z_0-9]*) |
               (?<intNum__2>(?:[$]|0x)[0-9a-fA-F]+[w]{0,1}) |
               (?<intNum__3>[0-9]+[w]{0,1})
             )
             ((?<other__multi>\s*[*]\s*)(?<intNum__str>[0-9]+))?
             (?<other__100>[,;]\s*|\s+|\s*$)
           ) |
           (?<other__101>\s+) |
           (?<error>.+?)
           `,strSpecCheck:Se.validateCode,strfunc_params:String.raw`
                            (?<other__spec100>\")(?<strNormal__strspec>[^\"]*?)(?<other__spec150>\") |
                            (?<intNum__spec100>\d+) |
                            (?<other__spec200>[,]) |
                            (?<other__spec300>.)
                            `,dimDetailsShort:"__main"},a={command:"CMD",commandRem:"CMD",subCmd:"SUBCMD",func:"FUNC",error:"ERR",constData:"CONST",strDQuote:"STR",strQQuote:"STR",strSQuote:"STR",strBQuote:"STR",strNormal:"STR",strSpec:"SPEC",label:"LABEL",floatNum:"NUM",intNum:"NUM",identifier:"VAR",identifier2:"VAR",idExtra:"EXTRA",idType:"FUNC",commandSep:"SEP",whiteSpc:"SPC",remark:"REM",remarkDash:"REM",rem_multi:"REM",docstr:"DOCSTR",other:"OTHER",other_quote:"SKIP",sysCmd:"SYS",sysCmd2:"SYS",postfix:"FUNC",expr_br:"SKIP"},l=new tt({rxPattern:n,subFormatPatterns:i,mapper:a,htmlClassPrefix:"editor-style-",PrettifierClass:ue,constEvaluationMode:e.constEvaluationMode});super(l)}static validateCode(e,t){return t.toUpperCase()in b.TTC_STRING_TOKENS_UPPER?["strSpec",t]:["error",t]}tokenizeString(e,t="<input>"){const r=super.tokenizeString(e,t);return this.validateLocalScopes(t),this.tokens.filter(s=>["strDQuote","strSQuote","strBQuote","strQQuote"].includes(s.key)).flatMap(s=>K.convertStringToBytes(b.expandStringConstants(s.value,Object.fromEntries(Object.entries(this.constants).map(([n,{value:i}])=>[n,i]))),{tokens:b.TTC_STRING_TOKENS,funcs:{...b.gbFuncs,VB:()=>[]},normalConverter:w.textToScreen}).invalidCodes.map(({code:n,pos:i})=>({code:n,pos:s.pos+i}))).forEach(({code:s,pos:n})=>{this.addTokenizerError(`Undefined string code: ${JSON.stringify(s)}`,n,t)}),r}validateLocalScopes(e){const t=new pe,r=new Set,s=new Set(this.tokens.filter(a=>a.category==="dimDetailsLong").flatMap(a=>Object.keys(t.parseDimLong(a.value,!0).vars)));let n=null,i=new Set;this.tokens.forEach(a=>{if(a.category==="dimDetailsLong"){try{const{vars:c,errors:p}=t.parseDimLong(a.value,!0);if(p.length===0){const u=t.assignVariableNames(c,[...r]);Object.keys(u).forEach(f=>r.add(f))}}catch{}return}if(a.key==="command"&&(a.value==="fast"||a.value==="def")){n=a.value,i=new Set;return}if(a.key==="command"&&(a.value==="fend"||a.value==="dend")){n=null;return}if(a.category!=="localDetailsLong")return;if(!n){this.addSyntaxError("Local declarations are only valid inside fast or def routines",a.pos,e);return}let l;try{const c=t.parseDimLong(a.value,!0);if(c.errors.length>0){c.errors.forEach(([p,u,f])=>{this.addSyntaxError(String(f??"Invalid local declaration"),a.pos+p,e)});return}l=c.vars}catch(c){this.addSyntaxError(c instanceof Error?c.message:String(c),this.getLocalErrorPos(a,c),e);return}const d=Object.keys(l).find(c=>i.has(c));if(d){this.addSyntaxError(`Duplicate local variable: ${d}`,a.pos+a.value.indexOf(d),e);return}let x;try{x=t.assignVariableNames(l,[...r])}catch(c){this.addSyntaxError(c instanceof Error?c.message:String(c),this.getLocalErrorPos(a,c),e);return}Object.keys(l).forEach(c=>{const p=a.pos+a.value.indexOf(c);s.has(c)&&this.addWarning(`Local variable shadows global variable: ${c}`,p,e),i.add(c)}),Object.keys(x).forEach(c=>r.add(c))})}getLocalErrorPos(e,t){const s=(t instanceof Error?t.message:String(t)).match(/^Invalid variable name: ([^.]+)\./),n=s?e.value.indexOf(s[1]):-1;return e.pos+Math.max(n,0)}getTokensFromMemory(e){const t=xe.getTokensFromMemory(e);this.reset(),t.forEach(r=>{this.addToken(r.key,String(r.value),r.pos)})}tokenizeStr(e){this.tokenizeString(e)}}class st extends et{constructor(){super(...arguments),this.directives={verbose:new z(A.mutableTrue),compact:new z(A.mutableFalse),strict:new z(A.mutableTrue),loose:new z(A.mutableFalse),inline:new z(A.mutableFalse),safe:new z(A.mutableTrue),trusted:new z(A.mutableFalse),directshort:new z(A.mutableFalse)},this.directiveDescriptions={verbose:"Use verbose variable and function names",compact:"Use single char variable and function names (e.g. a, A, Ax)",strict:"Allow only variable names initiated with DIM",loose:"No need to init variable names, not as safe",inline:"Add defs that are used only once inline",safe:"Do not execute js code",trusted:"Execute js code after user confirmation",directshort:"Allow short variable names (e.g. a, A, Ax) in compact mode"},this.directiveFunctions={verbose:()=>{this.directives.verbose.value=!0,this.directives.compact.value=!1},compact:()=>{this.directives.verbose.value=!1,this.directives.compact.value=!0},strict:()=>{this.directives.strict.value=!0,this.directives.loose.value=!1},loose:()=>{this.directives.strict.value=!1,this.directives.loose.value=!0},inline:()=>{this.directives.inline.value=!0},safe:()=>{this.directives.safe.value=!0,this.directives.trusted.value=!1},trusted:()=>{this.directives.safe.value=!1,this.directives.trusted.value=!0},directshort:()=>{this.directives.directshort.value=!0}}}setSettings(e){e.verboseMode===le.VERBOSE?(this.directives.verbose.value=A.finalTrue,this.directives.compact.value=A.finalFalse):e.verboseMode===le.SHORT?(this.directives.verbose.value=A.finalFalse,this.directives.compact.value=A.finalTrue):e.verboseMode===le.AUTO&&(this.directives.verbose.value=!0,this.directives.compact.value=!1)}analyzeVarsFromTokenized(e){const t={};return e.forEach(r=>{r.category==="VAR"&&(t[r.value]=(t[r.value]||0)+1)}),t}getDimDetails(e){let t=0,r=e.findIndex(s=>s.category==="DIM");if(r===-1)return{memSettings:t};for(e[r+1]?.category=="intNum"&&(t=e[r+1].value,r+=2);r<e.length&&!(e[r].category==="commandSep"&&e[r].value===";");){if(e[r].category==="idType"){for(e[r].value,e[r+1]?.category==="intNum"&&(e[r+1].value,r++),r++;e[r]?.category==="VAR";)e[r].value,e[r].value;r++}r++}}}class Ce{constructor(e,t){this.typeCodes=e,this.settings=t,this.subTokenized=[],this.varMappings={},this.validChars=[],this.reset()}reset(){this.subTokenized=[],this.varMappings={};const e=[],t=[],r=[];for(let s=0;s<26;s++)e.push(we[s+1]),t.push(we[s+65]),r.push(we[s+65]+"×");this.validChars.push(...e,...t,...r)}subTokenize(e,t=!1){let r=/(?<postindex>\.\d+|<-\d+)|(?<quickindex><-\w+)|(?<postfix>\.\w+)|(?<base>[a-z_A-Z×]+)/gm;t||(r=/(?<postindex>\.\d+|<-\d+)|(?<quickindex><-\w+)|(?<postfix>\.\w+)|(?<base>[a-zA-Z][×]?)(?<postfix2>[\w×]*)/gm),r.lastIndex=0;let s=null;const n=[];for(;(s=r.exec(e))!==null;){s.index===r.lastIndex&&r.lastIndex++;const i=s.groups?.base||"";let a=s.groups?.postfix||"";const l=s.groups?.postindex||"",d=s.groups?.quickindex||"",x=!t||i.length==1||i.length==2&&i[1]=="×";if(i){const c=x?i:this.longvarToShortvar(i);if(n.push(D[c]),s.groups?.postfix2){let p=0;for(;p<s.groups?.postfix2.length;){let u=s.groups?.postfix2[p];s.groups?.postfix2[p+1]=="×"&&(u+="×",p++),u&&n.push(D[u]),p++}}}if(a){const c=Ue[a.replace(/\./g,"")];if(!c)throw new Error(`Unknown postfix: ${a}. Valid values: `+Object.keys(Ue).join(", "));const p=c[0];n.push(D[p])}else if(l){const c=l.replace(/<-|\./g,""),u=new se(re,Le).integerToArray(c);n.push(...u)}else if(d){const c=d.replace(/<-|\./g,""),p=x?c:this.longvarToShortvar(c);n.push(D["<--"]),n.push(D[p])}}return n}longvarToShortvar(e){if(this.settings.isStrict&&e.length>0&&this.settings.dimObject[e]===void 0)throw new Error(`Variable ${e} not found in DIM declaration`);const t=Object.values(this.varMappings).filter(s=>s.longvar===e)[0];if(t)return t.shortvar;const r=this.getNextShortVar();if(!r)throw new Error("No more short variable names available");return this.varMappings[r]={shortvar:r,longvar:e,isArray:!1,length:0},r}getNextShortVar(){return this.validChars.shift()||""}addToVarMappings(e){const t=Object.fromEntries(Object.entries(e).map(([r,s])=>[r,{shortvar:r,longvar:s.varName,isArray:s.arr_size>0,length:s.arr_size,comment:s.comment||""}]));this.varMappings={...this.varMappings,...t}}}const ke={isStrict:!1,dimObject:{}},Oe={tokens:b.TTC_STRING_TOKENS,normalConverter:w.textToScreen,funcs:b.gbFuncs},T=class T extends E{constructor(e={}){super(),this.varTokenizer=new Ce(re,ke)}static numEncoder(e,t){if(e.key=="intNum")return new se(re,Le).integerToArray(e.value);throw TypeError(`Invalid type for ${e.key}: ${e.value}`)}static sysIdEncoder(e,t){if(e.repr in b.TTC_SYSTEM_VARS)return[b.TTC_SCREEN_TOKENS["@"],b.TTC_SYSTEM_VARS[e.repr]];throw new De(`Unknown system variable: ${e.repr}`)}static dimEncoder(e,t){const r=new pe,s=e.value,{vars:n,errors:i}=r.parseDimLong(s,!0);if(i.length>0)throw new Error(`Invalid DIM token: ${i}`);const a=r.assignVariableNames(n,[...t.reservedVariableNames]);return t.mappedVars=a,t.varTokenizer.addToVarMappings(a),Object.keys(a).forEach(d=>t.reservedVariableNames.add(d)),r.encodeDimLong(a)}static localEncoder(e,t){if(!t.routine||!t.localVarTokenizer)throw new Error("Local declarations are only valid inside fast or def routines");const r=new pe,{vars:s,errors:n}=r.parseDimLong(e.value,!0);if(n.length>0)throw new Error(`Invalid LOCAL token: ${n}`);Object.keys(s).forEach(a=>{if(t.localNames.has(a))throw new Error(`Duplicate local variable: ${a}`);t.localNames.add(a)});const i=r.assignVariableNames(s,[...t.reservedVariableNames]);return t.localVarTokenizer.addToVarMappings(i),Object.keys(i).forEach(a=>t.reservedVariableNames.add(a)),r.encodeDimLong(i)}static stringEncoder(e,t){if(e.key=="other"&&e.value=="?")return[b.TTC_COMMAND_TOKENS.print];const r=[],{byteArray:s,status:n}=K.convertStringToBytes(b.expandStringConstants(e.repr,t.consts||{}),{...Oe,funcs:{...b.gbFuncs,VB:i=>b.gbFuncs.VB(i,(t.localVarTokenizer||t.varTokenizer).varMappings)}});if(n!=="OK"&&console.log(n),["strDQuote","strSQuote","strBQuote","strQQuote"].includes(e.key)){const i=b[e.key];r.push(i),r.push(s.length)}return r.concat(s)}static otherEncoder(e,t){return t.lastCommand=="clr"&&e.repr==","?[]:T.stringEncoder(e,t)}static varEncoder(e,t){return(t.localVarTokenizer||t.varTokenizer).subTokenize(e.repr,t.isVerbose)}static cmdEncoder(e,t){let r=e.repr.replace("(","");e.repr=="?"&&(r="print");const s=b.TTC_COMMAND_TOKENS[r],n=b.EXTRA_ZEROS[r];if(b.IS_COMMAND[r]&&(t.lastCommand=r),r==="fast"||r==="def"){if(t.routine)throw new Error(`Cannot start ${r} inside ${t.routine}`);t.routine=r,t.localNames=new Set,t.localVarTokenizer=new Ce(re,ke),t.localVarTokenizer.varMappings={...t.varTokenizer.varMappings}}return(r==="fend"||r==="dend")&&(t.routine=null,t.localNames=new Set,t.localVarTokenizer=null),n>0?[s,...Array(n).fill(0)]:[s]}static encodeTextAsBytes(e,t={}){const r=new st(e);r.setSettings(t),r.useGlobalDirectives();const s=r.getFinalDirectives(),n=new Se({...t,constEvaluationMode:s.safe?"safe":"trusted"});return n.tokenizeString(e),r.analyzeVarsFromTokenized(n.tokens),T.encodeTokens(n.tokens,s)}static encodeTokens(e,t){const r=[],s={nextAddr:0,line:null,data:[]};function n(){if(s.data.length>0){const l=Object.assign({},s);r.push(l),s.data=[]}}const i={isVerbose:t.verbose,varTokenizer:new Ce(re,ke),localVarTokenizer:null,localNames:new Set,reservedVariableNames:new Set,routine:null,lastCommand:"",mappedVars:null,consts:null,constEvaluationMode:t.safe?"safe":"trusted"};e.forEach(l=>{if(l.category=="LABEL"){n(),parseInt(l.value,10);return}let d=this.encode(l,i);s.data.push(...d)}),n();const a=[];return r.forEach(l=>{a.push(...l.data,b.blockEndToken)}),a.push(b.finalToken),a}};T.encoders={idType:T.stringEncoder,postfix:T.varEncoder,STR:T.stringEncoder,NUM:T.numEncoder,VAR:T.varEncoder,SUBCMD:T.stringEncoder,SEP:T.stringEncoder,CMD:T.cmdEncoder,FUNC:T.cmdEncoder,operator:T.cmdEncoder,OTHER:T.otherEncoder,commandSep:E.voidEncoder,SKIP:E.voidEncoder,whiteSpc:E.voidEncoder,sysCmd:E.voidEncoder,REM:E.voidEncoder,newLines:E.voidEncoder,dimDetailsLong:T.dimEncoder,localDetailsLong:T.localEncoder,CONST:E.constEncoder,expr:E.exprEncoder,skip:E.voidEncoder,sysId:T.sysIdEncoder};let Ne=T;class nt{constructor(e){this.settings=e,this.tokens=[],this.activeTokenId=0,this.token={},this.nextToken={},this.scope="",this.docStr={},this.params={},this.tags=[],this.labels={},this.functions={}}parseTokens(e){this.tokens=e,this.activeTokenId=0,this.token={key:"_whsp"},this.params={vars:{}},this.docStr={},this.scope="__global",this.tags=[],this.labels={},this.functions={}}isFinished(){return this.activeTokenId>=this.tokens.length}posToString(){return this.settings.posToStringFn(this.token.pos)}startTag(e,t){const r="   ".repeat(this.tags.length);this.tags.push(e),console.log(`${r}<${e}> ${t}`)}endTag(){const e=this.tags.pop(),t="   ".repeat(this.tags.length);console.log(`${t}</${e}>`)}advance(){if(this.isFinished())throw Error("Document finished unexpectedly!");do{this.token=this.tokens[this.activeTokenId],this.activeTokenId++,this.token.key==this.settings.keys._docstr&&(this.docStr[this.scope]=(this.docStr[this.scope]||"")+this.token.value);const e=this.activeTokenId;do this.nextToken=this.tokens[this.activeTokenId],this.activeTokenId++;while((this.nextToken.key==this.settings.keys._whsp||this.nextToken.isRemark())&&!this.isFinished());if(this.activeTokenId=e,this.nextToken==null)break}while((this.token.key==this.settings.keys._whsp||this.token.isRemark())&&!this.isFinished())}unexpectedToken(e){throw Error(`Unexpected token '${this.token.value}' at ${this.posToString()}. 
Expected: ${e}.`)}eatGivenType(e){this.advance(),this.token.key!==e&&this.unexpectedToken(e)}eatIdentifier(){return this.eatGivenType("identifier"),this.token}eatValue(e){this.advance(),this.token.value!==e&&this.unexpectedToken(e)}eatAnyOfList(e){this.advance(),e.indexOf(this.token.value)==-1&&e.indexOf(this.token.key)==-1&&this.unexpectedToken(e.toString())}eatMany(e){const t={},r=/([{]{2}(?<inputType>\w+)\s+(?<inputName>\w+)[}]{2})|(?<const>\S+)|(?<whitespace>\s+)/gm;let s=null;for(;(s=r.exec(e))!==null;)if(s.groups!==void 0&&(s.groups.const!==void 0?this.eatValue(s.groups.const):s.groups.inputType!==void 0&&(this.eatGivenType(s.groups.inputType),t[s.groups.inputName]=this.token),this.isFinished()))throw Error(`Unfinished expression, expected ${e}`);return t}parseVarDeclaration(){const e=this.eatIdentifier().value;this.eatValue(":");const t=this.eatIdentifier().value;this.params.vars[e]=t}parseClassConst(){this.parseConst()}parseParams(){let e="",t="";const r={};for(;this.eatAnyOfList(["identifier",")"]),!(this.token.value==")"||(e=this.token.value,t="any",this.eatAnyOfList([":",",",")"]),this.token.value==":"&&(t=this.eatIdentifier().value,this.eatAnyOfList([",",")"])),r[e]=t,this.token.value==")")););return r}parseExpression(){for(this.startTag("expression","");;){if(this.advance(),this.token.isUnaryOperation()&&this.advance(),!this.token.isNumber()){if(!this.token.isString())break}this.nextToken.isBinaryOperation()&&this.advance()}this.endTag()}parseDict(){for(this.eatValue("{");this.token.value!="}";)this.advance()}parseList(){this.eatValue("[");let e=1;for(;e!=0;)this.advance(),this.token.value=="["&&e++,this.token.value=="]"&&e--}parseConst(){const e=this.eatIdentifier().value;this.eatValue("="),this.startTag("const",e),this.nextToken.value=="{"?this.parseDict():this.nextToken.value=="["?this.parseList():this.parseExpression(),this.endTag()}parseBlock(){for(this.startTag("block","");;){const e=this.activeTokenId;if(this.advance(),this.token.value=="}"){this.activeTokenId=e;break}this.token.key=="keyword"&&this.token.value==="const"&&this.parseConst()}this.endTag()}parseMethod(){const e=this.eatIdentifier().value;this.startTag("method",e),this.params.method=e,this.eatValue("("),this.parseParams(),this.eatValue("{"),this.parseBlock(),this.eatValue("}"),this.endTag()}parseMethods(){for(;this.parseMethod(),this.nextToken.value!="}";);}parseClass(){const t=this.eatMany("class {{identifier classname}} extends GolfClass {").classname.value;for(this.params.class=t,this.startTag("class",t);;){const r=this.activeTokenId;if(this.advance(),this.activeTokenId=r,this.token.value=="}")break;switch(this.nextToken.value){case":":this.parseVarDeclaration();break;case"=":this.parseClassConst();break;case"(":this.parseMethod();break}}this.eatValue("}"),this.endTag()}}const ye=class ye{constructor(e){this.posToStringFn=e.posToStringFn||String,this.keys=e.keys||ye.defaultKeys}};ye.defaultKeys={_whsp:"whiteSpc",_docstr:"docstr"};let fe=ye;class Vt extends nt{constructor(){const e=new fe({});super(e)}}const Qe={Tokenizer:Se,Prettifier:ue,Parser:Vt,Encoder:Ne,Decoder:xe,Preprocessor:st},P=class P{};P.BASIC_TOKENS={128:"end",129:"for",130:"next",131:"data",132:"input#",133:"input",134:"dim",135:"read",136:"let",137:"goto",138:"run",139:"if",140:"restore",141:"gosub",142:"return",143:"rem",144:"stop",145:"on",146:"wait",147:"load",148:"save",149:"verify",150:"def",151:"poke",152:"print#",153:"print",154:"cont",155:"list",156:"clr",157:"cmd",158:"sys",159:"open",160:"close",161:"get",162:"new",163:"tab(",164:"to",165:"fn",166:"spc(",167:"then",168:"not",169:"step",170:"+",171:"-",172:"*",173:"/",174:"^",175:"and",176:"or",177:">",178:"=",179:"<",180:"sgn",181:"int",182:"abs",183:"usr",184:"fre",185:"pos",186:"sqr",187:"rnd",188:"log",189:"exp",190:"cos",191:"sin",192:"tan",193:"atn",194:"peek",195:"len",196:"str$",197:"val",198:"asc",199:"chr$",200:"left$",201:"right$",202:"mid$",203:"go",255:"pi"},P.SCREEN_COMMANDS={0:"null",1:"ct_a",2:"ct_b",3:"ct_c",4:"ct_d",5:"white",6:"ct_f",7:"ct_g",8:"ct_h",9:"ct_i",10:"ct_j",11:"ct_k",12:"ct_l",13:"return",14:"ct_n",15:"ct_o",16:"ct_p",17:"down",18:"reverse_on",19:"home",20:"delete",21:"ct_u",22:"ct_v",23:"ct_w",24:"ct_x",25:"ct_y",26:"ct_z",28:"red",29:"right",30:"green",31:"blue",32:"space",92:"pound",95:"arrow_left",129:"orange",133:"f1",134:"f3",135:"f5",136:"f7",137:"f2",138:"f4",139:"f6",140:"f8",144:"black",145:"up",146:"reverse_off",147:"clear",149:"brown",150:"pink",151:"dark_gray",152:"gray",153:"light_green",154:"light_blue",155:"light_gray",156:"purple",157:"left",158:"yellow",159:"cyan",160:"sh_space",161:"cm_k",162:"cm_i",163:"cm_t",164:"cm_@",165:"cm_g",166:"cm_+",167:"cm_m",168:"cm_pound",169:"sh_pound",170:"cm_n",171:"cm_q",172:"cm_d",173:"cm_z",174:"cm_s",175:"cm_p",176:"cm_a",177:"cm_e",178:"cm_r",179:"cm_w",180:"cm_h",181:"cm_j",182:"cm_l",183:"cm_y",184:"cm_u",185:"cm_o",186:"sh_@",187:"cm_f",188:"cm_c",189:"cm_x",190:"cm_v",191:"cm_b",192:"sh_asterisk",219:"sh_+",220:"cm_-",221:"sh_-",223:"cm_asterisk",255:"pi"},P.CTT_COMMAND_TOKENS=P.BASIC_TOKENS,P.TTC_COMMAND_TOKENS={end:128,for:129,next:130,data:131,"input#":132,input:133,dim:134,read:135,let:136,goto:137,run:138,if:139,restore:140,gosub:141,return:142,rem:143,stop:144,on:145,wait:146,load:147,save:148,verify:149,def:150,poke:151,"print#":152,print:153,cont:154,list:155,clr:156,cmd:157,sys:158,open:159,close:160,get:161,new:162,"tab(":163,to:164,fn:165,"spc(":166,then:167,not:168,step:169,"+":170,"-":171,"*":172,"/":173,"^":174,and:175,or:176,">":177,"=":178,"<":179,sgn:180,int:181,abs:182,usr:183,fre:184,pos:185,sqr:186,rnd:187,log:188,exp:189,cos:190,sin:191,tan:192,atn:193,peek:194,len:195,str$:196,val:197,asc:198,chr$:199,left$:200,right$:201,mid$:202,go:203,pi:255},P.CTT_SCREEN_TOKENS=P.SCREEN_COMMANDS,P.TTC_SCREEN_TOKENS={null:0,ct_a:1,ct_b:2,ct_c:3,ct_d:4,white:5,ct_f:6,ct_g:7,ct_h:8,ct_i:9,ct_j:10,ct_k:11,ct_l:12,return:13,ct_n:14,ct_o:15,ct_p:16,down:17,reverse_on:18,home:19,delete:20,ct_u:21,ct_v:22,ct_w:23,ct_x:24,ct_y:25,ct_z:26,red:28,right:29,green:30,blue:31,space:32,pound:92,arrow_left:95,orange:129,f1:133,f3:134,f5:135,f7:136,f2:137,f4:138,f6:139,f8:140,black:144,up:145,reverse_off:146,clear:147,brown:149,pink:150,dark_gray:151,gray:152,light_green:153,light_blue:154,light_gray:155,purple:156,left:157,yellow:158,cyan:159,sh_space:160,cm_k:161,cm_i:162,cm_t:163,"cm_@":164,cm_g:165,"cm_+":166,cm_m:167,cm_pound:168,sh_pound:169,cm_n:170,cm_q:171,cm_d:172,cm_z:173,cm_s:174,cm_p:175,cm_a:176,cm_e:177,cm_r:178,cm_w:179,cm_h:180,cm_j:181,cm_l:182,cm_y:183,cm_u:184,cm_o:185,"sh_@":186,cm_f:187,cm_c:188,cm_x:189,cm_v:190,cm_b:191,sh_asterisk:192,"sh_+":219,"cm_-":220,"sh_-":221,cm_asterisk:223,pi:255},P.TTC_STRING_TOKENS=P.TTC_SCREEN_TOKENS;let Q=P;class ot{static getTokensFromMemory(e,t=2049){const r=function(a,l){return a+l*256},s=[];let n=0,i=t;for(;n<e.length;){let a=function(p){if(c>=128){const u=Q.CTT_COMMAND_TOKENS[c];if(!u)return;p.key=c>162?"func":"command",p.value=u}c>=65&&c<=90&&(p.key="identifier",p.value=p.escapedValue),c==32&&(p.key="whiteSpc",p.value=p.escapedValue)};if(i<n+t||i<t||i>t+e.length){console.log(`Invalid address ${i}`);break}if(n=i-t,i=r(e[n],e[n+1]),i==0)break;const l=r(e[n+2],e[n+3]);s.push({key:"label",value:l.toString(10),pos:n+t}),n+=4;let d;d=v.scopeCommand;const x={key:"error",value:"error",escapedMode:"",escapedValue:""};let c=0;for(;n+t<i&&(c=e[n],c!=0);){switch(x.value="error",x.key="error",[x.escapedMode,x.escapedValue]=w.petsciiCodeToEscaped(c),d){case v.scopeCommand:a(x),d=v.scopeArgs,x.value=="rem"&&(d=v.scopeRem);break;case v.scopeRem:x.key="rem",x.value=x.escapedValue;break;case v.scopeString:x.escapedValue=='"'?(d=v.scopeArgs,x.key="other"):x.key="strDQuote",x.escapedMode=="code"?x.value=Q.CTT_SCREEN_TOKENS[c]?`{${Q.CTT_SCREEN_TOKENS[c]}}`:`{${x.escapedValue}}`:x.value=x.escapedValue;break;case v.scopeArgs:x.value=x.escapedValue,x.key="other",a(x),x.value=='"'?d=v.scopeString:x.value==":"?d=v.scopeCommand:(x.value>="0"&&x.value<="9"||x.value==".")&&(x.key="floatNum");break}s.push({key:x.key,value:x.value,pos:n+t}),n++}s.push({key:"newLines",value:`
`,pos:n+t})}return s}static tokenArrayToRepr(e){let t="";return e.forEach(r=>{t+=r.value}),t}}const $e=class $e extends Pe{static prettifyToken(e,t,r){return e!=="func"&&e!=="command"&&e!=="other"?r:e=="command"?r+" ":$e.PRETTIFY_REPL[r]||r}static getIndentOffset(e,t){return[0,0]}static getNewLineCountFunction(e,t,r){return e.key!=="newLines"?[e,0]:[null,e.value.match(/\r\n|\n|\r/g)?.length||0]}};$e.PRETTIFY_REPL={"=":" = ","+":" + ","-":" - ","*":" * ","/":" / ",",":", ",to:" to ",step:" step ",and:" and ",or:" or ",fn:"fn ",then:" then "};let _e=$e;const Ie=["end","for","next","data","input#","input","dim","read","let","goto","run","if","restore","gosub","return","rem","stop","on","wait","load","save","verify","def","poke","print#","print","cont","list","clr","cmd","sys","open","close","get","new"],Fe=["tab(","to","fn","spc(","then","not","step","and","or","sgn","int","abs","usr","fre","pos","sqr","rnd","log","exp","cos","sin","tan","atn","peek","len","str$","val","asc","chr$","left$","right$","mid$"];[...Ie,...Fe];class at extends R{constructor(e={}){const t={v2Identifier:[8e3,String.raw` (?<identifier>[\w]{1,2})      // First max 2 chars
                            (?<idExtra>[\w]*)             // Remaining are not used
                            (?<idType>[$%]?)              // Type declaration: $ or %
                `],v2Label:[2e3,String.raw`^(?<whiteSpc__3>\s*)(?<label>[\d]+)(?<whiteSpc__4>\s*)`],v2Command:[6e3,String.raw`(?<command>${Ie.join("|")})`],v2Function:[6100,String.raw`(?<identifier2>[\w]{0,2})?(?<func>${Fe.join("|").replace(/\(/g,"\\(").replace(/\$/g,"\\$")}})`],V2Operator:[6200,String.raw`(?<operator>[+\-*/^>=<])`],v2Sep:[7e3,String.raw`(?<commandSep>[:])`],v2Rem:[1e3,String.raw`(?<commandRem>rem)(?<rem>.*$)`],newLines:[3050,String.raw`(?<newLines>(\r\n|\n|\r)+)`],whiteSpace:[3100,String.raw`(?<whiteSpc>[\s]+)`],expr:[6300,String.raw`(?<skip__br_start>[{])(?<expr>[^}]*?)(?<skip__br_end>[}])`]},r=R.buildRxString([N.numInt,N.numFloatV2,N.strDQuote,N.constData,N.remark,N.remMulti,N.docstr,"v2Identifier","v2Label","V2Operator","v2Command","v2Function","newLines","v2Sep","v2Rem","expr","whiteSpace"],t),s={command:"CMD",commandRem:"CMD",func:"FUNC",strDQuote:"STR",label:"LABEL",floatNum:"NUM",intNum:"NUM",identifier:"VAR",identifier2:"VAR",idExtra:"EXTRA",idType:"FUNC",commandSep:"SEP",skip:"SKIP",whiteSpc:"SKIP",rem:"REM",other:"OTHER",constData:"CONST"},n=new tt({rxPattern:r,mapper:s,htmlClassPrefix:"editor-style-",PrettifierClass:_e});super(n)}tokenizeString(e,t="<input>"){const r=super.tokenizeString(e,t);return this.tokens.filter(s=>s.key==="strDQuote").flatMap(s=>K.convertStringToBytes(s.value,{tokens:Q.TTC_STRING_TOKENS,normalConverter:w.textToPetscii}).invalidCodes.map(({code:n,pos:i})=>({code:n,pos:s.pos+i}))).forEach(({code:s,pos:n})=>{this.addTokenizerError(`Undefined string code: ${JSON.stringify(s)}`,n,t)}),r.some(s=>s.type==="Tokenizer Error")||this.tokens.filter(s=>s.key==="idExtra").forEach(s=>{this.addWarning(`Identifier exceeds the two-character limit: ${JSON.stringify(s.value)}`,s.pos,t)}),r}getTokensFromMemory(e){const t=ot.getTokensFromMemory(e);this.reset(),t.forEach(r=>{this.addToken(r.key,String(r.value),r.pos)})}tokenizeStr(e){this.tokenizeString(e)}}const O=class O extends E{constructor(){super(),this.state={}}static stringEncoder(e,t){if(e.key=="other"&&e.value=="?")return[Q.TTC_COMMAND_TOKENS.print];const r={tokens:Q.TTC_STRING_TOKENS,normalConverter:w.textToPetscii},{byteArray:s,status:n}=K.convertStringToBytes(e.repr,r);return n!=="OK"&&console.log(n),s}static cmdEncoder(e,t){return[Q.TTC_COMMAND_TOKENS[e.repr]]}static encodeTextAsBytes(e){let t=this;this||(t=O);const r=new at;return r.tokenizeString(e),O.encodeTokens.bind(t)(r.tokens)}static encodeTokens(e){let t=2049;const r={constEvaluationMode:"safe"},s=[];let n=null;const i={nextAddr:0,line:null,data:[]};function a(){if(i.data.length>0){t+=i.data.length+5,i.nextAddr=t;const d=Object.assign({},i);s.push(d),n&&(n.byteData=[i.nextAddr&255,i.nextAddr>>8&255,i.line&255,i.line>>8&255]),i.data=[],i.nextAddr=0}}e.forEach(d=>{if(d.category=="LABEL"){a(),n=d;const c=parseInt(d.value,10);i.line=c,d.byteData=[0,0,c&255,c>>8&255];return}let x=this.encode(d,r);i.data.push(...x)}),a();const l=[];return s.forEach(d=>{l.push(d.nextAddr&255,d.nextAddr>>8),l.push(d.line&255,d.line>>8),l.push(...d.data,0)}),l.push(0,0),l}};O.encoders={idType:O.stringEncoder,STR:O.stringEncoder,NUM:O.stringEncoder,VAR:O.stringEncoder,SEP:O.stringEncoder,CMD:O.cmdEncoder,FUNC:O.cmdEncoder,operator:O.cmdEncoder,OTHER:O.stringEncoder,CONST:E.constEncoder,expr:E.exprEncoder,idExtra:E.voidEncoder,SKIP:E.voidEncoder,newLines:E.voidEncoder};let Me=O;class Bt extends nt{constructor(){const e=new fe({});super(e)}}const jt={Tokenizer:at,Prettifier:_e,Parser:Bt,Encoder:Me,Decoder:ot,Preprocessor:et};var Ae=(o=>(o.BASIC_V2="BasicV2",o.BASIC_V2_verbose="BasicV2-verbose",o.GOLFBAS_short="GolfBasic",o.GOLFBAS_verbose="GolfBasic-verbose",o))(Ae||{});const Ut={BasicV2:jt,GolfBasic:Qe,"GolfBasic-verbose":Qe};class zt{constructor(){return this.language="undefined",this.model={},this}usePredefinedLanguage(e){return this.language=e,this.model=Ut[e],this}defineLanguage(e){return this.language=e,this}}const Qt=`
	#verbose #strict
	/*
		Dark Mage of Duum


		Enemies:
			00 Luupuus
			01 Tuurex
			02 Scuurp
			03 Buug
			04 Dark Mage of Duum

		Player
			05 Player
			06 Player shoot

		Collectables:
			Freeze all enemies
			Slow enemies
			+1 life
			*2 speed
			grenades with numbers counting down

		Shapes:
			All player has 8 shapes (4 directions, 2 phases)
			40 enemy shapes

			[type][p][dd]
				type: 05
				direction: 0-3: L, R, U, D. Legs on left and bottom walls
				phase 0-1

	*/

	/*-------------------*/
	// CONSTS
	/*-------------------*/

	#const
		BULL_PL_V = $42,            -- Player bullet vertical
		BULL_PL_H = $43,			-- Player bullet horizontal

		BULL_EN_V = $44,			-- Enemy bullet vertical
		BULL_EN_H = $45,			-- Enemy bullet horizontal

		SPACE = $20,
		SHAPE = {49152+1024-8}		-- Sprite shapes
		G_STR = 'proba'
	;

	/*-------------------*/
	// GLOBALS
	/*-------------------*/

	dim  $			map,		-- Map data
					map_drawc	-- Draw string
		$20		levname		-- level name

		UBYTE2	    plw,		-- player 1/2 delay after firing
					scr		    -- player 1/2 score

		UBYTE7	    spx,		-- sprites x pos
					spy,		-- sprites y pos
					dirx,		-- sprites x direction
					diry		-- sprites y direction

		SBYTE5     buld		-- Bullet direction

		UBYTE5		bulsh		-- Bullet shape

		UWORD5     bulc		-- Bullet coordinates (screen code)

		BYTE 		i, 			-- general for loop cycle
					c, 			--
					t, 			-- temp byte
					nb			-- bullet counter

					mapx, 		-- current map X coord for drawing
					mapy,		-- current map Y coord for drawing
					mask,		-- current cell border mask for drawing
					bmask,		-- 1 or 0 switch,
					count,		-- drawmap counter

					level 		-- actual level,
					I×			-- use I× as a byte

					xcd,		-- x coord for drawing cells
					ycd			-- y coord for drawing cells
					;

	/*-------------------*/
	// CONST DATA
	/*-------------------*/
	// Map editor: zoli8000.github.io/mapedit.html

		map = "{
				-- Exits
				$4c,$95,$44,$66

				-- Level 1 - Original 1
				$39, $11, $91, $63, $84, $38, $84, $30, $09, $38, $46, $a1, $29, $42, $18, $a9, $8c, $a9

				-- Level 2 - Original 2
				$39, $91, $19, $29, $1c, $29, $81, $43, $81, $3c, $24, $30, $63, $c2, $46, $a8, $8c, $a8

				-- Level 3 S+S
				$b9, $53, $11, $39, $c2, $c2, $89, $10, $1c, $39, $c2, $85, $a9, $10, $52, $b9, $ca, $88

				-- Level 4 =+=
				$31, $11, $91, $28, $84, $30, $01, $10, $0c, $28, $80, $05, $21, $14, $a0, $a8, $88, $98

				-- Level 5 - Pacmania
				$39, $19, $95, $67, $63, $56, $84, $20, $4a, $3c, $62, $43, $21, $4a, $84, $ac, $a9, $98

				-- Level 6 - Medium arena
				$39, $19, $15, $63, $43, $00, $80, $00, $00, $7a, $00, $00, $29, $4a, $00, $ad, $a9, $8c

				-- Level 7 - Vertical
				$31, $11, $15, $62, $42, $42, $46, $66, $66, $66, $66, $66, $62, $42, $42, $a8, $88, $8c

				-- Level 8 - Stars
				$35, $3d, $b1, $ea, $05, $3c, $53, $ca, $05, $20, $53, $ca, $2c, $a0, $53, $ad, $b8, $8c

				-- Level 9 - Horizontal
				$39, $11, $19, $21, $84, $29, $42, $18, $81, $62, $81, $18, $28, $14, $a9, $a9, $88, $99

				-- Level 10 - Snakes
				$31, $91, $91, $2c, $34, $38, $43, $c2, $c3, $2c, $38, $1c, $63, $c3, $8d, $a8, $98, $9d

				-- Level 11 - Large arena
				$39, $11, $11, $63, $00, $00, $00, $00, $00, $62, $00, $00, $6a, $00, $00, $a9, $88, $88
		}"

	// Draw map cell command codes
		map_drawc = "{
			PUSH_MULTI VB(mask) VB(mapy) VB(mapx) $00 		-- PUSH mask, mapy, mapx
			SETXY 										-- POP mapx, mapy, set position
			BOX_SET_SIDES								-- POP mask, set box sides with it
			BOX_BOX_FILLED_COMPR $11 					-- BOX 1*1
		}"

		/*
		-- Change 2 chars starting at $42
		font "{
			SET_FONT_UNCOMPRESSED_RANGE $02 $42
			$00,$00,$00,$66,$99,$00,$00,$00
			$08,$10,$10,$08,$08,$10,$10,$08
		}"
		*/

	/*-------------------*/
	// MAIN
	/*-------------------*/
		clr level, plw, scr0, scr1					-- level, player wait, bullet counter, score1, score2

	start:

		#include inits
		#include setup_sprites

		timer 0, 20, radar_repaint  				// Timer 0, repaint radar every 20 jiffies
		timer 1, 10, animate  						// Timer 1, animate phases every 10 jiffies

		do while 1									// Main loop

	/*-------------------*/
	def setup_sprites:
	/*-------------------*/
		local ubyte ax;
		// Sprite definitions

		sprite "{
			/* Create macro: L R U D */
			SPR_SET_PREdef0 SPR_MIRR_H_SING SPR_ROT270 SPR_ROT90_MIRR_H_SING

			/* Luupuus */

				/* Sprite 80 - 36 bytes - Luupuus 1 */
				SPR_def_CMP0_T $80	// Start at $80
				$B1, $F6, $23, $F6, $82, $F8, $AF, $3F, $0C, $E3, $0E, $7D, $E9, $2E, $7D, $21, $9F, $25, $0C, $76, $E6, $39, $8E, $63, $98, $FA, $81, $51, $DD, $1E, $37, $A1, $8E, $E3, $4F
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite 84 - 14 bytes, based on sprite 00, Luupuus 2 */
				SPR_def_CMP_BASE $80 // Based on $80
				$E9, $72, $2F, $F2, $FF, $F7, $FF, $CC, $CF, $F2, $25, $3D, $0C
				SPR_USE_PREdef0     // Create 3 directions

			/* Tuurex */

				/* Sprite 88 - 36 bytes, Tuurex 1*/
				SPR_def_CMP0
				$B9, $F6, $46, $12, $F6, $1B, $E5, $14, $7D, $04, $71, $DE, $9B, $59, $D8, $18, $6F, $C3, $47, $A4, $31, $DD, $55, $54, $D4, $05, $8F, $38, $6A, $4C, $A7, $4C, $40, $19, $20
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite 8C - 24 bytes, based on sprite $88, Tuurex 2 */
				SPR_def_CMP_BASE $88
				$E3, $82, $22, $F6, $FF, $E5, $19, $47, $8F, $C8, $A2, $23, $E1, $37, $F8, $8C, $F1, $8C, $A3, $E3, $FD, $8C, $40
				SPR_USE_PREdef0     // Create 3 directions

			/* Scuurp */
				/* Sprite 90 - 40 bytes, Scuurp 1 */
				SPR_def_CMP0
				$B1, $97, $12, $F6, $08, $F1, $D0, $44, $40, $8C, $D3, $E1, $A1, $E7, $EA, $90, $47, $3E, $3D, $D1, $F4, $86, $11, $AA, $A9, $0C, $77, $50, $A8, $8D, $1B, $10, $C2, $1C, $35, $CE, $61, $29, $10
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite 94 - 24 bytes, based on sprite $90, Scuurp 2 */
				SPR_def_CMP_BASE $90
				$FB, $C6, $15, $F2, $12, $F6, $18, $46, $68, $8A, $2D, $1A, $90, $66, $3F, $11, $F6, $99, $68, $62, $3F, $FD, $4E
				SPR_USE_PREdef0     // Create 3 directions

			/* Buug */

				/* Sprite 98 - 38 bytes, Buug 1 */
				SPR_def_CMP0
				$A1, $12, $F6, $85, $50, $7A, $AA, $A8, $38, $56, $AA, $8D, $12, $E0, $92, $AE, $23, $1F, $26, $8B, $55, $41, $04, $13, $BA, $95, $44, $AB, $24, $0A, $95, $52, $49, $50, $2B, $A8, $A0
				SPR_COPY SPR_COPY SPR_COPY     // Placeholder
			}"

			sprite "{
				/* Sprite 9c - 29 bytes, based on sprite $98, Buug 2 */
				SPR_def_CMP_BASE $98
				$CD, $F6, $22, $F6, $C4, $21, $46, $21, $07, $F8, $43, $E8, $57, $63, $09, $0F, $E4, $E2, $FF, $0F, $EA, $50, $A3, $73, $0A, $52, $7C, $25
				SPR_COPY SPR_COPY SPR_COPY     // Placeholder

			/* Dark mage of Duum */
				/* Sprite a0 - 30 bytes - wizard 1*/
				SPR_def_CMP0
				$B2, $F6, $12, $F6, $82, $28, $61, $B0, $8D, $81, $1C, $18, $70, $DF, $1F, $5B, $E3, $CF, $AA, $A9, $00, $A6, $39, $69, $6B, $A9, $92, $26, $40
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite a4 - 26 bytes, based on sprite a0, wizard 2 */
				SPR_def_CMP_BASE $a0
				$F2, $F6, $11, $F6, $F0, $E2, $2B, $D9, $E1, $18, $C2, $3A, $34, $7F, $E8, $43, $91, $FA, $08, $21, $08, $92, $18, $42, $80
				SPR_USE_PREdef0     // Create 3 directions

			/* Player */
				/* Sprite a8 - 30 bytes, player 1 */
				SPR_def_CMP0
				$AB, $99, $21, $38, $F6, $85, $B1, $AC, $A8, $3D, $04, $B0, $7A, $A8, $27, $58, $DE, $79, $91, $37, $C6, $AA, $72, $12, $03, $3D, $6A, $74, $60
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite ac - 13 bytes, based on sprite a8, player 2 */
				SPR_def_CMP_BASE $a8
				$E8, $F6, $E1, $E1, $09, $92, $16, $BD, $C5, $E8, $63, $3F
				SPR_USE_PREdef0     // Create 3 directions

				/* Sprite b0 - 29 bytes, based on sprite a8, player 3 */
				SPR_def_CMP_BASE $a8
				$E9, $35, $71, $F6, $C3, $C4, $2F, $93, $33, $12, $D6, $B3, $4B, $F2, $C9, $3B, $F0, $84, $C4, $50, $7D, $21, $6B, $DC, $5F, $FD, $0C, $60
				SPR_USE_PREdef0     // Create 3 directions

			/* Boom */
				/* Sprite b4 - 45 bytes, boom 1 */
				SPR_def_CMP0
				$E1, $21, $96, $E1, $F0, $F0, $FC, $92, $0C, $24, $8D, $E1, $48, $C4, $48, $7A, $34, $B4, $EE, $63, $9C, $71, $8C, $42, $A0, $94, $A1, $8C, $79, $C6, $33, $BD, $02, $C5, $90, $39, $D0, $86, $3C, $74, $10, $5D, $1A, $28

				/* Sprite b5 - 24 bytes, based on sprite 0D, , boom 2 */
				SPR_def_CMP_BASE $b4
				$F1, $F6, $22, $F6, $2E, $3E, $95, $6B, $CB, $E6, $AB, $FE, $2C, $9A, $59, $FF, $C5, $AE, $23, $D3, $18, $45, $AB

			/* Player A up / down on the other wall - not implemented. */
		}"

		/* Starts with 6 wolves
			If wolves_left <= level: add dino
			Dino dies & level>1 -> scorpion
			Last scorpion dies: fly
			Fly escapes or dies -> wizard
		*/

		--poke 53269, 255				-- Show all sprites
		sprite S 255

		clr ax
		for i = 0 to 7
			poke {49152+1024-8} + i, 128 + i:
			ax ^= 1
			sprite m i, 24 * rnd(11), 24 * rnd(7), ax * 128, 128 - (ax*128)
		next

		for i = 0 to 5
			clr buld[i]
		next

		for i = 1 to 2
			spx[i] = i
			spy[i] = i
		next

	dend

	// Will be converted to an unused fast label - fast count in prg, reserve fast addresses

	/*-------------------*/
	fast radar_repaint:
	/*-------------------*/
		local byte
				spxa,		-- sprite x coord for radar
				spya,		-- sprite y coord for radar
				j			-- sp index helper
				;

		-- Inner scope variables, invalid values outside of fast / def!

		// Repaint radar
		// Clear from 14, 19, 11, 6

		?"{ SETPOS(13,8)
			BOX_SET_STYLE $00
			BOX_SET_SIDES $07
			BOX_BOX_FILLED_COMPR $B4 }"
		clr j

		for i; 7
			spxa = ( peek ( 53248, j ) - 50 ) / 24
			inc j
			spya = ( peek ( 53248, j ) - 40 ) / 24
			inc j
			poke {49152+16+21*40} + spxa + spya.word * 40, peek({49152+1024-8}, i) - 128			-- recast spya, so result will be a word
		next

	fend

	/*-----------------*/
	// MAP DRAWING
	/*-----------------*/

	/*----------------------------*/
	fast map_drawcell_mirror
		@ mapx, mapy, mask:
	/*--------------------------*/
		-- Draw map cell and mirror it (draw 2 cells)

		if bmask:
			mask = mask.hnib
		else:
			mask = mask.lnib
		endif

		? map_drawc

		mapx = 36 - mapx

		t = mask & 6
		if t = 4 or t = 2
			mask ^= 6
		endif

		? map_drawc

		bmask ^= 1
		inc count, bmask

	fend

	/*-----------------*/
	fast drawmap:
	/*-----------------*/
		-- Border: black, box border type: 3
		?"{ BORDER BLACK
			CLEAR
			LIGHT_BLUE
			BOX_SET_STYLE $03 }"

		clr count
		bmask = 1

		for mapy, 16 step 3
			mask = map[count]
			fcall map_drawcell_mirror, 0
		next

		fcall map_drawcell_mirror 3, 18, 96 // x=3, mapy=18, mask = 96

		count = level * 18 + 4
		bmask = 1
		for mapy to 16 step 3
			for mapx = 3 to 20 step 3
				mask = map[count]

				fcall map_drawcell_mirror
			next
		next


		?"{
		/* Draw blue box */
			LIGHT_BLUE
			SETPOS(0, 21)
			BOX_SET_STYLE $06
			BOX_SET_SIDES $0f
			BOX_BOX_FILLED_COMPR $A1

		/* Draw yellow box */
			YELLOW
			SETPOS(27, 21)
			BOX_BOX_FILLED_COMPR $A1

		/* Level */
			SETPOS(15, 18) RED }";levname;

	fend

	/*-----------------*/
	// GAME AUX
	/*-----------------*/

	/*-----------------*/
	fast coord @ i, xcd, ycd:
	/*-----------------*/
		// Returns coordinate be
		return spx[i] * 3 + xcd*2 + (spy[i]*3+ycd*2) * 40 + 49196
	fend

	/*-----------------*/
	fast peek_coord @ i, xcd, ycd:
	/*-----------------*/
		return peek(fn coord())
	fend

	/*-----------------*/
	fast move_one @ I×:
	/*-----------------*/
		local ubyte scr_code;

		xcd = dirx[I×]
		ycd = diry[I×]

		scr_code =  fn peek_coord()

		-- Player dies
		if I×<2 and has(scr_code, "{BULL_EN_V, BULL_EN_H, BULL_PL_V, BULL_PL_H}"):
			sprite s I×

		endif

		-- Enemy dies
		if I×>1 and has(scr_code, "{BULL_PL_V, BULL_PL_H}"):

		endif

		if scr_code=32:
			inc spx[I×], xcd
			inc spy[I×], ycd
		else:
			dirx[I×] = rnd(-1,1)
			diry[I×] = rnd(-1,1)
		endif
	fend

	/*-----------------*/
	fast move_all:
	/*-----------------*/
		for I×; 8
			// Player 1 or 2
			if I×<2:
				@seljoy = I×

				// If not horizontal, set movement direction
				dirx[I×] = @joyhx

				// If not horizontal, check vertical
				if @joyhx
				else diry[I×] = @joyvx
				endif

				// Button pressed - fire if possible
				if @joybx

				endif

			// Enemies
			else
				// if dirx[
			endif

			fcall move_one
		next
		fend

	/*-----------------*/
	fast bullet_add:
	/*-----------------*/
	local uword st;

	// Add bullet

		// Change player shape
		poke SHAPE,134
		st = spx[i] * 3 + spy[i] * 120 + 49195

		if st.getb=32:
			bulc[nb] = st
			buld[nb] = -1
			inc nb
		endif

		if i
		else:
			plw=5
		endif

		if nb>5
			clr nb
		endif

		fend

	/*-----------------*/
	fast animate:
	/*-----------------*/
	local uword sh
			ubyte shape_targ;

		for I×;8
			sh = SHAPE+I×
			// shape_targ = shapes[I×*8]
			// if sh.getb =
			// poke SHAPE+I×
		next

	fend

	/*-----------------*/
	fast bullet_repaint:
	/*-----------------*/
	// Repaint bullet

		local WORD
				bull_old_pos,				-- Previous bullet coordinate
				bull_new_pos; 				-- Next bullet coordinate

		for I×, 5
			if buld[I×] :
				bull_old_pos = bulc[I×]
				bulc[i] = bull_old_pos + buld[I×]
				bull_new_pos = bulc[I×]

				if bull_new_pos.getb <> SPACE:
					clr buld[I×]
				else:
					poke bull_new_pos, bulsh[I×]
				endif

				poke bull_old_pos, SPACE
			endif
		next
	fend

	/*-----------------*/
	// defS - can be included for speed with INCLUDE (will be put inline)
	/*-----------------*/
	def inits:
	//
			?"{COMPRESS("Loading game...")}abcd"
			?"ab""cd"


	dend
`,it=o=>o!==void 0?o.toString(16).padStart(2,"0"):"??";function Ht(o,e){let t=-1;return e.forEach((r,s)=>{r.pos+r.value.length<=o&&r.byteData?.length&&(t=s)}),t}function Kt(o,e,t,r){let s="",n="";e.forEach((i,a)=>{const[l,d]=i,x=r&&a>=r.start&&a<=r.end;if(a%16===0){const c=(t+a).toString(16).padStart(4,"0");s+=`<div class="data-line"><span class="address">${c}</span> <span class="bytes">`}s+=`<span class="byte-cell ${l}${x?" byte-selected":""}" data-byte-index="${a}">${it(d)}</span> `,n+=`<span class="byte-cell ${l}${d>=128?" inverted":""}${x?" byte-selected":""}" data-byte-index="${a}">`+(ze[d]||ze[d-128])+"</span>",((a+1)%16===0||a===e.length-1)&&(s+="</span>   "+n+"</div>",n="")}),o.innerHTML=s||" "}const He=[{key:"name",label:"Name"},{key:"type",label:"Type"},{key:"rawExpression",label:"Raw expression"},{key:"value",label:"Evaluated value"},{key:"comment",label:"Comment"}];function Yt(o){return Object.entries(o).map(([e,t])=>({name:e,type:typeof t.value=="number"?"Number":"String",rawExpression:t.rawExpression,value:t.value,comment:t.comment}))}function Wt(o,e){const t=o[e];if(t)return[t.comment,`Raw: \`${t.rawExpression}\``,`Value: \`${t.value}\``].filter(Boolean).join(`

`)}function Zt(o,e,t){const r=t==="ascending"?1:-1;return[...o].sort((s,n)=>{const i=s[e],a=n[e];return typeof i=="number"&&typeof a=="number"?(i-a)*r:String(i).localeCompare(String(a),void 0,{numeric:!0,sensitivity:"base"})*r})}function Xt(o){return o?[{key:"longName",label:"Long name"},{key:"typeName",label:"Type"},{key:"uses",label:"Uses"}]:[{key:"longName",label:"Long name"},{key:"shortName",label:"Encoded name"},{key:"typeName",label:"Type"},{key:"length",label:"Length"},{key:"comment",label:"Comment"},{key:"uses",label:"Uses"}]}const Z=o=>typeof o=="string"?o:"",de=o=>typeof o=="number"?o:void 0,qt=o=>o&&typeof o=="object"?o:{};function Gt(o){return o.endsWith("$")?"String":o.endsWith("%")?"Integer":"Float"}function Jt(o,e){const t=Z(o.shortCode),r=o.rangeMin!=null&&o.rangeMax!=null,s=de(o.memBytes);return[t&&`Code ${t}`,r&&`${o.rangeMin}–${o.rangeMax}`,e&&s!==void 0&&`${s} bytes`,Z(o.description)].filter(Boolean).join(" · ")}function er(o,e,t){const r=Z(e.varName)||o,s=qt(e.type),n=Z(s.longCode)||(t?Gt(r):""),i=Z(s.shortCode)==="$"||n==="FIXSTR",a=de(e.arr_size),l=a&&a>0?a:void 0,d=i?de(s.dataLength):void 0,x=t?"":Z(e.transformedVarName)||(e.type?o:"");return{longName:t?r.slice(0,2):r,shortName:x,typeName:n,typeDetails:Jt(s,i),length:l??d??null,comment:Z(e.comment),uses:de(e.uses)??0}}function ct(o,e){return Object.entries(o).map(([t,r])=>er(t,r,e))}function tr(o,e){const t=o.find(r=>r.longName===e);if(t)return[t.comment,`**${t.longName}**${t.typeName?` · ${t.typeName}`:""}`,t.typeDetails,t.shortName&&`Encoded name: \`${t.shortName}\``,t.length!==null&&`Length: ${t.length}`,`Uses: ${t.uses}`].filter(Boolean).join(`

`)}function rr(o,e,t){const r=t==="ascending"?1:-1;return[...o].sort((s,n)=>{const i=s[e],a=n[e];return typeof i=="number"&&typeof a=="number"?(i-a)*r:String(i).localeCompare(String(a),void 0,{numeric:!0,sensitivity:"base"})*r})}function sr(o,e,t){const r={...e},s=new Map;return o.forEach((n,i)=>{if(n.category!=="VAR")return;let a=n.value,l=o[i+1],d=n.pos+n.value.length;t&&l?.key==="idExtra"&&l.pos===d&&(d+=l.value.length,l=o[i+2]),t&&l?.key==="idType"&&l.pos===d&&(a+=l.value),s.set(a,(s.get(a)||0)+1)}),s.forEach((n,i)=>{const a=Object.entries(r).find(([,l])=>l.varName===i);if(a)r[a[0]]={...a[1],uses:n};else{const l=i in r?`${i} (undeclared)`:i;r[l]={varName:i,uses:n}}}),r}const nr=[{key:"severity",label:"Severity"},{key:"type",label:"Type"},{key:"line",label:"Line"},{key:"message",label:"Message"}],or='"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',Re={error:"❌",warning:"⚠️"};function ar(o){const e=o.reduce((t,r)=>({...t,[r.severity]:t[r.severity]+1}),{error:0,warning:0});return e.error===0&&e.warning===0?"errors":`errors ${Re.error}: ${e.error} ${Re.warning}: ${e.warning}`}function ir(o){return{severity:o.type==="Warning"?"warning":"error",type:o.type,line:o.location.line,column:o.location.column,message:`${o.code}: ${o.message}`,pos:o.location.pos}}const cr={key:"severity",direction:"ascending"};function lr(o){return{severity:"error",type:"Compile Error",line:null,column:null,message:o}}function dr(o){return[Re[o.severity],o.type,o.line===null?"—":`${o.line}:${o.column}`,o.message]}function xr(o,e,t){const r=t==="ascending"?1:-1;return[...o].sort((s,n)=>{if(e==="line"){const i=s.line??1/0,a=n.line??1/0;return i===a?0:(i>a?1:-1)*r}return s[e].localeCompare(n[e])*r})}var S;require.config({paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs"}});var lt=[],X=[],he={},ge={},ve=[],q="table",dt=-1,ne=cr,U={key:"longName",direction:"ascending"},ee={key:"name",direction:"ascending"};function xt(){document.querySelectorAll("#tokens .jse-table-row:not(.jse-table-row-header), #tokens .token-row").forEach(e=>{const t=[...e.classList].find(i=>i.startsWith("token-row-")),r=e.querySelector("th"),s=Number(t?t.slice(10):r?.textContent),n=(q==="table"||q==="tree")&&dt===s;e.classList.toggle("json-editor-row-selected",n)})}function pr(o,e){q=e;const t=document.getElementById("json-view"),r=document.getElementById("variables-view"),s=document.getElementById("const-view"),n=document.getElementById("errors-view");t.classList.toggle("hidden",e==="variables"||e==="const"||e==="errors"),r.classList.toggle("hidden",e!=="variables"),s.classList.toggle("hidden",e!=="const"),n.classList.toggle("hidden",e!=="errors"),e==="variables"?ft(r):e==="const"?_t(s):e==="errors"?ut(n):hr.updateProps({content:{json:o},mode:e}),xt()}function pt(o,e,t){const r=document.createElement("thead");r.className="sticky top-0 bg-gray-800";const s=document.createElement("tr");return o.forEach(({key:n,label:i})=>{const a=document.createElement("th");a.className="border-b border-gray-700 px-3 py-2",e.key===n&&a.setAttribute("aria-sort",e.direction);const l=document.createElement("button");l.type="button",l.className="font-semibold hover:text-blue-300",l.textContent=e.key===n?`${i} ${e.direction==="ascending"?"↑":"↓"}`:i,l.addEventListener("click",()=>t(n)),a.append(l),s.append(a)}),r.append(s),r}function ur(o,e){return{key:e,direction:o.key===e&&o.direction==="ascending"?"descending":"ascending"}}function fr(o){const e=S?.getModel?.();if(!e)return;const t=e.getPositionAt(o);S.setPosition(t),S.revealPositionInCenter(t),S.focus()}function ut(o){const e=xr(ve,ne.key,ne.direction);if(e.length===0){o.textContent="No errors or warnings";return}const t=document.createElement("table");t.className="min-w-full border-collapse text-left text-sm text-gray-100";const r=pt(nr,ne,n=>{ne=ur(ne,n),ut(o)}),s=document.createElement("tbody");e.forEach(n=>{const i=document.createElement("tr");if(i.className="border-b border-gray-800 hover:bg-gray-800",typeof n.pos=="number"){const a=n.pos;i.classList.add("cursor-pointer"),i.addEventListener("click",()=>fr(a))}dr(n).forEach((a,l)=>{const d=document.createElement("td");d.className="px-3 py-2 align-top",d.textContent=a,l===0&&(d.title=n.severity,d.style.fontFamily=or),i.append(d)}),s.append(i)}),t.append(r,s),o.replaceChildren(t)}function ft(o){const e=document.getElementById("lang").value==="basicv2",t=Xt(e),r=rr(ct(he,e),U.key,U.direction),s=document.createElement("table");s.className="min-w-full border-collapse text-left text-sm text-gray-100";const n=document.createElement("thead");n.className="sticky top-0 bg-gray-800";const i=document.createElement("tr");t.forEach(({key:l,label:d})=>{const x=document.createElement("th");x.className="border-b border-gray-700 px-3 py-2",U.key===l&&x.setAttribute("aria-sort",U.direction);const c=document.createElement("button");c.type="button",c.className="font-semibold hover:text-blue-300",c.textContent=U.key===l?`${d} ${U.direction==="ascending"?"↑":"↓"}`:d,c.addEventListener("click",()=>{U={key:l,direction:U.key===l&&U.direction==="ascending"?"descending":"ascending"},ft(o)}),x.append(c),i.append(x)}),n.append(i);const a=document.createElement("tbody");r.forEach(l=>{const d=document.createElement("tr");d.className="border-b border-gray-800 hover:bg-gray-800",t.forEach(({key:x})=>{const c=document.createElement("td");if(c.className="px-3 py-2 align-top",x==="typeName"){const p=document.createElement("div");if(p.textContent=l.typeName||"—",c.append(p),l.typeDetails){const u=document.createElement("div");u.className="text-xs text-gray-400",u.textContent=l.typeDetails,c.append(u)}}else{const p=l[x];c.textContent=p==null||p===""?"—":String(p)}d.append(c)}),a.append(d)}),s.append(n,a),o.replaceChildren(s),r.length===0&&(o.textContent="No variables used")}function _t(o){const e=Zt(Yt(ge),ee.key,ee.direction);if(e.length===0){o.textContent="No constants declared";return}const t=document.createElement("table");t.className="min-w-full border-collapse text-left text-sm text-gray-100";const r=pt(He,ee,n=>{ee={key:n,direction:ee.key===n&&ee.direction==="ascending"?"descending":"ascending"},_t(o)}),s=document.createElement("tbody");e.forEach(n=>{const i=document.createElement("tr");i.className="border-b border-gray-800 hover:bg-gray-800",He.forEach(({key:a})=>{const l=document.createElement("td");l.className="px-3 py-2 align-top";const d=n[a];l.textContent=d===""?"—":String(d),i.append(l)}),s.append(i)}),t.append(r,s),o.replaceChildren(t)}function ht(o){pr(o==="variables"?he:o==="const"?ge:o==="errors"?ve:lt,o),document.querySelectorAll("#json-tabs [data-view]").forEach(t=>{t.classList.toggle("bg-blue-600",t.dataset.view===o),t.classList.toggle("text-white",t.dataset.view===o),t.classList.toggle("bg-gray-700",t.dataset.view!==o)})}function _r(){const o=document.querySelector('#json-tabs [data-view="errors"]');o&&(o.textContent=ar(ve))}function gt(o,e=X){if(!e.length)return-1;const t=e.findIndex(s=>{const n=s.pos,i=s.pos+s.value.length;return n<=o&&o<i});if(t>=0&&e[t].byteData?.length)return t;const r=e.findIndex(s=>s.pos+s.value.length===o);return r>=0&&e[r].byteData?.length?r:Ht(o,e)}function Ke(o){const e=S?.getModel?.();if(!e)return{start:0,end:0};const t=S.getSelection(),r=e.getOffsetAt({lineNumber:t.startLineNumber,column:t.startColumn}),s=e.getOffsetAt({lineNumber:t.endLineNumber,column:t.endColumn}),n=Math.min(r,s),i=Math.max(r,s),a=o.reduce((u,f,y)=>{if(!f.byteData?.length)return u;const _=f.pos,h=f.pos+f.value.length;return(n===i?_<=n&&n<h:_<i&&h>n)&&u.push(y),u},[]),l=gt(n,o);a.length===0&&l>=0&&o[l].byteData?.length&&a.push(l);const d=new Map;let x=1;if(o.forEach((u,f)=>{if(!u.byteData?.length)return;const y=[x,x+u.byteData.length-1];d.set(f,y),x+=u.byteData.length}),!a.length)return{start:0,end:0};const c=a.reduce((u,f)=>{const y=d.get(f);return y?Math.min(u,y[0]):u},Number.POSITIVE_INFINITY),p=a.reduce((u,f)=>{const y=d.get(f);return y?Math.max(u,y[1]):u},0);return{start:c,end:p}}var hr=bt({target:document.getElementById("json-view"),props:{content:{json:[]},mode:"table",onClassName:(o,e)=>{const t=JSON.parse(JSON.stringify(o)),r=t[t.length-1],s=Number(t[0]),n=Number.isInteger(s)&&String(t[0]).length>0?`token-row token-row-${s}`:"";return[r==="bytes"?"column-bytes":"",n].filter(Boolean).join(" ")||void 0},mainMenuBar:!1,navigationBar:!1,readOnly:!0}});const gr=document.getElementById("json-view");gr.addEventListener("click",o=>{const e=o.target;if(!(e instanceof HTMLElement)||q!=="table"&&q!=="tree"||q==="tree"&&e.closest("button"))return;const t=e.closest(".jse-table-row:not(.jse-table-row-header)"),r=e.closest(".token-row"),s=r&&[...r.classList].find(d=>d.startsWith("token-row-")),n=t?Number(t.querySelector("th")?.textContent):s?Number(s.slice(10)):-1,i=X[n],a=S?.getModel?.();if(!i||!a)return;o.stopPropagation();const l=a.getPositionAt(i.pos);S.setPosition(l),S.revealPositionInCenter(l),S.focus()},!0);const Ye=document.querySelectorAll("#json-tabs [data-view]");Ye.length&&Ye.forEach(o=>{o.addEventListener("click",()=>{const e=o.dataset.view;ht(e)})});function mr(o){return String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function We(o){return`(?:${[...o].sort((t,r)=>r.length-t.length).map(t=>{const r=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),s=/^[a-zA-Z0-9_×]/.test(t),n=/[a-zA-Z0-9_×]$/.test(t);return`${s?"(?<![a-zA-Z0-9_×])":""}${r}${n?"(?![a-zA-Z0-9_×])":""}`}).join("|")})`}function Ze(o,e,t,r){monaco.languages.register({id:o}),monaco.languages.setMonarchTokensProvider(o,{tokenizer:{root:[...r.map(s=>[s,"comment"]),[/"(?:[^"\\]|\\.)*"/,"string"],[/'(?:[^'\\]|\\.)*'/,"string"],[/`(?:[^`\\]|\\.)*`/,"string"],[We(t),"type.identifier"],[We(e),"keyword"],[/\d+(?:\.\d+)?/,"number"],[/[a-zA-Z_][a-zA-Z0-9_×]*/,"identifier"]]}})}require(["vs/editor/editor.main"],()=>{S=monaco.editor.create(document.getElementById("editor"),{value:Qt,language:"plaintext",theme:"vs-dark",automaticLayout:!0}),Ze("basicv2",Ie,Fe,[/\brem\b.*$/]),Ze("golfbasic",Object.keys(Ge),Object.keys(Je),[/\/\/.*$/,/--.*$/,/#.*$/]),monaco.languages.registerHoverProvider("*",{provideHover:(d,x)=>{const c=d.getWordAtPosition(x);if(!c)return null;const p=document.getElementById("lang").value==="basicv2",u=Wt(ge,c.word)||tr(ct(he,p),c.word);return u?{range:new monaco.Range(x.lineNumber,c.startColumn,x.lineNumber,c.endColumn),contents:[{value:u}]}:null}});const o=document.getElementById("bytecode"),e=document.getElementById("lang");let t=[];function r(){const d=Ke(X);o.querySelectorAll(".byte-cell").forEach(x=>{const c=Number(x.dataset.byteIndex),p=d.start>0&&c>=d.start&&c<=d.end;x.classList.toggle("byte-selected",p)}),d.start>0&&o.querySelector(`.byte-cell[data-byte-index="${d.start}"]`)?.scrollIntoView({block:"nearest",inline:"nearest"})}o.addEventListener("click",d=>{const x=d.target;if(!(x instanceof HTMLElement))return;const c=x.closest(".byte-cell"),p=Number(c?.dataset.byteIndex),u=S.getModel();if(!c||!Number.isInteger(p)||p===0||!u)return;let f=1;const y=X.find(h=>{const $=h.byteData?.length??0,M=p>=f&&p<f+$;return f+=$,M});if(!y)return;d.stopPropagation();const _=u.getPositionAt(y.pos);S.setPosition(_),S.revealPositionInCenter(_),S.focus()});function s(){const d=S.getModel(),x=S.getSelection();if(!d||!x)return;const c=d.getOffsetAt({lineNumber:x.startLineNumber,column:x.startColumn}),p=d.getOffsetAt({lineNumber:x.endLineNumber,column:x.endColumn}),u=Math.min(c,p),f=Math.max(c,p);dt=u===f?gt(u,X):X.findIndex(y=>y.pos<f&&y.pos+y.value.length>u),xt(),r()}function n(){const d=S.getValue();e.value;const x=document.getElementById("lang"),c={basicv2:Ae.BASIC_V2,golfbasic:Ae.GOLFBAS_verbose}[x.value],p=S.getModel();monaco.editor.setModelLanguage(p,x.value);const{Encoder:u,Decoder:f,Tokenizer:y,Preprocessor:_}=new zt().usePredefinedLanguage(c).model;let h,$=[],M="",F={},Y={},V={};const C=document.getElementById("bytecode");try{const m=new _(d);m.useGlobalDirectives(),F=m.getFinalDirectives(),Y=m.directiveDescriptions;const G={constEvaluationMode:F.safe===!1?"trusted":"safe"};if(h=new y(G),$=h.tokenizeString(d,"<input>"),!$.some(L=>L.type!=="Warning")){const L=new pe,Ve=L.getDimText(h.tokens),{vars:Be,errors:mt}=L.parseDimLong(Ve,!0);V=L.assignVariableNames(Be),L.reportDimErrors(mt,h.tokens,h,"<input>"),u.encodeTokens(h.tokens,F)}}catch(m){console.error("Encoding error:",m),M=m instanceof Error?m.message:String(m)}const B=h?.tokens||[];t=[],t.push(["null",0]),B.forEach(m=>{(m.byteData||[]).forEach(L=>t.push([m.category,L]))});const k=Ke(B);Kt(C,t,2048,k);const j=Object.entries(F).map(([m,G])=>{const L=Y[m]??"";return`<span class="text-${G===!0?"green-500":"yellow-800"} font-medium mr-3" title="${L}">
                            ${mr(m)}</span>`}).join("");document.getElementById("directives").innerHTML=`
      <hr><div class="text-sm">
        <div class="mb-1 flex items-center">
          <span class="mr-2">📜</span>
          <span class="font-semibold">Directives:</span>
        </div>
        <div class="pl-5">${j||'<span class="text-gray-500">— none —</span>'}</div>
      </div>
    `;const I=getComputedStyle(C);document.querySelectorAll(".data-line .inverted").forEach(m=>{m.style.backgroundColor="",m.style.color="";const G=I.backgroundColor,L=getComputedStyle(m).color;m.style.backgroundColor=L,m.style.color=G}),X=B,lt=B.map(m=>({key:m.key,category:m.category,value:m.value,pos:h.posToString(m.pos,"L: %ln, C: %col"),bytes:m.byteData&&m.byteData.map(it).join(" ")||" "})),he=sr(B,V,x.value==="basicv2"),ge=h?.constants||{},ve=[...$.map(ir),...M?[lr(M)]:[]],_r(),ht(q),s()}let i;function a(){i&&clearTimeout(i),i=window.setTimeout(n,1e3)}S.onDidChangeModelContent(a),S.onDidChangeCursorSelection(s),n(),e.addEventListener("change",n);const l=document.getElementById("version");l&&(l.textContent="V 0.1.4 build d6d0618")});
