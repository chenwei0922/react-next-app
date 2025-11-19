/**
 * 字符串异步替换封装
 * @param str 字符串
 * @param pattern 正则表达式或字符串
 * @param replacer 替换函数或字符串
 * @returns 字符串
 */
export const asyncReplaceAll =  async (str:string, pattern:string | RegExp, replacer: string | ((match: string) => Promise<string> | string)) => {
  if(typeof replacer === 'string'){
    return str.replaceAll(pattern, replacer);
  }
  if(typeof replacer !== 'function') {
    throw new TypeError('replacer must be a function or string');
  }
  //一定是个函数
  let reg;
  if(typeof pattern === 'string'){
    //字符串转正则
    reg = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  }else if(pattern instanceof RegExp){
    if(!pattern.global){
      throw new TypeError('pattern must be a global RegExp');
    }
    reg = new RegExp(pattern);
  }else{
    throw new TypeError('pattern must be a string or a global RegExp');
  }
  //replacer是个函数
  //reg是个全局正则
  const matchs = str.match(reg) || [];

  const result = await Promise.all(matchs.map(m => replacer(m)));//等待所有替换完成
  return str.replace(reg, (p) => result.shift() || p);
}