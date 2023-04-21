import { FormEvent, useEffect, useState } from "react";
import defaultTokens from "@uniswap/default-token-list";
import { calculateReward, REWARD_DESCRIPTION, REWARD_HEADER } from "@/utils/metrics";
import getPoolsInfoQuery from "@/graphql/queries/getPoolsInfo.graphql";
import { tokenMap } from "@/utils/tokens";
import { useLazyQuery } from "@apollo/client";
import { PoolDayData } from "@/graphql/generated/graphql";
import Table from "rc-table";
import UniswapDataSourcesFooter from "@/components/UniswapDataSourcesFooter";

type PoolRankingData = {
  pool: string;
  volume: number;
  tvl: number;
  feeTier: number;
  poolId: string;
  fees: number;
  token0: string;
  token1: string;
  [REWARD_HEADER]: number;
};

// TODO: recall why did I have this
const tokens = tokenMap(defaultTokens.tokens);


function UniswapLink(row: PoolRankingData) {

  // for example:
  // https://app.uniswap.org/#/add/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/3000

  return <a href={`https://app.uniswap.org/#/add/${row.token0}/${row.token1}/${row.feeTier}`} target="_blank"
            rel="noreferrer">{row.pool}</a>;
}

const rankingColumns = [
  {
    title: "Pool",
    dataIndex: "pool",
    width: 200,
    render: (value: string, row: PoolRankingData) => UniswapLink(row)
  },
  {
    title: "Volume ⬇︎",
    dataIndex: "volume",
    width: 100
  },
  {
    title: "Fees",
    dataIndex: "fees",
    width: 100
  },
  {
    title: "TVL",
    dataIndex: "tvl",
    width: 100
  }

];

const rewardColumns = [
  {
    title: "Pool",
    dataIndex: "pool",
    width: 200,
    render: (value: string, row: PoolRankingData) => UniswapLink(row)
  },
  {
    title: REWARD_HEADER,
    dataIndex: REWARD_HEADER,
    width: 100
  }
];

const Pools = () => {
  const today = new Date();
  const [poolsDataDate, setPoolsDataDate] = useState(today.toISOString().split("T")[0]);
  const [getPoolsData, { loading, error, data }] = useLazyQuery(getPoolsInfoQuery);
  const [rankingData, setRankingData] = useState<PoolRankingData[]>([]);

  function onDateChange(event: FormEvent<HTMLInputElement>) {
    setPoolsDataDate((event.target as HTMLInputElement).value);
  }


  useEffect(() => {
    async function getPoolsInfo() {
      const requestedDate = Math.round(new Date(poolsDataDate).getTime() / 1000);

      const variables = {
        "nTopPools": 10,
        "requestedDate": requestedDate
      };

      await getPoolsData({ variables: variables });
    }

    getPoolsInfo().then(() => {
      console.log("fetched pools data");
    });
  }, [getPoolsData, poolsDataDate]);


  useEffect(() => {
    if (!data) {
      return;
    }
    const freshRankingData = data.poolDayDatas.map((poolDayData: PoolDayData) => {
      const pool = `${poolDayData.pool.token0.symbol}/${poolDayData.pool.token1.symbol} (${poolDayData.pool.feeTier / 10000}%)`;
      return {
        pool,
        volume: Math.round(poolDayData.volumeUSD),
        fees: Math.round(poolDayData.feesUSD),
        tvl: Math.round(poolDayData.tvlUSD),
        token0: poolDayData.pool.token0.id,
        token1: poolDayData.pool.token1.id,
        feeTier: poolDayData.pool.feeTier,
        poolId: poolDayData.pool.id,
        [REWARD_HEADER]: calculateReward(poolDayData.feesUSD, poolDayData.tvlUSD)
      };
    });

    setRankingData(freshRankingData);
  }, [data]);

  if (error) {
    console.error(error);
  }


  return (
    <div className="flex flex-col">

      <div className="flex justify-between">
        <h2 className="my-auto">Rank Uniswap Pools</h2>
        <input className="bg-transparent my-auto" type="date" onInput={onDateChange}
               defaultValue={poolsDataDate}></input>
      </div>

      {loading ? <button className="btn btn-square loading mx-auto"></button> :
        <Table className="text-sm" data={rankingData} columns={rankingColumns} />}

      <p>{REWARD_DESCRIPTION}</p>

      {loading ? <button className="btn btn-square loading mx-auto"></button> :
        <Table className="text-sm" data={rankingData} columns={rewardColumns} />}
      <UniswapDataSourcesFooter />

    </div>
  );
};

export default Pools;
