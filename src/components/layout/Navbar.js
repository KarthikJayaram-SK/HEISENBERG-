import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ChevronDown, Menu as MenuIcon, X as XIcon } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import sairamLogo from '../../assets/sairam-logo.png';
import nccCrest from '../../assets/ncc-crest.png';

const NAV_BG = "rgba(255, 255, 255, 0.85)";
const NAV_BORDER = "rgba(0, 0, 0, 0.08)";
const GOLD = "#FFBF00";
const PRIMARY_TEXT = "#1A2B4C";
const NAV_HEIGHT = "72px";

const fadeIn = keyframes` from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } `;

const NavBar = styled.nav`
  width: 100%;
  height: ${NAV_HEIGHT};
  background: ${NAV_BG};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${NAV_BORDER};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  animation: ${fadeIn} 1s ease-out forwards;
`;
const NavRow = styled.div`
  width: 100%;
  max-width: 1700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: ${NAV_HEIGHT};
`;
const LeftSection = styled.div` display: flex; align-items: center; gap: 1rem; `;
const NavLogo = styled.img` height: 45px; object-fit: contain; @media (max-width: 768px) { height: 40px; } `;
const CollegeInfo = styled.div` display: flex; flex-direction: column; `;
const CollegeName = styled(Link)`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${PRIMARY_TEXT};
  text-decoration: none;
  line-height: 1.1;
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
const Tagline = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  white-space: nowrap; // Prevent wrapping
  
  /* ✨ Responsive Branding: Hide tagline on smaller desktop screens */
  @media (max-width: 1200px) {
    display: none;
  }
`;
const DesktopMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
  height: ${NAV_HEIGHT};
  @media (max-width: 1080px) { // ✨ Changed breakpoint to match hamburger menu
    display: none;
  }
`;
const MenuItem = styled.li` position: relative; display: flex; align-items: center; height: ${NAV_HEIGHT}; `;
const MenuLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  color: ${props => (props.$active ? PRIMARY_TEXT : '#333')};
  background: ${props => (props.$active ? GOLD : 'transparent')};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  &:hover {
    color: ${PRIMARY_TEXT};
    background: ${GOLD};
  }
`;
const MenuButton = styled.button`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  color: #333;
  background: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${PRIMARY_TEXT};
    background: ${GOLD};
  }
`;
const DropdownMenu = styled.div` position: absolute; top: ${NAV_HEIGHT}; left: 0; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid ${NAV_BORDER}; border-radius: 10px; min-width: 180px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); padding: 0.7rem; z-index: 10000; `;
const DropdownItem = styled(Link)` display: block; color: ${PRIMARY_TEXT}; text-decoration: none; font-weight: 500; font-size: 0.95rem; padding: 0.5rem 0.8rem; border-radius: 6px; transition: all 0.2s; &:hover { color: ${GOLD}; background: rgba(255, 191, 0, 0.1); } `;
const HamburgerButton = styled.button` display: none; background: none; border: none; cursor: pointer; z-index: 1001; @media (max-width: 1080px) { display: flex; align-items: center; justify-content: center; } `;
const MobileMenuContainer = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: ${NAV_BG}; backdrop-filter: blur(12px); z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; `;
const MobileMenuLink = styled(MenuLink)` font-size: 1.5rem; `;
const MobileMenuButton = styled(MenuButton)` font-size: 1.5rem; `;
const MobileDropdownTitle = styled.div` font-size: 1rem; color: #888; font-weight: 600; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin-top: 1rem; `;

const anoData = [
    { wing: 'Air', rank: 'Flt. Lt.', name: 'Murugan K V', phone: '9962656474', email: 'murugan.math@sairam.edu.in' },
    { wing: 'Army', rank: 'Lt.', name: 'Dinesh Kumar S K', phone: '9944815991', email: 'dineshkumar.mech@sairam.edu.in' },
    { wing: 'Navy', rank: 'Sub. Lt.', name: 'Prabhu V', phone: '9884955020', email: 'prabhu.mech@sairam.edu.in' },
];

