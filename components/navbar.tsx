"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { siteConfig } from "@/content/site"
import {AppImage} from "@/components/ui/app-image"
import StaggeredMenu from "./StaggeredMenu"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const palette = {
  champagneGold: "#D6BFA3",
  softBeige: "#F5EFE6",
  warmBeige: "#E8DCCB",
  softBrown: "#8B6F5A",
  deepBrown: "#4E3B31",
  champagneLight: "#F2E4D3",
  navBg: "#C9A989",
}


const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#countdown", label: "Countdown" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Messages" },
  { href: "#details", label: "Details" },
  { href: "#entourage", label: "Entourage" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#guest-list", label: "RSVP" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current != null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", onScroll as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sectionIds = navLinks.map(l => l.href.substring(1))
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        if (visible.length > 0) {
          const topMost = visible[0]
          if (topMost.target && topMost.target.id) {
            const newActive = `#${topMost.target.id}`
            setActiveSection(prev => (prev === newActive ? prev : newActive))
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const menuItems = useMemo(() => navLinks.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href })), [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out`}
      style={{
        backgroundColor: palette.navBg,
        backdropFilter: isScrolled ? "blur(24px)" : "blur(16px)",
        boxShadow: isScrolled ? "0 10px 40px rgba(155,106,65,0.35)" : undefined,
        borderBottom: isScrolled
          ? `1px solid ${palette.champagneLight}B2`
          : `1px solid ${palette.champagneGold}99`,
      }}
    >
      {/* Elegant glow effect when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 pointer-events-none" />
      )}
      {/* Subtle texture overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${palette.softBeige}0D, transparent, ${palette.softBeige}14)`,
        }}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12">
              <AppImage
                src={siteConfig.couple.monogram}
                alt={`${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} Monogram`}
                fill
                className="object-contain group-hover:scale-110 group-active:scale-105 transition-all duration-500 drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_6px_22px_rgba(255,255,255,0.4)]"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            
            {/* Subtle background glow on hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
              style={{ background: `linear-gradient(to right, transparent, ${palette.softBeige}4D, transparent)` }}
            />
          </Link>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm ${cormorant.className} font-medium rounded-lg transition-all duration-500 relative group`}
                  style={
                    isActive
                      ? {
                          color: palette.deepBrown,
                          backgroundColor: `${palette.softBeige}F2`,
                          backdropFilter: "blur(12px)",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                          border: `1px solid ${palette.softBeige}`,
                        }
                      : {
                          color: "rgba(255,255,255,0.95)",
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                        }
                  }
                  onMouseEnter={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.color = palette.deepBrown
                      el.style.backgroundColor = `${palette.softBeige}F2`
                      el.style.border = `1px solid ${palette.softBeige}CC`
                      el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"
                      el.style.transform = "scale(1.05)"
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.color = "rgba(255,255,255,0.95)"
                      el.style.backgroundColor = "transparent"
                      el.style.border = "1px solid transparent"
                      el.style.boxShadow = ""
                      el.style.transform = ""
                    }
                  }}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{
                      background: `linear-gradient(to right, ${palette.softBeige}, ${palette.softBeige}, ${palette.softBeige})`,
                      boxShadow: isActive ? `0 0 10px ${palette.softBeige}` : undefined,
                    }}
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: palette.softBeige,
                        boxShadow: `0 0 6px ${palette.softBeige}`,
                      }}
                    />
                  )}
                  {/* Subtle accent on hover */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{ background: `linear-gradient(to bottom right, transparent, ${palette.softBeige}33, transparent)` }}
                  />
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            {/* Decorative halo to improve tap target and visual affordance */}
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full blur-md pointer-events-none"
                style={{ background: `linear-gradient(to bottom right, ${palette.softBeige}33, ${palette.softBeige}1A, transparent)` }}
              />
              <StaggeredMenu
                position="left"
                items={menuItems}
                socialItems={[]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor={palette.softBeige}
                openMenuButtonColor={palette.deepBrown}
                changeMenuColorOnOpen={true}
                colors={[palette.deepBrown, palette.deepBrown, palette.deepBrown, palette.softBeige, palette.softBeige]}
                accentColor="#FFFFFF"
                isFixed={true}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
              />
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}
