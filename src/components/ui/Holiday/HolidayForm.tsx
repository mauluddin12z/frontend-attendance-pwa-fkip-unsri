import React from "react";
import FormField from "../Form/FormField";
import { UseFormRegister } from "react-hook-form";

interface HolidayFormProps {
   errors: any;
   register: UseFormRegister<any>;
}

const HolidayForm = ({ register, errors }: HolidayFormProps) => {
   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         {/* Holiday Name */}
         <FormField
            label="Nama Liburan"
            type="text"
            placeholder="Masukkan nama liburan"
            error={errors.name?.message}
            register={register("name", {
               required: "Nama liburan wajib diisi",
               maxLength: {
                  value: 255,
                  message: "Nama liburan tidak boleh lebih dari 255 karakter",
               },
            })}
         />

         {/* Date */}
         <FormField
            label="Tanggal Liburan"
            type="date"
            placeholder="Pilih tanggal liburan"
            error={errors.date?.message}
            register={register("date", {
               required: "Tanggal liburan wajib diisi",
               // Additional validation can be added here if needed
            })}
         />

         {/* Description (optional) */}
         <FormField
            label="Deskripsi"
            type="textarea"
            placeholder="Masukkan deskripsi (opsional)"
            error={errors.description?.message}
            register={register("description")}
         />
      </form>
   );
};

export default HolidayForm;
