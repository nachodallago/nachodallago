function video_background(){
    var videoID = [
        'TKmllByzCtU',
        'dgYiRDFZZyE'
    ]
    videoID = videoID[Math.floor(Math.random() * videoID.length)]
    const div = document.querySelector('.video-foreground');
    div.innerHTML = '<iframe src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});
var btn_gaming = document.querySelector('.btn-link-menu-gaming')
btn_gaming.innerHTML='<i class="fa fa-laptop"></i>',btn_gaming.setAttribute('data-bs-original-title','Modo Normal'),btn_gaming.setAttribute('href','/')
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
        if(data.status=='in-game'){statusTxt=' <div class="text-secondary"><div class="mb-2"><span class="gaming-online d-inline-block"></span> <span style="font-size:10px;font-weight:300">AHORA</span></div> <small> <img src="'+data.in_game.icon+'" class="rounded"> Jugando a '+data.in_game.game+'</small></div>'}
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