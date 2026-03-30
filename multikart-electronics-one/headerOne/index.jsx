"use client";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { useHeaderScroll } from "@/utils/hooks/HeaderScroll";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { RiHeartLine, RiMenuLine, RiUserLine } from "react-icons/ri";
import { Button, Col, Container, Row } from "reactstrap";
import HeaderCart from "../widgets/headerCart";
import HeaderLogo from "../widgets/HeaderLogo";
import HeaderSearchbar from "../widgets/headerSearchbar";
import MainHeaderMenu from "../widgets/mainHeaderMenu";
import TopBar from "../widgets/TopBar";
import { useTranslation } from "react-i18next";
import { Href } from "@/utils/constants";

const HeaderOne = () => {
  const { themeOption, setOpenAuthModal, openAuthModal, mobileSideBar, setMobileSideBar } = useContext(ThemeOptionContext);
  const UpScroll = useHeaderScroll(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const isAuthenticated = Cookies.get("uat");
  const handleProfileClick = (path) => {
    isAuthenticated ? router.push("/account/dashboard") : setOpenAuthModal(true);
  };
  const handleWishlistClick = () => {
    isAuthenticated ? router.push("/wishlist") : setOpenAuthModal(true);
  };

  return (
    <header className={`${themeOption?.header?.sticky_header_enable && UpScroll ? "sticky fixed" : ""} custom-gg-header`}>
      {/* Top Header Row (Dark Gray) */}
      <div className="gg-top-header">
        <Container>
          <Row className="align-items-center">
            {/* Logo */}
            <Col xl="2" lg="2" xs="12" className="d-flex align-items-center justify-content-between">
              <div className="toggle-nav d-xl-none" onClick={() => setMobileSideBar(!mobileSideBar)}>
                <RiMenuLine className="sidebar-bar text-white fs-3" />
              </div>
              <div className="brand-logo">
                <HeaderLogo />
              </div>
            </Col>
            
            {/* Search */}
            <Col xl="4" lg="5" className="d-none d-lg-block">
              <HeaderSearchbar fullSearch={true} />
            </Col>

            {/* Icons & Actions */}
            <Col xl="6" lg="5" className="d-none d-lg-flex align-items-center justify-content-end gg-header-actions">
              <Link href="/offers" className="gg-offers-link">
                <i className="ri-price-tag-3-line"></i> Offers
              </Link>
              
              <Link href="/store-locator" className="gg-store-locator-btn text-white">
                <i className="ri-map-pin-line text-white"></i> Store Locator
              </Link>

              <div className="gg-apple-store">
                <span className="text-light-gray">Find Us On</span><br/>
                <Link href="/apple-store" className="text-blue">Apple Store Locator</Link>
              </div>

              <div className="gg-icon-btn">
                <HeaderCart />
              </div>
              
              <div className="gg-icon-btn">
                <Link href={isAuthenticated ? "/account/dashboard" : Href} onClick={handleProfileClick}>
                  <RiUserLine />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Header Row (Black) - Navigation */}
      <div className="gg-bottom-header d-none d-xl-block">
        <Container>
          <Row>
            <Col sm="12">
              <div className="main-navbar">
                <MainHeaderMenu />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`offcanvas offcanvas-collapse order-xl-2 ${mobileSideBar ? "show" : ""} `}>
        <div className="offcanvas-header navbar-shadow">
          <h5>{t("Menu")}</h5>
          <Button close className="lead" id="toggle_menu_btn" type="button" onClick={() => setMobileSideBar(false)}>
            <div>
              <i className="ri-close-fill"></i>
            </div>
          </Button>
        </div>
        <div className="offcanvas-body">
          <MainHeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default HeaderOne;
