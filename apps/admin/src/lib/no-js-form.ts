/**
 * Spread onto every <form>. All forms are handled in JavaScript; if one is submitted before the page
 * hydrates (or with JS disabled) it POSTs here instead of the default GET, so field values (including
 * passwords) can never end up in the URL, browser history or server logs. The handler redirects back.
 */
export const NO_JS_FORM = { method: "post", action: "/api/auth/no-js" } as const;
