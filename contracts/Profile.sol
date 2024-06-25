
// SPDX-License-Identifier: MIT

// 1️⃣ Save UserProfile to the mapping in the setProfile() function
// HINT: don't forget to set the _displayName and _bio

pragma solidity ^0.8.0;

contract Profile {
    struct UserProfile {
        string displayName;
        string role;
    }
    
    mapping(address => UserProfile) public profiles;

    function setProfile(string memory _displayName, string memory _role) public {
        // CODE HERE 👇
        UserProfile memory userProfile = UserProfile({
            displayName : _displayName,
            role : _role
        });
        profiles[msg.sender] = userProfile;


    }

    function getProfile(address _user) public view returns (UserProfile memory) {
        return profiles[_user];
    }
}
