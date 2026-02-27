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
 * @description 过渡配置（支持 tween 和 spring 两种模式）
 * @type {TransitionConfig}
 * @property {"tween" | "spring"} type - 过渡类型（默认 tween）
 * @property {number} duration - 持续时间（tween 专用）
 * @property {number} delay - 延迟
 * @property {Easing} ease - 缓动（tween 专用）
 * @property {number} stiffness - 弹簧刚度（spring 专用，默认 260）
 * @property {number} damping - 阻尼（spring 专用，默认 20）
 * @property {number} mass - 质量（spring 专用）
 * @property {number} bounce - 弹跳量 0~1（spring 专用）
 */
type TransitionConfig = {
  type?: "tween" | "spring";
  duration?: number;
  delay?: number;
  ease?: Easing | Easing[];
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
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
  mode?: "enter" | "hover";
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

/**
 * @description 解析过渡配置
 * @type {resolveTransition}
 * @param t - 过渡配置
 * @param duration - 持续时间
 * @param delay - 延迟
 * @returns {Object} - 过渡配置
 */
const resolveTransition = (
  t: TransitionConfig,
  duration: number,
  delay: number
) =>
  t.type === "spring"
    ? {
        type: "spring" as const,
        stiffness: t.stiffness ?? 260,
        damping: t.damping ?? 20,
        ...(t.mass !== undefined ? { mass: t.mass } : {}),
        ...(t.bounce !== undefined ? { bounce: t.bounce } : {}),
        delay,
      }
    : { duration, delay, ...(t.ease ? { ease: t.ease } : {}) };

/**
 * @description 构建入场动画变体
 * @type {buildEnterVariants}
 * @param {VariantConfig} config - 配置
 * @returns {Variants} - 变体
 */
const buildEnterVariants = (config: VariantConfig): Variants => {
  const {
    common = {},
    fade,
    scale = {},
    scaleX = null,
    slide = null,
    drawPath = null,
  } = config;

  const hasFade = fade !== undefined;
  const t = common.transition ?? {};
  const duration = t.duration ?? common.duration ?? 0.3;
  const delay = t.delay ?? slide?.delay ?? 0;
  const dp = buildDrawPathProps(drawPath);
  const sx = buildScaleXProps(scaleX);
  const slideX = slide?.x ?? 0;
  const slideY = slide?.y ?? 0;

  return {
    normal: {
      ...(hasFade ? { opacity: fade?.to ?? 1 } : {}),
      scale: scale.to ?? 1,
      x: 0,
      y: 0,
      ...dp.normal,
      ...sx.normal,
    },
    animate: {
      ...(hasFade ? { opacity: [fade?.from ?? 0, fade?.to ?? 1] } : {}),
      scale: [scale.from ?? 1, scale.to ?? 1],
      x: slideX ? [-slideX, 0] : 0,
      y: slideY ? [-slideY, 0] : 0,
      ...dp.animate,
      ...sx.animate,
      transition: resolveTransition(t, duration, delay),
    },
  };
};

const buildHoverVariants = (config: VariantConfig): Variants => {
  const { common = {}, fade, scale = {}, slide = null } = config;

  const hasFade = fade !== undefined;
  const t = common.transition ?? {};
  const duration = t.duration ?? common.duration ?? 0.3;
  const delay = t.delay ?? slide?.delay ?? 0;

  return {
    normal: {
      ...(hasFade ? { opacity: fade?.from ?? 1 } : {}),
      scale: scale.from ?? 1,
      x: 0,
      y: 0,
    },
    animate: {
      ...(hasFade ? { opacity: fade?.to ?? 1 } : {}),
      scale: scale.to ?? 1,
      x: slide?.x ?? 0,
      y: slide?.y ?? 0,
      transition: resolveTransition(t, duration, delay),
    },
  };
};

/**
 * @description 构建变体
 * @type {buildVariants}
 * @param {VariantConfig} config - 配置
 * @returns {Variants} - 变体
 */
const buildVariants = (config: VariantConfig): Variants =>
  config.mode === "hover"
    ? buildHoverVariants(config)
    : buildEnterVariants(config);

/**
 * @description 把若干个步骤函数组合成一个管道，并返回最终 Variants
 *   默认 mode 为 "enter"（入场动画），传入 hover() 后切换为 "hover"（悬停动画）
 * @param {VariantStep[]} steps - 步骤函数
 * @returns {Variants} - 变体
 */
const variants = (...steps: VariantStep[]): Variants => {
  const config = steps.reduce<VariantConfig>((acc, step) => step(acc), {});

  return buildVariants(config);
};

/**
 * @description 切换为悬停动画模式
 *   - scale({ from, to })：from = 静止缩放，to = 悬停目标缩放
 *   - slide({ x, y })：悬停时移动到的目标坐标（非入场偏移量）
 *   - fade({ from, to })：from = 静止透明度，to = 悬停目标透明度
 *
 * @example
 * variants(
 *   hover(),
 *   scale({ from: 1, to: 0.8 }),
 *   slide({ x: 3, y: -3 }),
 *   transition({ duration: 0.5, ease: "easeInOut" })
 * )
 */
const hover = (): VariantStep => (cfg) => ({ ...cfg, mode: "hover" });

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

/**
 * @description 弹簧过渡步骤函数（type: "spring" 的语法糖）
 * @param {object} opts - stiffness / damping / mass / bounce / delay
 * @returns {VariantStep}
 *
 * @example
 * // 高刚度、低阻尼 → 弹跳感强
 * variants(fade(), slide({ x: 40 }), spring({ stiffness: 400, damping: 10 }))
 *
 * @example
 * // 默认弹簧参数（stiffness: 260, damping: 20）
 * variants(fade(), slide({ x: 20 }), spring())
 */
const spring =
  (
    opts: Pick<
      // Pick 类型操作符，从 TransitionConfig 类型中选择指定的属性
      TransitionConfig,
      "stiffness" | "damping" | "mass" | "bounce" | "delay"
    > = {}
  ): VariantStep =>
  (cfg) => ({
    ...cfg,
    common: {
      ...(cfg.common ?? {}),
      transition: {
        ...(cfg.common?.transition ?? {}),
        type: "spring",
        ...opts,
      },
    },
  });

export {
  variants,
  hover,
  fade,
  scale,
  scaleX,
  slide,
  duration,
  transition,
  spring,
  drawPath,
};
