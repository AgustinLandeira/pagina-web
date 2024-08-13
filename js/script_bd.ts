window.addEventListener("load", ():void => {

    VerificarJWT();

    AdministrarVerificarJWT();

    //AdministrarLogout();

    AdministrarListar();

    AdministrarAgregar();

});

async function VerificarJWT() : Promise<void>
{
    let jwt : string | null = localStorage.getItem("jwt"); //recupero del localstorage

    try
    {
        const opciones = {
            method: "GET",
            headers : {'Authorization': 'Bearer ' + jwt},
        };

        let res = await manejadorFetch(URL_API + "login", opciones);

        let obj_rta = await res.json();

        console.log(obj_rta);

        if(obj_rta.exito)
        {
            let nombreUsuarioSpan = document.getElementById("nombre_usuario") as HTMLSpanElement;
            nombreUsuarioSpan.innerText = obj_rta.jwt.usuario.nombre;
            
        }
        else
        {
            // let alerta : string = ArmarAlert(obj_rta.mensaje, "danger");

            // (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

            setTimeout(() => {
                location.assign(URL_BASE + "login.html");
            }, 1500);
        }

    }
    catch (err:any)
    {
        // Fail(err);
        alert("jwt no valido!");
        setTimeout(() => {
            location.assign(URL_BASE + "login.html");
        }, 1500);
    }     
}

function AdministrarVerificarJWT() : void
{
    // (<HTMLInputElement>document.getElementById("verificarJWT")).onclick = ()=>{
    //     VerificarJWT();
    // };
}

// function AdministrarLogout() : void
// {
//     (<HTMLInputElement>document.getElementById("logout")).onclick = ()=>{

//         localStorage.removeItem("jwt"); //elimino del localstoragae

//         let alerta : string = ArmarAlert('Usuario deslogueado!!!');

//         (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

//         setTimeout(() => {
//             location.assign(URL_BASE + "login.html");
//         }, 1500);

//     };
// }

function AdministrarListar() : void
{
    console.log("llego");
    (<HTMLInputElement>document.getElementById("listado_juguetes")).onclick = ()=>{
        ObtenerListadoJuguete();
    };
}

function AdministrarAgregar() : void
{
    (<HTMLInputElement>document.getElementById("alta_juguete")).onclick = ()=>{
        ArmarFormularioAlta()
    };
}


async function ObtenerListadoJuguete() : Promise<void>
{
    VerificarJWT();
    (<HTMLDivElement>document.getElementById("divTablaIzq")).innerHTML = "";

    //RECUPERO DEL LOCALSTORAGE el token
    let jwt : string | null = localStorage.getItem("jwt");//agarro el token que guardamos del login
    console.log("estoy adentro de la funcion");
    try{
        const opciones ={

            method : "GET",
            headers : {'authorization': 'Bearer ' + jwt},
        };

        let res = await manejadorFetch(URL_API + "toys",opciones);

        let obj_rta = await res.json();

        console.log(obj_rta);

        let tabla : string = ArmarTablaJuguetes(obj_rta.tabla);

        (<HTMLDivElement>document.getElementById("divTablaIzq")).innerHTML = tabla;

        //boton modificar
        document.querySelectorAll('[data-action="modificar"]').forEach((btn:any)=>{

            btn.onclick = function (){
                let obj_prod_string : any = this.getAttribute("data-obj_prod");
                let obj_prod = JSON.parse(obj_prod_string);

                let formulario = MostrarForm("modificacion",obj_prod);
                

                (<HTMLDivElement>document.getElementById("divTablaDer")).innerHTML = formulario;
            }
        });

        document.querySelectorAll('[data-action="eliminar"]').forEach((btn:any)=>{

            btn.onclick = function (){
                let obj_prod_string : any = this.getAttribute("data-obj_prod");
                let obj_prod = JSON.parse(obj_prod_string);

                let formulario = MostrarForm("baja",obj_prod);

                (<HTMLDivElement>document.getElementById("divTablaDer")).innerHTML = formulario;
            }
        });



    }catch(err:any){

        Fail(err);
    }     

}

function ArmarTablaJuguetes(juguetes : []) : string 
{   
    let tabla : string = '<table class="table">';
    tabla += '<tr><th>ID</th><th>MARCA</th><th>PRECIO</th><th>FOTO</th><th>Acciones</th>/';

    if(juguetes.length == 0)
    {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td></tr>';
    }
    else // ARMO EL LISTADO
    {
        juguetes.forEach((juguete : any) => {
            tabla += "<tr><td>"+juguete.id+"</td>" +
            "<td>"+juguete.marca+"</td><td>"+juguete.precio+"</td>"+
            "<td><img src='"+URL_API+"juguetes/fotos/"+juguete.path_foto+"' width='50px' height='50px'></td><th>"+"<br>"+
            "<button class='btn' data-action='eliminar' data-obj_prod='"+JSON.stringify(juguete)+"' title='Eliminar' style='background-color: green; '>Eliminar</button>"+
            "<button class='btn' data-action='modificar' data-obj_prod='"+JSON.stringify(juguete)+"' title='Modificar' style='background-color: yellow; '>Modificar</button>"+
            "</td></tr>";
        });
    }

    tabla += "</table>";

    return tabla;
}

