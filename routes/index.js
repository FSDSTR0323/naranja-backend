const express = require("express");
const generalRouter = express.Router();
const loginRoutes = require("./login");
const { jwtMiddleware, authRouter } = require("../security/jwt");

//Router principaal
generalRouter.use("/", authRouter);

// Redirigir a middlewares de jwt
generalRouter.use("/login", jwtMiddleware, loginRoutes);



module.exports = generalRouter;