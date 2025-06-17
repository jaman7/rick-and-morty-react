import React, { memo, MouseEventHandler, useMemo } from 'react';
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

export interface IButtonComponent {
  id?: string;
  key?: string;
  name?: string;
  type?: TypeButton;
  children?: React.ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
  variant?: IButtonVariantTypes;
  buttonsConfig?: IButtonComponent[];
  configCustomClass?: string;
  size?: 'xs' | 'sm' | 'lg';
  selected?: boolean;
  dataTestId?: string;
}

const Button: React.FC<IButtonComponent> = (props) => {
  const { buttonsConfig, configCustomClass, active } = props || {};
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

  const buttonRender = (btn: IButtonComponent, index = 0): React.JSX.Element => {
    const sizeClasses = {
      xs: btn.variant === ROUND ? 'text-sm h-6 w-6' : 'text-xs px-1 py-1',
      sm: btn.variant === ROUND ? 'text-base h-8 w-8' : 'text-sm px-3 py-2',
      lg: btn.variant === ROUND ? 'text-xl h-12 w-12' : 'text-base px-4 py-3',
    };

    const buttonVariantClass = classNames(
      baseClasses,
      variantClasses[btn?.variant || 'primary'],
      sizeClasses[btn?.size || 'sm'],
      btn.disabled ? disabledClasses : '',
      btn.className,
      {
        active: active,
      }
    );

    return (
      <button
        id={btn.id}
        type={btn.type || 'button'}
        onClick={btn.handleClick}
        disabled={btn.disabled}
        aria-label={btn.ariaLabel ?? (btn.name ? t(btn.name) : '') ?? 'Unnamed Button'}
        className={buttonVariantClass}
        data-testid={btn.dataTestId ?? ''}
      >
        {btn.name ? t(btn.name) : btn.children}
      </button>
    );
  };

  return (
    <>
      {!buttonsConfig?.length ? (
        buttonRender(props)
      ) : (
        <div className={configCustomClass ?? 'flex gap-8'}>
          {buttonsConfig?.map((btn, i) => <React.Fragment key={btn.id ?? btn.name ?? `btn-${i}`}>{buttonRender(btn, i)}</React.Fragment>)}
        </div>
      )}
    </>
  );
};

export default memo(Button);
