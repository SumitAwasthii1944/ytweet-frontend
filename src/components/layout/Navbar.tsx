import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../ui/Searchbar";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/logo.png";
import uploadLogo from "../../assets/uploadLogo.png";
import createLogo from "../../assets/createLogo.png";
import { useState } from "react";
import Avatar from "../ui/Avatar";
import UploadVideoModal from "../video/UploadVideoModal";
import CreateTweetModal from "../tweet/createTweetModal";

//NavIconButton

interface NavIconButtonProps {
  onClick: () => void;
  title: string;
  src: string;
  alt: string;
  className?: string;
}

function NavIconButton({ onClick, title, src, alt, className = "" }: NavIconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center w-11 h-11
        rounded-xl border border-white/10 bg-white/[0.07]
        cursor-pointer transition-all duration-200
        hover:bg-white/[0.13] hover:border-white/20 hover:-translate-y-px
        active:scale-95 ${className}
      `}
    >
      <img src={src} alt={alt} className="w-5 h-5 object-contain" />
    </button>
  );
}

//DropdownItem 

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function DropdownItem({ icon, label, onClick, variant = "default" }: DropdownItemProps) {
  const hoverStyles =
    variant === "danger"
      ? "hover:bg-red-500/10 hover:text-red-400"
      : "hover:bg-white/[0.07] hover:text-white";

  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-4 py-3
        text-sm text-white/75 bg-transparent border-none
        cursor-pointer text-left transition-colors duration-150
        ${hoverStyles}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

//Icons

function ProfileIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  );
}

// UserDropdown 

interface UserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  fullName?: string;
  username?: string;
  avatar?: string;
  onLogout: () => void;
}

function UserDropdown({ isOpen, onToggle, onClose, fullName, username, avatar, onLogout }: UserDropdownProps) {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onClose();
        }
      }}
      className="relative outline-none"
    >
      {/* Avatar trigger */}
      <div
        tabIndex={0}
        onClick={onToggle}
        className="
          p-[2px] rounded-full cursor-pointer
          bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400
          transition-transform duration-200
          hover:scale-105 hover:shadow-[0_0_14px_rgba(99,102,241,0.5)]
          focus:outline-none focus:ring-2 focus:ring-indigo-400/50
        "
      >
        <div className="rounded-full bg-[#1e212d] p-0.5">
          <Avatar src={avatar ?? ""} alt="avatar" size="md" />
        </div>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="menu"
          className="
            absolute top-[calc(100%+12px)] right-0 w-60
            bg-[#1e212d] border border-white/10 rounded-2xl overflow-hidden
            shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50
            animate-[panelIn_0.18s_ease_forwards]
          "
        >
          {/* User info */}
          <div className="px-4 py-3.5 border-b border-white/[0.08]">
            <p className="text-sm font-semibold text-white">{fullName}</p>
            <p className="text-xs text-white/40 mt-0.5">@{username}</p>
          </div>

          <DropdownItem
            icon={<ProfileIcon />}
            label="View profile"
            onClick={() => {
              onClose();
              navigate(`/profile/${username}`);
            }}
          />

          <DropdownItem
            icon={<LogoutIcon />}
            label="Logout"
            variant="danger"
            onClick={() => {
              onClose();
              onLogout();
            }}
          />
        </div>
      )}
    </div>
  );
}

//Navbar

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openUserPanel, setOpenUserPanel] = useState(false);

  return (
    <>
      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <nav className="fixed top-4 left-0 right-0 z-50 px-5">
        <div className="
          max-w-[1400px] mx-auto h-16
          flex items-center justify-between gap-4
          bg-[rgba(30,33,45,0.92)] backdrop-blur-xl
          border border-white/10 rounded-[18px] px-6
        ">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <img src={Logo} alt="Ytweet" className="w-9 h-9 rounded-[10px] object-cover" />
            <span className="hidden lg:inline font-bold text-[17px] text-white tracking-tight">
              Ytweet
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[520px]">
            <SearchBar />
          </div>

          {/* Actions */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <NavIconButton
                onClick={() => setOpenUploadModal(true)}
                title="Upload video"
                src={uploadLogo}
                alt="upload"
              />
              <NavIconButton
                onClick={() => setOpenCreateModal(true)}
                title="Create tweet"
                src={createLogo}
                alt="tweet"
                className="hidden lg:flex"
              />
              <UserDropdown
                isOpen={openUserPanel}
                onToggle={() => setOpenUserPanel(v => !v)}
                onClose={() => setOpenUserPanel(false)}
                fullName={user?.fullName}
                username={user?.username}
                avatar={user?.avatar}
                onLogout={logout}
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="
                flex-shrink-0 px-5 py-2 rounded-xl
                bg-white text-black font-semibold text-sm
                no-underline transition-opacity duration-200
                hover:opacity-90
              "
            >
              Login
            </Link>
          )}

        </div>
      </nav>

      <UploadVideoModal isOpen={openUploadModal} onClose={() => setOpenUploadModal(false)} />
      <CreateTweetModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} />
    </>
  );
}

export default Navbar;