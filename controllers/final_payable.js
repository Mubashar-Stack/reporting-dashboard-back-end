const ModalFinalPayable = require("../models/final_payable");
const ModalFinalPayableFiles = require("../models/final_payable_files");
const ModalDomain = require("../models/domain");
const User = require("../models/user")
const csv = require("fast-csv");
const fs = require("fs");
const {Op} = require('sequelize');

const { db_read, db_write } = require("../config/db");

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
async function getAllFiles(req, res) {
  try {


    const files = await ModalFinalPayableFiles.findAll();
    if (!files) {
      return res.status(401).send({
        error: err,
        message: "No file found.",
      });
    } else {
      return res.json({
        message: "success",
        data: files,
      });
    }
  } catch (e) { }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */



async function addFinalPayable(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let final_payable = req.files.final_payable;
      if (!final_payable.mimetype.includes("csv")) {
        return res.send({
          status: false,
          message: "Please upload only csv file.",
        });
      }

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      final_payable.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + final_payable.name
      );

      let rows = [];


      const data = {
        file: Math.floor(new Date() / 1000) + "_" + final_payable.name,
        create_at: new Date(req.body.date),
        updated_at: new Date(req.body.date),
      };


      const files = new ModalFinalPayableFiles(data)
      await files.save()


      // db_write.query("INSERT INTO final_payable_files SET ? ", [data], function (err, res) {
      //   if (err) {
      //     console.log("error: ", err);
      //   } else {
      //     console.log("error: ", res);
      //   }
      // });

      let path =
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + final_payable.name;

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error;
        })
        .on("data", (row) => {
          let final_row = {
            // id, domain, gross_revenue, deductions, net_revenue

            domain: row["Domain"],
            gross_revenue: row["Gross Revenue"].split('$')[0],
            deductions: row["Deductions"].split('$')[0],
            net_revenue: row["Net Revenue"].split('$')[0],
            created_at: new Date(req.body.date),
            updated_at: new Date(req.body.date),
          };
          console.log('reading ', final_row, row["Gross Revenue"].split('$')[0]);
          rows.push(final_row);
        })
        .on("end", async () => {

          try {
            const finalPayables = await ModalFinalPayable.bulkCreate(rows);
  
            if(!finalPayables)
              return res.status(401).send(err);
    
              return res.json({
                message: "Final Payablles added successfully!",
                status: true,
                finalPayables
              });
            
          } catch (error) {
            console.log('error', error);
          }

        });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getMonthlyReport(req, res) {
  try {
    let month = req.query.month

    let date = new Date(month);
    let firstDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalFinalPayable.getMonthlyReport({ month, start: firstDayOfSelectedMonth, end: lastDayLastDayOfSelectedMonth }, async (err, response) => {
      if (!err && response) {
        console.log('res', response);
        res.status(200).json({ data: response })
      }
    })
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const verifyToken = async (token) => {
  try {
    const user = await User.findOne({ _id: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub });
    if (!user) {
      return null
    }
    console.log('user', user);
    return user
  } catch (error) {
    console.log(error);
  }
}

async function getUserMonthlyReport(req, res) {
  try {

    if (!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if (!req.user)
      res.status(404).json('User not found!')
    console.log('req.user', req.user);

    // const domains = await ModalDomain.find(
    //   {
    //     user: req.user._id,
    //   }
    // ).populate('user')

    const domains = await ModalDomain.findAll(
      {
        where: {
          userId: req.user.id,
          // ...(domain_name && { domainname: domain_name })
        }
      }
    )

    console.log('domains', domains);

    const reportsDomianNameArray = []

    domains?.map(domain => {
      reportsDomianNameArray.push(domain.domainname)
    })

    let month = req.query.month

    let date = new Date(month);
    let firstDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    console.log('month', month, firstDayOfSelectedMonth, lastDayLastDayOfSelectedMonth, date);

    // ModalFinalPayable.find({
    //   created_at: {
    //     $gte: firstDayOfSelectedMonth,
    //     $lte: lastDayLastDayOfSelectedMonth,
    //   },
    //   domain: reportsDomianNameArray
    // }, async (err, response) => {
    //   if (!err && response) {
    //     console.log('res', response);
    //     res.status(200).json({ data: response })
    //   }
    // })

    const finalPayable = await ModalFinalPayable.findAll({
      where: {
        created_at: {
          [Op.gte]: firstDayOfSelectedMonth,
          [Op.lte]: lastDayLastDayOfSelectedMonth,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })

    if(finalPayable){
      res.status(200).json({ data: finalPayable })
    }else{
      res.send("Not Found!")
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}


async function deleteFile(req, res) {
  try {
    const fileId = req.params.id;


    const deletedFiles = await ModalFinalPayableFiles.destroy({
      where: {
        id: fileId
      }
    });

    if (!deletedFiles) {
      return res.status(404).send("Not Found.");
    } else {
      return res.json({
        message: "File Deleted successfully!",
        status: true,
      });
    }

  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { addFinalPayable, getMonthlyReport, getAllFiles, deleteFile, getUserMonthlyReport };