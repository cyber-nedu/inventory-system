import React from "react";
import { CirclePile } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-foreground max-[479px]:h-9 max-[479px]:w-9 max-[359px]:h-8 max-[359px]:w-8">
        <CirclePile className="h-6 w-6 max-[479px]:h-5.5 max-[479px]:w-5.5 max-[359px]:h-5 max-[359px]:w-5" />
      </div>

      <span className="font-sans text-4xl font-bold tracking-tight text-text max-[479px]:text-3xl max-[359px]:text-2xl">
        KYYP
      </span>
    </div>
  );
};

export default Logo;