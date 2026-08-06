import * as React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    buttonType?: 'danger' | 'primary';
}

const ButtonTypeClasses: Record<NonNullable<IButtonProps['buttonType']>, string> = {
    primary: 'bg-slate-600 hover:bg-slate-500 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const ButtonTypeActiveClasses: Record<NonNullable<IButtonProps['buttonType']>, string> = {
    primary: 'bg-slate-500',
    danger: 'bg-red-600',
};

const Button: React.FunctionComponent<IButtonProps> = (props) => {
    const { children, className = '', active, buttonType = 'primary', ...rest } = props;
    const isDisabled = rest.disabled;

    const baseClasses = active
        ? ButtonTypeActiveClasses[buttonType]
        : ButtonTypeClasses[buttonType];

    const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
        <button
            className={`px-4 py-2 rounded-xs ${baseClasses} ${disabledClasses} ${className}`.trim()}
            {...(isDisabled ? { 'aria-disabled': true } : {})}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;