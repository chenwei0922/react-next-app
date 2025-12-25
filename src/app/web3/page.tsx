import { Providers } from "@/lib/web3/providers";
import { WalletDemo } from "./components/WalletDemo";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/web3/config";

export default async function Web3() {
  const initialState = cookieToInitialState(getConfig(), (await headers()).get('cookie'))

  return(
    <Providers initialState={initialState}>
      <WalletDemo />
    </Providers>
  )
}