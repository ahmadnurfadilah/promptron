"use client";

import Link from "next/link";
import Logo from "./logo";
import { Button, buttonVariants } from "./ui/button";
import { Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const getTronweb = () => {
    console.log("HI");
    const obj = setInterval(async () => {
      clearInterval(obj);
      if (window.tronWeb) {
        if (window.tronWeb.defaultAddress.base58) {
          toast.success("Yes, catch it:" + window.tronWeb.defaultAddress.base58);
        } else {
          toast.error("Wallet not connected!");
        }
      } else {
        toast.error("TronLink not detected!");
      }
    }, 10);
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
            <Button href="/prompt" className={`${buttonVariants({ variant: "primary" })} gap-2`} onClick={() => getTronweb()}>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
