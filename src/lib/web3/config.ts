/**
 * rainbowkit -> 目前最好用的钱包连接UI库，底层基于wagmi
 * @reown/appkit @reown/appkit-adapter-wagmi -> 基于wagmi，支持社交登录，多链(跟rainboxkit类似，但功能更强大)
 * viem       -> rpc调用，比 ethers.js 更易用，更轻量级的web3库，负责跟区块链说话(底层驱动)
 * wagmi      -> 把 viem 包装成react hoook，方便在 react 里使用
 * @tanstack/react-query -> 自动重新获取，请求去重，智能缓存，负责管理wagmi拿回来的数据
 
RainbowKit = 美观 + 极致的 EVM 体验
DeFi、NFT 交易平台、游戏等应用，建议使用 RainbowKit
只关注 EVM 兼容链（ETH, Base, Arb, OP 等），建议使用 RainbowKit
高度自定义 UI 主题，建议使用 RainbowKit

Reown AppKit = 功能强大 + 社交登录 + 多链
GameFi、SocialFi 或面向 大众用户 的应用，建议使用 Reown AppKit
要有 邮箱/谷歌登录 等社交登录功能，建议使用 Reown AppKit
涉及 Solana 或其他非 EVM 链的应用，建议使用 Reown AppKit

去 Reown Cloud (原 WalletConnect Cloud) 获取项目 ID， https://dashboard.reown.com/

import { useQuery } from '@tanstack/react-query'
// 哪怕你在10个组件里同时调用这个 hook，请求只会发一次（去重）
const { data, isLoading, error } = useQuery({
  queryKey: ['user'],
  queryFn: () => fetch('/api/user').then(res => res.json())
})

  幽灵依赖
  @coinbase/wallet-sdk
  @metamask/sdk,
  @gemini-wallet/core
  porto
  @base-org/account,
  @safe-global/safe-apps-provider
  @walletconnect/ethereum-provider
 */


/*
import { cookieStorage, createStorage, http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, mainnet, sepolia } from '@reown/appkit/networks'

//https://dashboard.reown.com/
export const projectId = 'c54266b8e5db06d00981a4dc59f68169'

//定义网络
export const networks = [mainnet, sepolia] as [AppKitNetwork, ...AppKitNetwork[]]

//初始化wagmi adapter，会自动帮你创建wagmiconfig
export const wagmiAdapter = new WagmiAdapter({
  // 🌟 关键：使用 cookie 存储以支持 SSR
  storage: createStorage({storage: cookieStorage}),
  ssr: true,
  projectId,
  networks,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})

export const config = wagmiAdapter.wagmiConfig
*/

import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const projectId = 'c54266b8e5db06d00981a4dc59f68169'

export const getConfig = () => {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      // walletConnect({projectId}),
      // metaMask(),
      safe()
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    }
  })
}