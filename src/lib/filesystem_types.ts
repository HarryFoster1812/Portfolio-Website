import { ReactNode } from 'react';

export type FileNode =
  | {
      type: "file";
      content: string;
    }
  | {
      type: "blogFile" | "projectFile";
      cachedContent?: string | ReactNode; // optional cached value
    };

export type DirNode = {
  type: "dir";
  children: Record<string, FileNode | DirNode>;
};

export type Node = FileNode | DirNode;
