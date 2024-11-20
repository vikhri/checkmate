export default class Slider {
  constructor(sliderSelector) {
    this.slider = document.getElementById(sliderSelector);
    this.sliderContainer = this.slider.querySelector('.slider-container');
    this.slides = this.slider.querySelectorAll('.slide');
    this.slidesPerView = 2;
    this.gap = 20;
    this.numberOfViews = Math.ceil(this.slides.length / this.slidesPerView);
    this.prevButton = this.slider.querySelector('.pagination__button.prev');
    this.nextButton = this.slider.querySelector('.pagination__button.next');
    this.pagesContainer = this.slider.querySelector('.pages');
    this.currentIndex = 0;
    this.blockWidth = 0;

    // Ссылки на обработчики событий
    this.prevClickHandler = null;
    this.nextClickHandler = null;
  }

  setParameters(slidesPerView, gap) {
    this.gap = gap;
    this.slidesPerView = slidesPerView;
  }

  updateSlideWidth() {
    this.blockWidth = (this.slider.offsetWidth - ((this.slidesPerView - 1) * this.gap)) / this.slidesPerView;

    // Обновляем ширину каждого слайда
    this.slides.forEach((block) => {
      block.style.width = `${this.blockWidth}px`;
      block.style.marginRight = `${this.gap}px`;
    });
  }

  updateSlidesPerView() {
    if (window.innerWidth < 768) {
      this.slidesPerView = 1; // Устанавливаем 1 слайд на экран для узких экранов
    } else {
      this.slidesPerView = 2;
    }
    this.numberOfViews = Math.ceil(this.slides.length / this.slidesPerView);
    this.updateSlideWidth(); // Обновляем ширину слайдов
    this.updateCarousel();   // Обновляем положение слайдов
  }

  init() {
    this.updateSlidesPerView();

    this.sliderContainer.style.display = 'flex';
    this.sliderContainer.style.transition = 'transform 0.3s ease-in-out';

    // Создание пагинации
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex === this.numberOfViews;

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('pagination__dot');
      if (index === this.currentIndex) dot.classList.add('active');
      dot.dataset.index = index;
      this.pagesContainer.appendChild(dot);

      dot.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateCarousel();
      });
    });

    // Сохраняем обработчики для последующего удаления
    this.prevClickHandler = () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateCarousel();
      }
    };
    this.nextClickHandler = () => {
      if (this.currentIndex < this.numberOfViews) {
        this.currentIndex++;
        this.updateCarousel();
      }
    };

    this.prevButton.addEventListener('click', this.prevClickHandler);
    this.nextButton.addEventListener('click', this.nextClickHandler);
  }

  updateCarousel() {
    this.sliderContainer.style.transform = `translateX(-${this.currentIndex * (this.blockWidth + this.gap)}px)`;

    // Обновление активной точки
    document.querySelectorAll('.pagination__dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    // Управление доступностью кнопок
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex >= this.slides.length - this.slidesPerView;
  }

  destroy() {
    // Удаляем обработчики событий
    this.prevButton.removeEventListener('click', this.prevClickHandler);
    this.nextButton.removeEventListener('click', this.nextClickHandler);

    // Удаляем точки пагинации
    while (this.pagesContainer.firstChild) {
      this.pagesContainer.removeChild(this.pagesContainer.firstChild);
    }

    // Сбрасываем стили слайдов
    this.slides.forEach((block) => {
      block.style.width = '';
      block.style.marginRight = '';
    });

    // Сбрасываем стили контейнера
    this.sliderContainer.style.display = '';
    this.sliderContainer.style.transition = '';
    this.sliderContainer.style.transform = '';
  }
}
