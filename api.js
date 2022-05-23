const fs = require("fs");
const express = require("express");
const api = express.Router();

let emails = require("./db/emails.json");
let database = require("./db/users.json");
const { cekDuplikat, findById, rewriteEmails, rewriteDatabase } = require("./function.js");
const { body, validationResult, check } = require("express-validator");
const req = require("express/lib/request");

api.use(express.json());
api.use(express.urlencoded({ extended: false }));

const emailValidatorMiddleware = [
  check("email", "Email is not valid.").isEmail(),
  body("email").custom((value) => {
    const duplikat = cekDuplikat(value, emails);
    if (duplikat) {
      throw new Error("Can't subscribe. Email has already subscribed.");
    }
    return true;
  }),
];

const registerValidatorMiddleware = [
  body("name", "Name cannot be empty.").not().isEmpty(),
  body("email", "Email cannot be empty.").not().isEmpty(),
  body("email", "Email is not valid.").isEmail(),
  body("email").custom((value) => {
    const duplikat = cekDuplikat(value, database);
    if (duplikat) {
      throw new Error("Email has already registered.");
    }
    return true;
  }),
  body("password", "Password cannot be empty.").not().isEmpty(),
];

const registerValidatorMiddlewareOptional = [
  body("name", "Name cannot be empty.").optional().not().isEmpty(),
  body("email", "Email cannot be empty.").optional().not().isEmpty(),
  body("email", "Email is not valid.").optional().isEmail(),
  body("email")
    .optional()
    .custom((value) => {
      const duplikat = cekDuplikat(value, database);
      if (duplikat) {
        throw new Error("Email has already registered.");
      }
      return true;
    }),
  body("password", "Password cannot be empty.").optional().not().isEmpty(),
];

//EMAIL SUBSCRIBERS GET
api.get("/subscribers", (req, res) => {
  res.status(200);
  res.json(emails);
});

//EMAIL SUBSCRIBERS GET BY ID
api.get("/subscribers/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = findById(id, emails);
  if (found) {
    res.status(200);
    res.json(found);
  } else {
    res.status(400);
    throw new Error(`User ID ${id} is not found from subscribed users.`);
  }
});

//EMAIL SUBSCRIBERS POST
api.post("/subscribers", emailValidatorMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json(errors);
  } else {
    rewriteEmails(req.body.email, emails);
    res.status(200);
    res.send(`${req.body.email} is successfully subscribed!`);
  }
});

//EMAIL SUBSCRIBERS PUT BY ID
api.put("/subscribers/:id", emailValidatorMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json(errors);
  } else {
    const id = Number(req.params.id);
    const found = findById(id, emails);
    if (found) {
      const newData = {
        id,
        email: req.body.email,
      };
      emails = emails.map((data) => {
        if (data.id === id) {
          return newData;
        }
        return data;
      });
      fs.writeFileSync(__dirname + "/db/emails.json", JSON.stringify(emails));
      res.status(200);
      res.send(`Successfully overwrote data of user ID ${id} from subscribed users.`);
    } else {
      res.status(400);
      throw new Error(`Failed to overwrite, because user ID ${id} is not found from subscribed users.`);
    }
  }
});

//EMAIL SUBSCRIBERS DELETE BY ID
api.delete("/subscribers/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = findById(id, emails);
  if (found) {
    emails = emails.filter((email) => email.id !== id);
    fs.writeFileSync(__dirname + "/db/emails.json", JSON.stringify(emails));
    res.status(200);
    res.send(`Successfully deleted data of user ID ${id} from subscribed users.`);
  } else {
    res.status(400);
    throw new Error(`Failed to delete, because user ID ${id} is not found from subscribed users.`);
  }
});

//REGISTERED USERS GET
api.get("/registers", (req, res) => {
  const shown = [];
  database.forEach((data) =>
    shown.push({
      id: data.id,
      name: data.name,
      email: data.email,
    })
  );
  res.status(200);
  res.json(shown);
});

//REGISTERED USERS GET BY ID
api.get("/registers/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = findById(id, database);
  if (found) {
    const shown = {
      id: found.id,
      name: found.name,
      email: found.email,
    };
    res.status(200);
    res.json(shown);
  } else {
    res.status(400);
    throw new Error(`Can't find user ID ${id} from registered users.`);
  }
});

//REGISTERED USERS POST
api.post("/registers", registerValidatorMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json(errors);
  } else {
    rewriteDatabase(req.body, database);
    res.status(200);
    res.send(`${req.body.email} is successfully registered!`);
  }
});

//REGISTERED USERS PUT BY ID
api.put("/registers/:id", registerValidatorMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json(errors);
  } else {
    const id = Number(req.params.id);
    const found = findById(id, database);
    if (found) {
      const newData = {
        id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      database = database.map((data) => {
        if (data.id === id) {
          return newData;
        }
        return data;
      });
      fs.writeFileSync(__dirname + "/db/users.json", JSON.stringify(database));
      res.status(200);
      res.send(`Successfully overwrote data of user ID ${id} from subscribed users.`);
    } else {
      res.status(400);
      throw new Error(`Failed to overwrite, because user ID ${id} is not found from subscribed users.`);
    }
  }
});

//REGISTERED USERS PATCH BY ID
api.patch("/registers/:id", registerValidatorMiddlewareOptional, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json(errors);
  } else {
    const id = Number(req.params.id);
    const found = findById(id, database);
    if (found) {
      database = database.map((data) => {
        if (data.id === id) {
          return {
            ...data,
            ...req.body,
          };
        }
        return data;
      });
      fs.writeFileSync(__dirname + "/db/users.json", JSON.stringify(database));
      res.status(200);
      res.send(`Successfully overwrote data of user ID ${id} from subscribed users.`);
    } else {
      res.status(400);
      throw new Error(`Failed to overwrite, because user ID ${id} is not found from subscribed users.`);
    }
  }
});

//REGISTERED USERS DELETE BY ID
api.delete("/registers/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = findById(id, database);
  if (found) {
    database = database.filter((data) => data.id !== id);
    fs.writeFileSync(__dirname + "/db/users.json", JSON.stringify(database));
    res.status(200);
    res.send(`Successfully deleted data of user ID ${id} from registered users.`);
  } else {
    res.status(400);
    throw new Error(`Failed to delete, because user ID ${id} is not found from registered users.`);
  }
});

module.exports = api;
