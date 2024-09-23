import {
  Flag,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Trophy,
  User,
  UserRoundPlus,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../AuthContext";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  toggleDarkMode,
  isDarkMode,
}) => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-white p-4 dark:bg-zinc-800">
      <div className="flex items-center space-x-4">
        <Link
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          to="/"
        >
          CTFv
        </Link>

        <Link
          to="/users"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          Users
        </Link>
        <Link
          to="/teams"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          Teams
        </Link>
        <Link
          to="/leaderboard"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          Leaderboard
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 dark:text-zinc-300"
            >
              <Menu size={20} />
              <span>Admin Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user?.isAdmin ? (
              <>
                <DropdownMenuItem>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2"
                  >
                    <Settings size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="challenges" className="flex items-center space-x-2">
                    <Flag size={16} />
                    <span>Manage Challenges</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/admin/challenges/create"
                    className="flex items-center space-x-2"
                  >
                    <Flag size={16} />
                    <span>Create Challenge</span>
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>
                <Link to="/challenges" className="flex items-center space-x-2">
                  <Flag size={16} />
                  <span>Challenges</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 dark:text-zinc-300"
              >
                <User size={20} />
                <span>Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <span className="flex items-center space-x-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/register">
              <Button
                variant="outline"
                className="flex items-center space-x-2 dark:text-zinc-300"
              >
                <UserRoundPlus size={20} />
                <span>Register</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="flex items-center space-x-2 dark:text-zinc-300"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Button>
            </Link>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
    </nav>
  );
};
