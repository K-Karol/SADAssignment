import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import app from "../index"
import e from 'express';
import { after, before } from "mocha";

chai.use(chaiHttp);
chai.should();

var bearertoken: string; //auth token
var tutorid: string;
var modleadid: string;
var moduleid: string;
var admin: string;
var studentids: string[] = []; //create users

//before << do something at the start of the file
//beforeEach << do something before each 
//after << do something at the end of the file
//afterEach << do something after each function

before(function (done) { //do first
  chai.request(app)
    .post("/api/admin/createAdminUser")
    .set('X-API-Key', `${process.env.ADMIN_APIKEY}`)
    .type("json")
    .send({
      "username": "Testersession",
      "password": "123",
      "fullname": {
        "firstname": "Firstname",
        "lastname": "Lastname"
      },
      "address": {
        "addressLine1": "test address",
        "postcode": "abcde",
        "city": "sheffield",
        "country": "UK"
      }
    })
    .end((err, res) => {
      res.should.have.status(200);
      admin = res.body.Response;

      chai.request(app) //login as a admin
        .post('/api/auth/login')
        .type('json')
        .send({
          "username": "Testersession",
          "password": "123"
        })
        .then(res => {
          bearertoken = res.body.Response.token; //save the value locally to use in later methods

          chai.request(app) //create tutor 
            .post('/api/users/resource')
            .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
            .type('json')
            .send({
              "username": "TestTutorsessiontest",
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

              chai.request(app) //create module leader staff
                .post('/api/users/resource') //route path
                .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
                .type('json')
                .send({
                  "username": "TestModLeadersessiontest",
                  "password": "123456",
                  "roles": ["Staff"],
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

                  chai.request(app) //create student 1
                    .post('/api/users/resource') //route path
                    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
                    .type('json')
                    .send({
                      "username": `Student1sessiontest`,
                      "password": "123456",
                      "roles": [],
                      "fullname": {
                        "firstname": "Stu",
                        "lastname": `1`
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

                      chai.request(app) //create student 2
                        .post('/api/users/resource')
                        .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
                        .type('json')
                        .send({
                          "username": `Student2sessiontest`,
                          "password": "123456",
                          "roles": [],
                          "fullname": {
                            "firstname": "Stu",
                            "lastname": `2`
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

                          chai.request(app) //create student 3
                            .post('/api/users/resource') //route path
                            .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
                            .type('json')
                            .send({
                              "username": `Student3sessiontest`,
                              "password": "123456",
                              "roles": [],
                              "fullname": {
                                "firstname": "Stu",
                                "lastname": `3`
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

                              chai.request(app) //create session
                                .post(`/api/modules/resource`)
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
                                  moduleid = res.body.Response;
                                  done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

describe("Attendence", () => {
  var sessionid: string;
  it("Create Session", function (done) {
    /* {
      "Success": true,
      "Response": "637f7ee41033a2dd0c455ac7"
    } */
    chai.request(app)
      .post("/api/sessions/resource") //create the session
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .type('json')
      .send({
        "type": "lecture",
        "module": `${moduleid}`,
        "cohortIdentifier": "group 1",
        "startDateTime": "2022-11-20T11:15",
        "endDateTime": "2022-11-20T12:15"
      }) //cohort id matches the one in the before
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("Success").equal(true);
        res.body.should.have.property("Response");
        sessionid = res.body.Response;
        done();
      });
  });

  /* {
  "Success": true,
  "Response": {
    "id": "636cf6dce79b126d6d2989bd",
    "username": "Danny",
    "fullname": {
      "firstname": "Danny",
      "lastname": "Oxby"
    },
    "attendance": "late"
    }
  } */
  it("Check User", function (done) {
    chai.request(app) //check the users current attendence
      .get(`/api/sessions/GetUserAttendence/${sessionid}/${studentids[0]}`)
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("Success").equal(true);
        res.body.should.have.property("Response").property("username").eql("Student1sessiontest");
        res.body.should.have.property("Response").property("attendance").eql("not");
        done();
      });
  });

  it("Update User", function (done) {
    chai.request(app) //check the users current attendence
      .patch(`/api/sessions/PatchUserAttendence/${sessionid}/${studentids[0]}`)
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .type('json')
      .send({
        "attendance": "late"
      })
      .end((err, res) => {
        res.should.have.status(200);

        //chack that change has shown
        chai.request(app) //check the users current attendence
          .get(`/api/sessions/GetUserAttendence/${sessionid}/${studentids[0]}`)
          .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("Success").equal(true);
            res.body.should.have.property("Response").property("username").eql("Student1sessiontest");
            res.body.should.have.property("Response").property("attendance").eql("late");
            done();
          });
      });
  });

  it("Delete Session", function (done) {
    /* {
      "Success": true,
    } */
    chai.request(app)
      .delete(`/api/sessions/resource/${sessionid}`) //create the session
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

after(function (done) { //delete the create object in before method
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

  for (let index = 0; index < 3; index++) {
    chai.request(app)
      .delete(`/api/users/resource/${studentids[index]}`) //remove each student
      .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
      .end((err, res) => {
      });
  }

  chai.request(app)
    .delete(`/api/modules/resource/${moduleid}`) //remove the module
    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
    .end((err, res) => {
    });

  chai.request(app)
    .delete(`/api/users/resource/${admin}`) //route path
    .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
    .end((err, res) => {
      done();
    });

});