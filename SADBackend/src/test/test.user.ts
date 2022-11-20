import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import e from 'express';
import app from "../index"
import { assert } from "console";

chai.use(chaiHttp);
chai.should();
/*
{
  "Success": true,
  "Response": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI2MzZjZjZkY2U3OWIxMjZkNmQyOTg5YmQiLCJpYXQiOjE2Njg3ODM4NjksImV4cCI6MTY2ODc5MTA2OX0.jLRN_7aXHicgYblQtDL620Tyct_j0bX6bEmWzLaFfM8",
    "expiry": 1668791069
  }
}
*/

//https://dev.to/wakeupmh/debugging-mocha-tests-in-vscode-468a
var bearertoken;

before(function () {
  describe('Get the auth token', () =>{
    it('Find, admin bearer token', (done) =>{
      chai.request(app)
      .post('/api/auth/login')
      .type('json')
      .send({
        "username" : "Danny",
        "password" : "123"
      })
      .end((err, res) => { 
        expect(res.body).to.be.a('object');
        //try{
        console.log(res + " --- " + res.type);
        expect(res).to.have.status(200);
        // expect(res).to.have.property("Response").with.property("token");
        //   }
        //   catch (expect){
        //     console.log(err + " --- " + expect);
        //   }
        bearertoken = res.body.Response.token;
       done(); //exit call
      });
    });
  });
});

// //the parent block
// describe('Create A Tutor', () => {
//     it('Should Create a Staff', (done) => {
//         chai.request(app)
//             .post('/api/users/resource')
//             .type('json')
//             .send({
//               "username": "TestTutor",
//                       "password": "123",
//                       "roles" : ["Staff"],
//                       "fullname": {
//                         "firstname": "TestStaff",
//                         "lastname": "Member"
//                       },
//                       "address": {
//                         "addressLine1": "home",
//                         "postcode": "12@bs",
//                         "city": "sheffield",
//                         "country": "UK"
//                       }
//             })
//             .end((err, res) => {
//                 //res.should.have.status(200); 
//                 console.log("RES IS " + res);
//                 console.log("Error IS " + err);
//                 expect(res?.status).to.equal(200);
//                 done();
//             });
//     });

// }); 


// // import 'mocha'
// // //const { expect } = require('chai');

// import chai from "chai"
// import chaiHttp from "chai-http"
// import e from 'express';
// import app from "../index"
// let should = chai.should();

// chai.use(chaiHttp);

// describe('Create A Tutor', () => {
//   it("Should Create a Staff", (done) => {
//     chai.request(app)
//     .post("users/resource/") //post holds the parameter information
//     .send({ //send holds hte body infomration
//       "username": "TestTutor",
//         "password": "123",
//         "roles" : ["Staff"],
//         "fullname": {
//           "firstname": "TestStaff",
//           "lastname": "Member"
//         },
//         "address": {
//           "addressLine1": "home",
//           "postcode": "12@bs",
//           "city": "sheffield",
//           "country": "UK"
//         }
//     })
//     .end((err, res) => { //check the retrund value
//       res.should.have.status(200);
//       res.should.have.status(200); //successful creation
//       res.should.have.a("object"); //should return a user object
//       res.should.have.property("Success").equal("true");
//       res.should.have.property("Response");
//       done(); //end point
//     });
//   });
// });