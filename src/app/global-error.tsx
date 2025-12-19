//专门用于捕获根布局中的错误 app/layout.tsx

'use client'

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {

  useEffect(() => {
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2>系统发生严重错误</h2>
          <button onClick={() => reset()}>重试</button>
        </div>
      </body>
    </html>
  )
}