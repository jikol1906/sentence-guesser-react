import * as React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FunctionComponent<IButtonProps> = ({
  children,
  ...props
}) => {
  return <button className="
    text-white
    bg-blue-700
    hover:bg-blue-800
    focus:ring-4 
    focus:ring-blue-300 
    font-medium 
    rounded-lg 
    text-sm 
    px-5 
    py-2.5 
    disabled:opacity-60
    disabled:cursor-not-allowed
    dark:bg-blue-600 
    dark:hover:bg-blue-700 
    focus:outline-none 
    dark:focus:ring-blue-800" {...props}>{children}</button>;
};

export default Button;
