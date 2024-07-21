// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract User {
    mapping(address => string) private userNames;

    function setUserName(string memory userName) public {
        userNames[msg.sender] = userName;
    }

    function getUserName(address user) public view returns (string memory) {
        return userNames[user];
    }
}
