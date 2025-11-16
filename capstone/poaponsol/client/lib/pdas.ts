import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export const getEventPda = (
    organizer: PublicKey,
    eventIndex: number,
    programId: PublicKey
) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("event"),                       
            organizer.toBuffer(),                     
            Buffer.from(new anchor.BN(eventIndex).toArrayLike(Buffer, "le", 8)), 
        ],
        programId
    );
};

export const getProfilePda = (organizer: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), organizer.toBuffer()],
        programId
    );
}

export const getCollectionAuthorityPda = (collection: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("collection_authority"), collection.toBuffer()],
        programId
    );
};

export const getClaimRecordPda = (
    claimer: PublicKey,
    event: PublicKey,
    programId: PublicKey
) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("claim"),
            event.toBuffer(),
            claimer.toBuffer(),
        ],
        programId
    );
};