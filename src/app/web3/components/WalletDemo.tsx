"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useAppKit } from "@reown/appkit/react";
import { formatEther } from "viem"; // 用于把 wei 转成 eth
import { useAccount, useBalance, useDisconnect } from "wagmi";

export const WalletDemo = () => {
  // 1. 获取 AppKit 控制权 (用于打开连接弹窗)
  const { open } = useAppKit()
  // 2. 获取账户状态 (地址、是否已连接)
  const { address, isConnected } = useAccount()
  // 3. 获取断开连接的方法
  const { disconnect } = useDisconnect()
  
  // 4. 获取余额 (自动查询 + 手动刷新)
  const { 
    data: balance, 
    isLoading: isBalanceLoading, 
    refetch: refetchBalance // 👈 这个就是“手动查询”的函数
  } = useBalance({
    address: address, // 只有当 address 存在时才会查询
  })

  return (
    <Card>
      <Text>Web3测试-钱包</Text>
      <Flex direction={'row'} gap={'2'}>
        <Button onClick={() => open()} disabled={isConnected}>连接钱包</Button>
        <Button onClick={() => disconnect()} disabled={!isConnected}>断开连接</Button>
        <Button onClick={() => refetchBalance()} disabled={!isConnected || isBalanceLoading}>查询余额</Button>
      </Flex>
      {isConnected && (
        <Flex direction={'column'} gap={'2'}>
          <Text>地址: {address}</Text>
          <Text>余额: {isBalanceLoading?'查询中...': `${formatEther(balance?.value ?? BigInt(0))} ETH`}</Text>
        </Flex>
      )}
    </Card>
  );
};
