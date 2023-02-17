const { User, RefreshToken } = require("../models");
const { ERROR, SUCCESS } = require("../helpers/ResponseFormatter");

const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
    getUserList: async (req, res, next) => {
        const userIdParams = req.query.user_ids || [];

        const sqlAttribute = {
            attributes: ["id", "name", "email", "avatar", "profession"],
        };

        if (userIdParams.length) {
            sqlAttribute.where = {
                id: userIdParams,
            };
        }
        try {
            const userList = await User.findAll(sqlAttribute);

            return SUCCESS(res, 200, "Get data successfully", userList);
        } catch (error) {
            next(error);
        }
    },

    getUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await User.findByPk(id);

            if (!user) {
                return ERROR(res, 400, "Bad Request", "User not found");
            }

            return SUCCESS(res, 200, "Get data successfully", { user: user });
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
            const updatedUser = await User.findOne({
                where: { email: req.body.email },
            });

            if (updatedUser !== null) {
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
            const userResp = {
                name: createdUser.name,
                email: createdUser.email,
                avatar: createdUser.avatar,
                profession: createdUser.profession,
            };

            return SUCCESS(res, 200, "OK", userResp);
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
            return ERROR(res, 400, "Bad Request", null, validated);
        }

        try {
            const updatedUser = await User.findOne({
                where: { email: req.body.email },
            });

            if (updatedUser === null) {
                return ERROR(
                    res,
                    400,
                    "This email doesn't match in our records",
                    null
                );
            }
            const isValidUser = await bcrypt.compare(
                req.body.password,
                updatedUser.password
            );
            if (!isValidUser) {
                return ERROR(res, 400, "Wrong password", null);
            }

            return SUCCESS(res, 200, "OK", {
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    avatar: updatedUser.avatar,
                    profession: updatedUser.profession,
                    role: updatedUser.role,
                },
                access_token: "",
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
            return ERROR(res, 400, "Bad Request", validated);
        }
        try {
            const id =
                req.params.id !== undefined || req.params.id !== null
                    ? req.params.id
                    : id;
            console.log(id);

            const anyUser = await User.findByPk(id);

            if (anyUser === null) {
                return ERROR(res, 400, "Account doesn't exist.", validated);
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

            return SUCCESS(res, 200, "Update account successful", {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                profession: updatedUser.profession,
                role: updatedUser.role,
                updated_at: updatedUser.updated_at,
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
                return ERROR(res, 400, "User not found");
            }

            await RefreshToken.destroy({
                where: { user_id: id },
            });
            return SUCCESS(res, 200, "Logout Successfully");
        } catch (error) {
            next(error);
        }
    },
};
