const loadHtml = function (url_path) {
  const init = {
    method: "GET",
    headers: { "Content-Type": "text/html" },
    mode: "cors",
    cache: "default"
  };
  const req = new Request('/pages/' + url_path + '.site.html', init);
  fetch(req)
    .then(function (data) {
      return data.text();
    })
    .then(function (html) {
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
    });
};

if (window.location.pathname == '/') {
  loadHtml('home')
  //   fetch('/pages/home.site.html')
  //   .then(response => response.text())
  //   .then(value => {
  //     document.querySelector('.container--load').innerHTML = value
  //   });
}
/* 
 * @param {string} parentElementId - The ID of the DOM element to load into
 * @param {string} htmlFilePath - The path of the HTML file to load
 */

/* Obscure Mode */
var body = document.getElementsByTagName('body');
if (localStorage.getItem("obscure-mode") == 'true') {
  body.classList.add('bg-obscure-mode');
} else {
  body.classList.remove('bg-obscure-mode');
}

// if (typeof (Storage) !== "undefined") {
//   if (localStorage.getItem("obscure-mode") == 'true') {
//     $('.checkbox-obscure-mode').attr('checked', 'checked');
//   }
//   $('.setting-obscure-mode').on('click', function () {
//     if (localStorage.getItem("obscure-mode")) {
//       if (localStorage.getItem("obscure-mode") == 'true') {
//         localStorage.setItem("obscure-mode", 'false');
//         $('.checkbox-obscure-mode').removeAttr('checked', 'checked');
//         $(this).parent('body').addClass('bg-obscure-mode');
//       } else {
//         localStorage.setItem("obscure-mode", 'true');
//         $('.checkbox-obscure-mode').attr('checked', 'checked');
//       }
//     } else {
//       localStorage.setItem("obscure-mode", 'true');
//       $('.checkbox-obscure-mode').attr('checked', 'checked');
//       $(this).parent('body').addClass('bg-obscure-mode');
//     }
//     return false;
//   });
// }
document.querySelector('.setting-obscure-mode').addEventListener("click", function () {
  if (localStorage.getItem("obscure-mode") == 'true') {
    $('body').addClass('bg-obscure-mode');
  } else {
    $('body').removeClass('bg-obscure-mode');
  }
});

// /* General */
// $(document).ready(function () {
//   // if(location.pathname=="/"){
//   //     $('.container--load').load('/pages/home.site.html');
//   // }
//   // Basic Rounting minimalist
//   $('.nav-internal-link').on('click', function () {
//     var href = $(this).attr('url');
//     var link = '/pages/' + href + '.site.html', urlbrowser = href;
//     window.history.pushState('page2', href.text, href);
//     $('.container--load').load(link);
//   });
// });
var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

window.onpopstate = function (e) {
  if (e.state) {
    document.getElementById("content").innerHTML = e.state.html;
    document.title = e.state.pageTitle;
  }
};