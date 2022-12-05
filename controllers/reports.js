const ModalReport = require("../models/report");
const ModalFile = require("../models/files");
const User = require("../models/user")
const ModalDomain = require("../models/domain");
var moment = require('moment'); 
const {Op} = require('sequelize');


const csv = require("fast-csv");
const fs = require("fs");
const { db_read, db_write } = require("../config/db");

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
async function getAllFiles(req, res) {
  try {

    const files = await ModalFile.findAll();
    if (!files) {
      return res.status(401).send({
        error: "Not Found",
        message: "No files found.",
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


async function getHomeStats(req, res) {
  try {
    const { domain_name, start_date, end_date } = req.query
    let responseArray = []
    let total = { Ad_Requests: 0, Ad_Impressions: 0, Revenue: 0, Calculated_Ad_Requests: 0, Calculated_Ad_Impressions: 0, Calculated_Revenue: 0 }

    const reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
        ...(domain_name && { Domain_name: domain_name })

      }
    })

    if (reports) {
      await Promise.all(
        reports.map(respons => {
          //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
          respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
          respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
          respons.Calculated_Revenue = respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          total.Ad_Requests += respons.Ad_Requests
          total.Ad_Impressions += respons.Ad_Impressions
          total.Revenue += respons.Revenue
          total.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
          total.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
          total.Calculated_Revenue += respons.Calculated_Revenue
        })
      )
      responseArray = reports
    }
    return res.json({
      message: "success",
      data: {
        response: responseArray, sums: total

      },
    });
  } catch (e) {
    console.log('error: ', e);
  }
}


const verifyToken = async (token) => {
  try {
    const user = await User.findOne({ id: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub });
    if (!user) {
      return null
    }
    console.log('user', user);
    return user
  } catch (error) {
    console.log(error);
  }
}


async function getUserHomeStats(req, res) {
  try {
    if (!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if (!req.user)
      res.status(404).json('User not found!')
    const { domain_name, start_date, end_date } = req.query
    let responseArray = []
    let total = { Ad_Requests: 0, Ad_Impressions: 0, Revenue: 0, Calculated_Ad_Requests: 0, Calculated_Ad_Impressions: 0, Calculated_Revenue: 0 }

    console.log(domain_name, start_date, end_date);

    const domains = await ModalDomain.findAll(
      {
        where: {
          userId: req.user.id,
          ...(domain_name && { domainname: domain_name })
        }
      }
    )

    console.log('domains', domains);

    const reportsDomianNameArray = []

    domains?.map(domain => {
      reportsDomianNameArray.push(domain.domainname)
    })
    console.log('reportsDomianNameArray', reportsDomianNameArray);


    const reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })


    // const reports = await ModalReport.find({
    //   create_at: {
    //     $gte: start_date,
    //     $lte: end_date,
    //   },
    //   Domain_name: reportsDomianNameArray
    // })

    // if (reports) {
    //   reports.map(report => {
    //     console.log(report.Domain_name);
    //   })
    // }

    if (reports) {
      await Promise.all(
        reports.map(report => {
          //we can round this value if req arises i.e Math.round(report.Ad_Impressions - report.Ad_Impressions*(parseFloat(("0."+report.commission))))
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          total.Ad_Requests += report.Ad_Requests
          total.Ad_Impressions += report.Ad_Impressions
          total.Revenue += report.Revenue
          total.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          total.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          total.Calculated_Revenue += report.Calculated_Revenue
        })
      )
      console.log('total', total);
      responseArray = reports
    }

    return res.json({
      message: "success",
      data: { response: reports, sums: total },
    });
  } catch (e) { }
}


async function getHomeStatsFixed(req, res) {
  try {
    let currentMonthStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let lastMonthStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let thisWeekStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let lastWeekStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let todayStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let yesterdayStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let currentYearStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let monthwiseData = {
      jan: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      feb: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      mar: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      apr: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      may: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jun: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jul: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      aug: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      sep: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      oct: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      nov: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      dec: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 }
    }

    let date = new Date();
    let firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayLastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    firstDayOfCurrentMonth = firstDayOfCurrentMonth.getFullYear() + "-" + (firstDayOfCurrentMonth.getMonth() + 1) + "-" + firstDayOfCurrentMonth.getDate()
    lastDayLastDayOfCurrentMonth = lastDayLastDayOfCurrentMonth.getFullYear() + "-" + (lastDayLastDayOfCurrentMonth.getMonth() + 1) + "-" + lastDayLastDayOfCurrentMonth.getDate()

    console.log('firstDayOfCurrentMonth', firstDayOfCurrentMonth, 'lastDayLastDayOfCurrentMonth', lastDayLastDayOfCurrentMonth);

    // let reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayOfCurrentMonth,
    //       $lte: lastDayLastDayOfCurrentMonth,
    //     },
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    let reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayOfCurrentMonth,
          [Op.lte]: lastDayLastDayOfCurrentMonth,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })

    // 




    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          currentMonthStats.Ad_Requests += report.Ad_Requests
          currentMonthStats.Ad_Impressions += report.Ad_Impressions
          currentMonthStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          currentMonthStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          currentMonthStats.revenue += report.Revenue
          currentMonthStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    let lastDayLastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0)

    firstDayOfLastMonth = firstDayOfLastMonth.getFullYear() + "-" + (firstDayOfLastMonth.getMonth() + 1) + "-" + firstDayOfLastMonth.getDate()
    lastDayLastDayOfLastMonth = lastDayLastDayOfLastMonth.getFullYear() + "-" + (lastDayLastDayOfLastMonth.getMonth() + 1) + "-" + lastDayLastDayOfLastMonth.getDate()


    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayOfLastMonth,
    //       $lte: lastDayLastDayOfLastMonth,
    //     },
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayOfLastMonth,
          [Op.lte]: lastDayLastDayOfLastMonth,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          lastMonthStats.Ad_Requests += report.Ad_Requests
          lastMonthStats.Ad_Impressions += report.Ad_Impressions
          lastMonthStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          lastMonthStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          lastMonthStats.revenue += report.Revenue
          lastMonthStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }



    let today = new Date()





    today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    // lastDayLastDayOfLastMonth = lastDayLastDayOfLastMonth.getFullYear()+"-"+(lastDayLastDayOfLastMonth.getMonth()+1)+"-"+lastDayLastDayOfLastMonth.getDate()


    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: today,
    //       $lte: today,
    //     },
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: today,
          [Op.lte]: today,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          todayStats.Ad_Requests += report.Ad_Requests
          todayStats.Ad_Impressions += report.Ad_Impressions
          todayStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          todayStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          todayStats.revenue += report.Revenue
          todayStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let yesterDay = new Date()
    yesterDay.setDate(yesterDay.getDate() - 1)
    yesterDay.setHours(0,0,0,0)

    yesterDay = yesterDay.getFullYear() + "-" + (yesterDay.getMonth() + 1) + "-" + yesterDay.getDate()

    // console.log('reports yest', yesterDayX);

    yesterDay = new Date(yesterDay);
    reports = null
    console.log('reports yest', yesterDay);

    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: yesterDay,
    //       $lte: yesterDay,
    //     },
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: yesterDay,
          [Op.lte]: yesterDay,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    


    console.log('reports yest', reports, yesterDay);

    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          yesterdayStats.Ad_Requests += report.Ad_Requests
          yesterdayStats.Ad_Impressions += report.Ad_Impressions
          yesterdayStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          yesterdayStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          yesterdayStats.revenue += report.Revenue
          yesterdayStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }


    let firstDay = date.getDate() - date.getDay();
    let lastDay = firstDay + 7;


    let firstDayThisWeek = new Date(date.setDate(firstDay))
    let lastDayThisWeek = new Date(date.setDate(lastDay))



    firstDayThisWeek = firstDayThisWeek.getFullYear() + "-" + (firstDayThisWeek.getMonth() + 1) + "-" + firstDayThisWeek.getDate()
    lastDayThisWeek = lastDayThisWeek.getFullYear() + "-" + (lastDayThisWeek.getMonth() + 1) + "-" + lastDayThisWeek.getDate()


    reports = null
    

    

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayThisWeek,
          [Op.lte]: lastDayThisWeek,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          thisWeekStats.Ad_Requests += report.Ad_Requests
          thisWeekStats.Ad_Impressions += report.Ad_Impressions
          thisWeekStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          thisWeekStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          thisWeekStats.revenue += report.Revenue
          thisWeekStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let date1 = new Date()
    let firstDay1 = date1.getDate() - date1.getDay() - 7;
    let lastDay1 = firstDay1 + 7;

    let firstDayLastWeek = new Date(new Date().setDate(firstDay1))
    let lastDayLastWeek = new Date(new Date().setDate(lastDay1))




    firstDayLastWeek = firstDayLastWeek.getFullYear() + "-" + (firstDayLastWeek.getMonth() + 1) + "-" + firstDayLastWeek.getDate()
    lastDayLastWeek = lastDayLastWeek.getFullYear() + "-" + (lastDayLastWeek.getMonth() + 1) + "-" + lastDayLastWeek.getDate()


    reports = null


    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayLastWeek,
          [Op.lte]: lastDayLastWeek,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          lastWeekStats.Ad_Requests += report.Ad_Requests
          lastWeekStats.Ad_Impressions += report.Ad_Impressions
          lastWeekStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          lastWeekStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          lastWeekStats.revenue += report.Revenue
          lastWeekStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }


    const currentYear = new Date().getFullYear();
    const currentYearFirstDay = new Date(currentYear, 0, 1);
    const currentYearLastDay = new Date(currentYear, 11, 31);

    reports = null
    

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: currentYearFirstDay,
          [Op.lte]: currentYearLastDay,
        },
        // Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })



    if (reports) {
      await Promise.all(
        reports.map(respons => {

          let createDate = new Date(respons.create_at)
          if (createDate.getMonth() == 0) {
            monthwiseData.jan.Ad_Requests += respons.Ad_Requests
            monthwiseData.jan.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jan.Revenue += respons.Revenue
            monthwiseData.jan.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jan.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jan.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 1) {
            monthwiseData.feb.Ad_Requests += respons.Ad_Requests
            monthwiseData.feb.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.feb.Revenue += respons.Revenue
            monthwiseData.feb.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.feb.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.feb.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 2) {
            monthwiseData.mar.Ad_Requests += respons.Ad_Requests
            monthwiseData.mar.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.mar.Revenue += respons.Revenue
            monthwiseData.mar.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.mar.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.mar.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 3) {
            monthwiseData.apr.Ad_Requests += respons.Ad_Requests
            monthwiseData.apr.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.apr.Revenue += respons.Revenue
            monthwiseData.apr.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.apr.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.apr.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 4) {
            monthwiseData.may.Ad_Requests += respons.Ad_Requests
            monthwiseData.may.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.may.Revenue += respons.Revenue
            monthwiseData.may.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.may.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.may.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 5) {
            monthwiseData.jun.Ad_Requests += respons.Ad_Requests
            monthwiseData.jun.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jun.Revenue += respons.Revenue
            monthwiseData.jun.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jun.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jun.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 6) {
            monthwiseData.jul.Ad_Requests += respons.Ad_Requests
            monthwiseData.jul.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jul.Revenue += respons.Revenue
            monthwiseData.jul.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jul.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jul.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 7) {
            monthwiseData.aug.Ad_Requests += respons.Ad_Requests
            monthwiseData.aug.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.aug.Revenue += respons.Revenue
            monthwiseData.aug.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.aug.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.aug.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 8) {
            monthwiseData.sep.Ad_Requests += respons.Ad_Requests
            monthwiseData.sep.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.sep.Revenue += respons.Revenue
            monthwiseData.sep.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.sep.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.sep.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 9) {
            monthwiseData.oct.Ad_Requests += respons.Ad_Requests
            monthwiseData.oct.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.oct.Revenue += respons.Revenue
            monthwiseData.oct.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.oct.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.oct.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 10) {
            monthwiseData.nov.Ad_Requests += respons.Ad_Requests
            monthwiseData.nov.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.nov.Revenue += respons.Revenue
            monthwiseData.nov.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.nov.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.nov.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 11) {
            monthwiseData.dec.Ad_Requests += respons.Ad_Requests
            monthwiseData.dec.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.dec.Revenue += respons.Revenue
            monthwiseData.dec.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.dec.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.dec.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
        })
      )
    }

    return res.json({
      message: "success",
      data: { thisWeekStats, lastWeekStats, todayStats, yesterdayStats, currentMonthStats, lastMonthStats },
      monthwiseData
    });
  } catch (e) { }
}

