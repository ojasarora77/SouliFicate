// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT is ERC721, Ownable {
    struct Certificate {
        bool exists;
        bool approved;
    }

    mapping(uint256 => Certificate) private _certificates;
    mapping(address => uint256[]) private _studentCertificates;

    uint256 private _tokenIdCounter;

    constructor(address initialOwner) ERC721("UniversityCertificate", "UNI") Ownable(initialOwner) {}

    function mint(address student) external onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(student, tokenId);
        _certificates[tokenId] = Certificate(true, false);
        _studentCertificates[student].push(tokenId);
        _tokenIdCounter++;
    }

    function approveCertificate(uint256 tokenId) external {
        require(_certificates[tokenId].exists, "Certificate does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the certificate owner can approve");
        _certificates[tokenId].approved = true;
    }

    function burn(uint256 tokenId) external onlyOwner {
        require(_certificates[tokenId].exists, "Certificate does not exist");
        require(_certificates[tokenId].approved, "Certificate is not approved");
        _burn(tokenId);
        delete _certificates[tokenId];
        _removeTokenFromStudentEnumeration(ownerOf(tokenId), tokenId);
    }

    function _removeTokenFromStudentEnumeration(address student, uint256 tokenId) private {
        uint256[] storage tokens = _studentCertificates[student];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId); // Fetch the current owner

        // Enforce soulbound restriction: Only minting (from == address(0)) or burning (to == address(0)) is allowed
        require(from == address(0) || to == address(0), "Soulbound: Transfer not allowed");

        // Perform (optional) operator check
        if (auth != address(0)) {
            _checkAuthorized(from, auth, tokenId);
        }

        // Clear approval if the token is being burned
        if (from != address(0)) {
            _approve(address(0), tokenId, address(0), false);
        }

        return super._update(to, tokenId, auth);
    }

    function studentCertificates(address student) external view returns (uint256[] memory) {
        return _studentCertificates[student];
    }
}