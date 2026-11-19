import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { ignores, sharedRules } from "./shared.js";

/** Flat config for Next.js apps. */
export default [ignores, ...nextVitals, ...nextTs, prettier, { rules: sharedRules }];
