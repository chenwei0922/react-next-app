'use client';

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { BarDatum } from "./types";
import { ChartFrame } from "./common";

const mockBarData = [
  { name: "苹果", value: 120 },
  { name: "香蕉", value: 80 },
  { name: "橙子", value: 150 },
  { name: "葡萄", value: 60 },
  { name: "西瓜", value: 200 },
  { name: "芒果", value: 90 },
];

const BarChart = () => {
  const width = 320;
  const height = 150;
  const [data, setBarData] = useState<BarDatum[]>(mockBarData || []);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // 清除之前的图表内容
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 设置边距
    const margin = { top: 20, right: 0, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 创建组并移动到边距内
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 设置比例尺(带状比例尺scaleBand, 线性比例尺scaleLinear)
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 0])
      .nice()
      .range([innerHeight, 0]);

    // 添加坐标轴，并应用
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").call(yAxis);

    // 添加柱子
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) ?? 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", "steelblue")
      .attr("rx", 3) // 圆角
      .attr("ry", 3)
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", "#ff6b6b");

        // 显示工具提示
        g.append("text")
          .attr("class", "tooltip")
          .attr("x", (xScale(d.name) ?? 0) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.value) - 10)
          .attr("text-anchor", "middle")
          .text(d.value)
          .style("font-weight", "bold")
          .style("fill", "#333");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", "steelblue");

        // 移除工具提示
        g.selectAll(".tooltip").remove();
      });

    // 添加柱子上的数值标签
    // g.selectAll('.label')
    //   .data(data)
    //   .enter()
    //   .append('text')
    //   .attr('class', 'label')
    //   .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
    //   .attr('y', d => yScale(d.value) - 5)
    //   .attr('text-anchor', 'middle')
    //   .text(d => d.value)
    //   .style('font-size', '12px')
    //   .style('fill', '#333');
  }, [data, width, height]);

  return (
    <ChartFrame title="柱状图" className="flex-1 min-w-[320px] min-h-[150px]">
      <svg ref={svgRef} width={width} height={height}></svg>
    </ChartFrame>
  );
};

export default BarChart;
