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
