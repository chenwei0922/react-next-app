import { AudioToText } from "./components/AudioToText";
import { TextToAudio } from "./components/TextToAudio";
import { VoiceAnalysis } from "./components/VoiceAnalysis";
import { VoiceTime } from "./components/VoiceTime";

export default function Url(){
  return (
    <main className="p-4 flex flex-col gap-4">
      <TextToAudio />
      <AudioToText />
      <VoiceAnalysis />
      <VoiceTime />
    </main>
  )
}