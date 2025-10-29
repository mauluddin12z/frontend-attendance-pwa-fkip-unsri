const SectionCard = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => (
   <div
      className={`p-4 border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}
   >
      {children}
   </div>
);

export default SectionCard;
