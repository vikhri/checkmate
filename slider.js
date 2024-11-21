export default class Slider {
  constructor(sliderSelector, config) {
    this.config = config;
    this.loop = config.loop;
    this.slider = document.getElementById(sliderSelector);
    this.sliderContainer = this.slider.querySelector('.slider-container');
    this.slides = [...this.slider.querySelectorAll('.slide')];
    this.slidesPerView = 2;
    this.gap = 20;
    this.autoInterval = null;
    this.prevButton = this.slider.querySelector('.pagination__button.prev');
    this.nextButton = this.slider.querySelector('.pagination__button.next');
    this.pagesContainer = this.slider.querySelector('.pages');
    this.currentPage = this.slider.querySelector('.current-page');
    this.pagesCount = this.slider.querySelector('.pages-count');
    this.currentIndex = 0;
    this.blockWidth = 0;

    // Event Listeners Links
    this.prevClickHandler = null;
    this.nextClickHandler = null;
  }

  updateSlideWidth() {
    this.blockWidth = (this.slider.offsetWidth - ((this.slidesPerView - 1) * this.gap)) / this.slidesPerView;

    [...this.slider.querySelectorAll('.slide')].forEach((block) => {
      block.style.width = `${this.blockWidth}px`;
      block.style.marginRight = `${this.gap}px`;
    });
  }

  updateSlidesPerView() {
    const breakpoints = this.config.breakpoints;

    const matchingBreakpoint = breakpoints.find((bp) => window.innerWidth < bp.width) || breakpoints[breakpoints.length - 1];

    this.slidesPerView = matchingBreakpoint.slidesPerView;

    this.updateSlideWidth();
    this.updatePagesCount();
    this.swipeSlide();
  }

  addClones() {
    // add clones for loop
    if (!this.clonesAdded) {
      const firstClones = this.slides.slice(0, this.slidesPerView).map((slide) => slide.cloneNode(true));
      const lastClones = this.slides.slice(-this.slidesPerView).map((slide) => slide.cloneNode(true));

      firstClones.forEach((clone) => this.sliderContainer.appendChild(clone));
      lastClones.forEach((clone) => this.sliderContainer.insertBefore(clone, this.slides[0]));

      this.clonesAdded = true;
    }
  }

  autoSwipingOn() {
    if (!this.autoInterval) {
      this.autoInterval = setInterval(() => {
        this.moveTo(this.currentIndex + 1);
      }, this.config.switchingInterval);
    }
  }

  autoSwipingOff() {
    if(this.autoInterval) {
      clearInterval(this.autoInterval);
      this.autoInterval = null;
    }
  }

  init() {
    this.sliderContainer.classList.add('active');
    this.updateSlidesPerView();

    if(this.loop) {
      this.addClones()
      this.moveTo(this.slidesPerView, false);
    }

    if(this.config.auto === true) {
      this.autoSwipingOn();
    }

    if(!this.config.dots) {
      this.pagesCount.textContent = this.slides.length.toString();
    }

    // Navigation button click handlers
    this.prevClickHandler = () => this.moveTo(this.currentIndex - 1)
    this.nextClickHandler = () => this.moveTo(this.currentIndex + 1)

    this.prevButton.addEventListener('click', this.prevClickHandler);
    this.nextButton.addEventListener('click', this.nextClickHandler);


    // // Stop autoswiping while mouse is above the slider
    // this.mouseEnterHandler = () => this.autoSwipingOff();
    // this.mouseLeaveHandler = () => this.autoSwipingOn();
    //
    // this.slider.addEventListener('mouseenter', this.mouseEnterHandler);
    // this.slider.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  updatePagesCount() {
    if(this.config.dots) {
      this.pagesContainer.innerHTML = '';
      for( let index = 0; index <= (this.slides.length - this.slidesPerView); index++ ) {
        const dot = document.createElement('button');
        dot.classList.add('pagination__dot');
        if (index === this.currentIndex) dot.classList.add('active');
        dot.dataset.index = index;
        this.pagesContainer.appendChild(dot);

        dot.addEventListener('click', () => {
          this.currentIndex = index;
          this.swipeSlide();
        });
      }
    } else {
      if(!this.config.dots) {
        this.currentPage.textContent = this.currentIndex.toString()
      }
    }
  }

  moveTo(index, withAnimation = true) {
    if (this.loop) {
      if (index < 0) {
        this.currentIndex = this.slides.length - 1;
        this.swipeSlide(false); // Без анимации
        setTimeout(() => this.moveTo(this.currentIndex - 1), 0); // Переход назад
        return;
      }
      if (index > this.slides.length) {
        this.currentIndex = 0;
        this.swipeSlide(false); // Без анимации
        setTimeout(() => this.moveTo(this.currentIndex + 1), 0); // Переход вперед
        return;
      }
    } else {
      this.currentIndex = Math.max(0, Math.min(index, this.slides.length - this.slidesPerView));
    }

    this.currentIndex = index;
    this.updatePagesCount();
    this.swipeSlide(withAnimation);
  }

  swipeSlide(withAnimation = true) {
    const offset = -this.currentIndex * (this.blockWidth + this.gap);

    if (!withAnimation) {
      this.sliderContainer.classList.remove('animate')
    } else {
      this.sliderContainer.classList.add('animate')
    }

    this.sliderContainer.style.transform = `translateX(${offset}px)`;

    if (!this.loop) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex >= this.slides.length - this.slidesPerView;
    }
  }

  destroy() {
    // Remove Event Listeners
    this.prevButton.removeEventListener('click', this.prevClickHandler);
    this.nextButton.removeEventListener('click', this.nextClickHandler);

    // Remove pagination dots
    while (this.pagesContainer.firstChild) {
      this.pagesContainer.removeChild(this.pagesContainer.firstChild);
    }

    // Remove slider styles
    this.slides.forEach((block) => {
      block.style.width = '';
      block.style.marginRight = '';
    });

    // Remove container styles
    this.sliderContainer.classList.remove('active');
  }
}
