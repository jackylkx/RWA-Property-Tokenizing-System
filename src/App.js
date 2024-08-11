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

import 'primereact/resources/themes/saga-blue/theme.css';  // or another theme of your choice
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
    const tempWeb3 = new Web3(window.ethereum);
    setWeb3(tempWeb3);

  const propertycontractInstance = new tempWeb3.eth.Contract(
      propertyContractABI,
      propertyContractAddress
    );

  setPropertyContract(propertycontractInstance);
    
    
    }, [])


    async function loadPropertyContract(){

      const tempWeb3 = new Web3(window.ethereum);
        setWeb3(tempWeb3);

      const propertycontractInstance = new tempWeb3.eth.Contract(
          propertyContractABI,
          propertyContractAddress
        );

      setPropertyContract(propertycontractInstance);
    }




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
        <Route path="/mypropertieslisting" exact>
          <MyPropertiesListing  account={account} />
        </Route>        
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
