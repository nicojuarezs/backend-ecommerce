const express = require("express")
const app = express();
const cors = require('cors')

const user_routes = require("./routes/user.routes");
const product_routes = require('./routes/product.routes')

//Middlewares
//CORS
app.use(cors())

//Poder interpretar los datos que vienen en el body de una peticion
app.use(express.json())

app.use("/api", [
    user_routes,
    product_routes
])

module.exports = app;