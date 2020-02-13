import Web3 from "web3";
import Election from "./contracts/Election.json";
import Verifier from "./contracts/Verifier.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545")
  },
  contracts: [Election, Verifier],
  polls: {
    accounts: 1500
  }
};

export default options;
