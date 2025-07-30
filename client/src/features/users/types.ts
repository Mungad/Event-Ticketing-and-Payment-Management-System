export type TUser = {
  user_id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  password: string;
  contact_phone: string | null;
  address: string | null;
  role: "user" | "admin"; 
  verificationCode: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
};
