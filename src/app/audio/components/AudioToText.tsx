"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

export const AudioToText = () => {

  const [texts, setTexts] = useState<string[]>([])
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [error, setError] = useState('')

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      requestAnimationFrame(() => setError('您的浏览器不支持语音识别功能'))
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true; // 是否连续识别
    recognition.interimResults = true; // 是否返回临时结果
    recognition.lang = 'zh-CN'; // 识别语言
    recognition.maxAlternatives = 3; // 获取多个备选结果

    recognition.onstart = () => {
      console.log('✅ 语音识别开始');
      setIsListening(true);
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // console.log('🎯 识别结果:', event);
 
      let finalTranscript = ''; // 最终结果
      let newInterimTranscript = ''; // 临时结果

      for(let i = event.resultIndex; i < event.results.length; i++){
        const result = event.results[i]; // 获取识别结果
        console.log('🔍 识别结果:', result[0].transcript, result.isFinal)
        const alternative = result[0]; // 获取第一个备选结果
        if(result.isFinal){
          // 如果是最终结果，则添加到最终结果中
          finalTranscript += alternative.transcript;
        }else{
          // 如果是临时结果，则添加到临时结果中
          newInterimTranscript += alternative.transcript;
        }
      }
      if(finalTranscript){
        setTexts(p=> [...p, finalTranscript])
      }
      setInterimTranscript(newInterimTranscript) // 更新临时结果
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ 识别错误:', event.error);
      setError(event.error)
      setIsListening(false);
    }
    recognition.onend = () => {
      console.log('⏹️ 语音识别结束');
      setIsListening(false);
    }
    return () => {
      recognitionRef.current?.stop();
    }
  }, [])

  const start = () => {
    const recognition = recognitionRef.current;
    if (recognition && !isListening) {
      try{
        recognition.start();
      }catch(error){
        console.error('启动失败:', error);
      }
    }
  }
  const stop = () => {
    const recognition = recognitionRef.current;
    if (recognition && isListening) {
      recognition.stop();
    }
  }
  const clear = () => {
    setTexts([])
    setInterimTranscript('')
  }

  return (
    <Flex direction="column" gap="4">
      <Text className="text-center">Audio to Text</Text>
      <Card>
        <Text className="text-red-500">{error}</Text>
        <Flex direction={"column"} gap={"2"}>
          <Button onClick={start} disabled={isListening}>Start</Button>
          <Button onClick={stop} disabled={!isListening}>Stop</Button>
          <Button onClick={clear} >Clear</Button>
          <Text>最终的文本</Text>
          <Card>
            <Flex direction={'column'} className="max-h-[300px] overflow-auto">
              {texts.map((text, index) => {
                return (
                  <Text key={index}>{text}</Text>
                )
              })}
              <Text>{interimTranscript}</Text>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Flex>
  );
};
