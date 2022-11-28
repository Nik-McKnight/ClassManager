var csv = require("jquery-csv");

const users = csv.toObjects("/home/nik/projects/classManager/db/users.csv");
module.exports = { users };
