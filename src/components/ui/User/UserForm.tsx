import React from "react";
import { Role } from "@/types";
import FormField from "../Form/FormField";
import { SelectField } from "../Form/SelectField";
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";

interface UserFormProps {
   formType: string;
   errors: any;
   register: UseFormRegister<any>;
   watch: UseFormWatch<any>;
   control: Control<any>;
   roles: Role[];
   roleLoading: boolean;
}

const UserForm = ({
   formType,
   register,
   control,
   watch,
   errors,
   roles,
   roleLoading,
}: UserFormProps) => {
   return (
      <form className="flex flex-col gap-4 p-4 w-96">
         <FormField
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            error={errors.fullName?.message}
            register={register("fullName", {
               required: "Nama lengkap wajib diisi",
            })}
         />
         <FormField
            label="NIP"
            type="text"
            placeholder="Masukkan NIP Anda"
            error={errors.nip?.message}
            register={register("nip", { required: "NIP wajib diisi" })}
         />
         <FormField
            label="Email"
            type="email"
            placeholder="Masukkan email yang valid"
            error={errors.email?.message}
            register={register("email", {
               required: "Email wajib diisi",
               pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Email tidak valid",
               },
            })}
         />
         <FormField
            label="Nomor Telepon"
            type="text"
            placeholder="Masukkan nomor telepon Anda"
            error={errors.phoneNumber?.message}
            register={register("phoneNumber")}
         />
         <FormField
            label="Password"
            type="password"
            placeholder="Masukkan password Anda"
            error={errors.password?.message}
            register={register("password", {
               ...(formType === "add" && {
                  required: "Password tidak boleh kosong.",
                  pattern: {
                     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                     message:
                        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, serta karakter khusus (contoh: @$!%*?&).",
                  },
               }),
            })}
         />

         <FormField
            label="Konfirmasi Password"
            type="password"
            placeholder="Masukkan konfirmasi password Anda"
            error={errors.confirmPassword?.message}
            register={register("confirmPassword", {
               validate: (value: string) =>
                  value === watch("password") ||
                  "Password dan konfirmasi password tidak cocok",
            })}
         />
         <SelectField
            label="Role"
            error={errors.roleId?.message}
            register={register("roleId", { required: "Role wajib dipilih" })}
            options={
               roleLoading
                  ? [{ value: "0", label: "Loading..." }]
                  : roles?.map((role: Role) => ({
                       key: role.id,
                       value: role.id.toString(),
                       label: role.name,
                    })) ?? []
            }
         />

         {/* isActive */}
         <SelectField
            label="Status Akun"
            error={errors.isActive?.message}
            register={register("isActive", {
               required: "Status akun wajib dipilih",
            })}
            options={[
               { value: "true", label: "Aktif" },
               { value: "false", label: "Tidak Aktif" },
            ]}
         />
      </form>
   );
};

export default UserForm;
