var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* mongo db schema to manage users related data */

var userSchema = new Schema(
  {
    gender: {
      type: String,
      required: true
    },
    name: {
      type: Object,
      required: true
    },
    location: {
      type: Object
    },
    email: {
      type: String
    },
    login: {
      type: Object
    },
    dob: {
      type: Object,
      required: true
    },
    registered: {
      type: Object
    },
    phone: {
      type: String
    },
    cell: {
      type: String
    },
    id: {
      type: Object
    },
    picture: {
      type: Object
    },
    nat: {
      type: String,
      required: true
    }
  },
  { collection: "userData" }
);

module.exports = mongoose.model("User", userSchema);
