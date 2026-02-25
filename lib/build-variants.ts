import type { Easing, Variants } from "motion/react";

/**
 * @description 淡入淡出配置
 * @type {FadeConfig}
 * @property {number} from - 开始值
 * @property {number} to - 结束值
 */
type FadeConfig = {
  from?: number;
  to?: number;
};

/**
 * @description 缩放配置
 * @type {ScaleConfig}
 * @property {number} from - 开始值
 * @property {number} to - 结束值
 */
type ScaleConfig = {
  from?: number;
  to?: number;
};

/**
 * @description 平移配置（支持 X / Y）
 * @type {SlideConfig}
 * @property {number} x - X 轴位移
 * @property {number} y - Y 轴位移
 * @property {number} delay - 延迟
 */
type SlideConfig = {
  x?: number;
  y?: number;
  delay?: number;
};

/**
 * @description 过渡配置
 * @type {TransitionConfig}
 * @property {number} duration - 持续时间
 * @property {number} delay - 延迟
 * @property {string | number[]} ease - 缓动
 */
type TransitionConfig = {
  duration?: number;
  delay?: number;
  ease?: Easing | Easing[];
};

/**
 * @description 通用配置
 * @type {CommonConfig}
 * @property {number} duration - 持续时间
 * @property {TransitionConfig} transition - 过渡配置
 */
type CommonConfig = {
  duration?: number;
  transition?: TransitionConfig;
};

/**
 * @description 中间态配置，所有步骤函数都只处理这个结构
 * @type {VariantConfig}
 * @property {FadeConfig} fade - 淡入淡出配置
 * @property {ScaleConfig} scale - 缩放配置
 * @property {SlideConfig | null} slide - 平移配置
 * @property {CommonConfig} common - 通用配置
 */
export type VariantConfig = {
  fade?: FadeConfig;
  scale?: ScaleConfig;
  slide?: SlideConfig | null;
  common?: CommonConfig;
};

/**
 * @description 步骤函数
 * @type {VariantStep}
 * @param {VariantConfig} config - 配置
 * @returns {VariantConfig} - 配置
 */
export type VariantStep = (config: VariantConfig) => VariantConfig;

/**
 * @description 构建变体
 * @type {buildVariants}
 * @param config - 配置
 * @returns {Variants} - 变体
 */
const buildVariants = (config: VariantConfig): Variants => {
  const { common = {}, fade = {}, scale = {}, slide = null } = config;

  const duration = common.transition?.duration ?? common.duration ?? 0.3;
  const fromOpacity = fade.from ?? 0;
  const toOpacity = fade.to ?? 1;
  const fromScale = scale.from ?? 1;
  const toScale = scale.to ?? 1;
  const slideX = slide?.x ?? 0;
  const slideY = slide?.y ?? 0;
  const delay = common.transition?.delay ?? slide?.delay ?? 0;
  const ease = common.transition?.ease;

  return {
    normal: {
      opacity: toOpacity,
      scale: toScale,
      x: 0,
      y: 0,
    },
    animate: {
      opacity: [fromOpacity, toOpacity],
      scale: [fromScale, toScale],
      x: slideX ? [-slideX, 0] : 0,
      y: slideY ? [-slideY, 0] : 0,
      transition: {
        duration,
        delay,
        ...(ease ? { ease } : {}),
      },
    },
  };
};

/**
 * 把若干个步骤函数组合成一个管道，并返回最终 Variants
 * @type {variants}
 * @param {VariantStep[]} steps - 步骤函数
 * @returns {Variants} - 变体
 */
const variants = (...steps: VariantStep[]): Variants => {
  const config = steps.reduce<VariantConfig>((acc, step) => step(acc), {});

  return buildVariants(config);
};

/**
 * @description 淡入淡出步骤函数
 * @type {fade}
 * @param {FadeConfig} opts - 配置
 * @returns {VariantStep} - 步骤函数
 */
const fade =
  (opts: FadeConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    fade: {
      ...(cfg?.fade ?? {}),
      ...opts,
    },
  });

/**
 * @description 缩放步骤函数
 * @type {scale}
 * @param {ScaleConfig} opts - 配置
 * @returns {VariantStep} - 步骤函数
 */
const scale =
  (opts: ScaleConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    scale: {
      ...(cfg.scale ?? {}),
      ...opts,
    },
  });

/**
 * @description 垂直滑动步骤函数
 * @type {slide}
 * @param {SlideConfig} opts - 配置
 * @returns {VariantStep} - 步骤函数
 */
const slide =
  (opts: SlideConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    slide: {
      ...(cfg.slide ?? {}),
      ...opts,
    },
  });

/**
 * @description 持续时间步骤函数
 * @type {duration}
 * @param {number} value - 持续时间
 * @returns {VariantStep} - 步骤函数
 */
const duration =
  (value: number): VariantStep =>
  (cfg) => ({
    ...cfg,
    common: {
      ...(cfg.common ?? {}),
      duration: value,
    },
  });

/**
 * @description 过渡配置步骤函数（统一管理 duration / delay / ease）
 * @type {transition}
 * @param {TransitionConfig} opts - 过渡配置
 * @returns {VariantStep} - 步骤函数
 */
const transition =
  (opts: TransitionConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    common: {
      ...(cfg.common ?? {}),
      transition: {
        ...(cfg.common?.transition ?? {}),
        ...opts,
      },
    },
  });

export { variants, fade, scale, slide, duration, transition };
