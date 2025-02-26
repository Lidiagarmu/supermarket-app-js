let carrito = [];
let productos = {
    frutas: [
        { id: 1, nombre: "Manzana", precio: 2.99, imagen: "resources/manzana.jpg" },
        { id: 2, nombre: "Plátano", precio: 1.99, imagen: "resources/platano.jpg" },
        { id: 3, nombre: "Naranja", precio: 3.49, imagen: "resources/naranja.jpg" }
    ],
    carnes: [
        { id: 4, nombre: "Pollo", precio: 5.99, imagen: "resources/pollo.jpg" },
        { id: 5, nombre: "Ternera", precio: 12.99, imagen: "resources/ternera.jpg" },
        { id: 6, nombre: "Cerdo", precio: 8.49, imagen: "resources/cerdo.jpg" }
    ],
    pescados: [
        { id: 7, nombre: "Salmón", precio: 14.99, imagen: "resources/salmon.jpg" },
        { id: 8, nombre: "Merluza", precio: 9.99, imagen: "resources/merluza.jpg" },
        { id: 9, nombre: "Atún", precio: 11.49, imagen: "resources/atun.jpg" }
    ]
};

function mostrarProductos(categoria) {
    // Actualizar las pestañas
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    if (categoria === 'todos') {
        document.getElementById('todos-tab').classList.add('active');
    } else {
        document.getElementById(`${categoria}-tab`).classList.add('active');
    }

    // Mostrar productos según la categoría
    let productosMostrar = [];
    if (categoria === 'todos') {
        productosMostrar = [...productos.frutas, ...productos.carnes, ...productos.pescados];
    } else {
        productosMostrar = productos[categoria];
    }

    renderizarProductos(productosMostrar);
}

function renderizarProductos(listaProductos) {
    let contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    listaProductos.forEach(prod => {
        contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="card producto-card p-2">
                    <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${prod.nombre}</h5>
                        <p class="card-text"><strong>${prod.precio.toFixed(2)}€</strong></p>
                        <button class="btn btn-success" onclick="agregarAlCarrito(${prod.id})">Añadir al Carrito</button>
                    </div>
                </div>
            </div>`;
    });
}

function agregarAlCarrito(id) {
    let producto;
    for (let categoria in productos) {
        producto = productos[categoria].find(p => p.id === id);
        if (producto) break;
    }

    let productoEnCarrito = carrito.find(p => p.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.cantidad;
    } else {
        carrito.push({ ...producto, cantidad: 1, subtotal: producto.precio });
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    let lista = document.getElementById("lista-carrito");
    let contador = document.getElementById("contador-carrito");

    lista.innerHTML = "";
    contador.textContent = carrito.reduce((total, p) => total + p.cantidad, 0);

    carrito.forEach((p, index) => {
        lista.innerHTML += `
            <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                <strong>${p.nombre}</strong> - ${p.cantidad} x ${p.precio.toFixed(2)}€ 
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">X</button>
            </div>`;
    });
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let totalCompra = carrito.reduce((total, p) => total + p.subtotal, 0);
    let resumen = `<h4>Gracias por tu compra! 🛍️</h4><ul>`;
    carrito.forEach(p => {
        resumen += `<li>${p.cantidad} x ${p.nombre} - ${p.subtotal.toFixed(2)}€</li>`;
    });
    resumen += `</ul><h4>Total: ${totalCompra.toFixed(2)}€</h4>`;

    document.getElementById("resumen-compra").innerHTML = resumen;
    new bootstrap.Modal(document.getElementById("modalCompra")).show();
}

function reiniciarCompra() {
    carrito = [];
    actualizarCarrito();
}

// Mostrar todos los productos al cargar la página
mostrarProductos('todos');
