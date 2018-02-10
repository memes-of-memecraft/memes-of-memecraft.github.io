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
let player = [
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

let movesStack = [
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

function getDamage(meme, moveId) {
  let memeRules = getMemeRules(meme.id);
  if (memeRules.moves.indexOf(moveId) == -1) {
    console.error('Move not allowed!');
    return 0;
  }
  let attackStat = getMemeStats(meme.id).attack
  return attackStat + memeMoves[moveId].damage
}

function logPlayers() {
  console.log('Player 1 Meme: ' + getMemeRules(player[0].memes[player[0].currentMemeId].id).name + ' - Health: ' + player[0].memes[player[0].currentMemeId].health);
  console.log('Player 2 Meme: ' + getMemeRules(player[1].memes[player[1].currentMemeId].id).name + ' - Health: ' + player[1].memes[player[1].currentMemeId].health);
}

// Play moves
for (let moveCounter = 0; moveCounter < movesStack.length; moveCounter++) { 
  let currentMove = movesStack[moveCounter]
  let currentPlayer = player[currentMove.playerId]
  let otherPlayer = player[1 - currentMove.playerId]
  console.log('\n~~~~~~ Player ' + (currentMove.playerId+1) + ' Move ' + (moveCounter+1) + ' ~~~~~');
  if (currentMove.type === 'attack') {
    let memeId = currentPlayer.currentMemeId;
    let damage = getDamage(currentPlayer.memes[memeId], currentMove.id);
    console.log('Attack! Move: ' + memeMoves[currentMove.id].name + ' - Damage: ' + damage);
    otherPlayer.memes[otherPlayer.currentMemeId].health -= damage;
    // Log
    logPlayers();
  }
  else if (currentMove.type === 'switch') {
    memeRulesForSwitchedMeme = getMemeRules(currentPlayer.memes[currentMove.id].id);
    console.log('Switch to ' + memeRulesForSwitchedMeme.name);
    player[currentMove.playerId].currentMemeId = currentMove.id;
    logPlayers();
  }
  else if (currentMove.type === 'death switch') {
    memeRulesForSwitchedMeme = getMemeRules(currentPlayer.memes[currentMove.id].id);
    console.log('Death switch to ' + memeRulesForSwitchedMeme.name);
    player[currentMove.playerId].currentMemeId = currentMove.id;
    logPlayers();
  }
}
