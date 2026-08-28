import React from 'react';

export const Card = ({
  children,
  className = '',
  interactive = false,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', style = {} }) => (
  <div className={`card-header ${className}`} style={style}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', style = {} }) => (
  <div className={`card-body ${className}`} style={style}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', style = {} }) => (
  <div className={`card-footer ${className}`} style={style}>
    {children}
  </div>
);

export default Card;
