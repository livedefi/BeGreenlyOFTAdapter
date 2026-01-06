// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct MessagingParams {
    uint32 dstEid;
    bytes32 receiver;
    bytes message;
    bytes options;
    bool payInLzToken;
}

struct MessagingReceipt {
    bytes32 guid;
    uint64 nonce;
    MessagingFee fee;
}

struct MessagingFee {
    uint256 nativeFee;
    uint256 lzTokenFee;
}

contract LZEndpointMock {
    uint32 public eid;

    constructor(uint32 _eid) {
        eid = _eid;
    }

    function setDelegate(address _delegate) external {}
    
    function quote(
        MessagingParams calldata, address
    ) external pure returns (uint256 nativeFee, uint256 lzTokenFee) {
        return (0, 0);
    }

    function send(
        MessagingParams calldata,
        address
    ) external payable returns (MessagingReceipt memory) {
        return MessagingReceipt({
            guid: "0x",
            nonce: 0,
            fee: MessagingFee({
                nativeFee: 0,
                lzTokenFee: 0
            })
        });
    }
}
