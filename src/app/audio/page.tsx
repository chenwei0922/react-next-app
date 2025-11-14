import { AudioToText } from "./components/AudioToText";
import { TextToAudio } from "./components/TextToAudio";

export default function Url(){
  return (
    <main className="p-4 flex flex-col gap-4">
      <TextToAudio />
      <AudioToText />
    </main>
  )
}