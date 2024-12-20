import { writeTextFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import { toast } from "@/shared/hooks/use-toast";
import { TRANSLATION_API_URL } from "@/shared/utils/constants";
import { FileContent, TreeNode } from "@/shared/types/translation-editor.types";
import { createYmlObject } from "@/shared/utils/helpers/yml-helper";
import YAML from "js-yaml";

interface FetchTranslationsProps {
  nodeLanguages: [string, string][];
  targetLanguages: { id: string; name: string }[];
}

export class TranslationEditorService {
  static async saveProject(
    processedFiles: FileContent[],
    nodeTranslation: any
  ): Promise<void> {
    try {
      const savePath = await save({
        filters: [
          {
            name: "Translation Project",
            extensions: ["yaml"],
          },
        ],
        defaultPath: "translation.yaml",
      });

      !savePath &&
        toast({
          title: "Save Cancelled",
          description: "No file was saved.",
          variant: "default",
        });

      const ymlObject = createYmlObject(savePath as string, processedFiles);

      const yamlContent = YAML.dump(ymlObject, {
        indent: 2,
        skipInvalid: true,
      });
      await writeTextFile(savePath as string, yamlContent, nodeTranslation);

      toast({
        title: "Project Saved",
        description: `Successfully saved translation project to ${savePath}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error Saving Project",
        description: `An error occurred while saving the project: ${error}`,
        variant: "destructive",
      });
    }
  }

  static async openProject(): Promise<void> {
    try {
      const openPath = await save({
        filters: [
          {
            name: "Translation Project",
            extensions: ["yaml"],
          },
        ],
        defaultPath: "translation.yaml",
      });

      if (!openPath) {
        toast({
          title: "Open Cancelled",
          description: "No file was opened.",
          variant: "default",
        });
        return;
      }

      toast({
        title: "Project Opened",
        description: `Successfully opened translation project from ${openPath}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error Opening Project",
        description: `An error occurred while opening the project: ${error}`,
        variant: "destructive",
      });
    }
  }

  static async fetchTranslations({
    nodeLanguages,
    targetLanguages,
  }: FetchTranslationsProps): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};

    for (const [sourceLang, content] of nodeLanguages) {
      const baseLang = sourceLang.split("-")[0];
      for (const targetLanguage of targetLanguages) {
        try {
          const response = await fetch(
            `${TRANSLATION_API_URL}/get?q=${encodeURIComponent(
              content
            )}&langpair=${baseLang}|${targetLanguage.name}`
          );
          const responseData = await response.json();
          translations[targetLanguage.name] =
            responseData.responseData.translatedText;
        } catch (error) {
          toast({
            type: "background",
            variant: "destructive",
            description: `Failed to fetch translations: ${error}`,
          });
        }
      }
    }

    return translations;
  }

  static getTranslations(
    value: string,
    processedFiles: { name: string }[]
  ): Record<string, string> {
    const translations: Record<string, string> = {};

    processedFiles.forEach((file) => {
      const locale = file.name.replace(".json", "");
      translations[locale] = value;
    });

    return translations;
  }

  static processObject(
    obj: Record<string, any>,
    processedFiles: { name: string }[]
  ): TreeNode[] {
    if (!obj || typeof obj !== "object") return [];

    return Object.entries(obj).map(([key, value]) => ({
      label: key,
      type: typeof value === "object" ? "folder" : "translation",
      children: TranslationEditorService.processObject(value, processedFiles),
      content: TranslationEditorService.getTranslations(
        value as string,
        processedFiles
      ),
    }));
  }
}
