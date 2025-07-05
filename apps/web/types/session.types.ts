import { TRole } from "./role-type";

export type Session = {
  user: { id: string; name: string; role: TRole };
  accessToken: string;
  refreshToken: string;
};
