export function shareTextWithNavigator(text: string) {
  type ShareCapableNavigator = Navigator & {
    share?: (data: ShareData) => Promise<void>;
    clipboard?: Clipboard;
  };
  const browserNavigator =
    typeof window === "undefined"
      ? undefined
      : (window.navigator as ShareCapableNavigator);

  if (typeof browserNavigator?.share === "function") {
    browserNavigator.share({ text }).catch(() => undefined);
    return;
  }

  if (browserNavigator?.clipboard) {
    browserNavigator.clipboard.writeText(text).catch(() => undefined);
  }
}
