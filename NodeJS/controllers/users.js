const User = require("../models/user");

exports.create = (req, res) => {
  // Validate request


  console.log(req.body);

  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Animal model object
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  // Save Animal in the database
  user.save()
    .then((data) => {
      console.log("User saved in the database: " + data);
      res.send("User saved");
      // res.redirect('/petshop/animals');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all Animals from the database.
exports.findAll = (req, res) => {
    // const name = req.query.name;
    // //We use req.query.name to get query string from the Request and consider it as condition for findAll() method.
    // var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
     User
      .find({})
      .then(data => {
         res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
   };
   