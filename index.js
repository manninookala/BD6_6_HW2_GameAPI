const express = require("express");
const cors = require("cors");
const { fetchAllGames, fetchGameById } = require("./controllers/index");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/games", (req, res) => {
  let games = fetchAllGames();
  return res.status(200).json(games);
});

app.get("/games/details/:id", (req, res) => {
  let gameId = parseInt(req.params.id);
  let game = fetchGameById(gameId);
  return res.status(200).json(game);
});

module.exports = { app };
