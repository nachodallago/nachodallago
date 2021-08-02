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
  //loadHtml('comming-soon')
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

document.addEventListener('DOMContentLoaded', function () {
  var loader = document.querySelector('.loading-page');
  setTimeout(function () {
    loader.style.transition = '.5s';
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
  },1000)
})
window.onpopstate = function (e) {
  if (e.state) {
    document.getElementById("content").innerHTML = e.state.html;
    document.title = e.state.pageTitle;
  }
  var loader = document.querySelector('.loading-page');
    loader.style.transition = '.5s';
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
};

var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});