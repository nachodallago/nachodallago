<?php
/* DEFINIR CONFIGURACIONES GLOBALES */
header('X-Powered-By: NDL');
header('Server: NDL Server');
setlocale(LC_ALL, "es_ES");
define('raiz','app');
ini_set('display_errors', 0);
ini_set("error_log", "../php_error.log");