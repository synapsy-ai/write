"use client";
import { useTranslation } from "@/app/i18n/client";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getTemplates, Recipe, saveTemplates, Step } from "@/lib/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDownIcon, ArrowUpIcon, Edit, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HighlightedVariable } from "@/components/variable-highlight";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Close } from "@radix-ui/react-dialog";

export default function EditTemplatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  const searchParams = useSearchParams();
  const id: string | number = searchParams.get("id") || 0;
  const recipes = getTemplates();
  const [recipe, setRecipe] = useState(recipes[+id]);

  const [name, setName] = useState(recipe?.name);
  const [prompt, setPrompt] = useState(recipe?.systemPrompt);

  function up(i: number) {
    let item1 = recipe?.steps[i - 1];
    let item2 = recipe?.steps[i];
    let steps = [...recipe.steps];
    steps[i - 1] = item2;
    steps[i] = item1;

    let r = {
      name: recipe.name,
      systemPrompt: recipe.systemPrompt,
      steps: steps,
    };
    setRecipe(r);
    recipes[+id] = r;
    saveTemplates(recipes);
  }
  function down(i: number) {
    let item1 = recipe?.steps[i + 1];
    let item2 = recipe?.steps[i];
    let steps = [...recipe.steps];
    steps[i + 1] = item2;
    steps[i] = item1;

    let r = {
      name: recipe.name,
      systemPrompt: recipe.systemPrompt,
      steps: steps,
    };
    setRecipe(r);
    recipes[+id] = r;
    saveTemplates(recipes);
  }

  function save() {
    let r = {
      name: name,
      systemPrompt: prompt,
      steps: [...recipe?.steps],
    };
    recipes[+id] = r;
    saveTemplates(recipes);
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:mt-16 sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto grid w-full gap-2 print:hidden">
          <h1 className="text-3xl font-semibold">{t("template-edit")}</h1>
        </div>

        <Card className="mt-6 flex flex-col gap-6 p-6 md:p-8">
          <div className="grid gap-2">
            <h4 className="font-bold">{t("name")}</h4>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setRecipe({
                  name: name,
                  systemPrompt: prompt,
                  steps: recipe.steps,
                });
              }}
            />
            <h4 className="font-bold">{t("prompt")}</h4>
            <Textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setRecipe({
                  name: name,
                  systemPrompt: prompt,
                  steps: recipe.steps,
                });
              }}
            />
            <div className="sm:flex sm:justify-start">
              <Button
                onClick={save}
                className="w-full space-x-2 sm:w-auto"
                variant="outline"
              >
                <Save size={14} />
                <span>{t("save")}</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">{t("steps")}</h3>
            <EditDialog
              id={+id}
              lng={lng}
              index={recipe?.steps.length}
              recipe={recipe}
              step={{
                name: "",
                systemPrompt: "",
                outputVar: "",
                userPrompt: "",
              }}
              setRecipe={setRecipe}
              isEdit={false}
            />
            <div className="grid gap-4">
              {recipe?.steps.map((step, i) => (
                <Card key={i} className="grid grid-cols-[1fr,auto] gap-2 p-4">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium">{t(step.name)}</h4>
                    <p className="text-sm text-muted-foreground">
                      <HighlightedVariable text={step.userPrompt} />
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                      <Button
                        disabled={i === 0}
                        onClick={() => up(i)}
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowUpIcon className="h-5 w-5" />
                      </Button>

                      <Button
                        disabled={i === recipe?.steps.length - 1}
                        onClick={() => down(i)}
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </Button>
                      <EditDialog
                        id={+id}
                        lng={lng}
                        index={i}
                        recipe={recipe}
                        step={recipe.steps[i]}
                        setRecipe={setRecipe}
                        isEdit
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function EditDialog(props: {
  lng: string;
  index: number;
  step: Step;
  recipe: Recipe;
  setRecipe: Function;
  isEdit: boolean;
  id: number;
}) {
  const { t } = useTranslation(props.lng, "common");

  const [name, setName] = useState(props.step.name);
  const [outputVar, setOutputVar] = useState(props.step.name);
  const [userPrompt, setUserPrompt] = useState(props.step.userPrompt);
  const [systemPrompt, setSystemPrompt] = useState(props.step.systemPrompt);
  const [hide, setHide] = useState(props.step.hide);
  const recipes = getTemplates();

  function applyEdit() {
    if (!props.isEdit) {
      let r = {
        name: props.recipe.name,
        systemPrompt: props.recipe.systemPrompt,
        steps: [
          ...props.recipe.steps,
          {
            name: name,
            outputVar: outputVar,
            userPrompt: userPrompt,
            systemPrompt: systemPrompt,
            hide: hide,
          },
        ],
      };
      props.setRecipe(r);
      recipes[props.id] = r;
      saveTemplates(recipes);
      return;
    }
    let r = {
      name: props.recipe.name,
      systemPrompt: props.recipe.systemPrompt,
      steps: [...props.recipe.steps],
    };
    r.steps[props.index] = {
      name: name,
      outputVar: outputVar,
      userPrompt: userPrompt,
      systemPrompt: systemPrompt,
      hide: hide,
    };
    props.setRecipe(r);
    recipes[props.id] = r;
    saveTemplates(recipes);
  }

  function remove() {
    let steps = [...props.recipe.steps];
    steps.splice(props.index, 1);
    let r = {
      name: props.recipe.name,
      systemPrompt: props.recipe.systemPrompt,
      steps: steps,
    };
    props.setRecipe(r);
    recipes[props.id] = r;
    saveTemplates(recipes);
  }
  return (
    <Dialog>
      <DialogTrigger
        onClick={() => {
          if (props.isEdit) return;
          setName("");
          setOutputVar("");
          setSystemPrompt("");
          setUserPrompt("");
          setHide(undefined);
        }}
      >
        {props.isEdit ? (
          <Button variant="outline">
            <Edit size={14} />
          </Button>
        ) : (
          <Button className="space-x-2" variant="link">
            <Plus />
            <span>{t("new")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("information")}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="my-2">
            <h4 className="font-medium">{t("name")}</h4>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="my-2">
            <h4 className="font-medium">{t("output-var")}</h4>
            <Input
              value={outputVar}
              onChange={(e) => setOutputVar(e.target.value)}
            />
          </div>
          <div className="my-2">
            <h4 className="font-medium">{t("user-prompt")}</h4>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
          </div>
          <div className="my-2">
            <h4 className="font-medium">{t("sys-prompt")}</h4>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
          <div className="my-2 flex items-center space-x-2">
            <Checkbox
              onCheckedChange={(c) => setHide(c === true)}
              checked={hide || false}
              id="hideChk"
            />
            <label htmlFor="hideChk">{t("hide-content")}</label>
          </div>
          <div className="flex justify-center space-x-2">
            <Close>
              <Button
                disabled={!outputVar || !name || !userPrompt}
                onClick={applyEdit}
              >
                {props.isEdit ? t("edit") : t("add")}
              </Button>
            </Close>
            {props.isEdit && (
              <Close>
                <Button
                  onClick={remove}
                  className="text-red-500"
                  variant="link"
                >
                  {t("delete")}
                </Button>
              </Close>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
