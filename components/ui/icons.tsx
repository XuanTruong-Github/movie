import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function Menu(props: SVGProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight(props: SVGProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeft(props: SVGProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Loader2Icon(props: SVGProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M21 12A9 9 0 1 1 12 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoreHorizontal(props: SVGProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function XIcon(props: SVGProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Alias names expected by other components (lucide-react style names)
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const MoreHorizontalIcon = MoreHorizontal;
export const LoaderIcon = Loader2Icon;
export const ChevronDown = ChevronDownIcon;

export default {};
