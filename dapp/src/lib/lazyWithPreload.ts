import { lazy } from "react";

function lazyWithPreload(factory: any) {
  const Component = lazy(factory);
  (Component as any).preload = factory;
  return Component;
}

export default lazyWithPreload;
