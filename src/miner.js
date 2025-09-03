const { Blockchain, Block, logWithLine } = require("./blockchain");

// Skapa kedjan
let myCoin = new Blockchain();

// Lägg till block
const block1 = new Block(1, Date.now(), { from: "Alice", to: "Bob", amount: 5 });
myCoin.addBlock(block1);

const block2 = new Block(2, Date.now(), { from: "Bob", to: "Charlie", amount: 2 });
myCoin.addBlock(block2);

// Visa hela kedjan
logWithLine("\n📜 Hela blockchain:");
console.log(JSON.stringify(myCoin, null, 2));

// Kontrollera giltighet
logWithLine("\nValid chain?", myCoin.isChainValid());
