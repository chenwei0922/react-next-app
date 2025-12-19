'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { networks, projectId, wagmiAdapter } from './config'
import { Config, cookieToInitialState, WagmiProvider } from 'wagmi'

// 1. 设置 React Query Client
const queryClient = new QueryClient()
// 2. 初始化 Reown AppKit 模态框
// 这部分代码运行在客户端，负责弹出连接窗口
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  // defaultNetwork: mainnet,
  metadata: {
    name: 'Next.js AppKit',
    description: 'AppKit Example',
    url: 'https://reown.com/appkit',
    icons: ['https://assets.reown.com/reown-profile-pic.png']
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // METAMASK
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', // OKX
    '15c8b91ade1a4e58f3ce4e7a0dd7f42b47db0c8df7e0d84f63eb39bcb96c4e0f', // BYBIT
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4' //BINANCE
    // 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393' //Phantom
  ],
  // enableWallets: true, // 是否开启钱包连接，按需开启
  enableWalletConnect: false, // 是否开启 WalletConnect 连接，按需开启
  features: {
    history: false, // 是否开启钱包切换历史记录，按需开启
    analytics: false, // 是否开启 Analytics，按需开启
    email: false, // 是否开启邮箱登录，按需开启
    socials: false,  // 是否开启社交登录，按需开启
  },
  enableCoinbase: false, // 是否开启 Coinbase 登录，按需开启
  enableAuthLogger: false, // 是否开启 AuthLogger，按需开启
  debug: false, // 是否开启调试模式，按需开启
  coinbasePreference: 'eoaOnly'
})

export const Providers = ({children, cookies}:{children: React.ReactNode, cookies: string | null}) => {
  // 3. 恢复 SSR 状态
  // 这能防止页面刷新时“未连接 -> 已连接”的闪烁
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}