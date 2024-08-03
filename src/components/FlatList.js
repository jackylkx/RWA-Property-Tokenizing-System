
import Title from "./Title"
import FlatItem from "./FlatItem"
import { useEffect, useState } from "react";
import { getAllProperty, getAllPropertyByListing, addProperty } from '../api/property_api';

const FlatList = ({propertyContract, account}) => {
    const title = {
        text: "Residential Properties",
        description: "Housing Listing"
    }

    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [propertiesHash, setPropertiesHash] = useState([]);

    useEffect(() => {
/*         if(propertyContract != undefined){
            if(properties.length == 0)
                {
                    getAllProperty (propertyContract);
                }
            
        } */

                const fetchProperties = async () => {
                    try {
                        const data = await getAllPropertyByListing();
                        setProperties(data);
                    } catch (err) {
                        //setError(err);
                        console.error('Error:', err);
                    }
                };
       if(properties.length == 0){


        fetchProperties();
       }
                
      }, [properties]);

      async function getPropertiesByLiting() {
        try {
            const response = await fetch(`/api/properties/`);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    }
      
      async function getAllProperty (propertyContract) {
        
    
        try {
          // Use the setProfile() function in contract to create Profile with username and bio
          // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
          // CODE HERE 👇
          //var totalsupply = await propertyContract.methods.totalSupply().call();
    
            for (let i = 1; i < 4; i++) {
                await (async () => {
                    const ipfshash = await propertyContract.methods.getProperty(i).call();
                    propertiesHash.push(ipfshash);
                })();
            }
            setProperties(propertiesHash);
    
           /*  propertiesHash.forEach(function(val, index){
                const propertyObject = {
                    propertyId: val.propertyId,
                    propertyName: val.propertyName,
                    propertyDesc: val.propertyDesc,
                    size: val.size,
                    bedroom: val.bedroom,
                    bathroom: val.bathroom,
                    imageUrls: val.imageUrls
                };
                setProperties([...properties, propertyObject]);
            }); */
    
    
        } catch (error) {
          console.error(error);
        } finally {
        }
      };


/* 
      async function getAllProperty (propertyContract) {
        
    
        try {
          // Use the setProfile() function in contract to create Profile with username and bio
          // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
          // CODE HERE 👇
          //var totalsupply = await propertyContract.methods.totalSupply().call();
    
            for (let i = 1; i < 4; i++) {
                await (async () => {
                    const ipfshash = await propertyContract.methods.tokenURI(i).call();
                    propertiesHash.push(ipfshash);
                })();
            }
    
            const parsedDataArray = [];

            propertiesHash.forEach(function(val, index){
                fetch(`${val}`)
                .then(response => response.json())
                .then(data => {
                    const parsedData = JSON.parse(data); 
                    parsedDataArray.push(parsedData); // Collect parsed data in the array
                    console.log(parsedData);
                }) // Print the pinned JSON
                .catch(err => console.error("Error fetching pinned JSON:", err))
                .finally(() => {
                    // Update the properties state after the loop completes
                    if(parsedDataArray.length == 3)
                    setProperties(parsedDataArray);
                });
            });
    
    
        } catch (error) {
          console.error(error);
        } finally {
        }
      };
 */
    return (
        <section className="section-all-re">
            <div className="container">
                <Title title={title.text} description={title.description} />
                
                {(properties !== undefined && properties.length >0)  ?  (
                <div className="row">
            
                    <FlatItem slug="lorem-ipsum-1" properties={properties[0]} account={account} />
                    <FlatItem slug="lorem-ipsum-2" properties={properties[1]} account={account} />
                    <FlatItem slug="lorem-ipsum-3" properties={properties[2]} account={account} />
                    <label text={properties[0]}></label>
                
                    
                    </div>):(<div>Loading properties...</div>)}
            </div>
        </section>
    )

}

export default FlatList;