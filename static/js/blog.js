var get_url_single = global_URL.split('/'),
section_single = document.getElementById('projects-single'),
section_home = document.getElementById('projects-home'),
url_single = get_url_single.filter(e =>  e);
function getProjectInfo() {
    fetch('/back/index.php?type=blogAll')
        .then(response => response.json())
        .then(data => {
            /* Define elements from HTML */
            var list_items = document.querySelector('.projects-home-listitem')
            var a_project = document.querySelector('.projects-home-item-link'),
            title_project = document.querySelector('.projects-home-item-title'),
            img_project = document.querySelector('.projects-home-item-img');

            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                a_project.setAttribute('href','/blog/'+pitems.url_blog)
                title_project.innerHTML =pitems.title
                img_project.setAttribute('src',pitems.image)

                item_project = document.querySelector('.projects-home-item').innerHTML
                var div_pr = document.createElement("div");
                div_pr.classList.add('col-md-4')
                div_pr.innerHTML = item_project
                list_items.append(div_pr)
            })
            
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}
function getSingleProject(url) {
    fetch('/back/index.php?type=singleblog&url='+url)
        .then(response => response.json())
        .then(data => {
            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                section_single.querySelector('.projects-single-title').innerHTML= pitems.title
                section_single.querySelector('.projects-single-img').setAttribute('src',pitems.image)
                section_single.querySelector('.projects-single-content').innerHTML= pitems.content
            })
            
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}

console.log(url_single[1])
if(url_single.length>1){
    section_single.style.display='block';
    section_home.style.display='none';
    getSingleProject(url_single[1])
} else {
    getProjectInfo()
    section_single.style.display='none';
    section_home.style.display='block';
}