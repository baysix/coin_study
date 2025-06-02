import { useAccount, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import MyTokenAbi from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { formatUnits } from "viem";

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// 'Transfer', 'decimals', 'symbol' 이벤트/함수 ABI 정의를 ABI 파일에서 직접 찾습니다.
const transferEventAbi = MyTokenAbi.abi.find(
  (item) => item.type === "event" && item.name === "Transfer"
);
const decimalsFunctionAbi = MyTokenAbi.abi.find(
  (item) => item.type === "function" && item.name === "decimals"
);
const symbolFunctionAbi = MyTokenAbi.abi.find(
  (item) => item.type === "function" && item.name === "symbol"
);

export default function TokenTransferHistory() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [transferEvents, setTransferEvents] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [decimals, setDecimals] = useState(18);
  const [tokenSymbol, setTokenSymbol] = useState("Token");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!publicClient || !decimalsFunctionAbi || !symbolFunctionAbi) return;

    const fetchTokenInfo = async () => {
      try {
        const fetchedDecimals = await publicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: MyTokenAbi.abi,
          functionName: "decimals",
        });
        setDecimals(fetchedDecimals);

        const fetchedSymbol = await publicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: MyTokenAbi.abi,
          functionName: "symbol",
        });
        setTokenSymbol(fetchedSymbol);
      } catch (err) {
        console.error("토큰 정보 조회 실패:", err);
      }
    };

    fetchTokenInfo();
  }, [publicClient]);

  useEffect(() => {
    if (!address || !publicClient || !transferEventAbi) {
      setTransferEvents([]);
      return;
    }

    const fetchLogs = async () => {
      try {
        // 보낸 내역 가져오기
        const sentLogs = await publicClient.getLogs({
          address: TOKEN_ADDRESS,
          abi: MyTokenAbi.abi,
          event: transferEventAbi,
          fromBlock: "earliest",
          toBlock: "latest",
          args: {
            from: address,
          },
        });

        // 받은 내역 가져오기
        const receivedLogs = await publicClient.getLogs({
          address: TOKEN_ADDRESS,
          abi: MyTokenAbi.abi,
          event: transferEventAbi,
          fromBlock: "earliest",
          toBlock: "latest",
          args: {
            to: address,
          },
        });

        // 두 내역을 합치고 블록 번호 및 로그 인덱스로 정렬
        const allLogs = [...sentLogs, ...receivedLogs].sort((a, b) => {
          if (a.blockNumber !== b.blockNumber) {
            return Number(a.blockNumber - b.blockNumber);
          }
          return a.logIndex - b.logIndex;
        });

        setTransferEvents(allLogs);
      } catch (err) {
        console.error("전송 내역 조회 실패:", err);
        setTransferEvents([]);
      }
    };

    fetchLogs();
  }, [address, publicClient, transferEventAbi]);

  if (!isConnected) return <div>지갑을 연결해주세요.</div>;

  return (
    <div>
      <h3>내 토큰 전송 내역</h3>
      <ul>
        {mounted && transferEvents.length === 0 ? (
          <li>전송 내역이 없습니다.</li>
        ) : mounted ? (
          transferEvents.map((event, idx) => (
            <li key={idx}>
              {event.args.from === address
                ? `${event.args.to}에게 ${formatUnits(
                    BigInt(event.args.value),
                    decimals
                  )} ${tokenSymbol} 전송`
                : `${event.args.from}에게 ${formatUnits(
                    BigInt(event.args.value),
                    decimals
                  )} ${tokenSymbol} 받음`}
            </li>
          ))
        ) : (
          <li>전송 내역을 불러오는 중...</li>
        )}
      </ul>
    </div>
  );
}
