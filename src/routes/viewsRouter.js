import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

const viewsRouter = Router();
const PM = new ProductManager();

viewsRouter.get("/", async (req, res) => {
    const {limit, page, query, sort} = req.query; 
    let products = await PM.getProducts(limit, page, query, sort);

    res.render("index", {products:products});
})

viewsRouter.get("/products/", async (req, res) => {
    const {limit, page, query, sort} = req.query; 
    let products = await PM.getProducts(limit, page, query, sort);

    res.render("index", {products:products});
})

viewsRouter.get("/products/:pid", async (req, res) => {
    const {pid} = req.params;    
    let product = await PM.getProductById(pid);

    res.render("product", {product:product});
})

/*viewsRouter.get("/cart", async (req, res) => {
    try {
        const cart = await cart.find();
        res.render("cart", { cart });
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});*/

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})




export default viewsRouter