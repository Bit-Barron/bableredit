import React, { useState } from "react";
import { MyDialog } from "@/components/elements/my-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguageStore } from "@/store/language-store";

interface LanguageSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectDialog: React.FC<LanguageSelectDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { setLanguages, languages } = useLanguageStore();

  const handleLanguageSelect = (language: string) => {
    const newLanguages = languages.map((lang) => {
      return lang.name;
    });
    setSelectedLanguages([...selectedLanguages, language]);
    setLanguages([...newLanguages, language]);
  };

  return (
    <MyDialog title="Select language" isOpen={isOpen} setIsOpen={onClose}>
      <Input
        placeholder="Search languages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ScrollArea className="h-[300px] mt-4">
        {LANGUAGES.map((language) => (
          <div key={language.name} className="p-1 rounded-lg">
            <Button
              onClick={() => handleLanguageSelect(language.id)}
              variant="outline"
              className="w-full justify-start"
            >
              <span>{language.name}</span>
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="flex items-end justify-end gap-2 mt-5">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Save
        </Button>
      </div>
    </MyDialog>
  );
};
