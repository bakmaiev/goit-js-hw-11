// 'use strict';
import axios from 'axios';

export class PixabaiAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34958715-9ce4ce8564d7b2e391d81a960';

  page = 1;
  query = null;

  async fetchCard() {
    try {
      return axios.get(`${this.#BASE_URL}`, {
        params: {
          key: this.#API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: this.page,
          per_page: 40,
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
