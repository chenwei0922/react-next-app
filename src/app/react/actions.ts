'use server'

import { revalidatePath } from "next/cache"
import { addPost } from "./lib/db"

export type FormState = {
  error?: string;
  success?: boolean;
}

export const createPost = async (prevState: FormState, formData: FormData):Promise<FormState> => {
  const title = formData.get('title') as string
  if(!title) return {error: 'title is required'}
  await addPost(title)
  revalidatePath('/') //刷新页面数据
  return {success: true}
}
