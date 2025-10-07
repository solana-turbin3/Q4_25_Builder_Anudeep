# Enrollment Prerequisites

# Part A — TypeScript

## Overview

This TypeScript project performs the following tasks:

1. Generate a new Solana keypair and save it to `./keypair.json`.
2. Request and claim devnet SOL (airdrop).
3. Transfer native SOL to a destination address.
4. Drain (empty) the development wallet to a turbin address.
5. Enroll


### Install

```bash
cd airdrop
yarn install
```
    
### Scripts (package.json)

* `yarn keygen` — generate a new keypair
* `yarn airdrop` — request and confirm airdrop (1 SOL by default)
* `yarn drain-wallet` — transfer *all* lamports minus fee to a target address
* `yarn generate-client` — placeholder (if you have an IDL, generate a client)
* `yarn enroll` — enroll (placeholder; demonstrates signing and sending enrollment instruction/transaction)