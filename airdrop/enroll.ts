import {
    address,
    appendTransactionMessageInstructions,
    assertIsTransactionWithinSizeLimit,
    createKeyPairSignerFromBytes,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    createTransactionMessage,
    devnet,
    getSignatureFromTransaction,
    pipe,
    sendAndConfirmTransactionFactory,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signTransactionMessageWithSigners,
    addSignersToTransactionMessage,
    getProgramDerivedAddress,
    generateKeyPairSigner,
    getAddressEncoder
} from "@solana/kit";
import { getInitializeInstruction, getSubmitTsInstruction } from "./clients/js/src/generated/index";
import wallet from "./Turbin3-wallet.json";

const MPL_CORE_PROGRAM = address("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const PROGRAM_ADDRESS = address("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const SYSTEM_PROGRAM = address("11111111111111111111111111111111");
const COLLECTION = address("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

async function main() {
    const addressEncoder = getAddressEncoder();
    const keypair = await createKeyPairSignerFromBytes(new Uint8Array(wallet));

    const accountSeeds = [Buffer.from("prereqs"), addressEncoder.encode(keypair.address)];
    const [account, _bump] = await getProgramDerivedAddress({
        programAddress: PROGRAM_ADDRESS,
        seeds: accountSeeds
    });

    const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
    const rpcSubscriptions = createSolanaRpcSubscriptions(devnet('wss://api.devnet.solana.com'));

    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

    const mintKeyPair = await generateKeyPairSigner();

    async function initialize() {
        const initializeIx = getInitializeInstruction({
            github: "0x4nud33p",
            user: keypair,
            account,
            systemProgram: SYSTEM_PROGRAM
        });

        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

        const transactionMessageInit = pipe(
            createTransactionMessage({ version: 0 }),
            tx => setTransactionMessageFeePayerSigner(keypair, tx),
            tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            tx => appendTransactionMessageInstructions([initializeIx], tx)
        );

        const signedTxInit = await signTransactionMessageWithSigners(transactionMessageInit);
        assertIsTransactionWithinSizeLimit(signedTxInit);

        try {
            const result = await sendAndConfirmTransaction(signedTxInit, { commitment: 'confirmed', skipPreflight: false });
            console.log(result);
            const signatureInit = getSignatureFromTransaction(signedTxInit);
            console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signatureInit}?cluster=devnet`);
        } catch (e) {
            console.error(`Oops, something went wrong (initialize): ${e}`);
            throw e;
        }
    }

    async function submit() {
        const authoritySeeds = [Buffer.from("collection"), addressEncoder.encode(COLLECTION)];
        const [authority, _bumpAuth] = await getProgramDerivedAddress({
            programAddress: PROGRAM_ADDRESS,
            seeds: authoritySeeds,
        });

        const submitIx = getSubmitTsInstruction({
            user: keypair,
            account,
            mint: mintKeyPair,
            collection: COLLECTION,
            authority,
            mplCoreProgram: MPL_CORE_PROGRAM,
            systemProgram: SYSTEM_PROGRAM,
        }, { programAddress: PROGRAM_ADDRESS });

        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

        const transactionMessageSubmit = pipe(
            createTransactionMessage({ version: 0 }),
            tx => setTransactionMessageFeePayerSigner(keypair, tx),
            tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            tx => appendTransactionMessageInstructions([submitIx], tx),
            tx => addSignersToTransactionMessage([mintKeyPair], tx)
        );

        const signedTxSubmit = await signTransactionMessageWithSigners(transactionMessageSubmit);
        assertIsTransactionWithinSizeLimit(signedTxSubmit);

        try {
            await sendAndConfirmTransaction(signedTxSubmit, { commitment: 'confirmed', skipPreflight: false });
            const signatureSubmit = getSignatureFromTransaction(signedTxSubmit);
            console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signatureSubmit}?cluster=devnet`);
        } catch (e) {
            console.error(`Oops, something went wrong (submit): ${e}`);
            throw e;
        }
    }

    // await initialize();
    await submit();
}

main();
