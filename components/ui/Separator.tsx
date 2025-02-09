import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * 
 * USAGE EXAMPLES
 * 
 * const Usage = () => (
  <div>
    <Separator gradient />
    <Separator />
    <Separator label={<span className="px-2">Section</span>} gradient />
    <Separator label={<span className="px-2">Section</span>} />
    <Separator
      label={
        <div className="border px-4 py-1 rounded-full border-dashed">
          Section
        </div>
      }
      gradient
    />
    <Separator
      label={<div className="border px-4 py-1 rounded-full">Section</div>}
    />
    <Separator
      label={
        <div className="border px-12 py-2 rounded-full">
          <FaPlus />
        </div>
      }
      gradient
    />
  </div>
);
 */
type SeparatorProps = {
  /**
   * @default ""
   */
  label?: React.ReactNode;
  /**
   * @default false
   */
  gradient?: boolean;
  className?: string;
};
//======================================
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
