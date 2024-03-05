import { AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "../../hooks/useAuth";
import { BackDrop, MobileMenuMotion } from "./MobileNav.styled";
import Link from "next/link";
import { useRouter } from "next/router";
import SocialLinks from "./SocialLinks";
import { IHeaderNavLink } from "./Header";
import UserDetails from "./UserDetails";
import DropDownMenu from "../ui/DropDownMenu/DropDownMenu";
import { StyledMenuItem } from "../ui/DropDownMenu/DropDownMenu.styled";

const variants = {
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      x: { stiffness: 1000 },
    },
  },
  open: {
    x: "0",
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
};

const backDropVariants = {
  closed: {
    opacity: 0,
    transition: {
      x: { stiffness: 1000 },
    },
  },
  open: {
    opacity: 0.8,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
};

interface Props {
  isOpen: boolean;
  links: IHeaderNavLink[];
  linksArray: IHeaderNavLink[];
  toggleOpen: Dispatch<SetStateAction<boolean | undefined>>;
}

const MobileNav = ({ isOpen, links, toggleOpen, linksArray }: Props) => {
  const router = useRouter();
  return (
    <>
      {/* <SvgCloseIcon className="close" onClick={() => toggleOpen(!isOpen)} /> */}
      <MobileMenuMotion
        className="desktop-hide"
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        initial="closed"
      >
        <div className="close-btn" onClick={() => toggleOpen(!isOpen)}>
          X
        </div>
        <div className="mobile-nav-items">
          <UserDetails handleClick={() => toggleOpen(!isOpen)} />
          {links.map(({ name, url, links }) => {
            return (
              <div className="navLink" key={name}>
                {url ? (
                  <div
                    key={name}
                    onClick={() => {
                      toggleOpen(!isOpen);
                      router.push(url);
                    }}
                    className="active-link"
                  >
                    {name}
                  </div>
                ) : (
                  <DropDownMenu key={name} title={name}>
                    {links.map(({ name, url, icon, iconWidth }) => (
                      <StyledMenuItem key={name}>
                        {icon && (
                          <div className="sub-menu-icon">
                            <img src={icon} alt={name} width={iconWidth ? iconWidth : 20} />
                          </div>
                        )}
                        <a key={name} className="sub-menu-item" href={url}>
                          {name}
                        </a>
                      </StyledMenuItem>
                    ))}
                  </DropDownMenu>
                )}
              </div>
            );
          })}
        </div>
      </MobileMenuMotion>
      <AnimatePresence>
        {isOpen && (
          <BackDrop
            className="desktop-hide"
            onClick={() => toggleOpen(!isOpen)}
            animate={isOpen ? "open" : "closed"}
            variants={backDropVariants}
            initial="closed"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
