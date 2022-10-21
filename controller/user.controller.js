const { User, RefreshToken } = require("../models");
const { ERROR, SUCCESS } = require("../helpers/ResponseFormatter");

const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
    getUserList: async (req, res, next) => {
        const userIdParams = req.query.user_ids || [];

        const sqlAttribute = {
            attributes: ["id", "name", "email", "avatar", "role", "profession"],
        };

        if (userIdParams.length) {
            sqlAttribute.where = {
                id: userIdParams,
            };
        }
        try {
            const userList = await User.findAll(sqlAttribute);

            res.status(200).json({
                success: true,
                message: "Get data successfully",
                data: userList,
            });
        } catch (error) {
            next(error);
        }
    },

    getUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await User.findByPk(id);

            if (!user) {
                return res
                    .status(400)
                    .json({ status: "error", message: "User not found." });
            }
            res.status(200).json({
                status: "success",
                message: "Get user successfully",
                data: { user: user },
            });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
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
            return ERROR(res, 422, "Unproccessible Request", validated);
        }
        try {
            const anyUserWithEmail = await User.findOne({
                where: { email: req.body.email },
            });

            if (anyUserWithEmail !== null) {
                return ERROR(
                    res,
                    409,
                    "Confict",
                    "This email address has been taken"
                );
            }

            const createdUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar || null,
                profession: req.body.profession || "student",
                role: req.body.role || "student",
            });

            return SUCCESS(res, 200, "OK", createdUser);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    login: async (req, res, next) => {
        const schema = {
            email: { type: "email", empty: false },
            password: { type: "string", empty: false },
        };
        const validated = v.validate(req.body, schema);
        if (validated.length > 0) {
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
            if (!isValidUser) {
                return res.status(400).json({
                    success: false,
                    message: "Wrong password.",
                    data: null,
                });
            }
            return res.status(200).json({
                success: true,
                message: "berhasil login",
                data: {
                    user: {
                        id: anyUserWithEmail.id,
                        name: anyUserWithEmail.name,
                        email: anyUserWithEmail.email,
                        avatar: anyUserWithEmail.avatar,
                        profession: anyUserWithEmail.profession,
                        role: anyUserWithEmail.role,
                    },
                    access_token: "",
                },
            });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
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
    },

    logout: async (req, res, next) => {
        try {
            const id = req.body.user_id;

            const user = User.findByPk(id);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User not found.",
                    data: null,
                });
            }

            await RefreshToken.destroy({
                where: { user_id: id },
            });
        } catch (error) {
            next(error);
        }
    },
};
