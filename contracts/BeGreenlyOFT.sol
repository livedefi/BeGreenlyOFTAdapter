// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@layerzerolabs/oft-evm/contracts/OFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BeGreenlyOFT is Ownable, OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) Ownable(_delegate) OFT(_name, _symbol, _lzEndpoint, _delegate) {}

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
