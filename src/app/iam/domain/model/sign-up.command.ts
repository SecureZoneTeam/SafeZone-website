/**
 * Command issued when a visitor registers as the owner of a NEW organization.
 * The backend always creates the organization and assigns ROLE_OWNER; the client cannot choose either.
 * `planCode` carries the subscription plan selected on the Landing Page pricing section.
 */
export interface SignUpCommand {
  fullName: string;
  email: string;
  username: string;
  password: string;
  organizationName: string;
  planCode?: string | null;
}
