var modal_nav = document.getElementById('modal-nav'),
  year_copyright = document.getElementById('setYearCopyright'),
  container_load = document.getElementById('container_load'),
  modal_close = document.querySelector('.modal-nav-close'),
  btn_linkmenu = document.querySelectorAll('.btn-link-menu'),
  btn_openmenu = document.querySelector('.btn-openmenu');
var global_URL = window.location.pathname
btn_openmenu.onclick = function () {
  modal_nav.style.transition = '.5s';
  modal_nav.style.opacity = '1';
  modal_nav.style.visibility = 'visible';
  container_load.style.display = 'none';
}

modal_close.onclick = function () {
  modal_nav.style.transition = '.5s';
  modal_nav.style.opacity = '0';
  modal_nav.style.visibility = 'hidden';
  container_load.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
  var loader = document.querySelector('.loading-page');
  if(document.referrer.includes=='instagram'){
    loader.querySelector('h2').innerText = 'Nos estamos moviendo de Instagram a mi web'
  }
  setTimeout(function () {
    loader.style.transition = '.5s';
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
  }, 500);
})

year_copyright.innerText = new Date().getFullYear();

const loadHtml = function (url_path) {
  document.getElementById('container_load').innerHTML = '';

  var page_status;
  const init = {
    method: "GET",
    headers: { "Content-Type": "text/html" },
    mode: "cors",
    cache: "default"
  };
  const req = new Request('/pages/' + url_path + '.site.html', init);
  fetch(req)
    .then(function (data) {
      if (data.ok) {
        page_status = true;
      } else if (data.status === 404) {
        page_status = 404;
      } else {
        page_status = response.status
      }
      return data.text();
    })
    .then(function (html) {
      if (page_status == true) {

        document.getElementById('container_load').innerHTML = html;
        var scripts = document.getElementById("container_load").querySelectorAll("script");
        for (var i = 0; i < scripts.length; i++) {
          if (scripts[i].innerText) {
            eval(scripts[i].innerText);
          } else {
            fetch(scripts[i].src).then(function (data) {
              data.text().then(function (r) {
                eval(r);
              })
            });

          }
          // To not repeat the element
          scripts[i].parentNode.removeChild(scripts[i]);
        }
        /* Lazy load */
        var lazyloadImages;
        if ("IntersectionObserver" in window) {
          lazyloadImages = document.querySelectorAll(".lazy");
          var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                var image = entry.target;
                image.src = image.dataset.src;
                image.classList.remove("lazy");
                imageObserver.unobserve(image);
              }
            });
          });

          lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
          });
        } else {
          var lazyloadThrottleTimeout;
          lazyloadImages = document.querySelectorAll(".lazy");

          function lazyload() {
            if (lazyloadThrottleTimeout) {
              clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
              var scrollTop = window.pageYOffset;
              lazyloadImages.forEach(function (img) {
                if (img.offsetTop < (window.innerHeight + scrollTop)) {
                  img.src = img.dataset.src;
                  img.classList.remove('lazy');
                }
              });
              if (lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
              }
            }, 20);
          }

          document.addEventListener("scroll", lazyload);
          window.addEventListener("resize", lazyload);
          window.addEventListener("orientationChange", lazyload);
        }

      } else if (page_status == 404) {
        html = '';
        var notfound = document.getElementById('page-404').innerHTML
        container_load.innerHTML = notfound
      }
    })
    .catch(error => console.log('error is ', error));

};


if (global_URL == '/') {
  loadHtml('comming-soon')
} else {
  var paths = global_URL.split('/');
  var result_path = paths.filter(e =>  e);
  loadHtml(result_path[0]);
}