
import axios from 'axios';
import { useState } from 'react';
import Web3 from "web3";
import { LoadingBar } from './LoadingBar';
import { useEffect } from 'react';
import FundReleaseItem from './FundReleaseItem';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";


const FundReleaseList = () => {
    const [properties, setProperties] = useState([]);
    const [escrow, setEscrow] = useState([]);
    const [accounts, setAccounts] = useState(null);
    var escrowContractInstance = "";
    var propertyContractInstance = "";
    
    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;

    useEffect(() => {

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

                          //0 = initial, 1 = deposit paid, 2 = sellerApproved, 3= full payment, 4 = fund release, 5 = listing cancelled
                          if(escrowRow.fundStatus == 3)
                            {
                                escrowList.push(escrowRow);
                            }
                          
                      })();
                  }
                  setProperties(propertiesList);
                  setEscrow(escrowList);
              } catch (error) {
                console.error(error);
              } finally {
              }
            };
    

            async function requestAccounts() {
                try {
                    window.ethereum.on('accountsChanged', handleAccountChange);
                    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccounts(account[0]);
                    console.log('Accounts:', account[0]);


                } catch (error) {
                    console.error('Error requesting accounts:', error);
                }
            }

            if (accounts == undefined || accounts == null) {
                requestAccounts();
            }

          }, []);

          const handleAccountChange = async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts[0]);
            console.log("Current account:", accounts[0]);

        };

        
    return (

            <section className="contact">

            <div className="page-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="page-title">Release Fund</h1>
                            <h2 className="page-description">Contract Owner release fund to buyer and seller</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                        {(properties !== undefined && properties.length >0) &&
                            (escrow !== undefined && escrow.length >0) ?  (
                            <div>
                            {escrow.map((es, index) => (
                                <div className="row" key={properties[index].propertyid}>
                                <FundReleaseItem slug={`property-${properties[index].propertyid}`} properties={properties[index]} escrow={es}/>
                                </div>
                            ))}
                            </div>
                            
                            ):(<div>No Escrow Pending for Fund Release</div>)}
                            
                        </div>
                        <div className="col-lg-12">
                           {/*  <div className="row mt-5">
                                <div className="col-lg-6">
                                    <label>Property Name</label>
                                    <input type="text" className="inp-contact" value={propertyName} onChange={(e) => setPropertyName(e.target.value)}/>
                                </div>
                                
                                <div className="col-lg-6">
                                    <label>Property Desc</label>
                                    <input type="text" className="inp-contact" value={propertyDesc} onChange={(e) => setPropertyDesc(e.target.value)}/>
                                </div>
                                <div className="col-lg-6">
                                    <label>No. of Bedroom</label>
                                    <input type="text" className="inp-contact" value={bedroom} onChange={(e) => setBedroom(e.target.value)}/>
                                </div>
                                <div className="col-lg-6">
                                    <label>No. of Bathroom</label>
                                    <input type="text" className="inp-contact" value={bathroom} onChange={(e) => setBathroom(e.target.value)}/>
                                </div>
                                <div className="col-lg-6">
                                    <label>Listing Price (in ETH)</label>
                                    <input type="text" className="inp-contact" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)}/>
                                </div>
                                <div className="col-lg-6">
                                    <label>Escrow Amount (in ETH)</label>
                                    <input type="text" className="inp-contact" value={escrowAmount} onChange={(e) => setEscrowAmount(e.target.value)}/>
                                </div>
                                <div className="col-lg-12">
                                    <label>Show Your Property</label>
                                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
                                </div>
                                <div className="col-lg-12">
                                    <button className="btn-contact" onClick={ListProperty}>List Now</button>
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>
            </div>
        </section>
        

        
        
        
    )
}

export default FundReleaseList