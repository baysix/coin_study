// src/app/page.js
"use client";
import WalletConnectButton from "../components/WalletConnectButton";
// 👇 TokenBalance 컴포넌트 임포트
import TokenBalance from "../components/TokenBalance";

export default function Home() {
  return (
    <main>
      <h1>토큰 전송 Dapp</h1>
      <WalletConnectButton />
      {/* 👇 여기에 TokenBalance 컴포넌트 배치 */}
      <TokenBalance />
      {/* 앞으로 토큰 전송 UI가 여기에 추가될 예정 */}
    </main>
  );
}
