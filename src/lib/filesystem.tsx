// FileSystem.ts
import { Node, DirNode } from "./filesystem_types";
import React, { ReactNode } from 'react';
import TerminalMarkdownRenderer from "@/components/blog/blog_terminal";

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

async cat(fileName: string): Promise<string | ReactNode | null> {
    const file = this.getCurrentDir().children[fileName];
    if (!file) return null;

    if (file.type === "file") {
        return file.content;
    } else if (file.type === "blogFile") {
        // If already cached, use it
        if (file.cachedContent) {
            return <TerminalMarkdownRenderer markdown={file.cachedContent} />;
        }

        // Otherwise fetch & cache
        try {
            const res = await fetch(`/api/blog/${encodeURIComponent(fileName.replace('.md', ''))}`, {
                headers: {
                    'Accept': 'text/plain',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.text();
            file.cachedContent = data;
            // Return the component after a successful fetch
            return <TerminalMarkdownRenderer markdown={file.cachedContent} />;
        } catch (error) {
            console.error('Error fetching blog post:', error);
            const errorMessage = (error as Error).message || 'An unknown error occurred';
            file.cachedContent = `# 404 - Article not found\n${errorMessage}`;
            // Return a string with the error message
            return file.cachedContent;
        }
        } else if(file.type == 'projectFile'){

            const mdData = await fetch(
                `https://raw.githubusercontent.com/HarryFoster1812/${fileName.replace('.md', '')}/main/README.md`
            );
            if (mdData.ok) {
                const mdText = await mdData.text();
                file.cachedContent = mdText;
                return mdText;
            } else{
               return "Error";
            }
        }
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
