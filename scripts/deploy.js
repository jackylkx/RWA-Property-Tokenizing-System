const { ethers } = require("hardhat");

async function main() {
    PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy();
    propertyNFTaddress = await propertyNFT.getAddress();
    

    Escrow = await ethers.getContractFactory("Escrow");

    [contractOwner] = await ethers.getSigners();
    escrow = await Escrow.connect(contractOwner).deploy(propertyNFTaddress); 
    escrowAddress = await escrow.getAddress();

    console.log("Escrow Contract Owner:", contractOwner.getAddress());

    console.log("Property deployed to:", propertyNFTaddress);
    console.log("Escrow deployed to:", escrowAddress);

    [owner1, owner2, owner3 ,buyer] = await ethers.getSigners();

    await propertyNFT.connect(owner1).mint("Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS","The Mansions","Wilayah Persekutuan Kuala Lumpur, Desa ParkCity, Kuala Lumpur","6084 sqft",7, 6,
    "Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS",
    "QmUZPwe4jfk9hbJpoohktKYcS4nrZw6yoCkArXcSt8eUE3",
    "QmS8dgSzsx1uFU4wTKwUkQz4L8jCgh5dXntP9ga5Y2ZWrk",
     );
    await propertyNFT.connect(owner2).mint("QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1","Summerwoods","Jade Hills, Kajang, Selangor","5013 sqft",5, 4,
    "QmTCcMtAH2mYRJGZgT9uRHgLXF2EW1CiFHHqkp22CFWRm1",
    "QmWJ7dmZAoikCJ8Wbr8DNvTV6PiLP3YnC1dKoe7Ng595hU",
    "QmNieH2EX2h1HGn8i3i2Tos3QmKjVXuXvNfWpzFW8LZtt8",
     );
    await propertyNFT.connect(owner3).mint("QmeEkawKksA1JMpDBytZ7yM5rJon6aUkMZ1B7cJ5Lod12a","Diamond City Mansions","Diamond City, Semenyih, Selangor","7084 sqft",9, 6,
    "QmeEkawKksA1JMpDBytZ7yM5rJon6aUkMZ1B7cJ5Lod12a",
    "QmYLuJBt8LQ5uwmCivUzYSpgFefwH61nyEw75xpNeutvSm",
    "QmUDnCwoaL3PyUDJm7JQVFkitY4q3HN13ecMzkz4J5KQgn",
     );

/*     await propertyNFT.connect(owner1).approve(escrow.getAddress(), 1);
    await propertyNFT.connect(owner2).approve(escrow.getAddress(), 2);
    await propertyNFT.connect(owner3).approve(escrow.getAddress(), 3); */

/*     await escrow.connect(owner1).createEscrow(1,2);
    await escrow.connect(owner2).createEscrow(2,3);
    await escrow.connect(owner3).createEscrow(3,5); */

    console.log("owner1:", owner1.getAddress());
    console.log("owner2:", owner2.getAddress());
    console.log("owner3:", owner3.getAddress());

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });