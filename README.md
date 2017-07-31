# KURA 

Computer Science Project

### Structure

```sh
├── Views/                          # home for all the Templates
    └── layout.pug                  # Base Layout Template for all HTML Pages
    └── home.pug                    # Home page template
├── Assets/                         # home for statics files (images, css, js)
    └── css/                        # home for bootstrap and custom css files
        └── bootstrap.min.js        
        └── customstyle.css         # custom css files
    └── js/              
    └── jquery/
├── Routes/                         # home for express Routes
    └── question.js
├── Models/                         # Database Models
└── index.js                        # the main server
```

## Requirements

* **NodeJS**
* **MongoDB**

## Installation and Usage

* Get the repository

```
git clone https://github.com/adityathebe/kuraNode.git
```

* Install all the required modules

```
npm install
```

* Run MongoDB Server

```
mongod
```

* Start the server

```
npm start
```

* Start browsing

```
localhost:3000
```

## Built With

* [Express](https://expressjs.com/) - The web framework used
* [MongoDB](https://www.mongodb.com/) - Database
* [Pug](https://pugjs.org/api/getting-started.html) - Template Engine

## Developers

* [**Aditya Thebe**](https://github.com/adityathebe)
* [**Biplab Karki**](https://github.com/karkibiplab)
* [**Jonesh Shrestha**](https://github.com/joneshshrestha)

## Acknowledgement

* [Stormpath](https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions) - Web Session Management
* [Randall Degges](https://www.youtube.com/watch?v=yvviEA1pOXw&list=UUJI9gByFSXE1ABDRcLQjWgQ) - Web Authentication
* [Randall Degges](https://speakerdeck.com/rdegges/almost-everything-you-ever-wanted-to-know-about-web-authentication-in-node) - Session Management

## License

This project is licensed under the MIT License.