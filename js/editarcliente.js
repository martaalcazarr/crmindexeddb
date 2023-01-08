//IIFE para que se mantenga local
(function(){

    //let DB;
    let idCliente;
    //selecciono del html por id #
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    //const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{
    conectarDB();

    //actualizar el registro
    formulario.addEventListener('submit', actualizarCliente);

    //verificar el id de la url
    //urlsearchparams es para verificar que parametros tiene esa url
    const parametrosURL = new URLSearchParams(window.location.search);
    //uso get gracias al searchparams
    idCliente = parametrosURL.get('id');
    if(idCliente){
        setTimeout(() => {
            obtenerCliente(idCliente);
        }, 100);
        

    }
    });

    function actualizarCliente(e){
        e.preventDefault();
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput === '' || empresaInput === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            //el id de parametrosurl
            //lo convierto en number porque es un string
            //y el de la db es un number
            id: Number(idCliente)
        }
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        //buscara el id y le hara un put con el clienteactualizado
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Editado correctamente');
            setTimeout(() =>{
                //para que me redirija al indice tras 3s
                window.location.href = 'index.html'
            }, 3000);
        }
        transaction.onerror = function(){
            imprimirAlerta('Ha habido un error', 'error');
        }
    }

    function obtenerCliente(id){
        console.log(id);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                //el id de parametrosurl
                if(cursor.value.id ===  Number(id)){
                    llenarFormulario(cursor.value);
                };
                cursor.continue();
            }
        }
        console.log(objectStore);
    }

    function llenarFormulario(datosCliente){
        //destructuring para extraer los datos que vienen de la db
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);
        abrirConexion.onerror = function(){
            console.log('Ha habido un error');
        };
        abrirConexion.onsuccess = function(){
            //la variable antes declarada DB sirve para abrir el resultado
            DB = abrirConexion.result;
            console.log('ok')

        }
    }
})();