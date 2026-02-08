import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Doc, Id } from "../../../../../convex/_generated/dataModel";
import {
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  useFolderContents,
  useRenameFile,
} from "../../hooks/use-file";
import { getItemPadding } from "./constants";
import { CreateInput } from "./create-input";
import { LoadingRow } from "./loading-row";
import { RenameInput } from "./rename-input";
import { TreeItemWrapper } from "./tree-item-wrapper";

export const Tree = ({
  item,
  level = 0,
  projectId,
}: {
  item: Doc<"files">;
  level?: number;
  projectId: Id<"projects">;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreating, setIsCreating] = useState<"file" | "folder" | null>(null);

  const createFile = useCreateFile();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const createFolder = useCreateFolder();

  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: item.type === "folder" && isOpen,
  });

  const handleRename = (newName: string) => {
    setIsRenaming(false);

    if (newName === item.name) return;

    renameFile({ id: item._id, newName });
  };

  const handleCreate = (name: string) => {
    setIsCreating(null);

    if (isCreating === "file") {
      createFile({
        projectId,
        name,
        parentId: item._id,
        content: "",
      });
    } else if (isCreating === "folder") {
      createFolder({
        projectId,
        name,
        parentId: item._id,
      });
    }
  };

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setIsCreating(type);
  };

  if (item.type === "file") {
    const fileName = item.name;

    if (isRenaming) {
      return (
        <RenameInput
          type="file"
          level={level}
          defaultValue={fileName}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }

    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => {}}
        onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => deleteFile({ id: item._id })}
      >
        <FileIcon fileName={fileName} autoAssign className="size-4" />
        <span className="truncate text-sm">{fileName}</span>
      </TreeItemWrapper>
    );
  }

  const folderName = item.name;

  const folderRender = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            isOpen && "rotate-90",
          )}
        />
        <FolderIcon folderName={folderName} className="size-4" />
      </div>
      <span className="truncate text-sm">{folderName}</span>
    </>
  );

  if (isCreating) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="group flex items-center gap-1 h-5.5 hover:bg-accent/30 w-full"
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          {folderRender}
        </button>
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}
            <CreateInput
              type={isCreating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(null)}
            />
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }
  if (isRenaming) {
    return (
      <>
        <RenameInput
          type="folder"
          defaultValue={folderName}
          isOpen={isOpen}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}

            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        onClick={() => setIsOpen((value) => !value)}
        onRename={() => setIsRenaming(true)}
        onDelete={() => deleteFile({ id: item._id })}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
      >
        {folderRender}
      </TreeItemWrapper>
      {isOpen && (
        <>
          {folderContents === undefined && <LoadingRow level={level + 1} />}
          {folderContents?.map((subItem) => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};
