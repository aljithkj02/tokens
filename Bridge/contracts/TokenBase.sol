// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TokenBase is ERC20 {
  address public admin;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    admin = msg.sender;
  }

  modifier isOwner {
    require(msg.sender == admin, 'only admin');
    _;
  }

  function updateAdmin(address newAdmin) external isOwner {
    admin = newAdmin;
  }

  function mint(address to, uint amount) external isOwner {
    _mint(to, amount);
  }

  function burn(address owner, uint amount) external isOwner {
    _burn(owner, amount);
  }
}