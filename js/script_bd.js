"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener("load", () => {
    VerificarJWT();
    AdministrarVerificarJWT();
    AdministrarListar();
    AdministrarAgregar();
});
function VerificarJWT() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = localStorage.getItem("jwt");
        try {
            const opciones = {
                method: "GET",
                headers: { 'Authorization': 'Bearer ' + jwt },
            };
            let res = yield manejadorFetch(URL_API + "login", opciones);
            let obj_rta = yield res.json();
            console.log(obj_rta);
            if (obj_rta.exito) {
                let nombreUsuarioSpan = document.getElementById("nombre_usuario");
                nombreUsuarioSpan.innerText = obj_rta.jwt.usuario.nombre;
            }
            else {
                setTimeout(() => {
                    location.assign(URL_BASE + "login.html");
                }, 1500);
            }
        }
        catch (err) {
            alert("jwt no valido!");
            setTimeout(() => {
                location.assign(URL_BASE + "login.html");
            }, 1500);
        }
    });
}
function AdministrarVerificarJWT() {
}
function AdministrarListar() {
    console.log("llego");
    document.getElementById("listado_juguetes").onclick = () => {
        ObtenerListadoJuguete();
    };
}
function AdministrarAgregar() {
    document.getElementById("alta_juguete").onclick = () => {
        ArmarFormularioAlta();
    };
}
function ObtenerListadoJuguete() {
    return __awaiter(this, void 0, void 0, function* () {
        VerificarJWT();
        document.getElementById("divTablaIzq").innerHTML = "";
        let jwt = localStorage.getItem("jwt");
        console.log("estoy adentro de la funcion");
        try {
            const opciones = {
                method: "GET",
                headers: { 'authorization': 'Bearer ' + jwt },
            };
            let res = yield manejadorFetch(URL_API + "toys", opciones);
            let obj_rta = yield res.json();
            console.log(obj_rta);
            let tabla = ArmarTablaJuguetes(obj_rta.tabla);
            document.getElementById("divTablaIzq").innerHTML = tabla;
            document.querySelectorAll('[data-action="modificar"]').forEach((btn) => {
                btn.onclick = function () {
                    let obj_prod_string = this.getAttribute("data-obj_prod");
                    let obj_prod = JSON.parse(obj_prod_string);
                    let formulario = MostrarForm("modificacion", obj_prod);
                    document.getElementById("divTablaDer").innerHTML = formulario;
                };
            });
            document.querySelectorAll('[data-action="eliminar"]').forEach((btn) => {
                btn.onclick = function () {
                    let obj_prod_string = this.getAttribute("data-obj_prod");
                    let obj_prod = JSON.parse(obj_prod_string);
                    let formulario = MostrarForm("baja", obj_prod);
                    document.getElementById("divTablaDer").innerHTML = formulario;
                };
            });
        }
        catch (err) {
            Fail(err);
        }
    });
}
function ArmarTablaJuguetes(juguetes) {
    let tabla = '<table class="table">';
    tabla += '<tr><th>ID</th><th>MARCA</th><th>PRECIO</th><th>FOTO</th><th>Acciones</th>/';
    if (juguetes.length == 0) {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td></tr>';
    }
    else {
        juguetes.forEach((juguete) => {
            tabla += "<tr><td>" + juguete.id + "</td>" +
                "<td>" + juguete.marca + "</td><td>" + juguete.precio + "</td>" +
                "<td><img src='" + URL_API + "juguetes/fotos/" + juguete.path_foto + "' width='50px' height='50px'></td><th>" + "<br>" +
                "<button class='btn' data-action='eliminar' data-obj_prod='" + JSON.stringify(juguete) + "' title='Eliminar' style='background-color: green; '>Eliminar</button>" +
                "<button class='btn' data-action='modificar' data-obj_prod='" + JSON.stringify(juguete) + "' title='Modificar' style='background-color: yellow; '>Modificar</button>" +
                "</td></tr>";
        });
    }
    tabla += "</table>";
    return tabla;
}
function ArmarFormularioAlta() {
    var _a;
    VerificarJWT();
    document.getElementById("divTablaDer").innerHTML = "";
    let formulario = MostrarForm("alta");
    document.getElementById("divTablaDer").innerHTML = formulario;
    (_a = document.getElementById("btn_modal")) === null || _a === void 0 ? void 0 : _a.click();
}
function MostrarForm(accion, obj_prod = null) {
    let funcion = "";
    let encabezado = "";
    let solo_lectura = "";
    let solo_lectura_pk = "readonly";
    let value = "";
    switch (accion) {
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
    let id = 0;
    let marca = "";
    let precio = "";
    let path = URL_BASE + "/img/producto_default.png";
    if (obj_prod !== null) {
        id = obj_prod.id;
        marca = obj_prod.marca;
        precio = obj_prod.precio;
        path = URL_API + obj_prod.path_foto;
    }
    let form = `<div class="container-fluid">
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
                            <img src='${URL_API}juguetes/fotos/${obj_prod.path_foto}' width="320" height="150px">
                        </div>
                    </form>


                </div>

            </div>

        </div>

    </div>
    `;
    return form;
}
function Agregar(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        let jwt = localStorage.getItem("jwt");
        let marca = document.getElementById("txtMarca").value;
        let precio = parseInt(document.getElementById("txtPrecio").value);
        let foto = document.getElementById("txtFoto");
        let pathFoto = foto.files[0];
        let obj_prod = {
            "marca": marca,
            "precio": precio
        };
        let form = new FormData();
        form.append('foto', pathFoto);
        form.append('juguete_json', JSON.stringify(obj_prod));
        const opciones = {
            method: "POST",
            body: form,
            headers: { 'Authorization': 'Bearer ' + jwt }
        };
        try {
            let res = yield fetch(URL_API + "toys", opciones);
            let obj_rta = yield res.json();
            if (obj_rta.exito) {
                alert(obj_rta.mensaje);
                console.log("¡Juguete agregado!");
                ObtenerListadoJuguete();
            }
            else {
                console.log("¡Error al agregar el juguete!");
            }
        }
        catch (err) {
            console.error('No tiene el permiso  para agregar', err);
            alert('No tiene el permiso  para agregar');
        }
    });
}
function Modificar(e) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = parseInt(document.getElementById("id_juguete").value);
        let marca = document.getElementById("txtMarca").value;
        let precio = parseInt(document.getElementById("txtPrecio").value);
        let foto = document.getElementById("txtFoto");
        let path_foto = foto.files[0];
        let jwt = localStorage.getItem("jwt");
        let dato = {};
        dato.id_juguete = id;
        dato.marca = marca;
        dato.precio = precio;
        let form = new FormData();
        form.append('juguete', JSON.stringify(dato));
        form.append('id_juguete', dato.id_juguete);
        form.append('foto', path_foto);
        const opciones = {
            method: "PUT",
            body: form,
            headers: { 'authorization': 'Bearer ' + jwt },
        };
        try {
            let res = yield manejadorFetch(URL_API + "toys", opciones);
            let obj_rta = yield res.json();
            if (obj_rta.exito) {
                alert(obj_rta.mensaje);
                ObtenerListadoJuguete();
            }
            else {
                alert(obj_rta.mensaje);
            }
        }
        catch (error) {
            Fail(error);
        }
    });
}
function Eliminar(e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("id_juguete").value);
    let marca = document.getElementById("txtMarca").value;
    let precio = parseInt(document.getElementById("txtPrecio").value);
    var mensaje = '¿Está seguro de eliminar el juguete que tiene la marca ' + marca + ' a ' + precio + ' pesos?';
    var confirmar = confirm(mensaje);
    if (confirmar) {
        ContinuarEliminar(id);
    }
    else {
        console.log('Eliminación cancelada');
    }
}
function ContinuarEliminar(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = localStorage.getItem("jwt");
        let dato = { id_juguete: id };
        const opciones = {
            method: "DELETE",
            body: JSON.stringify(dato),
            headers: { 'authorization': 'Bearer ' + jwt, "Accept": "*/*", "Content-Type": "application/json" },
        };
        try {
            let res = yield manejadorFetch(URL_API + "toys", opciones);
            let obj_rta = yield res.json();
            if (obj_rta.exito) {
                console.log(obj_rta.mensaje);
                alert(obj_rta.mensaje);
                ObtenerListadoJuguete();
            }
            else {
                console.log(obj_rta.mensaje);
                alert(obj_rta.mensaje);
            }
        }
        catch (error) {
            Fail(error);
        }
    });
}
//# sourceMappingURL=script_bd.js.map