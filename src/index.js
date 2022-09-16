import './css/styles.css';
import { PixabayApi } from './js/pixabay';
import Notiflix from 'notiflix';
import galleryCard from './templates/gallery-card.hbs';

// const DEBOUNCE_DELAY = 300;

const searchFormEl = document.querySelector('#search-form');
const searchQueryEl = searchFormEl.querySelector('input[name="searchQuery"]');
const btnSubmitEl = searchFormEl.querySelector('button');
const galleryListEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

// Створюємо екземплям класу
const pixabayApi = new PixabayApi();
// console.log(pixabayApi);

// Викликаємо при кліку на кнопку load-more
const onLoadMoreBtnElClick = evt => {
  pixabayApi.page += 1;
  pixabayApi
    .fetchPhotosByQuery()
    .then(response => {
      // деструктуризую дані з response
      const { data } = response;
      console.log(
        `${pixabayApi.page} <= ${data.totalHits / pixabayApi.per_page}`
      );
      console.log(`pixabayApi.page - ${pixabayApi.page}`);
      console.log(
        `data.totalHits / pixabayApi.per_page - ${
          data.totalHits / pixabayApi.per_page
        }`
      );
      if (pixabayApi.page >= data.totalHits / pixabayApi.per_page) {
        loadMoreEl.classList.add('is-hidden');
        loadMoreEl.removeEventListener('click', onLoadMoreBtnElClick);
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
      // додаємо до відмальованих картки через хенделбарс
      galleryListEl.insertAdjacentHTML('beforeend', galleryCard(data.hits));
    })
    .catch(err => {
      console.log(err);
    });
};

// Викликаємо при сабміті, прослуховуємо Форму
const onsearchFormElSubmit = evt => {
  evt.preventDefault();

  loadMoreEl.classList.add('is-hidden');
  loadMoreEl.removeEventListener('click', onLoadMoreBtnElClick);

  // записуємо searchQuery в екземпляр
  pixabayApi.searchQuery = evt.target.elements.searchQuery.value;

  // скидаємо лічильник в екземплярі при новому запиті (сабміті)
  pixabayApi.page = 1;

  // Викликаємо метод екземпляру для запиту на сервер
  pixabayApi
    .fetchPhotosByQuery()
    .then(response => {
      // деструктуризую дані з response
      const { data } = response;
      console.log(response);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (pixabayApi.page >= data.totalHits / pixabayApi.per_page) {
        // Якщо ТІЛЬКИ одна сторінка то тільки відмальовуємо, (is-hidden не знімаємо)
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        return (galleryListEl.innerHTML = galleryCard(data.hits));
      }
      // відмальовую картки через хенделбарс
      galleryListEl.innerHTML = galleryCard(data.hits);
      // показати кнопку
      loadMoreEl.classList.remove('is-hidden');
      // прослуховування на кнопку load-more
      loadMoreEl.addEventListener('click', onLoadMoreBtnElClick);

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    })
    .catch(err => {
      console.log(err);
    });

  //   console.log(pixabayApi);
};

searchFormEl.addEventListener('submit', onsearchFormElSubmit);
