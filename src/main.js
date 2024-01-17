import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const searchForm = document.querySelector('.form');
const galleryContainer = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more-btn');

let searchParamsDefaults = {
  key: '41777094-15d23fa072ac8c02efe5e3565',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

let currentSearchQuery = '';
let lightbox;

function showLoaderAndHideGallery() {
  loaderElement.style.display = 'block';
  galleryContainer.style.display = 'none';
  loadMoreButton.style.display = 'none';
}

function hideLoaderAndShowGallery(hasMoreImages) {
  loaderElement.style.display = 'none';
  galleryContainer.style.display = 'flex';
  loadMoreButton.style.display = hasMoreImages ? 'block' : 'none';
}

function generateGalleryHTML(hits) {
  return hits.reduce((html, hit) => {
    const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = hit;
    return (
      html +
      `<li class="gallery-item">
        <a href=${largeImageURL}> 
          <img class="gallery-img" src=${webformatURL} alt=${tags} />
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${likes}</span></p>
          <p>views: <span class="text-value">${views}</span></p>
          <p>comments: <span class="text-value">${comments}</span></p>
          <p>downloads: <span class="text-value">${downloads}</span></p>
        </div>
      </li>`
    );
  }, '');
}

function renderGallery(hits) {
  const galleryHTML = generateGalleryHTML(hits);
  galleryContainer.innerHTML = galleryHTML;
}

function appendToGallery(hits) {
  const galleryHTML = generateGalleryHTML(hits);
  galleryContainer.insertAdjacentHTML('beforeend', galleryHTML);
  initializeImageLightbox();
}

function initializeImageLightbox() {
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      nav: true,
      captionDelay: 250,
      captionsData: 'alt',
      close: true,
      enableKeyboard: true,
      docClose: true,
    });
  }
  lightbox.refresh();
}

function handleNoResults() {
  galleryContainer.style.display = 'none';
  iziToast.error({
    position: 'topRight',
    color: 'red',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  });
}

async function searchImages(params, append = false) {
  if (!append) {
    showLoaderAndHideGallery();
    // Очистимо галерею та скинемо значення сторінки при новому пошуку
    galleryContainer.innerHTML = '';
    searchParamsDefaults.page = 1;
  }

  try {
    const response = await axios.get(`https://pixabay.com/api/?${params}`);
    hideLoaderAndShowGallery(response.data.hits.length >= searchParamsDefaults.per_page);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch images. Status: ${response.status}`);
    }

    const { hits } = response.data;

    if (hits.length > 0) {
      if (append) {
        appendToGallery(hits);
      } else {
        renderGallery(hits);
      }

      initializeImageLightbox();
    } else {
      handleNoResults();
    }

    // Перевірка чи достатньо зображень для показу кнопки "Load more"
    loadMoreButton.style.display = hits.length >= searchParamsDefaults.per_page ? 'block' : 'none';
  } catch (error) {
    console.error(error.message);
    iziToast.error({
      position: 'topRight',
      color: 'red',
      message: 'Failed to fetch images. Please try again!',
    });
  }
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchParamsDefaults.q = event.target.elements.search.value.trim();
  currentSearchQuery = searchParamsDefaults.q;

  // Скидаємо значення сторінки до 1 при новому пошуку
  searchParamsDefaults.page = 1;

  await searchImages(new URLSearchParams(searchParamsDefaults));

  // Перевірка на нуль перед викликом reset
  if (event.currentTarget) {
    event.currentTarget.reset();
  }
});

loadMoreButton.addEventListener('click', async () => {
  searchParamsDefaults.page++;
  await searchImages(new URLSearchParams(searchParamsDefaults), true);
});

loadMoreButton.style.display = 'none';