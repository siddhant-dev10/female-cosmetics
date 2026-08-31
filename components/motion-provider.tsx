"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.2 });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); ScrollTrigger.update(); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealElements.forEach((element) => {
      gsap.fromTo(element, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
    });
    const parallaxElements = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    parallaxElements.forEach((element) => gsap.to(element, { yPercent: -10, ease: "none", scrollTrigger: { trigger: element, scrub: true } }));
    return () => { cancelAnimationFrame(frame); lenis.destroy(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, []);

  return <>{children}</>;
}
