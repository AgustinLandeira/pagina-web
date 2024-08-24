# CRUD de Usuarios en una Página Web

## Descripción
Este proyecto es una aplicación web que permite gestionar usuarios a través de un sistema CRUD (Crear, Leer, Actualizar, Eliminar). Utiliza HTML, async y await para enviar peticiones al servidor, donde se encuentra la lógica del backend.

## Instalación
Para que el proyecto funcione correctamente, sigue estos pasos:

1. **Instala las dependencias del backend:**
   - Accede a la carpeta `back-end_SP`.
   - Ejecuta el siguiente comando en la terminal:
     ``` npm install```

2. **Inicia el servidor:**
   - Corre el servidor con el siguiente comando:
     ```node <nombre-de-tu-archivo>.ts```

3. **Configura XAMPP:**
   - Asegúrate de que XAMPP esté corriendo con Apache y MySQL.
   - Coloca el proyecto dentro de la carpeta `htdocs` de XAMPP.
   - importa la base de datos llamada jugueteria en el XAMPP.

## Uso
1. Abre el archivo `logint.html` en tu navegador.
2. Inicia sesión con un usuario válido.
3. Una vez autenticado, serás redirigido al archivo `principal.html`, donde podrás realizar operaciones CRUD (agregar, eliminar, modificar y listar) sobre una entidad. Esto solo será posible si el token está validado.
