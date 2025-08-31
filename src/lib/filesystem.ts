// FileSystem.ts
import { Node, DirNode } from "./filesystem_types";

export class FileSystem {
  private root: DirNode;
  private currentPath: string[];

  constructor(root: DirNode) {
    this.root = root;
    this.currentPath = ["~"];
  }

  // Helper: get node at a path
  private getNode(path: string[]): Node | undefined {
    let node: Node = this.root;
    for (const part of path.slice(1)) {
      if (node.type !== "dir") return undefined;
      node = node.children[part];
      if (!node) return undefined;
    }
    return node;
  }

  // Get current directory
  private getCurrentDir(): DirNode {
    const node = this.getNode(this.currentPath);
    if (!node || node.type !== "dir") throw new Error("Invalid directory");
    return node;
  }

  // Commands

  ls(): string[] {
    return Object.keys(this.getCurrentDir().children);
  }

  cd(dirName: string): boolean {
    if (dirName === "..") {
      if (this.currentPath.length > 1) {
        this.currentPath.pop();
        return true;
      }
      return false;
    }

    const dir = this.getCurrentDir().children[dirName];
    if (dir && dir.type === "dir") {
      this.currentPath.push(dirName);
      return true;
    }
    return false;
  }

  cat(fileName: string): string | null {
    const file = this.getCurrentDir().children[fileName];
    if (file && file.type === "file") return file.content;
    return null;
  }

  pwd(): string {
    return this.currentPath.join("/");
  }

  getCurrentPath(): string[] {
    return [...this.currentPath]; // return a copy
  }

  // Optional: add file dynamically
  addFile(path: string[], name: string, content: string) {
    const node = this.getNode(path);
    if (!node || node.type !== "dir") throw new Error("Invalid path");
    node.children[name] = { type: "file", content };
  }
}
