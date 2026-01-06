const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OFTAdapter", function () {
    let owner, user1, user2;
    let bgreenToken, oftAdapter, lzEndpointMock, bscOFT;

    const POLYGON_EID = 30109;
    const BSC_EID = 30102;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const BGREENToken = await ethers.getContractFactory("BGREENToken");
        bgreenToken = await BGREENToken.deploy(owner.address);

        const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
        lzEndpointMock = await LZEndpointMock.deploy(POLYGON_EID);

        const OFTAdapter = await ethers.getContractFactory("PolygonOFTAdapter");
        oftAdapter = await OFTAdapter.deploy(await bgreenToken.getAddress(), await lzEndpointMock.getAddress(), owner.address);

        const BeGreenlyOFT = await ethers.getContractFactory("BeGreenlyOFT");
        bscOFT = await BeGreenlyOFT.deploy("BeGreenly Coin", "BGREEN", await lzEndpointMock.getAddress(), owner.address);

        await oftAdapter.setPeer(BSC_EID, await oftAdapter.addressToBytes32(await bscOFT.getAddress()));
    });

    it("should have correct initial state", async function () {
        expect(await oftAdapter.token()).to.equal(await bgreenToken.getAddress());
        expect(await oftAdapter.endpoint()).to.equal(await lzEndpointMock.getAddress());
        expect(await oftAdapter.owner()).to.equal(owner.address);
    });

    it("should lock tokens on send", async function () {
        const amount = ethers.parseEther("100");
        await bgreenToken.connect(owner).transfer(user1.address, amount);
        await bgreenToken.connect(user1).approve(await oftAdapter.getAddress(), amount);

        const sendParam = {
            dstEid: BSC_EID,
            to: ethers.zeroPadValue(user2.address, 32),
            amountLD: amount,
            minAmountLD: amount,
            extraOptions: "0x",
            composeMsg: "0x",
            oftCmd: "0x"
        };

        const [nativeFee, lzTokenFee] = await oftAdapter.quoteSend(sendParam, false);

        await oftAdapter.connect(user1).send(sendParam, [nativeFee, lzTokenFee], user1.address, { value: nativeFee });

        expect(await bgreenToken.balanceOf(await oftAdapter.getAddress())).to.equal(amount);
        expect(await bgreenToken.balanceOf(user1.address)).to.equal(0n);
    });
});
