const ModalUserDomain = require("../models/users_domains");
const ModalDomain = require("../models/domain");
const ModalUser = require("../models/user");


/**
 * Returns Domain Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getUserDomainById(req, res) {
  try {
    const UserDomainId = req.params.id;
    console.log('DomainId', UserDomainId);
    ModalUserDomain.findOne({ _id: UserDomainId }, (err, data) => {
      if (!err && data) {

        return res.json({
          message: "success",
          data: data,
        });
      }
      return res.status(404).send({
        error: "Not Found",
        message: "No UserDomain found.",
      });
    });
  } catch (e) { }
}

async function getUserDomainByUserId(req, res) {
  try {
    const user_id = req.params.user_id;
    console.log('userID', user_id);

    console.log('not sure');

    const user = await ModalUser.findById(user_id).populate('domainsOfUser')

    console.log('user', user);
    if (user)
      return res.json({ message: "success", data: user })
    return res.status(404).send({
      error: "Not Found",
      message: "No User found.",
    });
    // ModalUserDomain.getUserDomainsById(user_id, (err, response) => {
    //   if (!err && response) {

    //     return res.json({
    //       message: "success",
    //       data: response,
    //     });
    //   }
    //   return res.status(404).send({
    //     error: "Not Found",
    //     message: "No UserDomain found.",
    //   });
    // });
  } catch (e) { }
}

/**
 * Returns UserDomain List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
async function getAllUserDomains(req, res) {
  try {
    const domainId = req.params.id;

    const domains = await ModalDomain.find({user : { $ne: null }}).populate('user')

    return res.json({
      message: "success",
      data: domains,
    });

    // ModalUserDomain.getUserDomains((err, response) => {
    //   if (!err && response) {
    //     return res.json({
    //       message: "success",
    //       data: response,
    //     });
    //   }
    //   return res.status(401).send({
    //     error: "Not Found",
    //     message: "No domain found.",
    //   });
    // });
  } catch (e) { }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

async function addUserDomain(req, res) {
  try {
    // const data = {
    //   user_id: req.body.user_id,
    //   domain_id: req.body.domain_id,
    // };
    const domainId = req.body.domain_id
    // ModalUserDomain.addUserDomain(data, (err, response) => {
    //   if (!err && response) {
    //     return res.json({
    //       message: "UserDomain Added successfully!",
    //       status: true,
    //     });
    //   }
    //   return res.status(401).send(err);
    // });

    const domain = await ModalDomain.findById(domainId)
    if (!domain)
      return res.status(404).send({
        error: "Not Found",
        message: "No Domain found.",
      });

    const user_id = req.body.user_id

    const user = await ModalUser.findById(user_id)

    if (!user)
      return res.status(404).send({
        error: "Not Found",
        message: "No User found.",
      });

    console.log('user', user);

    if (user.domainsOfUser.includes(domainId)) {
      return res.status(409).send({
        error: "Conflict",
        message: "Domain already added",
      });
    }
    user.domainsOfUser.push(domainId)
    await user.save()
    domain.user = user_id
    await domain.save()

    return res.json({
      message: "Domain and user linked successfully!",
      status: true,
      user,
      domain
    });

    // ModalDomain.findByIdAndUpdate(domainId, { Owner: req.body.user_id }, function (err, data) {
    //   if (!err && data) {
    //     return res.json({
    //       message: "Domain Updated successfully!",
    //       status: true,
    //     });
    //   }
    //   return res.status(401).send(err);
    // });

  } catch (err) {
    res.status(500).send(err.message);
  }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function updateUserDomain(req, res) {
  try {
    const userDomainId = req.params.id;
    const data = {
      userDomainId,
      user_id: req.body.user_id,
      domain_id: req.body.domain_id,
    };

    return res.json({
      message: "This case is not handled yet",
      status: true,
    });


    // ModalUserDomain.updateUserDomain(data, (err, response) => {
    //   if (!err && response) {
    //     return res.json({
    //       message: "Domain Updated successfully!",
    //       status: true,
    //     });
    //   }
    //   return res.status(401).send(err);
    // });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deleteUserDomain(req, res) {
  try {
    const userId = req.params.user_id;
    const domainId = req.params.domain_id;

    console.log('userId', userId, 'domainId', domainId);
    const domain = await ModalDomain.findById(domainId)
    if (!domain)
      return res.status(404).send({
        error: "Not Found",
        message: "No Domain found.",
      });

    domain.user = null

    const user = await ModalUser.findById(userId)

    if (!user)
      return res.status(404).send({
        error: "Not Found",
        message: "No User found.",
      });

      user.domainsOfUser = user.domainsOfUser.filter(item => item != domainId)
      console.log('runing');

    await domain.save()
    await user.save()
    console.log('ran');

    return res.json({
      message: "Domain and user unlinked successfully!",
      status: true,
      user,
      domain
    });

    //i now expect both user and domain id

    // ModalUserDomain.deleteUserDomain(userDomainId, (err, response) => {
    //   if (!err && response) {
    //     return res.json({
    //       message: "Domain Deleted successfully!",
    //       status: true,
    //     });
    //   }
    //   return res.status(401).send(err);
    // });

  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { getAllUserDomains, getUserDomainByUserId, getUserDomainById, addUserDomain, updateUserDomain, deleteUserDomain };
