import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import MyPropertiesItem from './MyPropertiesItem';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";
import { getPropertiesBySeller } from '../api/property_api';

const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
    const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;

const MyProperties = (account) => {
  const [properties, setProperties] = useState([]);
  const [escrow, setEscrow] = useState([]);
  const [accounts, setAccounts] = useState([]);
  var escrowContractInstance = "";
    var propertyContractInstance = "";
    
    useEffect(() => {
      setAccounts(account.account);
      window.ethereum.on('accountsChanged', async () => {
    
          const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts(account[0]);
          console.log('Accounts:', account[0]);
      })
  }, []);
 /*  useEffect(() => {

    const tempWeb3 = new Web3(window.ethereum);

    propertyContractInstance = new tempWeb3.eth.Contract(
      propertyContractABI,
      propertyContractAddress,
    );
    
  escrowContractInstance = new tempWeb3.eth.Contract(
      escrowContractABI,
      escrowContractAddress,
    );
    

    const getAllProperty = async () => {
      try {
        var propertiesList = [];
        var escrowList = [];
          for (let i = 1; i < 4; i++) {
              await (async () => {
                  const ipfshash = await propertyContractInstance.methods.getProperty(i).call();
                  propertiesList.push(ipfshash);
                  const escrowRow = await escrowContractInstance.methods.checkEscrow(i).call();
                  escrowList.push(escrowRow);
              })();
          }
          setProperties(propertiesList);
          setEscrow(escrowList);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    getAllProperty()
  }, []); */

  useEffect(() => {
    
                    const fetchProperties = async () => {
                        try {
                          console.log(accounts);
                            const data = await getPropertiesBySeller(accounts);
                            console.log(data);
                            setProperties(data);
                        } catch (err) {
                            //setError(err);
                            console.error('Error:', err);
                            console.error('err.response.data.message:', err.response.data.message);
                            if(err.response.data.message == "No listed properties found")
                            {
                              setProperties([]);
                            }
                            
                        }
                    };
                    console.log("properties: " + properties);
                    if(properties.length > 0)
                    {
                      console.log("properties[0].seller: " + properties[0].seller);
                    }
                    
                    console.log("accounts: " + accounts);
           if(properties.length == 0 && accounts != null){
    
    
            fetchProperties();
           }
           else if(properties[0].seller.toLowerCase() != accounts.toLowerCase()){
            fetchProperties();
           }
                    
          }, [properties,accounts]);



  return (

  <section className="contact">

  
<div className="page-top">
  <div className="container">
      <div className="row">
          <div className="col-lg-12">
              <h1 className="page-title">Listing Your Property</h1>
              <h2 className="page-description">List Your Property</h2>
          </div>
      </div>
  </div>
</div>
<div className="page-content">
<section className="section-all-re">
            <div className="container">
                {/* <Title title={title.text} description={title.description} /> */}
                
                {(properties !== undefined && properties.length >0) ?  (
                   <div>
                   {properties.map((property, index) => (
                     <div className="row" key={property.propertyid}>
                       <MyPropertiesItem slug={`property-${property.propertyid}`} selectedproperty={property} account={account.account}/>
                     </div>
                   ))}
                 </div>
                
                  ):(<div>No properties under your account</div>)}
            </div>
        </section>
</div>
</section>
  );
};

export default MyProperties;
