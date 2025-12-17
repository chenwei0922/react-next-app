'use client'

import { useEffect, useRef } from "react"

let swRegistered = false;
let workerInstance: Worker | null = null;

export const AppBootstrap = () => {
  const initialized = useRef(false)

  useEffect(()=> {
    if (initialized.current) {
      return
    }
    initialized.current = true
    //1.注册service worker
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && !swRegistered) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if(!reg){
          navigator.serviceWorker.register('/sw.js')
        }
        swRegistered = true
      })
    }

    //2.初始化 web worker
    if (!workerInstance) {
      workerInstance = new Worker(new URL('/worker.js', import.meta.url), {type: 'module'})
    }

    // //3.初始化 indexedDB
    // if (process.env.NODE_ENV === 'production') {
    //   const request = indexedDB.open('myDatabase', 1)
    //   request.onupgradeneeded = (event) => {
    //     const db = event.target?.result as IDBDatabase
    //     db.createObjectStore('myStore', {keyPath: 'id'})
    //   }
    // }

    // //4.初始化 local storage
    // if (process.env.NODE_ENV === 'production') {
    //   localStorage.setItem('initialized', 'true')

    // }

    //3. 监听网络变化
    const onOnline = () => console.log('[Network] online');
    const onOffline = () => console.log('[Network] offline');
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])
  return null
}