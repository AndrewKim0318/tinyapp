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

const isEmailUsed = function(email, database) {
  for (let key in database) {
    if (email === database[key]["email"]) {
      return true;
    }
  }
  return false;
};

const isPasswordUsed = function(password, database) {
  for (let key in database) {
    if (password === database[key]["password"]) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = function(email, database) {
  for (let key in database) {
    if (email === database[key]["email"]) {
      return key;
    }
  }
};

const urlsForUser = function(id, database) {
  let userURLDatabase = {};
  for (let key in database) {
    if (database[key]["userID"] === id) {
      userURLDatabase[key] = database[key];
    }
  }
  return userURLDatabase;
};

const getDate = function() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let dateFormat = `${months[month]} / ${day} / ${year}`;
  return dateFormat;
};

const increaseVisitCounts = function(id, idDatabase, urlDatabase, shortURL) {
  if (idDatabase[id].visited.includes(shortURL)) {
    urlDatabase[shortURL]["visits"] += 1;
  } else {
    urlDatabase[shortURL]["visits"] += 1;
    urlDatabase[shortURL]["uniqueVisits"] += 1;
    idDatabase[id].visited.push(shortURL);
  }
};

module.exports = { generateRandomString, isEmailUsed, isPasswordUsed, getUserByEmail, urlsForUser, getDate, increaseVisitCounts };