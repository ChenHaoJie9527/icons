## `build-variants` Source Code and Design Notes

### Source Code

```ts
import type { Easing, Variants } from "motion/react";

/**
 * @description Fade animation config
 * @type {FadeConfig}
 * @property {number} from - start opacity
 * @property {number} to - end opacity
 */
type FadeConfig = {
  from?: number;
  to?: number;
};

/**
 * @description Scale animation config
 * @type {ScaleConfig}
 * @property {number} from - start scale
 * @property {number} to - end scale
 */
type ScaleConfig = {
  from?: number;
  to?: number;
};

/**
 * @description Slide animation config (supports X / Y)
 * @type {SlideConfig}
 * @property {number} x - translation on X axis
 * @property {number} y - translation on Y axis
 * @property {number} delay - delay before sliding
 */
type SlideConfig = {
  x?: number;
  y?: number;
  delay?: number;
};

/**
 * @description Transition config
 * @type {TransitionConfig}
 * @property {number} duration - duration
 * @property {number} delay - delay
 * @property {string | number[]} ease - easing
 */
type TransitionConfig = {
  duration?: number;
  delay?: number;
  ease?: Easing | Easing[];
};

/**
 * @description Common animation config
 * @type {CommonConfig}
 * @property {number} duration - duration
 * @property {TransitionConfig} transition - transition config
 */
type CommonConfig = {
  duration?: number;
  transition?: TransitionConfig;
};

/**
 * @description Intermediate config; all steps only modify this shape
 * @type {VariantConfig}
 * @property {FadeConfig} fade - fade config
 * @property {ScaleConfig} scale - scale config
 * @property {SlideConfig | null} slide - slide config
 * @property {CommonConfig} common - common config
 */
export type VariantConfig = {
  fade?: FadeConfig;
  scale?: ScaleConfig;
  slide?: SlideConfig | null;
  common?: CommonConfig;
};

/**
 * @description Step function
 * @type {VariantStep}
 * @param {VariantConfig} config - current config
 * @returns {VariantConfig} - updated config
 */
export type VariantStep = (config: VariantConfig) => VariantConfig;

/**
 * @description Build Variants object from config
 * @type {buildVariants}
 * @param config - accumulated config
 * @returns {Variants} - motion Variants
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
 * Combine several step functions into a pipeline and return final Variants
 * @type {variants}
 * @param {VariantStep[]} steps - step functions
 * @returns {Variants} - motion Variants
 */
const variants = (...steps: VariantStep[]): Variants => {
  const config = steps.reduce<VariantConfig>((acc, step) => step(acc), {});

  return buildVariants(config);
};

/**
 * @description Fade step
 * @type {fade}
 * @param {FadeConfig} opts - fade options
 * @returns {VariantStep} - step function
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
 * @description Scale step
 * @type {scale}
 * @param {ScaleConfig} opts - scale options
 * @returns {VariantStep} - step function
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
 * @description Slide step (x / y)
 * @type {slide}
 * @param {SlideConfig} opts - slide options
 * @returns {VariantStep} - step function
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
 * @description Duration step
 * @type {duration}
 * @param {number} value - duration
 * @returns {VariantStep} - step function
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
 * @description Transition step (unified duration / delay / ease)
 * @type {transition}
 * @param {TransitionConfig} opts - transition options
 * @returns {VariantStep} - step function
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
```

### Purpose Overview

This module provides a **declarative, composable animation configuration pipeline** for building `Variants` for `motion/react`.  
The core idea is: **compose a series of small “step functions” (a pipeline) that gradually accumulate config, and finally build the `Variants` object**, instead of hard‑coding a large, verbose `Variants` object inside each component.

Key exports:

- `variants(...steps)`: chain multiple `VariantStep`s and produce a standard `Variants` object
- `fade(opts)`: configure fade in/out
- `scale(opts)`: configure scaling
- `slide(opts)`: configure translation (x / y / delay)
- `duration(value)`: configure base duration
- `transition(opts)`: configure `duration / delay / ease` in one place

A typical usage:

```ts
const v = variants(
  fade({ from: 0, to: 1 }),
  scale({ from: 0.9, to: 1 }),
  slide({ y: 12, delay: 0.1 }),
  transition({ duration: 0.3, ease: "easeOut" })
);
```

---

### Difference from Traditional Hard‑Coded `Variants`

#### Traditional approach (hard‑coding `Variants` in components)

Typical code directly inside a component:

```ts
const variants = {
  normal: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  animate: {
    opacity: [0, 1],
    scale: [0.9, 1],
    x: 0,
    y: [-12, 0],
    transition: {
      duration: 0.3,
      delay: 0.1,
      ease: "easeOut",
    },
  },
};
```

This hard‑coded style causes problems as the project grows:

- **High duplication**:  
  Every icon / component copies a similar structure and only changes a few values, leading to many slightly different copies of the same animation style.

- **Hard to maintain**:  
  - To globally slow down all animations, you have to search for magic numbers like `0.3`, `0.25`, etc.;  
  - `transition` objects are copy‑pasted everywhere, so changing a default in one place often leaves others inconsistent.

