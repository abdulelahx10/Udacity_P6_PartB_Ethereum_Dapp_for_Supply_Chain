// migrating the appropriate contracts
var CarFactoryRole = artifacts.require("./CarFactoryRole.sol");
var DealerRole = artifacts.require("./DealerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(CarFactoryRole);
  deployer.deploy(DealerRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
