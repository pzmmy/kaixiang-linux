'use client';

// All the CSS keyframe animations in one place
export function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes dropdownOpen {
        0% { opacity: 0; transform: scale(0.95) translateY(-8px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes tooltipSlideUp {
        0% { 
          opacity: 0; 
          transform: translate(-50%, -90%);
        }
        100% { 
          opacity: 1; 
          transform: translate(-50%, -100%);
        }
      }
      @keyframes slideInFromBottom {
        0% {
          opacity: 0;
          transform: translateY(100%);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes distroDropdownOpen {
        0% { 
          opacity: 0; 
          transform: scale(0.9) translateY(-10px); 
        }
        60% { 
          opacity: 1; 
          transform: scale(1.02) translateY(2px); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      @keyframes distroItemSlide {
        0% { 
          opacity: 0; 
          transform: translateX(15px) scale(0.95); 
        }
        60% { 
          opacity: 1; 
          transform: translateX(-3px) scale(1.01); 
        }
        100% { 
          opacity: 1; 
          transform: translateX(0) scale(1); 
        }
      }
      @keyframes slideUp {
        0% {
          opacity: 0;
          transform: translateY(100%);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideDown {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(100%);
        }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes revealFromLeft {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
      @keyframes slideUpFade {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out;
      }
      .header-animate {
        animation: revealFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
      }
      .header-controls {
        animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes popupSlideIn {
        0% { 
          opacity: 0; 
          transform: translateY(-10px) scale(0.95); 
        }
        100% { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }
    `}</style>
  );
}
