export enum K2mTitleSizes {
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
  '3xl' = '3xl',
  '4xl' = '4xl'
}

export enum K2mHeadingLevelSizeMap {
  h1 = '2xl',
  h2 = 'xl',
  h3 = 'lg',
  h4 = 'md',
  h5 = 'sm',
  h6 = 'xs'
}

export type K2mSize = 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface K2mTitleProps extends Omit<React.HTMLProps<HTMLHeadingElement>, 'size' | 'className'> {
  /** The size of the Title  */
  size?: K2mSize;
  /** Content rendered inside the Title */
  children?: React.ReactNode;
  /** Additional classes added to the Title */
  className?: string;
  /** The heading level to use */
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}