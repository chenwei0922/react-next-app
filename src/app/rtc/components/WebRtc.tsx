'use client'

import { Button, Flex, Text } from "@radix-ui/themes"
import { useWebRTC } from "../hooks/useWebRTC"

export const WebRtc = () => {
  const {joinRoom, leaveRoom, createCall, joined, connected, users, localVideoRef, remoteVideoRef} = useWebRTC()
  
  return (
    <Flex direction={'column'} gap={'4'}>
      <Text>WebRTC 一对一</Text>
      <Button onClick={() => joinRoom()} disabled={joined}>加入房间</Button>
      <Button onClick={() => leaveRoom()} disabled={!joined}>离开房间</Button>
      <Button onClick={() => createCall()} disabled={!joined || connected}>开始通话</Button>
      <Text>房间用户：{users.join(', ')}</Text>
      <Flex direction={'row'}>
        <video className="w-20 h-20" ref={localVideoRef} autoPlay muted playsInline></video>
        <video className="w-20 h-20" ref={remoteVideoRef} autoPlay playsInline></video>
      </Flex>
    </Flex>
  )
}