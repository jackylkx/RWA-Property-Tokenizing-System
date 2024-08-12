import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { Dialog } from 'primereact/dialog';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";
import { updateProperty,getPropertiesByRefundStatus} from '../api/property_api';
import { switchToNetwork } from './base';

const FundReleaseItem = ({ slug, property,setProperties }) => {

    var PRECISION = 1000000000000000000;

    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
    const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [accounts, setAccounts] = useState(null);
    const [escrowContractInstance, setEscrowContractInstance] = useState(null);
    const [propertyContractInstance, setPropertyContractInstance] = useState(null);


    const [visible, setVisible] = useState(null);
    const [buttonAction, setButtonAction] = useState(null);


    useEffect(() => {
        
        
        const tempWeb3 = new Web3(window.ethereum);
        if (!escrowContractInstance ) {           

            setEscrowContractInstance(new tempWeb3.eth.Contract(
                escrowContractABI,
                escrowContractAddress,
            ));
        }
        else if(!propertyContractInstance)
            {
                setPropertyContractInstance(new tempWeb3.eth.Contract(
                    propertyContractABI,
                    propertyContractAddress,
                ));
            }
        else {

   
        }

    }, [escrowContractInstance, propertyContractInstance]);

    useEffect(() => {
        
        const fetchProperties = async () => {
            try {
                const data = await getPropertiesByRefundStatus();
                    console.log(data);
                    setProperties(data);
            } catch (err) {
                console.error('Error:', err);
            }
        };
        
        if(buttonAction=="success fund release" && visible==false) //mean user close the success release refund dialogbox, proceed to refresh list
        {
            fetchProperties();
        }
        
    }, [visible]);

    const releaseFunding = async (propertyId) => {


        try {
             var account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = account[0];

            const networkId = await window.ethereum.request({ method: 'net_version' });
                
                if (networkId !== process.env.REACT_APP_CHAIN_ID) {
                    //Network ID for Sepolia
                    await switchToNetwork();
                    }


            const gasEstimate = await escrowContractInstance.methods.releaseFunding(propertyId).estimateGas({
                from: account,
            });

            const tx = await escrowContractInstance.methods.releaseFunding(propertyId).send({
                from: account,
                gas: gasEstimate
            });
            console.log('Transaction sent:', tx); 

            if (tx != null) {
                const data = {
                    isListed: false,
                    fundStatus: 4,
                    approval: false,
                    seller: property.buyer,
                    buyer: "",
                  };

                const returndata = await updateProperty(propertyId, data);
                if (returndata != null && returndata.propertyid == propertyId) {
                    

                    setVisible(true);
                    setButtonAction("success fund release");
                    renderDialogContent();

                    
                }
            }
        } catch (error) {
            console.error('Error create properties', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const renderDialogContent = () => {
        if (buttonAction === "fund release") {
            return (
                <div>
                    <div className="row">
                        <div className="col-6">
                            <p className="mb-0"><b>Property Name</b></p>
                        </div>
                        <div className="col-6">
                            <p className="mb-0">{property.propertyName}</p>
                        </div>
                    </div>                 
                    <div className="row">
                        <div className="col-6">
                            <p className="mb-0"><b>Property Price</b></p>
                        </div>
                        <div className="col-6">
                            <p className="mb-0">{Number(property.purchasePrice) / PRECISION} ETH</p>
                        </div>
                    </div>
                    <br></br>
                    <p>Fund Release to Seller: <b>{Number(property.purchasePrice) * 0.98 / PRECISION} ETH</b></p>
                <p>Property Gain Tax received by state government: <b>{Number(property.purchasePrice) * 0.02 / PRECISION} ETH</b></p>
                <p>Property Ownership will be transferred from Contract to: <b>{property.buyer}</b></p>

                    <br></br>
                    <button className="btn btn-subscribe" onClick={() => releaseFunding(property.propertyid)}>
                        <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Fund Release
                    </button>
                </div>
            );
        } else if (buttonAction === "success fund release") {
            return (<span>Fund is released to seller, property ownership is transferred to buyer</span>);
        }
       else {
            return <span></span>;
        }
    };

    return (
        <div className="text-center col-lg-12 col-12 col-md-6 ">
            <div>

                    <Dialog header={buttonAction ? buttonAction.toUpperCase() : ''} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                        {renderDialogContent()}                       
                        
                    </Dialog>
            </div>
            {(property !== undefined && property != null) ? (
                <div className="prop-item">
                    <div className="prop-item-image">
                        <img className="img-fluid" src={"https://ipfs.io/ipfs/" + property.imageUrls[0]} alt="flat" />
                    </div>
                    <div className="prop-item-description">
                        <div className="d-flex justify-content-between mb-3">
                            <span className="item-title">{property.propertyName}</span>
                            {/* <button className="btn btn-detail" onClick={promptConfirmation}>Fund Release</button> */}
                            <button className="btn btn-detail" onClick={() => {setVisible(true); setButtonAction("fund release")}}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Fund Release
                                                                </button>
                        </div>
                        <div style={{ minHeight: '60px', textAlign: 'left' }}>
                            <span >{property.propertyDesc}</span>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">
                            <div>
                                <i className="fa fa-user-tie" style={{ marginRight: '5px' }}></i><span>Seller </span> <span style={{ marginLeft: '10px' }}>{property.seller}</span>
                            </div>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="fa fa-user" style={{ marginRight: '5px' }}></i><span>Buyer </span> <span style={{ marginLeft: '10px' }}>{property.buyer}</span>
                            </div>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">
                            <div>
                                <i className="fab fa-ethereum" style={{ marginRight: '5px' }}></i><span>Selling Price </span><span style={{ marginLeft: '10px' }}>{Number(property.purchasePrice) / PRECISION} ETH</span>
                            </div>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">

                        </div>
                    </div>
                </div>) : (<div>Loading properties...</div>)}
        </div>
    )
}

export default FundReleaseItem