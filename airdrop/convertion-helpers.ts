import bs58 from "bs58";
import promptSync from "prompt-sync";
import wallet from "./dev-wallet.json"

const prompt = promptSync();

// base58 → wallet
function base58ToWallet() {
    const base58 = prompt("Enter base58 string: ");
    try {
        const wallet = bs58.decode(base58);
        console.log("Wallet bytes:", wallet);
    } catch (err) {
        console.error("Invalid base58 input:", err);
    }
}

// wallet → base58
async function walletToBase58() {

    const base58 = bs58.encode(Uint8Array.from(wallet));
    console.log("Base58 string:", base58);
}

function main() {
    console.log("Choose an option:");
    console.log("1. Base58 → Wallet");
    console.log("2. Wallet → Base58");

    const choice = prompt("Enter choice (1/2): ");

    if (choice === "1") {
        base58ToWallet();
    } else if (choice === "2") {
        walletToBase58();
    } else {
        console.log("Invalid choice.");
    }
}

main();