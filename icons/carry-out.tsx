"use client";

import { motion } from "motion/react";
import type { HTMLAttributes, Ref } from "react";
import {
  useIconHoverAnimation,
  type IconAnimationHandle,
} from "@/hooks/use-icon-hover-animation";
import { variants, fade, transition, drawPath } from "@/lib/build-variants";
import { cn } from "@/lib/utils";

export interface CarryOutIconHandle extends IconAnimationHandle {}

/**
 * 勾选标记的 path 命令顺序，决定了“从哪儿开始画到哪儿结束”。
 */
/**
 * 路径起点在左（M336 545），终点在右上（688 420）
 * pathOffset: from=0 → 从起点向终点绘制，即从左到右
 */
const PATH_VARIANTS = variants(
  fade(),
  drawPath({ pathOffset: { from: 0, to: 0 } }), // 从左到右绘制
  transition({ duration: 0.5, ease: "easeInOut" })
);

interface CarryOutIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: Ref<CarryOutIconHandle>;
}

const CarryOutIcon = ({
  ref,
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ...props
}: CarryOutIconProps) => {
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
        viewBox="0 0 1024 1024"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 外框轮廓：卡片边框 + 顶部左右两个活页夹扣 */}
        <motion.path
          d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32z"
          fill="currentColor"
        />
        {/* 内部背景区域：卡片主体填充色，含夹扣缺口（m-40 656 → 绝对坐标 M840 840） */}
        <motion.path
          d="M840 840H184V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v584z"
          fill="white"
        />
        {/* 勾选标记（✓）：描边折线，从左到右绘制 */}
        <motion.path
          animate={controls}
          d="M336 545 L470 710 L688 420"
          strokeWidth="60"
          variants={PATH_VARIANTS}
        />
      </svg>
    </div>
  );
};

CarryOutIcon.displayName = "CarryOutIcon";

export { CarryOutIcon };
