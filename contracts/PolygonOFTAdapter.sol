// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OFTAdapter } from "@layerzerolabs/oft-evm/contracts/OFTAdapter.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PolygonOFTAdapter
 * @notice Polygon-side OFT Adapter for the BGREEN token.
 * @dev This contract locks/unlocks the existing BGREEN token on Polygon
 * to facilitate cross-chain transfers via LayerZero V2.
 * Constructor args:
 *    - _token: Polygon BGREEN Token Address (0xddaadeef9990a45cb0fa6508d474bec20e273db3)
 *    - _lzEndpoint: Polygon LayerZero V2 Endpoint (0x1a44076050125825900e736c501f859c50fE728c)
 *    - _delegate: Your multisig or owner address
 */
contract PolygonOFTAdapter is OFTAdapter {
    
    /**
     * @dev Constructor for the PolygonOFTAdapter.
     * @param _token The address of the existing ERC20 token on Polygon.
     * @param _lzEndpoint The LayerZero V2 endpoint address on Polygon.
     * @param _delegate The address authorized to manage the OApp configuration.
     */
    constructor(
        address _token,
        address _lzEndpoint,
        address _delegate
    ) OFTAdapter(_token, _lzEndpoint, _delegate) Ownable(_delegate) {
        // Ownership and Adapter initialization are handled by the parent constructors.
    }

    /**
     * @notice Helper to convert address to bytes32 for setPeer.
     * @param _addr The address to convert.
     * @return The bytes32 representation of the address.
     */
    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
}
