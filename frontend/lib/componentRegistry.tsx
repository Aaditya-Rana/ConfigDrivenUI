import React, { ReactElement, ComponentType } from 'react';
import { Hero } from '@/components/sections/Hero';
import { CardList } from '@/components/sections/CardList';
import { LinkSection } from '@/components/sections/LinkSection';

/** Strapi block/section payload (has __component + component-specific fields) */
export type BlockProps = Record<string, unknown> & { __component: string };

/** Optional context passed when rendering (injected props, locale, callbacks) */
export type RenderContext = {
  currentLocale?: string;
  userContext?: { currentLocale?: string };
  onCtaClick?: () => void;
  className?: string;
  [key: string]: unknown;
};

/** Optional: map block props + context into the final props for the component */
export type PropInjector<P = BlockProps> = (blockProps: P, context: RenderContext) => P & Record<string, unknown>;

/** Entry in the registry: component + optional prop injector */
export type RegistryEntry<P = BlockProps> = {
  component: ComponentType<P & Record<string, unknown>>;
  injectProps?: PropInjector<P>;
};

/** Registry: component key (e.g. sections.hero) -> entry */
const registry = new Map<string, RegistryEntry>();

/** Register a component for a given __component key */
export function register<P extends BlockProps = BlockProps>(
  key: string,
  component: ComponentType<P & Record<string, unknown>>,
  injectProps?: PropInjector<P>
): void {
  registry.set(key, { component: component as ComponentType<BlockProps & Record<string, unknown>>, injectProps: injectProps as PropInjector });
}

/** Get the registered component for a key, or null */
export function getComponent(key: string): ComponentType<BlockProps & Record<string, unknown>> | null {
  return registry.get(key)?.component ?? null;
}

/** Resolve component and merged props for a key; returns null if not registered */
export function resolve(
  key: string,
  blockProps: BlockProps,
  context: RenderContext = {}
): { Component: ComponentType<BlockProps & Record<string, unknown>>; props: Record<string, unknown> } | null {
  const entry = registry.get(key);
  if (!entry) return null;
  const props = entry.injectProps
    ? (entry.injectProps(blockProps, context) as Record<string, unknown>)
    : { ...blockProps };
  return { Component: entry.component, props };
}

/** Render a single block by key; uses resolve() and React.createElement. Returns fallback element if unknown. */
export function renderBlock(
  key: string,
  blockProps: BlockProps,
  context: RenderContext = {},
  keyPrefix: string = 'block'
): ReactElement {
  const resolved = resolve(key, blockProps, context);
  if (resolved) {
    const { Component, props } = resolved;
    return React.createElement(Component, { ...props, key: keyPrefix });
  }
  return React.createElement(
    'div',
    {
      key: keyPrefix,
      className: 'py-12 bg-gray-100 text-center border-b border-gray-200',
    },
    React.createElement('p', { className: 'text-gray-500 font-mono text-sm' }, `Unknown Component: ${key}`)
  );
}

// ——— Default mapping: Strapi section/block keys -> components ———

register('sections.hero', Hero as ComponentType<BlockProps & Record<string, unknown>>);
register('sections.card-list', CardList as ComponentType<BlockProps & Record<string, unknown>>, (props, ctx) => ({
  ...props,
  currentLocale: ctx.currentLocale ?? ctx.userContext?.currentLocale,
}));
register('sections.link-section', LinkSection as ComponentType<BlockProps & Record<string, unknown>>, (props, ctx) => ({
  ...props,
  currentLocale: ctx.currentLocale ?? ctx.userContext?.currentLocale,
}));

export { registry };
