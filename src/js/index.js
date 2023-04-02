'use strict';

import '../css/styles.css';
import Notiflix from 'notiflix';
import { PixabaiAPI, fetchGalleryCard } from './fetchGalleryCard';
import { createMarkup } from './createMarkup';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

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
    return Notiflix.Notify.success(`Done! We found '${seekedCard}'.`);
  } catch (err) {
    console.log;
  }
};

const handleloadMoreBtnEl = async e => {
  e.preventDefault();

  const seekedCard = searchFormEl.elements['searchQuery'].value;
  pixabaiAPI.query = seekedCard;
  pixabaiAPI.incrementPage();

  try {
    const { data } = await pixabaiAPI.fetchCard();

    // if (data.hits.length <= data.total) {
    //   loadMoreBtnEl.classList.add('visually-hidden');
    // }

    galleryListEl.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    return Notiflix.Notify.success(`Done! We found '${seekedCard}'.`);
  } catch (err) {
    console.log;
  }
};

searchFormEl.addEventListener('submit', handleSearchFormEl);
loadMoreBtnEl.addEventListener('click', handleloadMoreBtnEl);
