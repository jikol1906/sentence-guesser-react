import * as React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FunctionComponent<IButtonProps> = ({
  children,
  ...props
}) => {
  return <button className="
    text-white
    focus:ring-4 
    font-medium 
    rounded-lg 
    text-sm 
    px-5 
    py-2.5 
    disabled:opacity-60
    disabled:cursor-not-allowed
  bg-slate-600
  hover:bg-slate-700
    focus:outline-none 
  focus:ring-slate-800" {...props}>{children}</button>;
};

export default Button;
