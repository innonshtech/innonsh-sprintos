export type UserRole = 
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "DEVELOPER"
  | "MARKETING";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  avatar?: string;
  status?: "ONLINE" | "OFFLINE";
  color?: string;
}
