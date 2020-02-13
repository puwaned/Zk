import Verifier from "./contracts/Verifier.json";
import Election from "./contracts/Election.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },
  contracts: [Verifier, Election],
  events: {},
  polls: {
    accounts: 1500
  }
};

export default options;
