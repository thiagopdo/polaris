"use client";

import { SparklesIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCreateProject } from "@/features/projects/hooks/use-projects";
import { cn } from "@/lib/utils";
import { ImportGithubDialog } from "./import-github-dialog";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { ProjectsList } from "./projects-list";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
  const createProject = useCreateProject();

  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "k") {
          event.preventDefault();
          setOpenCommandDialog(true);
        }
        if (event.key === "i") {
          event.preventDefault();
          setImportDialogOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={openCommandDialog}
        onOpenChange={setOpenCommandDialog}
      />
      <ImportGithubDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
          <div className="flex justify-between gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full group/logo">
              <Image
                src="/logo.svg"
                alt="Polaris"
                width={42}
                height={42}
              ></Image>
              <h1
                className={cn(
                  "text-4xl md:text-5xl font-semibold",
                  font.className,
                )}
              >
                Polaris
              </h1>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, animals],
                    style: "lowerCase",
                    separator: "-",
                    length: 3,
                  });
                  createProject({ name: projectName });
                }}
                size="lg"
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <SparklesIcon className="size-4" />
                  <Kbd className="bg-accent border">⌘+J</Kbd>
                </div>
                <div>
                  <span className="text-sm">New</span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FaGithub className="size-4" />
                  <Kbd className="bg-accent border">⌘+I</Kbd>
                </div>
                <div>
                  <span className="text-sm">Import</span>
                </div>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setOpenCommandDialog(true)} />
          </div>
        </div>
      </div>
    </>
  );
};
