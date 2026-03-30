import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { ImagePath } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const FooterLogo = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { settingData } = useContext(SettingContext);
  const [logoAbc, setLogo] = useState("");
  const path = useSearchParams();
  const theme = path.get("theme");
  useEffect(() => {
    let logo = themeOption?.logo?.footer_logo;
    logo = { original_url: `${ImagePath}/icon/logo/easySolutions_logo__footer.png` };

    setLogo(logo);
  }, [theme, themeOption?.logo?.footer_logo]);
  return (
    <div className="footer-logo">
      <Link href="/">{logoAbc?.original_url ? <Image src={logoAbc?.original_url} height={10} width={180} alt={settingData?.general?.site_name ? settingData?.general?.site_name : "multikart-logo"} /> : settingData?.general?.site_name && <h2 className="f-w-600">{settingData?.general?.site_name ? settingData?.general?.site_name.split(" ")[0] : "Logo Here"}</h2>}</Link>
    </div>
  );
};

export default FooterLogo;
