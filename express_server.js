//Constants
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

// functions
const { generateRandomString, isEmailUsed, isPasswordUsed, getUserByEmail, urlsForUser, getDate, increaseVisitCounts } = require('./helpers.js');

//constants
const { urlDatabase, users, anonymous } = require('./constants');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  maxAge: 24 * 60 * 60 * 1000 //number of milliseconds in a day
}));
app.use(methodOverride('_method'));

// Homepage
app.get('/', (req, res) => {
  let id = req.session.userId;
  let templateVars = {
    urls: urlDatabase,
    user: users[id]
  };
  res.render("home", templateVars);
});

// user register, sign in and sign out
app.get('/register', (req, res) => {
  let id = req.session.userId;
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

  if (isEmailUsed(email, users)) {
    res.status(400).send("email already exists");
  }

  if (isPasswordUsed(hashedPassword, users)) {
    res.status(400).send("password already exists")
  }
  
  users[id] = {
    "id": id,
    "email": email,
    "password": hashedPassword,
    "visited": []
  };


  req.session.userId = id;
  res.redirect(`urls`);
});

app.get('/login', (req, res) => {
  let id = req.session.userId;
  let templateVars = {
    user: users[id]
  };
  res.render(`login`, templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password =  req.body.password;
  
  if (!isEmailUsed(email, users)) {
    res.status(403).send("email doesn't exists");
  }

  let id = getUserByEmail(email, users);

  if (bcrypt.compareSync(password,users[id]["password"])) {
    req.session.userId = id;
    res.redirect(`urls`);
  } else {
    res.status(403).send("Incorrect Password");
  }
});


app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect(`/`);
});

// Display of the current url in database
app.get('/urls', (req, res) => {
  let id = req.session.userId;
  let individualURLDatabase = urlsForUser(id, urlDatabase);
  let templateVars = {
    urls: individualURLDatabase,
    user: users[id]
  };
  res.render("url_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  let id = req.session.userId;
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
  let id = req.session.userId;
  let shortURL = req.params.shortURL;
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[id]
  };

  if (urlDatabase[shortURL]["userID"] === id) {
    res.render("url_show", templateVars);
  }
  res.redirect(`/login`);
});

app.post('/urls', (req, res) => {
  let id = req.session.userId;
  let shortURL = generateRandomString();
  let date = getDate();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: id,
    creationDate: date,
    visits: 0,
    uniqueVisits: 0
  };
  res.redirect(`/urls`);
});


app.delete("/urls/:shortURL/delete", (req, res) => {
  let id = req.session.userId;

  if (urlDatabase[req.params.shortURL]["userID"] === id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
  res.redirect('/login');
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];
  let id = req.session.userId;
  if (id) {
    increaseVisitCounts(id, users, urlDatabase, shortURL);
  } else {
    let id = req.session.userId;
    anonymous[id] = {
      "Emptyid": id,
      "visited": []
    };
    increaseVisitCounts(id, anonymous, urlDatabase, shortURL);
  }
  res.redirect(longURL);
});

app.put('/urls/:shortURL/edit', (req, res) => {
  let id = req.session.userId;
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[id]
  };
  if (urlDatabase[req.params.shortURL]["userID"] === id) {
    res.render(`url_show`, templateVars);
  }
  res.redirect(`/login`);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  res.redirect(`/urls`);
});

// opening port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});


