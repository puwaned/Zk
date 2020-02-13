const Election = artifacts.require("Election");
const Verifier = artifacts.require("Verifier");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.deploy(Verifier);
};
