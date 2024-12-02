import { Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { UserCircle, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-rose-500 text-2xl font-bold">
              StayFlow
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Properties
              </Link>
            </div>
          </div>

          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center p-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow">
              <MenuIcon className="h-4 w-4 text-gray-500 mr-2" />
              <UserCircle className="h-6 w-6 text-gray-500" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg p-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!user ? (
                <>
                  <Menu.Item>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Register
                    </Link>
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item>
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      Signed in as <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Your Profile
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </nav>
  );
}