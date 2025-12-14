
//并发请求处理队列，用于处理并发请求
type QueueItem = () => Promise<unknown>
export class BatchRequest {
    private queue: QueueItem[] = [];
    private maxCount: number = 5;
    private currentCount: number = 0;

    constructor() {
      this.maxCount = 5
      this.currentCount = 0
    }

    add(req: () => Promise<unknown>): void {
      this.queue.push(req);
      this.run();
    }
    run(){
      if(this.currentCount >= this.maxCount) return
      if(!this.queue?.length) return

      this.currentCount++
      const req = this.queue.shift()
      req?.().finally(() =>{ 
        this.currentCount--;
        this.run()
      });
    }
    clear(){
      this.queue = []
      this.currentCount = 0
    }
}
