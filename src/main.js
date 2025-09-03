const Wallet = require("./wallet");
const { Blockchain, Block} = require("./blockchain");

// Skapa några wallets
const alice = new Wallet();
const bob = new Wallet();
const charlie = new Wallet();

// Skapa blockchain
const myCoin = new Blockchain();

// Skapa och signera transaktioner
const tx1 = { from: alice.publicKey, to: bob.publicKey, amount: 50 };
const sig1 = alice.signTransaction(tx1);

const tx2 = { from: bob.publicKey, to: charlie.publicKey, amount: 30 };
const sig2 = bob.signTransaction(tx2);

// Lägg till block med transaktioner om signaturen är giltig
if (Wallet.verifyTransaction(tx1, sig1, alice.publicKey)) {
    const block1 = new Block(1, Date.now(), { transaction: tx1, signature: sig1 });
    myCoin.addBlock(block1);
}

if (Wallet.verifyTransaction(tx2, sig2, bob.publicKey)) {
    const block2 = new Block(2, Date.now(), { transaction: tx2, signature: sig2 });
    myCoin.addBlock(block2);
}

// Visa hela kedjan
logWithLine("\n📜 Hela blockchain:");
console.log(JSON.stringify(myCoin, null, 2));

// Kontrollera giltighet
logWithLine("\nValid chain?", myCoin.isChainValid());







// Hjälpfunktion för loggar med radnummer
function logWithLine(...args) {
    const err = new Error();
    const stackLine = err.stack.split("\n")[2];
    const match = stackLine.match(/:(\d+):\d+\)?$/);
    let line = match ? match[1] : "???";
    console.log(`[rad ${line}]`, ...args);
}