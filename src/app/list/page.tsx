"use client";

import { useRequest, useUnmount } from "ahooks";
import { fetchListData, IWork } from "./service";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { CustomVirtualList } from "./components/List";

export default function Home() {
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<IWork[]>([]);

  const { loading, run, cancel } = useRequest(fetchListData, {
    onSuccess(data, [params]) {
      const r = data.results;
      setResults((p) => (params.offset === 0 ? r : [...p, ...r]));
      setPage((prev) => prev + 1);
      setHasMore(r.length > 0);

      if (params.offset === 0) {
        setTotal(data.total);
      }
    },
    manual: true,
  });
  const handleMore = useCallback(() => {
    if (hasMore && !loading) {
      console.log("go load more");
      run({ limit: size, offset: results.length });
    }
  }, [hasMore, loading, results.length, run, size]);

  useUnmount(() => {
    cancel();
  });

  useEffect(() => {
    run({ limit: 10, offset: 0 });
  }, [run, size]);

  return (
    <section className="w-screen flex flex-col items-center">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 web:grid-cols-4 gap-4">
        {results?.map((item) => (
          <MemoWorkItem key={item.ID} {...item} />
        ))}
      </div> */}
      {/* <LodeMore hasMore={!hasMore} loadMoreRef={moreRef} /> */}

      <CustomVirtualList results={results} handleMore={handleMore} loading={loading} hasMore={hasMore}/>
    </section>
  );
}


// const VirtualizedList = ({ results }: { results: IWork[] }) => {
//   const columnCount = 4;
//   const rowHeight = 280;
//   const columnWidth = 250;
//   const rowCount = Math.ceil(results.length / columnCount);

//   return (
//     <List rowCount={results.length} rowHeight={227} rowProps={{results}} rowComponent={({index}) => <MemoWorkItem {...results[index]}/>}></List>
//   )
//   // return (
//   //   <Grid
//   //     defaultWidth={800}
//   //     columnCount={columnCount}
//   //     rowCount={rowCount}
//   //     columnWidth={250}
//   //     rowHeight={280}
//   //     cellProps={}
//   //     // onCellsRendered={}
//   //     // cellComponent={function (
//   //     //   props: {
//   //     //     ariaAttributes: { "aria-colindex": number; role: "gridcell" };
//   //     //     columnIndex: number;
//   //     //     rowIndex: number;
//   //     //     style: CSSProperties;
//   //     //   } & object
//   //     // ): ReactElement {
//   //     //   throw new Error("Function not implemented.");
//   //     // }}
//   //     // cellProps={undefined}
//   //   ></Grid>
//   // );
// };
