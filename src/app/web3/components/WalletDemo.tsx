"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";

export const WalletDemo = () => {
  const connection = useConnection()
  const { connect, status, error} = useConnect()
  const connectors = useConnectors()
  const { disconnect } = useDisconnect()
  
  return (
    <Flex className="p-4" direction={'column'} gap={'4'}>
      <Text>Web3测试-钱包</Text>
      <Card>
        <Text>连接器</Text>
        <Flex direction={'row'} gap={'2'}>
          {connectors.map((connector) => <Button key={connector.uid} onClick={() => connect({connector})}>{connector.name}</Button>)}
          <Button onClick={() => disconnect()} disabled={connection.status !== 'connected'}>断开连接</Button>
          {/* <Button onClick={() => refetchBalance()} disabled={!isConnected || isBalanceLoading}>查询余额</Button> */}
        </Flex>
        <Flex direction={'column'} gap={'2'}>
          <Text>连接状态: {status}</Text>
          <Text>连接错误: {error?.message}</Text>
        </Flex>
        </Card>
      <Card>
        <Text>Connection</Text> 
        <Flex direction={'column'} gap={'2'}>
          <Text>状态: {connection.status}</Text>
          <Text>chainId: {connection.chainId}</Text>
          <Text>地址: {JSON.stringify(connection.address)}</Text>
          {/* <Text>余额: {isBalanceLoading?'查询中...': `${formatEther(balance?.value ?? BigInt(0))} ETH`}</Text> */}
        </Flex>
      </Card>
    </Flex>
  );
};
