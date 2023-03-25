<template>
  <div>
    <h2>Pool Ranking</h2>


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
      To estimate how much we would earn from a pool, if we had a position during a given day, let's look at the ratio
      of fees paid to the pool's total value locked (TVL).
    </div>
    <Table :headers="poolsRatioDataHeaders" :rows="poolsRatioData"></Table>

  </div>
</template>

<script lang="ts" type="module" setup>
import {Token} from '@uniswap/sdk-core'
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
    feesUSD
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
        link: `https://info.uniswap.org/#/pools/${poolDayData.pool.id}`,
        volume: poolDayData.volumeUSD,
        tvl: poolDayData.tvlUSD,
        feeTier: poolDayData.pool.feeTier,
        poolId: poolDayData.pool.id,
        fees: poolDayData.feesUSD,
      }
    })
    poolsDataHeaders.value = ['pool', 'volume', 'fees', 'tvl']

    const rewardHeader = 'fees / tvl * 100 * 365'
    poolsRatioData.value = poolsData.value.map((poolData) => {
      return {
        pool: poolData.pool,
        link: poolData.link,
        [rewardHeader]: poolData.fees / poolData.tvl * 100 * 365,
        poolId: poolData.poolId,
      }
    })
    poolsRatioData.value.sort((a, b) => (b[rewardHeader] - a[rewardHeader]))
    poolsRatioDataHeaders.value = ['pool', rewardHeader]
  }

  console.log(JSON.stringify(poolsRatioData.value, null, 2))
}

getPoolsInfo()
</script>
