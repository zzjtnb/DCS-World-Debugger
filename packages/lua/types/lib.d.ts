// The export keyword indicates something is exported and can be used by external code.

// This also includes ambient interfaces, types, modules and other items that don't result in any transpiled code.

// If a file named lib.lua exists and returns a table with an x field, you can write lib.d.t.s as follows to tell TypeScript that lib exists and what it provides.
export let x: number;
