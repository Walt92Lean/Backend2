import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cookieParser from 'cookie-parser';
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//Import Routes
import sessionsRouter from "./routes/sessions.router.js";
import usersViewRouter from "./routes/users.views.router.js"; 
import productsRouter from "./routes/productRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./classes/ProductManager.js";

const app = express();
dotenv.config();

app.get('/favicon.ico', (req, res) => res.status(204).end());

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// 

//Cookies
//router.use(cookieParser());
app.use(cookieParser("CoderS3cr3tC0d3"));

app.use(session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 60
    }),
}));

// 
initializePassport();
app.use(passport.initialize());

// Routers
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const httpServer = app.listen(SERVER_PORT, () => {
    console.log("Servidor activo en el puerto: " + SERVER_PORT);
});

// Conectar a MongoDB después de configurar los middlewares
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("❌ Error al conectar con MongoDB", err));

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    const PM = new ProductManager();
    const products = await PM.getProducts();
    
    socket.emit("realtimeproducts", products);

    socket.on("nuevoProducto", async (data) => {
        const product = {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            category: data.category,
            thumbnails: [data.image]
        };
        await PM.addProduct(product);
        console.log("Se agregó un nuevo Producto!");
        const products = await PM.getProducts();
        socket.emit("realtimeproducts", products);
    });

    socket.on("eliminarProducto", async (data) => {
        await PM.deleteProduct(data);
        console.log("Se eliminó un Producto!");
        const products = await PM.getProducts();
        socket.emit("realtimeproducts", products);
    });
});