
export type Post = {
  id: number;
  title: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Hello World',
  },
  {
    id: 2,
    title: 'Hello React',
  },
];

export const getPosts = async () => {
  await new Promise(r=> setTimeout(r, 1000))
  return posts;
}


export const addPost = async (title: string) => {
  await new Promise(r=> setTimeout(r, 1000))
  posts.push({id: Date.now(), title})
}