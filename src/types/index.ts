// User Interface (for login or user info)
export interface Login {
   username: string;
   password: string;
}
export interface User {
   id: number;
   fullName: string;
   nip: string;
   email: string;
   phoneNumber: string;
   isActive: number;
   roleId: number;
   role: Role;
}
export interface Role {
   id: number;
   name: string;
   description?: string;
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
   status?: "menunggu persetujuan" | "disetujui" | "ditolak" | "dibatalkan";
   approverId?: number | null;
   approvalNotes?: string | null;
   approver?: Approver;
   leaveUser?: LeaveUser;
   createdAt?: string;
}
export interface WorkingHour {
   id: number;
   dayOfWeek: string;
   startTime: string;
   endTime: string;
   gracePeriodMinutes: string;
   isActive: boolean;
}
export interface WorkingHourForm {
   dayOfWeek: string;
   startTime: string;
   endTime: string;
   gracePeriodMinutes: string;
   isActive: string;
}

export interface Holiday {
   id: number;
   name: string;
   date: string;
   description?: string | null;
}

export interface HolidayForm {
   name: string;
   date: string;
   description?: string | null;
}

export interface Location {
   id: number;
   name: string;
   latitude: number;
   longitude: number;
   radiusMeters: number;
   isActive: boolean;
}
export interface LocationForm {
   name: string;
   latitude: string;
   longitude: string;
   radiusMeters: string;
   isActive: string;
}
export interface AuditLog {
   id: number;
   userId: number;
   action: string;
   details: object;
   createdAt: string;
   user: User;
}

// Types
export interface UserForm {
   roleId?: string;
   fullName?: string;
   nip?: string;
   email?: string;
   phoneNumber?: string;
   password?: string;
   confirmPassword?: string;
   isActive?: string;
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
   status?: string;
   approverId?: string;
   approvalNotes?: string;
}
