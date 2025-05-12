// app/layout.js
// 전체 앱의 레이아웃을 정의하는 파일입니다.
// Providers로 children을 감싸서 wagmi, react-query 등 context를 전역에 적용합니다.
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        {/* Providers로 children을 감싸서 전역 상태 및 web3 기능을 제공합니다 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
