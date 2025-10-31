import { RefObject } from "react"

export const LodeMore = ({loadMoreRef, noMore, loading}:{loadMoreRef:RefObject<HTMLDivElement|null>; noMore?:boolean, loading?:boolean}) => {
  return (
    <div ref={loadMoreRef} className="py-8">
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {noMore && <div className="py-4 text-gray-500 text-center">没有更多数据了</div>}
    </div>
  )
}