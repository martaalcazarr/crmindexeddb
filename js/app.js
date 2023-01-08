//para que las variables se creen de forma local function IIFE
(function(){
    
    //let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();
        //en caso de que exista la bd crm
        if(window.indexedDB.open('crm', 1)){
            obtenerClientes();
        }
        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e){
        //el boton eliminar tiene una clase eliminar en el html
        //si e tiene eliminar, ejecuta la funcion
        if(e.target.classList.contains('eliminar')){
            //para acceder al data-cliente(el id) desde dataset
            //lo convierto a number porque el id es string
            const idEliminar = Number(e.target.dataset.cliente);
            //const confirmar = confirm('¿Desea eliminar el cliente definitivamente?');
            
            Swal.fire({
                title: '¿Desea eliminar el cliente definitivamente?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                confirmButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                icon: 'error',
                confirmButtonText: 'Si'
              }).then((result) => {
                if(result.isConfirmed){
                    const transaction = DB.transaction(['crm'], 'readwrite');
                    const objectStore = transaction.objectStore('crm');
                    objectStore.delete(idEliminar);
    
                    transaction.oncomplete = function(){
                        Swal.fire({
                            icon: 'succes',
                            title: 'Eliminado correctamente',
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
    
                        //para eliminar del html
                        e.target.parentElement.parentElement.remove();
                    }
                    transaction.onerror = function(){
                        Swal.fire({
                            icon: 'error',
                            title: 'No se ha podido eliminar',
                            toast: true
                        });
                    }
                }
              })

            //if(confirmar){
                //comienzo una nueva transaccion para eliminar
                
            //}
        }
    }

    //crear la INDEXEDDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = function(){
            console.log('Ha habido un error');
        }
        crearDB.onsucces = function(){
            DB = crearDB.result;
        }
        //solo corre una vez onupgradeneeded
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;
            //creo el objectstore con el nombre crm y le asigno como llave principal 
            //id y que incremente cada vez
            const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

            //crear columnas
            //creo la columna nombre, su keypath nombre y la condicion unique false
            objectStore.createIndex('nombre', 'nombre', {unique:false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique:false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista');
        }

    }

    function obtenerClientes(){
        const abrirConexion = window.indexedDB.open('crm', 1);
        abrirConexion.onerror = function(){
            console.log('hubo un error');
        };
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    //console.log(cursor.value)
                    //destructuring
                    const {nombre, empresa, email, telefono, id } = cursor.value;
                    
                    listadoClientes.innerHTML += ` <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-purple-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                    </td>
                </tr>
            `;
                    cursor.continue();
                }else{
                    console.log('No hay más registros')
                }
            }
        }
    }
})();