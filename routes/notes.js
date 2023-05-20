const notes = require("express").Router();
// const { json } = require('express');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtills");
const uuid = require("../helpers/uuid");

// GET Route for retrieving all the notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//DELETE route for apecific notes
notes.delete("/:note_id", (req, res) => {
  const noteID = req.params.note_id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id != noteID);
      // Save that array to the filesystem
      writeToFile("./db/db.json", result);
      // Respond to the DELETE request
      res.json(`Item ${noteID} has been deleted`);
    });
});

// POST Route for a new UX/UI tip
notes.post("/", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      tip_id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully!`);
  } else {
    res.error("Error in adding tip");
  }
});

module.exports = notes;
