import { Keypair, Connection, Commitment, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeMintInstruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import wallet from "../../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        // const mint = 
        const latestBlockhash = await connection.getLatestBlockhash();

        // Generate keypair to use as address of mint
        const mint = Keypair.generate();

        const createAccountInstruction = SystemProgram.createAccount({
            fromPubkey: keypair.publicKey,
            newAccountPubkey: mint.publicKey,
            space: MINT_SIZE,
            lamports: await getMinimumBalanceForRentExemptMint(connection),
            programId: TOKEN_PROGRAM_ID
        });

        const initializeMintInstruction = createInitializeMintInstruction(
            mint.publicKey,
            6, // Decimals
            keypair.publicKey, // Mint authority
            keypair.publicKey, // Freeze authority
            TOKEN_PROGRAM_ID
        );

        const transaction = new Transaction().add(
            createAccountInstruction,
            initializeMintInstruction
        );

        const transactionSignature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [keypair, mint] // Signers
        );

        console.log("Mint id:", mint.publicKey.toBase58());
        console.log("\nTransaction Signature:", transactionSignature);

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
