import { getBackendURL } from " @/lib/utils";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type User = {
  username: string;
  website: string;
  affiliation: string;
  country: string;
};

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(getBackendURL() + "/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Users
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow
              key={user.username}
              className={i % 2 ? "" : "bg-zinc-50 dark:bg-zinc-800"}
            >
              <TableCell className="text-blue-600 hover:cursor-pointer dark:text-blue-400">
                {user.username}
              </TableCell>
              <TableCell className="dark:text-zinc-300">
                {user.website}
              </TableCell>
              <TableCell className="dark:text-zinc-300">
                {user.affiliation}
              </TableCell>
              <TableCell className="dark:text-zinc-300">
                {user.country}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
