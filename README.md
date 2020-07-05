# BugLogger
**Work in progress:**

![work in progress image](assets/screenshot.png)

## Motivation
A Kanban-inspired issue tracker for building and editing tickets generated from parsing error logs.

## Features

## Built With
+ [Node](https://nodejs.org/)
+ [Electron](https://www.eletronjs.org/)
+ [Redux](https://redux.js.org/)
+ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
+ [Mongoose](https://mongoosejs.com/)
+ [React](https://reactjs.org/)

## Installation
Run npm install from the project root:
```
~bug-logger user$ npm install
```

## Quick Start

### Database
To connect to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and database, edit the URI template string in `/config/db.js`:
```javascript
`mongodb+srv://${username}:${password}@<cluster_code_here>.mongodb.net/<database_name_here>?retryWrites=true&w=majority`
```

### Packaging the App

## License
MIT license (c) 2020.
