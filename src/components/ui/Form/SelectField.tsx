import { UseFormRegisterReturn } from "react-hook-form";

type SelectFieldProps = {
   label: string;
   error?: string;
   register: UseFormRegisterReturn;
   options: { value: string; label: string }[];
};

export function SelectField({
   label,
   error,
   register,
   options,
}: Readonly<SelectFieldProps>) {
   return (
      <div>
         <label
            className="block text-sm font-medium mb-1"
            htmlFor={register.name}
         >
            {label}
         </label>
         <select
            {...register}
            id={register.name}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               error ? "border-red-500" : "border-gray-300"
            }`}
         >
            <option value="" disabled>
               Pilih {label.toLowerCase()}
            </option>
            {options.map(({ value, label }) => (
               <option key={value} value={value}>
                  {label}
               </option>
            ))}
         </select>
         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
   );
}
