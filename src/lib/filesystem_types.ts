export type FileNode =
  | {
      type: "file";
      content: string;
    }
  | {
      type: "lazyFile";
      fetchContent: () => Promise<string>;
      cachedContent?: string; // optional cached value
    };

export type DirNode = {
  type: "dir";
  children: Record<string, FileNode | DirNode>;
};

export type Node = FileNode | DirNode;
