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
function video_background() {
    var videoID = [
        'WdCDh6cQ2NI',
        '02uGbq-C_wo',
        'ydk4dRwyaBA',
        '83KdoGgBLFc',
        '4jxeYfqevl4',
        'vTWaOIiIru4',
        'KjToqo-ACnc'
    ]
    videoID = videoID[Math.floor(Math.random() * videoID.length)]
    const div = document.querySelector('.video-foreground');
    div.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoID + '?playlist=' + videoID + '&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});
function getProjectInfo() {
    fetch('/back/index.php?type=projects')
        .then(response => response.json())
        .then(data => {
            /* Define elements from HTML */
            var slider_project = document.querySelector('.list-projects')
            var template_project = document.getElementById('projects-template').innerHTML
            a_project = document.querySelector('.project-link'),
            title_project = document.querySelector('.project-title'),
            img_project = document.querySelector('.project-image');

            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                a_project.setAttribute('href','/projects/'+pitems.url)
                title_project.innerHTML =pitems.title
                img_project.setAttribute('src',pitems.url_image)

                item_project = document.querySelector('.project-item').innerHTML
                var div_pr = document.createElement("div");
                div_pr.classList.add('swiper-slide')
                div_pr.innerHTML = item_project
                slider_project.append(div_pr)
            })
            /* Activate slider */
            new Swiper(".swiper-projects", {
                slidesPerView: 3,
                spaceBetween: 30,
                loop: false,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                }
            });
            
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}
getProjectInfo();
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
