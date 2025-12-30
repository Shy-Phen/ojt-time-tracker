import React from "react";
import {
  AccountSettingsCards,
  ChangePasswordCard,
  DeleteAccountCard,
} from "@daveyplate/better-auth-ui";
import Navbar from "@/component/Navbar";

const Settings = () => {
  return (
    <div className="w-full pt-20 flex flex-col justify-center items-center min-h-[90vh">
      <Navbar />
      <AccountSettingsCards
        classNames={{
          card: {
            base: "bg-black/10 ring max-w-xl mx-auto",
            footer: "bg-black/10",
          },
        }}
      />
      <div className="w-full pt-3">
        <ChangePasswordCard
          classNames={{
            base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
            footer: "bg-black/10",
          }}
        />
      </div>
      <div className="w-full p-3">
        <DeleteAccountCard
          classNames={{
            base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
            footer: "bg-black/10",
          }}
        />
      </div>
    </div>
  );
};

export default Settings;
