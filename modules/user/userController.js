const path = require("path");
const responseGenerator = require(path.resolve(
  ".",
  "utils/responseGenerator.js"
));
const userModel = require(path.resolve(".", "modules/user/userModel.js"));

exports.fetchData = async (req, res) => {
  try {
    let response = await userModel.fetchData(req);
    if (response) {
      res.send(
        responseGenerator.getResponse(
          response.code,
          response.message,
          response.data
        )
      );
    }
  } catch (error) {
    res.send(
      responseGenerator.getResponse(error.code, error.message, error.data)
    );
  }
};

exports.getStats = async (req, res) => {
  try {
    let response = await userModel.getStats(req);
    if (response) {
      res.send(
        responseGenerator.getResponse(
          response.code,
          response.message,
          response.data
        )
      );
    }
  } catch (error) {
    res.send(
      responseGenerator.getResponse(error.code, error.message, error.data)
    );
  }
};
