<?php
include 'includes/functions.php'; 
 $data = '<?xml version="1.0" encoding="UTF-8"?>';
 $data .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';
 	foreach(getAllBlogs() as $blog){
 	$data .= '<url> ';
 	$data .= '	<loc>https://nachodallago.com/blog/'.$blog->url_blog.'</loc> ';
 	$data .= '	<news:news>';
	$data .= ' 		<news:publication>';
	$data .= ' 			<news:name>NDL News</news:name>';
	$data .= ' 				<news:language>es</news:language> ';
	$data .= ' 		</news:publication>';
	$data .= ' 		<news:publication_date>'.date('Y-m-d', strtotime($blog->date)).'</news:publication_date>';
	$data .= ' 		<news:title>'.$blog->title.'</news:title>';
	$data .= ' 	</news:news>';
	$data .= '</url> ';
	 } 
 $data .= '</urlset>';
$dom = new DOMDocument;
$dom->preserveWhiteSpace = FALSE;
$dom->loadXML($data);

$dom->save('sitemap.xml');
echo true;