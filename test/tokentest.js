const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("tokentest contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();

      const tokentest = await ethers.getContractFactory("tokentest"); // instance creation of contract..
  
      const hardhatToken = await tokentest.deploy();  // deploy..
  
      const ownerBalance = await hardhatToken.fetchbalance(owner.address);  // calling function..
      expect(await hardhatToken.totalsupply()).to.equal(ownerBalance);    // comparing or checking...
    });
  });