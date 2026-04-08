export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  level: number;
  exp: number;
  emailVerified: Date | null;
  coins: number;
  coinsPending: number;
  createdAt: Date;
  updatedAt: Date;
}
