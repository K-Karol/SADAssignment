import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import e from 'express';
import app from "../index"
import { assert } from "console";
import { stringify } from "querystring";

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
var bearertoken: string;

before(function () { //don't put tests in here else the before will not be called first causing issues (same with describe and it)
  chai.request(app)
    .post('/api/auth/login')
    .type('json')
    .send({
      "username": "Danny",
      "password": "123"
    })
    .end((err, res) => {
      bearertoken = res.body.Response.token; //save the value locally to use in later methods
      console.log(bearertoken);
    });
});

//these methods work under the assumption that the DB exists and that the roles Staff, Admin and Student exist

//the parent block
describe('Create Users', () => {
  it('Should Create a Staff', (done) => {
    chai.request(app)
    .post('/api/users/resource')
    .set("Authorization", `Bearer ${bearertoken}`) //error comes from auth.ts middleware line 28 - const payload - verify// 401
    //.set({ "Authorization": `Bearer ${bearertoken}` })// 401
    .type('json')
    .send({
      "username": "TestTutor",
      "password": "123",
      "roles": ["Staff"],
      "fullname": {
        "firstname": "TestStaff",
        "lastname": "Member"
      },
        "address": {
          "addressLine1": "home",
          "postcode": "12@bs",
          "city": "sheffield",
          "country": "UK"
        }
      })
      .end((err, res) => {
        console.log("RES IS " + res);
        console.log("Error IS " + err);
        res.should.have.status(200);
        done(); //end point
      });
  });

});

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