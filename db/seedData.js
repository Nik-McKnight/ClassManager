// const users = [
//     {
//         first_name: 'Alice',
//         last_name: 'Anderson',
//         preferred_name: "Allie",
//         email: 'alice@prisma.io',
//         gpa: 4.0,
//         address: "123 Notareal St",
//         phone: "(123) 456-7890"
//     },
//         {
//         first_name: 'Alice',
//         last_name: 'Anderson',
//         preferred_name: "Allie",
//         email: 'alice@prisma.io',
//         gpa: 4.0,
//         address: "123 Notareal St",
//         phone: "(123) 456-7890"
//     },
//         {
//         first_name: 'Alice',
//         last_name: 'Anderson',
//         preferred_name: "Allie",
//         email: 'alice@prisma.io',
//         gpa: 4.0,
//         address: "123 Notareal St",
//         phone: "(123) 456-7890"
//     },
//         {
//         first_name: 'Alice',
//         last_name: 'Anderson',
//         preferred_name: "Allie",
//         email: 'alice@prisma.io',
//         gpa: 4.0,
//         address: "123 Notareal St",
//         phone: "(123) 456-7890"
//     },
// ]
// import { parse } from 'csv-parse';
// const fs = require('fs');
// const {parse} = require('csv-parse');

// type User = {
//     first_name: string;
//     last_name: string;
//     preferred_name: string;
//     email: string;
//     gpa: number;
//     address: string;
//     phone: string;
// };

// (() => {
//   const csvFilePath = './users.csv';

//   const headers = ['first_name', 'last_name','preferred_name',
//   'email', 'gpa', 'address', 'phone'];

//   const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

//   parse(fileContent, {
//     delimiter: ',',
//     columns: headers,
//   }, (error:any, result: User[]) => {
//     if (error) {
//       console.error(error);
//     }

//     console.log("Result", result);
//   });
// })();

const fs = require("fs");
const { parse } = require("csv-parse");

fs.createReadStream("/home/nik/projects/classManager/db/users.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });
