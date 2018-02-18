var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser')

var battleGame = require('./momRulesExample.js');
var playerQueue = [];
var games = [];
var sessionToGameID = {};

var app = express();

app.use(cookieParser());
app.use(session({secret: "This is super duper secret homie!"}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'battle.html'));
});

app.post('/findGame',function(req, res){
  req.session.address = req.body.address;
  req.session.lossSig = req.body.lossSig; // TODO: Check signature matches address
  playerQueue.push(req.sessionID);
  const findGame = () => {
    console.log('finding game');
    if (req.sessionID in sessionToGameID) {
      res.end("yes");
      console.log('joined game id ' + sessionToGameID[req.sessionID]);
      return;
    }
    if (playerQueue.length < 2) {
      setTimeout(findGame, 500);
      return;
    }
    game = {
      moveStack: [],
      gameState: Object.assign({}, battleGame.exampleGameState),
      playerSessionId: [
        playerQueue.pop(), playerQueue.pop()
      ]
    };
    games.push(game);  // TODO: Lookup gamestate (memes) using blockchain
    sessionToGameID[game.playerSessionId[0]] = games.length - 1;
    sessionToGameID[game.playerSessionId[1]] = games.length - 1;
    console.log('created game' + (games.length - 1));
    res.end("yes");
  };
  findGame();
});

app.post('/move',function(req, res){
  const move = req.body.move;
  const game = games[sessionToGameID[req.sessionID]]
  if (game.playerSessionId[move.playerId] !== req.sessionID) {
    console.log('Player impersonation');
    res.end("That's not you");
    return
  }
  battleGame.applyMove(game.gameState, move);
  game.moveStack.push(move);
  res.end("yes");
});

app.get('/getMoves', function(req, res){
  if (!(req.sessionID in sessionToGameID)) {
    res.send(JSON.stringify({'reply': 'No game with this session!'}));
    return;
  }
  res.send(game.moveStack);
});

app.listen(3000);
