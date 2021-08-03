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
function video_background(gaming=false){
    var videoID = [
        'WdCDh6cQ2NI',
        '02uGbq-C_wo',
        'ydk4dRwyaBA',
        '83KdoGgBLFc',
        '4jxeYfqevl4',
        'vTWaOIiIru4',
        'KjToqo-ACnc'
    ]
    if(gaming==false){
        videoID = videoID[Math.floor(Math.random() * videoID.length)]
    } else {
        videoID = 'TKmllByzCtU'
    }
    const div = document.querySelector('.video-foreground');
    div.innerHTML = '<iframe src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});
texto_hola(); 
video_background();
var swiper = new Swiper(".swiper-sections", {
    slidesPerView: 10,
    spaceBetween: 30,
    loop: false,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});
var swiperProjects = new Swiper(".swiper-projects", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: false,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});
