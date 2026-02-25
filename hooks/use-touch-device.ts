"use client";

import { useEffect, useState } from "react";

/**
 * @description 判断是否是触摸设备
 * @returns {boolean} 是否是触摸设备
 */
const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasTouchScreen =
      "ontouchstart" in window || // 支持触摸事件
      navigator.maxTouchPoints > 0 || // 触摸点数量 > 0
      // @ts-expect-error - legacy property
      navigator.msMaxTouchPoints > 0; // IE 兼容

    setIsTouchDevice(hasTouchScreen);
  }, []);

  return isTouchDevice;
};

export { useTouchDevice };
