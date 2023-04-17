import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const breadcrumbItems = [{ name: "Home" }];

  return (
    <div className="">
      <h1 className="">Explore Web3</h1>
      <p className=""></p>
      <ul className="text-xl">
        <li>
          <Link href="/pools">Rank Uniswap Pools</Link>
        </li>
        <li>
          <Link href="/whitelist">Subscribe to a Whitelist</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
