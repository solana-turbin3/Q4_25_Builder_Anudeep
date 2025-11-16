/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/poaponsol.json`.
 */
export type Poaponsol = {
  "address": "DzqHpVGTsTumRwUBSgv16PKStMA7xK3XhXwTNB921B6r",
  "metadata": {
    "name": "poaponsol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeEvent",
      "discriminator": [
        117,
        114,
        193,
        54,
        49,
        25,
        75,
        194
      ],
      "accounts": [
        {
          "name": "organizer",
          "writable": true,
          "signer": true,
          "relations": [
            "event"
          ]
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "event.organizer",
                "account": "event"
              },
              {
                "kind": "account",
                "path": "event.name",
                "account": "event"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "createEvent",
      "discriminator": [
        49,
        219,
        29,
        203,
        22,
        98,
        100,
        87
      ],
      "accounts": [
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "account",
                "path": "profile.event_count",
                "account": "organizerProfile"
              }
            ]
          }
        },
        {
          "name": "collection",
          "docs": [
            "The collection mint Keypair provided by organizer (new mint account)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "collectionAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "collection"
              }
            ]
          }
        },
        {
          "name": "coreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createEventArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mintBadge",
      "discriminator": [
        242,
        234,
        237,
        183,
        232,
        245,
        146,
        1
      ],
      "accounts": [
        {
          "name": "claimer",
          "writable": true,
          "signer": true
        },
        {
          "name": "badgeMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "collection",
          "docs": [
            "The collection NFT mint (must belong to Metaplex Core)"
          ],
          "writable": true
        },
        {
          "name": "collectionAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "collection"
              }
            ]
          }
        },
        {
          "name": "claimRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "event"
              },
              {
                "kind": "account",
                "path": "claimer"
              }
            ]
          }
        },
        {
          "name": "coreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "claimRecord",
      "discriminator": [
        57,
        229,
        0,
        9,
        65,
        62,
        96,
        7
      ]
    },
    {
      "name": "collectionAuthority",
      "discriminator": [
        209,
        221,
        189,
        233,
        183,
        32,
        247,
        91
      ]
    },
    {
      "name": "event",
      "discriminator": [
        125,
        192,
        125,
        158,
        9,
        115,
        152,
        233
      ]
    },
    {
      "name": "organizerProfile",
      "discriminator": [
        216,
        88,
        24,
        216,
        45,
        218,
        209,
        79
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "collectionAlreadyInitialized",
      "msg": "Collection already initialized"
    },
    {
      "code": 6001,
      "name": "assetAlreadyInitialized",
      "msg": "Asset already initialized"
    },
    {
      "code": 6002,
      "name": "eventNotActive",
      "msg": "Event is not active"
    },
    {
      "code": 6003,
      "name": "invalidCollection",
      "msg": "Event has ended"
    },
    {
      "code": 6004,
      "name": "collectionNotInitialized",
      "msg": "Collection not initialized"
    },
    {
      "code": 6005,
      "name": "notAuthorized",
      "msg": "Event already closed"
    },
    {
      "code": 6006,
      "name": "eventAlreadyClosed",
      "msg": "event is already closed"
    },
    {
      "code": 6007,
      "name": "invalidArgument",
      "msg": "Not authorized to perform this action"
    }
  ],
  "types": [
    {
      "name": "claimRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "event",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "collectionMint",
            "type": "pubkey"
          },
          {
            "name": "claimedAt",
            "type": "i64"
          },
          {
            "name": "eventName",
            "type": "string"
          },
          {
            "name": "eventUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "collectionAuthority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "nftName",
            "type": "string"
          },
          {
            "name": "nftUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createEventArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "maxClaims",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "collectionMint",
            "type": "pubkey"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "maxClaims",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "organizerProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "eventCount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "claimSeed",
      "type": "bytes",
      "value": "[99, 108, 97, 105, 109]"
    },
    {
      "name": "collectionAuthoritySeed",
      "type": "bytes",
      "value": "[99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "eventSeed",
      "type": "bytes",
      "value": "[101, 118, 101, 110, 116]"
    },
    {
      "name": "profileSeed",
      "type": "bytes",
      "value": "[112, 114, 111, 102, 105, 108, 101]"
    }
  ]
};
