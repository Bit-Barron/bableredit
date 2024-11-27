import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyDialog } from "@/components/elements/my-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageDisplay } from "@/components/pages/create-project/create-project-language-list";
import { LanguageSelectDialog } from "@/components/pages/create-project/create-project-language-select";
import { useFileUploadStore } from "@/store/file-upload-store";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/pages/create-project/create-project-file-upload";
import { useLanguageStore } from "@/store/language-store";

interface CreateProjectProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateProject: React.FC<CreateProjectProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { toast } = useToast();
  const { languages } = useLanguageStore();
  const navigate = useNavigate();
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const { selectedFiles } = useFileUploadStore();
  const PRIMARY_LANG = "english";

  const handleCreateProject = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload files to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileContents = await Promise.all(
        selectedFiles.map(async (file: { text: () => any; name: any }) => {
          const text = await file.text();
          return {
            name: file.name,
            content: JSON.parse(text),
          };
        })
      );

      setIsOpen(false);
      navigate("/translation-editor", {
        state: {
          files: fileContents,
          languages: languages,
        },
      });
      toast({
        title: "Project created",
        description: "You can now start translating your files",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error reading files",
        description: "Please make sure your files are valid JSON",
        variant: "destructive",
      });
    }
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
          onUpload={function (): void {}}
        />

        <div className="flex justify-between">
          <Button onClick={() => setIsLanguageOpen(true)} variant="outline">
            Add Language
          </Button>
          <Button
            onClick={handleCreateProject}
            variant="default"
            disabled={selectedFiles.length === 0}
          >
            {selectedFiles.length === 0
              ? "Upload files to continue"
              : "Save changes"}
          </Button>
        </div>
        <div>
          {languages.map((language) => (
            <div key={language}>{language}</div>
          ))}
        </div>

        <Separator />
        <LanguageDisplay primaryLang={PRIMARY_LANG} />
        <LanguageSelectDialog
          isOpen={isLanguageOpen}
          onClose={() => setIsLanguageOpen(false)}
        />
      </div>
    </MyDialog>
  );
};
