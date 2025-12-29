'use client'

import { BaseContainer } from "./components/Base";
import { FlipAnimate } from "./components/Flip";
import { NineGridGrid } from "./components/九宫格";
import { CardFlip } from "./components/卡片翻转";
import { SvgTextStroke, TextTheme } from "./components/文本";
import { TextErasingEffect } from "./components/文本擦除效果";
import { Carousel, CarouselJsAnimate, CarouselJsRAF } from "./components/无限滚动";
import { StarSky } from "./components/星空";
import { WaterWaveAnimate } from "./components/水波进度条";
import { StepAnimation } from "./components/逐帧动画";

export default function Home() {
  return (
    <main className="">
      <Carousel />
      <CarouselJsAnimate />
      <CarouselJsRAF />
      <TextTheme />
      <FlipAnimate />
      <StepAnimation />
      <TextErasingEffect />
      <StarSky />
      <WaterWaveAnimate />
      <CardFlip />
      <BaseContainer />
      <NineGridGrid />
    </main>
  );
}
