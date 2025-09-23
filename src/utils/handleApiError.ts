interface ApiError {
   message: string;
   code?: string;
}

// Utility function to handle API errors
const handleApiError = (error: any): ApiError => {
   if (error?.response?.data) {
      return error.response.data;
   }
   return { message: error?.message || "Unknown error occurred" };
};
