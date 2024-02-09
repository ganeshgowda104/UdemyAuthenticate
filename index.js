import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Gan1@499454",
  port: 5432,
});

db.connect();


app.get("/", (req, res) => {
  
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const sqlQuery = 'INSERT INTO users (email, password) VALUES ($1, $2)';

  const checkResult = await db.query("Select * from users where email = $1", [username, ]);
  try {
    if (checkResult.rows.length > 0) {
      res.send("Email already exists . Try logging in, ");
    }else{
      const result = await db.query(sqlQuery , [username, password]);
      console.log(result);
      res.render("secrets.ejs");
    }
  } catch (error) {
    console.log(error);
  }
 
}); 

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const sqlQuery = 'select * from users where email = $1';

  const checkResult = await db.query("Select * from users where email = $1", [username, ]);
  try {
    if (password === checkResult.rows[0].password) {
      res.render("secrets.ejs");
    }else{
      res.render("login.ejs", { errorMessage: 'Entered the wrong password' });
      console.log("Not correct");
      // res.send("User not found");
      
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
