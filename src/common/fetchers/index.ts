import qs from 'query-string'

interface FetcherConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  params?: Record<string, unknown>
  headers?: Record<string, string>
  data?: unknown
  timeout?: number
  Authorization?: string
}

interface IResponse<T> {
  data: T
  err_code: number
  err_msg?: string
}

//请求成功处理
const resolveResp = async <T>(resp: Response):Promise<T> => {
  const res: IResponse<T> = await resp.json() //{err_code,data}
  if(res?.err_code !== 0){
    if (resp.status === 401 || resp.status === 403) {
      console.log('Your session has expired, please sign in again.')
      // loginEvent.emit('Expired')
    } else if (resp.status === 429) {
      console.log('Operating too frequently, please try again later.')
    }
    console.error('status', resp.status, 'statusText', resp.statusText, 'err_code', res.err_code, 'err_msg', res.err_msg)
    return Promise.reject(res)
  }
  return res.data
}

//请求失败处理
const onFetchError = (err:any, p: RequestInit) => {
  const errorInfo = {
    ...p,
    stack: err?.stack || err || 'none',
    _event: 'catchApiError',
    time: +new Date()
  }
  console.error(JSON.stringify(errorInfo))
}

const fullUrl = (apiPath: string, apiBase?: string): string => {
  if (!apiBase || /^https?:\/\//i.test(apiPath)) {
    return apiPath
  }
  if (apiPath.startsWith('/')) {
    return `${apiBase}${apiPath}`
  } else {
    return `${apiBase}/${apiPath}`
  }
}

//基础fetcher实现
const fetcher = async <T>(config: FetcherConfig):Promise<T> => {
  const { method, path:initPath, params, headers={}, data, timeout=10000, Authorization } = config;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout); // 10秒超时

  //合并全局参数和用户传入的参数
  const mergedParams = {
    season_id: 1,
    ...params,
  }
  // 处理 query params, https://api.playvrs.net, https://api.xterio.net, https://api.xter.io
  let path = initPath
  const hasParams = Object.keys(mergedParams).length > 0;
  if (hasParams) {
    const queryParam = qs.stringify(mergedParams)
    path = path.indexOf('?') !== -1 ? `${path}&${queryParam}` : `${path}?${queryParam}`
  }
  // 这里拼接完整的地址，主要在next.config.ts中配置代理，network有两边请求，第一遍308,第二遍200
  let finalUrl = fullUrl(path, 'https://api.xter.io')

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(Authorization ? { 'Authorization': Authorization } : {}),
      ...headers
    },
    signal: controller.signal,
  }

  if(data){
    // body: PUT 和 application/x-www-form-urlencoded 提交的是表单数据，不能stringify
    const needStringify = method !== 'PUT' && headers?.['Content-Type'] !== 'application/x-www-form-urlencoded'
    requestOptions.body = needStringify ? JSON.stringify(data) : (data as ReadableStream)
  }
  const req = new Request(finalUrl, requestOptions)
  try{
    const resp = await fetch(req)
    clearTimeout(timeoutId)
    return method === 'PUT' ? (resp as T) : resolveResp<T>(resp)
  }catch(error){
    clearTimeout(timeoutId);
    onFetchError(error, requestOptions)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
    }
    throw error;
  }
}


export async function getFetcher<T>(
  path: string,
  params?: Record<string, unknown>,
  Authorization?: string
): Promise<T> {
  return fetcher({
    method: 'GET',
    path,
    params,
    Authorization
  })
}

export async function postFetch<T, D>(
  path: string,
  data?: D,
  Authorization?: string,
  headers?: Record<string, string>
): Promise<T> {
  return fetcher({
    method: 'POST',
    path,
    data,
    headers,
    Authorization
  })
}

export async function deleteFetcher<T, D>(path: string, data: D): Promise<T> {
  return fetcher({
    method: 'DELETE',
    path,
    data
  })
}

export async function putFetcher<T, D>(path: string, data: D, headers?: Record<string, string>): Promise<T> {
  return fetcher({
    method: 'PUT',
    path,
    data,
    headers
  })
}

export async function patchFetcher<T, D>(
  path: string,
  data: D,
  headers?: Record<string, string>,
  Authorization?: string
): Promise<T> {
  return fetcher({
    method: 'PATCH',
    path,
    data,
    headers,
    Authorization
  })
}