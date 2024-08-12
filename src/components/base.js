const chainId = process.env.REACT_APP_CHAIN_ID;



  export async function switchToNetwork() {
    try {

      // Request user to switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHexadecimal(parseInt(chainId)) }], // Chain ID for Sepolia in hexadecimal
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          // If Sepolia is not added to user's MetaMask, add it
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: toHexadecimal(parseInt(chainId)),
                chainName: process.env.REACT_APP_NETWORK_NAME,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [process.env.REACT_APP_RPC_URL],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network to MetaMask", addError);
        }
      } else {
        console.error("Failed to switch to Sepolia network", switchError);
      }
    }
  }


  function toHexadecimal(chainId) {
    return `0x${chainId.toString(16)}`;
  }