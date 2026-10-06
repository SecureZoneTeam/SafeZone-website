/** Result returned by the API after a successful authentication (technical story TS18). */
export interface AuthenticatedUser {
  id: number | string;
  username: string;
  token: string;
}
