import { createContext, forwardRef, useContext, useMemo, type ForwardedRef, type ReactNode } from 'react';
import cn from 'classnames';

interface TabsContextProps {
  contextValue: string;
  onContextValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);
TabsContext.displayName = 'TabsContext';

function useTabsContext() {
  const ctx = useContext(TabsContext);

  if (!ctx) {
    throw new Error('useTabsContext must be used within a <Root .>');
  }

  return ctx;
}

interface RootProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

function Root({ value, onValueChange, children }: RootProps) {
  const memoizedValue: TabsContextProps = useMemo(
    () => ({
      contextValue: value,
      onContextValueChange: onValueChange,
    }),
    [onValueChange, value],
  );

  return <TabsContext.Provider value={memoizedValue}>{children}</TabsContext.Provider>;
}

interface ListProps {
  children: ReactNode;
}

const List = forwardRef(({ children }: ListProps, ref?: ForwardedRef<HTMLUListElement>) => (
  <ul ref={ref} className="nav nav-pills outline-active" role="tablist">
    {children}
  </ul>
));

interface TriggerProps {
  value: string;
  children: ReactNode;
}

const Trigger = forwardRef(({ value, children }: TriggerProps, ref?: ForwardedRef<HTMLLIElement>) => {
  const { contextValue, onContextValueChange } = useTabsContext();
  const active = value === contextValue;
  const classes = cn('nav-link', { active });

  const handleClick = () => {
    onContextValueChange(value);
  };

  return (
    <li ref={ref} className="nav-item">
      <button type="button" className={classes} onClick={handleClick}>
        {children}
      </button>
    </li>
  );
});

interface ContentProps {
  value: string;
  children: ReactNode;
}

function Content({ value, children }: ContentProps) {
  const { contextValue } = useTabsContext();
  const active = value === contextValue;

  return active && children;
}

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};
