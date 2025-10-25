import{r as p,a as te,R as re}from"./vendor-02466f39.js";let oe={data:""},ae=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||oe},se=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ie=/\/\*[^]*?\*\/|  +/g,B=/\n+/g,D=(e,t)=>{let r="",a="",s="";for(let i in e){let o=e[i];i[0]=="@"?i[1]=="i"?r=i+" "+o+";":a+=i[1]=="f"?D(o,i):i+"{"+D(o,i[1]=="k"?"":t)+"}":typeof o=="object"?a+=D(o,t?t.replace(/([^,])+/g,n=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,n):n?n+" "+c:c)):i):o!=null&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=D.p?D.p(i,o):i+":"+o+";")}return r+(t&&s?t+"{"+s+"}":s)+a},x={},G=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+G(e[r]);return t}return e},ne=(e,t,r,a,s)=>{let i=G(e),o=x[i]||(x[i]=(c=>{let d=0,l=11;for(;d<c.length;)l=101*l+c.charCodeAt(d++)>>>0;return"go"+l})(i));if(!x[o]){let c=i!==e?e:(d=>{let l,f,m=[{}];for(;l=se.exec(d.replace(ie,""));)l[4]?m.shift():l[3]?(f=l[3].replace(B," ").trim(),m.unshift(m[0][f]=m[0][f]||{})):m[0][l[1]]=l[2].replace(B," ").trim();return m[0]})(e);x[o]=D(s?{["@keyframes "+o]:c}:c,r?"":"."+o)}let n=r&&x.g?x.g:null;return r&&(x.g=x[o]),((c,d,l,f)=>{f?d.data=d.data.replace(f,c):d.data.indexOf(c)===-1&&(d.data=l?c+d.data:d.data+c)})(x[o],t,a,n),o},le=(e,t,r)=>e.reduce((a,s,i)=>{let o=t[i];if(o&&o.call){let n=o(r),c=n&&n.props&&n.props.className||/^go/.test(n)&&n;o=c?"."+c:n&&typeof n=="object"?n.props?"":D(n,""):n===!1?"":n}return a+s+(o??"")},"");function P(e){let t=this||{},r=e.call?e(t.p):e;return ne(r.unshift?r.raw?le(r,[].slice.call(arguments,1),t.p):r.reduce((a,s)=>Object.assign(a,s&&s.call?s(t.p):s),{}):r,ae(t.target),t.g,t.o,t.k)}let K,k,$;P.bind({g:1});let w=P.bind({k:1});function ue(e,t,r,a){D.p=t,K=e,k=r,$=a}function T(e,t){let r=this||{};return function(){let a=arguments;function s(i,o){let n=Object.assign({},i),c=n.className||s.className;r.p=Object.assign({theme:k&&k()},n),r.o=/ *go\d+/.test(c),n.className=P.apply(r,a)+(c?" "+c:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),$&&d[0]&&$(n),K(d,n)}return t?t(s):s}}var ce=e=>typeof e=="function",C=(e,t)=>ce(e)?e(t):e,de=(()=>{let e=0;return()=>(++e).toString()})(),U=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),fe=20,N="default",W=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:a}=t;return W(e,{type:e.toasts.find(o=>o.id===a.id)?1:0,toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(o=>o.id===s||s===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+i}))}}},V=[],q={toasts:[],pausedAt:void 0,settings:{toastLimit:fe}},h={},Y=(e,t=N)=>{h[t]=W(h[t]||q,e),V.forEach(([r,a])=>{r===t&&a(h[t])})},Z=e=>Object.keys(h).forEach(t=>Y(e,t)),pe=e=>Object.keys(h).find(t=>h[t].toasts.some(r=>r.id===e)),j=(e=N)=>t=>{Y(t,e)},me={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},ye=(e={},t=N)=>{let[r,a]=p.useState(h[t]||q),s=p.useRef(h[t]);p.useEffect(()=>(s.current!==h[t]&&a(h[t]),V.push([t,a]),()=>{let o=V.findIndex(([n])=>n===t);o>-1&&V.splice(o,1)}),[t]);let i=r.toasts.map(o=>{var n,c,d;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((n=e[o.type])==null?void 0:n.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((c=e[o.type])==null?void 0:c.duration)||(e==null?void 0:e.duration)||me[o.type],style:{...e.style,...(d=e[o.type])==null?void 0:d.style,...o.style}}});return{...r,toasts:i}},ge=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||de()}),R=e=>(t,r)=>{let a=ge(t,e,r);return j(a.toasterId||pe(a.id))({type:2,toast:a}),a.id},g=(e,t)=>R("blank")(e,t);g.error=R("error");g.success=R("success");g.loading=R("loading");g.custom=R("custom");g.dismiss=(e,t)=>{let r={type:3,toastId:e};t?j(t)(r):Z(r)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let r={type:4,toastId:e};t?j(t)(r):Z(r)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,r)=>{let a=g.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let i=t.success?C(t.success,s):void 0;return i?g.success(i,{id:a,...r,...r==null?void 0:r.success}):g.dismiss(a),s}).catch(s=>{let i=t.error?C(t.error,s):void 0;i?g.error(i,{id:a,...r,...r==null?void 0:r.error}):g.dismiss(a)}),e};var Ee=1e3,be=(e,t="default")=>{let{toasts:r,pausedAt:a}=ye(e,t),s=p.useRef(new Map).current,i=p.useCallback((f,m=Ee)=>{if(s.has(f))return;let u=setTimeout(()=>{s.delete(f),o({type:4,toastId:f})},m);s.set(f,u)},[]);p.useEffect(()=>{if(a)return;let f=Date.now(),m=r.map(u=>{if(u.duration===1/0)return;let y=(u.duration||0)+u.pauseDuration-(f-u.createdAt);if(y<0){u.visible&&g.dismiss(u.id);return}return setTimeout(()=>g.dismiss(u.id,t),y)});return()=>{m.forEach(u=>u&&clearTimeout(u))}},[r,a,t]);let o=p.useCallback(j(t),[t]),n=p.useCallback(()=>{o({type:5,time:Date.now()})},[o]),c=p.useCallback((f,m)=>{o({type:1,toast:{id:f,height:m}})},[o]),d=p.useCallback(()=>{a&&o({type:6,time:Date.now()})},[a,o]),l=p.useCallback((f,m)=>{let{reverseOrder:u=!1,gutter:y=8,defaultPosition:E}=m||{},v=r.filter(b=>(b.position||E)===(f.position||E)&&b.height),_=v.findIndex(b=>b.id===f.id),O=v.filter((b,A)=>A<_&&b.visible).length;return v.filter(b=>b.visible).slice(...u?[O+1]:[0,O]).reduce((b,A)=>b+(A.height||0)+y,0)},[r]);return p.useEffect(()=>{r.forEach(f=>{if(f.dismissed)i(f.id,f.removeDelay);else{let m=s.get(f.id);m&&(clearTimeout(m),s.delete(f.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:c,startPause:n,endPause:d,calculateOffset:l}}},ve=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,_e=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,he=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Oe=T("div")`
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
    animation: ${_e} 0.15s ease-out forwards;
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
    animation: ${he} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Se=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,xe=T("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Se} 1s linear infinite;
`,we=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ae=w`
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
}`,De=T("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${we} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ae} 0.2s ease-out forwards;
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
`,Te=T("div")`
  position: absolute;
`,Le=T("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Re=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ie=T("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Re} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ve=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return t!==void 0?typeof t=="string"?p.createElement(Ie,null,t):t:r==="blank"?null:p.createElement(Le,null,p.createElement(xe,{...a}),r!=="loading"&&p.createElement(Te,null,r==="error"?p.createElement(Oe,{...a}):p.createElement(De,{...a})))},Ce=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Pe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,je="0%{opacity:0;} 100%{opacity:1;}",ke="0%{opacity:1;} 100%{opacity:0;}",$e=T("div")`
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
`,Ne=T("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Me=(e,t)=>{let r=e.includes("top")?1:-1,[a,s]=U()?[je,ke]:[Ce(r),Pe(r)];return{animation:t?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ze=p.memo(({toast:e,position:t,style:r,children:a})=>{let s=e.height?Me(e.position||t||"top-center",e.visible):{opacity:0},i=p.createElement(Ve,{toast:e}),o=p.createElement(Ne,{...e.ariaProps},C(e.message,e));return p.createElement($e,{className:e.className,style:{...s,...r,...e.style}},typeof a=="function"?a({icon:i,message:o}):p.createElement(p.Fragment,null,i,o))});ue(p.createElement);var Be=({id:e,className:t,style:r,onHeightUpdate:a,children:s})=>{let i=p.useCallback(o=>{if(o){let n=()=>{let c=o.getBoundingClientRect().height;a(e,c)};n(),new MutationObserver(n).observe(o,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return p.createElement("div",{ref:i,className:t,style:r},s)},He=(e,t)=>{let r=e.includes("top"),a=r?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:U()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...a,...s}},Fe=P`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,I=16,Xe=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:s,toasterId:i,containerStyle:o,containerClassName:n})=>{let{toasts:c,handlers:d}=be(r,i);return p.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:I,left:I,right:I,bottom:I,pointerEvents:"none",...o},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(l=>{let f=l.position||t,m=d.calculateOffset(l,{reverseOrder:e,gutter:a,defaultPosition:t}),u=He(f,m);return p.createElement(Be,{id:l.id,key:l.id,onHeightUpdate:d.updateHeight,className:l.visible?Fe:"",style:u},l.type==="custom"?C(l.message,l):s?s(l):p.createElement(ze,{toast:l,position:f}))}))},et=g;const H=e=>{let t;const r=new Set,a=(l,f)=>{const m=typeof l=="function"?l(t):l;if(!Object.is(m,t)){const u=t;t=f??(typeof m!="object"||m===null)?m:Object.assign({},t,m),r.forEach(y=>y(t,u))}},s=()=>t,c={setState:a,getState:s,getInitialState:()=>d,subscribe:l=>(r.add(l),()=>r.delete(l)),destroy:()=>{r.clear()}},d=t=e(a,s,c);return c},Ge=e=>e?H(e):H;var Q={exports:{}},J={},X={exports:{}},ee={};/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(){function e(u,y){return u===y&&(u!==0||1/u===1/y)||u!==u&&y!==y}function t(u,y){l||s.startTransition===void 0||(l=!0,console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));var E=y();if(!f){var v=y();i(E,v)||(console.error("The result of getSnapshot should be cached to avoid an infinite loop"),f=!0)}v=o({inst:{value:E,getSnapshot:y}});var _=v[0].inst,O=v[1];return c(function(){_.value=E,_.getSnapshot=y,r(_)&&O({inst:_})},[u,E,y]),n(function(){return r(_)&&O({inst:_}),u(function(){r(_)&&O({inst:_})})},[u]),d(E),E}function r(u){var y=u.getSnapshot;u=u.value;try{var E=y();return!i(u,E)}catch{return!0}}function a(u,y){return y()}typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());var s=p,i=typeof Object.is=="function"?Object.is:e,o=s.useState,n=s.useEffect,c=s.useLayoutEffect,d=s.useDebugValue,l=!1,f=!1,m=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?a:t;ee.useSyncExternalStore=s.useSyncExternalStore!==void 0?s.useSyncExternalStore:m,typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error())})();X.exports=ee;var Ke=X.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(){function e(d,l){return d===l&&(d!==0||1/d===1/l)||d!==d&&l!==l}typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());var t=p,r=Ke,a=typeof Object.is=="function"?Object.is:e,s=r.useSyncExternalStore,i=t.useRef,o=t.useEffect,n=t.useMemo,c=t.useDebugValue;J.useSyncExternalStoreWithSelector=function(d,l,f,m,u){var y=i(null);if(y.current===null){var E={hasValue:!1,value:null};y.current=E}else E=y.current;y=n(function(){function _(S){if(!O){if(O=!0,b=S,S=m(S),u!==void 0&&E.hasValue){var L=E.value;if(u(L,S))return A=L}return A=S}if(L=A,a(b,S))return L;var z=m(S);return u!==void 0&&u(L,z)?(b=S,L):(b=S,A=z)}var O=!1,b,A,M=f===void 0?null:f;return[function(){return _(l())},M===null?void 0:function(){return _(M())}]},[l,f,m,u]);var v=s(d,y[0],y[1]);return o(function(){E.hasValue=!0,E.value=v},[v]),c(v),v},typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error())})();Q.exports=J;var Ue=Q.exports;const We=te(Ue),{useDebugValue:qe}=re,{useSyncExternalStoreWithSelector:Ye}=We;const Ze=e=>e;function Qe(e,t=Ze,r){const a=Ye(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return qe(a),a}const F=e=>{const t=typeof e=="function"?Ge(e):e,r=(a,s)=>Qe(t,a,s);return Object.assign(r,t),r},tt=e=>e?F(e):F;export{Xe as F,tt as c,g as n,et as z};
