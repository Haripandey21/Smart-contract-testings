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
