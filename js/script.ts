window.addEventListener("load", ():void => {

    (<HTMLInputElement>document.getElementById("btnEnviar")).onclick = (e:any)=>{

        e.preventDefault();
        Main.Login();
    }

});

namespace Main
{
    export async function Login()
    {
        let correo = (<HTMLInputElement>document.getElementById("correo")).value;
        let clave = (<HTMLInputElement>document.getElementById("clave")).value;

        let obj_usuario:any = {};
        obj_usuario.correo = correo;
        obj_usuario.clave = clave;

        let form : FormData = new FormData();
        form.append('obj_usuario', JSON.stringify(obj_usuario));

        const opciones = {
            method: "POST",
            body: JSON.stringify(obj_usuario),
            headers: {"Accept": "*/*", "Content-Type": "application/json"},
        };

        try
        {
            let res = await manejadorFetch(URL_API + "login", opciones);

            let obj_ret = await res.json(); 
            
            console.log(obj_ret);

            let alerta:string = "";

            if(obj_ret.exito)
            {
                localStorage.setItem("jwt", obj_ret.jwt); //guardo en el localstorage                

                alerta = ArmarAlert(obj_ret.mensaje + " redirigiendo al principal.html...");

                setTimeout(() => {
                    location.assign(URL_BASE + "principal.html");
                }, 2000);
            }
            else
            {
                alerta = ArmarAlert(obj_ret.mensaje, "danger");
            }

            // (<HTMLDivElement>document.getElementById("div_mensaje")).innerHTML = alerta;

        } 
        catch (err:any)
        {
            alert('usuario y/o clave incorrecto');
            console.log('usuario y/o clave incorrecto');
        }
    }

}