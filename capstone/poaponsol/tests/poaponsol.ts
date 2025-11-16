import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Poaponsol } from "../target/types/poaponsol";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  MPL_CORE_PROGRAM_ID,
  fetchAsset,
  AssetV1 as Asset,
} from "@metaplex-foundation/mpl-core";
import assert from "assert";

describe("POAPonSOL — Anchor Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Poaponsol as Program<Poaponsol>;
  const connection = provider.connection;

  const organizer = provider.wallet as anchor.Wallet;
  const attendee1 = Keypair.generate();
  const attendee2 = Keypair.generate();
  const maliciousActor = Keypair.generate();

  const collectionMint = Keypair.generate();
  const badgeMint1 = Keypair.generate();
  const badgeMint2 = Keypair.generate();

  const eventName = "Solana Breakpoint 2025";
  const eventUri = "https://arweave.net/event.json";
  const now = Math.floor(Date.now() / 1000);
  const startTime = new anchor.BN(now);
  const endTime = new anchor.BN(now + 86400); // 1 day

  let profilePda: PublicKey;
  let eventPda: PublicKey;
  let collectionAuthorityPda: PublicKey;
  let claimRecordPda1: PublicKey;
  let claimRecordPda2: PublicKey;

  const airdrop = async (pubkey: PublicKey, amount: number = 2) => {
    try {
      const airdropTx = await connection.requestAirdrop(
        pubkey,
        amount * LAMPORTS_PER_SOL
      );
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature: airdropTx,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
    } catch (err) {
      console.error(`Failed to airdrop to ${pubkey.toBase58()}:`, err);
    }
  };

  const fetchCoreAsset = async (mint: PublicKey): Promise<Asset | null> => {
    try {
      const asset = await fetchAsset(connection, mint);
      return asset;
    } catch (e) {
      console.error("Failed to fetch Core asset:", e);
      return null;
    }
  };

  const getProfilePda = (organizerKey: PublicKey): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), organizerKey.toBuffer()],
      program.programId
    );
    return pda;
  };

  const getEventPda = (
    organizerKey: PublicKey,
    name: string
  ): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), organizerKey.toBuffer(), Buffer.from(name)],
      program.programId
    );
    return pda;
  };

  const getCollectionAuthorityPda = (collectionKey: PublicKey): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_authority"), collectionKey.toBuffer()],
      program.programId
    );
    return pda;
  };

  const getClaimRecordPda = (
    eventKey: PublicKey,
    claimerKey: PublicKey
  ): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("claim"), eventKey.toBuffer(), claimerKey.toBuffer()],
      program.programId
    );
    return pda;
  };


  before(async () => {
    console.log("Starting POAPonSOL test suite...");
    console.log("Airdropping to test wallets...");
    await Promise.all([
      airdrop(attendee1.publicKey),
      airdrop(attendee2.publicKey),
      airdrop(maliciousActor.publicKey),
    ]);
    console.log("Airdrops complete.");

    profilePda = getProfilePda(organizer.publicKey);
    eventPda = getEventPda(organizer.publicKey, eventName);
    collectionAuthorityPda = getCollectionAuthorityPda(collectionMint.publicKey);
    claimRecordPda1 = getClaimRecordPda(eventPda, attendee1.publicKey);
    claimRecordPda2 = getClaimRecordPda(eventPda, attendee2.publicKey);
  });

  describe("create_event", () => {
    it("Successfully creates an event, profile, and collection", async () => {
      let initialEventCount = new anchor.BN(0);
      try {
        const profile = await program.account.organizerProfile.fetch(profilePda);
        initialEventCount = profile.eventCount;
      } catch (e) {
        console.log("Profile not found, initializing.");
      }

      const tx = await program.methods
        .createEvent({
          name: eventName,
          uri: eventUri,
          startTimestamp: startTime,
          endTimestamp: endTime,
          maxClaims: 100,
        })
        .accounts({
          organizer: organizer.publicKey,
          profile: profilePda,
          event: eventPda,
          collection: collectionMint.publicKey,
          collectionAuthority: collectionAuthorityPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([collectionMint])
        .rpc();

      console.log("Create Event Tx:", tx);

      const eventAccount = await program.account.event.fetch(eventPda);
      assert.equal(eventAccount.name, eventName);
      assert.equal(
        eventAccount.organizer.toBase58(),
        organizer.publicKey.toBase58()
      );
      assert.equal(
        eventAccount.collectionMint.toBase58(),
        collectionMint.publicKey.toBase58()
      );
      assert.ok(eventAccount.isActive, "Event should be active");
      assert.ok(
        eventAccount.endTimestamp.eq(endTime),
        "Event end time mismatch"
      );

      const profileAccount = await program.account.organizerProfile.fetch(
        profilePda
      );
      assert.equal(
        profileAccount.organizer.toBase58(),
        organizer.publicKey.toBase58()
      );
      assert.ok(
        profileAccount.eventCount.eq(initialEventCount.add(new anchor.BN(1))),
        "Event count did not increment"
      );

      const caAccount = await program.account.collectionAuthority.fetch(
        collectionAuthorityPda
      );
      assert.equal(
        caAccount.collection.toBase58(),
        collectionMint.publicKey.toBase58()
      );
      assert.equal(caAccount.nftName, eventName);
      assert.equal(
        caAccount.creator.toBase58(),
        organizer.publicKey.toBase58()
      );

      const coreCollection = await fetchCoreAsset(collectionMint.publicKey);
      assert.ok(coreCollection, "Metaplex Core Collection was not created");
      assert.equal(coreCollection.name, eventName);
      assert.equal(
        coreCollection.updateAuthority.address.toBase58(),
        collectionAuthorityPda.toBase58(),
        "Collection update authority is not the PDA"
      );
    });
  });

  describe("mint_badge (Happy Path)", () => {
    it("Allows an attendee to mint a badge", async () => {
      const tx = await program.methods
        .mintBadge()
        .accounts({
          claimer: attendee1.publicKey,
          badgeMint: badgeMint1.publicKey,
          event: eventPda,
          collection: collectionMint.publicKey,
          collectionAuthority: collectionAuthorityPda,
          claimRecord: claimRecordPda1,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([attendee1, badgeMint1])
        .rpc();

      console.log("Mint Badge Tx:", tx);

      const claimRecord = await program.account.claimRecord.fetch(
        claimRecordPda1
      );
      assert.equal(
        claimRecord.wallet.toBase58(),
        attendee1.publicKey.toBase58()
      );
      assert.equal(claimRecord.event.toBase58(), eventPda.toBase58());
      assert.equal(claimRecord.mint.toBase58(), badgeMint1.publicKey.toBase58());
      assert.equal(claimRecord.eventName, eventName);

      const coreBadge = await fetchCoreAsset(badgeMint1.publicKey);
      assert.ok(coreBadge, "Metaplex Core Badge was not created");
      assert.equal(
        coreBadge.owner.toBase58(),
        attendee1.publicKey.toBase58()
      );
      assert.equal(
        coreBadge.collection.address.toBase58(),
        collectionMint.publicKey.toBase58(),
        "Badge is not part of the correct collection"
      );

      const attributesPlugin = coreBadge.plugins.find(
        (p) => p.pluginType === "Attributes"
      );
      const freezePlugin = coreBadge.plugins.find(
        (p) => p.pluginType === "FreezeDelegate"
      );
      const burnPlugin = coreBadge.plugins.find(
        (p) => p.pluginType === "BurnDelegate"
      );

      assert.ok(attributesPlugin, "Attributes plugin missing");
      assert.ok(freezePlugin, "FreezeDelegate plugin missing");
      assert.ok(burnPlugin, "BurnDelegate plugin missing");

      // @ts-ignore
      const minterAttribute = attributesPlugin.attributeList.find(
        (a) => a.key === "Minter"
      );
      assert.equal(minterAttribute.value, attendee1.publicKey.toBase58());
    });
  });

  describe("mint_badge (Unhappy Paths)", () => {
    it("Prevents a double claim from the same attendee", async () => {
      const newBadgeMint = Keypair.generate();

      await assert.rejects(
        program.methods
          .mintBadge()
          .accounts({
            claimer: attendee1.publicKey, 
            badgeMint: newBadgeMint.publicKey,
            event: eventPda,
            collection: collectionMint.publicKey,
            collectionAuthority: collectionAuthorityPda,
            claimRecord: claimRecordPda1,
            coreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          } as any)
          .signers([attendee1, newBadgeMint])
          .rpc(),
        (err: anchor.AnchorError) => {
          assert.ok(
            err.message.includes("caused by account: claim_record") ||
            err.message.includes("custom program error: 0x0")
          );
          console.log("✅ Successfully rejected double claim.");
          return true;
        }
      );
    });

    it("Fails to mint with a fake collection mint", async () => {
      const fakeCollection = Keypair.generate();
      const fakeBadge = Keypair.generate();
      const fakeCollectionAuthority = getCollectionAuthorityPda(
        fakeCollection.publicKey
      );
      const newAttendeeClaimRecord = getClaimRecordPda(
        eventPda,
        attendee2.publicKey
      );

      await assert.rejects(
        program.methods
          .mintBadge()
          .accounts({
            claimer: attendee2.publicKey,
            badgeMint: fakeBadge.publicKey,
            event: eventPda,
            collection: fakeCollection.publicKey,
            collectionAuthority: fakeCollectionAuthority,
            claimRecord: newAttendeeClaimRecord,
            coreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          } as any)
          .signers([attendee2, fakeBadge])
          .rpc(),
        (err: anchor.AnchorError) => {
          const errMsg = err.message.toLowerCase();
          assert.ok(
            errMsg.includes("invalidcollection") ||
            errMsg.includes("0x1773") ||
            errMsg.includes("account doesn't exist") ||
            errMsg.includes("an account required by the instruction is missing")
          );
          console.log("✅ Successfully rejected minting with fake collection.");
          return true;
        }
      );
    });
  });

  describe("close_event (Happy Path)", () => {
    it("Allows the organizer to close the event", async () => {
      const tx = await program.methods
        .closeEvent()
        .accounts({
          organizer: organizer.publicKey,
          event: eventPda,
        })
        .rpc();

      console.log("Close Event Tx:", tx);

      const eventAccount = await program.account.event.fetch(eventPda);
      assert.ok(
        !eventAccount.isActive,
        "Event should be marked inactive"
      );
    });
  });

  describe("close_event (Unhappy Paths)", () => {
    it("Prevents a malicious actor from closing the event", async () => {
      await assert.rejects(
        program.methods
          .closeEvent()
          .accounts({
            organizer: maliciousActor.publicKey, 
            event: eventPda,
          })
          .signers([maliciousActor])
          .rpc(),
        (err: anchor.AnchorError) => {
          assert.ok(
            err.message.includes("NotAuthorized") ||
            err.message.includes("0x1775")
          );
          console.log("✅ Successfully rejected unauthorized close attempt.");
          return true;
        }
      );
    });

    it("Prevents closing an event that is already closed", async () => {
      await assert.rejects(
        program.methods
          .closeEvent()
          .accounts({
            organizer: organizer.publicKey, 
            event: eventPda,
          })
          .rpc(),
        (err: anchor.AnchorError) => {
          assert.ok(
            err.message.includes("EventAlreadyClosed") ||
            err.message.includes("0x1776")
          );
          console.log("✅ Successfully rejected attempt to close again.");
          return true;
        }
      );
    });
  });

  describe("mint_badge (Post-Close)", () => {
    it("Prevents badge minting after event is closed", async () => {
      await assert.rejects(
        program.methods
          .mintBadge()
          .accounts({
            claimer: attendee2.publicKey,
            badgeMint: badgeMint2.publicKey,
            event: eventPda, 
            collection: collectionMint.publicKey,
            collectionAuthority: collectionAuthorityPda,
            claimRecord: claimRecordPda2, 
            coreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          } as any)
          .signers([attendee2, badgeMint2])
          .rpc(),
        (err: anchor.AnchorError) => {
          assert.ok(
            err.message.includes("EventNotActive") ||
            err.message.includes("0x1772")
          );
          console.log("✅ Successfully rejected minting on closed event.");
          return true;
        }
      );
    });
  });
});