'use client'

import { BaseContainer } from "./components/Base";
import { NineGridGrid } from "./components/九宫格";
import { CardFlip } from "./components/卡片翻转";
import { TextErasingEffect } from "./components/文本擦除效果";
import { Carousel, CarouselJsAnimate, CarouselJsRAF } from "./components/无限滚动";
import { StarSky } from "./components/星空";
import { WaterWaveAnimate } from "./components/水波进度条";

export default function Home() {
  return (
    <main className="">
      <Carousel />
      <CarouselJsAnimate />
      <CarouselJsRAF />
      <TextErasingEffect />
      <StarSky />
      <WaterWaveAnimate />
      <CardFlip />
      <BaseContainer />
      <NineGridGrid />
    </main>
  );
}
