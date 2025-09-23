import axiosInstance from "@/api/axiosInstance";

// Generic queryparams filters
export const buildQueryParams = (filters: any) => {
   const params = new URLSearchParams();

   if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
         if (value !== null && value !== undefined && value !== "") {
            params.append(key, value.toString());
         }
      });
   }

   return params;
};

// Generic API call function
const apiRequest = async (
   url: string,
   method: "get" | "post" | "patch" | "delete",
   params?: any,
   data?: any
) => {
   try {
      const config = {
         params: params ? buildQueryParams(params) : undefined,
         data: data || undefined,
      };
      const response = await axiosInstance[method](url, config);
      return response.data;
   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         "An error occurred while processing the request";
      throw new Error(message);
   }
};

// Generic GET request function
export const fetchData = (url: string, params?: any) =>
   apiRequest(url, "get", params);

// Generic POST request function
export const postData = (url: string, data: any) =>
   apiRequest(url, "post", undefined, data);

// Generic PATCH request function
export const patchData = (url: string, data: any) =>
   apiRequest(url, "patch", undefined, data);

// Generic DELETE request function
export const deleteData = (url: string) => apiRequest(url, "delete");
