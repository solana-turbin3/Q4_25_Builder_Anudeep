# Enrollment Prerequisites

# Part B — Rust 

## Overview

1. Generate a new Solana keypair and print the public key.
2. Request and confirm a devnet airdrop.
3. Transfer SOL between accounts.
4. `submit_rs` test "enroll/submit".

### How to run

```bash
cd airdrop2
cargo test keygen -- --nocapture
cargo test claim_airdrop -- --nocapture
cargo test transfer_sol -- --nocapture
cargo test submit_rs -- --nocapture
```

---