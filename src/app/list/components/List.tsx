import { useVirtualList } from "@/hooks/useVirtualList";
import { IWork } from "../service";
import { MemoWorkItem } from "./ListItem";
import { ReactNode } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { LodeMore } from "./LoadMore";

//自定义hook
// 虚拟列表
export const CustomVirtualList = ({ results, handleMore, loading, hasMore }: { results: IWork[]; renderMore?: ReactNode; handleMore:()=>void; loading?:boolean; hasMore?:boolean  }) => {

  const {moreRef} = useInfiniteScroll<HTMLDivElement>(handleMore,{
    enabled: hasMore && !loading, // 没有更多数据或加载中时禁用
    distance: 300,
  });

  const {visibleItems, totalHeight, containerRef } = useVirtualList({
    items: results,
    itemHeight: 227,
    overscan: 2,
  });

  return (
    <div ref={containerRef} className="overflow-auto w-full h-screen">
      <div className="relative min-h-full" style={{ height: `${totalHeight}px` }}>
        {visibleItems.map(({data:item, originalIndex, offsetTop}) => (
          <div
            key={item.ID}
            className="h-[227px] w-full flex justify-center absolute"
            data-virtual-index={originalIndex+1}
            style={{
              transform: `translateY(${offsetTop}px)`
            }}
          >
            <MemoWorkItem {...item} />
          </div>
        ))}
      </div>
      <LodeMore noMore={!hasMore && !!results?.length} loading={loading} loadMoreRef={moreRef} />
    </div>
  );
};

// 普通分页列表
export const CustomVirtualList1 = ({ results, handleMore, loading, hasMore }: { results: IWork[]; renderMore?: ReactNode; handleMore:()=>void; loading?:boolean; hasMore?:boolean  }) => {

  const {moreRef} = useInfiniteScroll<HTMLDivElement>(handleMore,{
    enabled: hasMore && !loading, // 没有更多数据或加载中时禁用
    distance: 300,
  });

  return (
    <div className="overflow-auto w-full h-screen">
      {results.map((item) => (
        <div
          key={item.ID}
          data-testid="list-item"
          className="h-[227px] w-full flex justify-center">
          <MemoWorkItem {...item} />
        </div>
      ))}
      <LodeMore noMore={!hasMore && !!results?.length} loading={loading} loadMoreRef={moreRef} />
    </div>
  );
};