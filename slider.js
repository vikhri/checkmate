export default class Slider {
  constructor(sliderSelector, config, loop = false) {
    this.config = config;
    this.loop = loop;
    this.slider = document.getElementById(sliderSelector);
    this.sliderContainer = this.slider.querySelector('.slider-container');
    this.slides = [...this.slider.querySelectorAll('.slide')];
    this.slidesPerView = 2;
    this.gap = 20;
    this.numberOfViews = this.slides.length - this.slidesPerView + 1;
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
    const breakpoints = this.config.breakpoints;

    const matchingBreakpoint = breakpoints.find((bp) => window.innerWidth < bp.width) || breakpoints[breakpoints.length - 1];

    this.slidesPerView = matchingBreakpoint.slidesPerView;
    this.numberOfViews = this.slides.length - this.slidesPerView + 1;

    this.updateSlideWidth();
    this.updatePages();
    this.updateSliderView();
  }

  addClones() {
    if (this.loop && !this.clonesAdded) {
      const firstClones = this.slides.slice(0, this.slidesPerView).map((slide) => slide.cloneNode(true));
      const lastClones = this.slides.slice(-this.slidesPerView).map((slide) => slide.cloneNode(true));

      // Добавляем клоны
      firstClones.forEach((clone) => this.sliderContainer.appendChild(clone));
      lastClones.forEach((clone) => this.sliderContainer.insertBefore(clone, this.slides[0]));

      this.clonesAdded = true;
    }
  }

  init() {
    this.updateSlidesPerView();
    this.addClones()

    this.sliderContainer.style.display = 'flex';
    this.sliderContainer.style.transition = 'transform 0.3s ease-in-out';

    this.prevClickHandler = () => this.moveTo(this.currentIndex - 1);
    this.nextClickHandler = () => this.moveTo(this.currentIndex + 1);

    this.prevButton.addEventListener('click', this.prevClickHandler);
    this.nextButton.addEventListener('click', this.nextClickHandler);

    if (this.loop) {
      this.moveTo(this.slidesPerView, false);
    }
  }

  updatePages() {
    // Пересчет страниц
    this.pagesContainer.innerHTML = '';
    for( let index = 0; index <= (this.slides.length - this.slidesPerView); index++ ) {
      const dot = document.createElement('button');
      dot.classList.add('pagination__dot');
      if (index === this.currentIndex) dot.classList.add('active');
      dot.dataset.index = index;
      this.pagesContainer.appendChild(dot);

      dot.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateSliderView();
      });
    }
  }

  // updateSliderView() {
  //   // движение слайда
  //   this.sliderContainer.style.transform = `translateX(-${this.currentIndex * (this.blockWidth + this.gap)}px)`;
  //   // Обновление активной точки
  //   this.slider.querySelectorAll('.pagination__dot').forEach((dot, index) => {
  //     dot.classList.toggle('active', index === this.currentIndex);
  //   });
  //   // Управление доступностью кнопок
  //   this.prevButton.disabled = this.currentIndex === 0;
  //   this.nextButton.disabled = this.currentIndex >= this.slides.length - this.slidesPerView;
  // }

  moveTo(index, withAnimation = true) {
    console.log(index, this.currentIndex)

    if (this.loop) {
      if (index < 0) {
        this.currentIndex = this.slides.length - 1;
        this.updateSliderView(false); // Без анимации
        setTimeout(() => this.moveTo(this.currentIndex - 1), 0); // Переход назад
        return;
      }
      if (index > this.slides.length) {
        this.currentIndex = 0;
        this.updateSliderView(false); // Без анимации
        setTimeout(() => this.moveTo(this.currentIndex + 1), 0); // Переход вперед
        return;
      }
    } else {
      this.currentIndex = Math.max(0, Math.min(index, this.slides.length - this.slidesPerView));
    }

    this.currentIndex = index;
    this.updateSliderView(withAnimation);
  }

  updateSliderView(withAnimation = true) {
    const offset = -this.currentIndex * (this.blockWidth + this.gap);

    if (!withAnimation) {
      this.sliderContainer.style.transition = 'none';
    } else {
      this.sliderContainer.style.transition = 'transform 0.3s ease-in-out';
    }

    this.sliderContainer.style.transform = `translateX(${offset}px)`;

    this.slider.querySelectorAll('.pagination__dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    // Если цикличный режим, управляем видимостью кнопок
    if (!this.loop) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex >= this.slides.length - this.slidesPerView;
    }
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
