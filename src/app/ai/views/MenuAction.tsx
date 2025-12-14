"use client";
import { Button, Card, Flex } from "@radix-ui/themes";
import { JSX, useState } from "react";
import {AICountryInfo} from "./AICountryInfo";
import { AIChat } from "./AIChat";

type CompName = 'countryinfo' | 'chat'

const DataCompMap:Record<CompName, JSX.Element> = {
  countryinfo: <AICountryInfo />,
  chat: <AIChat />
}
const DataTitles: Record<CompName, string> = {
  countryinfo: "Country Info",
  chat: "Chat"
}

export const MenuAction = () => {
  const [name, setName] = useState<CompName>("countryinfo");
  const CompNames = Object.keys(DataCompMap) as CompName[];
  const Comp = DataCompMap[name];
  // const title = DataTitles[name];
  return (
    <>
      <Flex direction={"row"} wrap={"wrap"} gap={'2'} p={'4'}>
        {CompNames.map((n) => {
          return (
            <Button key={n} onClick={() => setName(n)}>
              {DataTitles[n]}
            </Button>
          );
        })}
      </Flex>

      {Comp}
    </>
  );
};
