<?php ob_start();
    include 'inc/head.html';	
	include 'inc/nav.html';			  
	if(!isset($_GET['pag'])){
		include 'pages/home.site.html'; 
	} else {  
		include 'pages/'.$_GET['pag'].'.site.html'; 
	}
	include 'inc/footer.html';
ob_end_flush(); 
?>