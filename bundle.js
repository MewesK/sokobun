!function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=1)}([function(e,t,i){},function(e,t,i){"use strict";i.r(t);var n=i.p+"ff4468631e47aacb9d24074dd1bde42f.png",r=i.p+"64f4fa35cb4cf5b04ef6b200160e740a.png";function o(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var a=function e(t,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o(this,"src",void 0),o(this,"image",void 0),this.src=t,this.image=i};function s(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var c=function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),s(this,"cache",void 0),s(this,"load",(function(e){return new Promise((function(i){var n=e.length;e.forEach((function(e){var r=new Image;r.addEventListener("load",(function(){0==--n&&(console.log("Resources finished loading..."),i())}),!1),r.src=e,t.cache.push(new a(e,r))}))}))})),s(this,"get",(function(e){var i=t.cache.find((function(t){return t.src===e}));if(void 0===i)throw new Error;return i})),this.cache=[]};function u(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var h=function e(t,i,n,r,o){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),u(this,"resource",void 0),u(this,"x",void 0),u(this,"y",void 0),u(this,"width",void 0),u(this,"height",void 0),this.resource=t,this.x=i,this.y=n,this.width=r,this.height=o};function l(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var d=function e(t,i,n){var r=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),l(this,"tileTable",void 0),l(this,"get",(function(e,t){return r.tileTable[e][t]}));var o=t.image.width/n,a=t.image.height/i;this.tileTable=[];for(var s=0;s<i;s++){this.tileTable[s]=[];for(var c=0;c<n;c++)this.tileTable[s][c]=new h(t,c*o,s*a,o,a)}};function p(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var f=function e(t){var i=this;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),p(this,"actionList",void 0),p(this,"x",void 0),p(this,"y",void 0),p(this,"action",void 0),p(this,"direction",void 0),p(this,"timer",void 0),p(this,"setAction",(function(e){if(i.action!==e){if(void 0===i.actionList[e])throw new Error("Invalid direction");i.timer=0,i.action=e}})),p(this,"setDirection",(function(e){if(i.direction!==e){if(void 0===i.actionList[i.action].directionList[e])throw new Error("Invalid direction");i.timer=0,i.direction=e}})),p(this,"update",(function(e){i.timer+=e,i.timer>=i.actionList[i.action].duration&&(i.timer=0)})),p(this,"getTile",(function(){var e=i.actionList[i.action],t=e.directionList[i.direction];return t[Math.floor(i.timer/(e.duration/t.length))]})),0===Object.keys(t).length)throw new Error("There must be at least one action.");this.actionList=t,this.x=0,this.y=0,this.action=Object.keys(this.actionList)[0],this.direction=Object.keys(this.actionList[this.action].directionList)[0],this.timer=0};function g(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var b=function e(t,i){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),g(this,"directionList",void 0),g(this,"duration",void 0),0===Object.keys(t).length)throw new Error("There must be at least one action.");this.directionList=t,this.duration=i};function w(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}i(0);new function e(t,i,o){var a=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),w(this,"resourceLoader",void 0),w(this,"canvas",void 0),w(this,"context",void 0),w(this,"spriteMap",void 0),w(this,"tileMap",void 0),w(this,"lastTime",0),w(this,"gameTime",0),w(this,"bunnie",void 0),w(this,"loop",(function(){var e=Date.now(),t=(e-a.lastTime)/1e3;a.gameTime+=t;var i,n,r=a.bunnie.getTile();if("walk"===a.bunnie.action)switch(a.bunnie.direction){case"down":(n=a.bunnie.y+Math.round(150*t))+2*r.height<=a.canvas.height&&(a.bunnie.y=n);break;case"up":(n=a.bunnie.y-Math.round(150*t))>=0&&(a.bunnie.y=n);break;case"left":(i=a.bunnie.x-Math.round(150*t))>=0&&(a.bunnie.x=i);break;case"right":(i=a.bunnie.x+Math.round(150*t))+2*r.width<=a.canvas.width&&(a.bunnie.x=i)}a.context.clearRect(0,0,a.canvas.width,a.canvas.height),a.context.drawImage(r.resource.image,r.x,r.y,r.width,r.height,a.bunnie.x,a.bunnie.y,2*r.width,2*r.height),a.bunnie.update(t),a.lastTime=e,window.requestAnimationFrame(a.loop)})),console.log("Initializing game..."),this.canvas=t,this.canvas.width=i,this.canvas.height=o;var s=this.canvas.getContext("2d");if(null===s)throw new Error("2D context not supported");this.context=s,this.context.imageSmoothingEnabled=!1,this.resourceLoader=new c,this.resourceLoader.load([n,r]).then((function(){a.spriteMap=new d(a.resourceLoader.get(n),4,6),a.tileMap=new d(a.resourceLoader.get(r),14,22),a.bunnie=new f({stand:new b({up:[a.spriteMap.get(2,0)],down:[a.spriteMap.get(3,0)],left:[a.spriteMap.get(0,0)],right:[a.spriteMap.get(1,0)]},1),walk:new b({up:[a.spriteMap.get(2,1),a.spriteMap.get(2,0),a.spriteMap.get(2,2),a.spriteMap.get(2,0)],down:[a.spriteMap.get(3,1),a.spriteMap.get(3,0),a.spriteMap.get(3,2),a.spriteMap.get(3,0)],left:[a.spriteMap.get(0,1),a.spriteMap.get(0,0),a.spriteMap.get(0,2),a.spriteMap.get(0,0)],right:[a.spriteMap.get(1,1),a.spriteMap.get(1,0),a.spriteMap.get(1,2),a.spriteMap.get(1,0)]},.6),push:new b({up:[a.spriteMap.get(2,3),a.spriteMap.get(2,2),a.spriteMap.get(2,4),a.spriteMap.get(2,2)],down:[a.spriteMap.get(3,3),a.spriteMap.get(3,2),a.spriteMap.get(3,4),a.spriteMap.get(3,2)],left:[a.spriteMap.get(0,3),a.spriteMap.get(0,2),a.spriteMap.get(0,4),a.spriteMap.get(0,2)],right:[a.spriteMap.get(1,3),a.spriteMap.get(1,2),a.spriteMap.get(1,4),a.spriteMap.get(1,2)]},.6)}),a.bunnie.setAction("stand"),a.bunnie.setDirection("down"),console.log("Starting game loop..."),a.lastTime=Date.now(),a.loop()}));var u={};document.addEventListener("keydown",(function(e){switch(e.code){case"KeyS":case"ArrowDown":u[e.code]=!0,a.bunnie.setAction("walk"),a.bunnie.setDirection("down");break;case"KeyW":case"ArrowUp":u[e.code]=!0,a.bunnie.setAction("walk"),a.bunnie.setDirection("up");break;case"KeyA":case"ArrowLeft":u[e.code]=!0,a.bunnie.setAction("walk"),a.bunnie.setDirection("left");break;case"KeyD":case"ArrowRight":u[e.code]=!0,a.bunnie.setAction("walk"),a.bunnie.setDirection("right")}})),document.addEventListener("keyup",(function(e){u[e.code]=!1,Object.values(u).every((function(e){return!1===e}))&&a.bunnie.setAction("stand")}))}(document.getElementById("game"),512,448)}]);