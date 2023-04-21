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
  link: string;
  volume: number;
  tvl: number;
  feeTier: number;
  poolId: string;
  fees: number;
};

type PoolRewardData = {
  pool: string;
  link: string;
  [REWARD_HEADER]: number;
  poolId: string;
};

// TODO: recall why did I have this
const tokens = tokenMap(defaultTokens.tokens);

const rankingColumns = [
  {
    title: "Pool",
    dataIndex: "pool",
    width: 200,
    render: (value: string, row: PoolRankingData) => <a href={"pools/" + row.poolId}>{value}</a>
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
    render: (value: string) => <a href="#">{value}</a>
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
  const [rewardData, setRewardData] = useState<PoolRewardData[]>([]);

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
    const freshTableData = data.poolDayDatas.map((poolDayData: PoolDayData) => {
      const pool = `${poolDayData.pool.token0.symbol}/${poolDayData.pool.token1.symbol} (${poolDayData.pool.feeTier / 10000}%)`;
      return {
        pool,
        link: `pool-details?id=${poolDayData.pool.id}`,
        volume: Math.round(poolDayData.volumeUSD),
        fees: Math.round(poolDayData.feesUSD),
        tvl: Math.round(poolDayData.tvlUSD),
        feeTier: poolDayData.pool.feeTier,
        poolId: poolDayData.pool.id

      };
    });

    setRankingData(freshTableData);

    const freshRewardData = freshTableData.map((poolData: PoolRankingData) => {
      return {
        pool: poolData.pool,
        link: poolData.link,
        [REWARD_HEADER]: calculateReward(poolData.fees, poolData.tvl),
        poolId: poolData.poolId
      };
    });
    freshRewardData.sort((a: PoolRewardData, b: PoolRewardData) => b[REWARD_HEADER] - a[REWARD_HEADER]);
    setRewardData(freshRewardData);
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
        <Table className="text-sm" data={rewardData} columns={rewardColumns} />}
      <UniswapDataSourcesFooter />

    </div>
  );
};

export default Pools;
