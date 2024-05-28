"use client";

import * as Yup from "yup";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { crypt } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useLoadingStore, useUserStore } from "@/lib/store";
import LogoTron from "@/components/logo/logo-tron";

export default function Page() {
  const user = useUserStore((state) => state.user);
  const setLoading = useLoadingStore((state) => state.setMsg);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("GPT");
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmitData = async (values) => {
    if (step === 3) {
      setLoading("Processing...");

      const prompData = crypt(
        JSON.stringify({
          model: values.model,
          prompt: `${values.prompt}`,
          temperature: values?.temperature || 1,
          max_tokens: values?.max_tokens || 256,
        })
      );

      const contract = await window.tronWeb.contract().at(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
      try {
        const result = await contract.addPrompt(values.title, values.description, category, values.preview_output, prompData, parseInt(tronWeb.toSun(values.price_to_use))).send({
          feeLimit:1_000_000_000,
          callValue:0,
          shouldPollResponse:true
        });

        setLoading(false);
        toast.success("Success!");
        console.log("contract result", result);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        setLoading(false);
        toast.error(error.toString());
        console.log("Error", error);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-2 md:pt-4 lg:pt-8 mt-32">
      <div>
        <div className="w-full rounded-t-md p-4 md:p-6 bg-white/10">
          <ol className="flex items-center w-full text-sm font-bold text-center text-white/80 sm:text-base">
            <li
              className={`${
                step >= 1 && "text-primary"
              } flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-white/80 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-white/80">
                {step >= 1 ? <CheckCircle2 className="mr-2" /> : <span className="mr-2">1</span>}
                Setup
              </span>
            </li>
            <li
              className={`${
                step >= 2 && "text-primary"
              } flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-white/80 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-white/80">
                {step >= 2 ? <CheckCircle2 className="mr-2" /> : <span className="mr-2">2</span>}
                Details
              </span>
            </li>
            <li className={`${step >= 3 && "text-primary"} flex items-center`}>
              {step >= 3 ? <CheckCircle2 className="mr-2" /> : <span className="mr-2">3</span>}
              Review
            </li>
          </ol>
        </div>
        <div className="w-full rounded-b-md p-4 md:p-6 bg-white/15">
          {step === 0 && (
            <>
              <h1 className="font-bold text-2xl mb-4">Start selling your prompts</h1>
              <p className="mb-3 text-white/70">
                Promptron is a cutting-edge marketplace fully powered by TRON blockchain technology, focusing on Midjourney, ChatGPT, DALL·E, and Stable
                Diffusion Prompts. Through Promptron, you have the opportunity to monetize your Prompt Engineering expertise by offering and selling your own
                prompts.
              </p>
              <p className="text-white/70 mb-6">
                With the security and efficiency guaranteed by TRON blockchain technology, this innovative platform enables you to kickstart your prompt-selling
                journey in just 2 minutes. Harness the power of blockchain technology to unlock your potential on Promptron!
              </p>

              {user ? (
                <Button size="lg" variant="primary" className="gap-2 font-bold text-dark" onClick={() => setStep((prev) => prev + 1)}>
                  <Rocket className="w-4 h-4" />
                  <span>Sell a prompt</span>
                </Button>
              ) : (
                <Button>Connect</Button>
              )}
            </>
          )}

          <Formik
            enableReinitialize
            initialValues={{
              title: "",
              description: "",
              price_to_use: "",
              model: "gpt-3.5-turbo-instruct",
              preview_output: "",
              prompt: "",
              temperature: "1",
              max_tokens: "250",
            }}
            validationSchema={Yup.object({
              title: Yup.string().max(160).required("Title is required"),
              description: Yup.string().max(400).required("Description is required"),
              price_to_use: Yup.number().min(20).required("Price to use is required"),
              model: step === 2 && Yup.string().required("Model is required"),
              prompt: step === 2 && Yup.string().required("Prompt is required"),
              preview_output: step === 2 && Yup.string().required("Preview Output is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              handleSubmitData(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="font-bold text-2xl mb-4">Setup</h2>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <button
                          type="button"
                          className={`${
                            category === "GPT" ? "border-primary bg-dark text-primary" : "text-white/70 bg-white/10 border-dark"
                          } relative w-full aspect-[2/1] border flex items-center justify-center font-bold text-sm rounded-md active:scale-95 transition-all`}
                          onClick={() => setCategory("GPT")}
                        >
                          GPT
                        </button>
                        <button
                          type="button"
                          className={`${
                            category === "DALL-E" ? "border-primary bg-dark text-primary" : "text-white/30 bg-white/5 border-dark"
                          } relative w-full aspect-[2/1] border flex items-center justify-center font-bold text-sm rounded-md active:scale-95 transition-all cursor-not-allowed`}
                          disabled
                        >
                          DALL-E
                          <p className="absolute bg-red-500 text-[9px] px-1 top-1 right-1 text-white rounded">Comin Soon</p>
                        </button>
                        <button
                          type="button"
                          className={`${
                            category === "ChatGPT" ? "border-primary bg-dark text-primary" : "text-white/30 bg-white/5 border-dark"
                          } relative w-full aspect-[2/1] border flex items-center justify-center font-bold text-sm rounded-md active:scale-95 transition-all cursor-not-allowed`}
                          disabled
                        >
                          ChatGPT
                          <p className="absolute bg-red-500 text-[9px] px-1 top-1 right-1 text-white rounded">Comin Soon</p>
                        </button>
                        <button
                          type="button"
                          className={`${
                            category === "Midjourney" ? "border-primary bg-dark text-primary" : "text-white/30 bg-white/5 border-dark"
                          } relative w-full aspect-[2/1] border flex items-center justify-center font-bold text-sm rounded-md active:scale-95 transition-all cursor-not-allowed`}
                          disabled
                        >
                          Midjourney
                          <p className="absolute bg-red-500 text-[9px] px-1 top-1 right-1 text-white rounded">Comin Soon</p>
                        </button>
                        <button
                          type="button"
                          className={`${
                            category === "Stable Diffusion" ? "border-primary bg-dark text-primary" : "text-white/30 bg-white/5 border-dark"
                          } relative w-full aspect-[2/1] border flex items-center justify-center font-bold text-sm rounded-md active:scale-95 transition-all cursor-not-allowed`}
                          disabled
                        >
                          Stable Diffusion
                          <p className="absolute bg-red-500 text-[9px] px-1 top-1 right-1 text-white rounded">Comin Soon</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Field
                        type="title"
                        name="title"
                        placeholder="...."
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500" />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Field
                        as="textarea"
                        type="description"
                        name="description"
                        placeholder="...."
                        rows="4"
                        className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <ErrorMessage name="description" component="div" className="text-red-500" />
                    </div>

                    <div className="space-y-2">
                      <Label>Price to use</Label>
                      <div className="relative">
                        <LogoTron className="w-4 h-4 absolute top-2.5 left-2.5 text-red-500" />
                        <Field
                          type="price_to_use"
                          name="price_to_use"
                          placeholder="...."
                          className="pl-8 flex h-10 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <ErrorMessage name="price_to_use" component="div" className="text-red-500" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Field
                          as="select"
                          name="model"
                          className="flex w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="gpt-3.5-turbo-instruct" selected>
                            gpt-3.5-turbo-instruct
                          </option>
                        </Field>
                        <ErrorMessage name="model" component="div" className="text-red-500" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <Label>Temperature</Label>
                            <span className="text-xs font-bold tracking-wider text-white/70">({formik.values.temperature})</span>
                          </div>
                          <p className="text-xs text-white/60 pb-2 mt-1 mb-2">A higher temperature leading to more variation</p>
                          <Slider
                            defaultValue={[formik.values.temperature]}
                            max={1}
                            step={0.1}
                            onValueChange={(e) => formik.setFieldValue("temperature", e[0])}
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <Label>Maximum Length</Label>
                            <span className="text-xs font-bold tracking-wider text-white/70">({formik.values.max_tokens})</span>
                          </div>
                          <p className="text-xs text-white/60 pb-2 mt-1 mb-2">A maximum length of text generated</p>
                          <Slider
                            defaultValue={[formik.values.max_tokens]}
                            min={100}
                            max={1000}
                            step={50}
                            onValueChange={(e) => formik.setFieldValue("max_tokens", e[0])}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Prompt</Label>
                        {(category === "GPT" || category === "ChatGPT") && (
                          <p className="text-xs text-white/60 pb-2">Mark any editable sections with [square brackets].</p>
                        )}
                        <Field
                          as="textarea"
                          type="prompt"
                          name="prompt"
                          placeholder="Example: Create a joke about [topic]"
                          rows="4"
                          className="flex w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage name="prompt" component="div" className="text-red-500" />
                      </div>

                      {category === "GPT" && (
                        <div className="space-y-1">
                          <Label>Preview Output</Label>
                          <p className="text-xs text-white/60 pb-2">
                            A preview output generated this prompt to demonstrate to a potential buyer what your prompt does. Do not include your input prompt.
                          </p>
                          <Field
                            as="textarea"
                            type="preview_output"
                            name="preview_output"
                            placeholder={`Example:\n- [Coke] = Why did the can of coke go to therapy? Because it was feeling a little flat.\n- [Golf] = Why was the computer always cold? Because it left its Windows open.`}
                            rows="4"
                            className="flex w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <ErrorMessage name="preview_output" component="div" className="text-red-500" />
                        </div>
                      )}

                      {category === "DALL-E" && (
                        <div className="space-y-1">
                          <Label>Example images</Label>
                          <p className="text-xs text-white/60 pb-2">Upload 6 example images generated by this prompt (no collages or edits)</p>
                          <Field
                            as="file"
                            type="preview_images"
                            name="preview_images"
                            placeholder="...."
                            rows="4"
                            className="flex w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm ring-offset-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <ErrorMessage name="preview_images" component="div" className="text-red-500" />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Title</Label>
                      <h6 className="font-bold">{formik.values.title}</h6>
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <h6 className="font-bold">{formik.values.description}</h6>
                    </div>
                    <div className="space-y-1">
                      <Label>Price to use</Label>
                      <h6 className="font-bold flex items-center gap-2">
                        <LogoTron className="w-4 h-4 text-red-500" />
                        {formik.values.price_to_use}
                      </h6>
                    </div>
                    <div className="space-y-1">
                      <Label>Prompt</Label>
                      <h6 className="font-bold whitespace-pre-wrap">{`${formik.values.prompt}`}</h6>
                    </div>
                    <div className="space-y-1">
                      <Label>Preview Output</Label>
                      <h6 className="font-bold whitespace-pre-wrap">{`${formik.values.preview_output}`}</h6>
                    </div>
                  </div>
                )}

                {step >= 1 && (
                  <div className="flex items-center justify-between border-t border-t-white/10 pt-4 mt-6">
                    <Button type="button" className="gap-2" onClick={() => setStep((prev) => prev - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>

                    <Button type="submit" className="gap-2" disabled={(step < 3 && !formik.isValid) || isSubmit}>
                      <span>{step === 3 ? "Submit" : "Next"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
