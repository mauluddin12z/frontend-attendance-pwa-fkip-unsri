// utils/debounce.ts
let timeout: NodeJS.Timeout;

export const performDebounce = (
   setter: React.Dispatch<React.SetStateAction<any>>,
   delay: number,
   value: string,
   filterName: string
) => {
   clearTimeout(timeout);
   timeout = setTimeout(() => {
      setter((prev: any) => ({ ...prev, [filterName]: value, page: 1 }));
   }, delay);
};

export const debounceFilterUpdate = (
   setter: React.Dispatch<React.SetStateAction<any>>,
   delay: number
) => {
   return (value: string, filterName: string) => {
      performDebounce(setter, delay, value, filterName);
   };
};
