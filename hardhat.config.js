/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
/*       accounts: {
        mnemonic: process.env.SEED_PHRASE,
      }, */
      chainId: 1337,
    },
    optimism_sepolia: {
      url: `https://sepolia.optimism.io`,
      accounts: [process.env.REACT_APP_ACCOUNT_PRIVATE_KEY],
      chainId: 11155420
    },
    kiichain_testnet: {
      url: `https://a.sentry.testnet.kiivalidator.com:8645`,
      accounts: [process.env.REACT_APP_ACCOUNT_PRIVATE_KEY],
      chainId: 123454321
    },
  },
};
