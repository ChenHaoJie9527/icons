/**
 * @description useIconHoverAnimation is a hook that animates an icon when hovered.
 * @description 封装 useAnimation、useRef、UseImperativeHandle、useCallback 等方法，实现 icon 的 hover 动画
 * @description 返回 controls 给 <motion.path /> 使用
 */

import { useAnimation } from "motion/react";
import type { Ref, MouseEvent, MouseEventHandler } from "react";
import { useCallback, useImperativeHandle, useRef } from "react";

export interface IconAnimationHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

/**
 * @description 继承 IconAnimationHandle 接口，用于约束 ref 的类型
 */
interface UseIconHoverAnimationParams {
  ref?: Ref<IconAnimationHandle>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

/**
 *
 * @description 使用 useAnimation 创建动画控制器，并返回 controls 给 <motion.path /> 使用
 * @param params 参数
 * @param params.ref 引用 ref
 * @param params.onMouseEnter 鼠标进入事件
 * @param params.onMouseLeave 鼠标离开事件
 * @returns controls 给 <motion.path /> 使用
 */
export function useIconHoverAnimation({
  ref,
  onMouseEnter,
  onMouseLeave,
}: UseIconHoverAnimationParams) {
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
    (e: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start("animate");
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start("normal");
      }
    },
    [controls, onMouseLeave]
  );

  return {
    controls,
    handleMouseEnter,
    handleMouseLeave,
  };
}
