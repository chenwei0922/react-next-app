'use client'

import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  const pathname = usePathname();
  // useReportWebVitals takes a callback function that will be called with the
  // web vitals data when it's available.
  useReportWebVitals((metric) => {
    if(pathname.includes('perf')) return
    // console.log(metric);
    if(process.env.NODE_ENV === 'production'){
      //生产模式启用
      // sendToAnalytics(metric);
      navigator.sendBeacon(
        "/api/web-vitals",
        JSON.stringify({
          ...metric,
          route: pathname,
          ua: navigator.userAgent,
          timestamp: Date.now()
        })
      );
    }
    // This function is called each time a web vital event is recorded.
    // `metric` will be an object that looks like this:
    // {
    //   id: "CLS", // web vital ID (passed to the callback)
    //   name: "Layout Shifts", // web vital name
    //   value: 0.1, // the web vital value
    //   delta: 0.1, // the delta from the previous value
    //   entries: [...], // the web vital entry objects
    //   id: "FCP", // web vital ID (passed to the callback)
    //   name: "First Contentful Paint", // web vital name
    //   value: 920, // the web vital value
    //   delta: 100, // the delta from the previous value
    //   entries: [...], // the web vital entry objects
    // }
  });
  return null;
}