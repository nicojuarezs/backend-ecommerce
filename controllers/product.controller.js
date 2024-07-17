const Product = require('../models/product.model');

async function getProducts(req, res) {
    try {
        const products = await Product.find().populate("category", "name");
        res.status(200).send({
            ok: true,
            message: "Productos obtenidos correctamente",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener los productos"
        });
    }
}

async function getProductById(req, res) {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate("category", "name")
        
        if (!product) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Producto obtenido correctamente",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener el producto"
        });
    }
}

//Crear productos
async function postProduct(req, res) {
    try {

        const product = new Product(req.body);

        if(req.file?.filename) {
            product.image = req.file.filename
        }

        
        const newProduct = await product.save();

        res.status(201).send({
            ok: true,
            message: "Producto creado correctamente",
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear producto"
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al eliminar producto"
        });
    }
}

async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;

        data.updatedAt = Date.now();
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Producto actualizado correctamente",
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al actualizar producto"
        });
    }
}

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    postProduct,
    updateProduct
};
