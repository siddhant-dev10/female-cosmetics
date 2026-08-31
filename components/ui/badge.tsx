import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-violet/25 bg-violet/10 px-3 py-1 text-[10px] uppercase tracking-[.18em] text-lavender", className)} {...props} />;
}
