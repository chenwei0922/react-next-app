
//聚合函数，按路由+指标 做聚合（p75）
export function p75(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.75);
  return sorted[index];
}
