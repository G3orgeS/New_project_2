const crypto = require("crypto");

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        logWithLine("🧱 Skapar nytt block...");
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();

        logWithLine(`   ➡️ Index: ${this.index}`);
        logWithLine(`   ➡️ Data: ${JSON.stringify(this.data)}`);
        logWithLine(`   ➡️ Previous Hash: ${this.previousHash}`);
        logWithLine(`   ➡️ Init Hash: ${this.hash}`);
    }

    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
            .digest("hex");
    }

    mineBlock(difficulty) {
        logWithLine(`⛏️ Startar mining block #${this.index} med difficulty=${difficulty}...`);
        const target = "0".repeat(difficulty);
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        logWithLine(`Block #${this.index} färdigminat! Nonce=${this.nonce}, Hash=${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        logWithLine("Startar blockchain...");
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];
            if (current.hash !== current.calculateHash() || current.previousHash !== prev.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = { Blockchain, Block};










// Hjälpfunktion för loggar med radnummer
function logWithLine(...args) {
    const err = new Error();
    const stackLine = err.stack.split("\n")[2];
    const match = stackLine.match(/:(\d+):\d+\)?$/);
    let line = match ? match[1] : "???";
    console.log(`[rad ${line}]`, ...args);
}