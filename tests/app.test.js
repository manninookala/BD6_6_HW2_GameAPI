const request = require("supertest");
const http = require("http");
const { app } = require("../index");
const { fetchAllGames, fetchGameById } = require("../controllers/index");

jest.mock("../controllers/index.js", () => ({
  ...jest.requireActual("../controllers/index.js"),
  fetchAllGames: jest.fn(),
  fetchGameById: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("Controller function test-cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Retreive all the games", () => {
    let mockGames = [
      {
        gameId: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "Adventure",
        platform: "Nintendo Switch",
      },
      {
        gameId: 2,
        title: "Red Dead Redemption 2",
        genre: "Action",
        platform: "PlayStation 4",
      },
      {
        gameId: 3,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        platform: "PC",
      },
    ];
    fetchAllGames.mockReturnValue(mockGames);

    let result = fetchAllGames();
    expect(result).toEqual(mockGames);
  });

  it("fetch a game by Id", () => {
    let mockGame = {
      gameId: 2,
      title: "Red Dead Redemption 2",
      genre: "Action",
      platform: "PlayStation 4",
    };
    fetchGameById.mockReturnValue(mockGame);
    let result = fetchGameById(2);
    expect(result).toEqual(mockGame);
  });
});

describe("API Endpoints test-cases", () => {
  it("GET /games fetch all games", async () => {
    let result = await request(server).get("/games");
    expect(result.status).toBe(200);
    expect({ games: result.body }).toEqual({
      games: [
        {
          gameId: 1,
          title: "The Legend of Zelda: Breath of the Wild",
          genre: "Adventure",
          platform: "Nintendo Switch",
        },
        {
          gameId: 2,
          title: "Red Dead Redemption 2",
          genre: "Action",
          platform: "PlayStation 4",
        },
        {
          gameId: 3,
          title: "The Witcher 3: Wild Hunt",
          genre: "RPG",
          platform: "PC",
        },
      ],
    });
    expect(result.body.length).toBe(3);
  });

  it("GET /games/details/:id fetch a game by Id", async () => {
    let result = await request(server).get("/games/details/2");
    expect(result.status).toBe(200);
    expect({ game: result.body }).toEqual({
      game: {
        gameId: 2,
        title: "Red Dead Redemption 2",
        genre: "Action",
        platform: "PlayStation 4",
      },
    });
  });
});
