// If a namespace contains certain functions, export tells TypeScript that those functions can be accessed within the namespace.
declare namespace table {
  /**
   * @noSelf
   */
  export function insert(table: object, item: any): number
}
// main.ts
// table.insert({}, 1);
