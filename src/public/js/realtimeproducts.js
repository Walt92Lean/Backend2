const socket = io();

socket.on("realtimeproducts", data => {
    limpiarSelectEliminarProducto();
    let contenidoHTML = "";

    data.payload.forEach(item => {
        contenidoHTML += `<div class="col-md-3">
            <div class="card text-center border-0 fw-light">
                <img src="${item.thumbnails[0]}" class="img-fluid" alt="${item.title}">
                <div class="card-body">
                    <p class="card-text">${item.title}</p>
                    <p class="card-text">$${item.price}</p>
                </div>
            </div>
        </div>`;

        agregarItemEliminarProducto(item);
    });

    contenidoHTML += "</ul>";
    document.getElementById("content").innerHTML = contenidoHTML;
})

const agregarProducto = () => {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const code = document.getElementById("code");
    const price = document.getElementById("price");
    const category = document.getElementById("category");
    const image = document.getElementById("image");
    const product = {title:title.value, description:description.value, code:code.value, price:price.value, category:category.value, image:image.value};
    socket.emit("nuevoProducto", product);
    title.value = "";   
    description.value = "";   
    code.value = "";
    price.value = "";  
    category.value = "";   
    image.value = "";
    document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success" role="alert">El producto se agregó correctamente!</div>`;
}

const limpiarSelectEliminarProducto = () => {
    const productId = document.getElementById("product_id");
    productId.innerHTML = "";
}

const agregarItemEliminarProducto = (item) => {
    const productId = document.getElementById("product_id");
    let option = document.createElement("option");    
    option.value = item._id;
    option.innerHTML = "Producto: " + item.title;
    productId.appendChild(option);
}

const eliminarProducto = () => {
    const product_id = document.getElementById("product_id").value;
    socket.emit("eliminarProducto", product_id);
    document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success" role="alert">El producto se eliminó correctamente!</div>`;
}