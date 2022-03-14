import { useState, useEffect } from "react";
import { getInitials, getInitialsAvatar } from "../utils";
export default function Avatar({ url, name = "unkonw name", ...rest }) {
  // console.log("avatar url", url);
  const [src, setSrc] = useState("");
  const handleError = () => {
    const tmp = getInitialsAvatar({
      initials: getInitials(name),
    });
    setSrc(tmp);
  };
  useEffect(() => {
    if (!url) {
      const tmp = getInitialsAvatar({
        initials: getInitials(name),
      });
      setSrc(tmp);
    } else {
      setSrc(url);
    }
  }, [url, name]);

  return <img src={src} onError={handleError} {...rest} />;
}
