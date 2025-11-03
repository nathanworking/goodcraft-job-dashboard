export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <g fill="currentColor">
        <g className="nc-loop-ripple-32-icon-f">
          <circle cx="16" cy="16" fill="currentColor" r="16"></circle>
          <circle cx="16" cy="16" fill="currentColor" r="16"></circle>
        </g>
        <style>{`.nc-loop-ripple-32-icon-f{--animation-duration:1.2s}.nc-loop-ripple-32-icon-f *{transform-origin:50% 50%;animation:nc-loop-ripple-anim var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-ripple-32-icon-f :nth-child(2){animation-delay:calc(var(--animation-duration)/-2)}@keyframes nc-loop-ripple-anim{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(1)}}`}</style>
      </g>
    </svg>
  )
}
