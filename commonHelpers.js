import{a as w,i as d,s as L}from"./assets/vendor-dbdbd0f5.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const q=document.querySelector(".form"),u=document.querySelector("#input"),p=document.querySelector(".gallery"),i=document.querySelector(".loader"),l=document.querySelector(".load-more-btn");let c=1,y="";i.style.display="none";l.style.display="none";q.addEventListener("submit",async r=>{r.preventDefault(),y=u.value.trim(),p.innerHTML="",u.value="",i.style.display="block",c=1,l.style.display="none",await m()});l.addEventListener("click",async()=>{i.style.display="block",await m();const r=v();k(r*2)});async function m(){const r=new URLSearchParams({key:"41777094-15d23fa072ac8c02efe5e3565",q:y,image_type:"photo",orientation:"horizontal",safesearch:"true",page:c,per_page:40});try{const o=await w.get(`https://pixabay.com/api/?${r}`);if(!o.data.hits||!o.data.hits.length)d.error({message:"Sorry, there are no images matching your search query. Please try again!",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",messageSize:"16",titleSize:"16",position:"topRight",maxWidth:430});else{const a=o.data.hits.reduce((e,{webformatURL:t,largeImageURL:n,tags:g,likes:f,views:h,comments:b,downloads:S})=>e+`<li class="gallery-item">
          <a class="gallery-link" href="${n}">
            <img class="gallery-image" src="${t}" alt="${g}" />
          </a>          
          <div class="description">
            <p>Likes:<span>${f}</span></p>
            <p>Views:<span>${h}</span></p>
            <p>Comments:<span>${b}</span></p>
            <p>Downloads:<span>${S}</span></p>
          </div> 
        </li>`,"");p.innerHTML+=a,new L("ul.gallery a",{captionDelay:250,captionsData:"alt"}).refresh(),o.data.totalHits>c*40?l.style.display="block":(l.style.display="none",d.info({message:"We're sorry, but you've reached the end of search results.",messageColor:"#FAFAFB",backgroundColor:"#008CBA",position:"topRight"})),c++}}catch(o){i.style.display="none",console.log(o)}finally{i.style.display="none"}}function v(){const r=document.querySelector(".gallery-item");return r?r.getBoundingClientRect().height:0}function k(r){const o=performance.now(),a=600,s=e=>{const t=e-o;window.scrollBy({top:r*Math.sin(t/a*(Math.PI/2)),behavior:"smooth"}),t<a&&requestAnimationFrame(s)};requestAnimationFrame(s)}
//# sourceMappingURL=commonHelpers.js.map
