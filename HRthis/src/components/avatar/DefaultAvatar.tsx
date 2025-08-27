import React, { useId } from 'react';

/**
 * DefaultAvatar
 * Reusable fallback avatar that matches the dashboard's SVG style.
 * Usage: <DefaultAvatar sizeClass="w-10 h-10" className="border border-gray-200" />
 */
export const DefaultAvatar: React.FC<{
  sizeClass?: string;
  className?: string;
}> = ({ sizeClass = 'w-10 h-10', className = '' }) => {
  const patternId = `crosshatch-${useId()}`;
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-100 relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M0,4 l4,-4 M0,0 l4,4" stroke="#d1d5db" strokeWidth="0.5" />
          </pattern>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${patternId})`} />
        <circle cx="50" cy="35" r="18" fill="#9ca3af" />
        <ellipse cx="50" cy="70" rx="28" ry="20" fill="#9ca3af" />
      </svg>
    </div>
  );
};

export default DefaultAvatar;


