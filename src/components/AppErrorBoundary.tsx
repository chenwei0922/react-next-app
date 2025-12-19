/*
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'

const Fallback = ({error, resetErrorBoundary}:FallbackProps) => {
  return (
    <div className='error-box'>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => {
      //tip: 重置应用状态，或者重置导致错误的state
    }} onError={() => {
      //tip: 记录错误日志，上报
    }}>
      {children}
    </ErrorBoundary>
  )
}
*/
//tip: ErrorBoundary只能捕获子组件的错误，不能捕获自己组件的错误
//tip: ErrorBoundary只能捕获同步错误，不能捕获异步错误
//tip: Error Boundary 无法捕获异步操作（如 fetch）或事件处理器（如 onClick）中的错误。我们利用这个 hook 提供的 showBoundary 方法，手动把这些“漏网之鱼”抛给 Error Boundary 处理。