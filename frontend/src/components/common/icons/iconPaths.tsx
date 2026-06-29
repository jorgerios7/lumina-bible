import type { ReactNode } from "react";

export const ICON_PATHS = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  tree: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M12 7.5v4" />
      <path d="M12 11.5 6 15.5" />
      <path d="M12 11.5 18 15.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  note: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h5a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H5z" />
      <path d="M19 4h-5a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h5z" />
    </>
  ),
  chat: (
    <>
      <path d="M5 5h14v10H8l-3 4z" />
      <path d="M9 10h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="m4.9 4.9 2.1 2.1" />
      <path d="m17 17 2.1 2.1" />
      <path d="m19.1 4.9-2.1 2.1" />
      <path d="m7 17-2.1 2.1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.3 10.9 7.4-4.8" />
      <path d="m8.3 13.1 7.4 4.8" />
    </>
  ),
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
      <path d="m6.3 17.7-1.4 1.4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  panel: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M9 5v14" />
      <path d="M12 9h5" />
      <path d="M12 13h5" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  chevron: <path d="m8 10 4 4 4-4" />,
  leaf: (
    <>
      <path d="M5 19c9 0 14-6 14-14-8 0-14 5-14 14Z" />
      <path d="M5 19c2-5 6-8 12-11" />
    </>
  ),
  send: (
    <>
      <path d="M3 11 21 3l-8 18-2-8z" />
      <path d="m11 13 5-5" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16z" />
      <path d="m13 7 4 4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICON_PATHS;
