import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

const fetchUsersBtn = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const textInput = document.querySelector('.text-input')
const modal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const loader = document.querySelector('.loader');
loader.style.display = 'none';

const buttonLoadMore = document.querySelector('.load-more')
buttonLoadMore.style.display = 'none';

let currentPage = 1;
let currentSearch = '';


fetchUsersBtn.addEventListener('submit', async (event) => {
  event.preventDefault();
  const usersValue = textInput.value;

  currentSearch = usersValue;

  gallery.innerHTML = '';
  textInput.value = '';
  loader.style.display = 'block';
  buttonLoadMore.style.display = 'none';

  try {
    const data = await fetchImages(currentSearch, 1);

    if (data.hits.length === 0) {
      showAlert('Sorry, there are no images matching your search query. Please try again!');
      return;
    }

    const imagesHTML = data.hits.reduce((html, image) => {
      return html + imageCard(image);
    }, '');

    gallery.innerHTML = imagesHTML;
    modal.refresh();

    updateLoadMoreButton(data.totalHits);

  } catch (error) {
    showAlert(error.toString());
  }
});

buttonLoadMore.addEventListener('click', async () => {
  loader.style.display = 'block';
  buttonLoadMore.style.display = 'none';

  try {
    const data = await fetchImages(currentSearch, currentPage + 1);

    loader.style.display = 'none';

    if (data.hits.length === 0) {
      showAlert('Sorry, there are no more images for your search query.');
      return;
    }

    const additionalImagesHTML = data.hits.reduce((html, image) => {
      return html + imageCard(image);
    }, '');

    gallery.innerHTML += additionalImagesHTML;
    modal.refresh();
    currentPage++;

    updateLoadMoreButton(data.totalHits);
    makeSmoothScrolling();

  } catch (error) {
    showAlert(error.toString());
  }
});

async function fetchImages(query, page) {
  const searchParams = new URLSearchParams({
    key: '41485835-9295c11e9848689b047a2c35a',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40
  });

  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);

  loader.style.display = 'none';

  if (response.status !== 200) {
    throw new Error(response.status);
  }

  return response.data;
}

function imageCard(images) {
  return `<li>
      <a href="${images.largeImageURL}">
        <img src="${images.webformatURL}" alt="${images.tags}">
      </a>
      <div class="info">
        <div class="image-info">
          <span>Likes</span>
          <span class="image-value">${images.likes}</span>
        </div>
        <div class="image-info">
          <span>Views</span>
          <span class="image-value">${images.views}</span>
        </div>
        <div class="image-info">
          <span>Comments</span>
          <span class="image-value">${images.comments}</span>
        </div>
        <div class="image-info">
          <span>Downloads</span>
          <span class="image-value">${images.downloads}</span>
        </div>
      </div>
    </li>`;
}

function showAlert(message) {
  iziToast.error({
    message: message,
    messageColor: '#FAFAFB',
    backgroundColor: '#EF4040',
    position: 'topRight'
  });
}

function updateLoadMoreButton(totalHits) {
  if (totalHits > currentPage * 40) {
    buttonLoadMore.style.display = 'block';
  } else {
    buttonLoadMore.style.display = 'none';
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
      messageColor: '#FAFAFB',
      backgroundColor: '#008CBA',
      position: 'topRight'
    });
  }
}

function makeSmoothScrolling() {
  const galleryItemHeight = document.querySelector('.gallery li').
    getBoundingClientRect().height;
  
  window.scrollBy({
    top: galleryItemHeight * 2,
    left: 0,
    behavior: 'smooth'
  });
}