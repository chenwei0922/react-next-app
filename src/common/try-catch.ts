type SuccessResult<T> = readonly [T, null];
type ErrorResult<E=Error> = readonly [null, E];
type Result<T, E=Error> = SuccessResult<T> | ErrorResult<E>;

// 1. SuccessResult<T>：表示成功的结果类型，包含一个类型为T的值和一个null值。
// 2. ErrorResult<E=Error>：表示失败的结果类型，包含一个null值和一个类型为E的值。
// 3. Result<T, E=Error>：表示成功或失败的结果类型，可以是SuccessResult<T>或ErrorResult<E>。
// 4. tryCatch：一个异步函数，接受一个Promise<T>类型的参数，返回一个Result<T, E>类型的Promise。
// 5. tryCatchSync：一个同步函数，接受一个()=>T类型的参数，返回一个Result<T, E>类型的值。
// 6. tryCatch和tryCatchSync函数都用于处理异步和同步操作中的错误，返回一个包含结果和错误的对象。
// 7. tryCatch和tryCatchSync函数的返回值类型都是Result<T, E>，其中T是操作成功时的结果类型，E是操作失败时的错误类型。
// 示例
// const [data, error] = await tryCatch(fetchData());
export const tryCatch = async <T, E=Error>(promise:Promise<T>):Promise<Result<T, E>> => {
  try {
    const data = await promise;
    return [data, null] as const;
  }catch (error) {
    return [null, error as E] as const;
  }
}

export const tryCatchSync = <T, E=Error>(fn:()=>T):Result<T, E> => {
  try {
    const data = fn();
    return  [data, null] as const;
  }catch (error) {
    return [null, error as E] as const;
  }
}