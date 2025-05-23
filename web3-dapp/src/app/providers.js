// app/providers.js
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Sepolia, mainnet 대신 localhost 임포트
import { localhost } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

// wagmi v1/v2 방식
const config = createConfig({
  autoConnect: true,
  connectors: [injected()],
  // 사용할 체인 설정: 로컬호스트만 사용
  chains: [localhost],
  transports: {
    // 로컬호스트 RPC URL 설정 (Hardhat 기본값)
    [localhost.id]: http("http://127.0.0.1:8545"),
    // Sepolia, mainnet 설정은 제거하거나 주석 처리
    // [sepolia.id]: http("https://rpc.sepolia.org"),
    // [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
