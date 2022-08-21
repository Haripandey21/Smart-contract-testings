# Smart-contract-testings
- https://www.youtube.com/watch?v=fPjCp6bca9M&list=PLgPmWS2dQHW9mucRpDVe16j9Qn74ZXqcD
- https://hardhat.org/tutorial/testing-contracts
- https://stackoverflow.com/questions/72166893/typeerror-cannot-read-properties-of-undefined-reading-address/73432335#73432335 

## tokentest.sol
```bash 
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract tokentest{

    string public name="Blocks eater";
    uint public totalsupply=10000;
    string public symbol="BE";
    address public owner;

    mapping(address=>uint) users;


    constructor(){
        owner=msg.sender;
        users[msg.sender]=totalsupply;

    }

    function transfer(address to , uint amt) external 
    {
        require(users[msg.sender]>amt,"not enough tokens");
        users[msg.sender]-=amt;
        users[to]+=amt;
    }

    function fetchbalance(address addr) external view  returns(uint )
    {
        return users[addr];
    }

}
```
## tokentest.js 
```bash 
const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("tokentest contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();
      console.log("owner :", owner);

      const tokentest = await ethers.getContractFactory("tokentest"); // instance creation of contract..
  
      const hardhatToken = await tokentest.deploy();  // deploy..
  
      const ownerBalance = await hardhatToken.fetchbalance(owner.address);  // calling function..
      expect(await hardhatToken.totalsupply()).to.equal(ownerBalance);    // comparing or checking...
    });

    it("transfering token must work......", async function () {
        const [owner,addr1,addr2] = await ethers.getSigners();
  
        const tokentest = await ethers.getContractFactory("tokentest"); // instance creation of contract..
    
        const hardhatToken = await tokentest.deploy();  // deploy..
    
        await hardhatToken.transfer(addr1.address,3)           // transfer 3 tokens to add1
        expect(await hardhatToken.fetchbalance(addr1.address)).to.equal(3);    // comparing or checking...
        
        await hardhatToken.connect(addr1).transfer(addr2.address,2)           // transfer 3 tokens to add1
        expect(await hardhatToken.fetchbalance(addr2.address)).to.equal(2);    // comparing or checking...
    
      });
  });

```

## Enhanced test :
we use either beforeEach Hooks or Fixtures to reduce code duplication 
- USING beforeEach Hooks :-
```bash 
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
```
```bash


using Fixtures :- https://hardhat.org/tutorial/testing-contracts 


```

