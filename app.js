// Set up Express
const express = require("express");
const session = require("express-session");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// Other Dependencies
const request = require("request");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
var petsData;


app.use(session({
  secret: "top secret!",
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

// Routes

// GET routes
app.get("/", function(req, res) {
  res.render("index");
}); // Main Route

app.get("/adopt", function(req, res) {

  var conn = createDBConnection();
  let sql = "SELECT DISTINCT animal_type FROM pets ORDER BY animal_type";
  //let sql = "SELECT animal from animals inner join pets on animals.id = pets.id";
  let animals = req.query.animal_type;
  

  conn.query(sql, function(err, result){
      if (err) throw err;
     res.render("adopt", {"rows": result});
      console.log(result);
    //console.log(animals);
    //console.log(image);
    }); // query
});// populates page of mysql images

app.get("/login", function(req, res) {
  res.render("login");
}); //login page

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
}); //logout

app.get("/myAccount",isAuthenticated, function(req,res) {
  res.render("account");
});


app.get("/displayPets", async function(req, res) {
  var conn = createDBConnection();
  let sql = "SELECT DISTINCT animal_type FROM pets ORDER BY animal_type";

    conn.query(sql, function(err, result){
      if (err) throw err;
      res.render("adopt", {"rows": result, "image": image});//render on certain page.
      console.log(result);
    }); // query
}); //display Pet Species

app.get("/api/getimage", function(req, res) {
  var conn = createDBConnection();
  let sql = "SELECT image FROM pets WHERE animal_type = ?";
  var sqlParams = req.query.animal_type; 
  //var sqlParams = req.query.pet_name;
  conn.query(sql, sqlParams, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  }); //query
});//display Pet Images based on animal type

//API to get pet price
app.get("/api/getPrice", function(req,res){
  var conn = createDBConnection();
  let sql = "SELECT adoption_fee FROM pets WHERE animal_type = ?";
  var sqlParams = req.query.animal_type;
  conn.query(sql, sqlParams, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  }); //query
  
});//display pet prices select



//API to get pet location
app.get("/api/getLocation", function(req, res) {
  var conn = createDBConnection();
  let sql = "SELECT location FROM pets WHERE animal_type = ?";
  var sqlParams = req.query.animal_type; 
  //var sqlParams = req.query.pet_name;
  conn.query(sql, sqlParams, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  }); //query
});//display pet location





// API for requesting all the pet names
app.get("/api/petNames", function(req, res) {
  var conn = createDBConnection();
  let sql = "SELECT pet_name FROM pets"
  
  conn.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  }) // Query
}); // API route
        
     


// POST routes

app.post("/admin", async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  
  let result = await checkUsername(username);
  //console.dir(result);
  
  var dbPassword="";
  
  if(result.length > 0) {
    dbPassword= result[0].user_password;
  }
  
  let passwordMatch = await checkPassword(password, dbPassword)
  
  if (passwordMatch) {
    console.log("passwordMatch detected");
    req.session.authenticated = true;
    
    var promise = new Promise( function(resolve, reject) {
    let conn = createDBConnectionMultiple();
    let sql = "SELECT pet_name FROM pets; SELECT id, animal FROM animals; SELECT DISTINCT adoption_fee  FROM pets ORDER BY adoption_fee; SELECT DISTINCT location FROM pets;";
  
    conn.query(sql, function(err, pet_result) {
      if (err) throw err;
      petsData = pet_result;
      res.render("admin", {"pets": petsData});
      }); // Query  
      }); // Promise
  } else {
    console.log("passwordMatch NOT detected");
    req.session.authenticated = false;
    res.render("index", {"loginError":true});
  }
}); //admin work page

// Logs out an administrative user
app.post("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
}); // logout

