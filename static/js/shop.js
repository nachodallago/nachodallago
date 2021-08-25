var get_url_single = global_URL.split('/'),
section_single = document.getElementById('shop-single'),
section_home = document.getElementById('shop-home'),
url_single = get_url_single.filter(e =>  e);
function getProjectInfo() {
    fetch('/back/index.php?type=shop')
        .then(response => response.json())
        .then(data => {
            /* Define elements from HTML */
            var list_items = document.querySelector('.shop-home-listitem')
            var a_project = document.querySelector('.shop-home-item-link'),
            title_project = document.querySelector('.shop-home-item-title'),
            price_project = document.querySelector('.shop-home-item-price'),
            img_project = document.querySelector('.shop-home-item-img');

            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                a_project.setAttribute('href','/shop/'+pitems.url)
                title_project.innerHTML =pitems.title
                img_project.setAttribute('src',pitems.image)
                price_project.innerHTML = pitems.price
                item_project = document.querySelector('.shop-home-item').innerHTML
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
    fetch('/back/index.php?type=singleshop&url='+url)
        .then(response => response.json())
        .then(data => {
            /* Define elements from HTML */
            function status(st) {
                var project_status='<i class="fa fa-circle text-secondary"></i> Indefinido'
                switch (st) {
                    case '1':
                        project_status='<i class="fa fa-circle text-primary"></i> Trabajando ahora'
                        break;
                    case '2':
                        project_status='<i class="fa fa-check-circle text-success"></i> Finalizado'
                        break;
                }
                return '<span class="badge bg-white text-dark shadow" style="vertical-align: text-top;">'+project_status+'</span>'
            }
            /* Insert Data inside Template HTML */
            data.forEach(function (pitems) {
                section_single.querySelector('.shop-single-title').innerHTML= pitems.title
                section_single.querySelector('.shop-single-img').setAttribute('src',pitems.img)
                section_single.querySelector('.shop-single-content').innerHTML= pitems.content
                section_single.querySelector('.shop-single-price').innerHTML= '$'+pitems.price
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