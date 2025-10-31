
export const getScrollTop = (el: Document | Element) => {
  if(el === document || el === document.body){
    return Math.max(window.pageXOffset, document.documentElement.scrollTop, document.body.scrollTop)
  }
  return (el as Element)?.scrollTop
}

export const getScrollHeight = (el: Document | Element) => {
  return (el as Element)?.scrollHeight || Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
}


export const getClientHeight = (el: Document | Element) => {
  return (el as Element).clientHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight)
}