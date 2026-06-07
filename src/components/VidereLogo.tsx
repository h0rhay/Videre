interface VidereLogoProps {
  size?: number;
}

// Lucide-style "eye of providence": a triangle with an eye inside.
// Single-stroke, currentColor, 24x24 grid — matches the lucide aesthetic.
export function VidereLogo({ size = 24 }: VidereLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5 20.5 20H3.5L12 3.5Z" />
      <path d="M8 15c1.4-1.8 6.6-1.8 8 0-1.4 1.8-6.6 1.8-8 0Z" />
      <circle cx="12" cy="15" r="1.15" />
    </svg>
  );
}
