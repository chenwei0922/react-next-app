'use client'
import React, { JSX, ReactElement, useLayoutEffect } from "react"
import { useKeepAliveContext } from "./provider"

export const withKeepAlive = <T extends JSX.IntrinsicAttributes,>(WrappedComponent: (props: T) => JSX.Element, uid: string) => {
  const KeepAlive = (props: T) => {
    return (
      <WrappedComponent {...props} />
    )
  }
  KeepAlive.keepAlive = {
    name: uid
  }
  return KeepAlive
}

export const KeepAlive = ({uid:id, children}: {uid: string, children: React.ReactNode}) => {
  const { register, activeId } = useKeepAliveContext();
  
  useLayoutEffect(() => {
    register(id, children);
    return () => {
      // 可选：根据需求决定是否要在离开页面时销毁缓存
      // unregister(id); 
    };
  }, [id, children, register]);
  
  return (
    <div id={`keep-alive-${id}`} style={{ display: activeId === id ? 'block' : 'none' }}>
      {/* 这里的children只在第一次渲染时生效，后续由 provider 控制 */}
      {children}
    </div>
  )
}