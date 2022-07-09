const { User } = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

async function getUserList(req, res, next) {
    const userIdParams = req.query.user_ids || [];

    const sqlAttribute = {
        attributes: ["id", "name", "email", "avatar", "role", "profession"],
    };

    if (userIdParams.length) {
        //
        sqlAttribute.where = {
            id: userIdParams,
        };
    }
    try {
        console.log(sqlAttribute);
        const userList = await User.findAll(sqlAttribute);

        res.status(200).json({
            success: true,
            message: "Get data successfully",
            data: userList,
        });
    } catch (error) {
        next(error);
    }
}

async function register(req, res, next) {
    const schema = {
        name: { type: "string", empty: false },
        email: { type: "email", empty: false },
        password: { type: "string", min: 7 },
        password_verify: { type: "equal", field: "password" },
        avatar: { type: "string", nullable: true, optional: true },
        profession: { type: "string", nullable: true, optional: true },
        role: { type: "string", nullable: true, optional: true },
    };
    const validated = v.validate(req.body, schema);
    if (validated.length) {
        return res.status(400).json({
            success: false,
            message: "Input invalid.",
            data: null,
            error: validated,
        });
    }
    try {
        const anyUserWithEmail = await User.findOne({
            where: { email: req.body.email },
        });

        if (anyUserWithEmail !== null) {
            return res.status(409).json({
                success: false,
                message: "This email already exist.",
                data: null,
            });
        }

        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar || null,
            profession: req.body.profession || "student",
            role: req.body.role || "student",
        };
        console.log(data);
        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar || null,
            profession: req.body.profession || "student",
            role: req.body.role || "student",
        });
        res.status(200).json({
            success: true,
            message: "Register successfull",
            data: createdUser,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
async function login(req, res, next) {
    const schema = {
        email: { type: "email", empty: false },
        password: { type: "string" },
    };
    const validated = v.validate(req.body, schema);
    if (validated.length) {
        return res.status(400).json({
            success: false,
            message: "Input invalid.",
            data: null,
            error: validated,
        });
    }

    try {
        const anyUserWithEmail = await User.findOne({
            where: { email: req.body.email },
        });

        if (anyUserWithEmail === null) {
            return res.status(400).json({
                success: false,
                message: "This email doesn't match in our records",
                data: null,
            });
        }
        const isValidUser = await bcrypt.compare(
            req.body.password,
            anyUserWithEmail.password
        );
        if (isValidUser) {
            return res.status(400).json({
                success: false,
                message: "Wrong password.",
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: "Wrong password.",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    const schema = {
        name: { type: "string", empty: false },
        email: { type: "email", empty: false },
        avatar: { type: "string", nullable: true, optional: true },
        profession: { type: "string", nullable: true, optional: true },
        role: { type: "string", nullable: true, optional: true },
    };
    const validated = v.validate(req.body, schema);
    if (validated.length) {
        return res.status(400).json({
            success: false,
            message: "Input invalid.",
            data: null,
            error: validated,
        });
    }
    try {
        const id =
            req.params.id !== undefined || req.params.id !== null
                ? req.params.id
                : id;
        console.log(id);

        const anyUser = await User.findByPk(id);

        if (anyUser === null) {
            return res.status(409).json({
                success: false,
                message: "Account doesn't exist.",
                data: null,
            });
        }

        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar || null,
            profession: req.body.profession || "student",
            role: req.body.role || "student",
        };
        const updatedUser = await anyUser.update(data);
        res.status(200).json({
            success: true,
            message: "Update account successfully.",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}
function refresh(req, res, next) {
    //
}

module.exports = { register, login, refresh, update, getUserList };
