// hooks/useHandleCheck.ts
import toast from "react-hot-toast";
import { getGeolocation } from "./useGeolocation";
import { useState } from "react";

interface UseHandleCheckParams<T> {
  action: (params: T) => Promise<void>;
  getParams: () => T | Promise<T>;
  loadingMessage: string;
  successMessage: string;
  permissionMessage: string;
  onSuccess?: () => void;
  errorNoDataMessage?: string;
}

export function useHandleCheck<T>({
  action,
  getParams,
  loadingMessage,
  successMessage,
  permissionMessage,
  onSuccess,
  errorNoDataMessage,
}: UseHandleCheckParams<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    const toastId = toast.loading(loadingMessage);

    try {
      const position = await getGeolocation();

      const coords = {
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
      };

      const params = await getParams();

      if (errorNoDataMessage && !params) {
        throw new Error(errorNoDataMessage);
      }

      // Merge coords into params (assuming params is an object)
      // If params is void or doesn't need coords, this can be adjusted accordingly
      const finalParams = { ...params, ...coords };

      setIsLoading(true);
      await action(finalParams);
      setIsLoading(false);

      toast.success(successMessage, { id: toastId });
      onSuccess?.();
    } catch (error: any) {
      setIsLoading(false);
      console.error("Check failed:", error);

      if (error.message.includes("denied")) {
        toast.error(
          "You denied location permission. Please enable location services in your browser settings.",
          { id: toastId }
        );
      } else if (error.message.includes("unavailable")) {
        toast.error(
          "Location information is unavailable. Please make sure your GPS/location is enabled.",
          { id: toastId }
        );
      } else if (error.message.includes("timed out")) {
        toast.error(
          "Location request timed out. Please try again or move to an area with better GPS signal.",
          { id: toastId }
        );
      } else if (errorNoDataMessage && error.message.includes(errorNoDataMessage)) {
        toast.error(errorNoDataMessage, { id: toastId });
      } else {
        toast.error(`Check failed: ${error.message}`, { id: toastId });
      }
    }
  };

  return {
    handleCheck,
    isLoading,
  };
}
