import * as React from 'react';

export interface K2mTextContentProps extends React.HTMLProps<HTMLDivElement> {
  /** Content rendered within the TextContent */
  children?: React.ReactNode;
  /** Additional classes added to the TextContent */
  className?: string;
  /** Flag to indicate the all links in a the content block have visited styles applied if the browser determines the link has been visited */
  isVisited?: boolean;
}

export const K2mTextContent: React.FunctionComponent<K2mTextContentProps> = ({
  children,
  className = '',
  isVisited = false,
  ...props
}: K2mTextContentProps) => {
  // Apply visited styles conditionally
  const visitedClass = isVisited ? 'visited:text-purple-600' : '';

  return (
    <div {...props} className={`${visitedClass} ${className}`}>
      {children}
    </div>
  );
};

K2mTextContent.displayName = 'TextContent';