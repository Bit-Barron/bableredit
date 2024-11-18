import React, { useState } from "react";
import { MyDialog } from "@/components/elements/my-dialog";
import FileUpload from "@/components/elements/translation-file-upload";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageDisplay } from "@/components/pages/create-project/language-display";
import { LanguageSelectDialog } from "@/components/pages/create-project/language-select-dialog";

export const CreateProject: React.FC<CreateProjectProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [primaryLang, setPrimaryLang] = useState<string>("English");
  const [languages, setLanguages] = useState<Language[]>([
    { code: "en", name: "English" },
  ]);

  const handleAddLanguage = (language: Language) => {
    setLanguages((prev) => [...prev, language]);
    setPrimaryLang(language.name);
  };

  const handleCreateProject = () => {
    console.log("Creating project with languages:", languages);
  };

  return (
    <MyDialog
      title="Configure languages"
      description="Add or remove languages and their corresponding translations"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="space-y-4">
        <FileUpload
          maxSize={0}
          acceptedTypes={[]}
          onUpload={function (): void {
            throw new Error("Function not implemented.");
          }}
        />

        <div className="flex justify-between">
          <Button onClick={() => setIsLanguageOpen(true)} variant="outline">
            Add Language
          </Button>
          <Button onClick={handleCreateProject} variant="default">
            Save changes
          </Button>
        </div>

        <Separator />

        <LanguageDisplay primaryLang={primaryLang} />

        <LanguageSelectDialog
          isOpen={isLanguageOpen}
          onClose={() => setIsLanguageOpen(false)}
          onSelect={handleAddLanguage}
        />
      </div>
    </MyDialog>
  );
};
