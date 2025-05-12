"use client";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";

// 지갑 연결/해제 버튼 컴포넌트
export default function ConnectWalletButton() {
  const [mounted, setMounted] = useState(false); // hydration 오류 방지용
  const { connect, connectors, error, isLoading } = useConnect(); // 지갑 연결 관련 훅
  const { address, isConnected } = useAccount(); // 연결된 지갑 정보
  const { disconnect } = useDisconnect(); // 지갑 연결 해제 함수

  useEffect(() => {
    setMounted(true); // 마운트 후에만 렌더링 (SSR hydration 오류 방지)
  }, []);

  if (!mounted) return null; // SSR에서는 아무것도 렌더링하지 않음

  return (
    <div>
      {isConnected ? (
        <div>
          {/* 연결된 경우 지갑 주소와 연결해제 버튼 표시 */}
          <p>지갑 주소: {address}</p>
          <button onClick={() => disconnect()}>연결해제</button>
        </div>
      ) : (
        // 연결되지 않은 경우 지갑 연결 버튼 목록 표시
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isLoading}
          >
            {connector.name}로 연결
          </button>
        ))
      )}
      {/* 에러 메시지 표시 */}
      {error && <div>에러: {error.message}</div>}
    </div>
  );
}
