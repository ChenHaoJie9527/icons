"use client";

import { motion } from "motion/react";
import type { HTMLAttributes, Ref } from "react";
import { fade, variants, scale, transition, slide } from "@/lib/build-variants";
import {
  useIconHoverAnimation,
  type IconAnimationHandle,
} from "@/hooks/use-icon-hover-animation";

import { cn } from "@/lib/utils";

export interface AArrowDownIconHandle extends IconAnimationHandle {}

interface AArrowDownIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: Ref<AArrowDownIconHandle>;
}

const LETTER_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  scale({ from: 0.8, to: 1 }),
  transition({ duration: 0.3 })
);

const ARROW_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  slide({ y: 10 }),
  transition({ duration: 0.3, delay: 0.2 })
);

const AArrowDownIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ref,
  ...props
}: AArrowDownIconProps) => {
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
          d="M3.304 13h6.392"
          variants={LETTER_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"
          variants={LETTER_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="M18 16V7"
          variants={ARROW_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="m14 12 4 4 4-4"
          variants={ARROW_VARIANTS}
        />
      </svg>
    </div>
  );
};

AArrowDownIcon.displayName = "AArrowDownIcon";

export { AArrowDownIcon };
