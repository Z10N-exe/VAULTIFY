import{r as d,a as ee,R as te}from"./vendor-a4a0ee75.js";let re={data:""},ae=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||re},oe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,se=/\/\*[^]*?\*\/|  +/g,N=/\n+/g,x=(e,t)=>{let r="",o="",s="";for(let i in e){let a=e[i];i[0]=="@"?i[1]=="i"?r=i+" "+a+";":o+=i[1]=="f"?x(a,i):i+"{"+x(a,i[1]=="k"?"":t)+"}":typeof a=="object"?o+=x(a,t?t.replace(/([^,])+/g,n=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):i):a!=null&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=x.p?x.p(i,a):i+":"+a+";")}return r+(t&&s?t+"{"+s+"}":s)+o},h={},W=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+W(e[r]);return t}return e},ie=(e,t,r,o,s)=>{let i=W(e),a=h[i]||(h[i]=(l=>{let f=0,u=11;for(;f<l.length;)u=101*u+l.charCodeAt(f++)>>>0;return"go"+u})(i));if(!h[a]){let l=i!==e?e:(f=>{let u,c,p=[{}];for(;u=oe.exec(f.replace(se,""));)u[4]?p.shift():u[3]?(c=u[3].replace(N," ").trim(),p.unshift(p[0][c]=p[0][c]||{})):p[0][u[1]]=u[2].replace(N," ").trim();return p[0]})(e);h[a]=x(s?{["@keyframes "+a]:l}:l,r?"":"."+a)}let n=r&&h.g?h.g:null;return r&&(h.g=h[a]),((l,f,u,c)=>{c?f.data=f.data.replace(c,l):f.data.indexOf(l)===-1&&(f.data=u?l+f.data:f.data+l)})(h[a],t,o,n),a},ne=(e,t,r)=>e.reduce((o,s,i)=>{let a=t[i];if(a&&a.call){let n=a(r),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;a=l?"."+l:n&&typeof n=="object"?n.props?"":x(n,""):n===!1?"":n}return o+s+(a??"")},"");function R(e){let t=this||{},r=e.call?e(t.p):e;return ie(r.unshift?r.raw?ne(r,[].slice.call(arguments,1),t.p):r.reduce((o,s)=>Object.assign(o,s&&s.call?s(t.p):s),{}):r,ae(t.target),t.g,t.o,t.k)}let U,F,T;R.bind({g:1});let E=R.bind({k:1});function le(e,t,r,o){x.p=t,U=e,F=r,T=o}function w(e,t){let r=this||{};return function(){let o=arguments;function s(i,a){let n=Object.assign({},i),l=n.className||s.className;r.p=Object.assign({theme:F&&F()},n),r.o=/ *go\d+/.test(l),n.className=R.apply(r,o)+(l?" "+l:""),t&&(n.ref=a);let f=e;return e[0]&&(f=n.as||e,delete n.as),T&&f[0]&&T(n),U(f,n)}return t?t(s):s}}var ue=e=>typeof e=="function",k=(e,t)=>ue(e)?e(t):e,ce=(()=>{let e=0;return()=>(++e).toString()})(),B=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),de=20,_="default",H=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:o}=t;return H(e,{type:e.toasts.find(a=>a.id===o.id)?1:0,toast:o});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(a=>a.id===s||s===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+i}))}}},j=[],q={toasts:[],pausedAt:void 0,settings:{toastLimit:de}},v={},G=(e,t=_)=>{v[t]=H(v[t]||q,e),j.forEach(([r,o])=>{r===t&&o(v[t])})},Y=e=>Object.keys(v).forEach(t=>G(e,t)),fe=e=>Object.keys(v).find(t=>v[t].toasts.some(r=>r.id===e)),C=(e=_)=>t=>{G(t,e)},pe={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},me=(e={},t=_)=>{let[r,o]=d.useState(v[t]||q),s=d.useRef(v[t]);d.useEffect(()=>(s.current!==v[t]&&o(v[t]),j.push([t,o]),()=>{let a=j.findIndex(([n])=>n===t);a>-1&&j.splice(a,1)}),[t]);let i=r.toasts.map(a=>{var n,l,f;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((n=e[a.type])==null?void 0:n.removeDelay)||(e==null?void 0:e.removeDelay),duration:a.duration||((l=e[a.type])==null?void 0:l.duration)||(e==null?void 0:e.duration)||pe[a.type],style:{...e.style,...(f=e[a.type])==null?void 0:f.style,...a.style}}});return{...r,toasts:i}},ye=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||ce()}),$=e=>(t,r)=>{let o=ye(t,e,r);return C(o.toasterId||fe(o.id))({type:2,toast:o}),o.id},y=(e,t)=>$("blank")(e,t);y.error=$("error");y.success=$("success");y.loading=$("loading");y.custom=$("custom");y.dismiss=(e,t)=>{let r={type:3,toastId:e};t?C(t)(r):Y(r)};y.dismissAll=e=>y.dismiss(void 0,e);y.remove=(e,t)=>{let r={type:4,toastId:e};t?C(t)(r):Y(r)};y.removeAll=e=>y.remove(void 0,e);y.promise=(e,t,r)=>{let o=y.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let i=t.success?k(t.success,s):void 0;return i?y.success(i,{id:o,...r,...r==null?void 0:r.success}):y.dismiss(o),s}).catch(s=>{let i=t.error?k(t.error,s):void 0;i?y.error(i,{id:o,...r,...r==null?void 0:r.error}):y.dismiss(o)}),e};var ge=1e3,be=(e,t="default")=>{let{toasts:r,pausedAt:o}=me(e,t),s=d.useRef(new Map).current,i=d.useCallback((c,p=ge)=>{if(s.has(c))return;let m=setTimeout(()=>{s.delete(c),a({type:4,toastId:c})},p);s.set(c,m)},[]);d.useEffect(()=>{if(o)return;let c=Date.now(),p=r.map(m=>{if(m.duration===1/0)return;let g=(m.duration||0)+m.pauseDuration-(c-m.createdAt);if(g<0){m.visible&&y.dismiss(m.id);return}return setTimeout(()=>y.dismiss(m.id,t),g)});return()=>{p.forEach(m=>m&&clearTimeout(m))}},[r,o,t]);let a=d.useCallback(C(t),[t]),n=d.useCallback(()=>{a({type:5,time:Date.now()})},[a]),l=d.useCallback((c,p)=>{a({type:1,toast:{id:c,height:p}})},[a]),f=d.useCallback(()=>{o&&a({type:6,time:Date.now()})},[o,a]),u=d.useCallback((c,p)=>{let{reverseOrder:m=!1,gutter:g=8,defaultPosition:D}=p||{},A=r.filter(b=>(b.position||D)===(c.position||D)&&b.height),X=A.findIndex(b=>b.id===c.id),M=A.filter((b,z)=>z<X&&b.visible).length;return A.filter(b=>b.visible).slice(...m?[M+1]:[0,M]).reduce((b,z)=>b+(z.height||0)+g,0)},[r]);return d.useEffect(()=>{r.forEach(c=>{if(c.dismissed)i(c.id,c.removeDelay);else{let p=s.get(c.id);p&&(clearTimeout(p),s.delete(c.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:l,startPause:n,endPause:f,calculateOffset:u}}},ve=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,he=E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ee=E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,xe=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ve} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${he} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ee} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,we=E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Se=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${we} 1s linear infinite;
`,De=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,$e=E`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Oe=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${De} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${$e} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,je=w("div")`
  position: absolute;
`,ke=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Re=E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ce=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Re} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ie=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?d.createElement(Ce,null,t):t:r==="blank"?null:d.createElement(ke,null,d.createElement(Se,{...o}),r!=="loading"&&d.createElement(je,null,r==="error"?d.createElement(xe,{...o}):d.createElement(Oe,{...o})))},Ae=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ze=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Pe="0%{opacity:0;} 100%{opacity:1;}",Fe="0%{opacity:1;} 100%{opacity:0;}",Te=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,_e=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Me=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=B()?[Pe,Fe]:[Ae(r),ze(r)];return{animation:t?`${E(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Ne=d.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?Me(e.position||t||"top-center",e.visible):{opacity:0},i=d.createElement(Ie,{toast:e}),a=d.createElement(_e,{...e.ariaProps},k(e.message,e));return d.createElement(Te,{className:e.className,style:{...s,...r,...e.style}},typeof o=="function"?o({icon:i,message:a}):d.createElement(d.Fragment,null,i,a))});le(d.createElement);var Le=({id:e,className:t,style:r,onHeightUpdate:o,children:s})=>{let i=d.useCallback(a=>{if(a){let n=()=>{let l=a.getBoundingClientRect().height;o(e,l)};n(),new MutationObserver(n).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return d.createElement("div",{ref:i,className:t,style:r},s)},Ve=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:B()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...s}},We=R`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,O=16,yt=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:s,toasterId:i,containerStyle:a,containerClassName:n})=>{let{toasts:l,handlers:f}=be(r,i);return d.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:O,left:O,right:O,bottom:O,pointerEvents:"none",...a},className:n,onMouseEnter:f.startPause,onMouseLeave:f.endPause},l.map(u=>{let c=u.position||t,p=f.calculateOffset(u,{reverseOrder:e,gutter:o,defaultPosition:t}),m=Ve(c,p);return d.createElement(Le,{id:u.id,key:u.id,onHeightUpdate:f.updateHeight,className:u.visible?We:"",style:m},u.type==="custom"?k(u.message,u):s?s(u):d.createElement(Ne,{toast:u,position:c}))}))},gt=y;const L=e=>{let t;const r=new Set,o=(u,c)=>{const p=typeof u=="function"?u(t):u;if(!Object.is(p,t)){const m=t;t=c??(typeof p!="object"||p===null)?p:Object.assign({},t,p),r.forEach(g=>g(t,m))}},s=()=>t,l={setState:o,getState:s,getInitialState:()=>f,subscribe:u=>(r.add(u),()=>r.delete(u)),destroy:()=>{r.clear()}},f=t=e(o,s,l);return l},Ue=e=>e?L(e):L;var Z={exports:{}},K={},Q={exports:{}},J={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var S=d;function Be(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var He=typeof Object.is=="function"?Object.is:Be,qe=S.useState,Ge=S.useEffect,Ye=S.useLayoutEffect,Ze=S.useDebugValue;function Ke(e,t){var r=t(),o=qe({inst:{value:r,getSnapshot:t}}),s=o[0].inst,i=o[1];return Ye(function(){s.value=r,s.getSnapshot=t,P(s)&&i({inst:s})},[e,r,t]),Ge(function(){return P(s)&&i({inst:s}),e(function(){P(s)&&i({inst:s})})},[e]),Ze(r),r}function P(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!He(e,r)}catch{return!0}}function Qe(e,t){return t()}var Je=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?Qe:Ke;J.useSyncExternalStore=S.useSyncExternalStore!==void 0?S.useSyncExternalStore:Je;Q.exports=J;var Xe=Q.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var I=d,et=Xe;function tt(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var rt=typeof Object.is=="function"?Object.is:tt,at=et.useSyncExternalStore,ot=I.useRef,st=I.useEffect,it=I.useMemo,nt=I.useDebugValue;K.useSyncExternalStoreWithSelector=function(e,t,r,o,s){var i=ot(null);if(i.current===null){var a={hasValue:!1,value:null};i.current=a}else a=i.current;i=it(function(){function l(m){if(!f){if(f=!0,u=m,m=o(m),s!==void 0&&a.hasValue){var g=a.value;if(s(g,m))return c=g}return c=m}if(g=c,rt(u,m))return g;var D=o(m);return s!==void 0&&s(g,D)?(u=m,g):(u=m,c=D)}var f=!1,u,c,p=r===void 0?null:r;return[function(){return l(t())},p===null?void 0:function(){return l(p())}]},[t,r,o,s]);var n=at(e,i[0],i[1]);return st(function(){a.hasValue=!0,a.value=n},[n]),nt(n),n};Z.exports=K;var lt=Z.exports;const ut=ee(lt),{useDebugValue:ct}=te,{useSyncExternalStoreWithSelector:dt}=ut;const ft=e=>e;function pt(e,t=ft,r){const o=dt(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return ct(o),o}const V=e=>{const t=typeof e=="function"?Ue(e):e,r=(o,s)=>pt(t,o,s);return Object.assign(r,t),r},bt=e=>e?V(e):V;export{yt as F,bt as c,y as n,gt as z};
