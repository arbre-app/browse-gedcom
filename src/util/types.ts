export type IfExtends<A, B, C> = A extends B ? C : unknown;
export type IfSelected<T, K extends keyof T, U> = T extends { [P in K]: true } ? U : unknown;
export type IfSelectedObject<T, K extends keyof T, U> = T extends { [P in K]: {} } ? U : unknown;
