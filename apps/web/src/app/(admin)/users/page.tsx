"use client";

import { RedirectButton } from "@components/custom/Redirect/redirect-button";
import { axiosInstance } from "@/lib";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      const response: AxiosResponse<User[]> = await axiosInstance.get(
        "/users/test/userList",
      );
      console.log(response.data);
      setUsers(response.data);
    };
    fetchUser();
    return () => {};
  }, []);
  return (
    <>
      UserList
      <RedirectButton route="/login">Login</RedirectButton>
      {users ? (
        <ul>
          {users.map((user) => {
            return (
              <li key={user.id}>
                {user.username} - {user.email}
              </li>
            );
          })}
        </ul>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};
export default UsersPage;
