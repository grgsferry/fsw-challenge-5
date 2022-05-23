const express = require("express");

let emails = require("./db/emails.json");
let database = require("./db/users.json");

const { cekDuplikat, rewriteEmails, rewriteDatabase } = require("./function.js");
const { body, validationResult, check } = require("express-validator");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.post(
  "/",
  [
    check("email", "Email is not valid.").isEmail(),

    body("email").custom((value) => {
      const duplikat = cekDuplikat(value, emails);
      if (duplikat) {
        throw new Error("Email has already subscribed.");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.status(400);
      res.render("home", { alert });
    } else {
      rewriteEmails(req.body.email, emails);
      const alert = [
        {
          msg: "Successfuly subscribed",
          param: "email",
          location: "body",
        },
      ];
      res.status(200);
      res.render("home", { alert });
    }
  }
);

router.get("/work", (req, res) => {
  res.render("undercons");
});

router.get("/contact", (req, res) => {
  res.render("undercons");
});

router.get("/about", (req, res) => {
  res.render("undercons");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signup/tos", (req, res) => {
  res.render("tos");
});

router.post(
  "/signup",
  [
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
    body("repeatPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match.");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.status(400);
      res.render("signup", { alert });
    } else {
      rewriteDatabase(req.body, database);
      const alert = [
        {
          msg: "Successfuly registered, now you can Login!",
          param: "email",
          location: "body",
        },
      ];
      res.status(200);
      res.render("signup", { alert });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  [
    body("email", "Email is not valid.").isEmail(),
    body("email").custom((value) => {
      const duplikat = cekDuplikat(value, database);
      if (!duplikat) {
        throw new Error("Invalid credentials.");
      }
      return true;
    }),
  ],
  body("password").custom((value, { req }) => {
    const foundData = database.find((data) => data.email === req.body.email);
    if (value !== foundData.password) {
      throw new Error("Invalid credentials.");
    }
    return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      const alert = errors.array();
      res.render("login", {
        alert,
      });
    } else {
      const alert = [
        {
          msg: `Login success! Welcome ${req.body.email}.`,
          param: "email",
          location: "body",
        },
      ];
      res.status(200);
      res.render("home", { alert });
    }
  }
);

router.get("/game", (req, res) => {
  res.render("game");
});

module.exports = router;
