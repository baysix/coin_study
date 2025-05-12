// app/providers.js
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, mainnet } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

// wagmi v1/v2 방식
const config = createConfig({
  autoConnect: true, // 이전에 연결된 지갑을 자동으로 연결
  connectors: [injected()], // injected connector 사용 (MetaMask와 같은 브라우저 지갑)
  chains: [sepolia, mainnet], // 사용할 체인 설정
  transports: {
    [sepolia.id]: http("https://rpc.sepolia.org"), // Sepolia 테스트넷의 RPC URL 설정
    [mainnet.id]: http(), // 메인넷은 기본 public provider 사용
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
