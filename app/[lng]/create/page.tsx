"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hand, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import { Template, sendToGpt } from "@/lib/ai-completions";

export default function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");

  const [type, setType] = useState("para");

  let s: Settings = { key: "" };
  if (typeof window !== undefined) {
    s = JSON.parse(localStorage.getItem("quark_settings") ?? "{}");
  }

  const [welcome, setWelcome] = useState(s.key === undefined);
  const [keyTxt, setKeyTxt] = useState(s.key);
  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");
  const [inProgress, setInProgress] = useState(false);

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("quark_settings", JSON.stringify(s));
    setWelcome(false);
  }

  async function create() {
    setInProgress(true);
    let r = await sendToGpt(prompt, s.key, type, lng);
    setRes(r);
    setInProgress(false);
  }

  return (
    <main>
      <section className="mx-2">
        <h2 className="font-bold text-2xl">{t("create")}</h2>
        <p>{t("create-desc")}</p>
      </section>
      {!welcome ? (
        <section className="bg-white dark:bg-slate-900 p-2 flex items-center rounded-md space-x-2 shadow-md m-2">
          <Input onChange={(v) => setPrompt(v.target.value)} />
          <Select onValueChange={(v) => setType(v)} defaultValue={type}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("content-type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="para">{t("paragraph")}</SelectItem>
              <SelectItem value="email">{t("email")}</SelectItem>
              <SelectItem value="blog">{t("blog-post")}</SelectItem>
              <SelectItem value="ideas">{t("ideas")}</SelectItem>
            </SelectContent>
          </Select>

          {!inProgress ? (
            <Button onClick={create}>{t("create")}</Button>
          ) : (
            <Button disabled className="cursor-not-allowed">
              {" "}
              <Loader2 className="mr-2 animate-spin" /> {t("please-wait")}
            </Button>
          )}
        </section>
      ) : (
        <section className="flex flex-col items-center">
          <Hand size={64} />
          <h2 className="font-bold text-2xl">{t("welcome")}</h2>
          <p>{t("welcome-desc")}</p>
          <Input
            type="password"
            onChange={(v) => setKeyTxt(v.target.value)}
            className="max-w-[350px] my-2"
          />
          <Button onClick={setKey}>{t("confirm")}</Button>
        </section>
      )}
      <section className="bg-white dark:bg-slate-900 shadow-md rounded-md p-2 m-2">
        {res}Bonjour à tous ! Nous sommes ravis de vous annoncer le lancement de
        la toute nouvelle version de ColorPicker Max, l'outil ultime pour
        choisir et gérer vos palettes de couleurs. ColorPicker Max est un outil
        de sélection de couleurs puissant qui vous permet de créer, d'explorer
        et de sauvegarder vos palettes de couleurs préférées en un seul endroit.
        Avec sa nouvelle interface intuitive et ses fonctionnalités avancées, il
        deviendra rapidement un compagnon indispensable dans votre arsenal de
        conception. La nouvelle version de ColorPicker Max offre une expérience
        utilisateur améliorée avec une interface moderne et élégante. Vous
        pouvez maintenant naviguer facilement entre vos palettes de couleurs
        grâce à un menu déroulant pratique et accéder à des outils de
        personnalisation avancés pour affiner chaque nuance de votre palette.
        Une des fonctionnalités les plus excitantes de ColorPicker Max est la
        possibilité d'extraire les couleurs à partir d'images. Vous pouvez
        simplement charger une image et l'outil analysera automatiquement les
        couleurs présentes, vous permettant ainsi de créer des palettes
        cohérentes en harmonie avec votre image de base. En termes d'exploration
        de couleurs, la nouvelle version de ColorPicker Max offre une variété
        d'options pour trouver l'inspiration. Vous pouvez parcourir des palettes
        de couleurs préexistantes et les enregistrer dans votre bibliothèque
        personnelle. De plus, l'outil propose également des suggestions de
        couleurs complémentaires pour vous aider à créer des combinaisons
        harmonieuses. Une autre nouveauté intéressante est la fonctionnalité de
        gestion de projets. Avec ColorPicker Max, vous pouvez organiser vos
        palettes de couleurs par projet, ce qui facilite la recherche et
        l'utilisation des bonnes couleurs pour chaque projet spécifique. Enfin,
        la nouvelle version de ColorPicker Max propose une intégration plus
        poussée avec vos applications de conception préférées. Vous pouvez
        désormais exporter facilement vos palettes de couleurs vers des
        logiciels tels que Photoshop, Sketch ou Illustrator, ce qui vous permet
        de gagner du temps et de simplifier votre flux de travail. Nous avons
        travaillé dur pour vous offrir une version améliorée de ColorPicker Max
        et nous espérons sincèrement qu'elle répondra à toutes vos attentes.
        Alors qu'attendez-vous ? Téléchargez dès maintenant la nouvelle version
        de ColorPicker Max et commencez à créer des palettes de couleurs
        incroyables dès aujourd'hui ! Nous sommes impatients de voir les
        magnifiques créations que vous réaliserez avec ColorPicker Max.
        N'hésitez pas à partager vos créations sur les réseaux sociaux avec le
        hashtag #ColorPickerMax pour que nous puissions les admirer. Merci
        encore pour votre soutien continu et votre fidélité. L'équipe de
        ColorPicker Max
      </section>
      {inProgress ? (
        <section className="min-h-[50vh] flex flex-col justify-center items-center">
          <Loader2 height={48} width={48} className="animate-spin" />
          <p className="font-bold text-xl">{t("gen-in-progress")}</p>
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
