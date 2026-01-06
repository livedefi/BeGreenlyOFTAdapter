const { ethers } = require("hardhat");

async function main() {
  const POLYGON_EID = 10109; // example LayerZero endpoint ID
  const BSC_EID = 10102;     // example LayerZero endpoint ID

  // ----------------------------
  // Signers
  // ----------------------------
  const [owner, user1, user2] = await ethers.getSigners();
  console.log("Deploying with owner:", owner.address);

  // ----------------------------
  // Deploy BGREENToken
  // ----------------------------
  const BGREENToken = await ethers.getContractFactory("BGREENToken");
  const bgreenToken = await BGREENToken.deploy(owner.address);
  await bgreenToken.deployed();

  console.log("BGREENToken deployed to:",  bgreenToken.address);

  // ----------------------------
  // Deploy LayerZero Endpoint Mock
  // ----------------------------
  const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
  const lzEndpointMock = await LZEndpointMock.deploy(POLYGON_EID);
  await lzEndpointMock.deployed();

  console.log("LZEndpointMock deployed to:",  lzEndpointMock.address);

  // ----------------------------
  // Deploy Polygon OFT Adapter
  // ----------------------------
  const OFTAdapter = await ethers.getContractFactory("PolygonOFTAdapter");
  const oftAdapter = await OFTAdapter.deploy(
     bgreenToken.address,
     lzEndpointMock.address,
    owner.address
  );
  await oftAdapter.deployed();

  console.log("PolygonOFTAdapter deployed to:",  oftAdapter.address);

  // ----------------------------
  // Deploy BSC OFT
  // ----------------------------
  const BeGreenlyOFT = await ethers.getContractFactory("BeGreenlyOFT");
  const bscOFT = await BeGreenlyOFT.deploy(
    "BeGreenly Coin",
    "BGREEN",
     lzEndpointMock.address,
    owner.address
  );
  await bscOFT.deployed();

  console.log("BeGreenlyOFT deployed to:",  bscOFT.address);

  // ----------------------------
  // Set Peer
  // ----------------------------
  const bscOFTBytes32 = await oftAdapter.addressToBytes32(
     bscOFT.address
  );

  const tx = await oftAdapter.setPeer(BSC_EID, bscOFTBytes32);
  await tx.wait();

  console.log("Peer set for BSC_EID:", BSC_EID);
}

// ----------------------------
// Execute script
// ----------------------------
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });