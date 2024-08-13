async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);

  
    
    PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy();
    propertyNFTaddress = await propertyNFT.getAddress();
    
    console.log("PropertyNFT Contract deployed to:", propertyNFTaddress);

    Escrow = await ethers.getContractFactory("Escrow");


    escrow = await Escrow.connect(deployer).deploy(propertyNFTaddress); 
    escrowAddress = await escrow.getAddress();

    console.log("Escrow Contract deployed to:", escrowAddress);

    await propertyNFT.connect(deployer).mint("Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS","The Mansions","Wilayah Persekutuan Kuala Lumpur, Desa ParkCity, Kuala Lumpur","6084 sqft",7, 6,
      "Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS",
      "QmUZPwe4jfk9hbJpoohktKYcS4nrZw6yoCkArXcSt8eUE3",
      "QmS8dgSzsx1uFU4wTKwUkQz4L8jCgh5dXntP9ga5Y2ZWrk",
       );
      await propertyNFT.connect(deployer).mint("QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1","Summerwoods","Jade Hills, Kajang, Selangor","5013 sqft",5, 4,
      "QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1",
      "QmWJ7dmZAoikCJ8Wbr8DNvTV6PiLP3YnC1dKoe7Ng595hU",
      "QmNieH2EX2h1HGn8i3i2Tos3QmKjVXuXvNfWpzFW8LZtt8",
       );
      await propertyNFT.connect(deployer).mint("QmeEkawKksA1JMpDBytZ7yM5rJon6aUkMZ1B7cJ5Lod12a","Diamond City Mansions","Diamond City, Semenyih, Selangor","7084 sqft",9, 6,
      "QmeEkawKksA1JMpDBytZ7yM5rJon6aUkMZ1B7cJ5Lod12a",
      "QmYLuJBt8LQ5uwmCivUzYSpgFefwH61nyEw75xpNeutvSm",
      "QmUDnCwoaL3PyUDJm7JQVFkitY4q3HN13ecMzkz4J5KQgn",
       );
       await propertyNFT.connect(deployer).mint("Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS","The Starling Mansion","The Starling Mansion Street, Desa ParkCity, Kuala Lumpur","6084 sqft",7, 6,
        "Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS",
        "QmUZPwe4jfk9hbJpoohktKYcS4nrZw6yoCkArXcSt8eUE3",
        "QmS8dgSzsx1uFU4wTKwUkQz4L8jCgh5dXntP9ga5Y2ZWrk",
         );
         await propertyNFT.connect(deployer).mint("QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1","The Genting","The Genting Street, Kajang, Selangor","5013 sqft",5, 4,
          "QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1",
          "QmWJ7dmZAoikCJ8Wbr8DNvTV6PiLP3YnC1dKoe7Ng595hU",
          "QmNieH2EX2h1HGn8i3i2Tos3QmKjVXuXvNfWpzFW8LZtt8",
           );
       console.log("deployer mint NFT 1");
       console.log("deployer mint NFT 2");
       console.log("deployer mint NFT 3");
       console.log("deployer mint NFT 4");
       console.log("deployer mint NFT 5");
    
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  