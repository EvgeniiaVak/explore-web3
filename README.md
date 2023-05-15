# Explore Web3

A study project for exploring web3 based on [LearnWeb3 DAO's course](https://learnweb3.io/courses)
with quite a few additions and alterations.

The code was written with the help of [chat gpt 4](https://chat.openai.com/?model=gpt-4).

## Features that are not part of the course

- [x] Typescript (instead of JS)

### contract

- [x] set up hardhat to run local testnet node
- [x] write tests (+ check out hardhat debug feature)
- [ ] upgrade packages

### website

- [ ] connect wallet via qr code (as opposed to only browser extension)

#### /pools

Exploration of uniswap liquidity pools based on their graphql data.

- [x] get top pools by volumeUSD
- [x] rank pools by custom reward
- [ ] display detailed pool data for each pool
- [ ] use graphql subscription to update data live
- [ ] display user's liquidity position in each pool if any

#### /whitelist

Just a whitelist, look up the contract address in [src/constants.ts](website/src/constants.ts).

- [ ] show correct number of subscribers even if the wallet is not connected
