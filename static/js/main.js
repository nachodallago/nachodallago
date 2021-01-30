/* Obscure Mode */
if(localStorage.getItem("obscure-mode")=='true'){
    $('body').addClass('bg-obscure-mode');
} else {
    $('body').removeClass('bg-obscure-mode');
}
if (typeof(Storage) !== "undefined") {
    if(localStorage.getItem("obscure-mode")=='true'){
      $('.checkbox-obscure-mode').attr('checked','checked');
    }
    $('.setting-obscure-mode').on('click', function(){
      if(localStorage.getItem("obscure-mode")){
        if(localStorage.getItem("obscure-mode")=='true'){
          localStorage.setItem("obscure-mode", 'false');
          $('.checkbox-obscure-mode').removeAttr('checked','checked');
          $(this).parent('body').addClass('bg-obscure-mode');
        } else {
          localStorage.setItem("obscure-mode", 'true');
          $('.checkbox-obscure-mode').attr('checked','checked');
        }
      } else {
        localStorage.setItem("obscure-mode", 'true');
        $('.checkbox-obscure-mode').attr('checked','checked');
        $(this).parent('body').addClass('bg-obscure-mode');
      }
      return false;
    });
  }
  document.querySelector('.setting-obscure-mode').addEventListener("click", function(){
    if(localStorage.getItem("obscure-mode")=='true'){
      $('body').addClass('bg-obscure-mode');
    } else {
      $('body').removeClass('bg-obscure-mode');
    }
  });

/* General */
$(document).ready(function(){
    // if(location.pathname=="/"){
    //     $('.container--load').load('/pages/home.site.html');
    // }
    // Basic Rounting minimalist
    $('.nav-internal-link').on('click', function(){
        var href = $(this).attr('url');
        var link = '/pages/'+href+'.site.html',urlbrowser=href;
        window.history.pushState('page2', href.text, href);
        $('.container--load').load(link);
    });
});
var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
});
window.onpopstate = function(e){
    if(e.state){
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};