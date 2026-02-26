"use client";

import { motion } from "motion/react";
import type { HTMLAttributes, Ref } from "react";
import {
  useIconHoverAnimation,
  type IconAnimationHandle,
} from "@/hooks/use-icon-hover-animation";
import {
  variants,
  fade,
  scaleX,
  slide,
  spring,
  transition,
} from "@/lib/build-variants";
import { cn } from "@/lib/utils";

export interface AliyunIconHandle extends IconAnimationHandle {}

/** 右侧区块：从右侧弹入（x 从 +80 → 0） */
const RIGHT_BLOCK_VARIANTS = variants(
  fade(),
  slide({ x: -80 }),
  spring({ stiffness: 500, damping: 14, delay: 0.2 })
);

/** 左侧区块：从左侧弹入（x 从 -80 → 0） */
const LEFT_BLOCK_VARIANTS = variants(
  fade(),
  slide({ x: 80 }),
  spring({ stiffness: 500, damping: 14, delay: 0.2 })
);

/** 中间横条：从中心向两侧展开，稍作延迟，在两侧区块落定后出现 */
const MIDDLE_BAR_VARIANTS = variants(
  fade(),
  scaleX({ origin: "center" }),
  transition({ duration: 0.3, ease: "easeOut", delay: 0.18 })
);

interface AliyunIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: Ref<AliyunIconHandle>;
}

const AliyunIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ref,
  ...props
}: AliyunIconProps) => {
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
        fill="currentColor"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 1024 1024"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 右侧区块：从右弹入 */}
        <motion.path
          animate={controls}
          d="M959.2 383.9c-.3-82.1-66.9-148.6-149.1-148.6H575.9l21.6 85.2 201 43.7a42.58 42.58 0 0 1 32.9 39.7c.1.5.1 216.1 0 216.6a42.58 42.58 0 0 1-32.9 39.7l-201 43.7-21.6 85.3h234.2c82.1 0 148.8-66.5 149.1-148.6V383.9z"
          variants={RIGHT_BLOCK_VARIANTS}
        />
        {/* 左侧区块：从左弹入 */}
        <motion.path
          animate={controls}
          d="M225.5 660.4a42.58 42.58 0 0 1-32.9-39.7c-.1-.6-.1-216.1 0-216.6.8-19.4 14.6-35.5 32.9-39.7l201-43.7 21.6-85.2H213.8c-82.1 0-148.8 66.4-149.1 148.6V641c.3 82.1 67 148.6 149.1 148.6H448l-21.6-85.3-200.9-43.9z"
          variants={LEFT_BLOCK_VARIANTS}
        />
        {/* 中间横条：从左到右展开 */}
        <motion.path
          animate={controls}
          d="M426.4 501.6h171v21.3h-171z"
          variants={MIDDLE_BAR_VARIANTS}
        />
      </svg>
    </div>
  );
};

AliyunIcon.displayName = "AliyunIcon";

export { AliyunIcon };
