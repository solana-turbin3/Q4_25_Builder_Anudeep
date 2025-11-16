import { getAnchorClient } from "./anchorClient";
import * as anchor from "@coral-xyz/anchor";
import { type PublicKey } from '@solana/web3.js';
import { Wallet } from "@solana/wallet-adapter-react";

export const fetchUserBadges = async (wallet: Wallet, pubkey: PublicKey) => {
    const { program } = getAnchorClient(wallet as unknown as anchor.Wallet);

    const all = await program.account.claimRecord.all();

    return all
        .map((c) => ({ pubkey: c.publicKey, data: c.account }))
        .filter((c) => c.data.wallet.toBase58() === pubkey?.toBase58())
        .map((c) => ({
            wallet: c.data.wallet.toBase58(),
            mint: c.data.mint.toBase58(),
            claimedAt: Number(c.data.claimedAt),
            name: c.data.eventName || "POAP Badge",
        }));
};

export const fetchBadgeDetails = async (wallet: Wallet, mint: PublicKey) => {
    const { program } = getAnchorClient(wallet as unknown as anchor.Wallet);

    const records = await program.account.claimRecord.all();

    const record = records.find(
        (r) => r.account.mint.toBase58() === mint.toBase58()
    );

    if (!record) return null;

    return {
        badgeMint: record.account.mint.toBase58(),
        wallet: record.account.wallet.toBase58(),
        eventPda: record.account.event.toBase58(),
        eventName: record.account.eventName,
        eventUri: record.account.eventUri,
        collectionMint: record.account.collectionMint.toBase58(),
        claimedAt: Number(record.account.claimedAt),
    };
};