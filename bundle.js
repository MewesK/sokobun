!function(t){var i={};function e(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,e),r.l=!0,r.exports}e.m=t,e.c=i,e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,i){if(1&i&&(t=e(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var r in t)e.d(n,r,function(i){return t[i]}.bind(null,r));return n},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="",e(e.s=0)}([function(t,i,e){"use strict";e.r(i);var n=e.p+"12c3d9fceaec0f8f5bad1537a060f00d.png",r=e.p+"64f4fa35cb4cf5b04ef6b200160e740a.png";function o(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var a=function t(i,e){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),o(this,"src",void 0),o(this,"image",void 0),this.src=i,this.image=e};function s(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var c=function t(){var i=this;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),s(this,"cache",void 0),s(this,"load",(function(t){return new Promise((function(e){var n=t.length;t.forEach((function(t){var r=new Image;r.onload=function(){0==--n&&e()},r.src=t,i.cache.push(new a(t,r))}))}))})),s(this,"get",(function(t){var e=i.cache.find((function(i){return i.src===t}));if(void 0===e)throw new Error;return e})),this.cache=[]};function h(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var u=function t(i,e,n,r,o){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),h(this,"resource",void 0),h(this,"x",void 0),h(this,"y",void 0),h(this,"width",void 0),h(this,"height",void 0),this.resource=i,this.x=e,this.y=n,this.width=r,this.height=o};function l(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var f=function t(i,e,n){var r=this;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),l(this,"tileTable",void 0),l(this,"get",(function(t,i){return r.tileTable[t][i]}));var o=i.image.width/n,a=i.image.height/e;this.tileTable=[];for(var s=0;s<e;s++){this.tileTable[s]=[];for(var c=0;c<n;c++)this.tileTable[s][c]=new u(i,c*o,s*a,o,a)}};function d(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var p=function t(i){var e=this;if(function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),d(this,"actionList",void 0),d(this,"x",void 0),d(this,"y",void 0),d(this,"action",void 0),d(this,"direction",void 0),d(this,"timer",void 0),d(this,"setAction",(function(t){if(void 0===e.actionList[t])throw new Error("Invalid direction");e.timer=0,e.action=t})),d(this,"setDirection",(function(t){if(void 0===e.actionList[e.action].directionList[t])throw new Error("Invalid direction");e.timer=0,e.direction=t})),d(this,"update",(function(t){e.timer+=t,e.timer>=e.actionList[e.action].duration&&(e.timer=0)})),d(this,"getTile",(function(){var t=e.actionList[e.action],i=t.directionList[e.direction];return i[Math.floor(e.timer/(t.duration/i.length))]})),0===Object.keys(i).length)throw new Error("There must be at least one action.");this.actionList=i,this.x=0,this.y=0,this.action=Object.keys(this.actionList)[0],this.direction=Object.keys(this.actionList[this.action].directionList)[0],this.timer=0};function v(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var b=function t(i,e){if(function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),v(this,"directionList",void 0),v(this,"duration",void 0),0===Object.keys(i).length)throw new Error("There must be at least one action.");this.directionList=i,this.duration=e};function g(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var w=document.createElement("canvas");new function t(i,e,o){var a=this;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),g(this,"resourceLoader",void 0),g(this,"canvas",void 0),g(this,"context",void 0),g(this,"spriteMap",void 0),g(this,"tileMap",void 0),g(this,"lastTime",0),g(this,"gameTime",0),g(this,"bunnie",void 0),g(this,"loop",(function(){var t=Date.now(),i=(t-a.lastTime)/1e3;a.gameTime+=i,a.context.clearRect(0,0,a.canvas.width,a.canvas.height);var e=a.bunnie.getTile();a.context.drawImage(e.resource.image,e.x,e.y,e.width,e.height,a.bunnie.x,a.bunnie.y,2*e.width,2*e.height),"right"===a.bunnie.direction?(a.bunnie.x+=2,a.bunnie.x+2*e.width>=a.canvas.width&&a.bunnie.setDirection("left")):(a.bunnie.x-=2,a.bunnie.x<=0&&a.bunnie.setDirection("right")),a.bunnie.update(i),a.lastTime=t,window.requestAnimationFrame(a.loop)})),this.canvas=i,this.canvas.width=e,this.canvas.height=o;var s=this.canvas.getContext("2d");if(null===s)throw new Error("2D context not supported");this.context=s,this.context.imageSmoothingEnabled=!1,this.resourceLoader=new c,this.resourceLoader.load([n,r]).then((function(){console.log("Starting game loop..."),a.lastTime=Date.now(),a.loop()})),this.spriteMap=new f(this.resourceLoader.get(n),4,4),this.tileMap=new f(this.resourceLoader.get(r),14,22),this.bunnie=new p({stand:new b({up:[this.spriteMap.get(2,0)],down:[this.spriteMap.get(3,0)],left:[this.spriteMap.get(0,0)],right:[this.spriteMap.get(1,0)]},1),walk:new b({up:[this.spriteMap.get(2,1),this.spriteMap.get(2,0)],down:[this.spriteMap.get(3,1),this.spriteMap.get(3,0)],left:[this.spriteMap.get(0,1),this.spriteMap.get(0,0)],right:[this.spriteMap.get(1,1),this.spriteMap.get(1,0)]},.5),push:new b({up:[this.spriteMap.get(2,3),this.spriteMap.get(2,2)],down:[this.spriteMap.get(3,3),this.spriteMap.get(3,2)],left:[this.spriteMap.get(0,3),this.spriteMap.get(0,2)],right:[this.spriteMap.get(1,3),this.spriteMap.get(1,2)]},.5)}),this.bunnie.setAction("walk"),this.bunnie.setDirection("left")}(w,512,448),document.body.appendChild(w)}]);