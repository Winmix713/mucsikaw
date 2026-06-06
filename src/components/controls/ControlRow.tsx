import React, {
  Children,
  Fragment,
  cloneElement,
  createContext,
  createElement,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useMemo
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
/* -------------------------------------------------------------------------- */
/*  Design tokens                                                             */
/* -------------------------------------------------------------------------- */
const CONTROL_ROW_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const CONTROL_ROW_DURATION_MS = 180;
const CONTROL_ROW_VARS: React.CSSProperties = {
  // Public CSS variables — consumers may override via inline style.
  ['--cr-ease' as string]: CONTROL_ROW_EASING,
  ['--cr-duration' as string]: `${CONTROL_ROW_DURATION_MS}ms`
};
/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */
function mergeIds(...ids: Array<string | undefined | null | false>) {
  const value = ids.filter(Boolean).join(' ').trim();
  return value.length > 0 ? value : undefined;
}
function safeReactId() {
  // Stable, attribute-safe id derived from useId().
  const reactId = useId();
  return useMemo(() => reactId.replace(/[^a-zA-Z0-9_-]/g, ''), [reactId]);
}
/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */
type ControlRowSize = 'sm' | 'md' | 'lg';
type ControlRowTone = 'default' | 'subtle' | 'inset';
interface ControlRowContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  messageId: string;
  describedBy?: string;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  readOnly: boolean;
  size: ControlRowSize;
}
const ControlRowContext = createContext<ControlRowContextValue | null>(null);
function useControlRowContext(componentName: string): ControlRowContextValue {
  const context = useContext(ControlRowContext);
  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside <ControlRow.Root> or <ControlRow>.`
    );
  }
  return context;
}
/** Optional accessor for consumers that want to read context without throwing. */
export function useControlRow(): ControlRowContextValue | null {
  return useContext(ControlRowContext);
}
/* -------------------------------------------------------------------------- */
/*  Child enhancement                                                         */
/* -------------------------------------------------------------------------- */
type EnhanceableProps = {
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
};
function enhanceControlChild(
child: React.ReactNode,
ctx: ControlRowContextValue)
: React.ReactNode {
  if (!isValidElement(child) || child.type === Fragment) {
    return child;
  }
  const childProps = child.props as EnhanceableProps;
  return cloneElement(child as React.ReactElement<EnhanceableProps>, {
    id: childProps.id ?? ctx.controlId,
    'aria-labelledby': mergeIds(childProps['aria-labelledby'], ctx.labelId),
    'aria-describedby': mergeIds(
      childProps['aria-describedby'],
      ctx.describedBy
    ),
    'aria-invalid':
    childProps['aria-invalid'] ?? (ctx.invalid ? true : undefined),
    'aria-required':
    childProps['aria-required'] ?? (ctx.required ? true : undefined),
    disabled: childProps.disabled ?? (ctx.disabled || undefined),
    readOnly: childProps.readOnly ?? (ctx.readOnly || undefined),
    required: childProps.required ?? (ctx.required || undefined)
  });
}
/* -------------------------------------------------------------------------- */
/*  Variants                                                                  */
/* -------------------------------------------------------------------------- */
const rowVariants = cva(
  [
  'group/control relative isolate flex w-full items-center gap-2',
  'rounded-[var(--r-md,0.5rem)] border',
  'bg-[var(--bg-glass,hsl(var(--background)))]',
  'border-[var(--border-subtle,hsl(var(--border)))]',
  'shadow-[var(--sh-ctrl,0_1px_0_0_rgba(255,255,255,0.04)_inset)]',
  'transition-[border-color,box-shadow,background-color,opacity,transform]',
  'motion-reduce:transition-none',
  'duration-[var(--cr-duration)] ease-[var(--cr-ease)]',
  'focus-within:outline-none'].
  join(' '),
  {
    variants: {
      size: {
        sm: 'h-8 px-1.5 gap-1.5 text-[12px]',
        md: 'h-10 px-2 gap-2 text-[13px]',
        lg: 'h-12 px-2.5 gap-2.5 text-[14px]'
      },
      tone: {
        default: '',
        subtle:
        'bg-[color-mix(in_oklab,var(--bg-glass,transparent)_60%,transparent)]',
        inset:
        'shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.02)]'
      },
      state: {
        idle: [
        'hover:shadow-[var(--sh-ctrl-hover,0_2px_8px_-2px_rgba(0,0,0,0.25))]',
        'hover:border-[var(--border-mid,hsl(var(--border)))]',
        'focus-within:shadow-[var(--sh-ctrl-hover,0_2px_8px_-2px_rgba(0,0,0,0.25))]',
        'focus-within:border-[var(--border-mid,hsl(var(--border)))]',
        'focus-within:ring-2 focus-within:ring-[var(--ring,hsl(var(--ring)))]/40',
        'focus-within:ring-offset-0'].
        join(' '),
        invalid: [
        'border-[var(--color-error,hsl(var(--destructive)))]',
        'focus-within:ring-2 focus-within:ring-[var(--color-error,hsl(var(--destructive)))]/35',
        'shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-error,hsl(var(--destructive)))_30%,transparent)]'].
        join(' '),
        disabled: 'cursor-not-allowed opacity-55 select-none',
        readonly: 'opacity-90'
      }
    },
    defaultVariants: {
      size: 'md',
      tone: 'default',
      state: 'idle'
    }
  }
);
const iconVariants = cva(
  [
  'flex shrink-0 items-center justify-center rounded-[var(--r-sm,0.375rem)]',
  'bg-[var(--bg-icon,transparent)] text-[var(--text-mid,hsl(var(--muted-foreground)))]',
  'transition-[color,background-color,transform] duration-[var(--cr-duration)] ease-[var(--cr-ease)]',
  'motion-reduce:transition-none',
  'group-hover/control:text-[var(--text-hi,hsl(var(--foreground)))]',
  'group-focus-within/control:text-[var(--text-hi,hsl(var(--foreground)))]'].
  join(' '),
  {
    variants: {
      size: {
        sm: 'h-[18px] w-[18px] [&>svg]:h-[12px] [&>svg]:w-[12px]',
        md: 'h-[22px] w-[22px] [&>svg]:h-[14px] [&>svg]:w-[14px]',
        lg: 'h-[26px] w-[26px] [&>svg]:h-[16px] [&>svg]:w-[16px]'
      },
      invalid: {
        true: 'text-[var(--color-error,hsl(var(--destructive)))]',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      invalid: false
    }
  }
);
const labelVariants = cva(
  [
  'relative flex h-full shrink-0 select-none items-center overflow-hidden',
  'font-medium leading-none tracking-[-0.005em]'].
  join(' '),
  {
    variants: {
      size: {
        sm: 'basis-[64px] min-w-[48px] max-w-[96px] text-[10.5px]',
        md: 'basis-[72px] min-w-[56px] max-w-[112px] text-[11px]',
        lg: 'basis-[88px] min-w-[64px] max-w-[128px] text-[12px]'
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    defaultVariants: {
      size: 'md',
      disabled: false
    }
  }
);
/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */
export interface ControlRowRootProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'role'>,
  Pick<VariantProps<typeof rowVariants>, 'size' | 'tone'> {
  children: React.ReactNode;
  controlId?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;
  /** Render the row as a `<label>` instead of a `<div role="group">`. */
  asLabel?: boolean;
  /** Custom class for the outer wrapper (description/error live here). */
  wrapperClassName?: string;
}
const ControlRowRoot = forwardRef<HTMLDivElement, ControlRowRootProps>(
  function ControlRowRoot(
  {
    children,
    className,
    wrapperClassName,
    controlId,
    description,
    error,
    disabled = false,
    invalid: invalidProp = false,
    required = false,
    readOnly = false,
    size = 'md',
    tone = 'default',
    asLabel = false,
    style,
    ...props
  },
  ref)
  {
    const safeId = safeReactId();
    const resolvedControlId = controlId ?? `control-${safeId}`;
    const labelId = `${resolvedControlId}-label`;
    const descriptionId = `${resolvedControlId}-description`;
    const messageId = `${resolvedControlId}-message`;
    const hasError = Boolean(error);
    const invalid = invalidProp || hasError;
    const describedBy = mergeIds(
      description ? descriptionId : undefined,
      hasError ? messageId : undefined
    );
    const ctx = useMemo<ControlRowContextValue>(
      () => ({
        controlId: resolvedControlId,
        labelId,
        descriptionId,
        messageId,
        describedBy,
        disabled,
        invalid,
        required,
        readOnly,
        size: size ?? 'md'
      }),
      [
      resolvedControlId,
      labelId,
      descriptionId,
      messageId,
      describedBy,
      disabled,
      invalid,
      required,
      readOnly,
      size]

    );
    const state: VariantProps<typeof rowVariants>['state'] = disabled ?
    'disabled' :
    invalid ?
    'invalid' :
    readOnly ?
    'readonly' :
    'idle';
    const Row = asLabel ? 'label' : 'div';
    const rowA11yProps = asLabel ?
    {
      htmlFor: resolvedControlId
    } :
    {
      role: 'group' as const,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy
    };
    return (
      <ControlRowContext.Provider value={ctx}>
        <div
          className={cn('w-full', wrapperClassName)}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}>
          
          {createElement(
            Row,
            {
              ref,
              ...rowA11yProps,
              'aria-disabled': disabled || undefined,
              'data-state': state,
              'data-size': size,
              'data-tone': tone,
              style: {
                ...CONTROL_ROW_VARS,
                ...style
              },
              className: cn(
                rowVariants({
                  size,
                  tone,
                  state
                }),
                className
              ),
              ...props
            },
            children
          )}

          {(description || hasError) &&
          <div
            className={cn(
              'pt-1',
              size === 'sm' ? 'ps-7' : size === 'lg' ? 'ps-10' : 'ps-8'
            )}>
            
              {description &&
            <p
              id={descriptionId}
              className="text-[11px] leading-4 text-[var(--text-lo,hsl(var(--muted-foreground)))]">
              
                  {description}
                </p>
            }
              {hasError &&
            <p
              id={messageId}
              role="alert"
              aria-live="polite"
              className={cn(
                'mt-0.5 inline-flex items-center gap-1',
                'text-[11px] leading-4 text-[var(--color-error,hsl(var(--destructive)))]'
              )}>
              
                  <AlertCircle
                aria-hidden="true"
                className="h-3 w-3 shrink-0" />
              
                  <span>{error}</span>
                </p>
            }
            </div>
          }
        </div>
      </ControlRowContext.Provider>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Icon                                                                      */
/* -------------------------------------------------------------------------- */
export interface ControlRowIconProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Render as a child element via Radix Slot (preserves your element's props). */
  asChild?: boolean;
}
const ControlRowIcon = forwardRef<HTMLDivElement, ControlRowIconProps>(
  function ControlRowIcon(
  { children, className, asChild = false, ...props },
  ref)
  {
    const { size, invalid } = useControlRowContext('ControlRow.Icon');
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        aria-hidden="true"
        className={cn(
          iconVariants({
            size,
            invalid
          }),
          className
        )}
        {...props}>
        
        {children}
      </Comp>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Label                                                                     */
/* -------------------------------------------------------------------------- */
export interface ControlRowLabelProps extends
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  primary: string;
  secondary?: string;
  /** Override the default size-based width. */
  widthClassName?: string;
}
const ControlRowLabel = forwardRef<HTMLLabelElement, ControlRowLabelProps>(
  function ControlRowLabel(
  { primary, secondary, widthClassName, className, ...props },
  ref)
  {
    const { controlId, labelId, disabled, required, size } =
    useControlRowContext('ControlRow.Label');
    const hasSecondary = Boolean(secondary && secondary !== primary);
    const accessibleLabel = required ? `${primary} (required)` : primary;
    return (
      <label
        ref={ref}
        id={labelId}
        htmlFor={controlId}
        title={hasSecondary ? secondary : primary}
        className={cn(
          labelVariants({
            size,
            disabled
          }),
          widthClassName,
          className
        )}
        {...props}>
        
        <span className="sr-only">{accessibleLabel}</span>

        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 flex items-center whitespace-nowrap',
            'text-[var(--text-mid,hsl(var(--muted-foreground)))]',
            'transition-[opacity,transform,color] duration-[var(--cr-duration)] ease-[var(--cr-ease)]',
            'motion-reduce:transition-none motion-reduce:transform-none',
            hasSecondary &&
            'group-hover/control:-translate-y-1 group-hover/control:opacity-0 group-focus-within/control:-translate-y-1 group-focus-within/control:opacity-0'
          )}>
          
          {primary}
          {required &&
          <span
            aria-hidden="true"
            className="ml-0.5 text-[var(--color-error,hsl(var(--destructive)))]">
            
              *
            </span>
          }
        </span>

        {hasSecondary &&
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 flex items-center whitespace-nowrap',
            'translate-y-1 opacity-0 text-[var(--text-lo,hsl(var(--muted-foreground)))]',
            'transition-[opacity,transform,color] duration-[var(--cr-duration)] ease-[var(--cr-ease)]',
            'motion-reduce:transition-none motion-reduce:transform-none',
            'group-hover/control:translate-y-0 group-hover/control:opacity-100',
            'group-focus-within/control:translate-y-0 group-focus-within/control:opacity-100'
          )}>
          
            {secondary}
          </span>
        }
      </label>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Separator                                                                 */
/* -------------------------------------------------------------------------- */
export type ControlRowSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
const ControlRowSeparator = forwardRef<
  HTMLDivElement,
  ControlRowSeparatorProps>(
  function ControlRowSeparator({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        aria-hidden="true"
        className={cn(
          'mx-1 h-4 w-px shrink-0',
          'bg-gradient-to-b from-transparent via-[var(--border-mid,hsl(var(--border)))] to-transparent',
          className
        )}
        {...props} />);


  });
/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */
export interface ControlRowContentProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Disable automatic a11y wiring of a single child. */
  disableEnhance?: boolean;
}
const ControlRowContent = forwardRef<HTMLDivElement, ControlRowContentProps>(
  function ControlRowContent(
  { children, className, disableEnhance = false, ...props },
  ref)
  {
    const ctx = useControlRowContext('ControlRow.Content');
    const childArray = Children.toArray(children);
    const content =
    !disableEnhance && childArray.length === 1 ?
    enhanceControlChild(childArray[0], ctx) :
    children;
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2',
          '[&_input]:min-w-0 [&_select]:min-w-0 [&_textarea]:min-w-0',
          '[&_input]:bg-transparent [&_input]:outline-none',
          className
        )}
        {...props}>
        
        {content}
      </div>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Trailing slot (suffix)                                                    */
/* -------------------------------------------------------------------------- */
export interface ControlRowTrailingProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const ControlRowTrailing = forwardRef<HTMLDivElement, ControlRowTrailingProps>(
  function ControlRowTrailing({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex shrink-0 items-center gap-1 text-[var(--text-lo,hsl(var(--muted-foreground)))]',
          className
        )}
        {...props}>
        
        {children}
      </div>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Convenience primitive                                                     */
/* -------------------------------------------------------------------------- */
export interface ControlRowProps extends Omit<ControlRowRootProps, 'children'> {
  icon?: React.ReactNode;
  labelPrimary: string;
  labelSecondary?: string;
  labelWidthClassName?: string;
  trailing?: React.ReactNode;
  /** Hide the divider between label and content. */
  hideSeparator?: boolean;
  children: React.ReactNode;
}
const ControlRowPrimitive = forwardRef<HTMLDivElement, ControlRowProps>(
  function ControlRow(
  {
    icon,
    labelPrimary,
    labelSecondary,
    labelWidthClassName,
    trailing,
    hideSeparator = false,
    children,
    ...props
  },
  ref)
  {
    return (
      <ControlRowRoot ref={ref} {...props}>
        {icon ? <ControlRowIcon>{icon}</ControlRowIcon> : null}
        <ControlRowLabel
          primary={labelPrimary}
          secondary={labelSecondary}
          widthClassName={labelWidthClassName} />
        
        {!hideSeparator && <ControlRowSeparator />}
        <ControlRowContent>{children}</ControlRowContent>
        {trailing ? <ControlRowTrailing>{trailing}</ControlRowTrailing> : null}
      </ControlRowRoot>);

  }
);
/* -------------------------------------------------------------------------- */
/*  Compound export                                                           */
/* -------------------------------------------------------------------------- */
type ControlRowComponent = typeof ControlRowPrimitive & {
  Root: typeof ControlRowRoot;
  Icon: typeof ControlRowIcon;
  Label: typeof ControlRowLabel;
  Separator: typeof ControlRowSeparator;
  Content: typeof ControlRowContent;
  Trailing: typeof ControlRowTrailing;
};
export const ControlRow = Object.assign(ControlRowPrimitive, {
  Root: ControlRowRoot,
  Icon: ControlRowIcon,
  Label: ControlRowLabel,
  Separator: ControlRowSeparator,
  Content: ControlRowContent,
  Trailing: ControlRowTrailing
}) as ControlRowComponent;
export type { ControlRowContextValue, ControlRowSize, ControlRowTone };