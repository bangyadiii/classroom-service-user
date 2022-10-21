const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { ERROR } = require("./helpers/ResponseFormatter");

const tokenRouter = require("./routes/refresh_token");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", usersRouter);
app.use("/api/v1/refresh-token", tokenRouter);

app.use((req, res, next) => {
    const error = new Error("Not found.");
    error.status = 404;
    next(error);
});
//add default error handling
app.use((error, req, res, next) => {
    //
    const statusCode = error.status ?? 500;
    const message = error.message;
    const errors = error.data ?? null;
    return ERROR(res, statusCode, message, errors);
});

module.exports = app;
