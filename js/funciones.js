let DB;

const formulario = document.querySelector('#formulario');

function conectarDB(){
    //declaro una variable para abrir la db crm
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = function(){
        console.log('Ha habido un error');
    };
    abrirConexion.onsuccess = function(){
        //la variable antes declarada DB sirve para abrir el resultado
        DB = abrirConexion.result;
        console.log('ok')

    }
};

function imprimirAlerta(mensaje, tipo){
    //para que no muestre más de una alerta a la vez
    //selecciono por clase
    const alerta = document.querySelector('.alerta');
    if(!alerta){

    //crear alerta
    const divMensaje = document.createElement('div');
    //añado clases de tailwind
    divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    if(tipo === 'error'){
        divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
    } else {
        divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }
    //añado el mensaje que le pase a la alerta al div
    divMensaje.textContent = mensaje;
    //agrego el div a formulario
    formulario.appendChild(divMensaje);
    //que desaparezca el div tras 3 seg
    setTimeout(() =>{
        divMensaje.remove()
    }, 3000);
}
}