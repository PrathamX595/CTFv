import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  UserIcon,
  UserRoundPlus,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

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
          className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <UserIcon size={20} />
          <span>Users</span>
        </Link>
        <Link
          to="/teams"
          className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <Users size={20} />
          Teams
        </Link>
        <Link
          to="/leaderboard"
          className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <Trophy size={20} />
          <span>Leaderboard</span>
        </Link>
        {user?.isAdmin ? (
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
                  <Link
                    to="/challenges"
                    className="flex items-center space-x-2"
                  >
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
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/challenges"
            className="flex items-center space-x-2 dark:text-zinc-300"
          >
            <Flag size={16} />
            <span>Challenges</span>
          </Link>
        )}
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
