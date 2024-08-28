import { getModelString } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ModelSelectorProps {
  avModels: string[];
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
  return (
    <Select onValueChange={(e) => setModel(e)} defaultValue={model}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <Tabs defaultValue="openAI">
          <TabsList>
            <TabsTrigger value="openAI">OpenAI</TabsTrigger>
          </TabsList>
          <TabsContent value="openAI">
            <ScrollArea className="h-[200px]">
              {avModels.map((el, i) => (
                <SelectItem key={i} value={el}>
                  {getModelString(el)}
                </SelectItem>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SelectContent>
    </Select>
  );
}
