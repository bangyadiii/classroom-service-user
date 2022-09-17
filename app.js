var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var tokenRouter = require("./routes/refresh_token");
var usersRouter = require("./routes/users");

var app = express();
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
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.status || 500;
    const message = error.message;
    const status = false;

    res.status(statusCode).json({
        success: status,
        message: message,
        data: null,
        error: error,
    });
});

module.exports = app;
