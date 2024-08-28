"use client";
import { useTranslation } from "@/app/i18n/client";
import ChatBox from "@/components/chat-box";
import PeyronnetLogo from "@/components/peyronnet-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatToGpt } from "@/lib/ai-chat";
import { ChatConversation, ChatMessage } from "@/lib/ai-completions";
import { Tables } from "@/types_db";
import { Close, DialogClose } from "@radix-ui/react-dialog";
import { User } from "@supabase/supabase-js";
import {
  Check,
  History,
  MessageCircleMore,
  Pen,
  PenSquare,
  Send,
  Settings as SettingsIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModelString } from "@/lib/models";
import { Settings } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chatSystemPrompts } from "@/lib/prompts/system";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}
interface Props {
  user: User | null | undefined;
  subscriptions: SubscriptionWithProduct[] | null;
  lng: string;
  quotas: number;
}

export default function Chat(props: Props) {
  const lng: any = props.lng;
  const { t } = useTranslation(lng, "common");

  let s: Settings = { key: "" };
  const apiKey: string = process?.env?.OPENAI_API_KEY || "";
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
    s.models ??= ["gpt-3.5-turbo", "gpt-4"];
    s.system_templates ??= [];
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  const [userInput, setUserInput] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);
  const [templates, setTemplates] = useState(s.system_templates ?? []);
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    number | undefined
  >();
  const [system, setSystem] = useState(chatSystemPrompts[lng]);

  const [conversations, setConversations] =
    useState<ChatConversation[]>(getConvs());
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversations[0].messages,
  );
  const [model, setModel] = useState("gpt-3.5-turbo");

  const defaultModels = () =>
    hasGpt4Access() ? ["gpt-3.5-turbo", "gpt-4"] : ["gpt-3.5-turbo"];

  function getAvailableModels(
    availableModels: string[] | undefined,
  ): string[] | undefined {
    if (!availableModels) return [];
    let models = [];
    let gpt4 = hasGpt4Access();
    for (let i = 0; i < availableModels.length; i++) {
      if (availableModels[i].includes("gpt-4") && !gpt4) continue;
      models?.push(availableModels[i]);
    }
    return models;
  }

  function hasGpt4Access(): boolean {
    if (!props.user || !props.subscriptions) return false;
    for (let i = 0; i < props.subscriptions?.length; i++) {
      if (
        props.subscriptions[i].prices?.products?.name
          ?.toLowerCase()
          .includes("write")
      ) {
        return props.subscriptions[i].status === "active";
      }
    }
    return false;
  }

  const [avModels, setAvModels] = useState(
    getAvailableModels(s.models) ?? defaultModels(),
  );
  let userMsg = userInput;
  const [convIndex, setConvIndex] = useState(0);

  async function sendMessage() {
    userMsg = userInput;
    let msgs: ChatMessage[] = [
      ...messages,
      { role: "user", content: userInput },
    ];
    let msgs2: ChatMessage[] = [
      ...messages,
      { role: "user", content: userInput },
      { role: "assistant", content: "" },
    ];
    setMessages(msgs2); // Add the message to the messages list

    function setContent(content: string) {
      msgs2[msgs2.length - 1].content = content;
      setMessages([...msgs2]);
    }
    setUserInput("");
    let newMsg = await sendChatToGpt(
      model,
      { setContent: setContent },
      msgs,
      system,
    );
    return newMsg;
  }

  async function sendBtn() {
    setSendDisabled(true);
    let newMsg = await sendMessage();
    setSendDisabled(false);

    let c = [...conversations];
    c[convIndex].messages = [
      ...c[convIndex].messages,

      { role: "user", content: userMsg },
      { role: "assistant", content: newMsg },
    ];
    saveConvs([...c]);
  }

  function isSubscribed(): boolean {
    if (!props.user || !props.subscriptions) return false;
    for (let i = 0; i < props.subscriptions?.length; i++) {
      if (
        props.subscriptions[i].prices?.products?.name
          ?.toLowerCase()
          .includes("write")
      ) {
        return true;
      }
    }
    return false;
  }

  function getConvs(): ChatConversation[] {
    if (typeof window !== "undefined") {
      let convs: ChatConversation[] = JSON.parse(
        localStorage.getItem("synapsy_write_conversations") ?? "[]",
      );
      if (convs === undefined || convs.length === 0) {
        saveConvs([{ name: t("new-conv"), messages: [] }]);
        return [{ name: t("new-conv"), messages: [] }];
      }
      return convs;
    }
    return [{ name: t("new-convs"), messages: [] }];
  }

  function saveConvs(convs: ChatConversation[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "synapsy_write_conversations",
        JSON.stringify(convs),
      );
    }
  }

  function ConversationComponent(props: { isMobile?: boolean }) {
    const [renamePopup, setRenamePopup] = useState("");

    return (
      <div className={props.isMobile ? "p-2 pb-16" : "hidden w-60 sm:block"}>
        <p className="m-2 font-bold sm:hidden">{t("conversations")}</p>
        <div className="flex flex-col space-y-2">
          {conversations.map((el, i) => (
            <Button
              key={i}
              onClick={() => {
                setMessages(el.messages);
                setConvIndex(i);
                setSelectedTemplateId(undefined);
              }}
              variant="ghost"
              className={`grid grid-cols-[1fr,auto,auto] items-center ${i == convIndex ? "border-slate-300 bg-accent/50 text-accent-foreground dark:border-slate-700" : ""}`}
            >
              <span className="text-left">{el.name}</span>
              <Dialog>
                <DialogTrigger>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          onClick={() => setRenamePopup("")}
                          className="h-auto p-1"
                        >
                          <Pen size={12} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("rename")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("rename")}</DialogTitle>
                    <Input
                      value={renamePopup}
                      onChange={(v) => setRenamePopup(v.target.value)}
                      placeholder={t("enter-name")}
                    />
                    <DialogFooter>
                      <Close>
                        <Button
                          onClick={() => {
                            let c = [...conversations];
                            c[i].name = renamePopup;
                            setConversations(c);
                            saveConvs(c);
                          }}
                        >
                          {t("rename")}
                        </Button>
                      </Close>
                      <Close>
                        <Button variant="ghost">{t("close")}</Button>
                      </Close>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        let c = [...conversations];
                        c.splice(i, 1);
                        if (c.length === 0) {
                          c = [
                            {
                              name: t("new-conv"),
                              messages: [],
                            },
                          ];
                          setMessages([]);
                        }

                        setConversations(c);
                        saveConvs(c);
                        setConvIndex(0);
                      }}
                      className="h-auto p-1"
                    >
                      <Trash size={12} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("delete")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-2 print:hidden">
        <h1 className="text-3xl font-semibold">{t("chat")}</h1>
        <p className="text-muted-foreground">{t("chat-desc")}</p>
      </div>
      <section className="mx-auto grid h-full w-full max-w-6xl grid-cols-[auto,1fr] sm:space-x-2">
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>{t("history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[calc(100vh-150px)]">
              <ConversationComponent />
            </ScrollArea>
          </CardContent>
        </Card>
        <section
          className={
            "grid h-full grid-rows-[auto,1fr,auto] space-y-2 rounded-md border bg-card p-2 text-justify shadow-sm print:border-0 print:shadow-none"
          }
        >
          <div className="flex items-center space-x-2">
            <Select onValueChange={(e) => setModel(e)} defaultValue={model}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("model")} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {avModels.map((el, i) => (
                    <SelectItem key={i} value={el}>
                      {getModelString(el)}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            {messages.length === 1 && (
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost">
                    <SettingsIcon size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("system-templates")}</DialogTitle>
                  </DialogHeader>
                  {templates.length > 0 && (
                    <div>
                      <ScrollArea className="h-[200px]">
                        {templates.map((template, i) => (
                          <Close key={i} className="block w-full">
                            <Button
                              onClick={() => {
                                if (selectedTemplateId === i) {
                                  setSelectedTemplateId(undefined);
                                  setMessages([]);
                                  let c = [...conversations];
                                  c[convIndex].messages = [];
                                  setConversations(c);
                                  return;
                                }
                                setSelectedTemplateId(i);
                                setSystem(template.prompt);
                                let c = [...conversations];
                                c[convIndex].messages = messages;
                                setConversations(c);
                              }}
                              variant="ghost"
                              className="h-auto w-full px-1 text-left"
                            >
                              <div
                                className="grid w-full grid-cols-[auto,1fr,auto] items-center"
                                key={i}
                              >
                                {selectedTemplateId === i ? (
                                  <Check size={16} className="mx-2" />
                                ) : (
                                  <span></span>
                                )}
                                <span>
                                  <h4>{template.name}</h4>
                                  <p className="text-slate-400">
                                    {template.prompt.substring(0, 50) +
                                      (template.prompt.length > 50
                                        ? "..."
                                        : "")}
                                  </p>
                                </span>
                                <TooltipProvider delayDuration={0}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button
                                        onClick={() => {
                                          s.system_templates?.splice(i, 1);
                                          localStorage.setItem(
                                            "synapsy_settings",
                                            JSON.stringify(s),
                                          );
                                          setTemplates([
                                            ...(s.system_templates ?? []),
                                          ]);
                                        }}
                                        className="mt-1 h-auto p-2"
                                        variant="ghost"
                                      >
                                        <Trash size={12} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t("delete")}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </Button>
                          </Close>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                  {(!templates.length || templates.length === 0) && (
                    <div className="flex flex-col items-center rounded-md border p-2">
                      <SettingsIcon className="m-2" size={32} />
                      <h4>{t("no-templates")}</h4>
                      <p className="text-center text-slate-400">
                        {t("no-templates-desc")}
                      </p>
                      <Link href={`/${lng}/settings`}>
                        <Button variant="link">{t("create-template")}</Button>
                      </Link>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
          <ScrollArea className="max-h-[calc(100vh-330px)]">
            <ChatBox isLoading={sendDisabled} lng={lng} messages={messages} />
            {messages.length === 1 && (
              <div className="flex h-[calc(100vh-330px)] flex-col items-center justify-center text-center">
                <MessageCircleMore size={36} />
                <h3>{t("chat-placeholder")}</h3>
                <p>{t("chat-placeholder-desc")}</p>
                <p>{t("chat-placeholder-desc2")}</p>
              </div>
            )}
          </ScrollArea>
          <div className="flex space-x-2">
            <Input
              className="sm:-mr-2"
              onKeyUp={(e) => {
                if (e.key === "Enter" && isSubscribed()) sendBtn();
              }}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t("send-msg")}
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Drawer>
                    <DrawerTrigger className="sm:hidden">
                      <Button variant="outline">
                        <History size={14} />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <ScrollArea className="h-[200px]">
                        <ConversationComponent isMobile />
                      </ScrollArea>
                    </DrawerContent>
                  </Drawer>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("history")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => {
                      if (messages.length === 1) return; // If there are no messages
                      setMessages([]);
                      setConversations([
                        ...conversations,
                        { name: t("new-conv"), messages: [] },
                      ]);
                      setConvIndex(conversations.length);
                      saveConvs(conversations);
                    }}
                    variant="outline"
                  >
                    <PenSquare size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("new-conv")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isSubscribed() ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      className="group overflow-hidden"
                      disabled={sendDisabled}
                      onClick={sendBtn}
                    >
                      <Send className="group-hover:animate-rocket" size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("send-msg")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Dialog>
                <DialogTrigger className="w-auto">
                  <Button>
                    <Send size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    {props.user ? (
                      <section className="m-4">
                        <div className="flex justify-center">
                          <PeyronnetLogo width={250} />
                        </div>
                        <h2 className="text-center">{t("products-desc")}</h2>
                        <p className="max-w-3xl text-center">
                          {t("pricing-desc")}
                        </p>
                      </section>
                    ) : (
                      <section className="m-4 flex flex-col items-center space-y-2">
                        <div className="flex items-center">
                          <PeyronnetLogo width={250} />
                        </div>
                        <span className="rounded-full border border-violet-600 px-2 text-sm font-bold text-violet-600 dark:bg-violet-600/10">
                          {t("new")}
                        </span>
                        <h2 className="text-center">{t("unlock-power-ai")}</h2>
                        <p className="max-w-3xl text-center">
                          {t("account-desc")}
                        </p>
                      </section>
                    )}
                  </DialogHeader>
                  <DialogFooter>
                    <section className="flex flex-col-reverse space-x-2 sm:flex-row">
                      <DialogClose>
                        <Button variant="link">{t("close")}</Button>
                      </DialogClose>
                      {props.user ? (
                        <Link href={`/${lng}/pricing`}>
                          <Button>{t("see-pricing")}</Button>
                        </Link>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          {" "}
                          <Link href="login">
                            <Button variant="outline">{t("sign-in")}</Button>
                          </Link>
                          <Link href="https://account.peyronnet.group/login">
                            <Button>{t("sign-up")}</Button>
                          </Link>
                        </div>
                      )}
                    </section>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
