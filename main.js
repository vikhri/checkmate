import Slider from './slider';

document.addEventListener('DOMContentLoaded', () => {
  let stepsSlider = null;
  let playersSlider = null;

  // Инициализация stepsSlider
  const initializeStepsSlider = () => {
    if (window.innerWidth < 1200 && !stepsSlider) {
      stepsSlider = new Slider('feature-slider');
      stepsSlider.init();
    } else if (window.innerWidth >= 1200 && stepsSlider) {
      stepsSlider.destroy();
      stepsSlider = null;
    }
  };

  // Инициализация playersSlider
  const initializePlayersSlider = () => {
    if (!playersSlider) {
      playersSlider = new Slider('players-slider');
      playersSlider.setParameters(3, 20);
      playersSlider.init();
    }
  };

  // Инициализация слайдеров при загрузке
  initializeStepsSlider();
  initializePlayersSlider();

  // Проверка при изменении размера окна
  window.addEventListener('resize', () => {
    initializeStepsSlider();

    if (stepsSlider) {
      stepsSlider.updateSlidesPerView();
    }
    if (playersSlider) {
      playersSlider.updateSlidesPerView();
    }
  });
});


