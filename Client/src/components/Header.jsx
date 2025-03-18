import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { Menu } from "@headlessui/react";

import {
  SearchIcon,
  MenuIcon,
  ShoppingBagIcon,
  XIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { getService, logOutUser } from "../services/user.services";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../redux/actions/user.actions";
import { toogleEmail, tooglePassword } from "../redux/reducers/User";
import { useEffect } from "react";

const navigationDemo = {
  categories: [
    {
      id: "services",
      name: "Services",
      featured: [],
      sections: [
        {
          id: "",
          name: "",
          items: [],
        },
      ],
    },
  ],
  pages: [{ name: "Home", href: "/" }],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({
  toogleLogin,
  toogleRegister,
  toogleOrder,
  count,
}) {
  const [open, setOpen] = useState(false);
  const User = useSelector((state) => state.user);
  const history = useHistory();
  const cookie = new Cookies();
  const dispatch = useDispatch();

  const router = useHistory();
  const [navigation, setList] = useState(navigationDemo);
  const logout = async () => {
    const [response] = await logOutUser();
    if (response) {
      cookie.remove("token", { path: "/" });
      dispatch(getUserDetails());
    }
  };

  const getServices = async () => {
    const [response] = await getService();
    if (response) {
      const temp = [];

      for (var i = 0; i < response.data.length; i = i + 10) {
        temp.push({
          id: i,
          name: "",
          items: response.data
            .filter((data, index) => index <= i + 10)
            .map((dat) => {
              return { name: dat.title, href: dat._id };
            }),
        });
      }
      const payload = {
        ...navigation,
        categories: [
          {
            id: "services",
            name: "Services",
            featured: [],
            sections: [...temp],
          },
        ],
      };
      setList(payload);
    }
  };

  const handleLoginClose = (value) => {
    dispatch(toogleLogin(value));
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[21240] lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 pt-5 pb-2 flex">
                  <button
                    type="button"
                    className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex px-4 space-x-8">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "text-indigo-600 border-indigo-600"
                                : "text-gray-900 border-transparent",
                              "flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="pt-10 pb-8 px-4 space-y-10"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div
                              key={item.name}
                              className="group relative text-sm"
                            >
                              <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-center object-cover"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute z-10 inset-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            <ul
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <div
                                    onClick={() =>
                                      !User?.isLoggedIn
                                        ? handleLoginClose(true)
                                        : router.push(`/service/${item.href}`)
                                    }
                                    className="-m-2 p-2 block text-gray-500"
                                  >
                                    {item.name}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                  {User?.user.role != "user" && User?.isLoggedIn ? (
                    <div className="flow-root">
                      <a
                        href={
                          User?.user.role === "admin"
                            ? "/admin/dashboard"
                            : "/technician/dashboard"
                        }
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Dashboard
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  <div className="flow-root">
                    <div
                      className="-m-2 cursor-pointer p-2 block font-medium text-gray-900"
                      onClick={() => toogleLogin(true)}
                    >
                      Sign in
                    </div>
                  </div>
                  <div className="flow-root">
                    <div
                      className="-m-2 cursor-pointer p-2 block font-medium text-gray-900"
                      onClick={() => toogleRegister(true)}
                    >
                      Create account
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="bg-accent h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
          From attics to basements, and everything in between.
        </p>

        <nav
          aria-label="Top"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              <button
                type="button"
                className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div
                className="ml-4 bg-accent px-3 py-2 rounded flex lg:ml-0 "
                onClick={() => history.push("/")}
              >
                {/* <a href="/">
                  <span className="sr-only">Workflow</span>
                  <img className="h-6 w-auto" src="/photos/logo.png" alt="" />
                </a> */}
                <Link href={"/"}>
                  <span className="sr-only">Workflow</span>
                  <img className="h-6 w-auto" src="/photos/logo.png" alt="" />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="h-full flex space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      // href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}

                  {User?.user.role != "user" && User?.isLoggedIn && (
                    // <a
                    //   href={
                    //     User?.user.role === "admin"
                    //       ? "/admin/dashboard"
                    //       : "/technician/dashboard"
                    //   }
                    //   className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    // >
                    //   Dashboard
                    // </a>
                    <Link
                      to={
                        User?.user.role === "admin"
                          ? "/admin/dashboard"
                          : "/technician/dashboard"
                      }
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Dashboard
                    </Link>
                  )}
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute top-full z-[2122] inset-x-0 text-sm text-gray-500">
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="max-w-7xl mx-auto px-8">
                                  <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-center object-cover"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute z-10 inset-0"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <div
                                                  onClick={() =>
                                                    !User?.isLoggedIn
                                                      ? handleLoginClose(true)
                                                      : router.push(
                                                          `/service/${item.href}`
                                                        )
                                                  }
                                                  className="hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {User?.isLoggedIn && (
                  <div className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-800">
                    Hi, {User?.user.name}
                  </div>
                )}
                {User?.isLoggedIn ? (
                  <div
                    className="ml-4 flow-root lg:ml-6"
                    onClick={() => toogleOrder(true)}
                  >
                    <a href="#" className="group -m-2 p-2 flex items-center">
                      <ShoppingBagIcon
                        className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {count}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <div
                      className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-800"
                      onClick={() => toogleLogin(true)}
                    >
                      Sign in
                    </div>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <div
                      className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-800"
                      onClick={() => toogleRegister(true)}
                    >
                      Create account
                    </div>
                  </div>
                )}
                {User?.isLoggedIn ? (
                  <div className="hidden md:block" style={{ zIndex: 3 }}>
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs  rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className="h-8 w-8" color="gray" alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute  z-[12333] right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              <div
                                onClick={() => history.push("/profile")}
                                className={
                                  "block px-4 py-2 cursor-pointer text-sm text-gray-700"
                                }
                              >
                                Profile Settings
                              </div>
                            </Menu.Item>

                            <Menu.Item>
                              <div
                                onClick={() => dispatch(toogleEmail(true))}
                                className={
                                  "block px-4 py-2 cursor-pointer text-sm text-gray-700"
                                }
                              >
                                Change Email
                              </div>
                            </Menu.Item>
                            <Menu.Item>
                              <div
                                onClick={() => dispatch(tooglePassword(true))}
                                className={
                                  "block px-4 py-2 cursor-pointer text-sm text-gray-700"
                                }
                              >
                                Change Password
                              </div>
                            </Menu.Item>
                            <Menu.Item>
                              <div
                                onClick={() => logout()}
                                className={
                                  "block px-4 py-2 cursor-pointer text-sm text-gray-700"
                                }
                              >
                                Sign Out
                              </div>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
