import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import { NavLink, useHistory } from "react-router-dom";
import { logOutUser } from "../../services/user.services";
import Cookies from "universal-cookie";
import { getUserDetails } from "../../redux/actions/user.actions";
import { useDispatch } from "react-redux";
import { toogleEmail, tooglePassword } from "../../redux/reducers/User";
const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "/technician/dashboard", current: true },
  { name: "Order Status", href: "/technician/orderStatus", current: false },
  { name: "Payment Center", href: "/technician/payment", current: false },
];
const technicianDashboard = [
  {
    name: "Dashboard",
    href: "#",
    current: true,
  } /*{ Dasboard consist of orders and request of service to the technician}*/,
  { name: "Service", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TechnicianLayout(props) {
  const history = useHistory();
  const cookie = new Cookies();
  const dispatch = useDispatch();

  const logout = async () => {
    const [response] = await logOutUser();
    if (response) {
      cookie.remove("token", { path: "/" });
      dispatch(getUserDetails());
    }
  };

  const userNavigation = [{ name: "Sign out", href: "" }];

  const { children, title } = props;
  return (
    <>
      <div className="min-h-[90vh]">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0"
                      onClick={() => history.push("/")}
                    >
                      <img
                        className="h-8 w-18"
                        src="/photos/logo.png"
                        alt="Workflow"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            activeClassName="bg-gray-900 text-white"
                            className={classNames(
                              " text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            )}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block" style={{ zIndex: 3 }}>
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
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
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              <div
                                onClick={() => history.push("/profile")}
                                className={classNames(
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                                activeClassName="bg-gray-100"
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
                                className={classNames(
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                                activeClassName="bg-gray-100"
                              >
                                Sign Out
                              </div>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700" style={{ zIndex: 3 }}>
                  <div className="mt-3 px-2 space-y-1">
                    <Disclosure.Button
                      as="a"
                      onClick={() => history.push("/profile")}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
                    >
                      Profile Settings
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      onClick={() => dispatch(toogleEmail(true))}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
                    >
                      Change Email
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      onClick={() => dispatch(tooglePassword(true))}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
                    >
                      Change Password
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      onClick={() => logout()}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
                    >
                      Sign Out
                    </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">{children}</div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  );
}
