// src/components/TokenTransfer.js
"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, isAddress } from "ethers"; // 👈 isAddress 임포트

import MyTokenAbi from "../../artifacts/contracts/MyToken.sol/MyToken.json";

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 실제 배포된 주소로 변경

export default function TokenTransfer({ triggerBalanceRefetch }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, chainId, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState(""); // 👈 유효성 검사 오류 메시지 상태 추가

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && typeof triggerBalanceRefetch === "function") {
      console.log("트랜잭션 성공! 전달받은 triggerBalanceRefetch 함수 호출.");
      triggerBalanceRefetch();
      // (선택 사항) 트랜잭션 성공 후 입력 필드 초기화
      setRecipient("");
      setAmount("");
      setValidationError(""); // 성공 시 오류 메시지 초기화
    }
    // 트랜잭션이 실패하거나 에러가 발생했을 때도 입력 필드를 초기화할지 고려해볼 수 있습니다.
    // 아니면 사용자가 수정하도록 남겨두는 것도 방법입니다. 여기서는 성공 시에만 초기화합니다.
  }, [isConfirmed, triggerBalanceRefetch]); // 의존성 배열

  const handleTransfer = async () => {
    if (!mounted) return; // mounted 상태 이후에만 실행

    // 👈 **입력값 검증 로직 시작**

    setValidationError(""); // 검사 시작 전 오류 메시지 초기화

    if (!recipient) {
      setValidationError("받는 주소를 입력해주세요.");
      return;
    }
    // ethers의 isAddress 함수를 사용하여 유효한 이더리움 주소 형식인지 확인
    if (!isAddress(recipient)) {
      setValidationError("유효하지 않은 받는 주소 형식입니다.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setValidationError("유효한 전송 수량을 입력해주세요.");
      return;
    }

    // TODO: 현재 지갑의 토큰 잔액과 비교하여 전송 수량이 잔액보다 많은지 검증 로직 추가 (TokenBalance에서 잔액 정보를 가져와야 함)
    // 이 부분은 TokenBalance에서 잔액 정보를 가져와야 하므로 잠시 미루겠습니다.
    // 지금은 형식 검증만 합니다.

    // 👈 **입력값 검증 로직 끝**

    let amountWei;
    try {
      // 사용자가 입력한 일반 수량을 토큰의 wei 단위로 변환
      // MyToken은 ERC20 기본값인 18 decimals를 따르므로 parseEther 사용
      amountWei = parseEther(amount);
    } catch (e) {
      // parseEther 변환 오류 (예: 너무 큰 숫자, 잘못된 형식 등)
      setValidationError(
        "수량 변환 중 오류가 발생했습니다. 형식을 확인해주세요."
      );
      console.error("parseEther 오류:", e);
      return;
    }

    // 트랜잭션 전송
    writeContract({
      address: TOKEN_ADDRESS,
      abi: MyTokenAbi.abi,
      functionName: "transfer",
      args: [recipient, amountWei],
    });
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) return null;

  return (
    <div>
      <h2>토큰 전송</h2>
      <div>
        <label htmlFor="recipient">받는 주소:</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          style={{
            marginLeft: "10px",
            padding: "5px",
            display: "block",
            marginBottom: "5px",
          }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="amount">전송 수량:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          style={{
            marginLeft: "10px",
            padding: "5px",
            display: "block",
            marginBottom: "5px",
          }}
        />
      </div>

      {/* 👈 유효성 검사 오류 메시지 표시 */}
      {validationError && (
        <div style={{ color: "orange", marginTop: "10px" }}>
          {validationError}
        </div>
      )}

      <button
        onClick={handleTransfer}
        disabled={isPending || isConfirming} // 트랜잭션 진행 중 또는 로딩 중 버튼 비활성화
        style={{ marginTop: "15px", padding: "10px" }}
      >
        {isPending
          ? "트랜잭션 전송 중..."
          : isConfirming
            ? "승인 대기 중..."
            : "토큰 전송"}
      </button>

      {/* 트랜잭션 상태 피드백 (기존 코드 유지) */}
      {writeError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          전송 오류: {writeError.message}
        </div>
      )}
      {confirmError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          승인 오류: {confirmError.message}
        </div>
      )}
      {hash && <div style={{ marginTop: "10px" }}>트랜잭션 해시: {hash}</div>}
      {isConfirmed && (
        <div style={{ color: "green", marginTop: "10px" }}>트랜잭션 성공!</div>
      )}
    </div>
  );
}
