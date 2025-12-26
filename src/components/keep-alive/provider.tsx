'use client'

import { usePathname } from "next/navigation"
import React, { useCallback, useState } from "react"

interface ContextState {
  cache: Record<string, React.ReactNode>;
  register: (id: string, node: React.ReactNode) => void;
  activeId: string | null;
}
const KeepAliveContext = React.createContext<ContextState>({} as ContextState)

export const KeepAliveProvider = ({ children }: { children: React.ReactNode }) => {
  const [cache, setCache] = useState<Record<string, React.ReactNode>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const path = usePathname()
  console.log('KeepAliveProvider', children, path)

  const register = useCallback((id: string, node: React.ReactNode) => {
    setCache(prev => {
      if (prev[id]) return prev; // 如果已存在则不重复注册
      return { ...prev, [id]: node };
    });
    setActiveId(id);
  }, []);
  
  return (
    <KeepAliveContext.Provider value={{ cache, register, activeId }}>
      {children}
      <div id="keep-alive-repository" style={{ display: 'none' }}>
        {Object.entries(cache).map(([id, node]) => (
          <div key={id} id={`cache-${id}`}>
            {node}
          </div>
        ))}
      </div>
    </KeepAliveContext.Provider>
  )
}

export const useKeepAliveContext = () => {
  return React.useContext(KeepAliveContext)
}