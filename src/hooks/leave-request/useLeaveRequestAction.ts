import {
   Attendance,
   AttendanceForm,
   LeaveRequest,
   LeaveRequestForm,
} from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import {
   useApproveLeaveRequest,
   useCreateLeaveRequest,
   useDeleteLeaveRequest,
   useRejectLeaveRequest,
   useUpdateLeaveRequest,
} from "./useLeaveRequests";

export default function useAttendanceAction(
   mutate: () => void,
   closeModal: () => void,
   setError: any
) {
   const { createLeaveRequest, isCreating } = useCreateLeaveRequest();
   const { updateLeaveRequest, isUpdating } = useUpdateLeaveRequest();
   const { deleteLeaveRequest, isDeleting } = useDeleteLeaveRequest();
   const { approveLeaveRequest, isApproving } = useApproveLeaveRequest();
   const { rejectLeaveRequest, isRejecting } = useRejectLeaveRequest();

   const handleAction = async (
      action: "add" | "edit" | "delete" | "approve" | "reject",
      data?: LeaveRequestForm,
      selectedLeaveRequest?: LeaveRequest | null
   ) => {
      const actionMap = {
         add: "Menambahkan",
         edit: "Mengedit",
         delete: "Menghapus",
         approve: "Menyetujui",
         reject: "Menolak",
      };

      const successMap = {
         add: "ditambahkan",
         edit: "diedit",
         delete: "dihapus",
         approve: "disetujui",
         reject: "ditolak",
      };

      const toastId = toast.loading(`${actionMap[action]}...`);

      try {
         let formData = new FormData();

         // Handle data for add or edit actions
         if (["add", "edit", "approve", "reject"].includes(action)) {
            if (data) {
               const {
                  userId,
                  startDate,
                  endDate,
                  leaveType,
                  reason,
                  status,
                  approverId,
                  approvalNotes,
               } = data;

               formData = createFormData({
                  userId,
                  startDate,
                  endDate,
                  leaveType,
                  reason,
                  status: status!,
                  approverId: approverId!,
                  approvalNotes: approvalNotes!,
               });
            } else {
               toast.error("Data absensi tidak terdefinisi.", { id: toastId });
               return;
            }
         }

         // Perform the action (add, edit, or delete)
         switch (action) {
            case "add":
               await createLeaveRequest(formData);
               break;
            case "edit":
               if (selectedLeaveRequest?.id)
                  await updateLeaveRequest(selectedLeaveRequest.id, formData);
               break;
            case "delete":
               if (selectedLeaveRequest?.id)
                  await deleteLeaveRequest(selectedLeaveRequest.id);
               break;
            case "approve":
               if (selectedLeaveRequest?.id)
                  await approveLeaveRequest(selectedLeaveRequest.id, formData);
               break;
            case "reject":
               if (selectedLeaveRequest?.id)
                  await rejectLeaveRequest(selectedLeaveRequest.id, formData);
               break;
            default:
               throw new Error("Invalid action type.");
         }

         // Refresh attendance data and close modal
         mutate();
         closeModal();

         // Success toast
         toast.success(`Absensi berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   // Helper function to create form data
   const createFormData = ({
      userId,
      startDate,
      endDate,
      leaveType,
      reason,
      status,
      approverId,
      approvalNotes,
   }: {
      userId: string;
      startDate: string;
      endDate: string;
      leaveType: string;
      reason: string;
      status?: string;
      approverId?: string;
      approvalNotes?: string;
   }) => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("leaveType", leaveType);
      formData.append("reason", reason);
      if (status) formData.append("status", status);
      if (approverId) formData.append("approverId", approverId);
      if (approvalNotes) formData.append("approvalNotes", approvalNotes);

      return formData;
   };

   // Handle errors and map Joi validation errors to the form
   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<AttendanceForm>(error.details, setError, [
            "date",
            "attendanceStatusId",
            "notes",
         ]);
         toast.error("Mohon perbaiki kesalahan yang ditandai.", {
            id: toastId,
         });
      } else {
         toast.error(
            error?.message || "Gagal mengedit data. Silakan coba lagi.",
            { id: toastId }
         );
      }
   };

   return {
      handleAction,
      isCreating,
      isUpdating,
      isDeleting,
      isApproving,
      isRejecting,
   };
}
