<?php

    include 'conexionbase.php';

    // Recogemos por POST el contenido del JSON
    $texto_POST  = file_get_contents('php://input');    
    $contenido   = json_decode($texto_POST);            

    // Obtenemos las variables
    $codigo  = $contenido->{'codigo'};
    $clave   = $contenido->{'clave'};

    // Esta sentencia nos dirá si existe el usuario
    $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM usuarios WHERE CODIGO_USUARIO='$codigo' AND CLAVE='$clave'");

    foreach($sentencia as $variable){
        foreach($variable as $valor){
            $resultadoSesion = $valor; //Si devuelve 1 es que existe el usuario
        }
    }

    // Comprueba si no está vacío y existe
    if(!empty($codigo) && isset($codigo) && !empty($clave) && isset($clave)){  

        // Existe el usuario
        if($resultadoSesion == 1){
            
            session_start();
            $_SESSION['codigo']  = $codigo;
            $mensaje = "correcto";
            echo json_encode($mensaje);

        }else{
            $mensaje = "El usuario o contraseña son incorrectos";
            echo json_encode($mensaje); 
        }

    }else{
        $mensaje = "No puedes dejar un campo vacío";
        echo json_encode($mensaje); 
    }

?>