'use client'
import { useState } from 'react'
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from './customComponents/resizable-navbar'
import { Button } from './ui'

const PublicHeader = () => {
    const navItems = [
        {
            name: 'Home',
            link: '/home',
        },
        {
            name: 'Data Insight',
            link: '/#',
        },
        {
            name: 'Publikasi',
            link: '/#',
        },
        {
            name: 'Tentang',
            link: '/#',
        },
    ]

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <Navbar>
            <NavBody>
                <NavbarLogo />
                <NavItems items={navItems} />
                <div>
                    <NavbarButton
                        href={'/sign-in'}
                        variant="secondary"
                        className="bg-[#f1b700] text-white hover:bg-[#d8a300] hover:text-white"
                    >
                        Login
                    </NavbarButton>
                </div>
            </NavBody>
            <MobileNav>
                <MobileNavHeader>
                    <NavbarLogo />
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </MobileNavHeader>
                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    {navItems.map((item, idx) => (
                        <a
                            key={`mobile-link-${idx}`}
                            href={item.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="relative text-neutral-600 dark:text-neutral-300"
                        >
                            <span className="block">{item.name}</span>
                        </a>
                    ))}
                    <div>
                        {/* <NavbarButton variant="secondary"> */}
                        <Button />
                        {/* </NavbarButton> */}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    )
}

export default PublicHeader
