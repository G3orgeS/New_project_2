const crypto = require("crypto");

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        logWithLine("🧱 Skapar nytt block...");
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;

        logWithLine(`Index: ${this.index}`);
        logWithLine(`Data: ${JSON.stringify(this.data)}`);
        logWithLine(`Previous Hash: ${this.previousHash}`);
        logWithLine(`Init Hash (kryptering) (utan mining): ${this.hash}`);
    }

    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash +
                this.nonce
            )
            .digest("hex");
    }

    mineBlock(difficulty) {
        logWithLine(
            `⛏️ Startar mining på block #${this.index} med difficulty=${difficulty}...`
        );
        const target = "0".repeat(difficulty);

        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();

            if (this.nonce % 1000 === 0) {
                logWithLine(
                    `   ⏳ Försöker... nonce=${this.nonce}, hash=${this.hash}`
                );
            }
        }

        logWithLine(
            `✅ Block #${this.index} färdigminat! Nonce=${this.nonce}, Hash=${this.hash}`
        );
    }
}

class Blockchain {
    constructor() {
        logWithLine("Startar blockchain...");
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }

    createGenesisBlock() {
        logWithLine("Skapar Genesis Block (första blocket)...");
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        logWithLine(`Försöker lägga till block #${newBlock.index}...`);
        newBlock.previousHash = this.getLatestBlock().hash;
        logWithLine(`Kopplar till föregående hash: ${newBlock.previousHash}`);

        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
        logWithLine(
            `Block #${newBlock.index} tillagt i kedjan! Chain length=${this.chain.length}`
        );
    }

    isChainValid() {
        logWithLine("Kontrollerar om kedjan är giltig...");

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            logWithLine(`   🔎 Kollar block #${currentBlock.index}...`);

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                logWithLine("Hash mismatch!");
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                logWithLine("Föregående hash mismatch!");
                return false;
            }
        }
        logWithLine("Kedjan är giltig!");
        return true;
    }
}

// 🔹 Test
let myCoin = new Blockchain();

logWithLine("\n--- Mining block 1 ---");
myCoin.addBlock(new Block(1, Date.now(), { amount: 4 }));

logWithLine("\n--- Mining block 2 ---");
myCoin.addBlock(new Block(2, Date.now(), { amount: 10 }));

logWithLine("\n Hela blockchain:");
console.log(JSON.stringify(myCoin, null, 2));

logWithLine("\nValid chain?", myCoin.isChainValid());










// console log rad där det händer grejer.
function logWithLine(...args) {

    const err = new Error();
    const stackLine = err.stack.split("\n")[2];
    const match = stackLine.match(/:(\d+):\d+\)?$/);
    
    let line;

        if (match) {
            line = match[1];
        } else {
            line = "???";      
        }

    console.log(`[rad ${line}]`, ...args);
}