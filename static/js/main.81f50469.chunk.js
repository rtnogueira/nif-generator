(this["webpackJsonpnif-generator"]=this["webpackJsonpnif-generator"]||[]).push([[0],{113:function(e,a){},120:function(e,a,n){e.exports=n(184)},129:function(e,a,n){e.exports=n.p+"static/media/logo.d25b0223.png"},142:function(e,a,n){e.exports=n(183)},149:function(e,a,n){},160:function(e,a){},161:function(e,a){},183:function(e,a,n){"use strict";n.r(a);var t=n(0),r=n.n(t),i=n(11),o=n.n(i),c=n(116),s=n(117),l=n(133),u=n(135),m=n(131),p=n(34),d=n(64),f=(n(149),n(233)),v=n(89),g=n.n(v),h=n(15),E=n(62),b=n(120),y=n.n(b),x=n(23),w=n(36),O=n(91),j=n.n(O),N=n(63),C=n(190),k=n(95),S=n(236),T=n(220),q=n(221),B=n(222),L=n(82),D=n(121),F=n.n(D),I=n(122),A=n.n(I),W=n(123),M=n.n(W),P=n(223),R=n(224),G=n(189),U=n(225),H=n(226),J=n(124),V=n.n(J),_=function(){var e,a=Object(E.c)((function(e){return e.drawer})),n=Object(E.b)(),t=(e=a.width,Object(C.a)((function(a){return{root:{display:"flex"},appBar:{transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen})},appBarShift:{width:"calc(100% - ".concat(e,"px)"),marginLeft:e,transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen})},menuButton:{marginRight:a.spacing(2)},hide:{display:"none"},drawer:{width:e,flexShrink:0},drawerPaper:{width:e},drawerHeader:Object(w.a)({display:"flex",alignItems:"center",padding:"0 8px"},a.mixins.toolbar,{justifyContent:"flex-end"}),content:{flexGrow:1,padding:a.spacing(3),transition:a.transitions.create("margin",{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen}),marginLeft:-e},contentShift:{transition:a.transitions.create("margin",{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen}),marginLeft:0}}})))(),i=Object(k.a)();return r.a.createElement("div",{className:t.root},r.a.createElement(T.a,{position:"fixed",className:j()(t.appBar,Object(x.a)({},t.appBarShift,a.open))},r.a.createElement(q.a,null,r.a.createElement(B.a,{color:"inherit","aria-label":"open drawer",onClick:function(){n({type:N.a.OPEN})},edge:"start",className:j()(t.menuButton,a.open&&t.hide)},r.a.createElement(F.a,null)),r.a.createElement(L.a,{variant:"h6",noWrap:!0},"Generator of Things"))),r.a.createElement(S.a,{className:t.drawer,variant:"persistent",anchor:"left",open:a.open,classes:{paper:t.drawerPaper}},r.a.createElement("div",{className:t.drawerHeader},r.a.createElement(B.a,{onClick:function(){n({type:N.a.CLOSE})}},"ltr"===i.direction?r.a.createElement(A.a,null):r.a.createElement(M.a,null))),r.a.createElement(P.a,null),r.a.createElement(R.a,null,r.a.createElement(G.a,{button:!0,key:"NIF"},r.a.createElement(U.a,null,r.a.createElement(V.a,null)),r.a.createElement(H.a,{primary:"NIF"})))))},z=n(134),Q=n(39),$=function(e){var a=K(8-e.toString().length),n="".concat(e).concat(a),t=X(n);return"".concat(n).concat(t)},K=function(e){return Math.floor(Math.random()*Math.pow(9,e))+Math.pow(8,e)},X=function(e){if(e){var a,n=0;return e.toString().split("").reverse().forEach((function(e,a){n+=parseInt(e,10)*(a+2)})),(a=n%11)<2?0:11-a}},Y=n(127),Z=n.n(Y),ee=n(126),ae=n.n(ee),ne=n(4),te=n.n(ne),re=n(125),ie=n.n(re),oe=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=Object(t.useState)(!1),r=Object(Q.a)(n,2),i=r[0],o=r[1];return Object(t.useEffect)((function(){if(i&&a){var e=setTimeout((function(){return o(!1)}),a);return function(){clearTimeout(e)}}}),[i,a]),[i,function(){ie()(e),o(!0)}]};oe.propTypes={textToCopy:te.a.string.isRequired,successDuration:te.a.number};var ce=oe,se=function(e){var a=e.value,n=ce(a),t=Object(Q.a)(n,2),i=t[0],o=t[1];return r.a.createElement(B.a,{edge:"end","aria-label":"copy",onClick:function(){return o(a)}},i?r.a.createElement(ae.a,null):r.a.createElement(Z.a,null))},le=n(128),ue=n(92),me=n(227),pe=function(e){var a=e.csvData,n=e.fileName;return r.a.createElement(me.a,{variant:"contained",color:"secondary",onClick:function(){return function(e,a){var n={Sheets:{data:ue.utils.json_to_sheet(e.map((function(e){return{NIF:e}})))},SheetNames:["data"]},t=ue.write(n,{bookType:"xlsx",type:"array"}),r=new Blob([t],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});le.saveAs(r,a+".xlsx")}(a,n)}},"Download")},de=n(130),fe=n.n(de),ve=n(228),ge=n(229),he=n(237),Ee=n(234),be=n(231),ye=n(230),xe=n(232),we=n(129),Oe=n.n(we),je=[{name:"pessoa singular",value:"1"},{name:"pessoa singular",value:"2"},{name:"pessoa singular (a partir de julho de 2019)",value:"3"},{name:"pessoa singular",value:"38"},{name:"pessoa singular",value:"39"},{name:"pessoa singular n\xe3o residente",value:"45"},{name:"pessoa colectiva",value:"5"},{name:"administra\xe7\xe3o p\xfablica (Central, Regional ou Local)",value:"6"},{name:"pessoa colectiva n\xe3o residente",value:"71"},{name:"heran\xe7a indivisa",value:"70"},{name:"heran\xe7a indivisa",value:"74"},{name:"heran\xe7a indivisa",value:"75"},{name:"fundos de investimento",value:"72"},{name:"atribui\xe7\xe3o oficiosa",value:"77"},{name:"atribui\xe7\xe3o oficiosa n\xe3o residentes (processo VAT REFUND)",value:"78"},{name:"regime excepcional",value:"79"},{name:"empres\xe1rio em nome individual (extinto)",value:"8"},{name:"pessoa colectiva irregular ou n\xfamero provis\xf3rio",value:"9"},{name:"condominios e sociedades irregulares",value:"90"},{name:"condominios e sociedades irregulares",value:"91"},{name:"n\xe3o residentes sem estabelecimento est\xe1vel",value:"98"},{name:"sociedades civis sem personalidade jur\xeddica",value:"99"}],Ne=fe()((function(e){var a;return{mainContainer:{textAlign:"center"},image:{margin:"20px auto",width:"100px"},pageTitle:{margin:"10px auto"},formContainer:Object(x.a)({display:"flex",justifyContent:"center"},e.breakpoints.down("xs"),{flexDirection:"column"}),inputContainer:Object(x.a)({textAlign:"left"},e.breakpoints.down("xs"),{minWidth:"100%"}),typeContainer:Object(x.a)({},e.breakpoints.up("xs"),{minWidth:"340px"}),quantityContainer:(a={},Object(x.a)(a,e.breakpoints.up("xs"),{margin:"0 20px"}),Object(x.a)(a,e.breakpoints.down("xs"),{margin:"20px 0"}),a),resultContainer:{display:"flex",alignItems:"center",margin:"20px 0",flexDirection:"column"},resultList:{maxWidth:"250px"},nif:{marginRight:"20px"}}}))((function(e){var a=e.classes,n=Object(t.useState)({quantity:1,type:2}),i=Object(Q.a)(n,2),o=i[0],c=i[1],s=Object(t.useState)([]),l=Object(Q.a)(s,2),u=l[0],m=l[1];function p(e){c((function(a){return Object(w.a)({},a,Object(x.a)({},e.target.name,e.target.value))}))}return r.a.createElement(ve.a,{container:!0,spacing:2,className:a.mainContainer},r.a.createElement(ve.a,{item:!0,xs:12,className:a.header},r.a.createElement("img",{src:Oe.a,alt:"app icon",className:a.image}),r.a.createElement(L.a,{variant:"h4",className:a.pageTitle},"NIF Generator")),r.a.createElement(ve.a,{item:!0,xs:12,className:a.formContainer},r.a.createElement(ge.a,{className:"".concat(a.inputContainer," ").concat(a.typeContainer)},r.a.createElement(he.a,{htmlFor:"type"},"Type"),r.a.createElement(Ee.a,{value:o.type,onChange:p,className:a.input,input:r.a.createElement(ye.a,{name:"type",id:"type"})},je.map((function(e){return r.a.createElement(be.a,{key:e.value,value:e.value},"".concat(e.name," [").concat(e.value,"]"))})))),r.a.createElement(ge.a,{className:"".concat(a.inputContainer," ").concat(a.quantityContainer)},r.a.createElement(he.a,{htmlFor:"quantity"},"Quantity"),r.a.createElement(Ee.a,{value:o.quantity,onChange:p,className:a.input,input:r.a.createElement(ye.a,{name:"quantity",id:"quantity"})},Object(z.a)(Array(50)).map((function(e,a){return a++,r.a.createElement(be.a,{key:a,value:a},a)})))),r.a.createElement(me.a,{variant:"contained",color:"primary",onClick:function(){!function(){for(var e=[],a=0;a<o.quantity;a++){var n=$(o.type);e.push(n)}m((function(){return e}))}()},className:a.button},"Generate")),r.a.createElement(ve.a,{item:!0,xs:12,className:a.resultContainer},u&&u.length>0&&r.a.createElement(pe,{csvData:u,fileName:"nif-list"}),r.a.createElement(R.a,{className:"".concat(a.resultList)},u.map((function(e){return r.a.createElement(G.a,{key:e},r.a.createElement(H.a,{primary:e,className:"".concat(a.nif)}),r.a.createElement(xe.a,null,r.a.createElement(se,{value:e})))})))))})),Ce=g()({palette:{primary:{light:"#33c9dc",main:"#00bcd4",dark:"#008394",contrastText:"#fff"},secondary:{light:"#ff6333",main:"#ff3d00",dark:"#b22a00",contrastText:"#fff"}},typography:{useNextVariants:!0}});d.a.initialize("UA-146599861-1"),Object(h.a)().listen((function(e){d.a.set({page:e.pathname}),d.a.pageview(e.pathname)}));var ke=function(e){Object(u.a)(n,e);var a=Object(l.a)(n);function n(){return Object(c.a)(this,n),a.apply(this,arguments)}return Object(s.a)(n,[{key:"componentDidMount",value:function(){d.a.pageview(window.location.pathname)}},{key:"render",value:function(){return r.a.createElement(f.a,{theme:Ce},r.a.createElement(E.a,{store:y.a},r.a.createElement(m.a,{basename:"/"},r.a.createElement(_,null),r.a.createElement("div",{className:"container"},r.a.createElement(p.c,null,r.a.createElement(p.a,{exact:!0,path:"/",component:Ne}),r.a.createElement(p.a,{component:Ne}))))))}}]),n}(t.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(ke,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},184:function(e,a,n){"use strict";n.r(a);var t=n(47),r=n(63),i=Object(t.b)({drawer:r.b}),o=Object(t.c)(i,{});a.default=o},63:function(e,a,n){"use strict";n.d(a,"a",(function(){return t})),n.d(a,"b",(function(){return s}));var t={};n.r(t),n.d(t,"OPEN",(function(){return r})),n.d(t,"CLOSE",(function(){return i}));var r="OPEN",i="CLOSE",o=n(36),c={width:240,open:!1};var s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,a=arguments.length>1?arguments[1]:void 0;switch(a.type){case r:return Object(o.a)({},e,{open:!0});case i:return Object(o.a)({},e,{open:!1});default:return e}}}},[[142,1,2]]]);
//# sourceMappingURL=main.81f50469.chunk.js.map