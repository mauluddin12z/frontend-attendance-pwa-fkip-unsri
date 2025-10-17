import React, { useState, useEffect } from "react";
import Select, { SingleValue, FilterOptionOption } from "react-select";
import { LeaveUser, User } from "@/types";
import { TextareaField } from "../Form/TextAreaField";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import {
   Control,
   Controller,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";

interface LeaveFormProps {
   errors: any;
   register: UseFormRegister<any>;
   watch?: UseFormWatch<any>;
   control: Control<any>;
   users?: User[];
   userLoading?: boolean;
   setSearchUser?: React.Dispatch<React.SetStateAction<string>>;
   selectedUser?: LeaveUser;
}

type SelectOption = { value: string; label: string; nip: string };

const LeaveForm = ({
   register,
   control,
   errors,
   watch,
   users,
   userLoading,
   setSearchUser,
   selectedUser,
}: LeaveFormProps) => {
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

         {/* Tipe izin */}
         <SelectField
            label="Tipe Izin"
            error={errors.leaveType?.message}
            register={register("leaveType")}
            options={[
               { value: "Sakit", label: "Sakit" },
               { value: "Cuti Tahunan", label: "Cuti Tahunan" },
               { value: "Cuti Melahirkan", label: "Cuti Melahirkan" },
               { value: "Cuti Menikah", label: "Cuti Menikah" },
               { value: "Izin Keluarga", label: "Izin Keluarga" },
               { value: "Lainnya", label: "Lainnya" },
            ]}
         />
         <FormField
            label="Dari tanggal"
            type="date"
            error={errors.startDate?.message}
            register={register("startDate", {
               required: "Dari tanggal wajib diisi",
            })}
         />
         <FormField
            label="Sampai tanggal"
            type="date"
            error={errors.endDate?.message}
            register={register("endDate", {
               required: "Sampai tanggal wajib diisi",
            })}
         />

         <TextareaField
            label="Alasan"
            rows={3}
            error={errors.reason?.message}
            register={register("reason")}
            placeholder="Masukkan alasan..."
         />
      </form>
   );
};

export default LeaveForm;
