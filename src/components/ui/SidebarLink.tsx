import Link from "next/link";

interface SidebarLinkProps {
   href: string;
   label: string;
   icon: any;
   isActive?: boolean;
}

function SidebarLink({
   href,
   label,
   icon,
   isActive,
}: Readonly<SidebarLinkProps>) {
   const Icon = require(`@/assets/NavigationIcon/${icon}`).default;
   const color = isActive ? "blue-400" : "gray-600";

   return (
      <li className="relative group">
         <Link
            href={href}
            className="flex flex-col justify-center items-center p-2 bg-white hover:bg-gray-100 transition duration-200 rounded-lg"
            aria-label={label}
         >
            <div className="w-6 h-6 mb-2">
               <Icon color={color} />
            </div>
         </Link>

         {/* Tooltip will only show when hovering over the icon */}
         <div
            className={`absolute top-0 -right-2 translate-x-full translate-y-1/2 text-nowrap bg-white shadow-lg px-2.5 rounded-lg text-sm py-1 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
         >
            {label}
         </div>
      </li>
   );
}

export default SidebarLink;
