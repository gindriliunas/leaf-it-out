"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function useCardReveal(selector: string, trigger: string) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.set(selector, { opacity: 1, y: 0, scale: 1 });
    const anim = gsap.from(selector, {
      opacity: 0,
      y: 40,
      scale: 0.97,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger, start: "top 78%", once: true },
    });
    return () => {
      anim.kill();
      gsap.set(selector, { opacity: 1, y: 0, scale: 1 });
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [selector, trigger]);
}

export function useGsapMarquee(
  track: React.RefObject<HTMLDivElement>,
  speed = 45
) {
  useEffect(() => {
    if (!track.current) return;
    const w = track.current.scrollWidth / 2;
    const anim = gsap.to(track.current, {
      x: -w,
      duration: w / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % w),
      },
    });
    return () => { anim.kill(); };
  }, [track, speed]);
}

export function useScrubCounter(
  el: React.RefObject<HTMLElement>,
  target: number
) {
  useEffect(() => {
    if (!el.current) return;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power1.out",
      scrollTrigger: { trigger: el.current, start: "top 80%", once: true },
      onUpdate() {
        if (el.current)
          el.current.textContent = Math.floor(obj.val).toLocaleString();
      },
    });
    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [el, target]);
}

export function useRevealOnScroll(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const els = container.querySelectorAll<HTMLElement>(".reveal-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}

// Unused ref placeholder to avoid the hook warning
export function useNoop() {
  return useRef<HTMLDivElement>(null);
}
