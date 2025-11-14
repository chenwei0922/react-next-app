'use client'

import { BaseContainer } from "./components/Base";
import { CardFlip } from "./components/卡片翻转";
import { TextErasingEffect } from "./components/文本擦除效果";
import { StarSky } from "./components/星空";
import { WaterWaveAnimate } from "./components/水波进度条";

export default function Home() {
  return (
    <main className="">
      <TextErasingEffect />
      <StarSky />
      <WaterWaveAnimate />
      <CardFlip />
      <BaseContainer />
    </main>
  );
}
