'use client'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { LogIn, LogOut, Menu, X, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const isLoggedIn = !!session?.user
  const isLoading = status === 'loading'

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setIsMobileMenuOpen(false)
    router.push('/login')
  }

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Research', href: '/research' },
    { name: 'Education', href: '/education' },
    { name: 'Arts', href: '/arts' },
    { name: 'Events', href: '/events' },
    { name: 'Collaborate', href: '/collaborate' },
  ]

  const Logo = () => (
    <svg
      className="w-8 h-8 text-neutral-900 fill-current"
      viewBox="0 0 32 33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0811 8.4182L5.83462 0.190918H2.99992L9.67261 13.1182C10.5858 12.4441 10.9873 10.1747 10.0811 8.4182Z"
        fill="#007F7F"
      />
      <path
        d="M15.718 2.23543L13.1494 7.23357C13.1494 7.23357 10.7002 3.40679 11.9444 1.22143C12.9961 -0.412105 14.5318 0.34164 14.7541 0.518363C14.9764 0.694577 15.652 1.06534 15.718 2.23543Z"
        fill="#007F7F"
      />
      <path d="M4.56792 32.1182H0.919922V16.5902H4.56792V32.1182Z" />
      <path d="M18.2125 19.4222H12.3325V22.7822H17.9245V25.5662H12.3325V32.1182H8.68448V16.5902H18.2125V19.4222Z" />
      <path d="M31.774 19.4222H27.67V32.1182H23.998V19.4222H19.894V16.5902H31.774V19.4222Z" />
    </svg>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/90 backdrop-blur-md py-4">
      <div className="w-full px-4">
        <div className="flex items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-50 -translate-y-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12 ml-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 relative group ${
                  pathname === link.href
                    ? 'text-teal-600'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-2 left-0 w-0 h-px bg-teal-600 transition-all duration-300 group-hover:w-full ${
                    pathname === link.href ? 'w-full' : ''
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          {!isLoading && (
            <div className="hidden lg:flex items-center space-x-4 ml-12 flex-shrink-0 relative z-[60]">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard/projects"
                    className="text-neutral-400 hover:text-teal-600 transition-colors p-2 rounded"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-400 hover:text-neutral-900 transition-colors p-2 cursor-pointer rounded"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-neutral-400 hover:text-teal-600 transition-colors p-2 rounded inline-flex items-center justify-center"
                  title="Log In"
                >
                  <LogIn className="w-5 h-5" />
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-[60] ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-900 hover:text-teal-600 transition-colors p-3 cursor-pointer -m-3 touch-manipulation"
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen bg-white flex flex-col overflow-auto"
                style={{ zIndex: 9999, isolation: 'isolate' }}
                aria-modal="true"
                aria-label="Navigation menu"
                role="dialog"
              >
                <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                  <Link
                    href="/"
                    className="flex-shrink-0 flex items-center gap-2 cursor-pointer -translate-y-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <Logo />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 -m-3 text-neutral-900 hover:text-teal-600 transition-colors touch-manipulation rounded-full"
                    aria-label="Close menu"
                    type="button"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 flex flex-col min-h-0 px-4 py-6">
                  <div className="flex-1 min-h-0">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`block py-4 text-neutral-900 font-sans text-lg border-b border-neutral-200 hover:text-teal-600 transition-colors ${
                          pathname === link.href ? 'text-teal-600' : ''
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  <div className="flex-shrink-0 pt-8 mt-auto pb-6">
                    <div className="pt-6 border-t border-neutral-200 flex flex-col gap-4">
                      {isLoggedIn ? (
                        <>
                          <Link
                            href="/dashboard/projects"
                            className="flex items-center justify-start gap-3 text-neutral-500 font-sans text-sm uppercase tracking-wider hover:text-teal-600 transition-colors py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-start gap-3 text-neutral-500 font-sans text-sm uppercase tracking-wider hover:text-teal-600 transition-colors py-2 cursor-pointer w-full"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/login"
                          className="flex items-center justify-start gap-3 text-neutral-500 font-sans text-sm uppercase tracking-wider hover:text-teal-600 transition-colors py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LogIn className="w-5 h-5" />
                          <span>Sign In</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  )
}
