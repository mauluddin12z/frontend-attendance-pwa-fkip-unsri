"use client";
import AdminSidebar from "@/components/layout/administrator/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import Loading from "../loading";

export default function AdministratorLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { handleLogout, isLoading: userLoading } = useAuth();
   if (userLoading) {
      return <Loading />;
   }
   return (
      <div className="flex min-h-screen">
         <AdminSidebar onLogout={handleLogout} />
         <div className="pl-20 flex flex-col flex-1 w-full">
            <main className="p-4">{children}</main>
         </div>
      </div>
   );
}
