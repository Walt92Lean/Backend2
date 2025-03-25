import express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/productRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./classes/ProductManager.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import session from "express-session";
import MongoStore from "connect-mongo";

import passport from "passport";
import initializePassport from "./config/passport.config.js";

//Import Routes
import sessionsRouter from "./routes/sessions.router.js";
import usersViewRouter from "./routes/users.views.router.js"; 

const app = express();
dotenv.config();

app.get('/favicon.ico', (req, res) => res.status(204).end());

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);






//configuraciones de PASSPORT

initializePassport ();
app.use(passport.initialize());


//Declaro Routers
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);


const SERVER_PORT = process.env.SERVER_PORT
const httpServer = app.listen(SERVER_PORT, () => {
    console.log("Servidor activo: " + SERVER_PORT);
})
const socketServer = new Server(httpServer);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("✅ Conectado a MongoDB Atlas");

    // Iniciar sesión después de la conexión a MongoDB
    app.use(session({
        secret: "secretcode",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            ttl: 60
        }),
    }));
})
.catch(err => console.error("❌ Error al conectar con MongoDB", err));
    

socketServer.on("connection", async socket => {
    const PM = new ProductManager();
    const products = await PM.getProducts();
    
    socket.emit("realtimeproducts", products);

    socket.on("nuevoProducto", async data => {
        const product = {title:data.title, description:data.description, code:data.code, price:data.price, category:data.category, thumbnails:[data.image]};
        await PM.addProduct(product);
        console.log("Se agregó un nuevo Producto!");
        const products = await PM.getProducts();
        console.log(products)
        socket.emit("realtimeproducts", products);
    })

    socket.on("eliminarProducto", async data => {
        await PM.deleteProduct(data);
        console.log("Se eliminó un Producto!");
        const products = await PM.getProducts();
        socket.emit("realtimeproducts", products);
    })
})