import { Link } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from 'ethers';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";
import { listProperty, getAllPropertyById } from '../api/property_api';

const MyPropertiesItem = ({ slug, selectedproperty, account }) => {
    const PRECISION = 1000000000000000000;
    const [visible, setVisible] = useState(null);
    const [buttonAction, setButtonAction] = useState(null);

    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
    const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;

    const [sellingPrice, setSellingPrice] = useState(null);
    const [property, setProperty] = useState(null);
    const [escrowContractInstance, setEscrowContractInstance] = useState(null);
    const [propertyContractInstance, setPropertyContractInstance] = useState(null);

    useEffect(() => {
        setProperty(selectedproperty);
    }, []);



    const createEscrow = async (id) => {

        if(sellingPrice == "" || sellingPrice == null){
            alert(
                "Please enter selling price"
            );
        }
        //fnConnectWallet();
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                account = accounts[0];
                const tempWeb3 = new Web3(window.ethereum);

                var propertyContractInstance = new tempWeb3.eth.Contract(
                    propertyContractABI,
                    propertyContractAddress,
                );

                var escrowContractInstance = new tempWeb3.eth.Contract(
                    escrowContractABI,
                    escrowContractAddress,
                );

                // Call the function received from the parent component
                const propertyId = id;
                console.log('propertyId:', propertyId);
                const amountInEther = parseFloat(sellingPrice) * PRECISION; // For example, 0.1 ether
                console.log('amountInEther:', amountInEther);
                const amountInWei = ethers.parseEther(amountInEther.toString());
                try {

                    console.log('account:', account);

                    const networkId = await tempWeb3.eth.net.getId();
                    console.log('Network ID:', networkId);

                    const balance = await tempWeb3.eth.getBalance(account);
                    console.log('account balance:', tempWeb3.utils.fromWei(balance, 'ether'), 'ETH');

                    const ownerOf = await propertyContractInstance.methods.ownerOf(propertyId).call();
                    console.log('ownerOf Property:', ownerOf);

                    const owner = await escrowContractInstance.methods.contractOwner().call();
                    console.log('owner:', owner);

                    console.log('escrowContractInstance._address:', process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS);
                    const gasEstimateProperty = await propertyContractInstance.methods.approve(process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS, propertyId).estimateGas({
                        from: account,

                    });
                    console.log('gasEstimateProperty:', gasEstimateProperty);
                    const txProperty = await propertyContractInstance.methods.approve(process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS, propertyId).send({
                        from: account,
                        gas: gasEstimateProperty
                    });
                    console.log('txProperty:', txProperty);



                    const gasEstimate = await escrowContractInstance.methods.createEscrow(propertyId, sellingPrice).estimateGas({
                        from: account,
                        value: amountInWei.toString()

                    });
                    console.log('gasEstimate:', gasEstimate);
                    const tx = await escrowContractInstance.methods.createEscrow(propertyId, sellingPrice).send({
                        from: account,
                        gas: gasEstimate
                    });
                    console.log('Transaction sent:', tx);

                    if (tx != null) {
                        const data = await listProperty(propertyId, sellingPrice * PRECISION, sellingPrice * 10 / 100 * PRECISION);
                        if (data != null && data.propertyid == propertyId) {
                            setVisible(true);
                            setButtonAction("create escrow success");
                            renderDialogContent();
                            setProperty(data);
                        }
                    }

                } catch (error) {
                    console.error('Error create Escrow', error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message);
                    if (error.message.includes('gas')) {
                        alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
                    } else {
                        alert('An error occurred: ' + (error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("No web3 provider detected");
        }


    };

    const renderDialogContent = () => {
        if (buttonAction === "create escrow") {
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
                            <p className="mb-0"><b>Selling Price</b></p>
                        </div>
                        <div className="col-6">
                            <p className="mb-0"><input
                                type="text"
                                value={sellingPrice || ""}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                required
                                className="profile-input"
                            /> ETH</p>
                        </div>
                    </div>

                    <br></br>
                    <p className="m-0"><i className="fa fa-exclamation-triangle" style={{ color: 'red' }}></i> Once confirm listing, your property will be transfer to the Smart Contract</p>

                    <br></br>
                    <button className="btn btn-subscribe" onClick={() => createEscrow(property.propertyid)}>
                        <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Confirm to List
                    </button>
                </div>
            );
        } else if (buttonAction === "create escrow success") {
            return (<span>You have listed the property successfully</span>);
        }
        else {
            return <span></span>;
        }
    };


    return (
        <div className="text-center col-lg-12 col-12 col-md-6 ">
            {(property !== undefined && property != null) ? (
                <div className="prop-item">
                    <Dialog header={buttonAction ? buttonAction.toUpperCase() : ''} visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                        {renderDialogContent()}

                    </Dialog>
                    <div className="prop-item-image">
                        <img className="img-fluid" src={"https://ipfs.io/ipfs/" + property.imageUrls[0]} alt="flat" />
                    </div>
                    <div className="prop-item-description">
                        <div className="d-flex justify-content-between mb-3">
                            <span className="item-title">{property.propertyName}</span>
                            {/* <span className="item-price"><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> {Number(property.purchasePrice) / 1000000000000000000}</span>*/}
                        </div>
                        <div style={{ minHeight: '60px', textAlign: 'left' }}>
                            <span >{property.propertyDesc}</span>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">
                            <div>
                                <i className="fas fa-bed"></i> <span style={{ marginLeft: '10px' }}>{Number(property.bedroom)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="fas fa-bath"></i> <span style={{ marginLeft: '10px' }}>{Number(property.bathroom)}</span>
                            </div>
                            {/* <Link to={{
                                pathname: `/flat/${slug}`,
                                state: { property: property }
                            }} 
                            className="item-title" >
                                {
                                    Number(property.fundStatus) == 0 ? //full deposit
                                    (<button className="btn btn-detail"  onClick={() => {setVisible(true); setButtonAction("create escrow")}}>List My Property</button>):
                                    (<button className="btn btn-detail">View</button>)
                                }                            
                        </Link> */}
                            {property.isListed == false ? //full deposit
                                (<button className="btn btn-detail" onClick={() => { setVisible(true); setButtonAction("create escrow") }}>List My Property</button>) :
                                (<button className="btn btn-detail" disabled>Property is listed</button>)
                            }
                        </div>
                    </div>
                </div>) : (<div>Loading property...</div>)}
        </div>
    )
}

export default MyPropertiesItem