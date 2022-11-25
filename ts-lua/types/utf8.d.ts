// The export keyword can be used in a .ts or .d.ts file. It tells the transpiler and your editor (potentially) that something contains/provides something that you can either import (by using import in TS or require() in Lua) or access.
declare module 'utf8' {
  /**
   * @noSelf
   */
  export function codepoint(): void
}
// main.ts
// import * as utf8 from "utf8"; // equiv to `local utf8 = require("utf8");
// utf8.codepoint();
