const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `<strong class="font-bold">¡Error!</strong>
                            <span class="block sm:inline">${mensaje}</span>`;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    if (termino === '') {
        mostrarAlerta('Agrega el término a buscar');
        return;
    }

    const key = '22432082-abfeecaf25a055953045d8abe';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

//Generador que registrará la cantidad de páginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    //Limpio el HTML
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Contruir el nuevo HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `<div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                                    <div class="bg-white">
                                        <img class="w-full" src="${previewURL}">

                                        <div class="p-4">
                                            <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                                            <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>

                                            <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase fonts-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
                                        </div>
                                    </div>
                                </div>`;
    });

    //Se limpia el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const {value, done} = iterador.next();
        if (done) return;

        //Se genera el botón para cada elemento
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'hover:bg-blue-500', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}