import { getModelString, ModelList } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

interface ModelSelectorProps {
  avModels: ModelList;
  setModel: Function;
  model: string;
  placeholder: string;
}

export default function ModelSelector({
  avModels,
  setModel,
  model,
  placeholder,
}: ModelSelectorProps) {
  const [tab, setTab] = useState("openAI");
  return (
    <Select onValueChange={(e) => setModel(e)} defaultValue={model}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <Tabs defaultValue={tab}>
          <TabsList>
            <TabsTrigger onClick={() => setTab("openAI")} value="openAI">
              OpenAI
            </TabsTrigger>
            <TabsTrigger onClick={() => setTab("mistral")} value="mistral">
              Mistral
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[200px]">
            {tab === "openAI" &&
              avModels.openAiModels
                .filter((m) => m.startsWith("gpt"))
                .map((el, i) => (
                  <SelectItem key={i} value={el}>
                    {getModelString(el)}
                  </SelectItem>
                ))}
            {tab === "mistral" &&
              avModels.mistralModels.map((el, i) => (
                <SelectItem key={i} value={el}>
                  {getModelString(el)}
                </SelectItem>
              ))}
            <TabsContent value="mistral"></TabsContent>
          </ScrollArea>
        </Tabs>
      </SelectContent>
    </Select>
  );
}
