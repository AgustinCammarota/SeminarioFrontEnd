
export interface Provincia {
  id?: number;
  provincia: string;
}

export class Provincia {
  constructor(public provincia: string,
              public id?: number) {}
}
