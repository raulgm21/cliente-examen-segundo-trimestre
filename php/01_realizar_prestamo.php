<?php

    // Base de Datos
    include 'conexionbase.php';

    // Correo
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    require 'Composer/vendor/autoload.php';

    // Sesiones
    session_start();
    $codigo_usuario = $_SESSION['codigo'];

    // Recogemos por POST el contenido del JSON
    $texto_POST  = file_get_contents('php://input');    
    $contenido   = json_decode($texto_POST);            

    // Obtenemos las variables
    $eleccion  = $contenido->{'elegido'};
    

    // Cuando queremos mostrar las categorías a la hora de realizar un préstamo
    if($eleccion == "Mostrar_Categorias"){

        $sentencia = mysqli_query($conn,"SELECT CODIGO, NOMBRE FROM categorias");

        // Genera fila a fila, y la guarda en un array
        while($fila = mysqli_fetch_assoc($sentencia)){                
            $arrayObjeto[] = $fila;                                   
        }

        echo json_encode($arrayObjeto);

    }

    // Nos muestra los títulosd e la categoría seleccionada
    if($eleccion == "Mostrar_Titulos"){

        // Obtenemos el código de la categoría
        $codigo  = $contenido->{'codigo'};

        $sentencia = mysqli_query($conn,"SELECT CODIGO, CATEGORIA, NOMBRE, AUTOR, RESUMEN, FECHA_PUBLICACION, NUMERO_EJEMPLARES FROM titulos WHERE CATEGORIA='$codigo'");

        // Genera fila a fila, y la guarda en un array
        while($fila = mysqli_fetch_assoc($sentencia)){                
            $arrayObjeto[] = $fila;                                   
        }

        echo json_encode($arrayObjeto);

    }

    if($eleccion == "Mostrar_Modal"){

        // Obtenemos el código del Título
        $codigo  = $contenido->{'codigo'};

        $sentencia = mysqli_query($conn,"SELECT CODIGO, CATEGORIA, NOMBRE, AUTOR, RESUMEN, FECHA_PUBLICACION, NUMERO_EJEMPLARES FROM titulos WHERE CODIGO='$codigo'");

        // Genera fila a fila, y la guarda en un array
        while($fila = mysqli_fetch_assoc($sentencia)){                
            $arrayObjeto[] = $fila;                                   
        }

        echo json_encode($arrayObjeto);

    }

    if($eleccion == "Hacer_Prestamo"){

        // Obtenemos el código del Título
        $codigo  = $contenido->{'codigo'};

        // Actualizamos el Número de Ejemplares en la Tabla TITULOS
        $sentencia = mysqli_query($conn, "UPDATE titulos SET NUMERO_EJEMPLARES=NUMERO_EJEMPLARES-1 WHERE CODIGO='$codigo'");
        
        // Seleccionamos el ejemplar que vamos a realizarle el préstamo
        $sentencia = mysqli_query($conn, "SELECT CODIGO_EJEMPLAR FROM ejemplares WHERE CODIGO_TITULO='$codigo' AND DISPONIBLE = 'SI' LIMIT 1");
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                // Obtenemos el Código del Ejemplar
                $codigo_ejemplar = $valor;
            }
        }

        // Actualizamos el campo "DISPONIBLE" en la Tabla EJEMPLARES
        $sentencia = mysqli_query($conn, "UPDATE ejemplares SET DISPONIBLE = 'NO' WHERE CODIGO_TITULO='$codigo' AND DISPONIBLE='SI' LIMIT 1");

        // Insetamos el Préstamo

        $fechaActual = date('Y-m-d');

        $fechaSemana = date("Y-m-d",strtotime($fechaActual."+ 1 week")); 

        $sentencia = mysqli_query($conn, "INSERT INTO prestamos (NOMBRE_USUARIO, CODIGO_EJEMPLAR, FECHA_COMIENZO, FECHA_DEVOLUCION, DEVUELTO) VALUES ('$codigo_usuario', '$codigo_ejemplar', '$fechaActual', '$fechaSemana', 'NO')");


        // ******************************* CORREO ***************************** //

        // Obtener variables para mandar al correo

        // Obtenemos el Correo del Usuario

        $sentencia = mysqli_query($conn,"SELECT CORREO FROM usuarios WHERE CODIGO_USUARIO='$codigo_usuario'");

        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $correo = $valor;
            }
        }

        // Obtenemos el Nombre del Ejemplar 

        $sentencia = mysqli_query($conn,"SELECT NOMBRE FROM ejemplares WHERE CODIGO_EJEMPLAR='$codigo_ejemplar'");

        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $nombre_ejemplar = $valor;
            }
        }

        // Obtenemos el Código del Titulo del Ejemplar que usaremos para obtener el Nombre del Título

        $sentencia = mysqli_query($conn,"SELECT CODIGO_TITULO FROM ejemplares WHERE CODIGO_EJEMPLAR='$codigo_ejemplar'");

        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $codigo_titulo = $valor;
            }
        }

        $sentencia = mysqli_query($conn,"SELECT NOMBRE FROM titulos WHERE CODIGO='$codigo_titulo'");

        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $nombre_titulo = $valor;
            }
        }

        // MANDAR CORREOS

        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = "raulgomeeez21@gmail.com";                     //SMTP username
            $mail->Password   = 'frnslfimulbxfdbr';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom('examen@gmail.com', 'Examen Raul');
            $mail->addAddress($correo);

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'Examen Raul';
            $mail->Body    = '<h1>Has realizado un préstamo del Título: ' . $nombre_titulo . '</h1> El nombre del ejemplar obtenido es: ' . $nombre_ejemplar . ". Su período de préstamo es desde: " . $fechaActual . " a " . $fechaSemana . " .<br> Esperemos que disfrute de su libro" ;
            $mail->AltBody = '<h1>Has realizado un préstamo del Título: ' . $nombre_titulo . '</h1> El nombre del ejemplar obtenido es: ' . $nombre_ejemplar . ". Su período de préstamo es desde: " . $fechaActual . " a " . $fechaSemana . " .<br> Esperemos que disfrute de su libro" ;
            $mail->send();


            // Mandar las fecha a JS

            class FECHAS {

                public $fechaActual            = "";
                public $fechaSemana            = "";

            }

            $OBJETO = new FECHAS();    

            $OBJETO->fechaActual  = $fechaActual;
            $OBJETO->fechaSemana = $fechaSemana;

            echo json_encode($OBJETO);


        } catch (Exception $e) {
            echo json_encode("Error");
        }
    
    }
?>