//
app.post("/generateReport", isAuthenticated, function (req, res) {
   var sql = "SELECT AVG(adoption_fee) AS avg, MIN(adoption_fee) as min, MAX(adoption_fee) as max FROM pets"
   var avg; 
    var promise = new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [], function (err, rows, fields){//rows, fields) {
                if (err) throw err;
              var avg = rows[0].avg;
              var min = rows[0].min;
              var max = rows[0].max;
                //console.log("Generate report: ", avg, min, max);
              
              getAnimalTypeCount().then(function(results){
                var animalIndexToName = ['dog(s)', 'cat(s)', 'horse(s)', 'guinea pig(s)', 'rabbit(s)', 'alligator(s)', 'otter(s)']
                //console.log("result => {", results)
                for(var i = 0; i < results.length; i++){
                  results[i]["petname"] = animalIndexToName[i]
                }
                 res.render("admin", {"avg" : avg, "min" : min, "max" : max,"results": results, "pets": petsData});    
                });
              });
            });//query
        });//connect
});//end of aggregates function

/* Update table route, user must fill in all fields */
app.post("/updateTable", isAuthenticated, function (req, res) {
    var petName = req.body.pet_name;
    var animalType  = parseInt(req.body.animal_type);
    var adoptionFee = parseFloat(req.body.adoption_fee);
    var physicalLocation = req.body.location;
    var imageurl = req.body.imageURL;
    var desc = req.body.description;
    let sqlParams = [animalType, adoptionFee, physicalLocation, imageurl, desc, petName];
  console.log(sqlParams);
    var sql = "UPDATE pets SET animal_type = ?, adoption_fee = ?, location = ?, image = ?, description = ? WHERE pet_name = ?";
    var promise = new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, sqlParams, function (err, rows, fields) {
                if (err) throw err;
              if (rows.affectedRows == 0) {
                //console.log("Update execution: ", rows, fields);
                res.render("admin", {upSuccess: false, "pets": petsData})
              } else {
                //console.log("Update execution: ", rows, fields);
                res.render("admin", {upSuccess: true, "pets": petsData});
              }
            });//query
        });//connect
    });//promise
});

/* Insert new admin record, user must fill in all fields */
app.post("/insertRecord", isAuthenticated, function (req, res) {
    var username = req.body.username;
    var password  = req.body.password;
    var realname = req.body.realname;
    var sql = "INSERT INTO administration(user_name, user_password, real_name) VALUES(?,?,?)";
    var sqlParams = [username, password, realname];
  
    if (username == "" || password == "" || realname == "") {
      res.render("admin", {sql: sql, insertSuccess: false});
    }
    var promise = new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, sqlParams, function (err, rows, fields) {
                if (err) throw err;
                else if (rows.affectedRows == 0) {
                  res.render("admin", {"pets": petsData, insertSuccess: false})
                } else {
                  res.render("admin", {
                    sql: sql, insertSuccess: true, "pets": petsData
                  });
                }
            });//query
        });//connect
    });//promise
});

/* Delete record route, delete a row based on pet name */
app.post("/deleteRecord", isAuthenticated, function (req, res) {

    var petName = req.body.pet_name;
    var sql = "DELETE FROM pets where pet_name = ?"

    var promise = new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [petName], function (err, rows, fields) {
                if (err) { throw err }
                else if (rows.affectedRows == 0) {
                  res.render("admin", {delSuccess: false, "pets": petsData})
                } else {
                  //console.log("Delete execution: ", rows, fields);
                  res.render("admin", {
                    sql: sql, delSuccess: true, "pets": petsData
                  });
                }
            });//query
        });//connect
    });//promise
});

// Local Server Listener

const port = 8081 || process.env.PORT;
const serial = "0.0.0.0" || process.env.IP;

/*
app.listen(port, serial, function() {
    console.log("Express Server is Running...");
}); */


// Heroku Server Deployment
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Express Server...");
}); 


// Helper Functions

/* 
* getAnimalTypeCount function
* @returns an array containing counts of all the animal types
*/
function getAnimalTypeCount(){
    var sql = "SELECT COUNT(animal_type) as howmany, animal_type FROM pets GROUP BY animal_type"
    return new Promise(function (resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [], function (err, rows, fields) {
                if (err) throw err;
                //console.log("Generate report: ", rows, fields);
                resolve(rows)
                });
            });//query
        });//connect
    //});//promise
}

