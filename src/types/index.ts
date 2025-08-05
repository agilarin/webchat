export * from "./userTypes";
export * from "./userChatTypes";
export * from "./chatTypes";
export * from "./readStatusTypes";
export * from "./messageTypes";

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
  }[Keys];
