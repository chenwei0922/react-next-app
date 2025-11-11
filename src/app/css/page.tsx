'use client'

import { CardFlip } from "./components/卡片翻转";
import { StarSky } from "./components/星空";
import { WaterWaveAnimate } from "./components/水波进度条";

export default function Home() {
  return (
    <main className="">
      <WaterWaveAnimate />
      <StarSky />
      <CardFlip />
    </main>
  );
}
