"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, LayoutDashboard, ShoppingBag, Clock, User2, FileText, Settings, BarChart, HelpCircle, ChevronDown, ChevronRight, Menu, X, Tag } from "lucide-react";

const sections = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "User Data", href: "/admin/user-list", icon: Users },
  {
    label: "Front Page",
    icon: LayoutDashboard,
    submenu: [
      { label: "Testimonials", href: "/admin/front-page/testimonials" },
      { label: "Slides", href: "/admin/front-page/slides" },
      { label: "Collections", href: "/admin/front-page/collections" },
    ],
  },
  { label: "Bag Data", href: "/admin/bag-collection", icon: ShoppingBag },
  { label: "Order History", href: "/admin/orders", icon: Clock },
  { label: "Coupon Code", href: "/admin/coupon-code", icon: Tag },
  { label: "Contact Us", href: "/admin/contact-us", icon: User2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Help Center", href: "/admin/help", icon: HelpCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const isActive = (href?: string, submenu?: typeof sections[0]["submenu"]) => {
    if (href) return pathname === href;
    return submenu?.some((s) => pathname.startsWith(s.href));
  };

  const renderItems = () =>
    sections.map((sec) => {
      const Icon = sec.icon;
      const hasSub = Boolean(sec.submenu);
      const active = isActive(sec.href, sec.submenu);

      return (
        <div key={sec.label}>
          <button
            onClick={() => {
              if (hasSub) {
                setOpenSection(openSection === sec.label ? null : sec.label);
              } else {
                setOpen(false);
              }
            }}
            className={`
              flex w-full items-center justify-between
              px-4 py-3 rounded-lg
              transition-colors duration-150
              ${active
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}
              focus:outline-none focus:ring-2 focus:ring-blue-400
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              {hasSub
                ? <span className="flex-1 text-left">{sec.label}</span>
                : <Link href={sec.href!} className="flex-1 text-left">{sec.label}</Link>
              }
            </div>
            {hasSub && (
              openSection === sec.label
                ? <ChevronDown className="w-4 h-4 text-gray-300" />
                : <ChevronRight className="w-4 h-4 text-gray-300" />
            )}
          </button>

          {hasSub && openSection === sec.label && (
            <div className="pl-8 mt-1 space-y-1">
              {sec.submenu!.map((sub) => {
                const subActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setOpen(false)}
                    className={`
                      block px-4 py-2 rounded-lg
                      transition-colors duration-150
                      ${subActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                    `}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    });

  return (
    <>
      {/* mobile header */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center bg-blue-600 px-4 text-white shadow">
        <button onClick={() => setOpen(true)} className="p-1">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Admin Panel</h1>
      </header>

      {/* backdrop */}
      <div
        className={`
          fixed inset-0 z-30 backdrop-blur-sm bg-black/40
          transition-opacity duration-200
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={() => setOpen(false)}
      />

      {/* sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          bg-gray-900 text-gray-100 shadow-lg
          md:static md:translate-x-0 md:shadow-none
        `}
      >
        {/* desktop header */}
        <div className="hidden md:flex h-16 items-center justify-center border-b border-gray-800 text-2xl font-bold">
          Admin Panel
        </div>

        {/* mobile close */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)} className="p-1 text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* nav */}
        <nav className="px-2 py-4 space-y-2">{renderItems()}</nav>
      </aside>
    </>
  );
}
