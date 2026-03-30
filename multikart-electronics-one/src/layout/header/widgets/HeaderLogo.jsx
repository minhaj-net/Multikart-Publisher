import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { ImagePath } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const HeaderLogo = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { settingData } = useContext(SettingContext);
  const [logo, setLogo] = useState("");
  const path = useSearchParams();
  const theme = path.get("theme");
  
  useEffect(() => {
    let headerLogo = themeOption?.logo?.header_logo;
    headerLogo = { original_url: `${ImagePath}/icon/logo/easySolutions_logo__footer.png` };
    setLogo(headerLogo);
  }, [theme, themeOption?.logo?.header_logo]);

  return (
    <Link href="/">
      {logo?.original_url ? (
        <Image 
          src={logo.original_url} 
          height={40} 
          width={150} 
          alt={settingData?.general?.site_name || "logo"} 
        />
      ) : (
        settingData?.general?.site_name && (
          <h2 className="f-w-600">
            {settingData?.general?.site_name.split(" ")[0] || "Logo"}
          </h2>
        )
      )}
    </Link>
  );
};

export default HeaderLogo;
