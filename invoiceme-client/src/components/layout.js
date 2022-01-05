import { Menu, Transition } from '@headlessui/react';
import { Fragment, useCallback } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/auth-context';
import { DialoguesProvider } from '../context/dialogues-context';
import { classNames } from '../utils/class-names';
import { Dialogues } from './dialogues';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Clients', href: '/clients' },
  { name: 'Invoices', href: '/invoices' },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
];

export function Layout() {
  const { logout, user } = useAuth();

  const handlerLogout = useCallback(
    async (event) => {
      event.preventDefault();

      await logout();
    },
    [logout],
  );

  return (
    <div className="min-h-full">
      <nav className="print:hidden bg-gray-800 fixed w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium',
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
                        {user.lastName.charAt(0)}
                        {user.firstName.charAt(0)}
                      </div>
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
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700',
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={handlerLogout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'w-full block px-4 py-2 text-sm text-left text-gray-700',
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="print:p-0 pt-16">
        <DialoguesProvider>
          <Outlet />
          <Dialogues />
        </DialoguesProvider>
      </main>
    </div>
  );
}
