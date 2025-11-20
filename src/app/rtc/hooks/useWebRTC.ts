import { useCallback, useEffect, useRef, useState } from "react";
import io from 'socket.io-client'
import { Socket } from 'socket.io-client'

export const useWebRTC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [users, setUsers] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('room1');
  const [joined, setJoined] = useState(false);

  //获取本地媒体流
  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('🚫 获取媒体流失败:', error);
      throw error;
    }
  };

  //创建rtc连接
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(
      //   {
      //   iceServers: [
      //     {
      //       urls: 'stun:stun.l.google.com:19302',
      //     },
      //   ],
      // }
    );
    //添加本地流
    const localStream = localStreamRef.current;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    //远程流处理
    pc.ontrack = (event) => {
      const video = remoteVideoRef.current;
      if (!video) return;
      if(video.srcObject) return;

      console.log('📹 收到远程流', event);
      // const remoteStream = event.streams[0];
      // console.log('📹 视频轨道数量:', remoteStream.getVideoTracks().length);
      // console.log('📹 音频轨道数量:', remoteStream.getAudioTracks().length)
      // const vidoeTrack = remoteStream.getVideoTracks()[0];
      // console.log('📹 视频轨道状态:', vidoeTrack?.readyState);
      // console.log('📹 视频轨道设置:', vidoeTrack?.getSettings());

      video.srcObject = event.streams[0];
    }
    //ICE候选处理
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('📹 onicecandidate', event);
        socketRef.current?.emit('webrtc-candidate', {
          targetUserId: users[0], // 目标用户ID
          candidate: event.candidate, // ICE候选
          roomId: roomId // 房间ID
        });
      }
    }

    //连接状态处理
    pc.oniceconnectionstatechange = () => {
      console.log(`🔗 PeerConnection 状态: ${pc.iceConnectionState}`);
    }

    peerConnectionRef.current = pc; //保存引用
    return pc;
  }, [users, roomId]);

  //加入房间
  const joinRoom = async (newRoomId: string = 'room1') => {
    if (!newRoomId.trim()) return;

    try {
      await getLocalStream();
      socketRef.current?.emit('join-room', { roomId: newRoomId });
      setRoomId(newRoomId);
      setJoined(true);
    } catch (error) {
      console.error('❌ 加入房间失败:', error);
    }
  }

  //离开房间
  const leaveRoom = () => {
    socketRef.current?.emit('leave-room', { roomId });
    setRoomId('');
    setJoined(false);
    setUsers([]);
    // 清理本地流和 PeerConnection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    //清理视频元素
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }

  // 创建呼叫
  const createCall = async () => {
    if (users.length === 0) {
      console.log('❌ 房间内没有其他用户');
      return;
    }
    try {
      // 创建 PeerConnection
      await createPeerConnection();
      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);

      socketRef.current?.emit('webrtc-offer', {
        targetUserId: users[0],
        offer: offer,
        roomId: roomId
      });
    } catch (error) {
      console.error('❌ 创建呼叫失败:', error);
    }
  }

  useEffect(() => {
    /**
     * 创建socket连接
     * newScoket: SocketIOClient.Socket
     * newScoket.on: (event: string, callback: (...args: any[]) => void) => SocketIOClient.Socket
     * newScoket.emit: (event: string, ...args: any[]) => void
     * newScoket.close: () => void
     * newScoket.id: string
     * newScoket.connected: boolean
     * newScoket.disconnect: () => void
     * newScoket.connect: () => void
     */
    if (socketRef.current) return;
    console.log('🔗 创建socket连接', process.env.WEBRTC_SOCKET_URL);
    const newSocket = io(process.env.WEBRTC_SOCKET_URL)
    socketRef.current = newSocket;

    const handleWebRTCOffer = async (data: { from: string; offer: RTCSessionDescriptionInit; roomId: string }) => {
      //收到来自from用户的通话请求
      console.log('📩 收到WebRTC Offer:', data);
      await createPeerConnection();
      await peerConnectionRef.current?.setRemoteDescription(data.offer);

      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);
      newSocket?.emit('webrtc-answer', {
        targetUserId: data.from, // 目标用户ID
        answer,
        roomId: data.roomId // 房间ID
      })
    }

    const handleWebRTCAnswer = async (data: { from: string; answer: RTCSessionDescriptionInit; roomId: string }) => {
      //收到来自from用户的通话响应
      console.log('📩 收到WebRTC Answer:', data);
      await peerConnectionRef.current?.setRemoteDescription(data.answer);
    }

    const handleICECandidate = async (data: { from: string; candidate: RTCIceCandidateInit; roomId: string }) => {
      console.log('📨 收到ICE候选:', data);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
      }
    }
    //设置事件监听
    newSocket.on('connect', () => {
      console.log('🔗 连接成功', newSocket.id);
    })
    newSocket.on('disconnect', () => {
      console.log('🔗 连接断开', newSocket.id);
    })
    newSocket.on('user-connected', (data: { userId: string; roomId: string; }) => {
      console.log('👤 新用户连接进来:', data.userId);
      setUsers(prev => [...prev, data.userId]);
    });
    newSocket.on('user-disconnected', (data: { userId: string; roomId: string; }) => {
      console.log('👤 有用户离开:', data.userId);
      setUsers(prev => prev.filter(id => id !== data.userId));

      // 清理 PeerConnection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      // 清理视频元素
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });
    newSocket.on('current-users', (data: { users: string[]; roomId: string }) => {
      console.log('👥 当前房间的用户列表:', data.users);
      setUsers(data.users);
    });
    newSocket.on('webrtc-offer', handleWebRTCOffer);
    newSocket.on('webrtc-answer', handleWebRTCAnswer);
    newSocket.on('webrtc-candidate', handleICECandidate);
    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('user-connected');
      newSocket.off('user-disconnected');
      newSocket.off('current-users');
      newSocket.off('webrtc-offer');
      newSocket.off('webrtc-answer');
      newSocket.off('webrtc-candidate');
      newSocket.close()
    }
  }, [])

  return {
    joinRoom,
    leaveRoom,
    createCall,
    localVideoRef,
    remoteVideoRef,
    users,
    joined
  }
}