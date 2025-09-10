import { FileSystem } from "@/lib/filesystem";
import { DirNode } from "@/lib/filesystem_types";
import { ReactNode } from "react";

export type HistoryEntry = {
  command: string;
  response: ReactNode;
  dir: string[];
};

export class TerminalSession {
  private fs: FileSystem;
  private history: HistoryEntry[] = [];

  constructor(rootFS: DirNode) {
    this.fs = new FileSystem(rootFS);
  }

  // Get full history
  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  // Execute a command and update history
async execute(input: string): Promise<void> {
  if (!input.trim()) return;

  const oldPath = this.fs.getCurrentPath(); // snapshot before command
  const parts = input.trim().split(" ");
  const cmd = parts[0];
  const arg = parts.slice(1).join(" ");

  let response: string | ReactNode = "";

  switch (cmd) {
    case "help":
      response = "Commands: help, ls, cd <dir>, cat <file>, pwd, clear";
      break;
    case "ls":
      response = this.fs.ls().join("  ");
      break;
    case "cd":
      if (!arg) {
        response = "Specify a directory";
      } else if (!this.fs.cd(arg)) {
        response = `Directory '${arg}' not found`;
      }
      break;
    case "cat":
      if (!arg) {
        response = "Specify a file";
      } else {
        const content = await this.fs.cat(arg); // <--- await here
        response = content ?? `'${arg}' not found`;
      }
      break;
    case "pwd":
      response = this.fs.pwd();
      break;
    case "clear":
      this.history = [];
      return;
    default:
      response = `'${cmd}' is not recognised as a command`;
  }

  this.history.push({ command: input, response, dir: oldPath });
}

  getCurrentPath(): string[] {
    return this.fs.getCurrentPath();
  }
}
