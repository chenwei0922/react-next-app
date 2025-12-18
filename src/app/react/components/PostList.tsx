'use client'

import { use } from "react"
import { Post } from "../lib/db"

export const PostList = ({posts}:{posts: Promise<Post[]>}) => {
  const data = use(posts)
  return (
    <ul>
      {data.map(post=> (
        <li key={post.id}>{post.title}</li>
      )
      )}
    </ul>
  )
}