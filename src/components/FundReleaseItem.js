import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import ConfirmDialog from './ConfirmDialog';
import escrowContractABI from "../contracts/escrow.json";
import propertyContractABI from "../contracts/property.json";

const FundReleaseItem = ({ slug, properties, escrow }) => {
    const escrowContractAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
    const propertyContractAddress = process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [accounts, setAccounts] = useState(null);
    const [escrowContractInstance, setEscrowContractInstance] = useState(null);
    const [propertyContractInstance, setPropertyContractInstance] = useState(null);

    const commission = Number(escrow.purchasePrice) * 0.02 / 1000000000000000000;
    const releaseToSeller = Number(escrow.purchasePrice) * 0.98 / 1000000000000000000;

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

    const promptConfirmation = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
        releaseFunding(escrow.propertyid);
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

    return (
        <div className="text-center col-lg-12 col-12 col-md-6 ">
            <div>
                <ConfirmDialog
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    onConfirm={handleConfirm}
                    escrow={escrow}
                    header="Fund Release"
                >
                    <p>Fund Release to Seller: <b>{releaseToSeller} ETH</b></p>
                <p>Property Gain Tax pay to government: <b>{commission} ETH</b></p>
                <p>Property Ownership will be transferred from Contract to: <b>{escrow.buyer}</b></p>
                    </ConfirmDialog>
            </div>
            {(properties !== undefined && properties != null) ? (
                <div className="prop-item">
                    <div className="prop-item-image">
                        <img className="img-fluid" src={"https://ipfs.io/ipfs/" + properties.imageUrls[0]} alt="flat" />
                    </div>
                    <div className="prop-item-description">
                        <div className="d-flex justify-content-between mb-3">
                            <span className="item-title">{properties.propertyName}</span>
                            <button className="btn btn-detail" onClick={promptConfirmation}>Fund Release</button>
                        </div>
                        <div style={{ minHeight: '60px', textAlign: 'left' }}>
                            <span >{properties.propertyDesc}</span>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">
                            <div>
                                <i className="fa fa-user-tie" style={{ marginRight: '5px' }}></i><span>Seller </span> <span style={{ marginLeft: '10px' }}>{escrow.seller}</span>
                            </div>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="fa fa-user" style={{ marginRight: '5px' }}></i><span>Buyer </span> <span style={{ marginLeft: '10px' }}>{escrow.buyer}</span>
                            </div>
                        </div>
                        <div className="item-icon d-flex alig-items-center justify-content-between">
                            <div>
                                <i className="fab fa-ethereum" style={{ marginRight: '5px' }}></i><span>Selling Price </span><span style={{ marginLeft: '10px' }}>{Number(escrow.purchasePrice) / 1000000000000000000} ETH</span>
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