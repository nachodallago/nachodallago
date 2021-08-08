function video_background(){
    var videoID = [
        'TKmllByzCtU'
    ]
    videoID = videoID[Math.floor(Math.random() * videoID.length)]
    const div = document.querySelector('.video-foreground');
    div.innerHTML = '<iframe src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
video_background();
function getSteamInfo(){
    var avatar = document.querySelector('.img-steam-avatar'),
    name_steam = document.querySelector('.name-steam'),
    statusTxt='';
    fetch('/back/index.php?type=steam')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.status=='online'){statusTxt=' <div class="gaming-online d-inline-block"></div>'}
        if(data.status=='in-game'){statusTxt=' <div class="gaming-online d-inline-block"></div><br><small> <img src="'+data.in_game.icon+'"> Jugando a '+data.in_game.game+'</small>'}
        avatar.setAttribute('src',data.avatar);
        name_steam.innerHTML=data.name + statusTxt;
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
}
getSteamInfo()
var gaming_section_nav = document.querySelector('.section-nav-gaming'),
 gaming_section_content = document.querySelector('.tab-content-gaming');
gaming_section_nav.classList.add('animated'), gaming_section_content.classList.add('animated');