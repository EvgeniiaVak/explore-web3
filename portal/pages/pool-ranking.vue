<template>
  <div>
    <h2>Pool Ranking</h2>
    <div>
      ⚠️ The information here is queried
      from
      <a
          target="_blank" href="https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3/graphql">Uniswap
        GraphQL
        API</a>, as such it is always for <span class="font-bold">mainnet</span> regardless of what the wallet is
      connected to.
    </div>

    <div class="navbar px-0 mt-4 font-bold">
      <div class="navbar-start">
        <div class="my-auto text-xl">Top {{ nTopPools }} by volume USD</div>
      </div>
      <div class="navbar-end">
        <input class="input pr-0" v-model="poolsDataDate" @change="getPoolsInfo" type="date">
      </div>
    </div>

    <Table :headers="poolsDataHeaders" :rows="poolsData"></Table>

    <div>
      Assuming that we had a position of 100 USD during that period, for simplicity assuming that all the locked volume
      was in the active range for all participants, let's see how much profit we would receive.
    </div>

    <Table :headers="poolsRatioDataHeaders" :rows="poolsRatioData"></Table>

  </div>
</template>

<script lang="ts" type="module" setup>
import {Token} from '@uniswap/sdk-core'


// TODO: other token list?
// TODO: why no ETH?
import defaultTokens from '@uniswap/default-token-list'

// chain id -> symbol -> token
function tokenMap(tokenList) {
  const tokens = new Map<Number, Map<String, Token>>()

  for (const token of tokenList) {
    if (!tokens.has(token.chainId)) {
      tokens.set(token.chainId, new Map<String, Token>())
    }
    const chain_tokens = tokens.get(token.chainId)
    if (chain_tokens) {
      chain_tokens.set(token.symbol, new Token(token.chainId, token.address, token.decimals, token.symbol, token.name))
    }
  }
  return tokens
}

const tokens = tokenMap(defaultTokens.tokens)

const poolsDataHeaders = ref([])
const poolsData = ref([])
const poolsRatioDataHeaders = ref([])
const poolsRatioData = ref([])
const nTopPools = ref(10)
const today = new Date()

const poolsDataDate = ref(today.toISOString().split('T')[0])


async function getPoolsInfo() {
  const requestedDate = Math.round(new Date(poolsDataDate.value).getTime() / 1000)
  const query = gql`
{
  poolDayDatas(
    first: ${nTopPools.value}
    orderBy: volumeUSD
    orderDirection: desc
    where: {date: ${requestedDate}}
  ) {
    tvlUSD
    volumeUSD
    id
    pool {
      id
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      feeTier
    }
  }
}
`
  const {data} = (await useAsyncQuery(query))
  if (data.value) {
    poolsData.value = data.value.poolDayDatas.map((poolDayData) => {
      const pool = `${poolDayData.pool.token0.symbol}/${poolDayData.pool.token1.symbol} (${poolDayData.pool.feeTier / 10000}%)`
      return {
        pool,
        volume: poolDayData.volumeUSD,
        tvl: poolDayData.tvlUSD,
        feeTier: poolDayData.pool.feeTier,
        poolId: poolDayData.pool.id,
      }
    })
    poolsDataHeaders.value = ['pool', 'volume', 'tvl']

    const ratioHeader = 'volume / tvl'
    const rewardHeader = 'fee * volume / tvl'
    poolsRatioData.value = poolsData.value.map((poolData) => {
      return {
        pool: poolData.pool,
        [ratioHeader]: poolData.volume / poolData.tvl,
        [rewardHeader]: poolData.feeTier / 10000 * poolData.volume / poolData.tvl,
        poolId: poolData.poolId,
      }
    })
    poolsRatioData.value.sort((a, b) => (b[rewardHeader] - a[rewardHeader]))
    poolsRatioDataHeaders.value = ['pool', rewardHeader, ratioHeader]
  }
}

getPoolsInfo()
</script>
