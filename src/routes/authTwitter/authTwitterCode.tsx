import { FC } from "react";
import { NavLink, useLocation,useParams  } from "react-router-dom";
import TwitterCallback from "@/routes/callback/TwitterCallback";


//接收twitter的code.

interface Props {
}

const User: FC<Props> = ({  }) => {
  // const code = useParams();
  // const { pathname } = useLocation();
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const code:string = searchParams.get('code')||'';
  console.log("code is:"+code);

  return (
    <>
    <div>
      // 使用twitter code进行授权
      <TwitterCallback code={code} />
    </div>
    </>
  );
};

export default User;
