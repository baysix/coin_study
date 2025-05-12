// app/page.js
// 메인 페이지 컴포넌트입니다.
// WalletConnectButton을 통해 지갑 연결/해제 기능을 제공합니다.
import WalletConnectButton from "../components/WalletConnectButton";

export default function HomePage() {
  return (
    <div>
      <h1>Web3 DApp</h1> {/* 앱 제목 */}
      <WalletConnectButton /> {/* 지갑 연결/해제 버튼 */}
    </div>
  );
}
