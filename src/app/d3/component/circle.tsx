import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { BarDatum, COLOR_SCHEMES, DEFAULT_COLOR_SCHEME } from "./types";
import { ChartFrame } from "./common";
import { cn } from "@/common/utils";

const d = [
  {
    name: "React",
    value: 85,
    description: "用于构建用户界面的 JavaScript 库",
  },
  { name: "Vue", value: 75, description: "渐进式 JavaScript 框架" },
  { name: "Angular", value: 60, description: "基于 TypeScript 的 Web 框架" },
  { name: "Svelte", value: 45, description: "编译时框架" },
  { name: "Webpack", value: 80, description: "模块打包工具" },
  { name: "Vite", value: 70, description: "下一代前端构建工具" },
  { name: "Rollup", value: 55, description: "ES模块打包器" },
  { name: "Parcel", value: 40, description: "零配置构建工具" },
  { name: "JavaScript", value: 95, description: "Web 开发核心语言" },
  { name: "TypeScript", value: 75, description: "JavaScript 的超集" },
  { name: "Python", value: 65, description: "通用编程语言" },
  { name: "Rust", value: 35, description: "系统编程语言" },
];

type DataNode = {
  name?: string;
  value?: number;
  description?: string;
  children?: DataNode[];
};
type LeaveItemProps = {
  node: d3.HierarchyCircularNode<DataNode>;
};

const CicleChart = () => {
  const width = 800;
  const height = 600;

  const [data, setCircleData] = useState(d || []);

  const { leaves } = useMemo(() => {
    const root = d3
      .hierarchy<DataNode>({ children: data as unknown as DataNode[] })
      .sum((d) => d?.value || 0);
    const pack = d3.pack<DataNode>().size([width, height]).padding(6);
    const nodes = pack(root);
    const leaves = nodes.leaves();
    return { leaves };
  }, [data]);

  return (
    <ChartFrame title="自定义圆圈图" className="flex-1 w-full h-[80vh] flex flex-col">
      <div className={cn("w-full flex-1 animate-scale-up origin-center")}>
        {leaves?.map((node, index) => LeaveItem1({ node, index }))}

        {/* {leaves?.map((node, index) => {
          return (
            <LeaveItem
              node={node}
              key={node.data?.name ?? index}
              index={index}
            />
          );
        })} */}
      </div>
    </ChartFrame>
  );
};
const LeaveItem1 = ({ node, index }: LeaveItemProps & { index: number }) => {
  const { data, depth, x, y, r, height, value } = node;
  const color = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
  return (
    <div
      key={data?.name || index}
      className={cn(
        "flex flex-col items-center justify-center cursor-pointer absolute rounded-full",
        "animate-wave",
        "transform transition-all duration-300 hover:scale-[1.2] hover:animate-none hover:z-10"
      )}
      style={{
        width: r * 2,
        height: r * 2,
        left: x - r,
        top: y - r,
        animationDelay: `${Math.random()}s`,
        backgroundColor: color.color,
        backgroundImage: color.radialGradient,
      }}
    >
      <span>{data?.name ?? ""}</span>
      <span>{value || 0}</span>
    </div>
  );
};
const LeaveItem = React.memo(LeaveItem1)

export default CicleChart;
