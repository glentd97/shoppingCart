const cards = document.querySelector('#cards');
const items = document.querySelector('#items');
const footer = document.querySelector('#footer');
const fragment = document.createDocumentFragment();

const templateCard = document.querySelector('#template-card').content;
const templateCarrito = document.querySelector('#template-carrito').content;
const templateFooter = document.querySelector('#template-footer').content;
let carrito = [];
document.addEventListener('DOMContentLoaded', cargarEventListeners);


function cargarEventListeners() {
    getdata();

    if(localStorage.getItem('datacarrito')){
        carrito=JSON.parse(localStorage.getItem('datacarrito'))
        pintarCarrito();
    }

    cards.addEventListener('click', leerDatos);

    items.addEventListener('click', cambiarCantidad);

    localStorage.getItem(carrito)



}

/// Display de Cards
async function getdata() {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error)
    }
}

function pintarCards(datos) {
    datos.forEach(element => {
        templateCard.querySelector('img').src = element.thumbnailUrl;
        templateCard.querySelector('h5').textContent = element.title;
        templateCard.querySelector('p').textContent = element.precio;
        templateCard.querySelector('.btn-dark').dataset.id = element.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment);

}


//----Leer datos del boton seleccionado
function leerDatos(e) {
    if (e.target.classList.contains('btn-dark')) {
        const curso = e.target.parentElement.parentElement;
        agregarProducto(curso);
        e.stopPropagation()
    }

}

//----Agregar los datos 
function agregarProducto(curso) {
    const infoProducto = {
        id: curso.querySelector('.btn-dark').dataset.id,
        title: curso.querySelector('h5').textContent,
        price: parseInt(curso.querySelector('p').textContent),
        quantity: 1
    }

    if (carrito.some(element => (element.id === infoProducto.id))) {
        const ncarr = carrito.map(e => {
            if (e.id === infoProducto.id) {
                e.quantity++
                return e
            } else {
                return e
            }
        })
        carrito = ncarr;
        pintarCarrito();

    } else {
        carrito = [...carrito, infoProducto]
        pintarCarrito();
    }
}


//---Pintar Carrito
function pintarCarrito() {

    
    items.innerHTML = '';


    carrito.forEach(element => {
        templateCarrito.querySelector('th').textContent = element.id;
        templateCarrito.querySelectorAll('td')[0].textContent = element.title;
        templateCarrito.querySelectorAll('td')[1].textContent = element.quantity;
        templateCarrito.querySelector('td span').textContent = element.quantity * element.price
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })

    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('datacarrito',JSON.stringify(carrito))

}

function pintarFooter() {
    footer.innerHTML = '';
    if (carrito.length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>';
    } else {

        let cantidad = 0
        let total = 0
        carrito.forEach((element => {
            cantidad = cantidad + element.quantity;
            total= total+element.quantity*element.price;
        }))
        templateFooter.querySelectorAll('td')[0].textContent = cantidad;
        templateFooter.querySelector('td span').textContent = total;
        const clone = templateFooter.cloneNode(true);
        fragment.appendChild(clone)
        footer.appendChild(fragment);

        const btnvaciar = footer.querySelector('#vaciar-carrito');
        btnvaciar.addEventListener('click',vaciarCarrito)
       
    }
}

function vaciarCarrito(){
    carrito = [];
    pintarCarrito();
    pintarFooter();
}


function cambiarCantidad(e) {

    const body = e.target.parentElement.parentElement

    if (e.target.classList.contains('btn-info')) {
        const productId = body.querySelector('th').textContent;
        const indice = carrito.findIndex(e => e.id === productId)
        carrito[indice].quantity++
        pintarCarrito();
        console.log(carrito)
    }

    if (e.target.classList.contains('btn-danger')) {
        const productId = body.querySelector('th').textContent;
        const indice = carrito.findIndex(e => e.id === productId)
        carrito[indice].quantity--
        if (carrito[indice].quantity === 0) {
            carrito.splice(indice, 1);
        }
        pintarCarrito();
        console.log(carrito)
    }

}



