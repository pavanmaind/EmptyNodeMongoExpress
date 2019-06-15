
exports.getResponse = function (status, msg, data) {

    let response = {
        "status": status,
        "message": msg,
        "responseData": data
    }
    return response;
}