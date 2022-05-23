# Play Traditional Game Project

This is a web app project containing a trial for RPS (rock, paper, scissors) game.

## What's new in this chapter?

- JSON based registered user database & subscribed user database
- Signup page and Login page
- Email subscribe for Newsletter
- Hosted app on NodeJS + ExpressJS localhost server
- Backend API for registered users data and subscribed users data
- Under construction page

## Starting the app

To run the server, type and execute this on your terminal.

```
npm install
npm start
```

Server will be accessible on [your localhost port 3000](http://localhost:3000/).

## Frontend-accessible routes

| Route   | HTTP | Body                                                                                                                                                     | Description                                |
| ------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| /       | POST | `email:String` (required)                                                                                                                                | Register an email as newsletter subscriber |
| /signup | POST | `name:String` (required), `email:String` (required), `password:String` (required), `repeatedPassword:String` (required), `agreement:Checkbox` (required) | Register a user to user database           |
| /login  | POST | `email:String` (required), `password:String` (required)                                                                                                  | Login a user using registered credentials  |

## Backend API routes

| Route                | HTTP   | Body                                                                              | Description                                                   |
| -------------------- | ------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| /api/subscribers     | GET    | none                                                                              | Get all newsletter subscribed emails                          |
| /api/subscribers/:id | GET    | none                                                                              | Get a single newsletter subscribed email by id                |
| /api/subscribers     | POST   | `email:String` (required)                                                         | Register an email as newsletter subscriber                    |
| /api/subscribers/:id | PUT    | `email:String` (required)                                                         | Change a registered newsletter subscribed email by id         |
| /api/subscribers/:id | DELETE | none                                                                              | Delete a single newsletter subscribed email by id             |
| /api/registers       | GET    | none                                                                              | Get all the registered users (exclusing password data)        |
| /api/registers/:id   | GET    | none                                                                              | Get a single registered users by id (exclusing password data) |
| /api/registers       | POST   | `name:String` (required), `email:String` (required), `password:String` (required) | Register a user to user database                              |
| /api/registers/:id   | PUT    | `name:String` (required), `email:String` (required), `password:String` (required) | Change a registered user data (all) by id                     |
| /api/registers/:id   | PATCH  | `name:String` (optional), `email:String` (optional), `password:String` (optional) | Change a registered user data (optional fields) by id         |
| /api/registers/:id   | DELETE | none                                                                              | Delete a single user by id from user database                 |

## Contact

Gregorius Ferry - [Github Page](https://github.com/grgsferry)
