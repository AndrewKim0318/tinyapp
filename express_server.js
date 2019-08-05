const express = require('express');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  let templateVars = {greetings: 'Hello World!'};
  res.render("hello_world", templateVars);
});

app.get('/urls', (res, req) => {
  let templateVars = {urls: urlDatabase};
  res.render("url_index", templateVars);
});



