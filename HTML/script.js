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

document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('openEmailForm');
    const emailForm = document.querySelector('.email-form');
    const closeBtn = document.querySelector('.form-close');

    openBtn.addEventListener('click', function () {
        emailForm.classList.add('email-form--open');
    });

    closeBtn.addEventListener('click', function () {
        emailForm.classList.remove('email-form--open');
    });
});
