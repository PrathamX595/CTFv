import { User, useAuth } from "@/AuthContext";
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
  UserIcon,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink: React.FC<{
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ to, icon, children }) => (
    <Link
      to={to}
      className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
      onClick={() => setIsMenuOpen(false)}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white p-4 dark:bg-zinc-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
              to="/"
            >
              CTFv
            </Link>

            {/* Left-side navigation items (visible on md and above) */}
            <div className="hidden items-center space-x-4 md:flex">
              <NavLink to="/users" icon={<UserIcon size={20} />}>
                Users
              </NavLink>
              <NavLink to="/teams" icon={<Users size={20} />}>
                Teams
              </NavLink>
              <NavLink to="/leaderboard" icon={<Trophy size={20} />}>
                Leaderboard
              </NavLink>
              {user?.isAdmin ? (
                <AdminMenu />
              ) : (
                <NavLink to="/challenges" icon={<Flag size={20} />}>
                  Challenges
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Right-side navigation items (visible on md and above) */}
          <div className="hidden items-center space-x-4 md:flex">
            <UserMenu user={user!} logout={logout} />
            <DarkModeToggle
              toggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
            <NavLink to="/users" icon={<UserIcon size={20} />}>
              Users
            </NavLink>
            <NavLink to="/teams" icon={<Users size={20} />}>
              Teams
            </NavLink>
            <NavLink to="/leaderboard" icon={<Trophy size={20} />}>
              Leaderboard
            </NavLink>
            {user?.isAdmin ? (
              <AdminMenu />
            ) : (
              <NavLink to="/challenges" icon={<Flag size={20} />}>
                Challenges
              </NavLink>
            )}
            <UserMenu user={user!} logout={logout} />
            <DarkModeToggle
              toggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

const AdminMenu = () => (
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
      <DropdownMenuItem>
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <Settings size={16} />
          <span>Admin Dashboard</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/challenges" className="flex items-center space-x-2">
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
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserMenu = ({ user, logout }: { user: User; logout: () => void }) =>
  user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 dark:text-zinc-300"
        >
          <UserIcon size={20} />
          <span>Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/profile" className="flex items-center space-x-2">
            <UserIcon size={16} />
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
  );

const DarkModeToggle = ({
  toggleDarkMode,
  isDarkMode,
}: {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleDarkMode}
    className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
  >
    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
  </Button>
);
