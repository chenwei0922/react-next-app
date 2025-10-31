import { memo, useMemo } from "react";
import { IWork } from "../service";
import Image from "next/image";
import { cn } from "@/common/utils";
import { useIsVisible } from "@/hooks/useIsVisible";

export const WorkItem = (item: IWork) => {
  //缓存options，避免重复创建
  const options = useMemo(() => ({ threshold: 0.1, rootMargin: "50px" }), []);
  const [ref, isVisible] = useIsVisible<HTMLDivElement>(options);
  
  const imageUrl = useMemo(() => {
    const url = item.media.url
    return isVisible ? url + `?w=227&q=80` : url + `?w=20&q=80`
  }, [isVisible, item.media.url]);

  return (
    <div
      className={cn("group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white")}
      ref={ref}
      key={item.ID}
    >
      <Image
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        src={imageUrl}
        alt=""
        width={227}
        height={227}
        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 227px"
        // sizes="227px"
        // sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 227px"
        loading={isVisible ? "eager" : "lazy"} // ✅ 正确的方式
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
      />
    </div>
  );
};

export const MemoWorkItem = memo(WorkItem, (prev, cur) => {
  return prev.ID === cur.ID && prev.media.url === cur.media.url;
});