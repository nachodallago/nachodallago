function video_background(){
    var videoID = [
        'TKmllByzCtU'
    ]
    videoID = videoID[Math.floor(Math.random() * videoID.length)]
    const div = document.querySelector('.video-foreground');
    div.innerHTML = '<iframe src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});
video_background();
function getSteamInfo(){
    var avatar = document.querySelector('.img-steam-avatar'),
    name_steam = document.querySelector('.name-steam'),
    status_steam = document.querySelector('.status-steam'),
    statusTxt='';
    fetch('/back/index.php?type=steam')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.status=='online'){statusTxt=' <div class="gaming-online d-inline-block"></div> <span class="text-secondary">En línea</span>'}
        if(data.status=='in-game'){statusTxt=' <div class="gaming-online d-inline-block"></div><br><small> <img src="'+data.in_game.icon+'"> Jugando a '+data.in_game.game+'</small>'}
        if(data.status=='offline'){statusTxt='<span class="text-secondary">Actualmente desconectado</span>'}
        avatar.setAttribute('src',data.avatar);
        status_steam.innerHTML = statusTxt;
        name_steam.innerHTML=data.name;
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
}
getSteamInfo()
var gaming_section_nav = document.querySelector('.section-nav-gaming'),
gaming_section_content = document.querySelector('.tab-content-gaming');
setTimeout(function(){
    AOS.init();
},2000);