export function isValidLeetchiUrl(url: string) {
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" &&
        parsed.hostname === "www.leetchi.com" &&
        /^\/fr\/c\/[a-zA-Z0-9\-]+/.test(parsed.pathname)
      );
    } catch {
      return false;
    }
  }
  