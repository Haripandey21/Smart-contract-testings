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

    function fetchbalance(address addr) external returns(uint )
    {
        return users[addr];
    }

}