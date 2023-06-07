//**************************************************************************************************************//
//**************************************************************************************************************//
//------------------------------------------------ MANEJADOR EVENTOS -------------------------------------------//
//**************************************************************************************************************//
//**************************************************************************************************************//  

    window.onload = function (){

        document.getElementById("login").addEventListener("click",login);
        document.getElementById("boton_realizar_prestamo").addEventListener("click",realizar_prestamo);
        document.getElementById("boton_consultar_prestamo").addEventListener("click",consultar_prestamo);
    }

//**************************************************************************************************************//
//---------------------------------------------------- EXTRAS --------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en refrescar la ventana principal para que así poder albergar nueva información.
        // -------------------------------------------------------------------------------------------------- //
    
            function refrescar(padre){
                while(padre.firstChild){                                                                 
                    padre.removeChild(padre.firstChild);
                    padre.style.height = "700px";            
                }
            }

//**************************************************************************************************************//
//------------------------------------------------ INICAR SESIÓN -----------------------------------------------//
//**************************************************************************************************************//

            function login(){
                
                // Creamos el Objeto
                USUARIO = {
                    codigo   : document.getElementById("codigo").value,
                    clave    : document.getElementById("clave").value,
                }
           
                // --- Realizamos Petición Asíncrona con Fetch para: Crear Falta
                fetch('php/login.php',{
                    method : 'POST',
                    body   : JSON.stringify(USUARIO),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                
                        // Hemos accedido con un codigo y contraseña correcto
                        if(respuestaJSON == "correcto"){

                            let respuesta = document.getElementById("respuesta");
                            respuesta.innerHTML = "¡Estableciendo conexión!";
                            respuesta.style.position = 'absolute';
                            respuesta.style.fontSize = '32px';
                            respuesta.style.fontFamily = 'monospace';
                            respuesta.style.top      = "5%";
                            respuesta.style.left     = "16%";

                            let cuerpo = document.querySelector("body");
                            cuerpo.style.background = "rgb(18 18 18)";

                            let formulario = document.getElementById("login_form");
                            formulario.style.display = 'none';

                            setTimeout(acceder_home,2000);

                        }else{
                            let respuesta = document.getElementById("respuesta");
                            respuesta.innerHTML = respuestaJSON;
                        }
                
                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Login ")
                }) 

                // Después de 2 segundos nos llevará a home.php
                function acceder_home(){window.location.href = "home.php";}

            }

