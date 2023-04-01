// 'use strict';
import axios from 'axios';

export function fetchGalleryCard(seekedCard) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '34958715-9ce4ce8564d7b2e391d81a960';

  let page = 1;

  return axios.get(`${BASE_URL}`, {
    params: {
      key: `${API_KEY}`,
      q: `${seekedCard}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page,
      per_page: 40,
    },
  });
}

// export class PixabaiAPI {
//   #BASE_URL = 'https://pixabay.com/api/';
//   #API_KEY = '34958715-9ce4ce8564d7b2e391d81a960';

//   page = 1;

//   fetchCard() {
//     return axios.get(
//       `${this.#BASE_URL}?key=${
//         this.#API_KEY
//       }$q=${seekedCard}$image_type=photo&orientation=horizontal&safesearch=true`
//     );
//   }
// }

//   return fetch(
//     `${BASE_URL}?key=${API_KEY}$q=${seekedCard}&image_type=photo&orientation=horizontal&safesearch=true`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