function ArmarFormularioAlta() : void
{
    VerificarJWT();
    (<HTMLDivElement>document.getElementById("divTablaDer")).innerHTML = ""; //DEJO VACIO EL DIV PARA POSTERIORMENTE DARLE EL FORM ALTA EN LA TABLA DE LA DERECHA

    let formulario : string = MostrarForm("alta"); // ESPECIFICO QEU FORM ES

    (<HTMLDivElement>document.getElementById("divTablaDer")).innerHTML = formulario; //LE ADOR EL FORM ALTA AL DIV

    document.getElementById("btn_modal")?.click();
}

function MostrarForm(accion : string, obj_prod : any = null) : string 
{
    let funcion : string = "";
    let encabezado : string = "";
    let solo_lectura : string = "";
    let solo_lectura_pk : string = "readonly";
    let value :string = "";

    switch (accion) {// DEPENDIENDO QUE ACCION SEA EL ENCABEZADO VA A SER DISTINTO, Y TAMBIEN LOS ATRIBUTOS EN DONDE PODREMOS LEER O INGRESAR VALORES
        case "alta":
            funcion = 'Agregar(event)';
            encabezado = 'AGREGAR PRODUCTO';
            solo_lectura_pk = "";
            value = "Agregar";
            break;

         case "baja":
            funcion = 'Eliminar(event)';
            encabezado = 'ELIMINAR PRODUCTO';
            solo_lectura = "readonly";
            value = "Eliminar";
            break;
    
        case "modificacion":
            funcion = 'Modificar(event)';
            encabezado = 'MODIFICAR PRODUCTO';
            value = "Modificar";
            break;
    }
    //INICIALIZA LOS ATRIBUTOS
    let id : number = 0;
    let marca : string = "";
    let precio : string = "";
    let path : string = URL_BASE + "/img/producto_default.png";

    if (obj_prod !== null) //SI SE PASO UN JUGUETE VA A DARLE VALOR A LAS VARIABLES VACIAS PARA EL FORMALTA DE LO CONTRARIO LOS INPUTS VAN A ESTAR VACIOS
    {
        id = obj_prod.id;
        marca = obj_prod.marca;
        precio = obj_prod.precio;
        path = URL_API + obj_prod.path_foto;       
    }

    let form :string = `<div class="container-fluid">
        <br>
        <div class="row">
            <div class="offset-4 col-8 text-info">
                <h2>
                    ${encabezado}
                </h2>
            </div>
        </div>

        <div class="row">

            <div class="offset-4 col-6">

                <div class="form-bottom" style="background-color: darkcyan;">

                    <form role="form" action="" method="" class="">
                        <br>
                        <input type="hidden" id="id_juguete" value="${id}">
                        <div class="form-group">                                  
                            <div class="input-group m-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text fas fa-trademark" value="TM"></span> 
                                    <input type="text" class="form-control" name="marca" id="txtMarca" style="width:248px;" placeholder="Marca" value= "${marca}" ${solo_lectura} />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">    
                            <div class="input-group m-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text fas fa-dollar-sign"></span> 
                                    <input type="text" class="form-control" name="precio" id="txtPrecio" style="width:250px;" placeholder="Precio" value="${precio}" ${solo_lectura} />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="input-group m-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text fas fa-camera"></span> 
                                    <input type="file" class="form-control" name="foto" id="txtFoto" style="width:250px;" placeholder="Foto"  ${solo_lectura} />
                                </div>
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-6">
                                <button type="button" class="btn btn-success btn-block" id="btnEnviar" onclick="${funcion}">${value}</button>
                            </div>
                            <div class="col-6">
                                <button type="reset" class="btn btn-warning btn-block" id="btnEnviar">Limpiar</button>
                            </div>
                        </div>

                        <br>

                        <div class="photo-container">
                            <img src='${URL_API}juguetes/fotos/${ obj_prod.path_foto}' width="320" height="150px">
                        </div>
                    </form>


                </div>

            </div>

        </div>

    </div>
    `

    return form;
}

//#region CRUD

