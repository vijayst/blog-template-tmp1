"use client";
import { PropsWithChildren, useState, useSyncExternalStore } from "react";
import Link from "next/link";

interface LayoutProps {
  blogName: string;
}

function getBaseDomain(hostname: string): string | null {
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    return parts.slice(1).join(".");
  }
  return null;
}

function getMainOrigin(): string | null {
  if (typeof window === "undefined") return null;
  const base = getBaseDomain(window.location.hostname);
  return base ? `${window.location.protocol}//${base}` : null;
}

const emptySubscribe = () => () => {};

const NAV_LINKS = [
  { href: "/kb", label: "Knowledge Base" },
  { href: "/explore", label: "Explore" },
  { href: "/archived", label: "Archived" },
];

export function Layout({ children, blogName }: PropsWithChildren<LayoutProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainOrigin = useSyncExternalStore(
    emptySubscribe,
    getMainOrigin,
    () => null,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-50 border-b border-gray-200 px-6 fixed h-20 flex items-center justify-between w-full z-50">
        <Link href="/">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[45vw] sm:max-w-none">
            {blogName}
          </h1>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {mainOrigin && (
            <Link
              href={mainOrigin}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className="sm:hidden flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-200"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>
      {menuOpen && (
        <nav className="sm:hidden fixed top-20 left-0 right-0 bg-slate-50 border-b border-gray-200 z-50 px-6 py-4 flex flex-col gap-4">
          {mainOrigin && (
            <Link
              href={mainOrigin}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      <main className="px-0 pt-20 pb-4 flex-1">{children}</main>
      <footer className="bg-black text-white text-center py-4 mt-6">
        <span className="text-gray-300">Made with </span>
        <a
          href="https://chatblogr.com"
          target="_blank"
          className="hover:border-b border-white"
        >
          chatblogr.com
        </a>
      </footer>
    </div>
  );
}