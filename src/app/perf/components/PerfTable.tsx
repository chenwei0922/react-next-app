import { cn } from "@/common/utils";
import { Table, Text } from "@radix-ui/themes";

async function getData() {
  const res = await fetch(process.env.PAGE_ORIGIN+"/api/metrics", {
    cache: "no-store",
  });
  return res.json();
}


const DataMap = {
  "FCP": [1800, 3000],
  'LCP': [2500, 4000],
  'CLS': [0.1, 0.25],
  'FID': [100, 300],
  'INP': [200, 500],
  'TTFB': [800, 1200],
}
export default async function PerfTable() {
  const data = await getData();

  return (
    <div style={{ padding: 20 }}>
      <Text>🚀 路由级性能看板</Text>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Route</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Metric</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>p75</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item: any) => {
            const score = Math.round(item.p75)
            const p = DataMap?.[item.metric as keyof typeof DataMap] ?? [0, 0]
            return (
              <Table.Row className={cn(score<p?.[0] ? '' : score>p?.[1] ? `bg-red-500`: 'bg-amber-400')} key={`${item.route}-${item.metric}`}>
              <Table.Cell>{item.route}</Table.Cell>
              <Table.Cell>{item.metric}</Table.Cell>
              <Table.Cell>{score}({p?.[0]})</Table.Cell>
              <Table.Cell>{item.count}</Table.Cell>
            </Table.Row>
            )
          }
            
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
