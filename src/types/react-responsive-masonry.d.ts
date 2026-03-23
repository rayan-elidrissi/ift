declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react'

  interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>
    children: ReactNode
  }

  interface MasonryProps {
    columnsCount?: number
    gutter?: string
    children: ReactNode
  }

  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element
  export default function Masonry(props: MasonryProps): JSX.Element
}
