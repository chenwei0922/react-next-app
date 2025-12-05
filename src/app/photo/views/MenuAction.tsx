"use client";
import { Button, Card, Flex } from "@radix-ui/themes";
import { useState } from "react";
import AIImageEditor from "./AIImageEditor";
import { PhotoEdit } from "../components/PhotoEdit";

export const MenuAction = () => {
  const [name, setName] = useState("");
  return (
    <>
      <Flex direction={"row"} wrap={"wrap"} gap={'2'} p={'4'}>
        <Button onClick={() => setName("imageeditor")}>图片编辑</Button>
        <Button onClick={() => setName("imagecolor")}>图片换色</Button>
      </Flex>

      {name === "imageeditor" ? <AIImageEditor /> : <PhotoEdit />}
    </>
  );
};
