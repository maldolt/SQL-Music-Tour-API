const bands = require("express").Router();
const db = require("../models");
const { Band } = db;
const { Op } = require("sequelize");

bands.get("/", async (req, res) => {
  try {
    const foundBands = await Band.findAll({
      order: [["available_start_time", "ASC"]],
      where: {
        name: { [Op.like]: `%${req.query.name ? req.query.name : ""}%` },
      },
    });
    res.status(200).json(foundBands);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting bands");
  }
});

bands.get("/:name", async (req, res) => {
  try {
    const foundBand = await Band.findOne({
      where: {name: req.params.id},
      include: {model: meetgreet, as: 'meet_greets'}
    });
    
    res.status(200).json(foundBand);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error finding one band");
  }
});

bands.post("/", async (req, res) => {
  try {
    const newBand = await Band.create(req.body);
    res.status(200).json({ message: "Created a new band!", data: newBand });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding one band");
  }
});

bands.put("/:id", async (req, res) => {
  try {
    const updatedBands = await Band.update(req.body, {
      where: {
        band_id: req.params.id,
      },
    });
    res.status(200).json({ message: `updated ${updatedBands} bands` });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating bands");
  }
});

bands.delete("/:id", async (req, res) => {
  try {
    const foundBand = await Band.destroy({
      where: {
        band_id: req.params.id,
      },
    });
    res
      .status(200)
      .json({ message: `Successfully deleted band id ${req.params.id}` });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting one band");
  }
});

module.exports = bands;
