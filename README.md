# Shop & Chef
Project #2

Team 1

 + [Nate King](https://github.com/natemking)
 + [Luke Martin](https://github.com/LukeMartin-123)
 + [Greg Leighton](https://github.com/preussenfahrer)
 + [Meredith Jones](https://github.com/meredithajones)  
---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/natemking/shop_n_chef/blob/main/LICENSE)

![html5 badge](https://img.shields.io/badge/html5%20-%23E34F26.svg?&style=flat&logo=html5&logoColor=white)
![css3 badge](https://img.shields.io/badge/css3%20-%231572B6.svg?&style=flat&logo=css3&logoColor=white)
![node.js badge](https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=flat&logo=node.js&logoColor=white)
![express badge](https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=flat)
![ejs badge](https://img.shields.io/badge/%20EJS%20-%23B4CA65.svg?&style=flatColor=white%22/)
![sequelize badge](https://img.shields.io/badge/Sequelize-%2304AFEF.svg?&style=flat&logoColor=white)
![heroku badge](https://img.shields.io/badge/heroku%20-%23430098.svg?&style=for-the-badge&logo=heroku&logoColor=white)
![bootstrap badge](https://img.shields.io/badge/bootstrap%20-%23563D7C.svg?&style=flat&logo=bootstrap&logoColor=white)

---
## Table of Contents
 * [Links](#links)
 * [Introduction](#introduction)
 * [Description](#description)
    + [Scope of Work](#scope-of-work)
    + [Sequelize](#sequelize)
    + [Node.js](#nodejs)
    + [EJS View Engine](#ejs-view-engine)
    + [Axios](#axios)
    + [jQuery](#jquery)
    + [CSS](#css)
  * [Screenshots](#screenshots)
  * [License](#license)
  * [Credits](#credits)

# Links

* [Deployed Link](https://shop-n-chef.herokuapp.com/)

# Introduction
  Shop & Chef is a disposable grocery list application. 

   This application is designed for those who are experienced home chefs, or newcomers to home cooking, combining food shopping with new, exciting, and inspiring recipe suggestions. 

## Description/User Story 
  AS A USER I want an app that will allow me to link my grocery list with potential recipes
  WHEN I use Shop & Chef 
  THEN I will enter my log-in credentials

  WHEN I input an ingredient
  THEN it will be added to a list

  WHEN I select a specific ingredient on my list
  THEN I am prompted with potential recipes to use this ingredient

  WHEN I have a recipe I like
  THEN I can save this to a list of favorite recipes


### Scope of Work
Users can easily add items of their choosing to thier shopping list. If they are looking for recipe inspiration, the app has a feature to seach for recipes based on main ingredient as well. 

To streamline the experience of creating a shopping list based on recipes, Shop & Chef allows users to add ingredients directly from recipes to their shopping list with a click on the ingredient. 

The application also alows users to save and retrieve their favorite recipes. 

### Sequelize
  Sequelize is a promise-based Node.js ORM which we utilized to streamline usage with MySQL.
  Installation:

`$ npm install --save sequelize`


### Node.js

Express is the application that we utlized the most through node.js. The servers that we created route to the HTML data and the other to API for the data. 
We are running the GET, POST, PUT, & DELETE methods for the data. We render the necessary data to the front end using EJS.

### EJS View Engine
We use EJS Tempelating Engine to render our data to be viewed on the front end. 
Installation
`$ npm install ejs`
 
### jQuery
We use jQuery to handle event listeners and AJAX calls to the backend. Our AJAX calls were responsible for our functions carrying data from user logins, sign ups, recipe retreival and display. 


### CSS
Our styling was created using Bootstrap for our navbar, buttons and user input fields. We used Bootswatch for our theme, and quite a bit of custom css written for placing the background image, font styling, custom color schemes and other fine tuning of the application's appearance. 

## Screenshots

<!-- ![app gif](public/assets/images/screenshots/burger_banquet.gif)
<br>

_App Functionality_
<br>

![mobile resolution](public/assets/images/screenshots/burger_banquet_mobile.png)

_Mobile Responsiveness_ -->

## License
Licensed under the MIT License. Copyright © 2021

## Credits

<!-- * [Make elements be clickable after they are returned from an ajax call](https://stackoverflow.com/questions/6594226/jquery-class-selector-not-working/6602120)

* [Better Express routing for Node JS](https://caffeinecoding.com/better-express-routing-for-nodejs/)

* [Toggle a Boolean](https://stackoverflow.com/questions/11604409/how-to-toggle-a-boolean)  -->




