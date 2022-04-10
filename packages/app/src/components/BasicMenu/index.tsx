import { Link } from 'react-router-dom';
import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import { ComponentPropsWithoutRef } from 'react';
import classes from './index.module.css';
import useModal from '@/hooks/useModal';
import ReactDOM from 'react-dom';

type BasicMenuItemProps<T extends 'button' | 'a'> = {
  tag: T;
  selected?: boolean;
} & ComponentPropsWithoutRef<T>;

declare function BasicMenuItemFn<T extends 'button' | 'a'>(
  props: BasicMenuItemProps<T>
): JSX.Element;

export const BasicMenuItem = React.forwardRef<
  HTMLElement,
  BasicMenuItemProps<any>
>(function MenuItem(props, ref) {
  const { tag, href, selected, children, ...rest } = props;
  const className =
    classes['menu-item'] + (selected ? classes['selected'] : '');
  if (tag === 'a') {
    return (
      <Link to={href}>
        <a
          ref={ref as RefObject<HTMLAnchorElement>}
          {...rest}
          className={className}
        >
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      {...rest}
      className={className}
    >
      {children}
    </button>
  );
}) as typeof BasicMenuItemFn;
export default BasicMenuItem;

export const MenuBackDrop = () => {
  return <div className={classes.backdrop}></div>;
};

export interface BasicMenuProps {
  open: boolean;
  anchorEl: HTMLElement | undefined;
  anchorOrigin: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  transformOrigin: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  onClose: () => void;
  children?: ReactNode;
}
export const BasicMenu = ({
  open,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  children,
  ...rest
}: BasicMenuProps) => {
  const [anchorPos, setAnchorPos] = useState<DOMRect | null>(null);
  console.log(anchorEl);

  useEffect(() => {
    if (anchorEl) {
      setAnchorPos(anchorEl.getBoundingClientRect());
    }
  }, [anchorEl]);

  const { ref, modalRoot } = useModal<HTMLDivElement>({
    onClose,
    focusAfterClosed: anchorEl,
    overlayModal: false,
  });
  if (!modalRoot) {
    return null;
  }
  const getAnchorOriginPos = () => {
    let pos: any = {};
    if (anchorPos) {
      pos.top =
        anchorOrigin.vertical === 'top'
          ? `calc(${anchorPos.top}px + 10px)`
          : `calc(${anchorPos.bottom}px + 10px)`;
      if (anchorOrigin.horizontal === 'left') {
        pos.left = `calc(${anchorPos.left}px + 5px)`;
      } else {
        pos.right = `calc(100vw - ${anchorPos.right - 10}px)`;
      }
      return pos;
    }
  };
  const menu = (
    <div
      role="presentation"
      className={`${classes.menu} ${open ? classes.open : ''}`}
    >
      {/* {open && <MenuBackDrop />} */}
      <div tabIndex={0}></div>
      <div
        {...rest}
        className={`${classes.menu__children} shadow-md`}
        ref={ref}
        tabIndex={-1}
        style={
          anchorPos
            ? {
                ...getAnchorOriginPos(),
                transformOrigin: `${transformOrigin.horizontal || '0px'} ${
                  transformOrigin.vertical || '0px'
                }`,
              }
            : null
        }
      >
        {children}
      </div>
      <div tabIndex={0}></div>
    </div>
  );
  return ReactDOM.createPortal(menu, modalRoot);
};
