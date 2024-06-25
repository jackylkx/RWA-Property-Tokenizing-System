// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract PropertyNFT is ERC721URIStorage{
    uint256 private _tokenIds = 0;
    address public owner;
    mapping(uint256 => Property) public properties; //map property id to Property
    struct Property{
        uint256 propertyid;
        string propertyName;
        string propertyDesc;
        string size;
        uint64 bedroom;
        uint64 bathroom;
        string[] imageUrls;
    }
    

    constructor(        
    ) ERC721("Property", "PROP") {
        owner = msg.sender;
    }
    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }
    
    function mint(string memory tokenURI, string memory _propertyName, string memory _propertyDesc,string memory _size,uint64 _bedroom,uint64 _bathroom,
    string memory _imageUrls1,
    string memory _imageUrls2,
    string memory _imageUrls3) public returns (uint256) {

        _tokenIds++;

        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        // Create dynamic array for image URLs
        string[] memory imageUrls = new string[](3);
        imageUrls[0] = _imageUrls1;
        imageUrls[1] = _imageUrls2;
        imageUrls[2] = _imageUrls3;

        properties[newItemId] = Property({
            propertyid: _tokenIds,
            propertyName: _propertyName,
            propertyDesc: _propertyDesc,
            size: _size,
            bedroom: _bedroom,
            bathroom: _bathroom,
            imageUrls: imageUrls
        });
        return newItemId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    function getProperty(uint256 propertyId) public view returns (
        Property memory
    ) {
        Property memory property = properties[propertyId];
        return property;
    }

    function approve(address _to, uint256 _tokenId) public override(ERC721, IERC721){
        super.approve(_to, _tokenId);

    }
            

}