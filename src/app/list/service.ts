import { getFetcher } from "@/common/fetchers"
import MockData from './mockUsers.json'
export interface IWork{
  ID: number
  media: {
    type: string
    url: string
  }
}
export const fetchListData = async (p:{limit: number; offset: number}) => {
  const params = p
  const res = await getFetcher<{results: IWork[], total:number}>(process.env.NEXT_PUBLIC_XTER_API+`/xgc/v1/work/list`, params).catch(()=> MockData.data)
  return res || MockData.data
}