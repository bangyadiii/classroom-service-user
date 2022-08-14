const { User, RefreshToken } = require("../models");
const Validator = require("fastest-validator");
const v = new Validator();

async function create(req, res, next) {
    //
    const schema = {
        refresh_token: { type: "string", empty: false },
        user_id: { type: "string", empty: false },
    };
    const validated = v.validate(req.body, schema);
    if (validated.length) {
        //
        return res.status(400).json({
            success: false,
            message: "Input invalid.",
            data: null,
            error: validated,
        });
    }

    try {
        const user = await User.findByPk(req.body.user_id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }

        const refresh_token_created = await RefreshToken.create({
            refresh_token: req.body.refresh_token,
            user_id: req.body.user_id,
        });

        res.status(200).json({
            success: true,
            message: "Token created successfully.",
            data: refresh_token_created,
        });
    } catch (error) {
        next(error);
    }
}

async function getToken(req, res, next) {
    try {
        const refToken = req.query.refresh_token;
        const anyToken = await RefreshToken.findOne({
            where: { refresh_token: refToken },
        });

        if (!anyToken) {
            return res.status(400).json({
                success: false,
                message: "Token not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get token successfull.",
            data: { anyToken },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { create, getToken };
