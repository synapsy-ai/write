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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { sendChatToGpt } from "@/lib/ai-chat";
import { ChatMessage } from "@/lib/ai-completions";
import { Database } from "@/types_db";
import { DialogClose } from "@radix-ui/react-dialog";
import { Session, User } from "@supabase/supabase-js";
import {
  MessageCircleMore,
  MessageSquareMore,
  PlusCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}
interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscriptions: SubscriptionWithProduct[] | null;
  lng: string;
  quotas: number;
}

export default function Chat(props: Props) {
  const lng: any = props.lng;
  const { t } = useTranslation(lng, "common");
  const [userInput, setUserInput] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);
  const defaultMsg: ChatMessage[] = [
    {
      role: "system",
      content:
        lng === "en"
          ? "You are a highly skilled AI assistant specializing in document creation, information extraction, and essay writing. You help users generate well-structured documents, summarize and extract key information from texts, and craft high-quality essays based on provided topics. Format response: HTML (use headers only when necessary, otherwise, only provide text)."
          : "Vous êtes un assistant IA hautement qualifié, spécialisé dans la création de documents, l'extraction d'informations et la rédaction d'essais. Vous aidez les utilisateurs à générer des documents bien structurés, à résumer et à extraire des informations clés de textes, et à rédiger des essais de haute qualité sur la base de sujets fournis. Format de réponse : HTML (utiliser les titres seulement si nécessaire, sinon, utiliser du texte simple).",
    },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMsg);

  async function sendMessage() {
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
      console.log(msgs2);
      setMessages([...msgs2]);
    }
    setUserInput("");
    await sendChatToGpt("gpt-3.5-turbo", { setContent: setContent }, msgs);
  }

  async function sendBtn() {
    setSendDisabled(true);
    await sendMessage();
    setSendDisabled(false);
  }

  function isSubscribed(): boolean {
    if (!props.session || !props.subscriptions) return false;
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

  return (
    <main className="mt-2 grid min-h-full grid-rows-[auto,auto,1fr] pb-8 sm:mt-16 sm:pb-0 print:mt-0">
      <section className="ml-2 flex items-center space-x-2 print:hidden">
        <MessageSquareMore />
        <span>
          <h2 className="text-2xl font-bold">{t("chat")}</h2>
          <p>{t("chat-desc")}</p>
        </span>
      </section>
      <Separator className="my-2" />
      <section
        className={
          "m-2 grid grid-rows-[1fr,auto] rounded-md border bg-white p-2 text-justify shadow-sm dark:bg-slate-900/50 print:border-0 print:shadow-none"
        }
      >
        <ScrollArea className="max-h-[calc(100vh-250px)]">
          <ChatBox isLoading={sendDisabled} lng={lng} messages={messages} />
          {messages.length === 1 && (
            <div className="flex h-[calc(100vh-250px)] flex-col items-center justify-center text-center">
              <MessageCircleMore size={36} />
              <h3>{t("chat-placeholder")}</h3>
              <p>{t("chat-placeholder-desc")}</p>
              <p>{t("chat-placeholder-desc2")}</p>
            </div>
          )}
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            onKeyUp={(e) => {
              if (e.key === "Enter") sendBtn();
            }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t("send-msg")}
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => {
                    setMessages(defaultMsg);
                  }}
                  variant="outline"
                >
                  <PlusCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("new")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isSubscribed() ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Button disabled={sendDisabled} onClick={sendBtn}>
                    <Send size={16} />
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
                  {props.session ? (
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
                    {props.session ? (
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
    </main>
  );
}