- **Difficult to compose**:  
  When you want “fade in + slide + shared easing”, you must hand‑assemble the object each time; there is no uniform reusable building block.

- **Types and shape are scattered**:  
  - Keys are easy to mistype (e.g. `opacity`), and types are not centralized;  
  - Extending animations means stuffing more fields into ad‑hoc object literals, which quickly becomes hard to read.

#### Pipeline‑based configuration in this module

`build-variants.ts` uses the pattern “step functions + intermediate config”:

- Use `VariantStep` to split animation into small steps (fade, scale, slide, transition, etc.);
- All steps operate on the unified `VariantConfig` shape only;
- `buildVariants(config)` is the single place that maps `VariantConfig` into `motion/react` `Variants`.

This gives a very different developer experience compared to hard‑coding:

- **Composable reuse**:  
  The code feels like “LEGO bricks”:

  ```ts
  variants(fade(), scale());
  variants(fade({ from: 0.2 }), slide({ y: 8 }));
  variants(fade(), duration(0.25), transition({ ease: "easeOut" }));
  ```

- **Decoupling config from output shape**:  
  - Business code only cares about “fade / scale / slide how much”, not how a `Variants` object is structured;  
  - All `opacity / scale / x / y / transition` arrays, start–end values, and directions are consistently produced by `buildVariants`.

- **Centralized defaults and edge‑case handling**:  
  `buildVariants` handles:
  - default duration: `common.transition?.duration ?? common.duration ?? 0.3`;  
  - default opacity from `0 → 1`, scale from `1 → 1`;  
  - slide defaults to `0` (no movement) when not provided;  
  - `delay` prefers `common.transition.delay`, otherwise falls back to `slide.delay`.  
  This means calling code can be very terse and global tuning becomes much easier.

---

### Structural Benefits of the Functional Pipeline

The core of `variants(...steps)`:

- Start from an empty `{}` as the initial `VariantConfig`;  
- Use `steps.reduce` to apply each `VariantStep` sequentially to `config`;  
- Pass the accumulated result into `buildVariants` to get the final `Variants`.

Benefits:

- **Clear execution order**:  
  `variants(fade(), slide(), transition())` literally reads as “fade, then slide, then apply shared transition settings”.

- **Simple unit testing**:  
  You can test each step (`fade`, `slide`, `duration`, etc.) in isolation as pure functions, instead of testing one giant object builder.

- **Low coupling, high extensibility**:  
  Steps only communicate through `VariantConfig`, not with each other.  
  When you want new capabilities (e.g. `rotate`, `blur`):
  - add a new config field and a step function;  
  - extend `buildVariants` to map it into `Variants`;  
  everything composes naturally without breaking existing usage.

---

### Type System and Maintainability Benefits

Animation‑related config is broken down into several explicit TypeScript types:

- `FadeConfig`: controls fade (from / to);  
- `ScaleConfig`: controls scale (from / to);  
- `SlideConfig`: controls translation (x / y / delay);  
- `TransitionConfig`: controls transition (duration / delay / ease);  
- `CommonConfig`: common container;  
- `VariantConfig`: intermediate structure aggregating all of the above;  
- `VariantStep`: the canonical step function signature.

Advantages:

- **Great IDE tooling**: calling `fade({ ... })` or friends gives full intellisense and type checking;  
- **Avoid shape / spelling bugs**: invalid fields or wrong types are caught at compile time;  
- **Intent is clearer**: when you see `variants(fade(), slide(), duration(0.25))` you can read the animation intent directly, instead of wading through low‑level `opacity / scale / x / y` details.

---

### Global Style Consistency and Tuning

Because calling code only depends on these step functions:

- To add a baseline scale everywhere, you can simply insert `scale({ from: 0.9, to: 1 })` in each `variants(...)` pipeline where it’s needed;  
- To standardize easing (e.g. switch to a `cubic-bezier(...)`), you can wrap a helper step:

  ```ts
  const withDefaultTransition = () =>
    transition({ duration: 0.3, ease: "easeOut" });
  ```

  Then use `withDefaultTransition()` everywhere; in the future, you only maintain this single definition.

- To adapt animation intensity for different modes (e.g. mobile vs desktop, light vs dark), you can build higher‑level composition helpers, instead of editing every component’s low‑level `Variants` objects.

Compared to hard‑coded `Variants`, this design significantly improves:

- **Style consistency**: all animations follow the same defaults and composition rules;  
- **Global tunability**: a small number of centralized configs can change the overall feel.

---

### Summary: Core Advantages over Hard‑Coded `Variants`

Compared with hard‑coding `Variants` directly in components, this `build-variants.ts` design offers:

- **Much higher reusability**: compose at the step‑function level instead of copy‑pasting object literals;  
- **Stronger consistency**: defaults and transition rules are centralized in `buildVariants` and the config types;  
- **Better maintainability**: global animation strategy changes live in a few places, not scattered magic numbers;  
- **Safer typing**: TypeScript clearly constrains config structure and fields;  
- **Better extensibility**: new animation dimensions can be added with minimal impact on existing callers;  
- **More expressive calling code**: `variants(fade(), slide(), transition())` states “what the animation does” instead of drowning you in low‑level `Variants` details.

