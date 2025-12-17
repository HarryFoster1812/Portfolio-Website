// FileSystem.ts
import { Node, DirNode } from "./filesystem_types";
import React, { ReactNode } from 'react';
import TerminalMarkdownRenderer from "@/components/blog/markdown_terminal";
import PrebuiltMarkdownRenderer from "@/components/blog/prebuilt_markdown"

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
        const argComponents = dirName.split('/').filter(arg => arg != '');
        const tempCurrentPath = [...this.currentPath];
        for(const arg of argComponents){

            if (arg === ".") {
                continue; // Ignore current directory
            }

            const dir = this.getCurrentDir().children[arg];
            if (arg === "..") {
                if (this.currentPath.length > 1) {
                    this.currentPath.pop();
                } else{
                    this.currentPath = tempCurrentPath;
                    return false;
                }
            }
            else if (dir && dir.type === "dir") {
                this.currentPath.push(arg);
            } else{
                this.currentPath = tempCurrentPath;
                return false;
            }
        }

        return true;
    }

    async cat(fileName: string): Promise<string | ReactNode | null> {
        const file = this.getCurrentDir().children[fileName]
        if (!file) return null

        /* ---------- Plain files ---------- */
        if (file.type === "file") {
            return file.content
        }

        /* ---------- Blog files ---------- */
        if (file.type === "blogFile") {
            if (file.cachedContent) {
                return file.cachedContent
            }

            const slug = fileName.replace("\.md", "");

            /* Try prebuilt first */
            try {
                const mod = await import(`@/generated/posts/${slug}`)

                file.cachedContent = (
                    <PrebuiltMarkdownRenderer
                        html={mod.html}
                        meta={mod.meta}
                        mode="terminal"
                    />
                )

                return file.cachedContent
            } catch {
                return "404: Blog post not found"
            }
        }

        /* ---------- Project files ---------- */
        if (file.type === "projectFile") {
            const res = await fetch(
                `https://raw.githubusercontent.com/HarryFoster1812/${fileName.replace(".md", "")}/main/README.md`
            )

            if (!res.ok) return "Error loading README"

            const md = await res.text()
            file.cachedContent = <TerminalMarkdownRenderer markdown={md} />
            return file.cachedContent
        }

        return null
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
