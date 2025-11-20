import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-24">
      <Flex direction={"column"} gap={"4"}>
        <Button asChild>
          <Link href={"/about"}>Go About(cypress)</Link>
        </Button>
        <Button asChild>
          <Link href={"https://chenwei0922.github.io/echart-example/"}>echart图表</Link>
        </Button>
        <Button asChild>
          <Link href={"/d3"}>D3.js图表</Link>
        </Button>
        <Button asChild>
          <Link href={"/3d"}>3D渲染Three.js</Link>
        </Button>
        <Button asChild>
          <Link href={"/list"}>无限滚动/虚拟列表</Link>
        </Button>
        <Button asChild>
          <Link href={"/koa"}>koa-server</Link>
        </Button>
        <Button asChild>
          <Link href={"/music"}>music</Link>
        </Button>
        <Button asChild>
          <Link href={"/video"}>video</Link>
        </Button>
        <Button asChild>
          <Link href={"/audio"}>audio</Link>
        </Button>
        <Button asChild>
          <Link href={"/rtc"}>WebRTC</Link>
        </Button>
        <Button asChild>
          <Link href={"/scroll"}>轮播</Link>
        </Button>
        <Button asChild>
          <Link href={"/css"}>css动画</Link>
        </Button>
      </Flex>
    </main>
  );
}
