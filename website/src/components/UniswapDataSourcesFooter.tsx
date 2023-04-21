import React from "react";

const UniswapDataSourcesFooter: React.FC = () => {
  return (
    <footer className="">
      <h2 className="">📚 Data sources</h2>
      <ul>
        <li>
          <a href="https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3/graphql" className="mx-2">Uniswap GraphQL
            Endpoint</a>
        </li>
      </ul>

    </footer>
  );
};

export default UniswapDataSourcesFooter;