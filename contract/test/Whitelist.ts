import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Whitelist", function() {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWhitelistFor8() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();

    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(8);

    return {
      whitelist,
      signers
    };
  }

  describe("Deployment", function() {
    it("Should set the right number of max addresses", async function() {
      const { whitelist } = await loadFixture(
        deployWhitelistFor8
      );

      expect(await whitelist.maxWhitelistedAddresses()).to.equal(8);
    });
  });

  describe("addAddressToWhitelist", async function() {

    it("Should add an address to the whitelist", async function() {
      const { whitelist, signers } = await loadFixture(
        deployWhitelistFor8
      );

      const alice = signers[1];
      await whitelist.connect(alice).addAddressToWhitelist();
      expect(await whitelist.whitelistedAddresses(alice.address)).to.equal(true);
    });

    it("Should fail if the address is already whitelisted", async function() {
      const { whitelist, signers } = await loadFixture(
        deployWhitelistFor8
      );

      const alice = signers[1];
      await whitelist.connect(alice).addAddressToWhitelist();
      await expect(whitelist.connect(alice).addAddressToWhitelist()).to.be.revertedWith(
        "Sender has already been whitelisted"
      );
    });

    it("Should fail if the whitelist is full", async function() {
      const { whitelist, signers } = await loadFixture(
        deployWhitelistFor8
      );

      for (let i = 0; i < 8; i++) {
        await whitelist.connect(signers[i]).addAddressToWhitelist();
      }
      await expect(whitelist.connect(signers[8]).addAddressToWhitelist()).to.be.revertedWith(
        "More addresses cannot be added, limit reached"
      );
    });

    it("Should not contain the address if it is not whitelisted", async function() {
      const { whitelist, signers } = await loadFixture(
        deployWhitelistFor8
      );

      expect(await whitelist.whitelistedAddresses(signers[3].address)).to.equal(false);
    });

  });
});
