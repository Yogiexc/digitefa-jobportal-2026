// SCROLL BAR NAVBAR
// document.addEventListener('DOMContentLoaded', function () {
//   var nav = document.querySelector('nav');

//   if (nav) {
//     window.addEventListener('scroll', function () {
//       if (window.innerWidth > 992) {
//         if (window.pageYOffset > 30) {
//           nav.classList.remove('transparent');
//           nav.classList.add('scrolled');
//         } else {
//           nav.classList.remove('scrolled');
//           nav.classList.add('transparent');
//         }
//       } else {
//         nav.classList.remove('transparent');
//         nav.classList.add('scrolled');
//       }
//     });
//   }
// });

//NAVIGASI COURSE NAVBAR
// document.addEventListener('DOMContentLoaded', () => {
//   const pointers = document.querySelectorAll('.pointer');
//   const sections = document.querySelectorAll('.section');

//   pointers.forEach(pointer => {
//       pointer.adropzonedEventListener('click', () => {
//           pointers.forEach(p => p.classList.remove('active'));
//           sections.forEach(s => s.classList.remove('active'));

//           pointer.classList.add('active');
//           const targetId = pointer.getAttribute('data-target');
//           document.getElementById(targetId).classList.add('active');
//       });
//   });
// });

// var loader = document.getElementById("preloader");
// window.addEventListener("load", function() {
//   loader.style.display = "none";
// })

//COURSE DATA
// document.addEventListener('DOMContentLoaded', () => {
//     const carouselItems = document.querySelectorAll('#carouselExampleControls .carousel-item');
//     const prevButton = document.querySelector('.carousel-control-prev');
//     const nextButton = document.querySelector('.carousel-control-next');

//     // Check the number of items
//     if (carouselItems.length > 3) {
//         // Show buttons if there are more than 3 items
//         prevButton.classList.add('show');
//         nextButton.classList.add('show');
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const pointers = document.querySelectorAll('.pointer');

//   pointers.forEach(pointer => {
//     pointer.addEventListener('click', () => {
//       pointers.forEach(p => p.classList.remove('active'));
//       pointer.classList.add('active');
//     });
//   });
// });


// COUNT UP FUNCTION
const animateCountUp = () => {
  const animationDuration = 3000;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(animationDuration / frameDuration);
  const easeOutQuad = (t) => t * (2 - t);
  const countupEls = document.querySelectorAll('.timer');
  countupEls.forEach((el) => {
    let frame = 0;
    const countTo = parseInt(el.innerHTML.replace(/\D/g, ''), 10);
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = Math.round(countTo * progress);
      el.innerHTML = currentCount.toLocaleString('en-US');
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  });
};
document.addEventListener('DOMContentLoaded', function () {
  animateCountUp();
});


// ICON EYES 
const eyeIcons = {
 open: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>',
  closed: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>'
};
function addListeners() {
  // Password field toggle
  const passwordToggleButton = document.querySelector('.password-toggle');
  if (passwordToggleButton) {
      passwordToggleButton.addEventListener('click', () => togglePassword('password-field', passwordToggleButton));
  }
  // Confirm Password field toggle
  const confirmPasswordToggleButton = document.querySelector('.confirm-password-toggle');
  if (confirmPasswordToggleButton) {
      confirmPasswordToggleButton.addEventListener('click', () => togglePassword('confirm-password-field', confirmPasswordToggleButton));
  }
  const newPasswordToggleButton = document.querySelector('.new-password-toggle');
  if (newPasswordToggleButton) {
    newPasswordToggleButton.addEventListener('click', () => togglePassword('new-password-field', newPasswordToggleButton));
  }
}
function togglePassword(fieldId, toggleButton) {
  const passwordField = document.getElementById(fieldId);

  if (!passwordField || !toggleButton) {
      return;
  }
  toggleButton.classList.toggle('open');
  const isEyeOpen = toggleButton.classList.contains('open');
  toggleButton.innerHTML = isEyeOpen ? eyeIcons.closed : eyeIcons.open;
  passwordField.type = isEyeOpen ? 'text' : 'password';
}
document.addEventListener('DOMContentLoaded', addListeners);



document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');

  function updateSidebar() {
    if (sidebar && content) {
      if (window.innerWidth <= 769) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (sidebar && content) { 
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
      }
    });
  }

  window.addEventListener('resize', updateSidebar);
  updateSidebar(); 
});





  // SELECTED ADD MYCOURSE ACTIVE
window.selectCard = function(card) {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}
