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
  await bgreenToken.waitForDeployment();

  console.log("BGREENToken deployed to:", await bgreenToken.getAddress());

  // ----------------------------
  // Deploy LayerZero Endpoint Mock
  // ----------------------------
  const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
  const lzEndpointMock = await LZEndpointMock.deploy(POLYGON_EID);
  await lzEndpointMock.waitForDeployment();

  console.log("LZEndpointMock deployed to:", await lzEndpointMock.getAddress());

  // ----------------------------
  // Deploy Polygon OFT Adapter
  // ----------------------------
  const OFTAdapter = await ethers.getContractFactory("PolygonOFTAdapter");
  const oftAdapter = await OFTAdapter.deploy(
    await bgreenToken.getAddress(),
    await lzEndpointMock.getAddress(),
    owner.address
  );
  await oftAdapter.waitForDeployment();

  console.log("PolygonOFTAdapter deployed to:", await oftAdapter.getAddress());

  // ----------------------------
  // Deploy BSC OFT
  // ----------------------------
  const BeGreenlyOFT = await ethers.getContractFactory("BeGreenlyOFT");
  const bscOFT = await BeGreenlyOFT.deploy(
    "BeGreenly Coin",
    "BGREEN",
    await lzEndpointMock.getAddress(),
    owner.address
  );
  await bscOFT.waitForDeployment();

  console.log("BeGreenlyOFT deployed to:", await bscOFT.getAddress());

  // ----------------------------
  // Set Peer
  // ----------------------------
  const bscOFTBytes32 = await oftAdapter.addressToBytes32(
    await bscOFT.getAddress()
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