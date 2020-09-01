var navMain = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");

navToggle.addEventListener("click", function () {
  navMain.classList.toggle("main-nav--closed");
  navMain.classList.toggle("main-nav--opened");
});


var root = document.querySelector(':root');
var leftButton = document.querySelector(".slider__button--prev");
var rightButton = document.querySelector(".slider__button--next");

leftButton.addEventListener("click", function () {
  root.style.setProperty('--slide-width', '0');
});

rightButton.addEventListener("click", function () {
  root.style.setProperty('--slide-width', '690px');
});
