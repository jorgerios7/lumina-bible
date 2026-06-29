import { useEffect, type Dispatch, type SetStateAction } from "react";

type UseToastAutoDismissProps = {
  toast: string;
  setToast: Dispatch<SetStateAction<string>>;
};

export function useToastAutoDismiss({ toast, setToast }: UseToastAutoDismissProps) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast, setToast]);
}
