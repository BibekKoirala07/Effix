import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="p-4 mt-auto bg-accent flex flex-col items-center  shadow md:px-6 md:py-8 ">
        <div className=" w-full max-w-[1080px] sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0"
          >
            <img
              src="/photos/logo.png"
              className="mr-3 h-8"
              alt="Flowbite Logo"
            />
          </a>

          <span className="block text-sm text-gray-200 sm:text-center ">
            © 2022{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Efix™
            </a>
            . All Rights Reserved.
          </span>
        </div>
        <hr className="w-full max-w-[1080px] my-6 bg-gray-200 border-gray-200 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-gray-200 sm:text-center ">
          "Fabulous services for fabulous clients"
        </span>
      </footer>
    </>
  );
};

export default Footer;
