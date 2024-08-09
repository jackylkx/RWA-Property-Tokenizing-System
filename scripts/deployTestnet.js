async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());
  
    const MyContract = await ethers.getContractFactory("Certificate");
    const myContract = await MyContract.deploy();
  
    
    PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy();
    propertyNFTaddress = await propertyNFT.getAddress();
    
    console.log("PropertyNFT Contract deployed to:", propertyNFTaddress);

    Escrow = await ethers.getContractFactory("Escrow");

    [contractOwner] = await ethers.getSigners();
    escrow = await Escrow.connect(contractOwner).deploy(propertyNFTaddress); 
    escrowAddress = await escrow.getAddress();

    console.log("Escrow Contract deployed to:", escrowAddress);
    
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  