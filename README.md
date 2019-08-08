# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of homepage when user is logged in"]
!(https://user-images.githubusercontent.com/49374585/62735855-5c62ad00-b9e9-11e9-9b52-5c78654d6fcd.png
)
!["screenshot of homepage when user is not logged in"]
!(https://user-images.githubusercontent.com/49374585/62735900-756b5e00-b9e9-11e9-9912-c170eb384880.png
)
!["screenshot of user's personal url database"]
!(https://user-images.githubusercontent.com/49374585/62735943-903dd280-b9e9-11e9-89cf-19fd7850c24d.png
)
!["screenshot of creating new short url"]
!(https://user-images.githubusercontent.com/49374585/62735981-a350a280-b9e9-11e9-972d-2b44b264b509.png
)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Description
- The tinyapp homepage shows the list of available short URLs currently on the database, the corresponding long URLs, the date the short URL was created, the number of visits which indicate how many times the short URL was visited, the number of unique visits indicating how many unique users have used the short URL, and the creator of the short URL

- Users must log on before being able to add new URLs that can be shorted

- Once a new short URL is created, it is shown both in public in home and the users own private URL database

- If a short URL is clicked, the user is redirected to the corresponding long URL and increases the number of visits by 1.
  - If this is the first time the user clicks on the short url, the unique visitor count is also increased by 1
