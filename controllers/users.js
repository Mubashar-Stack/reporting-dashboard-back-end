const ModalUser = require("../models/user");
const Hash = require("crypto-js/pbkdf2");
const config = require("../config/app");

/**
 * Returns User Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getUserById(req, res) {
  try {
    const userId = req.params.id;

    ModalUser.findOne({ _id: userId }, (err, data) => {
      if (err) {
        return res.status(401).send({
          error: err,
          message: "No user found.",
        });
      } else {
        return res.json({
          message: "success",
          data: data,
        });
      }
    });
  } catch (e) {}
}

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getAllUsers(req, res) {
  try {
    const userId = req.params.id;

    ModalUser.find(function (err, data) {
      if (err) {
        return res.status(401).send({
          error: err,
          message: "No user found.",
        });
      } else {
        return res.json({
          message: "success",
          data: data,
        });
      }
    });
  } catch (e) {}
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function addUser(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + avatar.name
      );

      // if (!req.body.paypal_email_address ||
      //     !req.body.bank_account_holder_address ||
      //     !req.body.IFSC_code ||
      //     !req.body.account_number ||
      //     !req.body.bank_ac_holder_name ||
      //     !req.body.bank_address ||
      //     !req.body.banck_name)
      //   res.status(403).json({
      //     message: "Bank details are mendatory", bank_obj: {
      //       banck_name: req.body.banck_name || null,
      //       bank_address: req.body.bank_address || null,
      //       bank_ac_holder_name: req.body.bank_ac_holder_name || null,
      //       account_number: req.body.account_number || null,
      //       IFSC_code: req.body.IFSC_code || null,
      //       bank_account_holder_address: req.body.bank_account_holder_address || null,
      //       paypal_email_address: req.body.paypal_email_address || null,
      //     }
      //   })

      const data = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        photo: Math.floor(new Date() / 1000) + "_" + avatar.name,
        email: req.body.email,
        password: Hash(req.body.password, config.appSecret).toString(),
        card_name: req.body.card_name,
        card_number: req.body.card_number,
        cvc: req.body.cvc,
        expiry_date: new Date(req.body.expiry_date),
        banck_name: req.body.banck_name,
        bank_address: req.body.bank_address,
        bank_ac_holder_name: req.body.bank_ac_holder_name,
        account_number: req.body.account_number,
        IFSC_code: req.body.IFSC_code,
        bank_account_holder_address: req.body.bank_account_holder_address,
        swift_bic_code: req.body.swift_bic_code,
        paypal_email_address: req.body.paypal_email_address,
        upi: req.body.upi,
      };

      var modalUser = new ModalUser(data);

      modalUser.save(function (err, data) {
        if (err) {
          return res.status(401).send(err);
        } else {
          return res.json({
            message: "User Added successfully!",
            status: true,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function updateUser(req, res) {
  try {
    const userId = req.params.id;
    // if (req.body.isFileChange !== 'false' ) {
    //   if (!req.files) {
    //     res.send({
    //       status: false,
    //       message: "No file uploaded",
    //     });
    //   }
    // } else {

    let avatar;
    if (req.files) {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      avatar = req.files.avatar;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + avatar.name
      );
    }
    const data = {
      userId: userId,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      card_name: req.body.card_name,
      card_number: req.body.card_number,
      cvc: req.body.cvc,
      expiry_date: new Date(req.body.expiry_date),
      banck_name: req.body.banck_name,
      bank_address: req.body.bank_address,
      bank_ac_holder_name: req.body.bank_ac_holder_name,
      account_number: req.body.account_number,
      IFSC_code: req.body.IFSC_code,
      bank_account_holder_address: req.body.bank_account_holder_address,
      swift_bic_code: req.body.swift_bic_code,
      paypal_email_address: req.body.paypal_email_address,
      upi: req.body.upi,
    };

    if (req.files) {
      data.photo = Math.floor(new Date() / 1000) + "_" + avatar?.name;
    }
    if (req.body.isChangedPassword == "true") {
      data.password = Hash(req.body.password, config.appSecret).toString();
    }

    if (req.body.isFileChange == "false") {
      data.photo = req.body.avatar;
    }
    if (req.body.isChangedPassword == "false") {
      data.password = req.body.password;
    }

    console.log(data, "data");

    ModalUser.findByIdAndUpdate(userId, data, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(401).send(err);
      } else {
        return res.json({
          message: "User Updated successfully!",
          status: true,
          data: data,
        });
      }
    });

    // }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    ModalUser.findByIdAndDelete(userId, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(401).send(err);
      } else {
        return res.json({
          message: "User Deleted successfully!",
          status: true,
          data: data,
        });
      }
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { getAllUsers, getUserById, addUser, updateUser, deleteUser };