async function getUserHomeStatsFixed(req, res) {
  try {

    if (!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if (!req.user)
      res.status(404).json('User not found!')
    console.log('req.user', req.user);

    const { domain_name } = req.query
    console.log(domain_name);

    let currentMonthStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let lastMonthStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let thisWeekStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let lastWeekStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let todayStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let yesterdayStats = { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0 }
    let monthwiseData = {
      jan: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      feb: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      mar: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      apr: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      may: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jun: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jul: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      aug: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      sep: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      oct: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      nov: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      dec: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 }
    }

    // userId: req.user.id


    console.log('req.user.id', req.user._id);
    

    const domains = await ModalDomain.findAll(
      {
        where: {
          userId: req.user.id,
          ...(domain_name && { domainname: domain_name })
        }
      }
    )

    console.log('domains', domains);

    const reportsDomianNameArray = []

    domains?.map(domain => {
      reportsDomianNameArray.push(domain.domainname)
    })
    console.log('reportsDomianNameArray', reportsDomianNameArray);

    // const reports = await ModalReport.find({
    //   create_at: {
    //     $gte: start_date,
    //     $lte: end_date,
    //   },
    //   Domain_name: reportsDomianNameArray
    // })








    let date = new Date();
    let firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayLastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    firstDayOfCurrentMonth = firstDayOfCurrentMonth.getFullYear() + "-" + (firstDayOfCurrentMonth.getMonth() + 1) + "-" + firstDayOfCurrentMonth.getDate()
    lastDayLastDayOfCurrentMonth = lastDayLastDayOfCurrentMonth.getFullYear() + "-" + (lastDayLastDayOfCurrentMonth.getMonth() + 1) + "-" + lastDayLastDayOfCurrentMonth.getDate()

    console.log('firstDayOfCurrentMonth', firstDayOfCurrentMonth, 'lastDayLastDayOfCurrentMonth', lastDayLastDayOfCurrentMonth);

    // let reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayOfCurrentMonth,
    //       $lte: lastDayLastDayOfCurrentMonth,
    //     },
    //     Domain_name: reportsDomianNameArray
    //   }
    // )

    let reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayOfCurrentMonth,
          [Op.lte]: firstDayOfCurrentMonth,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })


    // 




    if (reports) {
      await Promise.all(
        reports.map(report => {
          console.log('report', report);
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          currentMonthStats.Ad_Requests += report.Ad_Requests
          currentMonthStats.Ad_Impressions += report.Ad_Impressions
          currentMonthStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          currentMonthStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          currentMonthStats.revenue += report.Revenue
          currentMonthStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    let lastDayLastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0)

    firstDayOfLastMonth = firstDayOfLastMonth.getFullYear() + "-" + (firstDayOfLastMonth.getMonth() + 1) + "-" + firstDayOfLastMonth.getDate()
    lastDayLastDayOfLastMonth = lastDayLastDayOfLastMonth.getFullYear() + "-" + (lastDayLastDayOfLastMonth.getMonth() + 1) + "-" + lastDayLastDayOfLastMonth.getDate()


    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayOfLastMonth,
    //       $lte: lastDayLastDayOfLastMonth,
    //     },
    //     Domain_name: reportsDomianNameArray
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayOfLastMonth,
          [Op.lte]: lastDayLastDayOfLastMonth,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          lastMonthStats.Ad_Requests += report.Ad_Requests
          lastMonthStats.Ad_Impressions += report.Ad_Impressions
          lastMonthStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          lastMonthStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          lastMonthStats.revenue += report.Revenue
          lastMonthStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }



    let today = new Date()





    today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    // lastDayLastDayOfLastMonth = lastDayLastDayOfLastMonth.getFullYear()+"-"+(lastDayLastDayOfLastMonth.getMonth()+1)+"-"+lastDayLastDayOfLastMonth.getDate()


    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: today,
    //       $lte: today,
    //     },
    //     Domain_name: reportsDomianNameArray
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: today,
          [Op.lte]: today,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          todayStats.Ad_Requests += report.Ad_Requests
          todayStats.Ad_Impressions += report.Ad_Impressions
          todayStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          todayStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          todayStats.revenue += report.Revenue
          todayStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let yesterDay = new Date()
    yesterDay.setDate(yesterDay.getDate() - 1)
    // console.log('yesterDay', yesterDay);
    // yesterDay.setHours(0,0,0,0)
    // console.log('yesterDayMOD', yesterDay);

    yesterDay = yesterDay.getFullYear() + "-" + (yesterDay.getMonth() + 1) + "-" + yesterDay.getDate()

    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: yesterDay,
    //       $lte: yesterDay,
    //     },
    //     Domain_name: reportsDomianNameArray
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )
    
    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: yesterDay,
          [Op.lte]: yesterDay,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          yesterdayStats.Ad_Requests += report.Ad_Requests
          yesterdayStats.Ad_Impressions += report.Ad_Impressions
          yesterdayStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          yesterdayStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          yesterdayStats.revenue += report.Revenue
          yesterdayStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }


    let firstDay = date.getDate() - date.getDay();
    let lastDay = firstDay + 7;


    let firstDayThisWeek = new Date(date.setDate(firstDay))
    let lastDayThisWeek = new Date(date.setDate(lastDay))



    firstDayThisWeek = firstDayThisWeek.getFullYear() + "-" + (firstDayThisWeek.getMonth() + 1) + "-" + firstDayThisWeek.getDate()
    lastDayThisWeek = lastDayThisWeek.getFullYear() + "-" + (lastDayThisWeek.getMonth() + 1) + "-" + lastDayThisWeek.getDate()


    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayThisWeek,
    //       $lte: lastDayThisWeek,
    //     },
    //     Domain_name: reportsDomianNameArray
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayThisWeek,
          [Op.lte]: lastDayThisWeek,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })
    



    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          thisWeekStats.Ad_Requests += report.Ad_Requests
          thisWeekStats.Ad_Impressions += report.Ad_Impressions
          thisWeekStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          thisWeekStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          thisWeekStats.revenue += report.Revenue
          thisWeekStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }

    let date1 = new Date()
    let firstDay1 = date1.getDate() - date1.getDay() - 7;
    let lastDay1 = firstDay1 + 7;

    let firstDayLastWeek = new Date(new Date().setDate(firstDay1))
    let lastDayLastWeek = new Date(new Date().setDate(lastDay1))




    firstDayLastWeek = firstDayLastWeek.getFullYear() + "-" + (firstDayLastWeek.getMonth() + 1) + "-" + firstDayLastWeek.getDate()
    lastDayLastWeek = lastDayLastWeek.getFullYear() + "-" + (lastDayLastWeek.getMonth() + 1) + "-" + lastDayLastWeek.getDate()


    reports = null

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: firstDayLastWeek,
    //       $lte: lastDayLastWeek,
    //     },
    //     Domain_name: reportsDomianNameArray
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: firstDayLastWeek,
          [Op.lte]: lastDayLastWeek,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })


    if (reports) {
      await Promise.all(
        reports.map(report => {
          report.Calculated_Ad_Requests = report.Ad_Requests - report.Ad_Requests * (parseFloat(("0." + report.commission)))
          report.Calculated_Ad_Impressions = report.Ad_Impressions - report.Ad_Impressions * (parseFloat(("0." + report.commission)))
          report.Calculated_Revenue = report.Revenue - report.Revenue * (parseFloat(("0." + report.commission)))
          lastWeekStats.Ad_Requests += report.Ad_Requests
          lastWeekStats.Ad_Impressions += report.Ad_Impressions
          lastWeekStats.Calculated_Ad_Requests += report.Calculated_Ad_Requests
          lastWeekStats.Calculated_Ad_Impressions += report.Calculated_Ad_Impressions
          lastWeekStats.revenue += report.Revenue
          lastWeekStats.calculatedRevenue += report.Calculated_Revenue
        })
      )
    }


    const currentYear = new Date().getFullYear();
    const currentYearFirstDay = new Date(currentYear, 0, 1);
    const currentYearLastDay = new Date(currentYear, 11, 31);

    reports = null
    

    // reports = await ModalReport.find(
    //   {

    //     create_at: {
    //       $gte: currentYearFirstDay,
    //       $lte: currentYearLastDay,
    //     },
    //     Domain_name: reportsDomianNameArray
    //     // ...(domain_name && { Domain_name: domain_name })
    //   }
    // )

    reports = await ModalReport.findAll({
      where: {
        create_at: {
          [Op.gte]: currentYearFirstDay,
          [Op.lte]: currentYearLastDay,
        },
        Domain_name: { [Op.in]: reportsDomianNameArray }

      }
    })



    if (reports) {
      await Promise.all(
        reports.map(respons => {

          let createDate = new Date(respons.create_at)
          if (createDate.getMonth() == 0) {
            monthwiseData.jan.Ad_Requests += respons.Ad_Requests
            monthwiseData.jan.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jan.Revenue += respons.Revenue
            monthwiseData.jan.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jan.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jan.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 1) {
            monthwiseData.feb.Ad_Requests += respons.Ad_Requests
            monthwiseData.feb.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.feb.Revenue += respons.Revenue
            monthwiseData.feb.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.feb.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.feb.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 2) {
            monthwiseData.mar.Ad_Requests += respons.Ad_Requests
            monthwiseData.mar.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.mar.Revenue += respons.Revenue
            monthwiseData.mar.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.mar.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.mar.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 3) {
            monthwiseData.apr.Ad_Requests += respons.Ad_Requests
            monthwiseData.apr.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.apr.Revenue += respons.Revenue
            monthwiseData.apr.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.apr.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.apr.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 4) {
            monthwiseData.may.Ad_Requests += respons.Ad_Requests
            monthwiseData.may.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.may.Revenue += respons.Revenue
            monthwiseData.may.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.may.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.may.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 5) {
            monthwiseData.jun.Ad_Requests += respons.Ad_Requests
            monthwiseData.jun.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jun.Revenue += respons.Revenue
            monthwiseData.jun.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jun.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jun.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 6) {
            monthwiseData.jul.Ad_Requests += respons.Ad_Requests
            monthwiseData.jul.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.jul.Revenue += respons.Revenue
            monthwiseData.jul.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.jul.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.jul.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 7) {
            monthwiseData.aug.Ad_Requests += respons.Ad_Requests
            monthwiseData.aug.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.aug.Revenue += respons.Revenue
            monthwiseData.aug.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.aug.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.aug.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 8) {
            monthwiseData.sep.Ad_Requests += respons.Ad_Requests
            monthwiseData.sep.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.sep.Revenue += respons.Revenue
            monthwiseData.sep.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.sep.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.sep.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 9) {
            monthwiseData.oct.Ad_Requests += respons.Ad_Requests
            monthwiseData.oct.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.oct.Revenue += respons.Revenue
            monthwiseData.oct.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.oct.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.oct.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 10) {
            monthwiseData.nov.Ad_Requests += respons.Ad_Requests
            monthwiseData.nov.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.nov.Revenue += respons.Revenue
            monthwiseData.nov.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.nov.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.nov.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
          if (createDate.getMonth() == 11) {
            monthwiseData.dec.Ad_Requests += respons.Ad_Requests
            monthwiseData.dec.Ad_Impressions += respons.Ad_Impressions
            monthwiseData.dec.Revenue += respons.Revenue
            monthwiseData.dec.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
            monthwiseData.dec.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
            monthwiseData.dec.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
          }
        })
      )
    }

    console.log('monthwiseData', monthwiseData);

    return res.json({
      message: "success",
      data: { thisWeekStats, lastWeekStats, todayStats, yesterdayStats, currentMonthStats, lastMonthStats },
      monthwiseData
    });
  } catch (e) { }
}


