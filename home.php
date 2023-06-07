<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto Raul: Home</title>

    <script src="js/index.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

    <link rel="stylesheet" href="css/home.css">
    <link rel="shortcut icon" href="img/icono.ico" type="image/x-icon">

</head>
<body>
    <?php session_start();
    echo "<input style='display : none;' type='text' id='codigo_usuario' value='$_SESSION[codigo]'>";
    ?>

    <!-- PARA ARREGLAR COMPATIBILIDAD CON EL LOGIN-->
    <p id="login" style="display : hidden;"></p>

    
    <div class="encabezado_div">
      
        <h1 id="encabezado">¡ Préstamos de Libros !</h1>
    </div>

    <button class="cerrarsesion"><a href="php/cerrar_sesion.php">Cerrar Sesión</a></button>
    <div class="menu_div">

        <div>
            <img id="boton_realizar_prestamo" class="menu" alt="" src="img/realizarprestamo.png"> 
        </div>

        <div>
            
            <img id="boton_consultar_prestamo" class="menu" alt="" src="img/consultarprestamo.png"> 
        </div>

    </div>

    <!--DIV MANIPULADO CON DOM-->
    <div id="contenedor"></div>  
    
</body>
</html>