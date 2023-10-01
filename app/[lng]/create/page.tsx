"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <main>
      <div className="bg-white dark:bg-slate-900 p-2 flex items-center rounded-md space-x-2 shadow-md m-2">
        <Input />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("content-type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">{t("email")}</SelectItem>
            <SelectItem value="blog">{t("blog-post")}</SelectItem>
            <SelectItem value="ideas">{t("ideas")}</SelectItem>
          </SelectContent>
        </Select>
        <Button>{t("create")}</Button>
      </div>
    </main>
  );
}
