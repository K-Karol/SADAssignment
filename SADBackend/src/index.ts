import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import bodyParse from 'body-parser'

dotenv.config();

const app: Express = express();

const {PORT = 5000, CORS_ORIGIN="https://localhost"} = process.env


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var corsOptions = {
  origin: CORS_ORIGIN
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {res.send(testFunction())})

app.listen(PORT, () => console.log("Server is up and running with a change that was detected by Nodemon!"));


function testFunction() : string {
  console.log("Hello there!");
  return "Root of the API";
}
