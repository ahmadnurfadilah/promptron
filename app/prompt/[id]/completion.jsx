"use client";

import toast from "react-hot-toast";
import LogoTron from "@/components/logo/logo-tron";
import { useCompletion } from "ai/react";
import { useCallback, useEffect, useState } from "react";
import { useLoadingStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { decrypt } from "@/lib/utils";

export default function PromptCompletion({ tokenId, prompt }) {
  const setLoading = useLoadingStore((state) => state.setMsg);
  const [inputs, setInputs] = useState([]);
  const [balance, setBalance] = useState(1000);
  const [inputValues, setInputValues] = useState({});
  const { completion, complete } = useCompletion({
    body: {
      inputValues: inputValues,
    },
  });

  useEffect(() => {
    if (prompt?.data) {
      const promptText = decrypt(prompt.data);
      const textInBrackets = promptText.match(/\[(.*?)\]/g)?.map((teks) => teks.replace(/\[|\]/g, "").trim());
      if (textInBrackets !== undefined && textInBrackets.length > 0) {
        setInputs(textInBrackets);
      } else {
        setInputs([]);
      }
    }
  }, [prompt]);

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;

    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleTryPrompt = useCallback(
    async (c) => {
      const cost = window.tronWeb.fromSun(prompt.price);

      if (balance >= cost) {
        setLoading("Loading...");
        try {
          setBalance((prev) => prev - cost);
          await complete(prompt?.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          toast.error("Failed to handle your request");
          setLoading(false);
        }
      } else {
        toast.dismiss();
        toast.error("Your balance is insufficient to make this transaction");
      }
    },
    [complete, balance, prompt, setLoading, tokenId]
  );

  return (
    <>
      {inputs != null && inputs != undefined && inputs.length > 0 && (
        <div className="space-y-4 my-4">
          {inputs.map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Label>{i}</Label>
              <input
                placeholder="...."
                type="text"
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                name={`${i}`}
                value={inputValues[`${i}`] || ""}
                onChange={handleInputFieldChange}
              />
            </div>
          ))}
        </div>
      )}

      <Button className="gap-2 w-full" variant="primary" size="lg" onClick={() => handleTryPrompt(prompt?.data)}>
        <span>Try Now</span>
        <p className={`flex items-center gap-1`}>
          <LogoTron className="w-4 h-4" />
          <span>{prompt?.price}</span>
        </p>
      </Button>

      <div className="whitespace-pre-wrap my-6 border border-primary bg-lime text-primary p-3 rounded max-h-[calc(100vh_-_25rem)] overflow-y-auto">
        <p className="font-bold uppercase mb-3">Result:</p>
        {completion || `-`}
      </div>
    </>
  );
}
