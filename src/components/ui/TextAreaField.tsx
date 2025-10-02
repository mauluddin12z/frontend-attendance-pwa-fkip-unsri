import { UseFormRegisterReturn } from "react-hook-form";

type TextareaFieldProps = {
   label: string;
   error?: string;
   register: UseFormRegisterReturn;
   placeholder?: string;
   rows?: number;
};

export function TextareaField({
   label,
   error,
   register,
   placeholder,
   rows = 4,
}: TextareaFieldProps) {
   return (
      <div>
         <label
            className="block text-sm font-medium mb-1"
            htmlFor={register.name}
         >
            {label}
         </label>
         <textarea
            {...register}
            id={register.name}
            rows={rows}
            placeholder={placeholder}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               error ? "border-red-500" : "border-gray-300"
            }`}
         />
         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
   );
}