async function Agregar(e : any) : Promise<void>
{  
    e.preventDefault();

    let jwt: string | null = localStorage.getItem("jwt");

    let marca = (<HTMLInputElement>document.getElementById("txtMarca")).value;
    let precio = parseInt((<HTMLInputElement>document.getElementById("txtPrecio")).value);
    let foto : any = (<HTMLInputElement> document.getElementById("txtFoto"));
    let pathFoto = foto.files[0];

    let obj_prod = {
        "marca": marca,
        "precio": precio
    };

    let form: FormData = new FormData();
    form.append('foto', pathFoto);
    form.append('juguete_json', JSON.stringify(obj_prod));

    const opciones = {
        method: "POST",
        body: form,
        headers: { 'Authorization': 'Bearer ' + jwt }
    };

    try {
        let res = await fetch(URL_API + "toys", opciones);
    
        let obj_rta = await res.json();
    
        if (obj_rta.exito) {
            alert(obj_rta.mensaje);
            console.log("¡Juguete agregado!");
            ObtenerListadoJuguete();
        } else {
            console.log("¡Error al agregar el juguete!");
        }
    } catch (err: any) {
        console.error('No tiene el permiso  para agregar', err);
        alert('No tiene el permiso  para agregar');
    }
}

async function Modificar(e : any) : Promise<void> 
{  
    //recupero los datos ingresados en los inputs
    let id = parseInt((<HTMLInputElement>document.getElementById("id_juguete")).value);
    let marca = (<HTMLInputElement>document.getElementById("txtMarca")).value;
    let precio = parseInt((<HTMLInputElement>document.getElementById("txtPrecio")).value);
    let foto : any = (<HTMLInputElement> document.getElementById("txtFoto"));
    let path_foto = foto.files[0];
    //RECUPERO DEL LOCALSTORAGE el token
    let jwt : string | null = localStorage.getItem("jwt");//agarro el token que guardamos del login

    
    let dato:any = {};
    dato.id_juguete = id;
    dato.marca = marca;
    dato.precio = precio;

    let form : FormData = new FormData();
    form.append('juguete', JSON.stringify(dato));
    form.append('id_juguete', dato.id_juguete);
    form.append('foto', path_foto);

    const opciones = {

        method: "PUT",
        body: form,
        headers : {'authorization': 'Bearer ' + jwt},
    }

    try {
        let res = await manejadorFetch(URL_API + "toys",opciones);

        let obj_rta = await res.json();

        if(obj_rta.exito){

            alert(obj_rta.mensaje);
            ObtenerListadoJuguete();

            // let alerta = ArmarAlert(obj_rta.mensaje);
            // (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }else{
            alert(obj_rta.mensaje);

            // let alerta = ArmarAlert(obj_rta.mensaje,"danger");
            // (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
    } catch (error) {
        
        Fail(error);
    }
}

function Eliminar(e : any) : void 
{
    e.preventDefault();
    
    let id = parseInt((<HTMLInputElement>document.getElementById("id_juguete")).value);
    let marca = (<HTMLInputElement>document.getElementById("txtMarca")).value;
    let precio = parseInt((<HTMLInputElement>document.getElementById("txtPrecio")).value);

    // Crear el mensaje
    var mensaje = '¿Está seguro de eliminar el juguete que tiene la marca ' + marca + ' a ' + precio + ' pesos?';

    // Mostrar el mensaje en un alert y capturar la respuesta
    var confirmar = confirm(mensaje);

    // Verificar la respuesta del usuario
    if (confirmar) {
        // Si el usuario confirma, llamar a la función para continuar la eliminación
        ContinuarEliminar(id);
    } else {
        // Si el usuario cancela, puedes hacer algo más si lo necesitas
        console.log('Eliminación cancelada');
    }
    
    
    // (<HTMLDivElement>document.getElementById("cuerpo_modal_confirm")).innerHTML = '\<h5>¿Está seguro de eliminar el juguete que tiene la marca '+marca+ ' a '+precio+' pesos?</h5> \
    // <input type="button" class="btn btn-danger" data-dismiss="modal" value="NO" style="float:right;margin-left:5px">\
    // <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="ContinuarEliminar('+id+')" style="float:right">Sí </button>';

    // document.getElementById("btn_modal_confirm")?.click();

}

async function ContinuarEliminar(id : any) : Promise<void>
{
    //RECUPERO DEL LOCALSTORAGE el token
    let jwt : string | null = localStorage.getItem("jwt");//agarro el token que guardamos del login

    let dato = { id_juguete: id };  // El objeto de datos con el código del producto

    const opciones = {

        method: "DELETE",
        body: JSON.stringify(dato),
        headers : {'authorization': 'Bearer ' + jwt,"Accept": "*/*", "Content-Type": "application/json"},
    }

    try {
        let res = await manejadorFetch(URL_API + "toys",opciones);

        let obj_rta = await res.json();

        if(obj_rta.exito){
            console.log(obj_rta.mensaje);
            alert(obj_rta.mensaje);
            ObtenerListadoJuguete();
            //let alerta = ArmarAlert(obj_rta.mensaje);
            //(<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }else{
            console.log(obj_rta.mensaje);
            alert(obj_rta.mensaje);
            // let alerta = ArmarAlert(obj_rta.mensaje,"danger");
            // (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
    } catch (error) {
        
        Fail(error);
    }
    
}

//#endregion