const Navbar = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // ✨ State for the new Admin dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleScrollTo = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <NavBar>
        <NavRow>
          <LeftSection>
            <NavLogo src={sairamLogo} alt="Sairam College Logo" />
            <NavLogo src={nccCrest} alt="NCC Crest" />
            <CollegeInfo>
              <CollegeName to="/">Sairam NCC</CollegeName>
              <Tagline>Sri Sairam Engineering College</Tagline>
            </CollegeInfo>
          </LeftSection>
          
          <DesktopMenu>
            <MenuItem><MenuLink to="/" $active={location.pathname === "/"}>Home</MenuLink></MenuItem>
            <MenuItem><MenuLink to="/events" $active={location.pathname === "/events"}>Events</MenuLink></MenuItem>
            <MenuItem><MenuLink to="/gallery" $active={location.pathname === "/gallery"}>Gallery</MenuLink></MenuItem>
            <MenuItem><MenuButton onClick={() => handleScrollTo('wings')}>Wings</MenuButton></MenuItem>
            <MenuItem><MenuLink to="/reports" $active={location.pathname === "/reports"}>Yearly Reports</MenuLink></MenuItem>
            <MenuItem onMouseEnter={() => setIsContactOpen(true)} onMouseLeave={() => setIsContactOpen(false)}>{/* ... Contact Dropdown ... */}</MenuItem>
            <MenuItem><MenuButton onClick={() => handleScrollTo('register')}>Register</MenuButton></MenuItem>
            
            {user ? (
                <>
                  {/* ✨ New Admin Dropdown */}
                  <MenuItem onMouseEnter={() => setIsAdminOpen(true)} onMouseLeave={() => setIsAdminOpen(false)}>
                    <MenuLink to="#">Admin <ChevronDown size={14} /></MenuLink>
                    {isAdminOpen && (
                      <DropdownMenu>
                        <DropdownItem to="/admin/slideshow">Manage Slideshow</DropdownItem>
                        <DropdownItem to="/admin/gallery">Manage Gallery</DropdownItem>
                      </DropdownMenu>
                    )}
                  </MenuItem>
                  <MenuItem><MenuButton onClick={logout}>Logout</MenuButton></MenuItem>
                </>
            ) : (
                <MenuItem><MenuLink to="/admin-login" $active={location.pathname === "/admin-login"}>Admin Login</MenuLink></MenuItem>
            )}
          </DesktopMenu>

          <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon size={30} color={PRIMARY_TEXT} /> : <MenuIcon size={30} color={PRIMARY_TEXT} />}
          </HamburgerButton>
        </NavRow>
      </NavBar>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenuContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileMenuLink to="/" $active={location.pathname === "/"} onClick={closeMobileMenu}>Home</MobileMenuLink>
            <MobileMenuLink to="/events" $active={location.pathname === "/events"} onClick={closeMobileMenu}>Events</MobileMenuLink>
            <MobileMenuLink to="/gallery" $active={location.pathname === "/gallery"} onClick={closeMobileMenu}>Gallery</MobileMenuLink>
            <MobileMenuButton onClick={() => handleScrollTo('wings')}>Wings</MobileMenuButton>
            <MobileMenuLink to="/reports" $active={location.pathname === "/reports"} onClick={closeMobileMenu}>Yearly Reports</MobileMenuLink>
            <MobileMenuButton onClick={() => handleScrollTo('register')}>Register</MobileMenuButton>
            
            {user ? (
              <>
                {/* ✨ Admin links are now grouped on mobile too */}
                <MobileDropdownTitle>Admin</MobileDropdownTitle>
                <MobileMenuLink to="/admin/slideshow" onClick={closeMobileMenu}>Manage Slideshow</MobileMenuLink>
                <MobileMenuLink to="/admin/gallery" onClick={closeMobileMenu}>Manage Gallery</MobileMenuLink>
                <MobileMenuButton onClick={handleLogout}>Logout</MobileMenuButton>
              </>
            ) : (
              <MobileMenuLink to="/admin-login" $active={location.pathname === "/admin-login"} onClick={closeMobileMenu}>Admin Login</MobileMenuLink>
            )}
          </MobileMenuContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;