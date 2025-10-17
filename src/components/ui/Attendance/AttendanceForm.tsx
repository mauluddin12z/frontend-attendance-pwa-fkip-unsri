import React, { useState } from "react";
import Select, { SingleValue, FilterOptionOption } from "react-select";
import { AttendanceStatus, User } from "@/types";
import { TextareaField } from "../Form/TextAreaField";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import {
   Control,
   Controller,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";
import { useAttendanceStatuses } from "@/hooks/attendance";

interface AttendanceFormProps {
   errors: any;
   register: UseFormRegister<any>;
   watch?: UseFormWatch<any>;
   control: Control<any>;
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
   users,
   userLoading,
   setSearchUser,
   selectedUser,
}: AttendanceFormProps) => {
   const { attendanceStatuses, isLoading } = useAttendanceStatuses();

   // Mapping userOptions
   const userOptions =
      users?.map((user: User) => ({
         value: user.id.toString(),
         label: user.fullName,
         nip: user.nip,
      })) ?? [];

   // Store the selected user value (value and label)
   const [selectedUserValue, setSelectedUserValue] =
      useState<SelectOption | null>(null);

   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         <div>
            <label className="block text-sm font-medium mb-1" htmlFor="userId">
               User
            </label>
            <Controller
               name="userId"
               control={control}
               rules={{ required: "User wajib dipilih" }}
               render={({ field }) => {
                  return (
                     <Select
                        {...field}
                        inputId="userId"
                        options={userOptions}
                        isLoading={userLoading}
                        placeholder={
                           selectedUser?.fullName ||
                           selectedUserValue?.label ||
                           "Cari atau pilih user"
                        }
                        onInputChange={(newValue) => setSearchUser?.(newValue)}
                        noOptionsMessage={() => "No users found"}
                        className={`react-select-container ${
                           errors.userId ? "border-red-500" : "border-gray-300"
                        }`}
                        isDisabled={!!selectedUser || !!selectedUserValue}
                        filterOption={(
                           candidate: FilterOptionOption<SelectOption>,
                           input: string
                        ) => {
                           const lowerInput = input.toLowerCase();
                           const lowerLabel = candidate.label.toLowerCase();
                           const lowerNip = candidate.data?.nip?.toLowerCase();

                           return (
                              lowerLabel.includes(lowerInput) ||
                              lowerNip?.includes(lowerInput)
                           );
                        }}
                        onChange={(
                           selectedOption: SingleValue<SelectOption>
                        ) => {
                           // Handle the selection change
                           setSelectedUserValue(selectedOption);

                           if (selectedOption) {
                              field.onChange(selectedOption.value);
                              setSearchUser?.(selectedOption.label);
                           } else {
                              field.onChange(null);
                           }
                        }}
                     />
                  );
               }}
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
               isLoading
                  ? [{ value: "0", label: "Loading..." }]
                  : attendanceStatuses?.data?.map(
                       (status: AttendanceStatus) => ({
                          key: status.id,
                          value: status.id.toString(),
                          label: status.name,
                       })
                    ) ?? []
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
