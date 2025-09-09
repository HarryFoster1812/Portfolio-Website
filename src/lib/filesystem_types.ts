export type FileNode =
  | {
      type: "file";
      content: string;
    }
  | {
      type: "blogFile";
      cachedContent?: string; // optional cached value
    };

export type DirNode = {
  type: "dir";
  children: Record<string, FileNode | DirNode>;
};

export type Node = FileNode | DirNode;
