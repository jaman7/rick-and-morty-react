export interface IDictType {
  displayName?: string;
  id?: number | string;
  [name: string]: any;
}

export interface IDictionaries {
  [name: string]: IDictType[];
}
