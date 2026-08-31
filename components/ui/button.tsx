import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-violet text-night shadow-[0_0_28px_rgba(168,117,255,.22)] hover:bg-lavender hover:shadow-[0_0_42px_rgba(168,117,255,.35)]",
        outline: "border border-white/15 bg-white/[.04] text-ink backdrop-blur-xl hover:border-violet/70 hover:bg-violet/10",
        ghost: "text-muted hover:bg-white/[.06] hover:text-ink",
        dark: "bg-white text-night hover:bg-lavender",
        link: "rounded-none border-b border-violet/70 px-0 text-violet hover:border-lavender hover:text-lavender"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
