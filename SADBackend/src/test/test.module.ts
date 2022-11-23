import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import app from "../index"
import { assert } from "console";
import { stringify } from "querystring";
import { after, before } from "mocha";

chai.use(chaiHttp);
chai.should();
const NUMSTUDENTS = 3;
var bearertoken: string; //auth token
var tutorid: string;
var modleadid: string;
var studentids: string[] = []; //create users

//Assumes that staff, Module leader, Student roles exit, that danny 123 is a valid auth
//don't put tests in here else the before will not be called first causing issues (same with describe and it)
before(function () { //do first
  chai.request(app)
    .post('/api/auth/login')
    .type('json')
    .send({
      "username": "Danny",
      "password": "123"
    })
    .end((err, res) => {
      bearertoken = res.body.Response.token; //save the value locally to use in later methods

      chai.request(app)
        .post('/api/users/resource') //rout path
        .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
        .type('json')
        .send({
          "username": "TestTutormoduletest",
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
          //console.log(tutorid);
        });

      chai.request(app)
        .post('/api/users/resource') //rout path
        .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
        .type('json')
        .send({
          "username": "TestModLeadermoduletest",
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
          //console.log(modleadid);
        });

      for (let index = 0; index < NUMSTUDENTS; index++) { //create 3 students
        chai.request(app)
          .post('/api/users/resource') //rout path
          .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
          .type('json')
          .send({
            "username": `Student${index}moduletest`,
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
            //console.log(res.body.Response);
          });
      }
    });
});

describe('Test Module', () => {
  it("Create a Module"), () => {
    chai.request(app)
      .post(`api/modules/resource`)
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .type('json')
      .send({
        "name": "WTFYMNMT",
        "year": "2022",
        "semester": "SEM1",
        "students": [`${studentids[0]}`, `${studentids[1]}`, `${studentids[2]}`],
        "cohorts": [
          {
            "identifier": "group 1",
            "students": [`${studentids[0]}`, `${studentids[1]}`,]
          },
        ],
        "moduleLeader": `${modleadid}`,
        "instructors": [`${modleadid}`, `${tutorid}`]
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("Success").eql(true);
        res.body.should.have.property("Response").property("token");
      });
  };
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
});