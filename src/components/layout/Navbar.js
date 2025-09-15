import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ChevronDown } from "lucide-react";
import collegeLogo from '../../assets/college-logo.png';
import { useAuth } from '../../contexts/AuthContext';

const NAV_BG = "rgba(255, 255, 255, 0.8)";
const NAV_BORDER = "rgba(0, 0, 0, 0.1)";
const GOLD = "#FFBF00";
const PRIMARY_TEXT = "#1A2B4C";
const NAV_HEIGHT = "72px";

const fadeIn = keyframes` from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } `;
const NavBar = styled.nav` width: 100vw; height: ${NAV_HEIGHT}; background: ${NAV_BG}; backdrop-filter: blur(12px); border-bottom: 1px solid ${NAV_BORDER}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; z-index: 1000; animation: ${fadeIn} 1s ease-out forwards; `;
const NavRow = styled.div` width: 100%; max-width: 1700px; display: flex; align-items: center; justify-content: space-between; padding: 0 2vw; height: ${NAV_HEIGHT}; box-sizing: border-box; `;
const LeftSection = styled.div` display: flex; align-items: center; gap: 1rem; `;
const LogoImage = styled.img` height: 45px; width: 45px; object-fit: contain; `;
const CollegeInfo = styled.div` display: flex; flex-direction: column; `;
const CollegeName = styled.div` font-size: 1.2rem; font-weight: 800; letter-spacing: 1px; color: ${PRIMARY_TEXT}; white-space: nowrap; line-height: 1.2; `;
const Tagline = styled.div` font-size: 0.8rem; font-weight: 500; color: #555; white-space: nowrap; `;
const Menu = styled.ul` display: flex; align-items: center; gap: 1.8vw; list-style: none; margin: 0; padding: 0; height: ${NAV_HEIGHT}; `;
const MenuItem = styled.li` position: relative; display: flex; align-items: center; height: ${NAV_HEIGHT}; `;
const MenuLink = styled(Link)` color: ${props => (props.$active ? GOLD : PRIMARY_TEXT)}; font-weight: 600; text-decoration: none; font-size: 1.05rem; padding: 0.5rem 1rem; border-radius: 8px; background: ${props => (props.$active ? "rgba(255, 191, 0, 0.15)" : "transparent")}; transition: color 0.3s, background 0.3s; display: flex; align-items: center; gap: 0.25rem; &:hover { color: ${GOLD}; background: rgba(255, 191, 0, 0.1); } `;
const MenuButton = styled.button` color: ${PRIMARY_TEXT}; font-weight: 600; background: none; border: none; font-size: 1.05rem; cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px; transition: color 0.3s, background 0.3s; &:hover { color: ${GOLD}; background: rgba(255, 191, 0, 0.1); } `;
const DropdownMenu = styled.div` position: absolute; top: ${NAV_HEIGHT}; left: 0; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid ${NAV_BORDER}; border-radius: 10px; min-width: 180px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); padding: 0.7rem; z-index: 10000; `;
const DropdownItem = styled(Link)` display: block; color: ${PRIMARY_TEXT}; text-decoration: none; font-weight: 500; font-size: 0.95rem; padding: 0.5rem 0.8rem; border-radius: 6px; transition: all 0.2s; &:hover { color: ${GOLD}; background: rgba(255, 191, 0, 0.1); } `;

const anoData = [
  { wing: 'Air', rank: 'Flt. Lt.', name: 'Murugan K V', phone: '9962656474', email: 'murugan.math@sairam.edu.in' },
  { wing: 'Army', rank: 'Lt.', name: 'Dinesh Kumar S K', phone: '9944815991', email: 'dineshkumar.mech@sairam.edu.in' },
  { wing: 'Navy', rank: 'Sub. Lt.', name: 'Prabhu V', phone: '9884955020', email: 'prabhu.mech@sairam.edu.in' },
];

const Navbar = () => {
  const [isWingsOpen, setIsWingsOpen] = React.useState(false);
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const handleScrollToRegister = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <NavBar>
      <NavRow>
        <LeftSection>
          <LogoImage src={collegeLogo} alt="College Logo" />
          <CollegeInfo>
            <CollegeName>Sri Sairam Engineering College</CollegeName>
            <Tagline>An Autonomous Institution</Tagline>
          </CollegeInfo>
        </LeftSection>
        <Menu>
          <MenuItem>
            <MenuLink to="/" $active={location.pathname === "/"}>Home</MenuLink>
          </MenuItem>
          {/* --- ADDED EVENTS LINK HERE --- */}
          <MenuItem>
            <MenuLink to="/events" $active={location.pathname === "/events"}>Events</MenuLink>
          </MenuItem>
          <MenuItem onMouseEnter={() => setIsWingsOpen(true)} onMouseLeave={() => setIsWingsOpen(false)}>
            <MenuLink to="#" $active={location.pathname.startsWith("/wing")}>Wings <ChevronDown size={14} /></MenuLink>
            {isWingsOpen && (
              <DropdownMenu>
                <DropdownItem to="/wing/airforce">Air</DropdownItem>
                <DropdownItem to="/wing/army">Army</DropdownItem>
                <DropdownItem to="/wing/navy">Navy</DropdownItem>
              </DropdownMenu>
            )}
          </MenuItem>
          <MenuItem onMouseEnter={() => setIsContactOpen(true)} onMouseLeave={() => setIsContactOpen(false)}>
            <MenuLink to="#">Contact <ChevronDown size={14} /></MenuLink>
            {isContactOpen && (
              <DropdownMenu style={{ left: "auto", right: 0, minWidth: "320px" }}>
                {anoData.map((ano) => (
                  <div key={ano.name} style={{ padding: "0.6rem 0.5rem", borderBottom: `1px solid ${NAV_BORDER}` }}>
                    <div style={{ color: PRIMARY_TEXT, fontWeight: 700, fontSize: '0.9rem' }}>{ano.wing} ANO: {ano.rank} {ano.name}</div>
                    <div style={{ fontSize: "0.85rem", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", }}>
                      <a href={`tel:${ano.phone}`} style={{ color: "#555", textDecoration: "none" }}>{ano.phone}</a>
                      <span style={{ color: "#ccc" }}>|</span>
                      <a href={`mailto:${ano.email}`} style={{ color: "#555", textDecoration: "none" }}>{ano.email}</a>
                    </div>
                  </div>
                ))}
              </DropdownMenu>
            )}
          </MenuItem>
          <MenuItem>
            <MenuButton onClick={handleScrollToRegister}>Register</MenuButton>
          </MenuItem>
          {user ? (
            <MenuItem>
              <MenuButton onClick={logout}>Logout</MenuButton>
            </MenuItem>
          ) : (
            <MenuItem>
              <MenuLink to="/admin-login" $active={location.pathname === "/admin-login"}>
                Admin Login
              </MenuLink>
            </MenuItem>
          )}
        </Menu>
      </NavRow>
    </NavBar>
  );
};
export default Navbar;