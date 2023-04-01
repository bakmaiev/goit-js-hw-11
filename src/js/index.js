'use strict';

import '../css/styles.css';
import Notiflix from 'notiflix';
import { fetchGalleryCard } from './fetchGalleryCard';
import { createMarkup } from './createMarkup';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');

const handleSearchFormEl = e => {
  e.preventDefault();
  const seekedCard = e.target.elements['searchQuery'].value;

  fetchGalleryCard(seekedCard)
    .then(response => {
      galleryListEl.innerHTML = createMarkup(response.data.hits);
    })
    .catch(console.log);
};

searchFormEl.addEventListener('submit', handleSearchFormEl);

// fetchGalleryCard(seekedCard)
//   .then(response => {
//     console.log(response.data.hits);
//     return response.data.hits;
//   })
//   .catch(console.log);
