import { User } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";

interface UserTableProps {
   users: User[];
   userLoading: boolean;
   openModal: (user: User, action: "detail" | "edit" | "delete") => void;
   columnVisibility?: {
      id?: boolean;
      fullName?: boolean;
      nip?: boolean;
      email?: boolean;
      phoneNumber?: boolean;
      password?: boolean;
      role?: boolean;
      action?: boolean;
   };
}

const UserTable = ({
   users,
   userLoading,
   openModal,
   columnVisibility = {},
}: UserTableProps) => {
   const defaultVisibility = {
      id: true,
      fullName: true,
      nip: true,
      email: true,
      phoneNumber: true,
      password: false,
      role: true,
      action: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">ID</th>}
               {finalColumnVisibility.fullName && (
                  <th className="px-6 py-3">Nama</th>
               )}
               {finalColumnVisibility.nip && <th className="px-6 py-3">NIP</th>}
               {finalColumnVisibility.email && (
                  <th className="px-6 py-3">Email</th>
               )}
               {finalColumnVisibility.phoneNumber && (
                  <th className="px-6 py-3">Nomor Telepon</th>
               )}
               {finalColumnVisibility.password && (
                  <th className="px-6 py-3">Password</th>
               )}
               {finalColumnVisibility.role && (
                  <th className="px-6 py-3">Role</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3 text-center">Aksi</th>
               )}
            </tr>
         </thead>
         <tbody>
            {userLoading ? (
               <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : users.length === 0 ? (
               <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                     Tidak ada data pengguna
                  </td>
               </tr>
            ) : (
               users.map((user: User) => (
                  <tr
                     key={user.id}
                     className="bg-white border-b border-gray-200"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{user.id}</td>
                     )}
                     {finalColumnVisibility.fullName && (
                        <td className="px-6 py-4">{user.fullName}</td>
                     )}
                     {finalColumnVisibility.nip && (
                        <td className="px-6 py-4">{user.nip}</td>
                     )}
                     {finalColumnVisibility.email && (
                        <td className="px-6 py-4">{user.email}</td>
                     )}
                     {finalColumnVisibility.phoneNumber && (
                        <td className="px-6 py-4">{user.phoneNumber}</td>
                     )}
                     {finalColumnVisibility.role && (
                        <td className="px-6 py-4">{user.role.name}</td>
                     )}
                     <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                           <button
                              onClick={() => openModal(user, "edit")}
                              className="font-medium text-blue-600 hover:underline cursor-pointer"
                           >
                              Edit
                           </button>
                           <button
                              onClick={() => openModal(user, "delete")}
                              className="font-medium text-red-600 hover:underline cursor-pointer"
                           >
                              Delete
                           </button>
                        </div>
                     </td>
                  </tr>
               ))
            )}
         </tbody>
      </table>
   );
};

export default UserTable;
