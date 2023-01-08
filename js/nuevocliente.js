//function IIFE para dejar la variable local
(function(){
    //let DB;
    //const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
        //conectar a la DB
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });
   
    //es un submit entonces le paso el evento e y prevent default
    function validarCliente(e){
        e.preventDefault();
        console.log('validando...');

        //leer los inputs
        //selecciono por su id #
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        //crear un nuevo objeto con la informacion
        //object literal enhancement para juntar mis variables separadas
        //en un solo objeto cliente
        const cliente = {
            nombre : nombre,
            email : email,
            telefono: telefono,
            empresa: empresa,
            id : Date.now()
        }
        console.log(cliente);
        crearNuevoCliente(cliente);
    }
    function crearNuevoCliente(cliente){
        //creo la variable transaccion para acceder a la db crm modo readwrite
        //const transaction = DB.transaction(['crm'], 'readwrite');
        //defino el objectstore(necesario para indexeddb)
        //const objectStore = transaction.objectStore('crm');
        //para agregar un nuevo registro de cliente 
        //objectStore.add(cliente);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);
        objectStore.add(cliente);

        transaction.oncomplete = () => {
            console.log('Cliente Agregado');

            imprimirAlerta('Cliente agregado correctamente');

            setTimeout(() =>{
                window.location.href = 'index.html'
            }, 3000)
        }
        transaction.onerror = function(){
            imprimirAlerta('Ha habido un error');
        };
        
        

    }
    

   
})();