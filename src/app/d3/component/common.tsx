import { cn } from "@/common/utils";

export const ChartFrame = ({title, children, className}: {title: string; children: React.ReactNode; className?: string}) => {
  return (
    <div className={cn("relative bg-no-repeat bg-cover bg-center bg-[url(/images/line.png)]", 'border-[1px] border-[rgba(25,186,139,0.17)] p-2', className)}>
      <div className="absolute top-0 left-0 w-3 h-3 border-l-[2px] border-t-[2px] border-[#02a6b5]"/>
      <div className="absolute top-0 right-0 w-3 h-3 border-r-[2px] border-t-[2px] border-[#02a6b5]"/>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-[2px] border-b-[2px] border-[#02a6b5]"/>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-[2px] border-b-[2px] border-[#02a6b5]"/>
      <h2 className='text-xs text-center mb-2'>{title}</h2>
      {children}
    </div>
  )
}