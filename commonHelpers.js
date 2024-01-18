import{S,i as n,a as f}from"./assets/vendor-bad0427b.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const h of o.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const y="41777094-15d23fa072ac8c02efe5e3565",q=document.querySelector(".search-form"),b=document.querySelector(".gallery"),L=new S(".gallery a",{captionsData:"alt",captionDelay:250}),p=document.querySelector(".loader"),g=document.querySelector(".load-more");let d=1,i=0,c="",l=0;p.style.display="none";g.classList.remove("visible");q.addEventListener("submit",I);g.addEventListener("click",P);async function I(t){if(t.preventDefault(),c=t.target.querySelector(".search-input").value.trim(),!c){n.warning({title:"Warning!",message:"Please enter image name!",position:"topRight"});return}x(),v(),u();try{const e=await f.get("https://pixabay.com/api/",{params:{key:y,q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,page:d,per_page:40}});m();const a=e.data;if(a.hits.length===0){n.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"});return}i=a.totalHits,l=a.hits.length,w(a.hits),L.refresh(),n.info({message:`We found ${i} images.`,position:"topRight"}),i>40&&E()}catch(e){console.error("Error fetching images:",e),m(),n.error({message:"Failed to fetch images. Please try again later.",position:"topRight"})}}function w(t){const e=document.createDocumentFragment();t.forEach(a=>{const s=k(a);e.appendChild(s)}),b.appendChild(e)}function k(t){const e=document.createElement("div");return e.classList.add("card"),e.innerHTML=`
    <a class="gallery-link" href="${t.largeImageURL}">
      <img class="card-image" src="${t.webformatURL}" alt="${t.tags}" loading="lazy">
    </a>
    <div class="card-info">
      <p class="card-text"><b>Likes:</b> ${t.likes}</p>
      <p class="card-text"><b>Views:</b> ${t.views}</p>
      <p class="card-text"><b>Comments:</b> ${t.comments}</p>
      <p class="card-text"><b>Downloads:</b> ${t.downloads}</p>
    </div>
  `,e}function x(){b.innerHTML="",d=1,u()}async function P(){v(),u();try{const t=await f.get("https://pixabay.com/api/",{params:{key:y,q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,page:d+1,per_page:40}});m();const e=t.data;if(e.hits.length===0)return;d++,l+e.hits.length>i&&(e.hits=e.hits.slice(0,i-l)),l+=e.hits.length,w(e.hits),L.refresh(),l>=i?(u(),n.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):E();const a=document.querySelectorAll(".card"),s=Array.from(a).slice(-40);s.length>0&&s[0].scrollIntoView({behavior:"smooth",block:"start"})}catch(t){console.error("Error fetching more images:",t),m(),n.error({message:"Failed to fetch more images. Please try again later.",position:"topRight"})}}function v(){p.style.display="block"}function m(){p.style.display="none"}function E(){g.style.display="block"}function u(){g.style.display="none"}
//# sourceMappingURL=commonHelpers.js.map