const config = require("../config/app");
const jwt = require("jsonwebtoken");
const { db_read } = require("../config/db");
const Hash = require("crypto-js/pbkdf2");
const ModalUser = require("../models/user");

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @returns {*}
 */
async function login(req, res) {
  try {
    const user = await ModalUser.findOne({ where: { email: req.body.email } });

    if (!user)
      res
        .status(401)
        .send({ error: "Unauthorized", message: "Authentication failed" });

    const passwordInput = Hash(
      req.body.password,
      config.appSecret
    ).toString();

    if (user.password !== passwordInput) {
      res
        .status(401)
        .send({ error: "Unauthorized", message: "Authentication failed" });
    } else {
      const sign = {
        exp: Math.floor(Date.now() / 1000) + config.jwtExpire, // expire time
        sub: user.id, // Identifies the subject of the JWT.
      };

      console.log("====================================");
      console.log(user);
      console.log("====================================");

      res.json({
        message: "success",
        status: true,
        type: user?.type,
        email: user?.email,
        first_name: user?.first_name,
        last_name: user?.last_name,
        photo: user?.photo,
        id: user?.id,
        data: jwt.sign(sign, config.jwtSecret),
      });
    }

  } catch (error) {
    console.log('auth error', error);
  }
  

}

/**
 * Returns user info
 * @param req
 * @param res
 * @returns {*}
 */
function me(req, res) {
  res.json({
    message: "success",
    data: req.user,
  });
}

module.exports = { login, me };
