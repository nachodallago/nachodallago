var get_url_single = global_URL.split('/projects/'),
section_single = document.getElementById('projects-single'),
section_home = document.getElementById('projects-home')

function getSingleProject(url) {
    fetch('/back/index.php?type=singleproject&url='+url[1])
        .then(response => response.json())
        .then(data => {
            /* Define elements from HTML */
            function status(st) {
                var project_status='<i class="fa fa-circle text-secondary"></i> Indefinido'
                switch (st) {
                    case '1':
                        project_status='<i class="fa fa-circle text-primary"></i> Trabajando actualmente'
                        break;
                    case '2':
                        project_status='<i class="fa fa-check-circle text-success"></i> Finalizado'
                        break;
                }
                return '<span class="badge bg-white text-dark shadow" style="vertical-align: text-top;">'+project_status+'</span>'
            }
            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                section_single.querySelector('.projects-single-title').innerHTML= pitems.title
                section_single.querySelector('.projects-single-img').setAttribute('src',pitems.img)
                section_single.querySelector('.projects-single-features').innerHTML= status(pitems.status) +' <i class="fa fa-sliders-h text-secondary"></i> ' + pitems.features.replaceAll('<br>\r\n',' • ')
                section_single.querySelector('.projects-single-content').innerHTML= pitems.content
            })
            
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}

if(get_url_single.length>0){
    section_single.style.display='block';
    section_home.style.display='none';
    getSingleProject(get_url_single)
}