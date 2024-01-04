import { useLazyGetTwitterListLastQuery } from "@/app/services/user";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ViewportList } from "react-viewport-list";
import GoBackNav from "@/components/GoBackNav";
import { TwitterUserInfo } from "@/types/user";
import Ui from "@/app/slices/ui";
import { getContract } from "../wallet";
import { useLazyGetWalletByUidQuery } from "@/app/services/user";
import { convertToRelativeTime } from "@/utils";
import BuyShare from "@/components/BuyShare";
import { NavLink } from "react-router-dom";
import UserShare from "@/components/UserShare";

function newPostPage() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [getWalletByUid, { data: wallet }] = useLazyGetWalletByUidQuery();
  // const buyShare = async (uid: number) => {
  //   const contract = getContract();
  //   // 检查用户钱包地址是否存在.
  //   let shareWalletResult = await getWalletByUid(uid);
  //   let shareWallet = shareWalletResult.data;
  //   console.log("shareWallet is %s", shareWallet);
  //   // console.log("shareWallet is:" + shareWallet);
  //   if (shareWallet) {
  //     // 得到用户的购买价格
  //     let buyPriceAfterFee = await contract.getBuyPriceAfterFee(shareWallet, 1);
  //     // 去购买用户的share
  //     console.log("buyPriceAfterFee is:  " + buyPriceAfterFee);
  //     let shareSupply = await contract.sharesSupply(shareWallet);
  //     console.log("shareSupply is:%d", shareSupply);
  //     // const result = await contract.buyShares.staticCall(
  //     //   "0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E",
  //     //   1
  //     // );
  //     const result = await contract.buyShares(shareWallet, 1, {
  //       value: buyPriceAfterFee
  //     });
  //     console.log("result is:" + JSON.stringify(result));
  //   }
  // };
  const [
    getNewTwitterInfo,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: twitterUsers }
  ] = useLazyGetTwitterListLastQuery();

  useEffect(() => {
    getNewTwitterInfo();
  }, []);
  if (usersLoading && twitterUsers) {
    return <div>loading</div>;
  } else {
    return (
      <div className={clsx("flex h-screen md:h-full md:pt-2 md:pb-2.5 md:pr-12")}>
        <div
          className={clsx(
            "md:rounded-l-2xl bg-white dark:bg-gray-800 relative flex flex-col w-full md:w-auto md:min-w-[268px] shadow-[inset_-1px_0px_0px_rgba(0,_0,_0,_0.1)]"
          )}
        >
          <div className="flex flex-col md:gap-1 px-2 pt-3 pb-20 md:py-3 overflow-scroll" ref={ref}>
            <ViewportList viewportRef={ref} items={twitterUsers}>
              {(twitterUser) => {
                return (
                  <NavLink
                    key={twitterUser.uid}
                    className={({ isActive }) =>
                      `rounded-md md:hover:bg-gray-500/10 ${isActive ? "bg-gray-500/10" : ""}`
                    }
                    to={`/explore/profile/${twitterUser.uid}`}
                  >
                    <UserShare
                      twitterUser={twitterUser}
                      uid={twitterUser.uid}
                      enableContextMenu={true}
                    />
                  </NavLink>
                );
              }}
            </ViewportList>
          </div>
        </div>
      </div>
    );
  }
}

export default newPostPage;
