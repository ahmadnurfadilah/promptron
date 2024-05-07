"use client";

import toast from "react-hot-toast";
import LogoTron from "@/components/logo/logo-tron";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { truncateAddress } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/lib/store";
import PromptCompletion from "./completion";

export default function Page() {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [prompt, setPrompt] = useState([]);
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
      fetchPrompt(id);
    }
  }, [id, contract]);

  const fetchPrompt = async (promptId) => {
    setFetching(true);
    const p = await contract.prompts(promptId).call();
    setPrompt({ id: id, title: p.title, description: p.description, category: p.category, preview: p.preview, data: p.data, price: window.tronWeb.fromSun(p.price) });
    setFetching(false);
  };

  return (
    <div className="container px-4 pt-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        <div>
          {fetching ? (
            <div className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <div className="p-4 space-y-4">
                <Skeleton className="w-2/3 h-3" />
                <Skeleton className="w-full h-px" />
                <Skeleton className="w-full h-5" />
              </div>
            </div>
          ) : (
            <div className="w-full bg-white/10 rounded-md">
              {prompt && (
                <div className="p-1">
                  <img src={`/api/og?id=${prompt?.id ?? "-"}&category=${prompt?.category ?? ""}&size=square`} alt="" className="w-full" />
                </div>
              )}
              <div className="px-4 pb-4 pt-3 flex flex-col justify-between">
                <span className={`text-xs text-white/60`}>By: {truncateAddress(user?.address ?? "")}</span>
                <hr className="my-4 border-white/10" />
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    {user?.address ? (
                      <Dialog>
                        <DialogTrigger className="gap-2 bg-primary text-dark hover:bg-primary/90 h-10 px-4 py-2 flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300">
                          <span>Try Prompt</span>
                          <h6 className={`flex items-center gap-1`}>
                            <LogoTron className="w-4 h-4" />
                            <span>{prompt?.price}</span>
                          </h6>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-800 border-dark">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Try Prompt: {prompt?.title}</DialogTitle>
                            <div>
                              <PromptCompletion contract={contract} tokenId={id} prompt={prompt} />
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        className="gap-2 flex-1"
                        variant="primary"
                        onClick={() => {
                          toast.error("Connect your wallet");
                        }}
                      >
                        <span>Try Prompt</span>
                        <h6 className={`flex items-center gap-1`}>
                          <LogoTron className="w-4 h-4" />
                          <span>{prompt?.price}</span>
                        </h6>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          {fetching ? (
            <div className="space-y-4">
              <Skeleton className="w-4/5 h-8 rounded-md" />
              <Skeleton className="w-full h-px rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-2/3 h-4 rounded-md" />
            </div>
          ) : (
            <>
              <h1 className="font-bold text-2xl">{prompt?.title}</h1>
              <hr className="my-4 border-white/10" />
              <p className="text-white/70">{prompt?.description}</p>

              {prompt?.preview && (
                <div className="mt-6">
                  <h5 className="font-bold text-xl mb-2">Preview Output</h5>
                  <p className="whitespace-pre-wrap text-white/70">{prompt?.preview}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