async function addReport(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let report = req.files.report;
      if (!report.mimetype.includes("csv")) {
        return res.send({
          status: false,
          message: "Please upload only csv file.",
        });
      }

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      report.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name
      );

      let rows = [];

      // var ts = moment(new Date(req.body.date).split("T")).unix();
      // var m = moment.unix(ts);

      // var s = "2000-01-01";
      // let date = new Date(req.body.date.replace(/-/g, '/'));
      let date = new Date(req.body.date);
      console.log('date', date);


      const data = {
        file: Math.floor(new Date() / 1000) + "_" + report.name,
        commission: req.body.commission,
        create_at: date,
        updated_at: date,
      };

      console.log('data', data);

      var modalfile = new ModalFile(data);

      await modalfile.save();

      let path =
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name;

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {

          let eCPM_temp = 0;
          if (row["Revenue (USD)"] == 0 || row["Ad Impressions"] == 0) {
            eCPM_temp = 0
          } else {
            eCPM_temp = (row["Revenue (USD)"] / row["Ad Impressions"]) * 1000;
          }


          let final_row = {
            Domain_name: row["Domain name"],
            Ad_Requests: row["Ad Requests"],
            Ad_Impressions: row["Ad Impressions"],
            Revenue: row["Revenue (USD)"],
            eCPM: eCPM_temp,
            commission: req.body.commission,
            create_at: date,
            updated_at: date,
          };
          rows.push(final_row);
        })
        .on("end", async () => {

          try {
            const reportInsert = await ModalReport.bulkCreate(rows);

            if (!reportInsert)
              return res.status(401).send("err");

            return res.json({
              message: "Report imported successfully!",
              status: true,
              reportInsert
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


async function deleteFile(req, res) {
  try {
    const fileId = req.params.id;

    const deletedFile = await ModalFile.destroy({
      where: {
        id: fileId
      }
    });

    if (!deletedFile) {
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


module.exports = { addReport, getAllFiles, deleteFile, getHomeStats, getHomeStatsFixed, getUserHomeStats, getUserHomeStatsFixed };
