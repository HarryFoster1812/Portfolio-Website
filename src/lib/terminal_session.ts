import { FileSystem } from "@/lib/filesystem";
import { DirNode } from "@/lib/filesystem_types";

export type HistoryEntry = {
  command: string;
  response: string;
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
  execute(input: string): void {
    if (!input.trim()) return;

    const oldPath = this.fs.getCurrentPath(); // snapshot before command
    const parts = input.trim().split(" ");
    const cmd = parts[0];
    const arg = parts.slice(1).join(" ");

    let response = "";

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
          const content = this.fs.cat(arg);
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
        response = `'${cmd}' is not recognized as a command`;
    }

    this.history.push({ command: input, response, dir: oldPath });
  }

  getCurrentPath(): string[] {
    return this.fs.getCurrentPath();
  }
}
