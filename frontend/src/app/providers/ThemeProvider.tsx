import { useEffect, type PropsWithChildren } from 'react';
import { cssVars } from '../../styles/designTokens';

export default function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const vars = cssVars();
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    // Ensure Inter and JetBrains Mono fonts are loaded (best-effort).
    if (!document.getElementById('erp-fonts')) {
      const link = document.createElement('link');
      link.id = 'erp-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return <>{children}</>;
}
