import React from "react";
import { ethers } from 'ethers';
import ImageGallery from 'react-image-gallery';
import ErrorDialog from './ErrorDialog';
import { useEffect, useState } from "react";
import Web3 from "web3";
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";
import { Link, useLocation } from 'react-router-dom';

const FlatDetail = (props) => {
    let stateData = props.location.state
    var account = stateData["account"]
    var properties = stateData['properties']

    var sellingPrice = 0;


    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
    const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;
    const images = [
        {
            original: "https://ipfs.io/ipfs/" + properties.imageUrls[0],
            thumbnail: "https://ipfs.io/ipfs/" + properties.imageUrls[0],
        },
        {
            original: "https://ipfs.io/ipfs/" + properties.imageUrls[1],
            thumbnail: "https://ipfs.io/ipfs/" + properties.imageUrls[1],
        },
        {
            original: "https://ipfs.io/ipfs/" + properties.imageUrls[2],
            thumbnail: "https://ipfs.io/ipfs/" + properties.imageUrls[2],
        },
    ];

    const [escrowContractInstance, setEscrowContractInstance] = useState(null);
    const [propertyContractInstance, setPropertyContractInstance] = useState(null);

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [escrow, setEscrow] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [escrowContractOwner, setEscrowContractOwner] = useState(null);

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
            if (escrow == undefined) {
                checkEscrow(Number(properties.propertyid));
            }


            async function getEscrowContractOwner() {
                const escrowContractOwner = await escrowContractInstance.methods.contractOwner().call();
                console.log('escrowContractOwner:', escrowContractOwner);
                setEscrowContractOwner(escrowContractOwner);
            }

            getEscrowContractOwner();

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
        }

    }, [escrowContractInstance, propertyContractInstance]);

    const promptConfirmation = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = (e) => {
        setIsModalOpen(false);
        releaseFunding(escrow.propertyid);
    };


    const initialPurchase = async (propertyId) => {
        propertyId = Number(propertyId);

        // Call the function received from the parent component

        const amountInWei = Number(escrow.purchasePrice) * 0.1; // For example, 0.1 ether
        //const amountInWei = ethers.parseEther(amountInEther.toString());
        try {
            /*             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        console.log('accounts:', accounts[0]);
            
                        const networkId = await tempWeb3.eth.net.getId();
                        console.log('Network ID:', networkId);
            
                        const balance = await tempWeb3.eth.getBalance(accounts[0]);
                        console.log('Account balance:', tempWeb3.utils.fromWei(balance, 'ether'), 'ETH');
            
                         */

            const gasEstimate = await escrowContractInstance.methods.initiatePurchase(propertyId).estimateGas({
                from: accounts,
                value: amountInWei.toString()

            });

            const tx = await escrowContractInstance.methods.initiatePurchase(propertyId).send({
                from: accounts,
                value: amountInWei.toString(),
                gas: gasEstimate
            });
            checkEscrow(propertyId);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error initiating purchase:', error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message);
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message));
            }
        }

    };

    const createEscrow = async (id, price) => {
        const tempWeb3 = new Web3(window.ethereum);

        propertyContractInstance = new tempWeb3.eth.Contract(
            propertyContractABI,
            propertyContractAddress,
        );

        escrowContractInstance = new tempWeb3.eth.Contract(
            escrowContractABI,
            escrowContractAddress,
        );

        // Call the function received from the parent component
        const propertyId = 1;
        const amountInEther = "2.0"; // For example, 0.1 ether
        const amountInWei = ethers.parseEther(amountInEther);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('accounts:', accounts[0]);

            const networkId = await tempWeb3.eth.net.getId();
            console.log('Network ID:', networkId);

            const balance = await tempWeb3.eth.getBalance(accounts[0]);
            console.log('Account balance:', tempWeb3.utils.fromWei(balance, 'ether'), 'ETH');

            const owner = await escrowContractInstance.methods.contractOwner().call();
            console.log('owner:', owner);

            const gasEstimateProperty = await propertyContractInstance.methods.approve(escrowContractInstance._address, propertyId).estimateGas({
                from: accounts[0],

            });

            const txProperty = await propertyContractInstance.methods.approve(escrowContractInstance._address, propertyId).send({
                from: accounts[0],
            });



            const gasEstimate = await escrowContractInstance.methods.createEscrow(propertyId, 2).estimateGas({
                from: accounts[0],
                value: amountInWei.toString()

            });

            const tx = await escrowContractInstance.methods.createEscrow(propertyId, 2).send({
                from: accounts[0],
                gas: gasEstimate
            });
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message);
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? (error.data != undefined ? error.data.message : error.message) : error.message));
            }
        }

    };

    const approvePurchase = async (propertyId) => {
        propertyId = Number(propertyId);

        try {

            const gasEstimate = await escrowContractInstance.methods.approvePurchase(propertyId).estimateGas({
                from: accounts,
            });

            const tx = await escrowContractInstance.methods.approvePurchase(propertyId).send({
                from: accounts,
                gas: gasEstimate
            });
            checkEscrow(propertyId);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const completePurchase = async (propertyId) => {
        propertyId = Number(propertyId);

        const amountInWei = Number(escrow.purchasePrice) * 0.9; // For example, 0.1 ether
        //const amountInWei = ethers.parseEther(amountInEther);
        try {


            const gasEstimate = await escrowContractInstance.methods.completePurchase(propertyId).estimateGas({
                from: accounts,
                value: amountInWei.toString()

            });

            const tx = await escrowContractInstance.methods.completePurchase(propertyId).send({
                from: accounts,
                value: amountInWei.toString(),
                gas: gasEstimate
            });
            checkEscrow(propertyId);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const releaseFunding = async (propertyId) => {
        propertyId = Number(propertyId);

        try {

            const gasEstimate = await escrowContractInstance.methods.releaseFunding(propertyId).estimateGas({
                from: accounts,
            });

            const tx = await escrowContractInstance.methods.releaseFunding(propertyId).send({
                from: accounts,
                gas: gasEstimate
            });
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const buyerCancelPurchase = async (propertyId) => {
        propertyId = Number(propertyId);


        try {
            const gasEstimate = await escrowContractInstance.methods.buyerCancelPurchase(propertyId).estimateGas({
                from: accounts,
            });

            const tx = await escrowContractInstance.methods.buyerCancelPurchase(propertyId).send({
                from: accounts,
                gas: gasEstimate
            });
            checkEscrow(propertyId);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const sellerCancelListing = async (propertyId) => {
        propertyId = Number(propertyId);


        try {

            const gasEstimate = await escrowContractInstance.methods.sellerCancelListing(propertyId).estimateGas({
                from: accounts,
            });

            const tx = await escrowContractInstance.methods.sellerCancelListing(propertyId).send({
                from: accounts,
                gas: gasEstimate
            });
            checkEscrow(propertyId);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const checkEscrow = async (propertyId) => {

        try {

            const propertyOwner = await propertyContractInstance.methods.ownerOf(propertyId).call();
            console.log('propertyOwner:', propertyOwner);

            const escrowreturn = await escrowContractInstance.methods.checkEscrow(propertyId).call();
            console.log('escrow:', escrow);

            setEscrow(escrowreturn);


        } catch (error) {
            console.error('Error create Escrow', (error.data != undefined ? error.data.message : error.message));
            if (error.message.includes('gas')) {
                alert('Failed to estimate gas. There might be an error in the contract, and this transaction may fail.');
            } else {
                alert('An error occurred: ' + (error.data != undefined ? error.data.message : error.message));
            }
        }

    };

    const handleAccountChange = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts[0]);
        console.log("Current account:", accounts[0]);
        checkEscrow(properties.propertyid);
    };

    return (
        <div>
            {(escrow !== undefined && escrow != null) && (accounts != null) && (escrowContractOwner != "") ? (
                <div className="flat-detail">
                    <ErrorDialog
                        show={showErrorDialog}
                        errorMessage={errorMessage}
                    />
            
                <ConfirmDialog
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    onConfirm={handleConfirm}
                    header={header}>
                        {content}
                    </ConfirmDialog>
   

                    <div className="page-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h1 className="page-title">DETAIL</h1>
                                    <h2 className="page-description">{properties.propertyName}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-5 mb-5">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="fd-top flat-detail-content">
                                    <div>
                                        <h3 className="flat-detail-title">{properties.propertyName}</h3>
                                        <p className="fd-address"> <i className="fas fa-map-marker-alt"></i>
                                            {properties.propertyDesc}</p>
                                    </div>
                                    <div>
                                        <span className="fd-price"><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> {Number(escrow.purchasePrice) / 1000000000000000000}</span>
                                    </div>
                                </div>
                                <ImageGallery flickThreshold={0.50} slideDuration={0} items={images} showNav={false} showFullscreenButton={false} showPlayButton={false} />
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="fd-item">
                                            <h4>Description</h4>
                                            <p>Discover the grandeur of a luxurious mansion nestled in the heart of {properties.propertyName}, where sophistication meets tranquility. This sprawling estate boasts exquisite architectural design, lavish interiors, and lush landscaped gardens, creating an idyllic retreat amidst the vibrant cityscape. With spacious living areas, opulent amenities, and panoramic views, this mansion offers the epitome of upscale living in {properties.propertyName}.</p>
                                            {
                                                (() => {
                                                    const seller = escrow.seller.toLowerCase();
                                                    const buyer = escrow.buyer.toLowerCase();
                                                    const account = accounts.toLowerCase();
                                                    const _escrowContractOwner = escrowContractOwner.toLowerCase();
                                                    const fundStatus = Number(escrow.fundStatus);

                                                    //0 = initial, 1 = deposit paid, 2 = sellerApproved, 3= full payment, 4 = fund release, 5 = listing cancelled
                                                    if (fundStatus === 0) {
                                                        if (seller == account) {
                                                            return (
                                                                <span>You have listed your property</span>
                                                            );
                                                        } else if (buyer == "0x0000000000000000000000000000000000000000") {
                                                            return (
                                                                <button className="btn btn-subscribe" onClick={() => initialPurchase(escrow.propertyid)}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Purchase Property
                                                                </button>
                                                            );
                                                        }
                                                    } else if (fundStatus === 1) { //pending approval

                                                        if (buyer == account) {
                                                            return (
                                                                <span>Pending Approval From Seller</span>
                                                            );
                                                        } else if (seller == account) {
                                                            return (
                                                                <button className="btn btn-subscribe" onClick={() => approvePurchase(escrow.propertyid)}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Approve Purchase
                                                                </button>
                                                            );
                                                        } else {
                                                            return (
                                                                <span>The Property is reserved by other buyer</span>
                                                            );
                                                        }
                                                    } else if (fundStatus === 2) { //2 = sellerApproved
                                                        if (buyer == account) {
                                                            return (
                                                                <button className="btn btn-subscribe" onClick={() => completePurchase(escrow.propertyid)}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Complete Purchase
                                                                </button>
                                                            );

                                                        } else if (seller == account) {
                                                            return (
                                                                <span>Pending full deposit from buyer</span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span>The Property is reserved by other buyer</span>
                                                            );
                                                        }

                                                    } else if (fundStatus === 3) { //3= full payment


                                                        if (buyer == account) {
                                                            return (
                                                                <button className="btn btn-subscribe" disabled={true}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Pending Release Fund by Contract Owner
                                                                </button>
                                                            );

                                                        } else if (seller == account) {
                                                            return (
                                                                <button className="btn btn-subscribe" disabled={true}>
                                                                    <i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> Pending Release Fund by Contract Owner
                                                                </button>
                                                            );
                                                        } else {
                                                            return (
                                                                <span>The Property is reserved by other buyer</span>
                                                            );
                                                        }
                                                    } else {
                                                        return <span></span>;
                                                    }
                                                })()
                                            }

                                            {/*                                     <button className="btn btn-subscribe" onClick={() => createEscrow(escrow.propertyId,2.0)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> List Property</button>
                                    
                                    <button className="btn btn-subscribe" onClick={() => approvePurchase(escrow.propertyId)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> approvePurchase</button>
                                    
                                    <button className="btn btn-subscribe" onClick={() => releaseFunding(escrow.propertyId)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> releaseFunding</button>
                                    <button className="btn btn-subscribe" onClick={() => buyerCancelPurchase(escrow.propertyId)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> buyerCancelPurchase</button>
                                    <button className="btn btn-subscribe" onClick={() => sellerCancelListing(escrow.propertyId)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> sellerCancelListing</button>
                                    <button className="btn btn-subscribe" onClick={() => checkEscrow(escrow.propertyId)}><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i> checkEscrow</button>

 */}
                                        </div>
                                        <div className="fd-item fd-property-detail">
                                            <h4>Property Details</h4>
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <i className="fas fa-bed"></i> <span> Bedroom: </span>
                                                    <span>{Number(properties.bedroom)}</span>
                                                </div>
                                                <div className="col-lg-4">
                                                    <i className="fas fa-bath"></i><span> Bathroom: </span>
                                                    <span>{Number(properties.bathroom)}</span>
                                                </div>
                                                <div className="col-lg-4">
                                                    <i className="fas fa-utensils"></i><span> Kitchen:  </span>
                                                    <span>2</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="fd-item">
                                            <h4>Maps</h4>

                                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4737.390425889979!2d101.63067475421606!3d3.1852059285918206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc48a5d32f5fb7%3A0x1fbfb9bf04283220!2sDesa%20Parkcity%2C%2052200%20Kuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1717857304167!5m2!1sen!2smy" width="100%" height="450" loading="lazy"></iframe>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<div>Loading escrow...</div>)}

        </div>
    )
}

export default FlatDetail