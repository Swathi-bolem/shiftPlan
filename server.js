const express=require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "st12q01nt-mixtldb018.dbs.ise.apple.com",
    user: "tesuser_admin",
    password: "welcome12",
    database: "tesdashboard",
    port: 3362
  });

  db.connect((err) => {
    if (err) {
      console.error("Database connection failed: ", err);
    } else {
      console.log("Connected to MySQL Database");
    }
  });




  //db.query("SELECT * FROM tes_ets_shift_plan", (err, results) => {
    //if (err) {
      //console.error("Error fetching data:", err);
      //return;
    //}
    //console.log("Fetched Data:", results);

    // Close the connection
   // db.end();
  //});


  app.get("/shiftplan", (req, res) => {
    db.query("SELECT * FROM tes_ets_shift_plan", (err, results) => {
        if (err) {
          console.log("error");
          return res.status(500).json({ error: "Error fetching data" });
        }
        //console.log(results)
     res.json(results);
    
      });
  });
  
  app.post("/updateCell/:id", (req, res) => {
    const { id } = req.params;
    const { column, value } = req.body;

    if (!id || !column || value === undefined) {
        return res.status(400).send("Invalid request. Ensure ID, column, and value are provided.");
    }

    // Ensure column names with dates are properly formatted with backticks
    
    const query = `UPDATE tes_ets_shift_plan SET \`${column}\` = '${value}' WHERE PersonId = ${id}`;
    ;
    console.log(query)
    db.query(query, [value, id], (err, results) => {
        if (err) {
            console.error("Error updating cell:", err);
            res.status(500).send("Error updating cell");
        } else {
            res.json({ message: "Cell updated successfully", results });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
