
import axios from 'axios';
import { useState } from 'react';
import { LoadingBar } from './LoadingBar';
import { useEffect } from 'react';

const Listing = ({profileContract, account }) => {

    const [propertyName, setPropertyName] = useState("");
    const [propertyDesc, setPropertyDesc] = useState("1000 sqft");
    const [escrowAmount, setEscrowAmount] = useState("0.1");
    const [bedroom, setBedroom] = useState("3");
    const [bathroom, setBathroom] = useState("2");
    const [sellingPrice, setSellingPrice] = useState("2.0");
    const [isLoading, setIsLoading] = useState(false);
    const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3ZDZiMTcwMC0wNmI3LTRhMGQtOGE2MC1hMDEyNjA3OGU3Y2YiLCJlbWFpbCI6ImphY2t5X2xreEBob3RtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyZjk5ZGUwMWQ1Zjg4NTIxZGU3OCIsInNjb3BlZEtleVNlY3JldCI6ImY3OGMxOGFlM2E3ZGZhMTk3MmYyODExYjY0YTE4YWU1OWE0MjJmYjA1ODZjOTc4OTQxNzlmNGRmNjAyNmJkNmIiLCJpYXQiOjE3MTQ1NzAzNTN9.yeDxRe6iqrFMogCZw4eZZbfLHcsgHHbeEBEovSiSiH0";


      async function ListProperty(event) {
        event.preventDefault();
        try {
            setIsLoading(true);
            // Upload the image to Pinata
            const imageIpfsHash = await uploadImageToPinata();
            console.log('Image IPFS Hash:', imageIpfsHash);
    
            // Upload the metadata to Pinata
            const metadataIpfsHash = await uploadMetadataToPinata(imageIpfsHash);
            console.log('Metadata IPFS Hash:', metadataIpfsHash);
    
            // Now you have both the image and metadata uploaded to Pinata
            // You can store the IPFS hashes in your smart contract or wherever needed
            await mintProperty(metadataIpfsHash);
        } catch (error) {
            console.error('Error uploading image and metadata:', error);
        }
    }

      function uploadImageToPinata()
      {
        const formData = new FormData();
        var src = document.querySelector('input[type=file]').files[0];

        const pinataMetadata = JSON.stringify({
            name: propertyName,
            keyvalues: {
                propertyName: propertyName,
                propertyDesc: propertyDesc,
                escrowAmount: escrowAmount,
                sellingPrice: sellingPrice,
                bathroom:bathroom,
                bedroom:bedroom
            }                    
        });
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
     
        const form = new FormData();


            formData.append('file', src)
            formData.append('pinataOptions', pinataOptions);
            formData.append('pinataMetadata', pinataMetadata);

        const options = {
            method: 'POST',
            maxBodyLength: "Infinity",
            headers: {
              'Authorization': `Bearer ${JWT}`,
              //'Content-Type': 'multipart/form-data'
            },
            body: formData
            
          };

          
          if (src) {
            fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to pin file to IPFS');
                    }
                    
                    return response.json();
                })
                .catch(err => {console.error(err)
                    setIsLoading(false);
                }); // Log and handle errors
        }
          

      }

      function uploadMetadataToPinata(imageIpfsHash)
      {
        const propertyObject = {
            propertyName,
            propertyDesc,
            escrowAmount,
            bedroom,
            bathroom,
            sellingPrice,
            imageIpfsHash
          };
          const pinataOptions = {
            cidVersion: 0,
            }

        const options = {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${JWT}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "pinataOptions" : pinataOptions,
                "pinataMetadata" : {"name":propertyName + ".json"},
                "pinataContent" : JSON.stringify(propertyObject)
            })
            
          };
          
          fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
            .then(response => response.json())
            .then(response => {
                setIsLoading(false);
                const ipfsHash = response.IpfsHash; // Extract the IPFS hash from the response
                console.log("IPFS Hash:", ipfsHash); // Print the IPFS hash

                // Fetch the pinned JSON using the IPFS hash
                fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
                    .then(response => response.json())
                    .then(data => {return data}) // Print the pinned JSON
                    .catch(err => console.error("Error fetching pinned JSON:", err));
            })
            .catch(err => {console.error(err)
                setIsLoading(false);
            });
      }
    
      async function mintProperty (matadataipfsHash) {
        
    
        try {
            setIsLoading(true);
          // Use the setProfile() function in contract to create Profile with username and bio
          // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
          // CODE HERE 👇
          await profileContract.methods
            .mint(matadataipfsHash)
            .send({ from: account });
    
            setIsLoading(false);
        } catch (error) {
          console.error(error);
        } finally {
            setIsLoading(false);
        }
      };


    return (

            <section className="contact">
                {isLoading && <LoadingBar />}
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
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="contact-item">
                                        <i className="fas fa-envelope"></i>
                                        <h5>Mail</h5>
                                        <h6>info@info.com</h6>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="contact-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <h5>Address</h5>
                                        <h6>Lorem Ipsum</h6>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="contact-item">
                                        <i className="fas fa-phone-alt"></i>
                                        <h5>Phone</h5>
                                        <h6>00000000000</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="row mt-5">
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
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        

        
        
        
    )
}

export default Listing