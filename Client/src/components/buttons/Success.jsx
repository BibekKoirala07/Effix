import { BadgeCheckIcon } from "@heroicons/react/solid";
import React from "react";

const Success = () => {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4 ">
      <div>
        <BadgeCheckIcon height={"22em"} color="green" />
      </div>
      <div className="mt-4 text-[2em] uppercase font-bold">
        Payment Successfull.
      </div>
    </div>
  );
};
export default Success;
