(function(win,doc){"use strict";this.ContextMenu=function(){var ContextMenu=function(opt_options){var defaults={width:150,default_items:!0};this.options=utils.mergeOptions(defaults,opt_options);var html=new ContextMenu.Html(this);html&&(this.container=html.container,ol.control.Control.call(this,{element:html.container}))};return ol.inherits(ContextMenu,ol.control.Control),ContextMenu.items=[],ContextMenu.prototype.setMap=function(map){ol.control.Control.prototype.setMap.call(this,map),this.setListeners()},ContextMenu.prototype.setListeners=function(){var coord_clicked,li,this_=this,map=this.getMap(),canvas=map.getTargetElement(),items_len=ContextMenu.items.length,i=-1,menu=function(evt){evt.stopPropagation(),evt.preventDefault(),this_.openMenu(map.getEventPixel(evt)),coord_clicked=map.getEventCoordinate(evt),canvas.addEventListener("mousedown",{handleEvent:function(evt){this_.closeMenu(),canvas.removeEventListener(evt.type,this,!1)}},!1)},getCoordinateClicked=function(){return coord_clicked};for(canvas.addEventListener("contextmenu",menu,!1);++i<items_len;)li=this.container.querySelector("#index"+ContextMenu.items[i].id),li&&"function"==typeof ContextMenu.items[i].callback&&!function(callback){li.addEventListener("click",function(evt){evt.preventDefault();var coord=getCoordinateClicked(),obj={coordinate:coord};this_.closeMenu(),callback(obj)},!1)}(ContextMenu.items[i].callback)},ContextMenu.prototype.openMenu=function(pixel){var map=this.getMap(),map_size=map.getSize(),menu_size=[this.container.offsetWidth,this.container.offsetHeight],map_width=map_size[0],map_height=map_size[1],menu_width=menu_size[0],menu_height=menu_size[1],height_left=map_height-pixel[1],width_left=map_width-pixel[0],top=0,left=0;top=height_left>=menu_height?pixel[1]-10:pixel[1]-menu_height-10,left=width_left>=menu_width?pixel[0]+5:pixel[0]-menu_width-5,utils.removeClass(this.container,"hidden"),this.container.style.left=left+"px",this.container.style.top=top+"px"},ContextMenu.prototype.closeMenu=function(){utils.addClass(this.container,"hidden")},function(ContextMenu){ContextMenu.Html=function(menu){return this.menu=menu,this.container=this.createMenu(),this},ContextMenu.Html.prototype={getMap:function(){return this.menu.getMap()},createMenu:function(){var this_=this,default_items=[{text:"Zoom In",classname:"zoom-in ol-contextmenu-icon",callback:function(obj){var map=this_.getMap(),view=map.getView(),pan=ol.animation.pan({duration:1e3,source:view.getCenter()}),zoom=ol.animation.zoom({duration:1e3,resolution:view.getResolution()});map.beforeRender(pan,zoom),view.setCenter(obj.coordinate),view.setZoom(+view.getZoom()+1)}},{text:"Zoom Out",classname:"zoom-out ol-contextmenu-icon",callback:function(obj){var map=this_.getMap(),view=map.getView(),pan=ol.animation.pan({duration:1e3,source:view.getCenter()}),zoom=ol.animation.zoom({duration:1e3,resolution:view.getResolution()});log(view.getZoom()),map.beforeRender(pan,zoom),view.setCenter(obj.coordinate),view.setZoom(+view.getZoom()-1)}}],options=this.menu.options,items=[],menu_html="";if("items"in options?items=options.default_items?options.items.concat(default_items):options.items:options.default_items&&(items=default_items),0==items.length)return!1;for(var item,classname,style,i=-1,len=items.length;++i<len;)item=items[i],style="","string"==typeof item?"-"==item.trim()&&(menu_html+='<li class="ol-menu-sep"><hr></li>'):(item.icon&&(item.classname+=" ol-contextmenu-icon",style=' style="background-image:url('+item.icon+')"'),classname=item.classname?' class="'+item.classname+'"':"",menu_html+='<li id="index'+i+'"'+style+classname+">"+item.text+"</li>",ContextMenu.items.push({id:i,callback:item.callback}));var container=utils.createElement(["ul",{classname:"ol-contextmenu ol-unselectable hidden"}],menu_html);return container.style.width=parseInt(options.width,10)+"px",container}}}(ContextMenu,win,doc),function(win,doc){ContextMenu.Utils={whiteSpaceRegex:/\s+/,to3857:function(coord){return ol.proj.transform([parseFloat(coord[0]),parseFloat(coord[1])],"EPSG:4326","EPSG:3857")},to4326:function(coord){return ol.proj.transform([parseFloat(coord[0]),parseFloat(coord[1])],"EPSG:3857","EPSG:4326")},classRegex:function(classname){return new RegExp("(^|\\s+)"+classname+"(\\s+|$)")},_addClass:function(el,c){el.classList?el.classList.add(c):el.className=(el.className+" "+c).trim()},addClass:function(el,classname){if(Array.isArray(el))return void el.forEach(function(each){utils.addClass(each,classname)});for(var array=Array.isArray(classname)?classname:classname.split(utils.whiteSpaceRegex),i=array.length;i--;)utils.hasClass(el,array[i])||utils._addClass(el,array[i])},_removeClass:function(el,c){el.classList?el.classList.remove(c):el.className=el.className.replace(utils.classReg(c)," ").trim()},removeClass:function(el,classname){if(Array.isArray(el))return void el.forEach(function(each){utils.removeClass(each,classname)});for(var array=Array.isArray(classname)?classname:classname.split(utils.whiteSpaceRegex),i=array.length;i--;)utils.hasClass(el,array[i])&&utils._removeClass(el,array[i])},hasClass:function(el,c){return el.classList?el.classList.contains(c):utils.classReg(c).test(el.className)},toggleClass:function(el,c){return Array.isArray(el)?void el.forEach(function(each){utils.toggleClass(each,c)}):void(el.classList?el.classList.toggle(c):utils.hasClass(el,c)?utils._removeClass(el,c):utils._addClass(el,c))},$:function(id){return id="#"===id[0]?id.substr(1,id.length):id,doc.getElementById(id)},isElement:function(obj){return"HTMLElement"in win?!!obj&&obj instanceof HTMLElement:!!obj&&"object"==typeof obj&&1===obj.nodeType&&!!obj.nodeName},getAllChildren:function(node,tag){return[].slice.call(node.getElementsByTagName(tag))},emptyArray:function(array){for(;array.length;)array.pop()},removeAllChildren:function(node){for(;node.firstChild;)node.removeChild(node.firstChild)},removeAll:function(collection){for(var node;node=collection[0];)node.parentNode.removeChild(node)},getChildren:function(node,tag){return[].filter.call(node.childNodes,function(el){return tag?1==el.nodeType&&el.tagName.toLowerCase()==tag:1==el.nodeType})},template:function(html,row){var this_=this;return html.replace(/\{ *([\w_-]+) *\}/g,function(html,key){var value=void 0===row[key]?"":row[key];return this_.htmlEscape(value)})},htmlEscape:function(str){return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},mergeOptions:function(obj1,obj2){var obj3={};for(var attrname in obj1)obj3[attrname]=obj1[attrname];for(var attrname in obj2)obj3[attrname]=obj2[attrname];return obj3},createElement:function(node,html){var elem;if(Array.isArray(node)){if(elem=doc.createElement(node[0]),node[1].id&&(elem.id=node[1].id),node[1].classname&&(elem.className=node[1].classname),node[1].attr){var attr=node[1].attr;if(Array.isArray(attr))for(var i=-1;++i<attr.length;)elem.setAttribute(attr[i].name,attr[i].value);else elem.setAttribute(attr.name,attr.value)}}else elem=doc.createElement(node);elem.innerHTML=html;for(var frag=doc.createDocumentFragment();elem.childNodes[0];)frag.appendChild(elem.childNodes[0]);return elem.appendChild(frag),elem}}}(win,doc),ContextMenu}();var log=function(m){console.info(m)},utils=ContextMenu.Utils}).call(this,window,document);