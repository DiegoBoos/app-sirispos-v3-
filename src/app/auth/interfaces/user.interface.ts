export interface User {
  user_id: string;
  email: string;
  nombre: string;
  activo: number;
  userRoles?: UserRole[];
}

export interface UserRole {
  userRoleId: number;
  userId: number;
  roleId: number;
  role: Role;
}

export interface Role {
  roleId: number;
  name: string;
  descripcion: string;
}
