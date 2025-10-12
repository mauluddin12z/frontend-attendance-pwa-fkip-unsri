// User Interface (for login or user info)
export interface User {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   phoneNumber: string;
   username: string;
   password: string;
   roleId: number;
}
export interface Session {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   phoneNumber: string;
   role: string;
}

// Attendance Interface
export interface Attendance {
   id: number;
   userId: number;
   date: string;
   attendanceStatusId: number;
   notes: string;
   user?: User;
   attendanceStatus?: AttendanceStatus;
   attendanceDetails?: AttendanceDetail[];
}
export interface AttendanceDetail {
   id: number;
   type: "checkIn" | "checkOut";
   timestamp: string;
   latitude: string;
   longitude: string;
}
export interface AttendanceStatus {
   id: number;
   name: string;
}

export interface SettingsGeofence {
   name: string;
   latitude: number;
   longitude: number;
   radiusMeters: number;
   isActive: boolean;
}

export interface UserLocation {
   lat: number;
   lng: number;
}

export interface Approver {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   phoneNumber: string;
}
export interface LeaveUser {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   phoneNumber: string;
}

export interface LeaveRequest {
   id: number;
   userId: number;
   leaveType: string;
   startDate: string;
   endDate: string;
   reason: string;
   status?: "pending" | "approved" | "rejected" | "canceled";
   approverId?: number | null;
   approvalNotes?: string | null;
   approver?: Approver;
   leaveUser?: LeaveUser;
   createdAt?: string;
}

// Types
export interface AttendanceForm {
   userId?: string;
   date?: string;
   attendanceStatusId?: string;
   notes?: string;
}
// Types
export interface LeaveRequestForm {
   userId: string;
   startDate: string;
   endDate: string;
   leaveType: string;
   reason: string;
}
export interface Holiday {
   name: string;
   date: string;
   description: string;
}
