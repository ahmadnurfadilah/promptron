"use client";

import Link from "next/link";
import Logo from "./logo/logo";
import { Button, buttonVariants } from "./ui/button";
import { User, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "@/lib/store";
import { useEffect } from "react";
import { truncateAddress } from "@/lib/utils";

export default function Navbar() {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const getTronweb = async () => {
    if (typeof window.tronWeb !== "undefined" && typeof window.tronLink !== "undefined") {
      if (window.tronWeb.ready || window.tronLink.ready) {
        try {
          const connect = await window.tronLink.request({ method: "tron_requestAccounts" });
          if (connect === 200) {
            setUser({ address: window.tronWeb.defaultAddress.base58});
          } else {
            console.log("Connect", connect);
            setUser({ address: window.tronWeb.defaultAddress.base58});
          }
        } catch (e) {
          console.log("Error", e);
          toast.error("Failed to connect your wallet!");
        }
      } else {
        toast.error("TronLink not yet ready!");
      }
    } else {
      toast.error("TronLink not detected!");
      toast.error("Make sure you have installed TronLink in your browser");
    }
  };

  return (
    <div className="fixed top-8 inset-x-0 z-20">
      <div className="w-full container px-4">
        <div className="w-full h-16 bg-white/10 rounded-xl backdrop-blur-xl border border-white/10 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold">
            <Logo />
          </Link>
          <div className="flex items-center gap-8 md:gap-12">
            <div className="flex items-center gap-8 md:gap-12 text-sm font-medium text-white/70">
              <Link href="/" className="hover:text-white hover:underline transition-all hover:underline-offset-8 hover:decoration-2">
                Home
              </Link>
              <Link href="/prompt" className="hover:text-white hover:underline transition-all hover:underline-offset-8 hover:decoration-2">
                Discover
              </Link>
              <Link href="/sell" className="hover:text-white hover:underline transition-all hover:underline-offset-8 hover:decoration-2">
                Sell Prompt
              </Link>
            </div>
            {user?.address ? (
              <Button className={`${buttonVariants({ variant: "primary" })} gap-2`}>
                <User className="w-4 h-4" />
                {user?.address && truncateAddress(user.address)}
              </Button>
            ) : (
              <Button className={`${buttonVariants({ variant: "primary" })} gap-2`} onClick={() => getTronweb()}>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
