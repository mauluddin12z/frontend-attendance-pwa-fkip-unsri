import React from "react";
import Select, { SingleValue, FilterOptionOption } from "react-select";
import { AttendanceStatus, User } from "@/types";
import { TextareaField } from "../Form/TextAreaField";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import { Controller } from "react-hook-form";

interface AttendanceFormProps {
   formType: string;
   register: any;
   control: any;
   watch?: any;
   errors: any;
   attendanceStatuses: AttendanceStatus[];
   attendanceStatusLoading: boolean;
   users?: User[];
   userLoading?: boolean;
   setSearchUser?: React.Dispatch<React.SetStateAction<string>>;
   selectedUser?: User;
}

type SelectOption = { value: string; label: string; nip: string };

const AttendanceForm = ({
   register,
   control,
   errors,
   attendanceStatuses,
   attendanceStatusLoading,
   users,
   userLoading,
   setSearchUser,
   selectedUser,
}: AttendanceFormProps) => {
   // Mapping userOptions
   const userOptions =
      users?.map((user: User) => ({
         value: user.id.toString(),
         label: user.fullName,
         nip: user.nip,
      })) ?? [];

   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         <div>
            <label className="block text-sm font-medium mb-1" htmlFor="userId">
               User
            </label>
            <Controller
               name="userId"
               control={control}
               render={({ field }) => (
                  <Select
                     {...field}
                     id="userId"
                     options={userOptions}
                     isLoading={userLoading}
                     placeholder={
                        selectedUser?.fullName || "Cari atau pilih user"
                     }
                     onInputChange={(newValue) => setSearchUser?.(newValue)}
                     noOptionsMessage={() => "No users found"}
                     className={`react-select-container ${
                        errors.userId ? "border-red-500" : "border-gray-300"
                     }`}
                     isDisabled={!!selectedUser}
                     filterOption={(
                        candidate: FilterOptionOption<SelectOption>,
                        input: string
                     ) => {
                        const lowerInput = input.toLowerCase();
                        const lowerLabel = candidate.label.toLowerCase();
                        const lowerNip = candidate.data.nip.toLowerCase();

                        return (
                           lowerLabel.includes(lowerInput) ||
                           lowerNip.includes(lowerInput)
                        );
                     }}
                     onChange={(selectedOption: SingleValue<SelectOption>) => {
                        field.onChange(selectedOption?.value);
                        if (selectedOption) {
                           setSearchUser?.(selectedOption.label);
                        }
                     }}
                  />
               )}
            />
            {errors.userId?.message && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.userId?.message}
               </p>
            )}
         </div>
         <FormField
            label="Tanggal"
            type="date"
            error={errors.date?.message}
            register={register("date", {
               required: "Tanggal wajib diisi",
            })}
         />
         <SelectField
            label="Status Absensi"
            error={errors.attendanceStatusId?.message}
            register={register("attendanceStatusId", {
               required: "Status Absensi wajib dipilih",
            })}
            options={
               attendanceStatusLoading
                  ? [{ value: "0", label: "Loading..." }]
                  : attendanceStatuses?.map((status: AttendanceStatus) => ({
                       key: status.id,
                       value: status.id.toString(),
                       label: status.name,
                    })) ?? []
            }
         />
         <TextareaField
            label="Catatan"
            error={errors.notes?.message}
            register={register("notes")}
            placeholder="Masukkan catatan..."
         />
      </form>
   );
};

export default AttendanceForm;
