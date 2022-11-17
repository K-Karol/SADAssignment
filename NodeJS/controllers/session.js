"use strict"; //foce the lines to end with ;
require("dotenv").config();
const session = require("../models/session"); //get the local model
const { default: mongoose } = require("mongoose");
//these methods should be filtered to be module specific 

//get all session id's
exports.FindAllSessions =  async (req, res) => {
  try {
    session.find().then
    (data => {
      res.send(data); //data found normally
    })
    .catch(err => { //error coused when find the data
        res.status(401).send( {
            message: err.message + " :: Can't find any session in session.js, FindAllSessions method"
        });
    });
  } catch (error) {
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
}

//get session from query
exports.FindSessionAttendence = async (req, res) => { //show all students and their attendence for a specific session (the current session only)
  try{
    const sessionid = req.query.id;

    if (!mongoose.isValidObjectId(sessionid)) { //check if the id links to data? << i think
      return res.status(400).json(
          respGen.generateResult(false, null, "ID is not in the valid format")
        );
    }

    session.findById(sessionid).then
    (data => {
      res.send(data); //data found normally
    })
    .catch(err => { //error coused when find the data
        res.status(401).send( {
            message: err.message + " :: Can't find session in session.js, FindSessionAttendence method"
        });
    });

  }catch(error){ //generate a default error message
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
}

//get session and user from query
exports.FindUserAttendence = async (req, res) => {//find the attendence value for a specific user (for a number of session)
  try{
    const sessionid = req.query.id;

    if (!mongoose.isValidObjectId(sessionid)) { //check if the id links to data? << i think
      return res.status(400).json(
          respGen.generateResult(false, null, "ID is not in the valid format")
        );
    }

    session.findById(sessionid).then
    (data => {//message should be the user object
      data.students.find(req.query.user).then( //see if the session data contains the student user
        user => {
          res.send(user); //data found normally
        }).catch(err => { //error coused when find the data
          res.status(401).send( {
              message: err.message + " :: Can't find user in in session model in session.js, FindUserAttendence method"
          });
        //student: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        });
   })
    .catch(err => { //error coused when find the data
        res.status(401).send( {
            message: err.message + " :: Can't find session in session.js, FindUserAttendence method"
        });
    });

  }catch(error){ //generate a default error message
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
}

//get session and user from query and new value from message
exports.UpdateUserAttendence = async (req, res) => {//for a selected student for a specific session change their attendence mark
  try{
    //check new value matches one of enum : ['not', 'late', 'full']
    const sessionid = req.query.id;

    if (!mongoose.isValidObjectId(sessionid)) { //check if the id links to data? << i think
      return res.status(400).json(
          respGen.generateResult(false, null, "ID is not in the valid format")
        );
    }

    session.findById(sessionid).then
    (data => {//message should be the user object
      data.students.find(req.query.user).then( //see if the session data contains the student user
        user => {
          const options = ['not', 'late', 'full'];
          if(options.includes(req.query.message.state)){ //if the input is one of the three options
            res.send(user, req.query.message.state); //data found normally
          }else{
            res.status(401).send( {
              message: " state change input not valid input in session.js, UpdateUserAttendence method"
          });
          }
        }).catch(err => { //error coused when find the data
          res.status(401).send( {
              message: err.message + " :: Can't find user in in session model in session.js, UpdateUserAttendence method"
          });
        //student: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        });
   })
    .catch(err => { //error coused when find the data
        res.status(401).send( {
            message: err.message + " :: Can't find session in session.js, UpdateUserAttendence method"
        });
    });
  }catch(error){ //generate a default error message
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
}

// exports.FindSessionAttendenceAtDate = async (req, res) => {
//   //show all students and their attendence for a specific session (the current session only)
//   try{
//     const sessionid = req.query.id;
//     const datequery = req.query.date;

//     if (!mongoose.isValidObjectId(sessionid)) { //check if the id links to data? << i think
//       return res.status(400).json(
//           respGen.generateResult(false, null, "ID is not in the valid format")
//         );
//     }

//     session.find(sessionid, datequery).then
//     (data => {
//       res.send(data); //data found normally
//     })
//     .catch(err => { //error coused when find the data
//         res.status(401).send( {
//             message: err.message + " :: Can't find session in session.js, FindSessionAttendence method"
//         });
//     });

//   }catch(error){ //generate a default error message
//     res.status(500).json(respGen.generateResult(false, null, error.message));
//   }
// }