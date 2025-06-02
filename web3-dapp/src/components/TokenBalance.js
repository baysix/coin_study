// src/components/TokenBalance.js
"use client";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "ethers";
import { useState, useEffect } from "react";

import MyTokenAbi from "../../artifacts/contracts/MyToken.sol/MyToken.json";

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 실제 배포된 주소로 변경

// 👇 props로 onRefetchReady 함수를 받도록 수정 (refetch 함수 자체가 아닌, 준비 완료 신호)
export default function TokenBalance({ onRefetchReady }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected } = useAccount();

  // 잔액 조회
  const { data: balance, refetch } = useReadContract({
    // 👈 refetch 함수는 내부에서만 사용
    address: TOKEN_ADDRESS,
    abi: MyTokenAbi.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address && mounted },
  });

  // 소수점 자리수 조회
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: MyTokenAbi.abi,
    functionName: "decimals",
    query: { enabled: !!address && mounted },
  });

  // 심볼 조회
  const { data: symbol } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: MyTokenAbi.abi,
    functionName: "symbol",
    query: { enabled: !!address && mounted },
  });

  // 👇 refetch 함수가 준비되면 부모에게 준비 완료 신호와 함께 내부 refetch 함수를 전달
  // 부모는 이 함수를 state에 저장하지 않고, 직접 호출할 수 있는 형태로 TokenTransfer에 전달합니다.
  useEffect(() => {
    if (typeof onRefetchReady === "function" && refetch) {
      // refetch 함수가 유효한지 확인
      // 부모에게 refetch를 실행할 수 있는 콜백 함수를 전달
      const triggerRefetch = () => {
        console.log("TokenBalance: 부모로부터 refetch 요청 받음, 실행합니다.");
        refetch(); // 👈 내부 refetch 함수 호출
      };
      onRefetchReady(triggerRefetch); // 👈 triggerRefetch 함수 자체를 부모에게 전달
    }
  }, [refetch, onRefetchReady]); // refetch 함수가 변경될 때마다 부모에게 전달

  if (!mounted) {
    return null;
  }

  if (!isConnected) return <div>지갑을 연결해주세요.</div>;

  if (balance === undefined || decimals === undefined || symbol === undefined) {
    console.log("Loading token data:", balance, decimals, symbol);
    return <div>잔액 조회 중...</div>;
  }

  return (
    <div>
      <strong>내 토큰 잔액:</strong>{" "}
      {parseFloat(formatUnits(balance, decimals)).toLocaleString()} {symbol}
    </div>
  );
}