//**************************************************************************************************************//
//---------------------------------------------- REALIZAR PRESTÁMO ---------------------------------------------//
//**************************************************************************************************************//

            function realizar_prestamo() {

                var padre = document.getElementById("contenedor");
                refrescar(padre);

                var titulo = document.createElement("h1");
                titulo.setAttribute("id","titulo_contenedor");
                titulo.innerHTML = "Realizar Préstamo";
                padre.appendChild(titulo);

                var parrafo = document.createElement("p");
                parrafo.setAttribute("id","parrafo_contenedor");
                parrafo.innerHTML = "Eliga la categoría porfavor";
                padre.appendChild(parrafo);


                // Creamos el Objeto
                ELECCION = {
                    elegido : "Mostrar_Categorias"
                }
   
                // --- Realizamos Petición Asíncrona con Fetch
                fetch('php/01_realizar_prestamo.php',{
                    method : 'POST',
                    body   : JSON.stringify(ELECCION),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {

                    // Recorremos el FOR con cada una de las categórias
                    for(i = 0 ; i < respuestaJSON.length ; i++){

                        // Creamos un div para cada una de las categorias
                        let div = document.createElement("div");
                        div.setAttribute("id","categorias_div");
                        padre.appendChild(div);

                        // Creamos Botón-Imagen por cada Categoría
                        let imagen = document.createElement("img");
                        imagen.setAttribute("id",respuestaJSON[i].CODIGO);
                        imagen.setAttribute("value",respuestaJSON[i].NOMBRE);
                        imagen.setAttribute("class","categorias")
                        imagen.setAttribute("src",`./img/categorias/${respuestaJSON[i].CODIGO}.png`)
                        div.appendChild(imagen);

                        // Creamos Texto
                        let texto = document.createElement("p");
                        texto.setAttribute("id","categorias_texto");
                        texto.innerHTML = respuestaJSON[i].NOMBRE;
                        div.appendChild(texto); 
                    }

                    // Ver cuál categoría hemos seleccionado
                    var categorias = document.querySelectorAll("img.categorias");
        
                    for (categorias_seleccionado of categorias) {
                    
                        categorias_seleccionado.addEventListener("click", (e) => {

                        var hijo = e.target;

                        // Esta función me mostrará los títulos de la categoría escogida
                        mostrar_titulos(hijo.getAttribute("id"), hijo.getAttribute("value"));
                        
                        })

                    }

                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Realizar Préstamo (Categoría) ")
                }) 
                                
            }

            function mostrar_titulos(codigo_categoria, nombre_categoria){

                var padre = document.getElementById("contenedor");
                refrescar(padre);

                var titulo = document.createElement("h1");
                titulo.setAttribute("id","titulo_contenedor");
                titulo.innerHTML = "Categoría: " + nombre_categoria;
                padre.appendChild(titulo);

                var parrafo = document.createElement("p");
                parrafo.setAttribute("id","parrafo_contenedor");
                parrafo.innerHTML = "Eliga el título porfavor";
                padre.appendChild(parrafo);

                // Creamos el Objeto
                ELECCION = {
                    codigo  : codigo_categoria,
                    elegido : "Mostrar_Titulos"
                }

                // --- Realizamos Petición Asíncrona con Fetch
                fetch('php/01_realizar_prestamo.php',{
                    method : 'POST',
                    body   : JSON.stringify(ELECCION),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                
                    // Recorremos el FOR con cada una de las categórias
                    for(i = 0 ; i < respuestaJSON.length ; i++){

                        // Creamos un div para cada una de las categorias
                        let div = document.createElement("div");
                        div.setAttribute("id","titulo_div");
                        padre.appendChild(div);

                        // Creamos Botones por cada Ejemplar
                        let boton = document.createElement("button");
                        boton.setAttribute("id","titulo_boton");
                        boton.setAttribute("value",respuestaJSON[i].CODIGO);
                        boton.innerHTML = respuestaJSON[i].NOMBRE;
                        div.appendChild(boton); 

                        // Número de Ejemplares
                        let ejemplares = document.createElement("p");
                        ejemplares.setAttribute("id","ejemplares_texto");
                        ejemplares.setAttribute("value",respuestaJSON[i].NUMERO_EJEMPLARES)
                        
                        if(ejemplares.getAttribute("value") == 0){
                            boton.disabled = true;
                            ejemplares.innerHTML = "Hay un total de: <strong> " + respuestaJSON[i].NUMERO_EJEMPLARES + "</strong> ejemplares en <u> " + respuestaJSON[i].NOMBRE + "</u>.";
                            div.appendChild(ejemplares)
                        }else{

                            if(ejemplares.getAttribute("value") == 1){
                                ejemplares.innerHTML = "Hay un total de: <strong> " + respuestaJSON[i].NUMERO_EJEMPLARES + "</strong> ejemplar en <u> " + respuestaJSON[i].NOMBRE + "</u>.";
                                div.appendChild(ejemplares)
                            }else{
                                ejemplares.innerHTML = "Hay un total de: <strong> " + respuestaJSON[i].NUMERO_EJEMPLARES + "</strong> ejemplares en <u> " + respuestaJSON[i].NOMBRE + "</u>.";
                            div.appendChild(ejemplares)
                            }
                        }   
                        
                    }


                    // Ver cuál título hemos seleccionado
                    var titulo = document.querySelectorAll("button#titulo_boton");
        
                    for (titulo_seleccionado of titulo) {
                    
                        titulo_seleccionado.addEventListener("click", (e) => {

                        var hijo = e.target;

                        // Esta función me mostrará información sobre el título elegido
                        mostrar_modal(hijo.getAttribute("value"))

                        })

                    }

                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Realizar Préstamo (Título) ")
                }) 

            }

            function mostrar_modal(codigo_titulo) {

                let BODY = document.querySelector("body");

                // Creación del Modal
                
                var modal = document.createElement("dialog");
                modal.setAttribute("id","modal");
                BODY.appendChild(modal);
                
                // Creamos el Objeto
                ELECCION = {
                    codigo  : codigo_titulo,
                    elegido : "Mostrar_Modal"
                }

                // --- Realizamos Petición Asíncrona con Fetch
                fetch('php/01_realizar_prestamo.php',{
                    method : 'POST',
                    body   : JSON.stringify(ELECCION),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                
                    // Rellenar el Modal

                    let titulo = document.createElement("h1");
                    titulo.setAttribute("id","titulo_modal");
                    titulo.innerHTML = respuestaJSON[0].NOMBRE;
                    modal.appendChild(titulo);

                    let texto_autor = document.createElement("p");
                    texto_autor.setAttribute("id","texto_autor_modal");
                    texto_autor.innerHTML = "Autor del Título: ";
                    modal.appendChild(texto_autor);

                    let autor = document.createElement("p");
                    autor.setAttribute("id","autor_modal");
                    autor.innerHTML = respuestaJSON[0].AUTOR;
                    modal.appendChild(autor);
                    
                    let texto_resumen = document.createElement("p");
                    texto_resumen.setAttribute("id","texto_resumen_modal");
                    texto_resumen.innerHTML = "Resumen del Título: ";
                    modal.appendChild(texto_resumen);

                    let resumen = document.createElement("p");
                    resumen.setAttribute("id","resumen_modal");
                    resumen.innerHTML = respuestaJSON[0].RESUMEN;
                    modal.appendChild(resumen);
                    
                    let texto_fecha = document.createElement("p");
                    texto_fecha.setAttribute("id","texto_fecha_modal");
                    texto_fecha.innerHTML = "Fecha de Publicación: ";
                    modal.appendChild(texto_fecha);

                    let fecha = document.createElement("p");
                    fecha.setAttribute("id","fecha_modal");
                    fecha.innerHTML = respuestaJSON[0].FECHA_PUBLICACION;                    
                    modal.appendChild(fecha);

                    // Hacer Prétamo
                    let form = document.createElement("form");
                    form.setAttribute("id","formulario_modal");
                    modal.appendChild(form);

                    let input = document.createElement("input");
                    input.setAttribute("id","input_prestamo");
                    input.setAttribute("type","button");
                    input.setAttribute("value","Realizar Préstamo");
                    form.appendChild(input);

                    // Mostral Modal
                    modal.showModal();

                    // *********************** EVENTOS ********************** //
                    
                    // Cerrar el Modal
                    let atras_modal = document.createElement("button");
                    atras_modal.setAttribute("id","atras_modal");
                    atras_modal.innerHTML = "Atrás";
                    modal.appendChild(atras_modal);

                    document.getElementById("atras_modal").addEventListener("click",() => { 
                        modal.close(); 
                        modal.removeChild(atras_modal);
                        BODY.removeChild(modal);
                    })

                    // Realizar el Préstamo
                    input.addEventListener("click", () => {
                        
                        modal.close(); 
                        modal.removeChild(atras_modal);
                        BODY.removeChild(modal);

                        // Realizamos el Préstamo
                        hacer_prestamo(codigo_titulo);

                    })

                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Realizar Préstamo (Modal) ")
                })

            }

            function hacer_prestamo(codigo_titulo){

                let padre = document.getElementById("contenedor");
                // Creamos el Objeto
                ELECCION = {
                    codigo  : codigo_titulo,
                    elegido : "Hacer_Prestamo"
                }

                // --- Realizamos Petición Asíncrona con Fetch
                fetch('php/01_realizar_prestamo.php',{
                    method : 'POST',
                    body   : JSON.stringify(ELECCION),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {

                    refrescar(padre);

                    var titulo = document.createElement("h1");
                    titulo.setAttribute("id","titulo_contenedor");
                    titulo.innerHTML = " ¡ Préstamo realizado correctamente !";
                    padre.appendChild(titulo);

                    var parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_contenedor");
                    parrafo.innerHTML = "Aquí se le indica el plazo que dispondrá del libro.";
                    padre.appendChild(parrafo);

                    var FECHAS = document.createElement("p");
                    FECHAS.setAttribute("id","parrafo_contenedor");
                    FECHAS.innerHTML = respuestaJSON.fechaActual + " - " + respuestaJSON.fechaSemana;
                    padre.appendChild(FECHAS);
                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Realizar Préstamo (Hacer Préstamo) ")
                })

            }

//**************************************************************************************************************//
//--------------------------------------------- CONSULTAR PRESTÁMO ---------------------------------------------//
//**************************************************************************************************************//

            function consultar_prestamo() {
                
                // PARTE DEL PDF
                var content = [];

                // Título
                content.push(
                    {
                    text : "Libros Prestados Disponibles Actualmente",
                    background : "#572364", 
                    fontSize : 28,
                    alignment : "center",
                    color : "white"
                    }
                );

                let padre = document.getElementById("contenedor");
                refrescar(padre);

                var titulo = document.createElement("h1");
                titulo.setAttribute("id","titulo_contenedor");
                titulo.innerHTML = "Consultar Préstamos";
                padre.appendChild(titulo);

                var parrafo = document.createElement("p");
                parrafo.setAttribute("id","parrafo_contenedor");
                parrafo.innerHTML = "Aquí esta toda la información sobre sus préstamos: ";
                padre.appendChild(parrafo);

                // PARTE DEL LISTADO 

                // --- Realizamos Petición Asíncrona con Fetch
                fetch('php/02_consultar_prestamos.php',{
                    method : 'POST',
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {

                    for(i = 0 ; i < respuestaJSON.length ; i++){

                        // Para los separadores
                        if(respuestaJSON[i].apartado){
                            var texto = document.createElement("p");
                            texto.setAttribute("id","apartados");
                            texto.innerHTML = respuestaJSON[i].apartado;
                            padre.appendChild(texto);
                        
                        }

                        // Para los listados
                        if(respuestaJSON[i].CODIGO_EJEMPLAR){
                            var texto = document.createElement("p");
                            texto.style.textAlign = "center";
                            texto.innerHTML = "El código del ejemplar es: " + respuestaJSON[i].CODIGO_EJEMPLAR + " y sus fechas correspondientes del préstamo son desde él " + respuestaJSON[i].FECHA_COMIENZO + " al " + respuestaJSON[i].FECHA_DEVOLUCION + "." ;
                            padre.appendChild(texto);
                        
                        }

                        if(respuestaJSON[i].PDF){
                            content.push(
                                {
                                text : "El código del ejemplar es: " + respuestaJSON[i].PDF + " y sus fechas correspondientes del préstamo son desde él " + respuestaJSON[i].FECHA_COMIENZO + " al " + respuestaJSON[i].FECHA_DEVOLUCION + ".",
                                background : "#a645be", 
                                color : "white",
                                margin : [20,5,0,0]
                                }
                            );
                        }

                    }


                    var boton = document.createElement("button");
                    boton.setAttribute("id","crear_pdf");
                    boton.innerHTML = "Generar PDF con los libros prestados actualmente en uso"
                    padre.appendChild(boton);

                    // Ejecuta la función que nos crea el PDF
                    boton.addEventListener('click', (event) => {
                            
                        var docDefinition = {content: content}
                        pdfMake.createPdf(docDefinition).open();

                    }, false);


                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Consultar Préstamo ")
                })


                

            }