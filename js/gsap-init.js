/* ============================================
   GSAP INIT — npm module bridge
   Expose gsap & ScrollTrigger to window for
   backward compatibility with non-module scripts.
   ============================================ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger };
