import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const env = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    quicknode: {
      url: env.QUICKNODE_HTTP_URL,
      accounts: [env.PRIVATE_KEY || ""]
    },
    local: {
      url: env.LOCAL_HTTP_URL,
      accounts: [env.PRIVATE_KEY || ""]
    }
  }
};

export default config;
