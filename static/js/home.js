var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
function texto_hola() {
    var hora_actual = new Date().getHours(), text_welcome = "";

    if (hora_actual < 07 || hora_actual > 18) {
        text_welcome = "buenas noches <img src='/static/img/emojis/crescent-moon.png' style='width:40px;'>";
    } else {
        if (hora_actual >= 07 && hora_actual <= 13) {
            text_welcome = "buenos días <img src='/static/img/emojis/sun-with-face.png' style='width:40px;'>";
        } else {
            if (hora_actual >= 13 && hora_actual < 17) {
                text_welcome = "buenas tardes <img src='/static/img/emojis/sun-with-face.png' style='width:40px;'>";
            } else {
                if (hora_actual >= 17 && hora_actual < 19) {
                    text_welcome = "buenas tardes <img src='/static/img/emojis/sunset.png' style='width:40px;'>";
                }
            }
        }
    }
    //console.log(text_welcome + 'f')
    document.querySelector('.text-welcome').innerHTML += ', ' + text_welcome;
}
texto_hola();
var swiper = new Swiper(".swiper-sections", {
    slidesPerView: 10,
    spaceBetween: 30,
    loop: false,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});
