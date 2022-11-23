import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import app from "../index"
import { assert } from "console";
import { stringify } from "querystring";
import { after } from "mocha";

chai.use(chaiHttp);
chai.should();
const NUMSTUDENTS = 3;
var bearertoken: string; //auth token
var tutorid: string;
var modleadid: string;
var studentids: string[] = []; //create users

//Assumes that staff, Module leader, Student roles exit, that danny 123 is a valid auth
//don't put tests in here else the before will not be called first causing issues (same with describe and it)
before(function () { //create the needed variable id valud for the tested methods
  /*{
    "Success": true,
    "Response": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI2MzZjZjZkY2U3OWIxMjZkNmQyOTg5YmQiLCJpYXQiOjE2Njg3ODM4NjksImV4cCI6MTY2ODc5MTA2OX0.jLRN_7aXHicgYblQtDL620Tyct_j0bX6bEmWzLaFfM8",
      "expiry": 1668791069
    }
  }*/
  chai.request(app)
    .post('/api/auth/login')
    .type('json')
    .send({
      "username": "Danny",
      "password": "123"
    })
    .end((err, res) => {
      bearertoken = res.body.Response.token; //save the value locally to use in later methods
    });

  chai.request(app)
    .post('/api/users/resource') //rout path
    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
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
      tutorid = res.body.Response;
    });

  chai.request(app)
    .post('/api/users/resource') //rout path
    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
    .type('json')
    .send({
      "username": "TestModLeader",
      "password": "123456",
      "roles": ["Staff", "Module leader"],
      "fullname": {
        "firstname": "Mod",
        "lastname": "Lead"
      },
      "address": {
        "addressLine1": "home",
        "postcode": "12@bs",
        "city": "sheffield",
        "country": "UK"
      }
    })
    .end((err, res) => {
      modleadid = res.body.Response;
    });

  for (let index = 0; index < NUMSTUDENTS; index++) { //create 3 students
    chai.request(app)
      .post('/api/users/resource') //rout path
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .type('json')
      .send({
        "username": `Student${index}`,
        "password": "123456",
        "roles": ["Student"],
        "fullname": {
          "firstname": "Stu",
          "lastname": `${index}`
        },
        "address": {
          "addressLine1": "home",
          "postcode": "12@bs",
          "city": "sheffield",
          "country": "UK"
        }
      })
      .end((err, res) => {
        studentids.push(res.body.Response);
      });
  }
});

describe('Test Module', () => {

});

after(function () { //delete the create object in before method
  chai.request(app)
  .delete(`/api/users/resource/${tutorid}`) //remove tutor
  .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
  .end((err, res) => {
  });

  chai.request(app)
  .delete(`/api/users/resource/${modleadid}`) //remove module leader
  .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
  .end((err, res) => {
  });

  for (let index = 0; index < NUMSTUDENTS; index++) {
    chai.request(app)
    .delete(`/api/users/resource/${studentids[index]}`) //remove each student
    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
    .end((err, res) => {
    });
  }
})