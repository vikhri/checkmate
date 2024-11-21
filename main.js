import Slider from './slider';

const featureSliderConfig = {
  breakpoints: [
    { width: 768, slidesPerView: 1 },
    { width: 1200, slidesPerView: 2 },
  ],
  dots: true,
};

const playersSliderConfig = {
  breakpoints: [
    { width: 576, slidesPerView: 1 },
    { width: 768, slidesPerView: 2 },
    { width: 1200, slidesPerView: 3 },
  ],
  loop: true,
  auto: true,
  switchingInterval: 2000,
};


document.addEventListener('DOMContentLoaded', () => {
  let stepsSlider = null;
  let playersSlider = null;

  const initializeStepsSlider = () => {
    if (window.innerWidth <= 1200 && !stepsSlider) {
      stepsSlider = new Slider('feature-slider', featureSliderConfig);
      stepsSlider.init();
    } else if (window.innerWidth > 1200 && stepsSlider) {
      stepsSlider.destroy();
      stepsSlider = null;
    }
  };

  const initializePlayersSlider = () => {
    if (!playersSlider) {
      playersSlider = new Slider('players-slider', playersSliderConfig, true);
      playersSlider.init();
    } else {
      playersSlider.updateSlidesPerView();
    }
  };

  initializeStepsSlider();
  initializePlayersSlider();

  window.addEventListener('resize', () => {
    initializeStepsSlider();
    initializePlayersSlider();

    if (stepsSlider) {
      stepsSlider.updateSlidesPerView();
    }
    if (playersSlider) {
      playersSlider.updateSlidesPerView();
    }
  });
});
