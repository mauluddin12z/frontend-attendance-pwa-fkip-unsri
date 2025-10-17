import React from "react";
import { WorkingHour } from "@/types";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";

interface WorkingHourFormProps {
   errors: any;
   register: UseFormRegister<any>;
   watch: UseFormWatch<any>;
}

const WorkingHourForm = ({ register, errors }: WorkingHourFormProps) => {
   // Define the days of the week
   const daysOfWeek = [
      { value: "1", label: "Senin" },
      { value: "2", label: "Selasa" },
      { value: "3", label: "Rabu" },
      { value: "4", label: "Kamis" },
      { value: "5", label: "Jumat" },
      { value: "6", label: "Sabtu" },
      { value: "0", label: "Minggu" },
   ];

   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         {/* Day of the Week */}
         <SelectField
            label="Hari"
            error={errors.dayOfWeek?.message}
            register={register("dayOfWeek", { required: "Hari wajib dipilih" })}
            options={daysOfWeek}
         />

         {/* Start Time */}
         <FormField
            label="Waktu Mulai"
            type="time"
            placeholder="Masukkan waktu mulai"
            error={errors.startTime?.message}
            register={register("startTime", {
               required: "Waktu mulai wajib diisi",
            })}
         />

         {/* End Time */}
         <FormField
            label="Waktu Selesai"
            type="time"
            placeholder="Masukkan waktu selesai"
            error={errors.endTime?.message}
            register={register("endTime", {
               required: "Waktu selesai wajib diisi",
            })}
         />

         {/* Grace Period Minutes */}
         <FormField
            label="Masa Tenggang (Menit)"
            type="number"
            placeholder="Masukkan masa tenggang"
            error={errors.gracePeriodMinutes?.message}
            register={register("gracePeriodMinutes", {
               required: "Masa tenggang wajib diisi",
               valueAsNumber: true,
               min: {
                  value: 0,
                  message: "Masa tenggang tidak boleh kurang dari 0",
               },
            })}
         />

         {/* Active Status */}
         <SelectField
            label="Status Aktif"
            error={errors.isActive?.message}
            register={register("isActive", {
               required: "Status aktif wajib dipilih",
            })}
            options={[
               { value: "true", label: "Aktif" },
               { value: "false", label: "Tidak Aktif" },
            ]}
         />
      </form>
   );
};

export default WorkingHourForm;
