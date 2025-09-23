// User Interface (for login or user info)
export interface User {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   username: string;
   password: string;
   roleId: number;
}
export interface Session {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   role: string;
}

// Attendance Interface
export interface Attendance {
   id: number;
   userId: number;
   date: string;
   attendanceStatusId: number;
   notes: string;
}
