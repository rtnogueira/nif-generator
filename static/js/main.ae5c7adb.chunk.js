(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,a,n){e.exports=n(152)},105:function(e,a,n){e.exports=n.p+"static/media/logo.d25b0223.png"},117:function(e,a,n){e.exports=n(151)},124:function(e,a,n){},151:function(e,a,n){"use strict";n.r(a);var t=n(0),r=n.n(t),i=n(8),o=n.n(i),c=n(96),s=n(97),l=n(112),u=n(98),m=n(113),p=n(109),d=n(34),f=n(49),g=(n(124),n(108)),v=n.n(g),h=n(77),E=n.n(h),b=n(19),y=n(47),x=n(100),w=n.n(x),O=n(25),j=n(36),N=n(81),C=n.n(N),k=n(48),S=n(78),q=n(56),B=n(195),L=n(181),I=n(182),P=n(183),T=n(68),W=n(101),F=n.n(W),M=n(102),A=n.n(M),G=n(103),D=n.n(G),H=n(184),J=n(185),R=n(154),z=n(186),Q=n(187),U=n(104),V=n.n(U),$=function(e){return Object(S.a)(function(a){return{root:{display:"flex"},appBar:{transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen})},appBarShift:{width:"calc(100% - ".concat(e,"px)"),marginLeft:e,transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen})},menuButton:{marginRight:a.spacing(2)},hide:{display:"none"},drawer:{width:e,flexShrink:0},drawerPaper:{width:e},drawerHeader:Object(j.a)({display:"flex",alignItems:"center",padding:"0 8px"},a.mixins.toolbar,{justifyContent:"flex-end"}),content:{flexGrow:1,padding:a.spacing(3),transition:a.transitions.create("margin",{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen}),marginLeft:-e},contentShift:{transition:a.transitions.create("margin",{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen}),marginLeft:0}}})};function K(){var e=Object(y.c)(function(e){return e.drawer}),a=Object(y.b)(),n=$(e.width)(),t=Object(q.a)();return r.a.createElement("div",{className:n.root},r.a.createElement(L.a,{position:"fixed",className:C()(n.appBar,Object(O.a)({},n.appBarShift,e.open))},r.a.createElement(I.a,null,r.a.createElement(P.a,{color:"inherit","aria-label":"open drawer",onClick:function(){a({type:k.a.OPEN})},edge:"start",className:C()(n.menuButton,e.open&&n.hide)},r.a.createElement(F.a,null)),r.a.createElement(T.a,{variant:"h6",noWrap:!0},"Generator of Things"))),r.a.createElement(B.a,{className:n.drawer,variant:"persistent",anchor:"left",open:e.open,classes:{paper:n.drawerPaper}},r.a.createElement("div",{className:n.drawerHeader},r.a.createElement(P.a,{onClick:function(){a({type:k.a.CLOSE})}},"ltr"===t.direction?r.a.createElement(A.a,null):r.a.createElement(D.a,null))),r.a.createElement(H.a,null),r.a.createElement(J.a,null,r.a.createElement(R.a,{button:!0,key:"NIF"},r.a.createElement(z.a,null,r.a.createElement(V.a,null)),r.a.createElement(Q.a,{primary:"NIF"})))))}var X=n(111),Y=n(84),Z=n(107),_=n.n(Z),ee=n(188),ae=n(189),ne=n(197),te=n(193),re=n(190),ie=n(196),oe=n(191),ce=n(192),se=n(106),le=n.n(se),ue=n(105),me=n.n(ue),pe=[{name:"pessoa singular",value:"1"},{name:"pessoa singular",value:"2"},{name:"pessoa singular",value:"3"},{name:"pessoa singular n\xe3o residente",value:"45"},{name:"pessoa colectiva",value:"5"},{name:"Pessoa colectiva irregular ou n\xfamero provis\xf3rio",value:"9"},{name:"administra\xe7\xe3o p\xfablica",value:"6"},{name:"empres\xe1rio em nome individual (extinto)",value:"8"},{name:"heran\xe7a indivisa",value:"70"},{name:"pessoa colectiva n\xe3o residente",value:"71"},{name:"fundos de investimento",value:"72"},{name:"atribui\xe7\xe3o oficiosa",value:"77"},{name:"regime excepcional",value:"79"},{name:"condominios e sociedades irregulares",value:"90"},{name:"condominios e sociedades irregulares",value:"91"},{name:"n\xe3o residentes",value:"98"},{name:"sociedades civis",value:"99"}],de=function(e){var a=fe(8-e.toString().length),n="".concat(e).concat(a),t=ge(n);return"".concat(n).concat(t)},fe=function(e){return Math.floor(Math.random()*Math.pow(9,e))+Math.pow(8,e)},ge=function(e){if(e){var a,n=0;return e.toString().split("").reverse().forEach(function(e,a){n+=parseInt(e,10)*(a+2)}),(a=n%11)<2?0:11-a}},ve=_()(function(e){var a;return{mainContainer:{textAlign:"center"},image:{margin:"20px auto",width:"100px"},pageTitle:{margin:"10px auto"},formContainer:Object(O.a)({display:"flex",justifyContent:"center"},e.breakpoints.down("xs"),{flexDirection:"column"}),inputContainer:Object(O.a)({textAlign:"left"},e.breakpoints.down("xs"),{minWidth:"100%"}),typeContainer:Object(O.a)({},e.breakpoints.up("xs"),{minWidth:"340px"}),quantityContainer:(a={},Object(O.a)(a,e.breakpoints.up("xs"),{margin:"0 20px"}),Object(O.a)(a,e.breakpoints.down("xs"),{margin:"20px 0"}),a),resultContainer:{display:"flex",justifyContent:"center",margin:"20px 0"},resultList:{maxWidth:"250px"},nif:{marginRight:"20px"}}})(function(e){var a=e.classes,n=Object(t.useState)({quantity:1,type:2}),i=Object(Y.a)(n,2),o=i[0],c=i[1],s=Object(t.useState)([]),l=Object(Y.a)(s,2),u=l[0],m=l[1];function p(e){c(function(a){return Object(j.a)({},a,Object(O.a)({},e.target.name,e.target.value))})}return r.a.createElement(ee.a,{container:!0,spacing:2,className:a.mainContainer},r.a.createElement(ee.a,{item:!0,xs:12,className:a.header},r.a.createElement("img",{src:me.a,alt:"app icon",className:a.image}),r.a.createElement(T.a,{variant:"h4",className:a.pageTitle},"NIF Generator")),r.a.createElement(ee.a,{item:!0,xs:12,className:a.formContainer},r.a.createElement(ae.a,{className:"".concat(a.inputContainer," ").concat(a.typeContainer)},r.a.createElement(ne.a,{htmlFor:"type"},"Type"),r.a.createElement(te.a,{value:o.type,onChange:p,className:a.input,input:r.a.createElement(ie.a,{name:"type",id:"type"})},pe.map(function(e){return r.a.createElement(re.a,{key:e.value,value:e.value},"".concat(e.name," [").concat(e.value,"]"))}))),r.a.createElement(ae.a,{className:"".concat(a.inputContainer," ").concat(a.quantityContainer)},r.a.createElement(ne.a,{htmlFor:"quantity"},"Quantity"),r.a.createElement(te.a,{value:o.quantity,onChange:p,className:a.input,input:r.a.createElement(ie.a,{name:"quantity",id:"quantity"})},Object(X.a)(Array(20)).map(function(e,a){return a++,r.a.createElement(re.a,{key:a,value:a},a)}))),r.a.createElement(oe.a,{variant:"contained",color:"primary",onClick:function(){!function(){for(var e=[],a=0;a<o.quantity;a++){var n=de(o.type);e.push(n)}m(function(){return e})}()},className:a.button},"Generate")),r.a.createElement(ee.a,{item:!0,xs:12,className:a.resultContainer},r.a.createElement(J.a,{className:"".concat(a.resultList)},u.map(function(e){return r.a.createElement(R.a,{key:e},r.a.createElement(Q.a,{primary:e,className:"".concat(a.nif)}),r.a.createElement(ce.a,null,r.a.createElement(P.a,{edge:"end","aria-label":"copy"},r.a.createElement(le.a,null))))}))))}),he=E()({palette:{primary:{light:"#33c9dc",main:"#00bcd4",dark:"#008394",contrastText:"#fff"},secondary:{light:"#ff6333",main:"#ff3d00",dark:"#b22a00",contrastText:"#fff"}},typography:{useNextVariants:!0}});f.a.initialize("UA-146599861-1"),Object(b.a)().listen(function(e){f.a.set({page:e.pathname}),f.a.pageview(e.pathname)});var Ee=function(e){function a(){return Object(c.a)(this,a),Object(l.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"componentDidMount",value:function(){f.a.pageview(window.location.pathname)}},{key:"render",value:function(){return r.a.createElement(v.a,{theme:he},r.a.createElement(y.a,{store:w.a},r.a.createElement(p.a,{basename:"/"},r.a.createElement(K,null),r.a.createElement("div",{className:"container"},r.a.createElement(d.c,null,r.a.createElement(d.a,{exact:!0,path:"/",component:ve}),r.a.createElement(d.a,{component:ve}))))))}}]),a}(t.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Ee,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},152:function(e,a,n){"use strict";n.r(a);var t=n(42),r=n(48),i=Object(t.b)({drawer:r.b}),o=Object(t.c)(i,{});a.default=o},48:function(e,a,n){"use strict";var t={};n.r(t),n.d(t,"OPEN",function(){return r}),n.d(t,"CLOSE",function(){return i});var r="OPEN",i="CLOSE",o=n(36),c={width:240,open:!1};var s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c;switch((arguments.length>1?arguments[1]:void 0).type){case r:return Object(o.a)({},e,{open:!0});case i:return Object(o.a)({},e,{open:!1});default:return e}};n.d(a,"a",function(){return t}),n.d(a,"b",function(){return s})}},[[117,1,2]]]);
//# sourceMappingURL=main.ae5c7adb.chunk.js.map