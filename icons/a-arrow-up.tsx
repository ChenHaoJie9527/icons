"use client";

import { motion } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { fade, variants, scale, transition, slide } from "@/lib/build-variants";
import {
  useIconHoverAnimation,
  type IconAnimationHandle,
} from "@/hooks/use-icon-hover-animation";

import { cn } from "@/lib/utils";

export interface AArrowUpIconHandle extends IconAnimationHandle {}

interface AArrowUpIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LETTER_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  scale({ from: 0.8, to: 1 }),
  transition({ duration: 0.3 })
);

const ARROW_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  slide({ y: -10 }),
  transition({ duration: 0.3, delay: 0.2 })
);

const AArrowUpIcon = forwardRef<AArrowUpIconHandle, AArrowUpIconProps>(
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
            d="M3.5 13h6"
            variants={LETTER_VARIANTS}
          />
          <motion.path
            animate={controls}
            d="m2 16 4.5-9 4.5 9"
            variants={LETTER_VARIANTS}
          />

          <motion.path
            animate={controls}
            d="M18 16V7"
            variants={ARROW_VARIANTS}
          />
          <motion.path
            animate={controls}
            d="m14 11 4-4 4 4"
            variants={ARROW_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

AArrowUpIcon.displayName = "AArrowUpIcon";

export { AArrowUpIcon };
