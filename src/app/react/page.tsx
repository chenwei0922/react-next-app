import { Suspense } from "react"
import { getPosts } from "./lib/db"
import { PostForm } from "./components/PostForm"
import { PostList } from "./components/PostList"

export default function Page() {
  const postPromise = getPosts()

  return (
    <main className="p-4">
      <h1>React19</h1>
      <PostForm />
      <Suspense fallback={<div>Loading...</div>}>
        <PostList posts={postPromise} />
      </Suspense>
    </main>
  )
}