// Middleware function that keeps a user session active
function isAuthenticated(req, res, next) {
  if(!req.session.authenticated) {
    res.redirect('/');
  } else {
    next()
  }
}

// Checks the provided password against the database password for authentication
function checkPassword(password, dbPassword) {
  return new Promise( function(resolve, reject) {
    bcrypt.compare(password, dbPassword, function(err, result) {
      resolve(result);
    }); //bcrypt
  }); // promise
}

/**
* Checks whether the username exists in the database
* if found, returns corresponding record.
* @param {string} username
* @return {array of objects}
*/
function checkUsername(username){
  let sql = "SELECT * FROM administration WHERE user_name = ? ";
  return new Promise(function(resolve,reject){
    let conn = createDBConnection();
    conn.connect(function(err) {
      if (err) throw err;
      conn.query(sql, [username], function(err,rows,fields) {
        if (err) throw err;
        resolve(rows);
      });//query
    });//connect
  });//promise
}

//route to insert a new pet into the database, user must fill in all fields 
app.post("/insertPet", isAuthenticated, function (req, res) {
  //console.log("animalType is: " + req.body.animal_type.charAt[1]);  
  var petName = req.body.pet_name;
    //var animalType  = req.body.animal_type;
  var animalType = parseInt(req.body.animal_type);
    var adoptionFee = req.body.adoption_fee;
    var physicalLocation = req.body.location;
    var imageurl = req.body.imageURL;
    var desc = req.body.description;
    var sql = "INSERT INTO pets(pet_name, animal_type, adoption_fee, location, image, description) VALUES(?,?,?,?,?,?)";

        let conn = createDBConnection();
        //conn.getConnection(function (err) {
  conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [petName, animalType, adoptionFee, physicalLocation, imageurl, desc
                            ], function (err, rows, fields) {
                if (err) throw err;
                //console.log("Insert execution: ", rows, fields);
                //res.render("admin", {sql: sql});
              res.render("admin", {"pets": petsData});
            });//query
        });//connect
    

});

//route to insert a new pet into the database, user must fill in all fields 
app.post("/insertAdoptedPet",  function (req, res) {
  console.log("inside inserAdoptedPet")
  var petName = req.body.pet_name;
  //var adoptionFee = req.body.adoption_fee;
  var sql = "INSERT INTO adopted_pets(pet_name) VALUES(?)";
  console.log("petName is " + petName);
  let conn = createDBConnection();
       console.log("insert adopted pet called successfully");
  conn.connect(function (err) {
            if (err) throw err;
            conn.query(sql, [petName], function (err, rows, fields) {
                if (err) throw err;
                //console.log("Insert execution: ", rows, fields);
                //res.render("admin", {sql: sql});
              res.send("");
            });//query
        });//connect
    

});

//************************NEW APIS************************//

//route to search for a pet to adopt
app.get("/adoptSearch", function (req, res) {
  var animalType = req.query.animal;
  var physicalLocation = req.query.location;
  var adoptionFee = req.query.adoption_fee;
  var sql = "SELECT * FROM pets WHERE animal_type = ? AND location = ? AND adoption_fee =?";
  conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
   conn.query(sql, [animalType, physicalLocation, adoptionFee],    function(err,results){
        if(err) throw err;
     console.dir(results);
        res.send(results);
  });//query
    });//connect
  
});

//get pet types
app.get("/getPetTypes", function (req, res) {
  
  sql = "SELECT DISTINCT animal_type FROM pets";
  var conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
     conn.query(sql, function(err,results){
        if(err) throw err;
        res.send(results);

            });//query
        });//connect
});

//get pet location
app.get("/getPetLocation", function (req, res) {
  
  sql = "SELECT DISTINCT location FROM pets";
  var conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
     conn.query(sql, function(err,results){
        if(err) throw err;
       console.dir(results);
        res.send(results);

            });//query
        });//connect
});

