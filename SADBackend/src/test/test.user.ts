import { expect, should } from "chai"
import chai from "chai"
import chaiHttp from "chai-http"
import e from 'express';
import app from "../index"
import { assert } from "console";
import { stringify } from "querystring";

chai.use(chaiHttp);
chai.should();

var bearertoken: string;

describe("Users", () => {
  before(function (done) { //don't put tests in here else the before will not be called first causing issues (same with describe and it)
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
        done();
        //console.log(bearertoken);
      });
  });

  //these methods work under the assumption that the DB exists and that the roles Staff, Admin and Student exist

  //the parent block
  describe('Test Users', () => {
    /*{
      "Success": true,
      "Response": "637dfab875f042c13c3aa209"
    }*/
    var tutorid: string;
    it('Create a Staff', (done) => {
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
          res.should.have.status(200);
          res.body.should.have.property("Success").equal(true);
          res.body.should.have.property("Response");
          tutorid = res.body.Response;
          done(); //end point
        });
    });

    it('Update a Staff', (done) => {
      chai.request(app)
        .put(`/api/users/resource/${tutorid}`) //rout path
        .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
        .type('json')
        .send({ //change the tutor address
          "address": {
            "addressLine1": "100 Talmadge Road",
            "postcode": "DN22",
            "city": "Eaton",
            "country": "United Kingdom"
          }
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("Success").equal(true);
          res.body.should.have.property("Response").property("address").eql({ //deep equals(have same value's but not same object)
            "addressLine1": "100 Talmadge Road",
            "postcode": "DN22",
            "city": "Eaton",
            "country": "United Kingdom"
          });
          done(); //end point
        });
    });

    it('Delete a Staff', (done) => {
      chai.request(app)
        .delete(`/api/users/resource/${tutorid}`) //rout path
        .set({ "Authorization": `Bearer ${bearertoken}` }) // pass the login token from before method
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("Success").equal(true);
          done(); //end point
        });
    });
  });
});