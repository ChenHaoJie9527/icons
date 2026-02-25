"use client";

import { motion } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import {
  useIconHoverAnimation,
  type IconAnimationHandle,
} from "@/hooks/use-icon-hover-animation";

import { variants, fade, drawPath, transition } from "@/lib/build-variants";

import { cn } from "@/lib/utils";

export interface ActivityIconHandle extends IconAnimationHandle {}

interface ActivityIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const VARIANTS = variants(
  fade(),
  drawPath(),
  transition({ duration: 0.6, ease: "easeInOut" })
);

const ActivityIcon = forwardRef<ActivityIconHandle, ActivityIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const { controls, handleMouseEnter, handleMouseLeave } =
      useIconHoverAnimation({
        ref,
        onMouseEnter,
        onMouseLeave,
      });

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            // d="M22 12h-2.48 ... H2" 这条 path 的命令顺序，决定了“从哪儿开始画到哪儿结束”。
            // 在这条路径里，起点在右边（靠 22 那边），终点在左边（靠 2 那边），所以它的“自然方向”就是从右到左。
            d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
            initial="normal"
            variants={VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

ActivityIcon.displayName = "ActivityIcon";

export { ActivityIcon };
