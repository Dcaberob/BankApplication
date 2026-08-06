import React, { useState } from "react";
import UserList from "./user_list";
import UserForm from "./user_form";

export default function Users() {
  const [refresh, setRefresh] = useState(false);

  const handleUserCreated = () => {
    setRefresh((prev) => !prev); // Toggle refresh to reload user list.
  };

  return (
    <div className="mt-5">
      <UserList onRefresh={refresh} />
      <UserForm onUserCreated={handleUserCreated} />
    </div>
  );
}
