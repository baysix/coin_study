"use client";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "ethers";
import { useState, useEffect } from "react"; // useEffect 임포트

// 👇 수동으로 정의한 erc20Abi 배열을 삭제하거나 주석 처리합니다.
// const erc20Abi = [
//   "function balanceOf(address owner) view returns (uint256)",
//   "function decimals() view returns (uint8)",
//   "function symbol() view returns (string)",
// ];

// 👇 Hardhat이 생성한 ABI 파일에서 ABI 정보를 임포트합니다.
// artifacts 폴더는 프로젝트 루트에 있습니다.
import MyTokenAbi from "../../artifacts/contracts/MyToken.sol/MyToken.json";

// 로컬 Hardhat에 배포한 MyToken 컨트랙트 주소
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 현재 사용하시는 실제 주소로 변경

export default function TokenBalance() {
  const [mounted, setMounted] = useState(false); // 👈 mounted 상태 추가

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected } = useAccount();

  // 잔액 조회
  const { data: balance } = useReadContract({
    address: TOKEN_ADDRESS,
    // 👇 임포트한 ABI 객체의 abi 속성을 사용합니다.
    abi: MyTokenAbi.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address && mounted },
  });

  // 소수점 자리수 조회
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    // 👇 임포트한 ABI 객체의 abi 속성을 사용합니다.
    abi: MyTokenAbi.abi,
    functionName: "decimals",
    query: { enabled: !!address && mounted },
  });

  // 심볼 조회
  const { data: symbol } = useReadContract({
    address: TOKEN_ADDRESS,
    // 👇 임포트한 ABI 객체의 abi 속성을 사용합니다.
    abi: MyTokenAbi.abi,
    functionName: "symbol",
    query: { enabled: !!address && mounted },
  });

  if (!mounted) {
    return null;
  }

  if (!isConnected) return <div>지갑을 연결해주세요.</div>;

  if (balance === undefined || decimals === undefined || symbol === undefined) {
    console.log("Loading token data:", balance, decimals, symbol);
    return <div>잔액 조회 중...</div>;
  }

  // 👇 모든 데이터가 로드되면 이 부분이 실행됩니다.
  return (
    <div>
      <strong>내 토큰 잔액:</strong>{" "}
      {parseFloat(formatUnits(balance, decimals)).toLocaleString()} {symbol}
    </div>
  );
}
