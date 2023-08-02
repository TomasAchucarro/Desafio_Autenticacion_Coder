import messageModel from "./dao/models/message.model.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsProductsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";

const run = (io, app) => {
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/sessions", sessionRouter);
  app.use("/products", viewsProductsRouter);

  io.on("connection", async (socket) => {
    socket.on("productList", (data) => {
      console.log(data);
      io.emit("updatedProducts", data);
    });
    socket.on("cartList", (data) => {
      io.emit("updatedCarts", data);
    });

    let messages = (await messageModel.find()) ? await messageModel.find() : [];

    socket.broadcast.emit("alerta");
    socket.emit("logs", messages);
    socket.on("message", (data) => {
      messages.push(data);
      messageModel.create(messages);
      io.emit("logs", messages);
    });
  });

  app.get("/", (req, res) => res.render("index", { name: "CoderHouse" }));
};

export default run;