export default function getPageNumbers(
   current: number,
   total: number,
   maxVisible: number = 5
) {
   const pages: (number | string)[] = [];
   const half = Math.floor(maxVisible / 2);

   let start = Math.max(2, current - half);
   let end = Math.min(total - 1, current + half);

   if (current - 1 <= half) {
      end = Math.min(total - 1, maxVisible);
   }

   if (total - current <= half) {
      start = Math.max(2, total - maxVisible + 1);
   }

   pages.push(1); // First page always

   if (start > 2) pages.push("..."); // Ellipsis

   for (let i = start; i <= end; i++) {
      pages.push(i);
   }

   if (end < total - 1) pages.push("..."); // Ellipsis

   if (total > 1) pages.push(total); // Last page

   return pages;
}
