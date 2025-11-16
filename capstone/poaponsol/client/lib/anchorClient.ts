import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "@/idl/poaponsol.json";
import { Poaponsol } from "@/types/poaponsol";

// const PROGRAM_ID = new PublicKey(idl.address);

export const getAnchorClient = (wallet: anchor.Wallet) => {
    const connection = new Connection(anchor.web3.clusterApiUrl("devnet"), "confirmed");
    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });
    const program = new anchor.Program(idl as anchor.Idl, provider) as anchor.Program<Poaponsol>;

    return { program, provider, connection };
};
