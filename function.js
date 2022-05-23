const fs = require("fs");
const { body, validationResult, check } = require("express-validator");

const cekDuplikat = (email, database) => {
  return database.find((data) => data.email === email);
};

const findById = (id, database) => {
  return database.find((data) => data.id === id);
};

const rewriteEmails = (email, database) => {
  const id = database[database.length - 1].id + 1;
  const input = {
    id,
    email,
  };
  database.push(input);
  const emailsInput = JSON.stringify(database);
  try {
    fs.writeFileSync(__dirname + "/db/emails.json", emailsInput);
  } catch (err) {
    console.error(err);
  }
};

const rewriteDatabase = (data, database) => {
  if ("agreement" in data) {
    const id = database[database.length - 1].id + 1;
    const input = {
      id,
      name: data.name,
      email: data.email,
      password: data.password,
    };
    database.push(input);
    const userInput = JSON.stringify(database);
    try {
      fs.writeFileSync(__dirname + "/db/users.json", userInput);
    } catch (err) {
      console.error(err);
    }
  } else {
    throw new Error("Agreement is not accepted yet.");
  }
};

module.exports = { cekDuplikat, rewriteEmails, rewriteDatabase, findById };
