import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface ButtonConfig {
  label: string;
  url?: string;
  primary?: boolean;
}

interface CardButtonsProps {
  /** Item with optional button1_show, button1_label, button1_url, button2_show, button2_label, button2_url */
  item: Record<string, unknown>;
  /** Fallback buttons when no buttons configured on item */
  defaultButtons?: ButtonConfig[];
}

/** Show button only when toggle is explicitly on. When off or unset, never show. */
const shouldShowButton = (show: unknown, hasLabel: boolean): boolean =>
  hasLabel && (show === 'true' || show === true);

/** Both toggles explicitly off = user chose to hide all buttons; don't show defaults. */
const bothTogglesExplicitlyOff = (item: Record<string, unknown>): boolean =>
  (item.button1_show === 'false' || item.button1_show === false) &&
  (item.button2_show === 'false' || item.button2_show === false);

const getButtons = (item: Record<string, unknown>, defaultButtons?: ButtonConfig[]): ButtonConfig[] => {
  const buttons: ButtonConfig[] = [];
  for (let i = 1; i <= 2; i++) {
    const show = item[`button${i}_show`];
    const label = item[`button${i}_label`];
    const url = item[`button${i}_url`];
    const labelStr = typeof label === 'string' ? label.trim() : '';
    if (shouldShowButton(show, !!labelStr)) {
      buttons.push({
        label: labelStr,
        url: typeof url === 'string' ? url.trim() || undefined : undefined,
        primary: i === 1,
      });
    }
  }
  if (buttons.length > 0) return buttons;
  if (bothTogglesExplicitlyOff(item)) return [];
  return defaultButtons ?? [];
};

export const CardButtons: React.FC<CardButtonsProps> = ({ item, defaultButtons }) => {
  const buttons = getButtons(item, defaultButtons);
  if (buttons.length === 0) return null;

  return (
    <div className="mt-auto pt-8 border-t border-neutral-100 flex gap-4 flex-wrap">
      {buttons.map((btn, i) => {
        const isPrimary = btn.primary ?? i === 0;
        const content = (
          <>
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>{btn.label}</span>
          </>
        );
        const baseClass = "flex items-center gap-2 px-6 py-3 uppercase text-xs font-bold tracking-widest flex-1 justify-center min-w-0";
        if (btn.url) {
          return (
            <a
              key={i}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isPrimary
                  ? `bg-neutral-900 text-white hover:bg-teal-600 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-teal-500/20 ${baseClass}`
                  : `border border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-teal-400 transition-all duration-300 hover:shadow-md ${baseClass}`
              }
            >
              {isPrimary && (
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
              )}
              <span className={isPrimary ? "relative z-10 flex items-center gap-2" : "flex items-center gap-2"}>
                {content}
              </span>
            </a>
          );
        }
        return (
          <button
            key={i}
            type="button"
            className={
              isPrimary
                ? `bg-neutral-900 text-white hover:bg-teal-600 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-teal-500/20 ${baseClass}`
                : `border border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-teal-400 transition-all duration-300 hover:shadow-md ${baseClass}`
            }
          >
            {isPrimary && (
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
            )}
            <span className={isPrimary ? "relative z-10 flex items-center gap-2" : "flex items-center gap-2"}>
              {content}
            </span>
          </button>
        );
      })}
    </div>
  );
};
