# Explore Web3

A study project for exploring web3 based on [LearnWeb3 DAO's sophomore course task](https://learnweb3.io/courses)
with quite a few additions and alterations:

- use of typescript instead of javascript
- libraries updated to latest versions
- some sections are entirely outside the course track, like Uniswap pools

The code was written with the help of [chat gpt 4](https://chat.openai.com/?model=gpt-4).

## contract

- [x] deploy a contract
- [ ] set up hardhat to run local testnet node

## website

- [ ] connect wallet

### pools

Exploration of uniswap liquidity pools based on their graphql data.

- [ ] get top pools by volumeUSD
- [ ] rank pools by custom reward
- [ ] display detailed pool data for each pool
- [ ] use graphql subscription to update data live
- [ ] display user's liquidity position in each pool if any

### whitelist

Just a whitelist, look up the contract address in [src/constants.ts](src/constants.ts).

- [x] display number of subscribers
- [x] allow to subscribe (limited to 10)
