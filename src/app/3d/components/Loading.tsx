import { Cpu } from "lucide-react";

export const Loading = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-cyan-400">
      <div className="flex flex-col items-center animate-pulse">
        <Cpu size={48} className="mb-4 animate-spin" />
        <h1 className="text-2xl font-mono tracking-widest">
          Loading...
        </h1>
      </div>
    </div>
  );
};
