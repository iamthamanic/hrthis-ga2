import React from 'react';

export const useNavigate = () => jest.fn();
export const useParams = () => ({} as Record<string, string>);
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null, key: 'test' });
export const useSearchParams = () => [new URLSearchParams(), jest.fn() as any] as const;

export const Link = ({ children, to, ...rest }: any) => <a href={typeof to === 'string' ? to : '#'} {...rest}>{children}</a>;
export const Navigate = ({ to }: any) => null as any;

export const Routes = ({ children }: any) => <>{children}</>;
export const Route = (_props: any) => null as any;

export const BrowserRouter = ({ children }: any) => <div data-testid="browser-router">{children}</div>;
export const MemoryRouter = ({ children }: any) => <div data-testid="memory-router">{children}</div>;

export default {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
  Link,
  Navigate,
  Routes,
  Route,
  BrowserRouter,
  MemoryRouter,
};


