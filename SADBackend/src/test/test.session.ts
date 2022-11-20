import chai from "chai"
import chaiHttp from "chai-http"
import e from 'express';
import app from "../index"
let should = chai.should();

chai.use(chaiHttp);

//before << do something at the start of the file
//beforeEach << do something before each 
//after << do something at the end of the file
//afterEach << do something after each function

// beforeEach(function () {
//   describe("Creating a session for testing", () => {
//     it("Should Create a Staff", (done) => {
//       chai.request(app)
//       .post("users/resource/")
//       .send({
//         "username": "Tutor",
//         "password": "123",
//         "roles" : ["Staff"],
//         "fullname": {
//           "firstname": "Staff",
//           "lastname": "Member"
//         },
//         "address": {
//           "addressLine1": "addressLine1",
//           "postcode": "abcde",
//           "city": "sheffield",
//           "country": "UK"
//         }
//       })

//       it("should create a course", (done) => { //pass done done the lvel it dictates when the test has passed
//         chai.request(app)
//           .post("/modules/resource/")
//           .send({
//             "name": "HeyMacareina",
//             "year": "2022",
//             "semester": "SEM1",
//             "students": ["637537d96e74842534423c0d", "637537da6e74842534423c19", "637537da6e74842534423c1b", "637537da6e74842534423c1d"],
//             "cohorts": [
//               {
//                 "identifier": "group 1",
//                 "students": ["637537d96e74842534423c0d", "637537da6e74842534423c19"]
//               },
//               {
//                 "identifier": "group 2",
//                 "students": ["637537da6e74842534423c1b", "637537da6e74842534423c1d"]
//               }
//             ],
//             "moduleLeader": "6374e1be45f2d92a9b42f80f",
//             "instructors": ["6374e1be45f2d92a9b42f80f"]
//           });
//       });
//     });
//   });
// });