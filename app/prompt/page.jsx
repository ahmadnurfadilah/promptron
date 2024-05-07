"use client";

import LogoTron from "@/components/logo/logo-tron";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [prompts, setPrompts] = useState([]);
  const [contract, setContract] = useState();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getContract = async () => {
      setFetching(true);
      const promptContract = await window.tronWeb.contract().at(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
      setContract(promptContract);
      setFetching(false);
    };

    getContract();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchAllPrompts();
    }
  }, [contract]);

  const fetchAllPrompts = async () => {
    setFetching(true);
    const allPrompts = [];
    const promptId = await contract.promptId().call();
    for (let i = 0; i < promptId; i++) {
      const prompt = await contract.prompts(i).call();
      if (prompt.title != "") {
        allPrompts.push({ id: i, title: prompt.title, description: prompt.description, category: prompt.category, used: window.tronWeb.toSun(prompt.used), price: window.tronWeb.fromSun(prompt.price) });
      }
    }
    setPrompts(allPrompts);
    setFetching(false);
  };

  return (
    <div className="container px-4 pt-32">
      <h1 className="font-bold text-4xl mb-8">Discover</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fetching ? (
          <>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-2" />
              <Skeleton className="w-4/5 h-2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-2" />
              <Skeleton className="w-4/5 h-2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-2" />
              <Skeleton className="w-4/5 h-2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-2" />
              <Skeleton className="w-4/5 h-2" />
            </div>
          </>
        ) : (
          <>
            {prompts.map((i, idx) => (
              <Link
                href={`/prompt/${i.id}`}
                className="w-full bg-white/10 rounded-md group border border-transparent hover:border-primary transition-all hover:shadow-xl hover:scale-[1.01] duration-200"
                key={i.id}
              >
                <div className="p-1">
                  <img src={`/api/og?id=${i.id}&category=${i.category}&size=square`} alt="" className="w-full" />
                </div>
                <div className="px-4 pb-4 pt-3">
                  <h4 className="font-bold mb-1 line-clamp-1">{i.title}</h4>
                  <p className="text-xs line-clamp-2 text-white/70">{i.description}</p>
                  <hr className="my-4 border-white/10" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-5 flex items-center justify-center bg-red-500 rounded-full group-hover:bg-white">
                        <LogoTron className="w-4 h-4 group-hover:text-red-500" />
                      </div>
                      <p className="text-sm font-bold">{i.price}</p>
                    </div>
                    <div>
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full font-bold">Used {i.used/1000000}x</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
