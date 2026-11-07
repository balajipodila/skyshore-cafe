export const animateParallaxSlow = `
  @keyframes slow-zoom-in-out {
    0%, 100% { transform: scale(1.02); }
    50% { transform: scale(1.05); }
  }
  .animate-parallax-slow {
    animation: slow-zoom-in-out 20s ease-in-out infinite;
    will-change: transform;
  }
`
export const animateFadeInUp = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`