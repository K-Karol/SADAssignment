import chai from "chai"
import chaiHttp from "chai-http"
import e from 'express';
import app from "../index"
let should = chai.should();

chai.use(chaiHttp);
//the parent block
describe('backend root', () => {
    it('it should return a 200', () => {
        chai.request(app)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
            });
    });

    it('it should return a 404 test', () => {
        chai.request(app)
            .get('/aoi.wrong')
            .end((err, res) => {
                res.should.have.status(404);
            });
    });
});