export type FileNode = {
  type: "file";
  content: string;
};

export type DirNode = {
  type: "dir";
  children: Record<string, FileNode | DirNode>;
};

export type Node = FileNode | DirNode;
