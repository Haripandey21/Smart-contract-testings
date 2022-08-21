const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("tokentest Contract", function () {
    let tokentest;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;
  
    beforeEach(async function () {
      tokentest = await ethers.getContractFactory("tokentest");
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners(); // destructuring in js 
      hardhatToken = await tokentest.deploy();
    });

    describe("Deployment of contract...", function () {
      it("Should set the right owner", async function () {
        expect(await hardhatToken.owner()).to.equal(owner.address);
      });
      it("Should assign the total supply of tokens to the owner", async function () {
        const ownerBalance = await hardhatToken.fetchbalance(owner.address);
        expect(await hardhatToken.totalsupply()).to.equal(ownerBalance);
      });
    });
  
    describe("Transactions", function () {
      
        it("Should transfer tokens between accounts", async function () {
            //owner account to addr1.address
            await hardhatToken.transfer(addr1.address, 6);
            const addr1Balance = await hardhatToken.fetchbalance(addr1.address);
            expect(addr1Balance).to.equal(6);
      
            await hardhatToken.connect(addr1).transfer(addr2.address, 5);
            const addr2Balance = await hardhatToken.fetchbalance(addr2.address);
            expect(addr2Balance).to.equal(5);
          });


      it("Should fail if sender does not have enough tokens", async function () {
        const initialOwnerBalance = await hardhatToken.fetchbalance(owner.address); //10000
        await expect(
          hardhatToken.connect(addr1).transfer(owner.address, 1) 
        ).to.be.revertedWith("not enough tokens");
        expect(await hardhatToken.fetchbalance(owner.address)).to.equal(
          initialOwnerBalance
        );
      });
  
      it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await hardhatToken.fetchbalance(owner.address);
        await hardhatToken.transfer(addr1.address, 5);
        await hardhatToken.transfer(addr2.address, 10);
  
        const finalOwnerBalance = await hardhatToken.fetchbalance(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - 15);
  
        const addr1Balance = await hardhatToken.fetchbalance(addr1.address);
        expect(addr1Balance).to.equal(5);

        const addr2Balance = await hardhatToken.fetchbalance(addr2.address);
        expect(addr2Balance).to.equal(10);
      });
    });
  });