<?php

    // Base de Datos
    include 'conexionbase.php';

    // Sesiones
    session_start();
    $codigo_usuario = $_SESSION['codigo'];

    // Recogemos por POST el contenido del JSON
    $texto_POST  = file_get_contents('php://input');    
    $contenido   = json_decode($texto_POST);            

    $arrayGlobal = [];
    $fechaActual = date('Y-m-d');


    class APARTADOS {

        public $apartado            = "";

    }

    $OBJETO1 = new APARTADOS();
    $OBJETO2 = new APARTADOS();
    $OBJETO3 = new APARTADOS();

    // ---> Si el ejemplar ya se devolvió

    $OBJETO1->apartado  = "Ejemplares Devueltos:";

    array_push($arrayGlobal, $OBJETO1);
    
    $sentencia = mysqli_query($conn,"SELECT CODIGO_EJEMPLAR, FECHA_COMIENZO, FECHA_DEVOLUCION FROM prestamos WHERE NOMBRE_USUARIO='$codigo_usuario' AND DEVUELTO = 'SI'");

    while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
        array_push($arrayGlobal, $fila);                                   // Array de los Objetos
    }

    // ---> Si el ejemplar está siendo usado, pero está en plazo

    $OBJETO2->apartado  = "Ejemplares usados pero DENTRO de plazo:";

    array_push($arrayGlobal, $OBJETO2);

    $sentencia = mysqli_query($conn, "SELECT CODIGO_EJEMPLAR, FECHA_COMIENZO, FECHA_DEVOLUCION FROM prestamos 
    WHERE FECHA_DEVOLUCION >= '$fechaActual' AND FECHA_COMIENZO <= '$fechaActual' AND DEVUELTO='NO' AND NOMBRE_USUARIO = '$codigo_usuario'");

    while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
        array_push($arrayGlobal, $fila);                                   // Array de los Objetos
    }

    // ---> Si el ejemplar está siendo usado, pero está FUERA de plazo

    $OBJETO3->apartado  = "Ejemplares usados pero FUERA de plazo:";

    array_push($arrayGlobal, $OBJETO3);

    $sentencia = mysqli_query($conn, "SELECT CODIGO_EJEMPLAR, FECHA_COMIENZO, FECHA_DEVOLUCION FROM prestamos WHERE
    FECHA_DEVOLUCION < '$fechaActual' AND DEVUELTO='NO' AND NOMBRE_USUARIO = '$codigo_usuario'");

    while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
        array_push($arrayGlobal, $fila);                                   // Array de los Objetos
    }

    // APARTADO DEL PDF, MOSTRAR LOS LIBROS QUE TIENE PRESTADOS EN ESTE INSTANTE
    $sentencia = mysqli_query($conn, "SELECT CODIGO_EJEMPLAR AS PDF, FECHA_COMIENZO, FECHA_DEVOLUCION FROM prestamos
    WHERE NOMBRE_USUARIO = '$codigo_usuario' AND DEVUELTO='NO'");

    while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
        array_push($arrayGlobal, $fila);                                   // Array de los Objetos
    }
    
    echo json_encode($arrayGlobal);

?>