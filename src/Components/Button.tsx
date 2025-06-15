import * as React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
}

const Button: React.FunctionComponent<IButtonProps> = (props) => {
    const {children, className, active,...rest} = props
  return (
    <button
      className={`px-4 py-2 rounded-lg  ${className} ${active ? "bg-slate-500" : "bg-slate-600 hover:bg-slate-500"}`}
      {...rest}
    >
        {children}
    </button>
  );
};

export default Button;