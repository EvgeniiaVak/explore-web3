import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// FIXME: https://github.com/KartanHQ/intellij-hardhat/issues/196
//  tests don't work via intellij:
//    TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
//    maybe relevant:
//    https://ethereum.stackexchange.com/questions/115395/debug-hardhat-project-using-intellij
//  but they work via command line:
//    npx hardhat test

describe("Whitelist", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(100);

    return {
      whitelist,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("2 + 2 should equal 4", async function () {
      expect(2 + 2).to.equal(4);
    });

    it("Should deploy?", async function () {
      const { whitelist, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );

      // TODO: test deployment
    });
  });
});
