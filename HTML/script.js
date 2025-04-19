const swiper = new Swiper('.slider-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 0,
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        620: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
  });
