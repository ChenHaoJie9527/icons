"use client";

import { useAnimation, motion } from "motion/react";
import type { HTMLAttributes, Ref } from "react";
import { useCallback, useImperativeHandle, useRef } from "react";
import { variants, fade, transition, slide } from "@/lib/build-variants";

import { cn } from "@/lib/utils";

export interface ApiAntDesignIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ApiAntDesignIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: Ref<ApiAntDesignIconHandle>;
}

/**
 * @description 右上部分变体
 * @type {Variants}
 * @param config - 配置
 * @returns {Variants} - 变体
 */
const RIGHT_UP_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  slide({ x: -100, y: 100 }),
  transition({ duration: 0.4 })
);

/**
 * @description 左下部分变体
 * @type {Variants}
 * @param config - 配置
 * @returns {Variants} - 变体
 */
const LEFT_DOWN_VARIANTS = variants(
  fade({ from: 0, to: 1 }),
  slide({ x: 100, y: -100 }),
  transition({ duration: 0.4 })
);

const ApiAntDesignIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ref,
  ...props
}: ApiAntDesignIconProps) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start("animate");
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start("normal");
      }
    },
    [controls, onMouseLeave]
  );

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
        width={size}
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 右上 / 中上 部分 */}
        <motion.path
          animate={controls}
          d="
    M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4z
    M769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4z
  "
          variants={RIGHT_UP_VARIANTS}
        />

        {/* 左下 / 中下 部分 */}
        <motion.path
          animate={controls}
          d="
    M578.9 546.7a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2z
    M441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z
  "
          variants={LEFT_DOWN_VARIANTS}
        />
      </svg>
    </div>
  );
};

ApiAntDesignIcon.displayName = "ApiAntDesignIcon";

export { ApiAntDesignIcon };
