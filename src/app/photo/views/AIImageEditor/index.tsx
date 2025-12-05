"use client";

import { Button, Card, Flex } from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Tools } from "./Tool";
import { useFabricTool } from "./useFabricTool";

const AIImageEditor = () => {
  const [imgPreviewURL, setImgPreviewURL] = useState("");
  const { canvasRef, containerRef, ...rest} = useFabricTool();

  return (
    <Flex className="p-4" direction={"column"} gap={"4"}>
      <Tools setPreviewUrl={setImgPreviewURL} {...rest}/>
      <Card className="flex! flex-row h5:flex-col gap-2">
        <div ref={containerRef} className="w-full bg-red-400 aspect-square overflow-hidden">
          <canvas ref={canvasRef} className=""></canvas>
        </div>
        <div className="w-full aspect-square">
          {imgPreviewURL && (
            <Image src={imgPreviewURL} alt="preview" width={200} height={200} />
          )}
        </div>
      </Card>
    </Flex>
  );
};

export default AIImageEditor;
