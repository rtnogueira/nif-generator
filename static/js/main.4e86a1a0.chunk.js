(this["webpackJsonpnif-generator"]=this["webpackJsonpnif-generator"]||[]).push([[0],{113:function(e,a){},121:function(e,a,n){e.exports=n(185)},130:function(e,a,n){e.exports=n.p+"static/media/logo.d25b0223.png"},143:function(e,a,n){e.exports=n(184)},150:function(e,a,n){},161:function(e,a){},162:function(e,a){},184:function(e,a,n){"use strict";n.r(a);var t=n(0),r=n.n(t),i=n(11),o=n.n(i),c=n(116),s=n(117),l=n(135),u=n(118),m=n(136),p=n(132),d=n(34),f=n(64),v=(n(150),n(234)),g=n(89),h=n.n(g),E=n(15),b=n(62),y=n(121),x=n.n(y),O=n(23),w=n(36),j=n(91),N=n.n(j),C=n(63),k=n(191),S=n(95),T=n(237),q=n(221),B=n(222),L=n(223),D=n(82),F=n(122),I=n.n(F),A=n(123),W=n.n(A),M=n(124),P=n.n(M),R=n(224),G=n(225),U=n(190),H=n(226),J=n(227),V=n(125),_=n.n(V),z=function(){var e,a=Object(b.c)((function(e){return e.drawer})),n=Object(b.b)(),t=(e=a.width,Object(k.a)((function(a){return{root:{display:"flex"},appBar:{transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen})},appBarShift:{width:"calc(100% - ".concat(e,"px)"),marginLeft:e,transition:a.transitions.create(["margin","width"],{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen})},menuButton:{marginRight:a.spacing(2)},hide:{display:"none"},drawer:{width:e,flexShrink:0},drawerPaper:{width:e},drawerHeader:Object(w.a)({display:"flex",alignItems:"center",padding:"0 8px"},a.mixins.toolbar,{justifyContent:"flex-end"}),content:{flexGrow:1,padding:a.spacing(3),transition:a.transitions.create("margin",{easing:a.transitions.easing.sharp,duration:a.transitions.duration.leavingScreen}),marginLeft:-e},contentShift:{transition:a.transitions.create("margin",{easing:a.transitions.easing.easeOut,duration:a.transitions.duration.enteringScreen}),marginLeft:0}}})))(),i=Object(S.a)();return r.a.createElement("div",{className:t.root},r.a.createElement(q.a,{position:"fixed",className:N()(t.appBar,Object(O.a)({},t.appBarShift,a.open))},r.a.createElement(B.a,null,r.a.createElement(L.a,{color:"inherit","aria-label":"open drawer",onClick:function(){n({type:C.a.OPEN})},edge:"start",className:N()(t.menuButton,a.open&&t.hide)},r.a.createElement(I.a,null)),r.a.createElement(D.a,{variant:"h6",noWrap:!0},"Generator of Things"))),r.a.createElement(T.a,{className:t.drawer,variant:"persistent",anchor:"left",open:a.open,classes:{paper:t.drawerPaper}},r.a.createElement("div",{className:t.drawerHeader},r.a.createElement(L.a,{onClick:function(){n({type:C.a.CLOSE})}},"ltr"===i.direction?r.a.createElement(W.a,null):r.a.createElement(P.a,null))),r.a.createElement(R.a,null),r.a.createElement(G.a,null,r.a.createElement(U.a,{button:!0,key:"NIF"},r.a.createElement(H.a,null,r.a.createElement(_.a,null)),r.a.createElement(J.a,{primary:"NIF"})))))},Q=n(134),$=n(39),K=function(e){var a=X(8-e.toString().length),n="".concat(e).concat(a),t=Y(n);return"".concat(n).concat(t)},X=function(e){return Math.floor(Math.random()*Math.pow(9,e))+Math.pow(8,e)},Y=function(e){if(e){var a,n=0;return e.toString().split("").reverse().forEach((function(e,a){n+=parseInt(e,10)*(a+2)})),(a=n%11)<2?0:11-a}},Z=n(128),ee=n.n(Z),ae=n(127),ne=n.n(ae),te=n(4),re=n.n(te),ie=n(126),oe=n.n(ie),ce=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=Object(t.useState)(!1),r=Object($.a)(n,2),i=r[0],o=r[1];return Object(t.useEffect)((function(){if(i&&a){var e=setTimeout((function(){return o(!1)}),a);return function(){clearTimeout(e)}}}),[i,a]),[i,function(){oe()(e),o(!0)}]};ce.propTypes={textToCopy:re.a.string.isRequired,successDuration:re.a.number};var se=ce,le=function(e){var a=e.value,n=se(a),t=Object($.a)(n,2),i=t[0],o=t[1];return r.a.createElement(L.a,{edge:"end","aria-label":"copy",onClick:function(){return o(a)}},i?r.a.createElement(ne.a,null):r.a.createElement(ee.a,null))},ue=n(129),me=n(92),pe=n(228),de=function(e){var a=e.csvData,n=e.fileName;return r.a.createElement(pe.a,{variant:"contained",color:"secondary",onClick:function(){return function(e,a){var n={Sheets:{data:me.utils.json_to_sheet(e.map((function(e){return{NIF:e}})))},SheetNames:["data"]},t=me.write(n,{bookType:"xlsx",type:"array"}),r=new Blob([t],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});ue.saveAs(r,a+".xlsx")}(a,n)}},"Download")},fe=n(131),ve=n.n(fe),ge=n(229),he=n(230),Ee=n(238),be=n(235),ye=n(232),xe=n(231),Oe=n(233),we=n(130),je=n.n(we),Ne=[{name:"pessoa singular",value:"1"},{name:"pessoa singular",value:"2"},{name:"pessoa singular (a partir de julho de 2019)",value:"3"},{name:"pessoa singular",value:"38"},{name:"pessoa singular",value:"39"},{name:"pessoa singular n\xe3o residente",value:"45"},{name:"pessoa colectiva",value:"5"},{name:"administra\xe7\xe3o p\xfablica (Central, Regional ou Local)",value:"6"},{name:"pessoa colectiva n\xe3o residente",value:"71"},{name:"heran\xe7a indivisa",value:"70"},{name:"heran\xe7a indivisa",value:"74"},{name:"heran\xe7a indivisa",value:"75"},{name:"fundos de investimento",value:"72"},{name:"atribui\xe7\xe3o oficiosa",value:"77"},{name:"atribui\xe7\xe3o oficiosa n\xe3o residentes (processo VAT REFUND)",value:"78"},{name:"regime excepcional",value:"79"},{name:"empres\xe1rio em nome individual (extinto)",value:"8"},{name:"pessoa colectiva irregular ou n\xfamero provis\xf3rio",value:"9"},{name:"condominios e sociedades irregulares",value:"90"},{name:"condominios e sociedades irregulares",value:"91"},{name:"n\xe3o residentes sem estabelecimento est\xe1vel",value:"98"},{name:"sociedades civis sem personalidade jur\xeddica",value:"99"}],Ce=ve()((function(e){var a;return{mainContainer:{textAlign:"center"},image:{margin:"20px auto",width:"100px"},pageTitle:{margin:"10px auto"},formContainer:Object(O.a)({display:"flex",justifyContent:"center"},e.breakpoints.down("xs"),{flexDirection:"column"}),inputContainer:Object(O.a)({textAlign:"left"},e.breakpoints.down("xs"),{minWidth:"100%"}),typeContainer:Object(O.a)({},e.breakpoints.up("xs"),{minWidth:"340px"}),quantityContainer:(a={},Object(O.a)(a,e.breakpoints.up("xs"),{margin:"0 20px"}),Object(O.a)(a,e.breakpoints.down("xs"),{margin:"20px 0"}),a),resultContainer:{display:"flex",alignItems:"center",margin:"20px 0",flexDirection:"column"},resultList:{maxWidth:"250px"},nif:{marginRight:"20px"}}}))((function(e){var a=e.classes,n=Object(t.useState)({quantity:1,type:2}),i=Object($.a)(n,2),o=i[0],c=i[1],s=Object(t.useState)([]),l=Object($.a)(s,2),u=l[0],m=l[1];function p(e){c((function(a){return Object(w.a)({},a,Object(O.a)({},e.target.name,e.target.value))}))}return r.a.createElement(ge.a,{container:!0,spacing:2,className:a.mainContainer},r.a.createElement(ge.a,{item:!0,xs:12,className:a.header},r.a.createElement("img",{src:je.a,alt:"app icon",className:a.image}),r.a.createElement(D.a,{variant:"h4",className:a.pageTitle},"NIF Generator")),r.a.createElement(ge.a,{item:!0,xs:12,className:a.formContainer},r.a.createElement(he.a,{className:"".concat(a.inputContainer," ").concat(a.typeContainer)},r.a.createElement(Ee.a,{htmlFor:"type"},"Type"),r.a.createElement(be.a,{value:o.type,onChange:p,className:a.input,input:r.a.createElement(xe.a,{name:"type",id:"type"})},Ne.map((function(e){return r.a.createElement(ye.a,{key:e.value,value:e.value},"".concat(e.name," [").concat(e.value,"]"))})))),r.a.createElement(he.a,{className:"".concat(a.inputContainer," ").concat(a.quantityContainer)},r.a.createElement(Ee.a,{htmlFor:"quantity"},"Quantity"),r.a.createElement(be.a,{value:o.quantity,onChange:p,className:a.input,input:r.a.createElement(xe.a,{name:"quantity",id:"quantity"})},Object(Q.a)(Array(50)).map((function(e,a){return a++,r.a.createElement(ye.a,{key:a,value:a},a)})))),r.a.createElement(pe.a,{variant:"contained",color:"primary",onClick:function(){!function(){for(var e=[],a=0;a<o.quantity;a++){var n=K(o.type);e.push(n)}m((function(){return e}))}()},className:a.button},"Generate")),r.a.createElement(ge.a,{item:!0,xs:12,className:a.resultContainer},u&&u.length>0&&r.a.createElement(de,{csvData:u,fileName:"nif-list"}),r.a.createElement(G.a,{className:"".concat(a.resultList)},u.map((function(e){return r.a.createElement(U.a,{key:e},r.a.createElement(J.a,{primary:e,className:"".concat(a.nif)}),r.a.createElement(Oe.a,null,r.a.createElement(le,{value:e})))})))))})),ke=h()({palette:{primary:{light:"#33c9dc",main:"#00bcd4",dark:"#008394",contrastText:"#fff"},secondary:{light:"#ff6333",main:"#ff3d00",dark:"#b22a00",contrastText:"#fff"}},typography:{useNextVariants:!0}});f.a.initialize("UA-146599861-1"),Object(E.a)().listen((function(e){f.a.set({page:e.pathname}),f.a.pageview(e.pathname)}));var Se=function(e){function a(){return Object(c.a)(this,a),Object(l.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"componentDidMount",value:function(){f.a.pageview(window.location.pathname)}},{key:"render",value:function(){return r.a.createElement(v.a,{theme:ke},r.a.createElement(b.a,{store:x.a},r.a.createElement(p.a,{basename:"/"},r.a.createElement(z,null),r.a.createElement("div",{className:"container"},r.a.createElement(d.c,null,r.a.createElement(d.a,{exact:!0,path:"/",component:Ce}),r.a.createElement(d.a,{component:Ce}))))))}}]),a}(t.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Se,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},185:function(e,a,n){"use strict";n.r(a);var t=n(47),r=n(63),i=Object(t.b)({drawer:r.b}),o=Object(t.c)(i,{});a.default=o},63:function(e,a,n){"use strict";n.d(a,"a",(function(){return t})),n.d(a,"b",(function(){return s}));var t={};n.r(t),n.d(t,"OPEN",(function(){return r})),n.d(t,"CLOSE",(function(){return i}));var r="OPEN",i="CLOSE",o=n(36),c={width:240,open:!1};var s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,a=arguments.length>1?arguments[1]:void 0;switch(a.type){case r:return Object(o.a)({},e,{open:!0});case i:return Object(o.a)({},e,{open:!1});default:return e}}}},[[143,1,2]]]);
//# sourceMappingURL=main.4e86a1a0.chunk.js.map