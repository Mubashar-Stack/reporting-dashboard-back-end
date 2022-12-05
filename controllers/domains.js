const ModalDomain = require("../models/domain");
const Hash = require("crypto-js/pbkdf2");
const config = require("../config/app");

/**
 * Returns Domain Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
async function getDomainById(req, res) {
  try {
    const DomainId = req.params.id;
    console.log("DomainId", DomainId);

    const domain = await ModalDomain.findByPk(DomainId);
    if (!domain) {
      return res.status(404).send({
        error: "Not Found",
        message: "No Domain found.",
      });
    } else {
      return res.json({
        message: "success",
        data: domain,
      });
    }
  } catch (e) {
    console.log('e', e);
  }
}

/**
 * Returns Domain List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
async function getAllDomains(req, res) {
  try {
    const domainId = req.params.id;

    const domains = await ModalDomain.findAll()

    if (!domains)
      return res.status(401).send({
        error: "Not Found",
        message: "No domain found.",
      });

    return res.json({
      message: "success",
      data: domains,
    });
  } catch (e) { }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

async function addDomain(req, res) {
  try {
    let ads_code = req.files.ads_code;
    console.log("ads_code", ads_code);
    ads_code.mv(
      "./uploads/" + Math.floor(new Date() / 1000) + "_" + ads_code.name
    );
    console.log("received body", req.body.domainName);
    const data = {
      domainname: req.body.domainName,
      ads_code: Math.floor(new Date() / 1000) + "_" + ads_code.name,
    };


    var domain = new ModalDomain(data);

    await domain.save();
    if (!domain) {
      return res.status(404).send("ERR");
    } else {
      return res.json({
        message: "Domain Added successfully!",
        status: true,
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

async function updateDomain(req, res) {
  try {
    const domainId = req.params.id;
    // if (req.body.isFileChange !== 'false' ) {
    //   if (!req.files) {
    //     res.send({
    //       status: false,
    //       message: "No file uploaded",
    //     });
    //   }
    // } else {
    let ads_code;
    if (req.files) {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      ads_code = req.files.ads_code;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      ads_code.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + ads_code.name
      );
    }
    const data = {
      domainId,
      domainname: req.body.domainName,
    };

    if (req.files) {
      data.ads_code = Math.floor(new Date() / 1000) + "_" + ads_code.name;
    }

    if (!req.body.isFileChange) {
      data.photo = req.body.ads_code;
    }

    const updateDomain = await ModalDomain.update(data, {
      where: {
        id: domainId
      }
    });

    if (!updateDomain) {
      return res.status(401).send(err);
    } else {
      return res.json({
        message: "Domain Updated successfully!",
        status: true,
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deleteDomain(req, res) {
  try {
    const domainId = req.params.id;


    const deletedDomain = await ModalDomain.destroy({
      where: {
        id: domainId
      }
    });

    if (!deletedDomain) {
      return res.status(404).send("Not Found.");
    } else {
      return res.json({
        message: "Domain Deleted successfully!",
        status: true,
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(500).send(err.message);
  }
}

module.exports = {
  getAllDomains,
  getDomainById,
  addDomain,
  updateDomain,
  deleteDomain,
};
