import * as anchor from "@coral-xyz/anchor";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { getAnchorClient } from "./anchorClient";
import { getCollectionAuthorityPda, getClaimRecordPda } from "./pdas";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

export const mintBadge = async (wallet: anchor.Wallet, eventPda: PublicKey, collectionMint: PublicKey) => {
    const { program } = getAnchorClient(wallet);
    const badgeMint = Keypair.generate();
    const [collectionAuthorityPda] = getCollectionAuthorityPda(collectionMint, program.programId);
    const [claimRecordPda] = getClaimRecordPda(wallet.publicKey, eventPda, program.programId);

    const txSig = await program.methods
        .mintBadge()
        .accounts({
            claimer: wallet.publicKey,
            badgeMint: badgeMint.publicKey,
            event: eventPda,
            claimRecord: claimRecordPda,
            collection: collectionMint,
            collectionAuthority: collectionAuthorityPda,
            coreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        }as any)
        .signers([badgeMint])
        .rpc();

    console.log("✅ Badge minted for:", wallet.publicKey.toBase58());
    console.log("Badge Mint:", badgeMint.publicKey.toBase58());
    console.log("Tx:", txSig);

    return badgeMint.publicKey;
};