//store the info in a session array variable
app.get("/storeInfo",function(req,res){
  
  if (!req.session.pets) {
    req.session.pets = [];
  }
  req.session.pets.push(req.query.pet_name);
  var string = "";
  //var imageTag = "";
  var total = 0;
  
  //establish cart total
  //for each element in the session array, extract the adopotion cost, cast/turn it into an int value and add it to the total
  for(i=0;i<req.session.pets.length;i++)
  {
    for(j=0;j<req.session.pets[i].length;j++)
      {
        if(req.session.pets[i].charAt(j) == "0" || req.session.pets[i].charAt(j) == "1" || req.session.pets[i].charAt(j) == "2" || req.session.pets[i].charAt(j) == "3" || req.session.pets[i].charAt(j) == "4" || req.session.pets[i].charAt(j) == "5" || req.session.pets[i].charAt(j) == "6"  || req.session.pets[i].charAt(j) == "7"  || req.session.pets[i].charAt(j) == "8" || req.session.pets[i].charAt(j) == "9" )
          {
            string += req.session.pets[i].charAt(j);
          }
      }
    total = total + Number(string);
    string = "";
  }
 
  req.session.cartTotal = total;
  
  //get the image tag
  /*
  for(i=0;i<req.session.pets.length;i++)
  {
    for(j=0;j<req.session.pets[i].length;j++)
      {
        if(req.session.pets[i].charAt(j) == "<")
          {
            //run another loop until the end of the string then break all the loops
            //imageTag += req.session.pets[i].charAt(j);
          }
      }
    //total = total + Number(string);
    //string = "";
  }
  */
  //req.session.imageTag = imageTag;
  
  res.send("");
});

//get the info from the session variable
app.get("/retrieveInfo",function(req,res){
  res.send(req.session);
});


//get pet location
app.get("/getAdoptionFee", function (req, res) {
  
  sql = "SELECT DISTINCT adoption_fee FROM pets";
  var conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
     conn.query(sql, function(err,results){
        if(err) throw err;
       //console.dir(results);
        res.send(results);

            });//query
        });//connect
});

//get pet location
app.get("/getAllPets", function (req, res) {
  
  sql = "SELECT * FROM pets";
  var conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
     conn.query(sql, function(err,results){
        if(err) throw err;
       //console.dir(results);
        res.send(results);

            });//query
        });//connect
});

//route to search for a pet to adopt
app.get("/getPetInfo", function (req, res) {
  var petName = req.query.pet_name;
  var sql = "SELECT * FROM pets WHERE pet_name = ?";
  conn = createDBConnection();
  conn.connect(function(err){
     if(err) throw err;
   conn.query(sql, petName,   function(err,results){
        if(err) throw err;
     console.dir(results);
        res.send(results);
  });//query
    });//connect
  
});

/*
// Create a connection to the database server
function createDBConnection() {
    var conn = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"",
    database:"groupProject"//fill in the database name after it has been created in phpmyadmin
  });
    return conn;
} 
*/

// Create a connection to the database server
function createDBConnection() {
    var conn = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"",
    database:"groupProject"//fill in the database name after it has been created in phpmyadmin
  });
    return conn;
}

// Create a multi query connection to the database server
function createDBConnectionMultiple() {
    var conn = mysql.createPool({
        connectionLimit: 2,
        host: "us-cdbr-iron-east-02.cleardb.net",
        user: "b966e7405b082e",
        password: "e739afd6",
        database: "heroku_d27a5db666d1cf0",
        multipleStatements: true
    });
    return conn;
}

/*
//old createDBConnection insides
var conn = mysql.createPool({
        connectionLimit: 7,
        host: "us-cdbr-iron-east-02.cleardb.net",
        user: "b966e7405b082e",
        password: "e739afd6",
        database: "heroku_d27a5db666d1cf0"
    });
*/
