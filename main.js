import Slider from './slider';

document.addEventListener('DOMContentLoaded', () => {
  let stepsSlider = null;

  const initializeSlider = () => {
    if (window.innerWidth < 1200 && !stepsSlider) {
      stepsSlider = new Slider('feature-slider');
      stepsSlider.init();
    } else if (window.innerWidth >= 1200 && stepsSlider) {
      stepsSlider.destroy();
      stepsSlider = null;
    }
  };

  initializeSlider();


  window.addEventListener('resize', () => {
    initializeSlider();

    if (stepsSlider) {
      stepsSlider.updateSlidesPerView();
    }
  });
});
