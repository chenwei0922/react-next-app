import { Providers } from "@/lib/web3/providers";
import { WalletDemo } from "./components/WalletDemo";
import { headers } from "next/headers";

export default async function Web3() {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')
  return(
    <Providers cookies={cookies}>
      <WalletDemo />
    </Providers>
  )
}