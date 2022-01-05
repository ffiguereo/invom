import { NavLink, Outlet, useParams } from 'react-router-dom';

import { classNames } from '../../../utils/class-names';

export function ClientLayout() {
  const { clientId } = useParams();

  return (
    <div className="flex">
      <div className="print:hidden fixed py-10 px-8 overflow-y-auto w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-300">
        <nav className="relative">
          <ul>
            <li className="flex w-full justify-between items-center mb-6">
              <NavLink
                className={({ isActive }) =>
                  classNames(isActive ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-500')
                }
                to={`/clients/${clientId}`}
                end
              >
                Client
              </NavLink>
            </li>
            <li className="flex w-full justify-between items-center mb-6">
              <NavLink
                className={({ isActive }) =>
                  classNames(isActive ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-500')
                }
                to="address"
              >
                Address
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="overflow-hidden flex-1 py-10 pr-6 pl-[17rem]">
        <div className="w-full h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
