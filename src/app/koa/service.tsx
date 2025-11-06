import { getFetcher, postFetch } from "@/common/fetchers"

interface IRegisterParams{
  email: string; password: string; name: string
}
interface IRegisterResp{
  email:string; name: string; token:string
  _id: string
}
export const postRegister = (data:IRegisterParams) => {
  return postFetch<IRegisterResp,IRegisterParams>(`/auth/register`, data)
}

export const postLogin = (data:Omit<IRegisterParams, 'name'>) => {
  return postFetch<IRegisterResp, Omit<IRegisterParams, 'name'>>(`/auth/login`, data)
}

export const getProfile = (token:string) => {
  return getFetcher(`/users/me`, undefined, `Bearer ${token}`)
}