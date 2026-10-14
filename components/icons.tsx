import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export const Icons = {
  arrowLeft: (props: IconProps) => <Icon {...props}><path d="m15 18-6-6 6-6" /><path d="M9 12h11" /></Icon>,
  camera: (props: IconProps) => <Icon {...props}><path d="M14.5 4h-5L8 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z" /><circle cx="12" cy="13" r="3" /></Icon>,
  calendar: (props: IconProps) => <Icon {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Icon>,
  location: (props: IconProps) => <Icon {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>,
  search: (props: IconProps) => <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>,
  rows: (props: IconProps) => <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>,
  list: (props: IconProps) => <Icon {...props}><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></Icon>,
  grid: (props: IconProps) => <Icon {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>,
  userSearch: (props: IconProps) => <Icon {...props}><circle cx="10" cy="8" r="3" /><path d="M4 19v-1a6 6 0 0 1 10.5-4" /><circle cx="18" cy="17" r="3" /><path d="m20.2 19.2 1.8 1.8" /></Icon>,
  close: (props: IconProps) => <Icon {...props}><path d="m6 6 12 12M18 6 6 18" /></Icon>,
  info: (props: IconProps) => <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Icon>,
  download: (props: IconProps) => <Icon {...props}><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></Icon>,
  share: (props: IconProps) => <Icon {...props}><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></Icon>,
  chevronLeft: (props: IconProps) => <Icon {...props}><path d="m15 18-6-6 6-6" /></Icon>,
  chevronRight: (props: IconProps) => <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>,
  upload: (props: IconProps) => <Icon {...props}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></Icon>,
  check: (props: IconProps) => <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>,
}
