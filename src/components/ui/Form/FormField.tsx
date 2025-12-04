import { UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
   label: string;
   error?: string;
   register: UseFormRegisterReturn;
   placeholder?: string;
   type?: string;
   isDisable?:boolean
};

export default function FormField({
   label,
   error,
   register,
   placeholder,
   type = "text",
   isDisable = false,
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
            id={register.name}
            type={type}
            placeholder={placeholder}
            {...register}
            disabled={isDisable}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               error ? "border-red-500" : "border-gray-300"
            } ${isDisable && "bg-gray-200 text-gray-600"}`}
         />
         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
   );
}
