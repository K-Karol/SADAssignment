import dotenv from 'dotenv';

import { connect, Connection, connection } from "mongoose";
import {Logger} from "tslog"
import Role from './models/role';

dotenv.config();
const {DATABASE_URL = "mongodb://monbodb:27017"} = process.env 

const logger: Logger = new Logger({name: "Database"});

export default class Database{
  connection: Connection;
  
  constructor(){
    connect(DATABASE_URL);
    this.connection = connection;
    connection.on('connected', this.db_onConnected);
    connection.on('disconnected', () => {logger.info('database disconnected succesfully')});
    connection.on('error', (err) => logger.error("connection error", err));
  }
  private db_onConnected() : void{
    logger.info("database connected succesfully");

    Role.count(async (err, res) => {
      if(err){
        logger.error(err);
        return;
      }
      
      if(res > 0){
        return;
      }

      await Role.create({name: "Admin"});

    })
  }
}