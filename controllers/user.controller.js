const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

async function getUserByid(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select({ password: 0, __v: 0 });

        if (!user) {
            return res.status(400).send({
                ok: false,
                message: "No se pudo encontrar el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario encontrado",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener usuario"
        });
    }
}

async function getUsers(req, res) {
    try {
        console.log(req.query);
        const limiteUsuarios = parseInt(req.query.limit) || 2;
        const page = parseInt(req.query.page) || 0;

        const [users, total] = await Promise.all([
            User.find()
                .select({ password: 0 })
                .collation({ locale: 'es' })
                .sort({ fullname: 'asc' })
                .limit(limiteUsuarios)
                .skip(page * limiteUsuarios),
            User.countDocuments()
        ]);

        res.status(200).send({
            ok: true,
            message: "Usuarios obtenidos correctamente",
            users,
            total
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener usuarios"
        });
    }
}

async function postUser(req, res) {
    try {
        if (req.user?.role !== "ADMIN_ROLE") {
            req.body.role = "CLIENT_ROLE";
        }

        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User(req.body);
        const newUser = await user.save();
        newUser.password = undefined;

        res.status(201).send(newUser);

    } catch (error) {
        res.status(500).send("Error al crear el usuario");
        console.log(error);
    }
}

async function deleteUser(req, res) {
    try {
        console.log(req.params);
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        console.log(deletedUser);

        if (!deletedUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontro el usuario que desea borrar"
            });
        }

        res.status(200).send({
            ok: true,
            message: "El usuario fue borrado correctamente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al borrar el usuario"
        });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.id;
        if (req.user.role !== 'ADMIN_ROLE' && req.user._id !== id) {
            return res.status(400).send({
                ok: false,
                message: "No puede editar este usuario"
            });
        }

        const newData = req.body;

        const updUser = await User.findByIdAndUpdate(id, newData, { new: true });

        if (!updUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontro el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo editar usuario"
        });
    }
}

async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send({
                ok: false,
                message: "Email y password son requeridos"
            });
        }

        console.log(email, password);
        const user = await User.findOne({ email: { $regex: email, $options: "i" } });

        console.log(user);
        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        user.password = undefined;
        const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

        res.status(200).send({
            ok: true,
            message: "Login Correcto!",
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al hacer login"
        });
    }
}

module.exports = {
    getUsers,
    postUser,
    deleteUser,
    updateUser,
    getUserByid,
    login
};
