const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Escrow", function () {
    let PropertyNFT;
    let propertyNFT;
    let Escrow;
    let escrow;
    let owner;
    let buyer;
    beforeEach(async function () {
        PropertyNFT = await ethers.getContractFactory("PropertyNFT");
        propertyNFT = await PropertyNFT.deploy();
        propertyNFTaddress = await propertyNFT.getAddress();
        console.log("Property Contract address:" + propertyNFTaddress);

        Escrow = await ethers.getContractFactory("Escrow");

        [contractOwner, owner, buyer] = await ethers.getSigners();
        escrow = await Escrow.connect(contractOwner).deploy(propertyNFTaddress); 
        escrowaddress = await escrow.getAddress();
        console.log("Escrow Contract address:" + escrowaddress);
        console.log("Contract Owner Address: " + contractOwner.address);

    });

/*     it("owner mint property", async function () {
        await propertyNFT.connect(owner).mint("example_token_uri");
        await propertyNFT.connect(owner).mint("example_token_uri");
        await propertyNFT.connect(owner).mint("example_token_uri");
        //expect(await propertyNFT.owner()).to.equal(owner.address);
        expect(await propertyNFT.totalSupply()).to.equal(3);
    });

     it("owner create escrow", async function () {
        await propertyNFT.connect(owner).mint("example_token_uri");
        await escrow.connect(owner).createEscrow(1,2);
        //expect(await propertyNFT.owner()).to.equal(owner.address);
        //expect(await propertyNFT.totalSupply()).to.equal(3);
        console.log("owner created escrow");
    }); 

    it("seller create escrow", async function () {
        await propertyNFT.connect(owner).mint("example_token_uri");   
        //var sendermsg = await propertyNFT.connect(owner).setApprovalForAll(owner, true);    
        //console.log("escrow.connect(owner): " + await escrow.connect(owner).getAddress());

        // approve escrow contract to transfer minted token
        await propertyNFT.connect(owner).approve(escrow.getAddress(), 1);
  
        await escrow.connect(owner).createEscrow(1,2);
    }); */


     it("Full Purchase", async function () {
        console.log("");
        console.log("Full Purchase");
        await getBalanceInEther("owner", owner.getAddress());
        await propertyNFT.connect(owner).mint("Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS","The Mansions","Wilayah Persekutuan Kuala Lumpur, Desa ParkCity, Kuala Lumpur","6084 sqft",7, 6,
        "Qmc4hkwb4eYZ488ZLZcELF6kyxCsWj3eneq7meCkrTWCeS",
        "QmUZPwe4jfk9hbJpoohktKYcS4nrZw6yoCkArXcSt8eUE3",
        "QmS8dgSzsx1uFU4wTKwUkQz4L8jCgh5dXntP9ga5Y2ZWrk",
         );

        const oldownerofProp = await propertyNFT.connect(owner).ownerOf(1);
        console.log("Old Owner:" + oldownerofProp);

        console.log("Mint NFT");
        await getBalanceInEther("owner", owner.getAddress());
        //var sendermsg = await propertyNFT.connect(owner).setApprovalForAll(owner, true);    
        //console.log("escrow.connect(owner): " + await escrow.connect(owner).getAddress());

        // approve escrow contract to transfer minted token
        await propertyNFT.connect(owner).approve(escrow.getAddress(), 1);
  
        await escrow.connect(owner).createEscrow(1,2);

        var deposit= ethers.parseEther("0.2")
        await escrow.connect(buyer).initiatePurchase(1,{
            value: deposit
        });
 

        await escrow.connect(owner).approvePurchase(1);

        var fullpayment= ethers.parseEther("1.8")
        await escrow.connect(buyer).completePurchase(1,{
            value: fullpayment
        });
        console.log("Complete purchase");
        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());
        await escrow.releaseFunding(1);
/* 
        await expect(escrow.releaseFunding(1))
            .to.emit(escrow, "Release Funding")
            .withArgs(escrowaddress, buyer.getAddress(), 1); */

        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());

        const ownerofProp = await propertyNFT.connect(owner).ownerOf(1);
        console.log("New Owner:" + ownerofProp);
    }); 
/*
    it("Buyer Cancel Purchase", async function () {
        console.log("");
        console.log("Buyer Cancel Purchase");
        await getBalanceInEther("owner", owner.getAddress());
        await propertyNFT.connect(owner).mint("example_token_uri");   
        console.log("Mint NFT");
        await getBalanceInEther("owner", owner.getAddress());
        //var sendermsg = await propertyNFT.connect(owner).setApprovalForAll(owner, true);    
        //console.log("escrow.connect(owner): " + await escrow.connect(owner).getAddress());

        // approve escrow contract to transfer minted token
        await propertyNFT.connect(owner).approve(escrow.getAddress(), 1);
  
        await escrow.connect(owner).createEscrow(1,2);

        var deposit= ethers.parseEther("0.2")
        await escrow.connect(buyer).initiatePurchase(1,{
            value: deposit
        });
 

        await escrow.connect(owner).approvePurchase(1);

        
        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());
        console.log("Cancel purchase");
        await escrow.connect(buyer).buyerCancelPurchase(1);

        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());

        await propertyNFT.connect(owner).ownerOf(1);
    }); 
 */
     /* it("Seller cancel listing", async function () {
        console.log("");
        console.log("Seller cancel listing");
        await getBalanceInEther("owner", owner.getAddress());
        await propertyNFT.connect(owner).mint("example_token_uri");   
        console.log("Mint NFT");
        await getBalanceInEther("owner", owner.getAddress());
        //var sendermsg = await propertyNFT.connect(owner).setApprovalForAll(owner, true);    
        //console.log("escrow.connect(owner): " + await escrow.connect(owner).getAddress());

        // approve escrow contract to transfer minted token
        await propertyNFT.connect(owner).approve(escrow.getAddress(), 1);
  
        await escrow.connect(owner).createEscrow(1,2);

        var deposit= ethers.parseEther("0.2")
        await escrow.connect(buyer).initiatePurchase(1,{
            value: deposit
        });
 

        await escrow.connect(owner).approvePurchase(1);

        var fullpayment= ethers.parseEther("1.8")
        await escrow.connect(buyer).completePurchase(1,{
            value: fullpayment
        });
        
        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());
        console.log("seller Cancel Listing");
        await escrow.connect(owner).sellerCancelListing(1);

        await getBalanceInEther("buyer", buyer.getAddress());
        await getBalanceInEther("owner", owner.getAddress());
        await getBalanceInEther("escrow", escrow.getAddress());

        await propertyNFT.connect(owner).ownerOf(1);
    });  
 */
    async function getBalanceInEther(who, address) {

        const balanceWei = await ethers.provider.getBalance(address);
        const balanceEther = ethers.formatEther(balanceWei);
        console.log(`Balance of ${who} ${address}: ${balanceEther} ETH`);
    }

});