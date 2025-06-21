"use client";

import { getModelString, ModelList } from "@/lib/models";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "@/app/i18n/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ProviderIcon } from "./icons";
import { Plans } from "@/utils/helpers";

interface ModelSelectorProps {
  avModels: ModelList;
  setModel: Function;
  model: string;
  placeholder: string;
  lng: string;
  plan: Plans;
}

interface Provider {
  name: string;
  models: string[];
}

const slideVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 250 : -250,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 250 : -250,
      opacity: 0,
    };
  },
};

export default function ModelSelector({
  plan,
  setModel,
  model,
  placeholder,
  lng,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    "OpenAI",
  );
  const [selectedModel, setSelectedModel] = useState<string | null>(model);
  const [direction, setDirection] = useState(0);

  const providers: Provider[] = [
    {
      name: "OpenAI",
      models:
        plan !== "free"
          ? [
              "gpt-3.5-turbo",
              "gpt-4o-mini",
              "gpt-4o",
              "gpt-4.1-mini",
              "gpt-4.1-nano",
              "o1-mini",
            ]
          : ["gpt-3.5-turbo", "gpt-4o-mini"],
    },
    {
      name: "Mistral",
      models: [
        "mistral-large-latest",
        "mistral-medium",
        "mistral-small",
        "mistral-saba-latest",
        "codestral-latest",
        "codestral-mamba-latest",
      ],
    },
    {
      name: "Anthropic",
      models:
        plan === "pro" || plan === "premium"
          ? [
              "claude-3-5-haiku-20241022",
              "claude-3-opus-20240229",
              "claude-3-5-sonnet-20240620",
            ]
          : ["claude-3-5-haiku-20241022"],
    },
  ];

  const handleProviderSelect = (provider: string) => {
    setDirection(1);
    setSelectedProvider(provider);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setModel(model);
    setOpen(false);
  };

  const resetSelection = () => {
    setDirection(-1);
    setSelectedProvider(null);
  };

  const currentProvider = providers.find((p) => p.name === selectedProvider);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {(selectedModel && getModelString(selectedModel)) || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full p-0 sm:w-[220px]">
        <Command>
          <CommandList className="h-[200px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="relative h-full">
              <AnimatePresence initial={false} custom={direction}>
                {selectedProvider ? (
                  <motion.div
                    key="provider-models"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute top-0 left-0 h-full w-full"
                  >
                    <ProviderModels
                      provider={currentProvider!}
                      onSelect={handleModelSelect}
                      onBack={resetSelection}
                      lng={lng}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="provider-list"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute top-0 left-0 h-full w-full"
                  >
                    <ProviderList
                      providers={providers}
                      onSelect={handleProviderSelect}
                      lng={lng}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ProviderList({
  providers,
  onSelect,
  lng,
}: {
  providers: Provider[];
  onSelect: (provider: string) => void;
  lng: string;
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <CommandGroup heading={t("ai-providers")}>
      {providers.map((provider) => (
        <CommandItem
          key={provider.name}
          onSelect={() => onSelect(provider.name)}
        >
          <ProviderIcon provider={provider.name} />
          <span>{provider.name}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function ProviderModels({
  provider,
  onSelect,
  onBack,
  lng,
}: {
  provider: Provider;
  onSelect: (model: string) => void;
  onBack: () => void;
  lng: string;
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <>
      <Button
        variant="ghost"
        size={"sm"}
        onClick={onBack}
        className="text-muted-foreground -mb-2 flex items-center text-sm"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span>{t("back")}</span>
      </Button>
      <CommandGroup heading={provider.name}>
        {provider.models.map((model) => (
          <CommandItem key={model} onSelect={() => onSelect(model)}>
            {getModelString(model)}
          </CommandItem>
        ))}
      </CommandGroup>
    </>
  );
}
