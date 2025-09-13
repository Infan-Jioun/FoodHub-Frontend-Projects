import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  const keyframes = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((s) => s[key])];
  });
  return keyframes;
};

const RestaurentBannerTwo = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words", // "words" or "letters"
  direction = "top", // "top" or "bottom"
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only once
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(12px)", opacity: 0, y: -40 }
        : { filter: "blur(12px)", opacity: 0, y: 40 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(6px)",
        opacity: 0.6,
        y: direction === "top" ? 10 : -10,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
      },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <div
      ref={ref}
      className={`blur-text ${className} flex flex-wrap gap-y-2 text-xl text-[#ff1818] md:text-3xl leading-relaxed`}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={index}
            className="inline-block whitespace-pre will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={transition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </div>
  );
};

export default RestaurentBannerTwo;
