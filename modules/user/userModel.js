const path = require("path");
var jwt = require("jsonwebtoken");
const request = require("request");
const msg = require(path.resolve("./", "utils/errorMessages.js"));
const functions = require(path.resolve("./", "utils/functions.js"));
const logger = require(path.resolve("./logger"));
const config = require(path.resolve("./config"));
const userSchema = require(path.resolve(".", "modules/user/userSchema.js"));

// Create container
const userModel = {};

userModel.fetchData = req => {
  return new Promise(async (resolve, reject) => {
    request(
      {
        url: config.apiUrl + "?results=5000",
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        json: true
      },
      function(err, res) {
        if (err) {
          logger.error("Service not available currently");
          return reject({ code: 1021, message: msg.serverError, data: null });
        } else {
          userSchema.insertMany(res.body.results, function(
            errInsert,
            resInsert
          ) {
            console.info(
              "%d records were successfully stored.",
              resInsert.length
            );
            logger.info(
              resInsert.length +
                " records were successfully stored." +
                new Date(Date.now())
            );
            return resolve({
              code: 200,
              message: resInsert.length + " records were successfully stored.",
              data: null
            });
          });
        }
      }
    );
  });
};

userModel.getStats = req => {
  return new Promise(async (resolve, reject) => {
    // get count for age less than 31 with nationality and gender grouping
    try {
      let statsYoungAge = await userSchema.aggregate([
        { $match: { "dob.age": { $lt: 31 } } },
        {
          $group: {
            _id: { nat: "$nat", gender: "$gender" },
            count: { $sum: 1 }
          }
        },
        { $project: { nat: 1, gender: 1, count: 1 } }
      ]);

      // get count for age greater than 30 and less than 51 with nationality and gender grouping
      let statsMidAge = await userSchema.aggregate([
        { $match: { "dob.age": { $lt: 51, $gt: 30 } } },
        {
          $group: {
            _id: { nat: "$nat", gender: "$gender" },
            count: { $sum: 1 }
          }
        },
        { $project: { nat: 1, gender: 1, count: 1 } }
      ]);

      // get count for age greater than 50 with nationality and gender grouping
      let statsOldAge = await userSchema.aggregate([
        { $match: { "dob.age": { $gt: 50 } } },
        {
          $group: {
            _id: { nat: "$nat", gender: "$gender" },
            count: { $sum: 1 }
          }
        },
        { $project: { nat: 1, gender: 1, count: 1 } }
      ]);

      logger.info("getStats success - " + new Date(Date.now()));

      // declare object to store the output data
      let obj = {};
      obj.male = {};
      obj.male.young = [];
      obj.male.midAge = [];
      obj.male.oldAge = [];
      obj.female = {};
      obj.female.young = [];
      obj.female.midAge = [];
      obj.female.oldAge = [];

      // make the data in required output format
      for (let x = 0; x < statsYoungAge.length; x++) {
        let record = {};
        record.nat = statsYoungAge[x]._id.nat;
        record.count = statsYoungAge[x].count;
        if (statsYoungAge[x]._id.gender == "female") {
          obj.female.young.push(record);
        } else {
          obj.male.young.push(record);
        }
      }

      // make the data in required output format
      for (let x = 0; x < statsMidAge.length; x++) {
        let record = {};
        record.nat = statsMidAge[x]._id.nat;
        record.count = statsMidAge[x].count;
        if (statsMidAge[x]._id.gender == "female") {
          obj.female.midAge.push(record);
        } else {
          obj.male.midAge.push(record);
        }
      }

      // make the data in required output format
      for (let x = 0; x < statsOldAge.length; x++) {
        let record = {};
        record.nat = statsOldAge[x]._id.nat;
        record.count = statsOldAge[x].count;
        if (statsOldAge[x]._id.gender == "female") {
          obj.female.oldAge.push(record);
        } else {
          obj.male.oldAge.push(record);
        }
      }

      return resolve({
        code: 200,
        message: "Success",
        data: obj
      });
    } catch (e) {
      logger.error("Service not available currently");
      return reject({ code: 1021, message: msg.serverError, data: null });
    }
  });
};

module.exports = userModel;
