# Q4_25_Builder_Anudeep

This repository contains my work from the Turbin3 Builders Q4 Cohort (2025). Each subproject here reflects my progress across different Solana development concepts.

## Subprojects Overview

Below are all the programs included in this repository.  
Each section includes a short description, setup steps, and usage instructions.

---

<details>
<summary><strong>anchor-amm-starter-q4-25</strong></summary>

### Automated Market Maker Starter  
A simple AMM showing liquidity pool creation, token swaps, and LP token minting.

#### Setup
```sh
cd anchor-amm-starter-q4-25
npm install
anchor build
anchor test
````

</details>

---

<details>
<summary><strong>anchor-dice-game-starter-q4-25</strong></summary>

### Dice Game Program

A basic on-chain betting game where users wager SOL and roll numbers.

#### Setup

```sh
cd anchor-dice-game-starter-q4-25
npm install
anchor build
anchor test
```

</details>

---

<details>
<summary><strong>anchor-escrow-starter-q4-25</strong></summary>

### Escrow Contract

A trustless token escrow using PDAs and secure token program interactions.

#### Setup

```sh
cd anchor-escrow-starter-q4-25
npm install
anchor build
anchor test
```

</details>

---

<details>
<summary><strong>anchor-mplxcore-starter-q4-25</strong></summary>

### MPL Core Program

Demonstrates interactions with Metaplex’s Core primitives.

#### Setup

```sh
cd anchor-mplxcore-starter-q4-25
npm install
anchor build
anchor test
```

</details>

---

<details>
<summary><strong>anchor-nft-staking-starter-q4-25</strong></summary>

### NFT Staking Program

A staking contract where users lock NFTs and earn rewards.

#### Setup

```sh
cd anchor-nft-staking-starter-q4-25
npm install
anchor build
anchor test
```

</details>

---

<details>
<summary><strong>anchor-vault-starter-q4-25</strong></summary>

### Token Vault Program

Secure vault demonstrating PDA ownership, withdrawals, and safety checks.

#### Setup

```sh
cd anchor-vault-starter-q4-25
npm install
anchor build
anchor test
```

</details>

---

<details>
<summary><strong>capstone/poaponsol</strong></summary>

### Capstone: POAP on Solana

Final project featuring a complete POAP (Proof-of-Attendance Protocol) flow on-chain.

#### Features

* POAP minting
* Event creation + validation
* Full TypeScript client
* Tests passing end-to-end

#### Setup

```sh
cd capstone/poaponsol
npm install
anchor build
anchor test
```

</details>

---

## 🛠 Built With

* Solana / Rust
* Anchor Framework
* TypeScript
* SPL Token Program
* Metaplex MPL Core

## Getting Started

Clone:

```sh
git clone https://github.com/anudeep/Q4_25_Builder_Anudeep.git
cd Q4_25_Builder_Anudeep
```
install dependencies
```sh
npm install 
```
build all programs
```sh
anchor build
```
test all programs
```sh
anchor test
```

capstone project is mainted in [poaponsol](https://github.com/0x4nud33p/poaponsol) repository.