import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-black/10 bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 data-[state=checked]:bg-sky-400",
      className
    )}
    ref={ref}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-[#eee] shadow transition-transform data-[state=checked]:translate-x-[22px]" />
  </SwitchPrimitives.Root>
));

Switch.displayName = "Switch";

export { Switch };

