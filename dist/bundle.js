(()=>{"use strict";const e=(e,t,n="")=>(e.classList.add(t),e.textContent=n,function(e,t){e.append(t)}),t=e=>JSON.stringify(e),n=e=>JSON.parse(e),l=e=>{let t=new Date(e);const n=864e5;return Date.now()-e<n?"Сегодня, "+t.toLocaleTimeString(["ru-RU"],{hour:"2-digit",minute:"2-digit"}):Date.now()-e>n&&Date.now()-e<1728e5?"Вчера, "+t.toLocaleTimeString(["ru-RU"],{hour:"2-digit",minute:"2-digit"}):[t.toLocaleTimeString(["ru-RU"],{day:"numeric",month:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})]},o=e=>{let t=new Date,n=36e5*t.getHours()+6e4*t.getMinutes();return e.valueAsNumber-216e5+n};function a(e,t,n,l){let a=o(l);e.push({id:l.value?a:Date.now(),name:t.value,text:n.value,stamp:l.value?a:Date.now(),likedBy:[]})}function i(i,m,c){if(localStorage.getItem("comments")){let e=n(localStorage.getItem("comments"));a(e,i,m,c),localStorage.setItem("comments",t(e))}else{localStorage.setItem("comments","[]");let e=n(localStorage.getItem("comments"));a(e,i,m,c),localStorage.setItem("comments",t(e))}let u=document.createElement("li"),s=n(localStorage.getItem("comments"));u.commentId=s[s.length-1].id,e(u,"list__item")(r,u);let d=document.createElement("div");e(d,"item__name",i.value)(u,d);let g=document.createElement("div");e(g,"item__text",m.value)(u,g);let _=document.createElement("div");e(_,"item__info")(u,_);let v=document.createElement("div");e(v,"info__date",c.valueAsNumber?l(o(c)):l(Date.now()))(_,v);let f=document.createElement("div");e(f,"info__buttons")(_,f);let S=document.createElement("button");e(S,"buttons__like")(f,S);let E=document.createElement("span");e(E,"info__likes",0)(f,E);let h=document.createElement("button");e(h,"buttons__delete")(f,h)}function m(e,t){let n=document.querySelector("."+t.classList[0]),l=document.createElement("div");l.classList.add("validation-message"),l.textContent=e,0!=document.querySelectorAll(".validation-message").length?document.querySelector(".validation-message").remove():n.parentNode.insertBefore(l,n.nextSibling)}function c(){document.querySelector(".validation-message")&&document.querySelector(".validation-message").remove()}let r=document.querySelector(".comments__list");!function(){let e=document.querySelector(".comments__list"),l=document.querySelector(".form"),o=document.querySelector(".form__name"),a=document.querySelector(".form__text"),r=document.querySelector(".form__date"),u=document.querySelector(".form__submit");l.addEventListener("keydown",(e=>{if((e.target.classList.contains("form__name")||e.target.classList.contains("form__text")||e.target.classList.contains("form__date"))&&(l.addEventListener("change",(e=>c())),l.addEventListener("input",(e=>c())),"Enter"===e.key)){if(e.preventDefault(),o.value.length>0&&o.value.length<3)return void m("Имя должно содержать не менее 3 символов.",o);if(a.value.length>0&&a.value.length<10)return void m("Комментарий должен содержать не менее 10 символов.",a);if(0==o.value.length)return void m("Имя не может быть пустым.",o);0==a.value.length?m("Комментарий не может быть пустым.",a):(i(o,a,r),o.value="",a.value="",r.value="")}})),u.addEventListener("click",(e=>{l.addEventListener("change",(e=>c())),l.addEventListener("input",(e=>c())),e.preventDefault(),o.value.length>0&&o.value.length<3?m("Имя должно содержать не менее 3 символов.",o):a.value.length>0&&a.value.length<10?m("Комментарий должен содержать не менее 10 символов.",a):0!=o.value.length?0==a.value.length?m("Комментарий не может быть пустым.",a):(i(o,a,r),o.value="",a.value="",r.value=""):m("Имя не может быть пустым.",o)})),e.addEventListener("click",(function(e){if(e.target.classList.contains("buttons__delete")){let l=e.target.closest(".list__item");l.remove(),function(e){let l=n(localStorage.getItem("comments"));l=l.filter((t=>t.id!==e)),localStorage.setItem("comments",t(l))}(l.commentId)}})),e.addEventListener("click",(function(e){!function(e){e.target.classList.contains("buttons__like")&&(e.target.classList.toggle("like__active"),e.target.classList.contains("like__active")?e.target.nextSibling.textContent=Number(e.target.nextSibling.textContent)+1:e.target.nextSibling.textContent=Number(e.target.nextSibling.textContent)-1)}(e)}))}(),function(e){if(e&&e.length){let n=t(e);localStorage.setItem("comments",n)}else localStorage.clear()}([{id:1677853903e3,name:"cветлана",text:"Я, конечно, понимаю, что вам надо деньги зарабатывать, но нельзя же писать про шампуни!",stamp:1677853903e3,likedBy:["Skyler White","Saul Goodman","Jessie"]},{id:1678190743e3,name:"Игорь",text:"А что такого? Нормальный шампунь. Моя собака не жаловалась.",stamp:1678190743e3,likedBy:["Mike Ermantraut","Heisenberg","Tuco","Gus Fring"]},{id:1678255543e3,name:"cветлана",text:"Не знаю, юмор это или нет, мне всё равно! Так впаривать эту дрянь - возмутительно!",stamp:1678255543e3,likedBy:["Skyler White","Hector"]},{id:1678377943e3,name:"raygan228",text:"Кто-то тратит деньги на рекламу, а кого-то клиенты находят сами.",stamp:1678377943e3,likedBy:["Hank Schrader"]}]),localStorage.getItem("comments")&&function(t){for(let n of t){let t=document.createElement("li");t.commentId=n.stamp,e(t,"list__item")(r,t);let o=document.createElement("div");e(o,"item__name",n.name)(t,o);let a=document.createElement("div");e(a,"item__text",n.text)(t,a);let i=document.createElement("div");e(i,"item__info")(t,i);let m=document.createElement("div");e(m,"info__date",`${l(n.stamp)}`)(i,m);let c=document.createElement("div");e(c,"info__buttons")(i,c);let u=document.createElement("button");e(u,"buttons__like")(c,u);let s=document.createElement("span");e(s,"info__likes",n.likedBy.length)(c,s);let d=document.createElement("button");e(d,"buttons__delete")(c,d)}}(n(localStorage.getItem("comments")))})();