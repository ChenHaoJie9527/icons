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
 * @description 路径绘制配置（SVG path 描边动画）
 * @type {DrawPathConfig}
 * @property {{ from?: number; to?: number }} pathLength - 路径长度（0 = 不可见，1 = 完整）
 * @property {{ from?: number; to?: number }} pathOffset - 路径偏移（0 = 正常位置，1 = 完全偏移）
 */
type DrawPathConfig = {
  pathLength?: { from?: number; to?: number };
  pathOffset?: { from?: number; to?: number };
};

/**
 * @description X 轴缩放配置（填充型形状的展开动画）
 * @type {ScaleXConfig}
 * @property {number} from - 起始缩放值（默认 0）
 * @property {number} to - 结束缩放值（默认 1）
 * @property {"left" | "center" | "right"} origin - 展开原点（默认 "left"）
 */
type ScaleXConfig = {
  from?: number;
  to?: number;
  origin?: "left" | "center" | "right";
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
 * @property {DrawPathConfig | null} drawPath - 路径描边动画配置
 * @property {CommonConfig} common - 通用配置
 */
export type VariantConfig = {
  fade?: FadeConfig;
  scale?: ScaleConfig;
  scaleX?: ScaleXConfig | null;
  slide?: SlideConfig | null;
  drawPath?: DrawPathConfig | null;
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
const ORIGIN_X_MAP = { left: 0, center: 0.5, right: 1 } as const;

/**
 * @description 构建路径描边属性
 * @type {buildDrawPathProps}
 * @param {DrawPathConfig | null} drawPath - 路径描边配置
 * @returns {Object} - 路径描边属性
 * @property {Object} normal - 正常状态属性
 * @property {Object} animate - 动画状态属性
 * @property {number} normal.pathLength - 路径长度
 * @property {number} normal.pathOffset - 路径偏移
 * @property {number[]} animate.pathLength - 路径长度动画
 * @property {number[]} animate.pathOffset - 路径偏移动画
 */
const buildDrawPathProps = (drawPath: DrawPathConfig | null) => {
  if (!drawPath) return { normal: {}, animate: {} };
  const from = drawPath.pathLength?.from ?? 0;
  const to = drawPath.pathLength?.to ?? 1;
  const offsetFrom = drawPath.pathOffset?.from ?? 1;
  const offsetTo = drawPath.pathOffset?.to ?? 0;
  return {
    normal: { pathLength: to, pathOffset: offsetTo },
    animate: { pathLength: [from, to], pathOffset: [offsetFrom, offsetTo] },
  };
};

/**
 * @description 构建 X 轴缩放属性
 * @type {buildScaleXProps}
 * @param {ScaleXConfig | null} scaleX - X 轴缩放配置
 * @returns {Object} - X 轴缩放属性
 * @property {Object} normal - 正常状态属性
 * @property {Object} animate - 动画状态属性
 * @property {number} normal.scaleX - X 轴缩放
 * @property {number} normal.originX - X 轴原点
 * @property {number[]} animate.scaleX - X 轴缩放动画
 * @property {number} animate.originX - X 轴原点动画
 */
const buildScaleXProps = (scaleX: ScaleXConfig | null) => {
  if (!scaleX) return { normal: {}, animate: {} };
  const from = scaleX.from ?? 0;
  const to = scaleX.to ?? 1;
  const originX = ORIGIN_X_MAP[scaleX.origin ?? "left"];
  return {
    normal: { scaleX: to, originX },
    animate: { scaleX: [from, to], originX },
  };
};

const buildVariants = (config: VariantConfig): Variants => {
  const {
    common = {},
    fade = {},
    scale = {},
    scaleX = null,
    slide = null,
    drawPath = null,
  } = config;

  const duration = common.transition?.duration ?? common.duration ?? 0.3;
  const fromOpacity = fade.from ?? 0;
  const toOpacity = fade.to ?? 1;
  const fromScale = scale.from ?? 1;
  const toScale = scale.to ?? 1;
  const slideX = slide?.x ?? 0;
  const slideY = slide?.y ?? 0;
  const delay = common.transition?.delay ?? slide?.delay ?? 0;
  const ease = common.transition?.ease;

  // 构建路径描边和 X 轴缩放属性
  const dp = buildDrawPathProps(drawPath);
  const sx = buildScaleXProps(scaleX);

  return {
    normal: {
      opacity: toOpacity,
      scale: toScale,
      x: 0,
      y: 0,
      ...dp.normal,
      ...sx.normal,
    },
    animate: {
      opacity: [fromOpacity, toOpacity],
      scale: [fromScale, toScale],
      x: slideX ? [-slideX, 0] : 0,
      y: slideY ? [-slideY, 0] : 0,
      ...dp.animate,
      ...sx.animate,
      transition: {
        duration,
        delay,
        ...(ease ? { ease } : {}),
      },
    },
  };
};

/**
 * @description 把若干个步骤函数组合成一个管道，并返回最终 Variants
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

/**
 * @description X 轴缩放步骤函数（适用于填充型形状的展开动画）
 *   - 通过 originX 控制展开原点，无需在元素上手动设置 transformOrigin
 * @type {scaleX}
 * @param {ScaleXConfig} opts - X 轴缩放配置
 * @returns {VariantStep} - 步骤函数
 *
 * @example
 * // 从左到右展开（默认）
 * variants(fade(), scaleX(), transition({ duration: 0.4, ease: "easeInOut" }))
 *
 * @example
 * // 从右到左收缩再展开
 * variants(scaleX({ origin: "right" }))
 */
const scaleX =
  (opts: ScaleXConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    scaleX: {
      ...(cfg.scaleX ?? {}),
      ...opts,
    },
  });

/**
 * @description SVG 路径描边动画步骤函数
 *   - pathLength: 控制路径可见长度（0 = 不可见，1 = 完整路径）
 *   - pathOffset: 控制路径起点偏移（0 = 正常，1 = 完全偏移，与 pathLength 配合实现描边方向）
 * @type {drawPath}
 * @param {DrawPathConfig} opts - 路径描边配置
 * @returns {VariantStep} - 步骤函数
 *
 * @example
 * // 从右到左描边（默认行为）
 * variants(fade(), drawPath(), transition({ duration: 0.6, ease: "easeInOut" }))
 *
 * @example
 * // 从左到右描边（反向）
 * variants(drawPath({ pathOffset: { from: -1, to: 0 } }))
 */
const drawPath =
  (opts: DrawPathConfig = {}): VariantStep =>
  (cfg) => ({
    ...cfg,
    drawPath: {
      ...(cfg.drawPath ?? {}),
      ...opts,
    },
  });

export { variants, fade, scale, scaleX, slide, duration, transition, drawPath };
