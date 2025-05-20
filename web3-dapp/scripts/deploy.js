// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(ethers.parseEther("1000000")); // 100만개 발행

  // 배포된 컨트랙트 주소를 token.target으로 가져옵니다.
  console.log("MyToken deployed to:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
