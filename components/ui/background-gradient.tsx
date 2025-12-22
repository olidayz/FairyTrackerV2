import { cn } from "../../lib/utils";
import React from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn("relative p-[1px] group", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-[2.5rem] z-[1] opacity-40 group-hover:opacity-80 blur-md transition duration-500 will-change-transform",
          // UPDATED COLORS: Cyan (#06b6d4), Purple (#a855f7), Amber (#f59e0b), Fuchsia (#d946ef)
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#06b6d4,transparent),radial-gradient(circle_farthest-side_at_100%_0,#a855f7,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#f59e0b,transparent),radial-gradient(circle_farthest-side_at_0_0,#d946ef,#141316)]",
          animate && "animate-gradient-move"
        )}
        style={{
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-[2.5rem] z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#06b6d4,transparent),radial-gradient(circle_farthest-side_at_100%_0,#a855f7,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#f59e0b,transparent),radial-gradient(circle_farthest-side_at_0_0,#d946ef,#141316)]",
           animate && "animate-gradient-move"
        )}
        style={{
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};