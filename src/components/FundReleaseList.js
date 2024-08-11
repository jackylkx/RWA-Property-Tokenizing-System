
import axios from 'axios';
import { useState } from 'react';
import Web3 from "web3";
import { LoadingBar } from './LoadingBar';
import { useEffect } from 'react';
import FundReleaseItem from './FundReleaseItem';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";
import { getPropertiesByRefundStatus} from '../api/property_api';


const FundReleaseList = () => {
    const [properties, setProperties] = useState(null);
    const [escrow, setEscrow] = useState([]);
    const [accounts, setAccounts] = useState(null);
    var escrowContractInstance = "";
    var propertyContractInstance = "";
    
    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;

useEffect(() => {

    const fetchProperties = async () => {
        try {
          console.log(accounts);
            const data = await getPropertiesByRefundStatus();
            console.log(data);
            setProperties(data);
        } catch (err) {
            //setError(err);
            console.error('Error:', err);
        }
    };

    if (properties == null || properties == undefined) {
        fetchProperties();
    }

  }, [properties]);

        
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
                        {(properties !== null && properties.length >0)?  (
                            <div>
                            {properties.map((property, index) => (
                                <div className="row" key={property.propertyid}>
                                <FundReleaseItem slug={`property-${property.propertyid}`} property={property} setProperties={setProperties}/>
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