import { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

import { KEY_LOCAL_MAGIC_TOKEN } from "@/app/config";
import { useTwitterCodeAuthMutation } from "@/app/services/auth";
import StyledButton from "../../components/styled/Button";

export type GithubLoginSource = "widget" | "webapp";
type Props = {
  code: string;
};
const TwitterCallback: FC<Props> = ({ code}) => {
  const { t } = useTranslation("auth");
  const { t: ct } = useTranslation();
  //拿本地存的magic token
  const [twitterCodeAuth, { isLoading, isSuccess, error }] = useTwitterCodeAuthMutation();
  useEffect(() => {
    if (code) {
      twitterCodeAuth(
        code
      );
    }
  }, [code]);
  const handleClose = () => {
    window.close();
  };
  if (error) return <span className="text-red-500 text-lg">Something Error</span>;
  return (
    
    <section className="flex-center flex-col gap-3">
      <StyledButton onClick={handleClose}>{ct("action.close")}</StyledButton>
      {isSuccess && <h1>{t("github_cb_tip")}</h1>}
      <span className="text-3xl text-green-600 font-bold">
        {isLoading ? t("github_logging_in") : t("github_login_success")}
      </span>
    </section>
  );
};

export default TwitterCallback;
