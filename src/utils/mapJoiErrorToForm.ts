import { FieldValues, UseFormSetError } from "react-hook-form";

// Maps Joi validation errors to react-hook-form `setError` calls.

export function mapJoiErrorsToForm<T extends FieldValues>(
   details: any[],
   setError: UseFormSetError<T>,
   fieldWhitelist?: string[]
) {
   details.forEach((err) => {
      const path = err?.path?.join?.(".") || "";

      const matchedField = fieldWhitelist
         ? fieldWhitelist.find((field) => path.includes(field))
         : path;

      if (matchedField) {
         setError(matchedField, {
            type: "manual",
            message: err.message,
         });
      }
   });
}
