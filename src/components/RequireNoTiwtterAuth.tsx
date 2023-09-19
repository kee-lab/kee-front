import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useGetInitializedQuery } from "@/app/services/auth";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";

// 如果用户没有得到从twitter的授权，则跳转到twitter授权页面。

interface Props {
  children: ReactElement;
  redirectTo?: string;
}

const RequireNoTwitterAuth: FC<Props> = ({ children, redirectTo = "/twitterAuth" }) => {
  //查询用户状态
  const { isLoading } = useGetInitializedQuery();
  const { token, initialized, guest } = useAppSelector((store) => store.authData, shallowEqual);
  if (isLoading) return null;
  //  未初始化 则先走setup 流程
  if (!initialized) return <Navigate to={`/onboarding`} replace />;
  return token && !guest ? <Navigate to={redirectTo} replace /> : children;
};

export default RequireNoTwitterAuth;
