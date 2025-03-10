import React from "react";

const Spinner = () => {
  return (
    // <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-[0.5] z-[5211220]">
    //   <span className="text-accent opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0 top-[50%]">
    //     <div
    //       className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0"
    //       role="status"
    //     >
    //       <span className="visually-hidden">Loading...</span>
    //     </div>
    //   </span>
    // </div>
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-[0.5] z-[5211220]">
      <span className="text-accent opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0 top-[50%]">
        <div
          className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </span>
    </div>
  );
};

export default Spinner;
