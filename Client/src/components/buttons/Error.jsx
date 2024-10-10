import { BadgeCheckIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import React from "react";

const Success = () => {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4 ">
      <div>
        <ExclamationCircleIcon height={"22em"} color="red" />
      </div>
      <div className="mt-4 text-[2em] uppercase font-bold">
        Payment Couldn't be completed
      </div>
    </div>
  );
};
export default Success;
