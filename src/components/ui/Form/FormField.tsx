import { UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
   label: string;
   error?: string;
   register: UseFormRegisterReturn;
   type?: string;
};

export default function FormField({
   label,
   error,
   register,
   type = "text",
}: Readonly<FormFieldProps>) {
   return (
      <div>
         <label
            className="block text-sm font-medium mb-1"
            htmlFor={register.name}
         >
            {label}
         </label>
         <input
            type={type}
            id={register.name}
            {...register}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               error ? "border-red-500" : "border-gray-300"
            }`}
         />
         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
   );
}
