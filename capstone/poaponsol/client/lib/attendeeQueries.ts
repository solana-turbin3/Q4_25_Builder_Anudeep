import { PublicKey } from "@solana/web3.js";
import { getAnchorClient } from "./anchorClient";
import * as anchor from "@coral-xyz/anchor";
import { Wallet } from "@solana/wallet-adapter-react";

export const fetchAttendees = async (eventPda: PublicKey, wallet: Wallet) => {
    const { program } = getAnchorClient(wallet as unknown as anchor.Wallet);

    const all = await program.account.claimRecord.all();

    return all
        .map((c) => ({ pubkey: c.publicKey, data: c.account }))
        .filter((c) => c.data.event.toBase58() === eventPda.toBase58())
        .map((c) => ({
            wallet: c.data.wallet.toBase58(),
            mint: c.data.mint.toBase58(),
            claimedAt: Number(c.data.claimedAt),
        }));
};