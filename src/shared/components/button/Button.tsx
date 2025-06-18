import React, { memo, MouseEventHandler, useMemo, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

export type TypeButton = 'button' | 'submit' | 'reset';
export type IButtonVariantTypes = 'primary' | 'secondary' | 'tertiary' | 'round';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  ROUND = 'round',
}

const { PRIMARY, SECONDARY, TERTIARY, ROUND } = ButtonVariant;

export interface IButtonComponent extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  id?: string;
  key?: string;
  name?: string;
  type?: TypeButton;
  children?: React.ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  className?: string;
  tooltip?: string;
  variant?: IButtonVariantTypes;
  buttonsConfig?: IButtonComponent[];
  configCustomClass?: string;
  size?: 'xs' | 'sm' | 'lg';
  selected?: boolean;
}

const Button: React.FC<IButtonComponent> = (props) => {
  const { buttonsConfig, configCustomClass } = props || {};
  const { t } = useFallbackTranslation();

  const baseClasses = 'button-component';

  const variantClasses = useMemo(
    () => ({
      primary: PRIMARY,
      secondary: SECONDARY,
      tertiary: TERTIARY,
      round: 'round rounded-full',
    }),
    []
  );

  const disabledClasses = 'bg-gray text-disabled cursor-not-allowed';

  const buttonRender = (btn: IButtonComponent): React.JSX.Element => {
    const { handleClick, className, name, children, size = 'sm', variant = PRIMARY, disabled, active, ...rest } = btn;

    const sizeClasses = {
      xs: variant === ROUND ? 'text-sm h-6 w-6' : 'text-xs px-1 py-1',
      sm: variant === ROUND ? 'text-base h-8 w-8' : 'text-sm px-3 py-2',
      lg: variant === ROUND ? 'text-xl h-12 w-12' : 'text-base px-4 py-3',
    };

    const buttonVariantClass = classNames(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      disabled ? disabledClasses : '',
      className,
      {
        active: active,
      }
    );

    const shouldUseAriaLabelledBy = 'aria-labelledby' in btn && !!btn['aria-labelledby'];
    const fallbackAriaLabel = name ? t(name) : 'Unnamed Button';

    return (
      <button
        {...rest}
        type={btn.type || 'button'}
        onClick={handleClick}
        aria-label={!shouldUseAriaLabelledBy ? (btn['aria-label'] ?? fallbackAriaLabel) : undefined}
        className={buttonVariantClass}
        disabled={disabled ?? false}
      >
        {name ? t(name) : children}
      </button>
    );
  };

  return (
    <>
      {!buttonsConfig?.length ? (
        buttonRender(props)
      ) : (
        <div className={configCustomClass ?? 'flex gap-8'}>
          {buttonsConfig?.map((btn, i) => <React.Fragment key={btn.id ?? btn.name ?? `btn-${i}`}>{buttonRender(btn)}</React.Fragment>)}
        </div>
      )}
    </>
  );
};

export default memo(Button);
