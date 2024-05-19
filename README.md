# Wallet League Treasury Manager

## Overview

This project, is a smart contract system designed to manage a treasury of jetton (token) on a blockchain platform compatible with TON (The Open Network). It facilitates operations such as managing a whitelist for authorized operations, transferring jettons, and updating contract data and code.

This treasury contract currently handles only one jetton in addition to TON.
## Features

- **Whitelist Management**: Uses a whitelist of hashes from secret passcodes (24 words in sender's comment). Transactions must include a comment with a hash matching an entry in the whitelist to execute withdrawals.
- **Jetton Transfers**: Enable the transfer of jetton assets to and from the treasury.
- **Dynamic Data Management**: Functions to update contract status, owner, and jetton balances.

## Core Functions

### Message Handling

- `transfer_jetton(...)`: Facilitates the transfer of jetton amounts to specified addresses.
- `recv_internal(...)`: Handles incoming messages and directs them based on the operation code provided in the message.

### Getter Functions

- `whitelist()`: Returns the current whitelist dictionary cell.
- `jetton_balance()`: Returns the current balance of jettons in the treasury.
- `status()`: Returns the current status (enabled/disabled) of the contract.
- `owner()`: Returns the slice representing the owner's address.

## Contributing

Contributions to the project are welcome. Please ensure that any pull requests or updates adhere to the existing coding style and add meaningful functionality or improvements. Always test thoroughly before proposing changes.

## License

Apache-2.0