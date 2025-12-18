'use client'

import { Button, Card, Flex, TextField } from "@radix-ui/themes"
import { createPost, FormState } from "../actions"
import { useActionState } from "react"

const initialState:FormState = {
  success: false,
  error: '',
}

export const PostForm = () => {
  // useActionState<State, Payload>(action, initialState)
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <Card>
      <form  action={formAction}>
        <Flex direction={'column'} gap={'4'}>
        <TextField.Root name="title" placeholder="title"></TextField.Root>
        {state?.error && <p className="text-red-500">{state.error}</p>}
        <Button disabled={pending}>{pending ? 'Submit...': 'Submit'}</Button>
        </Flex>
      </form>
    </Card>
  )
}