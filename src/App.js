import './App.css';
import React from 'react';
import FlatDetail from "./components/FlatDetail"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Contact from "./components/Contact"
import About from "./components/About"
import Listing from "./components/Listing"
import MyPropertiesListing from "./components/MyPropertiesListing"
import Blog from "./components/Blog"
import BlogDetail from "./components/BlogDetail"
import { useEffect, useState, useLayoutEffect  } from "react";

import {BrowserRouter as Router,Route} from "react-router-dom";
import Web3 from "web3";
import propertyContractABI from "./contracts/property.json";
import escrowContractABI from "./contracts/escrow.json";
import FundReleaseList from './components/FundReleaseList';

/* const propertyContractAddress = "0x99d33b32d22996a4123c6cbafacdf93b8d5b1782";
const escrowContractAddress = "0x70fdd5844c2ce347833d9533f344ae68375c89b1";  */

const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;
const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;

function App() {


  const [account, setAccount] = useState(null);
  const [profileExists, setProfileExists] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [propertyContract, setPropertyContract] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([])
  const [propertiesHash, setPropertiesHash] = useState([])

  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  
  useLayoutEffect (() => {
    if(propertyContract == undefined){
      loadBlockchainData();
    }
    
    
    
    }, [propertyContract])

  async function loadBlockchainData() {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        //if (networkId !== "100") {
        // Network ID for Sepolia
        //await switchToSepolia();
        //}

        // user enables the app to connect to MetaMask
        const tempWeb3 = new Web3(window.ethereum);
        setWeb3(tempWeb3);

        const propertycontractInstance = new tempWeb3.eth.Contract(
          propertyContractABI,
          propertyContractAddress
        );

        const escrowContractInstance = new tempWeb3.eth.Contract(
          escrowContractABI,
          escrowContractAddress
        );
        setPropertyContract(propertycontractInstance);
        setEscrowContract(escrowContractInstance);
        //await getAllProperty (propertycontractInstance);
        
        var accounts = await tempWeb3.eth.getAccounts();

        window.ethereum.on('accountsChanged', async () => {

          accounts = await tempWeb3.eth.getAccounts();          
          setAccount(accounts[0]);
        })

/*         console.log("aCCOUNTS", accounts);
        if (accounts.length > 0) {
          setContract(contractInstance);
          setAccount(accounts[0]);
        }
 */
 

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No web3 provider detected");
    }


  }

  async function fnConnectWallet(){
      var accounts = await web3.eth.getAccounts();

      accounts = await web3.eth.getAccounts();          
        setAccount(accounts[0]);
  }

  async function getAllProperty (propertyContractInstance) {
        
    
    try {
      // Use the setProfile() function in contract to create Profile with username and bio
      // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
      // CODE HERE 👇
      var totalsupply = await propertyContractInstance.methods.totalSupply().call();

        for (let i = 0; i < 3; i++) {
            await (async () => {
                const ipfshash = await propertyContractInstance.methods.tokenURI(totalsupply).call();
                propertiesHash.push(ipfshash);
            })();
        }

        propertiesHash.forEach(function(val, index){
            fetch(`${val}`)
            .then(response => response.json())
            .then(data => {setProperties(data)}) // Print the pinned JSON
            .catch(err => console.error("Error fetching pinned JSON:", err));
        });


    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  function shortAddress(address, startLength = 6, endLength = 4) {
    if (address === account && profileExists) {
      return profileExists;
    } else if (address) {
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    }
  }

  return (
    <Router>
      {propertyContract !== null && propertyContract !== undefined ? (
      <div className="App">
        <Header         
          web3={web3}
          setWeb3={setWeb3}
          account={account}
          setAccount={setAccount}
          shortAddress={shortAddress}/>
        <Route path="/" exact>
          <Home propertyContract={propertyContract} account={account} />
        </Route>
        <Route path="/contact"  component={Contact}></Route>
        <Route path="/listing"  component={Listing}></Route>
        <Route path="/mypropertieslisting"  component={MyPropertiesListing}></Route>
        <Route path="/fundreleaselist"  component={FundReleaseList}></Route>
        <Route path="/blog" exact component={Blog}></Route>
        <Route path="/blog/:id"  component={BlogDetail}></Route>
        <Route path="/flat/:slug"  component={FlatDetail}></Route>
        <Footer />
      </div>) : (
                <div>Loading propertyContract...</div>
              )}
    </Router>
  );
}

export default App;
