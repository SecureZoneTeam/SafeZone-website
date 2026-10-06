/**
 * Command issued when a visitor registers a new NodeSecure account.
 * `planCode` carries the subscription plan selected on the Landing Page pricing section,
 * so the call-to-action of each target segment lands on a pre-filled experience.
 */
export interface SignUpCommand {
  username: string;
  email: string;
  password: string;
  fullName: string;
  planCode?: string | null;
}
