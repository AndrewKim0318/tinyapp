const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(cookieParser());

// Constants
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//functions
const generateRandomString = function() {
  let shortURL = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let length = 6;
  
  for (let i = 0; i < length; i++) {
    let random = Math.random(chars.length);
    let index = Math.floor(random * chars.length);
    shortURL += chars[index];
  }
  
  return shortURL;
};

const isEmailUsed = function(email) {
  for (let key in users) {
    if (email === users[key]["email"]) {
      return true;
    }
  }
  return false;
};

const isPasswordUsed = function(password) {
  for (let key in users) {
    if (password === users[key]["password"]) {
      return true;
    }
  }
  return false;
};

const findID = function(email) {
  for (let key in users) {
    if (email === users[key]["email"]) {
      return key;
    }
  }
};

const urlsForUser = function(id) {
  let userURLDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key]["userID"] === id) {
      userURLDatabase[key] = urlDatabase[key];
    }
  }
  console.log(userURLDatabase);
  return userURLDatabase;
};

// Homepage
app.get('/', (req, res) => {
  res.send("Hello!");
});

//Shows the urls that are available
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//  Test path
app.get('/hello', (req, res) => {
  let templateVars = {greetings: 'Hello World!'};
  res.render("hello_world", templateVars);
});

// user sign in and sign out

app.post('/logout', (req, res) => {
  res.clearCookie('id');
  res.redirect(`/urls`);
});

// Display of the current url in database
app.get('/urls', (req, res) => {
  console.log(users);
  let id = req.cookies["id"];
  let individualURLDatabase = urlsForUser(id);
  let templateVars = {
    urls: individualURLDatabase,
    user: users[id]
  };
  res.render("url_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  let id = req.cookies["id"];
  let user = users[id];
  let templateVars = {
    user: user
  };
  if (user) {
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  let id = req.cookies["id"];
  let shortURL = req.params.shortURL;
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL],
    user: users[id]
  };

  if (urlDatabase[shortURL]["userID"] === id) {
    res.render("url_show", templateVars);
  }
  res.redirect(`/login`);
});

app.post('/urls', (req, res) => {
  let id = req.cookies["id"];
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: id
  };
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let id = req.cookies["id"];
  if (urlDatabase[req.params.shortURL]["userID"] === id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
  res.redirect('/login');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  let id = req.cookies["id"];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[id]
  };
  if (urlDatabase[req.params.shortURL]["userID"] === id) {
    res.render(`url_show`, templateVars);
  }
  res.redirect(`/login`);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect(`/urls`);
});

app.get('/register', (req, res) => {
  let id = req.cookies["id"];
  let templateVars = {
    user: users[id]
  };
  res.render(`registration`, templateVars);
});

app.post('/register', (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password =  req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10);
  
  if (email === "" || password === "") {
    res.status(400).send("Invalid email or password");
  }

  if (isEmailUsed(email)) {
    res.status(400).send("email already exists");
  }

  if (isPasswordUsed(hashedPassword)) {
    res.status(400).send("password already exists")
  }
  
  users[id] = {
    "id": id,
    "email": email,
    "password": hashedPassword
  };


  res.cookie('id', id);
  res.redirect(`urls`);
});

app.get('/login', (req, res) => {
  let id = req.cookies["id"];
  let templateVars = {
    user: users[id]
  };
  res.render(`login`, templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password =  req.body.password;
  
  if (!isEmailUsed(email)) {
    res.status(403).send("email doesn't exists");
  }

  let id = findID(email);

  if (bcrypt.compareSync(password,users[id]["password"])) {
    res.cookie('id', id);
    res.redirect(`urls`);
  } else {
    res.redirect('/login');
  }
});

// opening port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});


