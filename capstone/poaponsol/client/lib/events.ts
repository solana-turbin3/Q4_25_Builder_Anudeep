import * as anchor from "@coral-xyz/anchor";
import { SystemProgram, Keypair } from "@solana/web3.js";
import { getAnchorClient } from "./anchorClient";
import { getCollectionAuthorityPda, getEventPda, getProfilePda } from "./pdas";
import { PublicKey } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

export const createEvent = async (wallet: anchor.Wallet, args: any) => {
    const { program } = getAnchorClient(wallet);
    const eventName = args.name;
    const eventIndex = await getProfileEventCount(wallet, {});
    const collection = Keypair.generate();

    const [eventPda] = getEventPda(wallet.publicKey, eventIndex as number, program.programId);
    const [profilePda] = getProfilePda(wallet.publicKey, program.programId);
    const [collectionAuthorityPda] = getCollectionAuthorityPda(
        collection.publicKey,
        program.programId
    );

    const txSig = await program.methods
        .createEvent(args)
        .accounts({
            organizer: wallet.publicKey,
            profile: profilePda,
            event: eventPda,
            collection: collection.publicKey,
            collectionAuthority: collectionAuthorityPda,
            coreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        } as any)
        .signers([collection])
        .rpc();

    console.log("✅ Event created:", eventName);
    console.log("Event PDA:", eventPda.toBase58());
    console.log("Collection Mint:", collection.publicKey.toBase58());
    console.log("Tx:", txSig);

    return { eventPda, collectionMint: collection.publicKey, txSig };
};

export const closeEvent = async (wallet: anchor.Wallet, eventPda: PublicKey) => {
    const { program } = getAnchorClient(wallet);

    const txSig = await program.methods
        .closeEvent()
        .accounts({
            organizer: wallet.publicKey,
            event: eventPda,
        })
        .rpc();

    console.log("✅ Event closed:", eventPda.toBase58());
    console.log("Tx:", txSig);
};

export const getProfileEventCount = async (wallet: anchor.Wallet, args: any) => {
    const { program } = getAnchorClient(wallet);
    const [profilePda] = getProfilePda(wallet.publicKey, program.programId);

    let profile;
    try {
        profile = await program.account.organizerProfile.fetch(profilePda);
    } catch {
        profile = { eventCount: 0 };
    }

    const eventIndex = profile.eventCount;
    return eventIndex;
}