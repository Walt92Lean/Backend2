import { Router } from "express";
import CartManager from "../classes/CartManager.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.get("/", async (req, res) => {
    const carts = await CM.getCarts();
    res.send(carts);
})
cartsRouter.get("/:cid", async (req, res) => {
    let cid = req.params.cid;
    let cart = await CM.getCartById(cid);
    
    res.send(cart)
})
cartsRouter.post("/", async (req, res) => {
    await CM.createCart();
    res.send({"estado":"OK", "mensaje":"El carrito se creó correctamente!"});
})
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await CM.addProductToCart(cid, pid);
    res.send({"estado":"OK", "mensaje":"Se agregó el Producto al Carrito!"});
})
cartsRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;    
    await CM.addProductsToCart(cid, products);
    res.send({"estado":"OK", "mensaje":"Se actualizó el Carrito!"});
})
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;    
    await CM.updateProductFromCart(cid, pid, quantity);
    res.send({"estado":"OK", "mensaje":"Se actualizó el Carrito!"});
})
cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await CM.deleteProductFromCart(cid, pid);
    res.send({"estado":"OK", "mensaje":"Se eliminó el Producto del Carrito!"});
})
cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    await CM.deleteProductsFromCart(cid);
    res.send({"estado":"OK", "mensaje":"Se vacío el Carrito!"});
})

export default cartsRouter