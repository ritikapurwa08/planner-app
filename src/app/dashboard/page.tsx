"use client";

import LogoutButton from "@/components/auth/log-out-button";
import { useGetCurrentUser } from "@/api/users/user-query";

import React from "react";

const DashBoard = () => {
  const user = useGetCurrentUser();
  return (
    <div>
      {user ? <div>{user.email}</div> : "no"}

      <div>
        <LogoutButton />
      </div>
      <span>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero
        inventore explicabo recusandae dolores, nemo eius sit dolorem eaque
        alias non!
      </span>
    </div>
  );
};

export default DashBoard;
