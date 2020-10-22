
export class Categoria {
  constructor(public categoria: string,
              public id?: number) {}
}

export interface Categoria {
  categoria: string;
  id?: number;
}
