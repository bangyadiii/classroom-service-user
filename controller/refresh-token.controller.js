const { User, RefreshToken } = require("../models");
const Validator = require("fastest-validator");
const v = new Validator();
const { ERROR, SUCCESS } = require("../helpers/ResponseFormatter");

async function create(req, res) {
    //
    const schema = {
        refresh_token: { type: "string", empty: false },
        user_id: { type: "number", empty: false },
    };
    const validated = v.validate(req.body, schema);
    if (validated.length) {
        return ERROR(res, 422, "Unproccessible Request", validated);
    }

    try {
        const user = await User.findByPk(req.body.user_id);
        if (!user) {
            return ERROR(res, 404, "NOT FOUND", "User not found");
        }
        const payload = await RefreshToken.create({
            refresh_token: req.body.refresh_token,
            user_id: req.body.user_id,
        });
        if (!payload) {
            return ERROR(res, 400, "", payload);
        }

        return SUCCESS(res, 200, "OK", payload);
    } catch (error) {
        console.log(error);
        return ERROR(res, error.status ?? 500, error.message, error);
    }
}

async function getToken(req, res) {
    try {
        const refToken = req.query.refresh_token;
        const anyToken = await RefreshToken.findOne({
            where: { refresh_token: refToken },
        });

        if (!anyToken) {
            return ERROR(res, 404, "NOT FOUND", "Token Not  .. Found.");
        }

        return SUCCESS(res, 200, "OK", payload);
    } catch (error) {
        return ERROR(res, error.status ?? 500, error.message, error.message);
    }
}

module.exports = { create, getToken };
