export enum ESTADO{
  ACTIVO = "activo",
  FINALIZADO = "finalizado",
}

export type Cliente = {
  name: string;
  email: string; //formato email
  cards: Tarjeta[];
  travels?: Viaje[];
}

export type Tarjeta = {
  number: string; //formato tarjeta
  cvv: number; //3 digitos
  expiration: string ; //MM/YYYY
  money: number;
}

export type Conductor = {
  name: string;
  email: string; //formato email
  username: string;
  travels: Viaje[];
}

export type Viaje = {
  client: string;
  driver: string;
  money: number;  // min 5
  distance: number; //km, min 0,01 km
  date: string;
  status: ESTADO; //enum?????
}
