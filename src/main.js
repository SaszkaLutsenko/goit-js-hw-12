'use strict';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.form');
const input = document.querySelector('#input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');
let currentPage = 1;
let searchQuery = '';

loader.style.display = 'none';
loadMoreBtn.style.display = 'none';

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = input.value.trim();
  gallery.innerHTML = '';
  input.value = '';
  loader.style.display = 'block';
  currentPage = 1;
  loadMoreBtn.style.display = 'none';

  await performSearch();
});

loadMoreBtn.addEventListener('click', async () => {
  loader.style.display = 'block';
  await performSearch();

  const cardHeight = getGalleryCardHeight();
  smoothScrollBy(cardHeight * 2);
});

async function performSearch() {
  const searchParams = new URLSearchParams({
    key: '41777094-15d23fa072ac8c02efe5e3565',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: 40,
  });

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );

    if (!response.data.hits || !response.data.hits.length) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        theme: 'dark',
        backgroundColor: '#EF4040',
        titleColor: 'white',
        messageSize: '16',
        titleSize: '16',
        position: 'topRight',
        maxWidth: 430,
      });
    } else {
      const imgs = response.data.hits.reduce(
        (
          html,
          {
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }
        ) =>
          html +
          `<li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
          </a>          
          <div class="description">
            <p>Likes:<span>${likes}</span></p>
            <p>Views:<span>${views}</span></p>
            <p>Comments:<span>${comments}</span></p>
            <p>Downloads:<span>${downloads}</span></p>
          </div> 
        </li>`,
        ''
      );

      gallery.innerHTML += imgs;

      let modal = new simpleLightbox('ul.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
      });

      modal.refresh();

      // Display Load More button if there are more pages
      if (response.data.totalHits > currentPage * 40) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
        
      
          iziToast.info({
             message: "We're sorry, but you've reached the end of search results.",
             messageColor: '#FAFAFB',
             backgroundColor: '#008CBA',
              position: 'topRight'
          });
        
      }
      currentPage++;
    }

    
  } catch (err) {
    loader.style.display = 'none';
    console.log(err);
  } finally {
    loader.style.display = 'none';
  }
}

function getGalleryCardHeight() {
  const galleryCard = document.querySelector('.gallery-item');
  const cardHeight = galleryCard
    ? galleryCard.getBoundingClientRect().height
    : 0;
  return cardHeight;
}

function smoothScrollBy(distance) {
  const initialTime = performance.now();
  const duration = 600; // Set your preferred duration (in milliseconds)
  const scroll = currentTime => {
    const elapsedTime = currentTime - initialTime;
    window.scrollBy({
      top: distance * Math.sin((elapsedTime / duration) * (Math.PI / 2)),
      behavior: 'smooth',
    });
    if (elapsedTime < duration) {
      requestAnimationFrame(scroll);
    }
  };
  requestAnimationFrame(scroll);
}