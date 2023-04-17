import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";

type Pool = {
  id: string;
  name: string;
};

type PoolProps = {
  pool: Pool;
};

const PoolPage: React.FC<PoolProps> = ({ pool }) => {
  return (
    <div>
      <h1 className="text-xl">
        Pool {pool.id}: {pool.name}
      </h1>
      <p>Pool details and information go here...</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Replace this part with fetching the data of the Uniswap pools
  const pools: Pool[] = [
    { id: "1", name: "Pool 1" },
    { id: "2", name: "Pool 2" },
    { id: "3", name: "Pool 3" },
  ];

  const paths = pools.map((pool) => ({
    params: { id: pool.id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };

  // Replace this part with fetching the data of the specific Uniswap pool
  const pool: Pool = {
    id,
    name: `Pool ${id}`,
  };

  return {
    props: {
      pool,
    },
  };
};

export default PoolPage;
