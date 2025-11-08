import React from 'react';
import styled from 'styled-components';
// ✨ 1. Import icons, but now import your new local component
import { Instagram, MessageSquare } from 'lucide-react';
import TwitterIcon from './TwitterIcon'; // Import the new local file

const SocialBarContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    gap: 0.5rem;
  }
`;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: rgba(26, 43, 76, 0.9);
  backdrop-filter: blur(5px);
  color: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    background-color: #FFBF00;
    color: #1A2B4C;
  }

  /* ✨ 2. Style all icons using the 'svg' tag selector */
  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const socialLinks = [
  { 
    href: 'https://www.instagram.com/sairam_ncc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', 
    icon: <Instagram />,
    label: 'Instagram' 
  },
  { 
    href: 'https://x.com/ncc_sairam', 
    // ✨ 3. Use your new, custom TwitterIcon component
    icon: <TwitterIcon />, 
    label: 'X' 
  },
  { 
    href: 'https://whatsapp.com/channel/0029Va8Rd1D7z4kWvsDyw23K', 
    icon: <MessageSquare />,
    label: 'WhatsApp Channel' 
  }
];

const SocialLinks = () => {
  return (
    <SocialBarContainer>
      {socialLinks.map(link => (
        <IconLink
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
        >
          {link.icon}
        </IconLink>
      ))}
    </SocialBarContainer>
  );
};

export default SocialLinks;