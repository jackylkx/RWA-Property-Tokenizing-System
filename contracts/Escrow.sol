// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

interface IProperty {
    function transferFrom(
        address _from,
        address _to,
        uint256 _propertyid
    ) external;
    function ownerOf(
        uint256 _propertyid
    ) external returns (address);
    function approve(
        address _to,
        uint256 _tokenid
    ) external ;
}

contract Escrow {
        
    struct PropertyEscrow{
        uint256 propertyid;
        address seller;
        address buyer;
        bool approval;
        bool isListed;
        uint256 purchasePrice;
        uint256 deposit;
        uint8 fundStatus;  //0 = initial, 1 = deposit paid, 2 = sellerApproved, 3= full payment, 4 = fund release, 5 = listing cancelled
    }
    //map propertyid to escrow
    mapping(uint256 => PropertyEscrow) public propertyEscrow;
    //map propertyid to propertOwner address
    mapping(uint256 => address) public propertyOwner;

    IProperty propertyContract;
    address public contractOwner;

    uint256 constant DECIMALS = 18; // Number of decimal places for Ethereum
uint256 constant PRECISION = 10**DECIMALS;

    constructor(address _propertyContract) {
        contractOwner = msg.sender;
        propertyContract = IProperty(_propertyContract);
    } 

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner can call this method");
        _;
    }

    modifier onlyBuyer(uint256 _propertyid) {
        require(msg.sender == propertyEscrow[_propertyid].buyer, "Only buyer can call this method");
        _;
    }

    modifier onlySeller(uint256 _propertyid) {
        require(msg.sender == propertyEscrow[_propertyid].seller, "Only seller can call this method");
        _;
    }

    function createEscrow(uint256 _propertyid, uint256 _purchasePrice) payable public{
        require(propertyEscrow[_propertyid].isListed == false, "The Property already listed!");
        require(propertyContract.ownerOf(_propertyid) == msg.sender, "You are not the owner of the property");
        PropertyEscrow memory escrow = PropertyEscrow({
            propertyid : _propertyid,
            seller : msg.sender,
            buyer : address(0),
            approval : false,
            isListed : true,
            purchasePrice : _purchasePrice * PRECISION,
            deposit: _purchasePrice *10 * PRECISION /100,
            fundStatus : 0
        });
        propertyEscrow[_propertyid] = escrow;
        propertyOwner[_propertyid] = msg.sender;


        //transfer the property to this Escrow
        propertyContract.transferFrom(propertyContract.ownerOf(_propertyid), address(this), _propertyid);
    } 

    function initiatePurchase(uint256 _propertyid) payable public{
        require(propertyEscrow[_propertyid].isListed == true, "The Property is not listed!");
        require(propertyEscrow[_propertyid].buyer == address(0), "The Property already have buyer");
        string memory strdeposit = Strings.toString(propertyEscrow[_propertyid].deposit);
        require(propertyEscrow[_propertyid].deposit <= msg.value , string.concat("Buyer not enough money", strdeposit));

        
        // Transfer the deposit to the escrow
        //payable(address(this)).transfer(msg.value);

        propertyEscrow[_propertyid].buyer = msg.sender;
        propertyEscrow[_propertyid].fundStatus = 1; //deposit paid
    }

    function approvePurchase(uint256 _propertyid) public onlySeller(_propertyid){
        require(propertyEscrow[_propertyid].isListed == true, "The Property is not listed!");
        require(propertyEscrow[_propertyid].approval == false, "The Property purchase already approved");
        
        propertyEscrow[_propertyid].approval = true;
        propertyEscrow[_propertyid].fundStatus = 2; //sellerApproved
    }

    function completePurchase(uint256 _propertyid) external payable onlyBuyer(_propertyid){
        PropertyEscrow storage escrow = propertyEscrow[_propertyid];
        require(escrow.isListed == true, "The Property is not listed!");
        require(escrow.approval == true, "The Purchase not yet approved by the seller");
        string memory stroutstanding = Strings.toString(escrow.purchasePrice - escrow.deposit);
        require(escrow.purchasePrice - escrow.deposit <= msg.value ,string.concat("Buyer not enough money", stroutstanding) );

        escrow.fundStatus = 3; //full payment
        //buyer transfer 90% to the escrow
        //uint256 outstanding = escrow.purchasePrice - escrow.deposit;
        //payable(address(this)).transfer(outstanding);
    }

    function releaseFunding(uint256 _propertyid) external payable onlyContractOwner(){
        PropertyEscrow storage escrow = propertyEscrow[_propertyid];
        require(escrow.isListed == true, "The Property is not listed!");
        require(escrow.approval == true, "The Purchase not yet approved by the seller");

        //buyer transfer 90% to the escrow
        uint256 releaseFund = escrow.purchasePrice * 98 / 100;
        console.log(
        "releaseFund %d escrow.purchasePrice %d",
            releaseFund,
            escrow.purchasePrice
        ); 
        address payable payableseller = payable(escrow.seller);
        payableseller.transfer(releaseFund);
        escrow.isListed = false;
        escrow.approval == false;
        escrow.fundStatus = 4; //fund release

        propertyContract.transferFrom(address(this),escrow.buyer, _propertyid);

    }

    function buyerCancelPurchase(uint256 _propertyid) public payable onlyBuyer(_propertyid) returns (bool)
    {

        PropertyEscrow storage escrow = propertyEscrow[_propertyid];
        require(escrow.isListed == true, "The Property is not listed!");
        require(propertyEscrow[_propertyid].buyer != address(0) && msg.sender == propertyEscrow[_propertyid].buyer, "Only buyer can call this method");
        uint256 amount = propertyEscrow[_propertyid].deposit;
        require(address(this).balance * PRECISION > escrow.deposit, "Contract balance is zero");
        
        // Transfer ether back to the sender
        uint256 refundDeposit = amount;
        console.log(
        "refundDeposit %d deposit %d",
            refundDeposit,
            propertyEscrow[_propertyid].deposit
        ); 
        
        payable(msg.sender).transfer(refundDeposit);
        propertyEscrow[_propertyid].buyer = address(0);
        propertyEscrow[_propertyid].approval = false;
        escrow.fundStatus = 0; //revert to listing 
        return true;

    }

    function sellerCancelListing(uint256 _propertyid) public payable onlySeller(_propertyid) returns (bool)
    {
        PropertyEscrow storage escrow = propertyEscrow[_propertyid];
        require(escrow.isListed == true, "The Property is not listed!");
        // Transfer ether back to the sender
        
        if(escrow.buyer != address(0) && escrow.fundStatus == 1){
            require(address(this).balance * PRECISION > escrow.deposit, "Contract balance is zero");
            address payable payablebuyer = payable(escrow.buyer);
            payablebuyer.transfer(escrow.deposit);
            
        }else if(escrow.buyer != address(0) && escrow.fundStatus == 2){
            require(address(this).balance * PRECISION > escrow.purchasePrice, "Contract balance is zero");
            address payable payablebuyer = payable(escrow.buyer);
            payablebuyer.transfer(escrow.purchasePrice);
            
        }

        propertyContract.transferFrom(address(this),escrow.seller, _propertyid);
        escrow.isListed = false;
        escrow.approval = false;
        escrow.fundStatus = 5; //listing cancelled
        return true;

    }

    function checkEscrow(uint256 _propertyid) public view returns (PropertyEscrow memory)
    {
        PropertyEscrow storage escrow = propertyEscrow[_propertyid];

        return escrow;
    }




}