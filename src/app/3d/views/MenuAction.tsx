"use client";
import { Button, Card, Flex } from "@radix-ui/themes";
import { useState } from "react";
import Scene3DView from "./Scene3d";
import ParticleXuanView from "./ParticleXuan/index";
import JarvisView from "./Jarvis";

export const MenuAction = () => {
  const [name, setName] = useState("");
  return (
    <>
      <Flex className="fixed top-0 left-0 z-1000">
        <Card>
          <Button onClick={() => setName("scene3d")}>全景图</Button>
          <Button onClick={() => setName("hand")}>手部动作</Button>
          <Button onClick={() => setName("particle")}>粒子效果</Button>
        </Card>
      </Flex>

      {name === "particle" ? (
        <ParticleXuanView />
      ) : name === "hand" ? (
        <JarvisView />
      ) : (
        <Scene3DView />
      )}
    </>
  );
};
