"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

export const TextToAudio = () => {
  const text = `你忘了 划过伤口的冷风 你信了 不痛不痒就算过了一生 你 为什么 看见雪飘落就会想唱歌 为什么 在放手时刻眼泪会掉落`;
  // const texts = text.split(" ");

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); //语音种类列表
  const [selectVoice, setSelectVoice] = useState<string>(""); //当前语音种类
  const [rate, setRate] = useState(0.5); //语速
  const [pitch, setPitch] = useState(0.6); //音调
  const [volume, setVolume] = useState(0.8); //音量

  const synthRef = useRef<SpeechSynthesis>(null); //语音合成对象
  const utteranceRef = useRef<SpeechSynthesisUtterance>(null); //语音对象

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const availableVoices = synthRef.current.getVoices();
    setVoices(availableVoices);

    const chineseVoices = availableVoices.find((voice) =>
      voice.lang.startsWith("zh")
    );
    if (chineseVoices) {
      setSelectVoice(chineseVoices.voiceURI);
    }
  }, []);

  const speak = () => {
    console.log("speak");
    console.log(`speak--rate:${rate}, pitch=${pitch}, volumn=${volume}`);
    
    if(synthRef.current?.paused){
      console.log('恢复播放')
      synthRef.current?.resume();
      console.log(`synthRef.current=`, synthRef.current);
      return;
    }
    if(synthRef.current?.speaking){
      console.log('正在播放中，不做处理')
      // synthRef.current.cancel();
      // console.log("取消之前的语音");
      return
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text); //创建语音对象
    const voice = voices.find((voice) => voice.voiceURI === selectVoice);
    if (voice) {
      utteranceRef.current.voice = voice;
    }
    console.log(`synthRef.current=`, synthRef.current);
    console.log(`utteranceRef.current=`, utteranceRef.current);
    console.log(`voice=`, voice);

    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = volume;
    utteranceRef.current.lang = 'zh-CN'; // 明确设置语言

    utteranceRef.current.onstart = () => {
      console.log("start");
    };
    utteranceRef.current.onpause = () => {
      console.log("pause");
      console.log(`synthRef.current=`, synthRef.current);
    };
    utteranceRef.current.onresume = () => {
      console.log("resume");
      console.log(`synthRef.current=`, synthRef.current);
    };
    utteranceRef.current.onend = () => {
      console.log("end");
    };
    utteranceRef.current.onerror = () => {
      console.log("error");
      console.log(`synthRef.current=`, synthRef.current);
    };
    try{
      synthRef.current?.speak(utteranceRef.current);
    }catch(err){
      console.error("error", err);
    }
  };

  const pause = () => {
    if(synthRef.current?.speaking){
      synthRef.current?.pause();
    }
  }
  const stop = () => {
    if(synthRef.current?.paused){
      //取消暂停状态
      synthRef.current?.resume();
    }
    synthRef.current?.cancel();
  }
  return (
    <Flex direction="column" gap="4">
      <Text className="text-center">Text to Audio</Text>
        <Card>
          <Flex direction={"column"} gap={"2"}>
            <Button onClick={speak}>Play</Button>
            <Button onClick={pause}>Pause</Button>
            <Button onClick={stop}>Stop</Button>
            <Text>{text}</Text>
          </Flex>
        </Card>
    </Flex>
  );
};
