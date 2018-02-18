let memeMoves = [
  {
    name: 'Fireball',
    gif: 'http://',
    damage: 6,
    effect: 'None'
  },
  {
    name: 'Icewave',
    gif: 'http://',
    damage: 7,
    effect: 'None'
  },
  {
    name: 'Beamer',
    gif: 'http://',
    damage: 8,
    effect: 'None'
  },
  {
    name: 'Slap',
    gif: 'http://',
    damage: 9,
    effect: 'None'
  }
];

let memeRules = [
  {
    idRange: 0,
    name: 'egod the plur',
    baseHealth: 80,
    baseAttack: 70,
    baseSpeed: 80,
    offsetHealth: 10,
    offsetAttack: 10,
    offsetSpeed: 10,
    moves: [0, 1, 2]
  },
  {
    idRange: 1,
    name: 'Leeroy Dankens',
    baseHealth: 50,
    baseAttack: 80,
    baseSpeed: 100,
    offsetHealth: 10,
    offsetAttack: 10,
    offsetSpeed: 10,
    moves: [0, 1, 2]
  },
  {
    idRange: 2,
    name: 'Crypto Keeper',
    baseHealth: 80,
    baseAttack: 70,
    baseSpeed: 80,
    offsetHealth: 10,
    offsetAttack: 10,
    offsetSpeed: 10,
    moves: [0, 1, 2]
  },
  {
    idRange: 3,
    name: 'Charlie Lite',
    baseHealth: 80,
    baseAttack: 70,
    baseSpeed: 80,
    offsetHealth: 10,
    offsetAttack: 10,
    offsetSpeed: 10,
    moves: [0, 1, 2]
  },
  {
    idRange: 99,
    name: 'Crypto Shitty',
    baseHealth: 10,
    baseAttack: 20,
    baseSpeed: 10,
    offsetHealth: 80,
    offsetAttack: 40,
    offsetSpeed: 80,
    moves: [0]
  }
];

let playerOwnedMemes = [0, 2, 35, 38, 41, 41];

function getMemeRules(id) {
  // TODO: Implement binary search
  for (let i = 0; i < memeRules.length; i++) { 
    if (id <= memeRules[i].idRange) {
      return memeRules[i];
    }
  }
}

function getStatScore(id, base, offset) {
  return Math.min(base + (Math.sin(id+1)+1)*0.5 * offset, 100); // cap at 100
}

function getMemeStats(id) {
  meme = getMemeRules(id);
  return {
    name: meme.name,
    health: getStatScore(id, meme.baseHealth, meme.offsetHealth),
    attack: getStatScore(id, meme.baseAttack, meme.offsetAttack),
    speed: getStatScore(id, meme.baseSpeed, meme.offsetSpeed)
  };
}

console.log('Player Memes:');
for (let i = 0; i < playerOwnedMemes.length; i++) { 
  console.log('Meme ' + i);
  console.log(getMemeStats(playerOwnedMemes[i]));
}

// Battle logic
let exampleGameState = [
  {
    currentMemeId: 0,
    memes: [
      {
        health: 100,
        activeStatus: 'none',
        id: 0
      },
      {
        health: 100,
        activeStatus: 'none',
        id: 3
      },
      {
        health: 100,
        activeStatus: 'none',
        id: 2
      }
    ]
  },
  {
    currentMemeId: 0,
    memes: [
      {
        health: 100,
        activeStatus: 'none',
        id: 1
      },
      {
        health: 100,
        activeStatus: 'none',
        id: 2
      },
      {
        health: 100,
        activeStatus: 'none',
        id: 50
      }
    ]
  }
];

exports.exampleGameState = exampleGameState

let exampleMoveStack = [
  {
    playerId: 0,
    type: 'switch',
    id: 0
  },
  {
    playerId: 1,
    type: 'switch',
    id: 1
  },
  {
    playerId: 0,
    type: 'attack',
    id: 0
  },
  {
    playerId: 1,
    type: 'switch',
    id: 0
  },
  {
    playerId: 0,
    type: 'attack',
    id: 1
  },
  {
    playerId: 1,
    type: 'attack',
    id: 0
  },
  {
    playerId: 0,
    type: 'attack',
    id: 1
  },
  {
    playerId: 1,
    type: 'death switch',
    id: 2
  },
  {
    playerId: 1,
    type: 'attack',
    id: 0
  }
];

exports.exampleMoveStack = exampleMoveStack;

function getDamage(meme, moveId) {
  let memeRules = getMemeRules(meme.id);
  if (memeRules.moves.indexOf(moveId) == -1) {
    console.error('Move not allowed!');
    return 0;
  }
  let attackStat = getMemeStats(meme.id).attack
  return attackStat + memeMoves[moveId].damage
}

function logPlayers(gameState) {
  console.log('Player 1 Meme: ' + getMemeRules(gameState[0].memes[gameState[0].currentMemeId].id).name + ' - Health: ' + gameState[0].memes[gameState[0].currentMemeId].health);
  console.log('Player 2 Meme: ' + getMemeRules(gameState[1].memes[gameState[1].currentMemeId].id).name + ' - Health: ' + gameState[1].memes[gameState[1].currentMemeId].health);
}

exports.applyMove = (gameState, move) => {
  // TODO: Add move validation!
  let currentPlayer = gameState[move.playerId]
  let otherPlayer = gameState[1 - move.playerId]
  if (move.type === 'attack') {
    let memeId = currentPlayer.currentMemeId;
    let damage = getDamage(currentPlayer.memes[memeId], move.id);
    console.log('Attack! Move: ' + memeMoves[move.id].name + ' - Damage: ' + damage);
    otherPlayer.memes[otherPlayer.currentMemeId].health -= damage;
    // Log
    logPlayers(gameState);
  }
  else if (move.type === 'switch') {
    memeRulesForSwitchedMeme = getMemeRules(currentPlayer.memes[move.id].id);
    console.log('Switch to ' + memeRulesForSwitchedMeme.name);
    gameState[move.playerId].currentMemeId = move.id;
    logPlayers(gameState);
  }
  else if (move.type === 'death switch') {
    memeRulesForSwitchedMeme = getMemeRules(currentPlayer.memes[move.id].id);
    console.log('Death switch to ' + memeRulesForSwitchedMeme.name);
    gameState[move.playerId].currentMemeId = move.id;
    logPlayers(gameState);
  }
  return gameState;
}

// // Play example moves
// for (let moveCounter = 0; moveCounter < exampleMoveStack.length; moveCounter++) { 
//   move = exampleMoveStack[moveCounter];
//   console.log('\n~~~~~~ Player ' + (move.playerId+1) + ' Move ' + (moveCounter+1) + ' ~~~~~');
//   exports.applyMove(exampleGameState, move);
// }
