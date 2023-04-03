'use strict';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
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

const handleSearchFormEl = async e => {
  e.preventDefault();

  const seekedCard = e.target.elements['searchQuery'].value;
  pixabaiAPI.query = seekedCard;
  pixabaiAPI.resetPage();

  if (!seekedCard) {
    galleryListEl.innerHTML = '';
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
    galleryListEl.innerHTML = createMarkup(data.hits);
    loadMoreBtnEl.classList.remove('visually-hidden');
    pixabaiAPI.setTotal(data.totalHits);
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

  const seekedCard = searchFormEl.elements['searchQuery'].value;
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
  } catch (err) {
    console.log;
  }
};

searchFormEl.addEventListener('submit', handleSearchFormEl);
loadMoreBtnEl.addEventListener('click', handleloadMoreBtnEl);
