'use strict';
import axios from 'axios';

//  Клас з параметрами запиту та методами для зипиту на сервер
export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '29947869-2a9890512044a26cd8ce610c4';

  constructor() {
    this.page = 1;
    this.per_page = 40;
    //   searchQuery будемо записувати в екземплярі при сабміті форми
    this.searchQuery = '';
  }

  //  Метод для запиту на сервер
  fetchPhotosByQuery() {
    //  Обєкт параметрів запиту
    const searchParams = {
      q: this.searchQuery,
      key: this.#API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    };

    //   Виводить результат запиту
    return axios.get(`${this.#BASE_URL}`, {
      params: searchParams,
    });
  }

  //   fetchRandomPhotos() {
  //     const searchParams = {
  //       orientation: 'portrait',
  //       count: 12,
  //       client_id: this.#API_KEY,
  //     };

  //     return axios.get(`${this.#BASE_URL}/photos/random`, {
  //       params: searchParams,
  //     });
  //   }
}
