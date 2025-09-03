const crypto = require("crypto");

// Skapa ett nyckelpar (private + public key)
class Wallet {
    constructor() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
        });
        this.privateKey = privateKey.export({ type: "pkcs1", format: "pem" });
        this.publicKey = publicKey.export({ type: "pkcs1", format: "pem" });
    }

    signTransaction(transaction) {
        const sign = crypto.createSign("SHA256");
        sign.update(JSON.stringify(transaction));
        sign.end();
        const signature = sign.sign(this.privateKey, "hex");
        return signature;
    }

    static verifyTransaction(transaction, signature, publicKey) {
        const verify = crypto.createVerify("SHA256");
        verify.update(JSON.stringify(transaction));
        verify.end();
        return verify.verify(publicKey, signature, "hex");
    }
}

// Exempel: skapa två wallets och en transaktion
if (require.main === module) {
    const alice = new Wallet();
    const bob = new Wallet();

    const transaction = { from: alice.publicKey, to: bob.publicKey, amount: 10 };
    const signature = alice.signTransaction(transaction);

    console.log("Transaction:", transaction);
    console.log("Signature:", signature);
    console.log(
        "Valid signature?",
        Wallet.verifyTransaction(transaction, signature, alice.publicKey)
    );
}

module.exports = Wallet;
