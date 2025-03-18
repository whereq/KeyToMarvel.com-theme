import * as React from 'react';
import { K2mHeadingLevelSizeMap, K2mTitleProps } from './k2mTitleTypes';

export const K2mTitle: React.FunctionComponent<K2mTitleProps> = ({
  className = '',
  children = '',
  headingLevel: HeadingLevel,
  size: sizeProp, // Use the size prop directly
  ...props
}: K2mTitleProps) => {
  // Map size to Tailwind CSS classes
  const sizeClasses = {
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl',
    '4xl': 'text-5xl',
  };

  // Use the size prop if provided, otherwise fall back to the default based on headingLevel
  const size: keyof typeof sizeClasses = 
    sizeProp || (K2mHeadingLevelSizeMap[HeadingLevel] as keyof typeof sizeClasses);

  // Prepend ! to className to ensure it overrides inherited styles
  const finalClassName = `${sizeClasses[size]} font-bold ${className ? `!${className}` : ''}`.trim();

  return (
    <HeadingLevel
      {...props}
      className={finalClassName}
    >
      {children}
    </HeadingLevel>
  );
};
K2mTitle.displayName = 'Title';