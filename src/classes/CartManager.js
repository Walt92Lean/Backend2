import { cartModel } from "../models/cart.model.js";

class CartManager {
    async getCarts() {
        return await cartModel.find().lean().populate("products.product");
    }

    async getCartById(id) {        
        return await cartModel.findOne({_id:id}).lean().populate("products.product");
    }

    async createCart() {
        await cartModel.create({products:[]});
    }

    async addProductToCart(cid, pid) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let product = cart.products.find(item => item.product._id == pid);        

        if (product) {
            product.quantity += 1;
        } else {
            product = {product:pid, quantity:1};            
            cart.products.push(product);
        }

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }
    
    async addProductsToCart(cid, products) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        
        products.forEach(item => {            
            let product = cart.products.find(item2 => item2.product == item.product);                    

            if (product) {
                product.quantity += item.quantity;                        
            } else {
                product = {product:item.product, quantity:item.quantity};
                cart.products.push(product);
            }            
        });

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }

    async updateProductFromCart(cid, pid, quantity) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let product = cart.products.find(item => item.product._id == pid);        

        if (product) {
            product.quantity += quantity;
        } else {
            product = {product:pid, quantity:quantity};
            cart.products.push(product);
        }

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }

    async deleteProductFromCart(cid, pid) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let products = cart.products.filter(item => item.product != pid);
            
        await cartModel.updateOne({_id:cid}, {products:products});
    }

    async deleteProductsFromCart(cid) {            
        await cartModel.updateOne({_id:cid}, {products:[]});
    }
}

export default CartManager