import * as React from 'react';
// import { PageContext } from '@patternfly/react-core';

export enum PageSectionVariants {
  default = 'default',
  light = 'light',
  dark = 'dark',
  darker = 'darker'
}

export enum PageSectionTypes {
  default = 'default',
  nav = 'nav',
  subNav = 'subnav',
  breadcrumb = 'breadcrumb',
  tabs = 'tabs',
  wizard = 'wizard'
}

export interface PageSectionProps extends React.HTMLProps<HTMLDivElement> {
  /** Content rendered inside the section */
  children?: React.ReactNode;
  /** Additional classes added to the section */
  className?: string;
  /** Section background color variant */
  variant?: 'default' | 'light' | 'dark' | 'darker';
  /** Section type variant */
  type?: 'default' | 'nav' | 'subnav' | 'breadcrumb' | 'tabs' | 'wizard';
  /** Enables the page section to fill the available vertical space */
  isFilled?: boolean;
  /** Limits the width of the section */
  isWidthLimited?: boolean;
  /** Flag indicating if the section content is center aligned. isWidthLimited must be set for this to work  */
  isCenterAligned?: boolean;
  /** Padding at various breakpoints. */
  padding?: {
    default?: 'padding' | 'noPadding';
    sm?: 'padding' | 'noPadding';
    md?: 'padding' | 'noPadding';
    lg?: 'padding' | 'noPadding';
    xl?: 'padding' | 'noPadding';
    '2xl'?: 'padding' | 'noPadding';
  };
  /** Modifier indicating if the PageBreadcrumb is sticky to the top or bottom at various breakpoints */
  stickyOnBreakpoint?: {
    default?: 'top' | 'bottom';
    sm?: 'top' | 'bottom';
    md?: 'top' | 'bottom';
    lg?: 'top' | 'bottom';
    xl?: 'top' | 'bottom';
    '2xl'?: 'top' | 'bottom';
  };
  /** Modifier indicating if PageSection should have a shadow at the top */
  hasShadowTop?: boolean;
  /** Modifier indicating if PageSection should have a shadow at the bottom */
  hasShadowBottom?: boolean;
  /** Flag indicating if the PageSection has a scrolling overflow */
  hasOverflowScroll?: boolean;
  /** Adds an accessible name to the page section. Required when the hasOverflowScroll prop is set to true.
   * This prop should also be passed in if a heading is not being used to describe the content of the page section.
   */
  'aria-label'?: string;
  /** Sets the base component to render. Defaults to section */
  component?: keyof JSX.IntrinsicElements;
}

const variantTypeClasses = {
  [PageSectionTypes.default]: '',
  [PageSectionTypes.nav]: 'bg-gray-100', // Example class for nav type
  [PageSectionTypes.subNav]: 'bg-gray-200', // Example class for subnav type
  [PageSectionTypes.breadcrumb]: 'bg-gray-300', // Example class for breadcrumb type
  [PageSectionTypes.tabs]: 'bg-gray-400', // Example class for tabs type
  [PageSectionTypes.wizard]: 'bg-gray-500', // Example class for wizard type
};

const variantStyleClasses = {
  [PageSectionVariants.default]: '',
  [PageSectionVariants.light]: 'bg-gray-100', // Example class for light variant
  [PageSectionVariants.dark]: 'bg-gray-800', // Example class for dark variant
  [PageSectionVariants.darker]: 'bg-gray-900', // Example class for darker variant
};

export const K2mPageSection: React.FunctionComponent<PageSectionProps> = ({
  className = '',
  children,
  variant = 'default',
  type = 'default',
  padding,
  isFilled,
  isWidthLimited = false,
  isCenterAligned = false,
  stickyOnBreakpoint,
  hasShadowTop = false,
  hasShadowBottom = false,
  hasOverflowScroll = false,
  'aria-label': ariaLabel,
  component = 'section',
  ...props
}: PageSectionProps) => {
//   const { height, getVerticalBreakpoint } = React.useContext(PageContext);

  React.useEffect(() => {
    if (hasOverflowScroll && !ariaLabel) {
      /* eslint-disable no-console */
      console.warn('PageSection: An accessible aria-label is required when hasOverflowScroll is set to true.');
    }
  }, [hasOverflowScroll, ariaLabel]);

  const Component = component as React.ElementType;

  // Generate padding classes based on the padding prop
  const paddingClasses = padding
    ? Object.entries(padding)
        .map(([breakpoint, value]) => {
          if (value === 'padding') {
            return breakpoint === 'default' ? 'p-4' : `${breakpoint}:p-4`;
          }
          return '';
        })
        .join(' ')
    : '';

  // Generate sticky classes based on the stickyOnBreakpoint prop
  const stickyClasses = stickyOnBreakpoint
    ? Object.entries(stickyOnBreakpoint)
        .map(([breakpoint, value]) => {
          if (value === 'top' || value === 'bottom') {
            return breakpoint === 'default' ? `sticky-${value}` : `${breakpoint}:sticky-${value}`;
          }
          return '';
        })
        .join(' ')
    : '';

  return (
    <Component
      {...props}
      className={`
        ${variantTypeClasses[type]}
        ${variantStyleClasses[variant]}
        ${paddingClasses}
        ${stickyClasses}
        ${isFilled === false ? 'flex-none' : 'flex-1'}
        ${isWidthLimited ? 'max-w-screen-xl mx-auto' : ''}
        ${isWidthLimited && isCenterAligned && type !== PageSectionTypes.subNav ? 'text-center' : ''}
        ${hasShadowTop ? 'shadow-top' : ''}
        ${hasShadowBottom ? 'shadow-bottom' : ''}
        ${hasOverflowScroll ? 'overflow-auto' : ''}
        ${className}
      `}
      {...(hasOverflowScroll && { tabIndex: 0 })}
      aria-label={ariaLabel}
    >
      {isWidthLimited ? <div className="p-4">{children}</div> : children}
    </Component>
  );
};
K2mPageSection.displayName = 'PageSection';import { JSX } from 'react';
