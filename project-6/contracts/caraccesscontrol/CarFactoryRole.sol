pragma solidity >=0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'CarFactoryRole' to manage this role - add, remove, check
contract CarFactoryRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event CarFactoryAdded(address indexed account);
  event CarFactoryRemoved(address indexed account);

  // Define a struct 'CarFactorys' by inheriting from 'Roles' library, struct Role
  Roles.Role private CarFactorys;

  // In the constructor make the address that deploys this contract the 1st CarFactory
  constructor() public {
    _addCarFactory(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyCarFactory() {
    require(isCarFactory(msg.sender));
    _;
  }

  // Define a function 'isCarFactory' to check this role
  function isCarFactory(address account) public view returns (bool) {
    return CarFactorys.has(account);
  }

  // Define a function 'addCarFactory' that adds this role
  function addCarFactory(address account) public onlyCarFactory() {
    _addCarFactory(account);
  }

  // Define a function 'renounceCarFactory' to renounce this role
  function renounceCarFactory() public {
    _removeCarFactory(msg.sender);
  }

  // Define an internal function '_addCarFactory' to add this role, called by 'addCarFactory'
  function _addCarFactory(address account) internal {
    CarFactorys.add(account);
    emit CarFactoryAdded(account);
  }

  // Define an internal function '_removeCarFactory' to remove this role, called by 'removeCarFactory'
  function _removeCarFactory(address account) internal {
    CarFactorys.remove(account);
    emit CarFactoryRemoved(account);
  }
}