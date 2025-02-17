/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  BookmarkAltIcon,
  ChartBarIcon,
  PhoneIcon,
  PlayIcon,
  SupportIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const solutions = [
  {
    name: "Home Service",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: ChartBarIcon,
  },
];
const callsToAction = [
  { name: "Watch Demo", href: "#", icon: PlayIcon },
  { name: "Contact Sales", href: "#", icon: PhoneIcon },
];
const resources = [
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
    icon: SupportIcon,
  },
  {
    name: "Guides",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
    icon: BookmarkAltIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = ({ toogleLogin, toogleRegister }) => {
  const User = useSelector((state) => state.user);
  return (
    <Popover className="relative bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center  border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <img
                className="h-8 w-auto rounded "
                src="/photos/logo.png"
                alt=""
              />
            </a>
          </div>

          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            <NavLink
              to={"/"}
              activeClassName="text-secondary"
              className="text-white group bg-accent rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none "
            >
              {" "}
              Home
            </NavLink>{" "}
            <NavLink
              to={"/contact"}
              activeClassName="text-secondary"
              className="text-white group bg-accent rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none "
            >
              {" "}
              About
            </NavLink>
          </Popover.Group>
          <NavLink
            to={"/contact"}
            activeClassName="text-secondary"
            className="text-white group bg-accent rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none "
          >
            {" "}
            Contact
          </NavLink>
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open ? "text-gray-900" : "text-white",
                    "group bg-accent rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none "
                  )}
                >
                  <span>Services</span>
                  <ChevronDownIcon
                    className={classNames(
                      open ? "text-gray-600" : "text-gray-400",
                      "ml-2 h-5 w-5 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-accent px-5 py-6 sm:gap-8 sm:p-8">
                        {resources.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                          >
                            <item.icon
                              className="flex-shrink-0 h-6 w-6 text-indigo-600"
                              aria-hidden="true"
                            />
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="mt-1 text-sm text-white">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          {console.log(User)}
          {User?.isLoggedIn ? (
            ""
          ) : (
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <div
                onClick={() => toogleLogin(true)}
                className="cursor-pointer whitespace-nowrap text-base font-medium text-white hover:text-gray-900"
              >
                Sign in
              </div>
              <a
                className="ml-8 cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-indigo-700"
                onClick={() => toogleRegister(true)}
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>
    </Popover>
  );
};

export default NavBar;
