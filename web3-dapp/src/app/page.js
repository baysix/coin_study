// src/app/page.js
"use client";
import { useState, useCallback } from "react"; // 👈 useState, useCallback 임포트
import WalletConnectButton from "../components/WalletConnectButton";
import TokenBalance from "../components/TokenBalance";
import TokenTransfer from "../components/TokenTransfer";
import TokenTransferHistory from "../components/TokenTransferHistory";
export default function Home() {
  // 👈 TokenBalance로부터 받을 triggerRefetch 함수를 저장할 state
  const [triggerBalanceRefetch, setTriggerBalanceRefetch] = useState(null);

  // 👈 TokenBalance에게 전달할 콜백 함수
  // TokenBalance는 이 함수를 호출하며 내부 refetch 함수를 인자로 전달할 것입니다.
  const handleRefetchReady = useCallback((refetchFn) => {
    console.log("Page: TokenBalance로부터 refetch 함수 준비 완료 신호 받음.");
    setTriggerBalanceRefetch(() => refetchFn); // 👈 전달받은 refetch 함수를 state에 저장
    // setTriggerBalanceRefetch(refetchFn); // 이렇게 직접 저장해도 될 수 있으나, 함수 저장 시 콜백 형태로 저장하는 것이 더 안전
  }, []);

  return (
    <main>
      <h1>토큰 전송 Dapp</h1>
      <WalletConnectButton />
      <hr style={{ margin: "20px 0" }} />
      {/* 👇 onRefetchReady prop으로 handleRefetchReady 함수를 전달 */}
      <TokenBalance onRefetchReady={handleRefetchReady} />
      <hr style={{ margin: "20px 0" }} />
      {/* 👇 triggerBalanceRefetch state 값을 TokenTransfer에 prop으로 전달 */}
      <TokenTransfer triggerBalanceRefetch={triggerBalanceRefetch} />
      <hr style={{ margin: "20px 0" }} />
      <TokenTransferHistory />
    </main>
  );
}
