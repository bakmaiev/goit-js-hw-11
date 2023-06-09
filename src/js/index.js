'use strict';
import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import InfiniteScroll from 'infinite-scroll';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';

import { PixabaiAPI } from './fetchGalleryCard';
import { createMarkup } from './createMarkup';

const lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 250 });

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.classList.add('visually-hidden');

const pixabaiAPI = new PixabaiAPI();

// --- First variant without infinit scrool ---

const handleSearchFormEl = async e => {
  e.preventDefault();
  resetGalleryMarkup();

  const seekedCard = e.target.elements['searchQuery'].value.trim();
  pixabaiAPI.query = seekedCard.trim();
  pixabaiAPI.resetPage();

  if (!seekedCard) {
    return Notiflix.Notify.failure('Enter something.');
  }

  try {
    const { data } = await pixabaiAPI.fetchCard();
    if (!data.hits.length) {
      galleryListEl.innerHTML = '';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    galleryListEl.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    loadMoreBtnEl.classList.remove('visually-hidden');
    pixabaiAPI.setTotal(data.totalHits);
    lightbox.refresh();
    return Notiflix.Notify.success(`Done! We found ${data.totalHits} images.`);
  } catch (err) {
    console.log;
  } finally {
    if (!pixabaiAPI.hasMoreImages()) {
      loadMoreBtnEl.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
};

const handleloadMoreBtnEl = async e => {
  e.preventDefault();

  const seekedCard = searchFormEl.elements['searchQuery'].value.trim();
  pixabaiAPI.query = seekedCard;
  pixabaiAPI.incrementPage();

  if (!pixabaiAPI.hasMoreImages()) {
    loadMoreBtnEl.classList.add('visually-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  try {
    const { data } = await pixabaiAPI.fetchCard();
    galleryListEl.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    lightbox.refresh();
    pageScrolling();
  } catch (err) {
    console.log;
  }
};

const resetGalleryMarkup = () => {
  galleryListEl.innerHTML = '';
  loadMoreBtnEl.classList.add('visually-hidden');
};

const pageScrolling = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchFormEl.addEventListener('submit', handleSearchFormEl);
loadMoreBtnEl.addEventListener('click', handleloadMoreBtnEl);

// --- Second variant with infinit scroll ---

// const handleSearchFormEl = e => {
//   e.preventDefault();
//   resetGalleryMarkup();

//   const seekedCard = searchFormEl.elements['searchQuery'].value.trim();
//   pixabaiAPI.query = seekedCard;
//   pixabaiAPI.resetPage();

//   if (!seekedCard) {
//     return Notiflix.Notify.failure('Enter something.');
//   }

//   fetchImages();
// };

// const fetchImages = async () => {
//   try {
//     const { data } = await pixabaiAPI.fetchCard();
//     if (!data.total) {
//       return Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//     if (pixabaiAPI.page === 1) {
//       Notiflix.Notify.success(`Done! We found ${data.totalHits} images.`);
//     } else if (!pixabaiAPI.hasMoreImages()) {
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }

//     galleryListEl.insertAdjacentHTML('beforeend', createMarkup(data.hits));
//     pixabaiAPI.setTotal(data.totalHits);
//     pixabaiAPI.incrementPage();
//     lightbox.refresh();
//   } catch (err) {
//     console.log;
//   }
// };

// const resetGalleryMarkup = () => {
//   galleryListEl.innerHTML = '';
// };

// async function checkPosition() {
//   const height = document.body.offsetHeight;
//   const screenHeight = window.innerHeight;
//   const scrolled = window.scrollY;
//   const threshold = height - screenHeight / 4;
//   const position = scrolled + screenHeight;

//   if (position >= threshold) {
//     fetchImages();
//   }
// }

// searchFormEl.addEventListener('submit', handleSearchFormEl);

// (() => {
//   window.addEventListener('scroll', throttle(checkPosition, 250));
//   window.addEventListener('resize', throttle(checkPosition, 250));
// })();
