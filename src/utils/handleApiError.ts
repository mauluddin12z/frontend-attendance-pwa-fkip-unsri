interface ApiError {
   message: string;
   code?: string;
}

// Utility function to handle API errors
export function handleApiError(
   error: any,
   fallbackMessage = "An error occurred"
) {
   const errorData = error?.response?.data || {};

   const err: { message: string; errorType?: string; details?: any } = {
      message: errorData.message || fallbackMessage,
   };

   if (errorData.errorType) {
      err.errorType = errorData.errorType;
   }
   if (errorData.details) {
      err.details = errorData.details;
   }

   return err;
}
