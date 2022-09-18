import './css/styles.css';
import { PixabayApi } from './js/pixabay';
import Notiflix from 'notiflix';
import galleryCard from './templates/gallery-card.hbs';

const searchFormEl = document.querySelector('#search-form');
const searchQueryEl = searchFormEl.querySelector('input[name="searchQuery"]');
const galleryListEl = document.querySelector('.gallery');
const scrollTargetEl = document.querySelector('.js-scroll-target');

// Створюємо екземплям класу
const pixabayApi = new PixabayApi();
// console.log(pixabayApi);

const options = {
  root: null,
  rootMargin: '0px 0px 400px 0px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(async entries => {
  if (entries[0].isIntersecting) {
    console.log('hollo');
    pixabayApi.page += 1;

    try {
      const { data } = await pixabayApi.fetchPhotosByQuery();

      if (pixabayApi.page >= data.totalHits / pixabayApi.per_page + 1) {
        observer.unobserve(scrollTargetEl);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      // додаємо до відмальованих картки через хенделбарс
      galleryListEl.insertAdjacentHTML('beforeend', galleryCard(data.hits));
    } catch (err) {
      console.log(err);
    }
  }
}, options);

// Викликаємо при сабміті, прослуховуємо Форму
const onsearchFormElSubmit = async evt => {
  evt.preventDefault();

  // записуємо searchQuery в екземпляр
  pixabayApi.searchQuery = evt.target.elements.searchQuery.value;

  // скидаємо лічильник в екземплярі при новому запиті (сабміті)
  pixabayApi.page = 1;

  // Викликаємо метод екземпляру для запиту на сервер
  try {
    const { data } = await pixabayApi.fetchPhotosByQuery();

    if (data.totalHits === 0) {
      galleryListEl.innerHTML = '';
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
    observer.observe(scrollTargetEl);
    const { height: cardHeight } =
      galleryListEl.firstElementChild.getBoundingClientRect();
    console.log(cardHeight);
    console.log(galleryListEl.firstElementChild.getBoundingClientRect());

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    console.dir(window.scrollBy);

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onsearchFormElSubmit);
