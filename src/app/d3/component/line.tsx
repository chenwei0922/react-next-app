import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { LineDatum } from "./types";
import { ChartFrame } from "./common";

const mockLineData = [
  { date: new Date(2023, 0, 1), value: 100 },
  { date: new Date(2023, 1, 1), value: 130 },
  { date: new Date(2023, 2, 1), value: 160 },
  { date: new Date(2023, 3, 1), value: 120 },
  { date: new Date(2023, 4, 1), value: 180 },
  { date: new Date(2023, 5, 1), value: 200 },
  { date: new Date(2023, 6, 1), value: 170 },
  { date: new Date(2023, 7, 1), value: 220 },
];

const LineChart = () => {
  const width = 420;
  const height = 150;
  const [data, setData] = useState<LineDatum[]>(mockLineData || []);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 设置比例尺
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    // 创建折线生成器
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // 添加坐标轴
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.timeFormat("%b %Y"));

    const yAxis = d3.axisLeft(yScale);

    g.append("g").attr("transform", `translate(0,${innerHeight})`).call(xAxis);

    g.append("g").call(yAxis);

    // 添加折线
    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#4ecdc4")
      .attr("stroke-width", 3);

    // 添加数据点
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "#4ecdc4")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("fill", "#ff6b6b");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("fill", "#4ecdc4");
      });
  }, [data, width, height]);

  return (
    <ChartFrame title="线性图" className="flex-1 min-w-[320px] min-h-[150px]">
      <svg ref={svgRef} width={width} height={height}></svg>
    </ChartFrame>
  );
};

export default LineChart;
