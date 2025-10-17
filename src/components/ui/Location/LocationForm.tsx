import React from "react";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

interface LocationFormProps {
   errors: any;
   register: UseFormRegister<any>;
   watch: UseFormWatch<any>;
}

const LocationForm = ({ register, errors }: LocationFormProps) => {
   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         {/* Name */}
         <FormField
            label="Nama Lokasi"
            placeholder="Masukkan nama lokasi"
            type="text"
            error={errors.name?.message}
            register={register("name", {
               required: "Nama wajib diisi",
            })}
         />

         {/* Latitude */}
         <FormField
            label="Latitude"
            placeholder="Masukkan latitude"
            type="number"
            error={errors.latitude?.message}
            register={register("latitude", {
               required: "Latitude wajib diisi",
               valueAsNumber: true,
            })}
         />

         {/* Longitude */}
         <FormField
            label="Longitude"
            placeholder="Masukkan longitude"
            type="number"
            error={errors.longitude?.message}
            register={register("longitude", {
               required: "Longitude wajib diisi",
               valueAsNumber: true,
            })}
         />

         {/* Radius in Meters */}
         <FormField
            label="Radius (Meter)"
            placeholder="Masukkan radius dalam meter"
            type="number"
            error={errors.radiusMeters?.message}
            register={register("radiusMeters", {
               required: "Radius wajib diisi",
               valueAsNumber: true,
               min: {
                  value: 1,
                  message: "Radius minimal harus 1 meter",
               },
            })}
         />

         {/* Is Active */}
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

export default LocationForm;
