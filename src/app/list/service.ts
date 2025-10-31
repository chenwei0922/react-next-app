import { getFetcher } from "@/common/fetchers"

export interface IWork{
  ID: number
  media: {
    type: string
    url: string
  }
}
export const fetchListData = async (p:{limit: number; offset: number}) => {
  const params = p
  const res = await getFetcher<{results: IWork[], total:number}>(`/xgc/v1/work/list`, params)
  return res
}