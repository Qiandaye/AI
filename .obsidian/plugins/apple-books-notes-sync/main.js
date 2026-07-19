"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AppleBooksNotesSyncPlugin
});
module.exports = __toCommonJS(main_exports);
var import_node_child_process = require("child_process");
var import_promises2 = __toESM(require("fs/promises"));
var import_node_os = __toESM(require("os"));
var import_node_path3 = __toESM(require("path"));
var import_node_url = require("url");
var import_obsidian = require("obsidian");

// src/lib/books-base.ts
var import_node_path = __toESM(require("path"));
var DEFAULT_BOOKS_BASE_FILE_NAME = "Books.base";
var BOOKS_DIR_NAME = "books";
function normalizeVaultRelativePath(input, label = "path") {
  const trimmed = input.replace(/\\/g, "/").trim();
  if (import_node_path.default.posix.isAbsolute(trimmed)) {
    throw new Error(`${label} must stay inside the vault.`);
  }
  const raw = trimmed.replace(/^\/+|\/+$/g, "");
  if (raw.length === 0) {
    throw new Error(`${label} must not be empty.`);
  }
  if (raw.includes("\0")) {
    throw new Error(`${label} must not contain NUL characters.`);
  }
  if (raw.split("/").includes("..")) {
    throw new Error(`${label} must stay inside the vault.`);
  }
  const normalized = import_node_path.default.posix.normalize(raw);
  if (normalized === "." || normalized.startsWith("../") || normalized === "..") {
    throw new Error(`${label} must stay inside the vault.`);
  }
  return normalized;
}
function getBooksFolderRelativePath(managedDirName) {
  return import_node_path.default.posix.join(normalizeVaultRelativePath(managedDirName, "managed folder"), BOOKS_DIR_NAME);
}
function getDefaultBooksBaseRelativePath(managedDirName) {
  return import_node_path.default.posix.join(normalizeVaultRelativePath(managedDirName, "managed folder"), DEFAULT_BOOKS_BASE_FILE_NAME);
}
function renderBooksBase(options) {
  const booksFolder = getBooksFolderRelativePath(options.managedDirName);
  return [
    "filters:",
    "  and:",
    `    - file.folder == ${JSON.stringify(booksFolder)}`,
    "formulas:",
    '  open_file: link(open_url.replace(/^\\[[^\\]]*\\]\\(<(.+)>\\)$/, "$1"), title)',
    "properties:",
    "  note.author:",
    "    displayName: Author",
    "  note.format:",
    "    displayName: Format",
    "  note.publisher:",
    "    displayName: Publisher",
    "  note.open_url:",
    "    displayName: Open file",
    "  formula.open_file:",
    "    displayName: Open file",
    "views:",
    "  - type: cards",
    "    name: Books",
    "    order:",
    "      - file.name",
    "      - author",
    "      - publisher",
    "      - formula.open_file",
    "    sort:",
    "      - property: last_modified_at",
    "        direction: DESC",
    "    image: note.cover",
    "    imageFit: contain",
    "    imageAspectRatio: 1.45",
    ""
  ].join("\n");
}

// src/lib/plugin-settings.ts
var import_promises = __toESM(require("fs/promises"));
var import_node_path2 = __toESM(require("path"));

// src/lib/config.ts
function isPdfRenderBackend(value) {
  return value === "auto" || value === "swift" || value === "mutool" || value === "poppler";
}
function parsePdfRenderBackend(value, fallback = "auto") {
  if (isPdfRenderBackend(value)) {
    return value;
  }
  return fallback;
}
function isPdfPageLinkTarget(value) {
  return value === "default" || value === "edge" || value === "chrome";
}
function parsePdfPageLinkTarget(value, fallback = "edge") {
  if (isPdfPageLinkTarget(value)) {
    return value;
  }
  return fallback;
}

// src/lib/obsidian-protocol.ts
var PLUGIN_ID = "apple-books-notes-sync";
var OBSIDIAN_OPEN_PDF_ACTION = `${PLUGIN_ID}-open-pdf`;

// src/lib/plugin-settings.ts
var DEFAULT_MANAGED_DIR_NAME = "Apple Books Notes";
function getDefaultPluginSettings() {
  return {
    managedDirName: DEFAULT_MANAGED_DIR_NAME,
    syncPdfNotes: true,
    pdfRenderBackend: "auto",
    pdfPageLinkTarget: "edge"
  };
}
function normalizePluginSettings(raw) {
  const defaults = getDefaultPluginSettings();
  const managedDirName = typeof raw?.managedDirName === "string" && raw.managedDirName.trim().length > 0 ? raw.managedDirName : defaults.managedDirName;
  const absyncPath = typeof raw?.absyncPath === "string" && raw.absyncPath.trim().length > 0 ? raw.absyncPath.trim() : void 0;
  return {
    managedDirName,
    syncPdfNotes: raw?.syncPdfNotes ?? raw?.pdfBetaEnabled ?? defaults.syncPdfNotes,
    pdfRenderBackend: parsePdfRenderBackend(raw?.pdfRenderBackend, defaults.pdfRenderBackend),
    pdfPageLinkTarget: parsePdfPageLinkTarget(raw?.pdfPageLinkTarget, defaults.pdfPageLinkTarget),
    ...absyncPath ? { absyncPath } : {}
  };
}
function getPluginDir(vaultDir) {
  return import_node_path2.default.join(vaultDir, ".obsidian", "plugins", PLUGIN_ID);
}

// src/plugin/main.ts
var CliResolutionError = class extends Error {
  constructor(message, failure) {
    super(message);
    this.failure = failure;
    this.name = "CliResolutionError";
  }
};
var AppleBooksNotesSyncPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = getDefaultPluginSettings();
    this.commandRunning = false;
    this.statusBarEl = null;
    this.statusClearTimer = null;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AppleBooksNotesSyncSettingTab(this.app, this));
    this.addRibbonIcon("book-open-check", "Sync Apple Books notes", () => {
      void this.runSyncCommand(false);
    });
    this.registerObsidianProtocolHandler(OBSIDIAN_OPEN_PDF_ACTION, (params) => {
      void this.openPdfFromProtocol(params);
    });
    this.addCommand({
      id: "sync",
      name: "Sync",
      callback: () => {
        void this.runSyncCommand(false);
      }
    });
    this.addCommand({
      id: "preview-sync-plan",
      name: "Plan",
      callback: () => {
        void this.previewPlan();
      }
    });
    this.addCommand({
      id: "doctor",
      name: "Doctor",
      callback: () => {
        void this.runDoctorCommand();
      }
    });
    this.addCommand({
      id: "create-books-base",
      name: "Create Books.base",
      callback: () => {
        void this.createBooksBase();
      }
    });
  }
  async loadSettings() {
    this.settings = normalizePluginSettings(await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async openPdfFromProtocol(params) {
    let pdfPath = typeof params.pdf === "string" ? params.pdf : typeof params.pdfPath === "string" ? params.pdfPath : typeof params.pdfpath === "string" ? params.pdfpath : "";
    if (pdfPath && !await this.pathExists(pdfPath) && pdfPath.includes("+")) {
      const spacePath = pdfPath.replace(/\+/g, " ");
      if (await this.pathExists(spacePath)) {
        pdfPath = spacePath;
      }
    }
    const page = typeof params.page === "string" ? Number.parseInt(params.page, 10) : Number.NaN;
    if (!pdfPath) {
      new import_obsidian.Notice("Apple Books Notes Sync: missing PDF path.", 8e3);
      return;
    }
    if (!import_node_path3.default.isAbsolute(pdfPath) || import_node_path3.default.extname(pdfPath).toLowerCase() !== ".pdf") {
      new import_obsidian.Notice("Apple Books Notes Sync: PDF link points to an invalid file path.", 8e3);
      return;
    }
    if (!await this.pathExists(pdfPath)) {
      new import_obsidian.Notice(`Apple Books Notes Sync: failed to open PDF. The file ${pdfPath} does not exist.`, 12e3);
      return;
    }
    const fileUrl = (0, import_node_url.pathToFileURL)(pdfPath).href;
    const targetUrl = Number.isInteger(page) && page > 0 ? `${fileUrl}#page=${page}` : fileUrl;
    const opener = this.settings.pdfPageLinkTarget;
    try {
      await this.openPdfUrl(targetUrl, opener);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new import_obsidian.Notice(`Apple Books Notes Sync: failed to open PDF. ${message}`, 12e3);
    }
  }
  async openPdfUrl(targetUrl, opener) {
    if (opener === "edge" || opener === "chrome") {
      const appName = opener === "edge" ? "Microsoft Edge" : "Google Chrome";
      const script = `tell application ${JSON.stringify(appName)} to open location ${JSON.stringify(targetUrl)}`;
      const browserResult = await this.runProcess("osascript", ["-e", script], this.getVaultDir(), { timeoutMs: 5e3 });
      if (browserResult.exitCode === 0) {
        return;
      }
      const fallbackResult = await this.runProcess("open", ["-a", appName, targetUrl], this.getVaultDir(), {
        timeoutMs: 5e3
      });
      if (fallbackResult.exitCode === 0) {
        return;
      }
      const detail = browserResult.stderr.trim() || browserResult.stdout.trim() || fallbackResult.stderr.trim() || fallbackResult.stdout.trim() || `exit code ${browserResult.exitCode ?? fallbackResult.exitCode ?? "unknown"}`;
      throw new Error(detail);
    }
    const result = await this.runProcess("open", [targetUrl], this.getVaultDir(), { timeoutMs: 5e3 });
    if (result.exitCode !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.exitCode ?? "unknown"}`;
      throw new Error(detail);
    }
  }
  async pathExists(inputPath) {
    try {
      await import_promises2.default.access(inputPath);
      return true;
    } catch {
      return false;
    }
  }
  getVaultDir() {
    const adapter = this.app.vault.adapter;
    const getBasePath = "getBasePath" in adapter ? adapter.getBasePath : null;
    if (typeof getBasePath === "function") {
      return getBasePath.call(adapter);
    }
    const basePath = "basePath" in adapter ? adapter.basePath : null;
    if (typeof basePath !== "string" || basePath.length === 0) {
      throw new Error("Apple Books Notes Sync requires Obsidian desktop with a local filesystem vault.");
    }
    return basePath;
  }
  getSyncConfig() {
    return {
      vaultDir: this.getVaultDir()
    };
  }
  getBooksBaseRelativePath() {
    return getDefaultBooksBaseRelativePath(this.settings.managedDirName);
  }
  async ensureVaultFolder(folderPath) {
    const normalized = normalizeVaultRelativePath(folderPath, "folder path");
    const parts = normalized.split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (this.app.vault.getAbstractFileByPath(current)) {
        continue;
      }
      await this.app.vault.createFolder(current);
    }
  }
  async createBooksBase() {
    const basePath = this.getBooksBaseRelativePath();
    try {
      normalizeVaultRelativePath(basePath, "base path");
      const existing = this.app.vault.getAbstractFileByPath(basePath);
      if (existing) {
        await this.app.workspace.openLinkText(basePath, "", false);
        new import_obsidian.Notice(`Apple Books Notes Sync: ${basePath} already exists.`, 8e3);
        return;
      }
      const folderPath = import_node_path3.default.posix.dirname(basePath);
      if (folderPath !== ".") {
        await this.ensureVaultFolder(folderPath);
      }
      await this.app.vault.create(basePath, renderBooksBase({ managedDirName: this.settings.managedDirName }));
      await this.app.workspace.openLinkText(basePath, "", false);
      new import_obsidian.Notice(`Apple Books Notes Sync: created ${basePath}.`, 8e3);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new import_obsidian.Notice(`Apple Books Notes Sync: failed to create Books.base. ${message}`, 12e3);
    }
  }
  async previewPlan() {
    await this.runVisibleCommand("absync plan", async () => {
      const { data: plan, cli, stderr } = await this.runAbsyncJson("plan", [
        "plan",
        "--vault",
        this.getSyncConfig().vaultDir,
        "--json"
      ]);
      return {
        status: "success",
        notice: `${plan.summary.changedBooks} changed, ${plan.summary.unchangedBooks} unchanged, ${plan.summary.removedBooks} removed.`,
        details: [this.formatCliExecution(cli, stderr), "", this.formatPlan(plan)].join("\n")
      };
    });
  }
  async runSyncCommand(dryRun) {
    await this.runVisibleCommand(dryRun ? "absync sync --dry-run" : "absync sync", async () => {
      this.updateStatusBar(dryRun ? "ABS dry-run starting..." : "ABS sync starting...");
      const args = ["sync", "--vault", this.getSyncConfig().vaultDir, "--json", "--progress", "jsonl"];
      if (dryRun) {
        args.push("--dry-run");
      }
      const { data: result, cli, stderr } = await this.runAbsyncJson("sync", args, {
        onProgress: (event) => {
          this.handleSyncProgress(event, dryRun);
        }
      });
      return {
        status: result.summary.failedBooks > 0 ? "warning" : "success",
        notice: `${result.summary.successBooks} success, ${result.summary.failedBooks} failed, ${result.summary.generatedFiles} files.`,
        details: [
          this.formatCliExecution(cli, stderr),
          "",
          `Command: ${dryRun ? "absync sync --dry-run" : "absync sync"}`,
          `Output: ${result.outputDir}`,
          "",
          `Summary: total=${result.summary.totalBooks}, success=${result.summary.successBooks}, failed=${result.summary.failedBooks}, skipped=${result.summary.skippedBooks}, files=${result.summary.generatedFiles}`
        ].join("\n")
      };
    }, { reportDialogOnSuccess: false });
  }
  async runDoctorCommand() {
    await this.runVisibleCommand("absync doctor", async () => {
      const { data: report, cli, stderr } = await this.runAbsyncJson("doctor", [
        "doctor",
        "--vault",
        this.getSyncConfig().vaultDir,
        "--json"
      ]);
      const failed = report.checks.filter((check) => !check.ok);
      return {
        status: failed.length === 0 ? "success" : "warning",
        notice: failed.length === 0 ? `passed. Syncable books: ${report.summary.books}.` : `found ${failed.length} issue(s). First: ${failed[0]?.name}: ${failed[0]?.detail}`,
        details: [
          this.formatCliExecution(cli, stderr),
          "",
          "Command: absync doctor",
          "",
          ...report.checks.map((check) => `[${check.ok ? "PASS" : "FAIL"}] ${check.name} - ${check.detail}`),
          "",
          `Summary: syncable=${report.summary.books}, epub=${report.summary.epubBooks}, pdf=${report.summary.pdfBooks}, unsupported=${report.summary.unsupportedBooks}`
        ].join("\n")
      };
    });
  }
  async runAbsyncJson(label, args, options = {}) {
    const cli = await this.resolveAbsyncCli();
    const progressParser = options.onProgress ? this.createProgressParser(options.onProgress) : null;
    const result = await this.runProcess(cli.command, args, this.getVaultDir(), {
      onStderr: (chunk) => {
        progressParser?.(chunk);
      }
    });
    if (result.exitCode !== 0) {
      throw new Error(this.extractCliErrorMessage(result.stderr, result.stdout, label, result.exitCode));
    }
    try {
      return {
        data: JSON.parse(result.stdout),
        cli,
        stderr: result.stderr
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "invalid JSON";
      const wrapped = new Error(`absync ${label} returned invalid JSON: ${message}
${result.stdout.trim()}`);
      wrapped.cause = error;
      throw wrapped;
    }
  }
  formatCliExecution(cli, stderr) {
    const lines = [`CLI: ${cli.command}`, `CLI version: ${cli.version}`];
    const trimmedStderr = stderr.trim();
    if (trimmedStderr.length > 0) {
      lines.push("", "CLI log:", trimmedStderr);
    }
    return lines.join("\n");
  }
  extractCliErrorMessage(stderr, stdout, label, exitCode) {
    const stderrLines = stderr.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    for (const line of [...stderrLines].reverse()) {
      try {
        const event = JSON.parse(line);
        if (event.type === "error" && typeof event.message === "string" && event.message.trim().length > 0) {
          return event.message.trim();
        }
      } catch {
      }
    }
    const lastStderrLine = stderrLines[stderrLines.length - 1];
    if (lastStderrLine) {
      return lastStderrLine;
    }
    const stdoutLines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const lastStdoutLine = stdoutLines[stdoutLines.length - 1];
    if (lastStdoutLine) {
      return lastStdoutLine;
    }
    return `absync ${label} failed with exit code ${exitCode ?? "unknown"}.`;
  }
  createProgressParser(onProgress) {
    let buffer = "";
    return (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }
        try {
          const parsed = JSON.parse(trimmed);
          if (typeof parsed.type === "string") {
            onProgress(parsed);
          }
        } catch {
        }
      }
    };
  }
  handleSyncProgress(event, dryRun) {
    if (event.type === "plan") {
      const action = dryRun ? "dry-run" : "sync";
      this.updateStatusBar(`ABS ${action}: 0/${event.changedBooks} planned`);
      return;
    }
    if (event.type === "book") {
      const title = event.title.length > 36 ? `${event.title.slice(0, 35)}...` : event.title;
      const action = dryRun ? "dry-run" : "sync";
      this.updateStatusBar(`ABS ${action}: ${event.index}/${event.total} ${title}`);
      return;
    }
    if (event.type === "warning") {
      this.updateStatusBar(`ABS warning: ${event.title}`);
      return;
    }
    if (event.type === "complete") {
      this.updateStatusBar(`ABS done: ${event.successBooks} ok, ${event.failedBooks} failed`);
      return;
    }
    if (event.type === "error") {
      this.updateStatusBar("ABS failed");
    }
  }
  updateStatusBar(text) {
    if (this.statusClearTimer) {
      clearTimeout(this.statusClearTimer);
      this.statusClearTimer = null;
    }
    if (!this.statusBarEl) {
      this.statusBarEl = this.addStatusBarItem();
      this.statusBarEl.addClass("apple-books-notes-sync-status");
    }
    this.statusBarEl.setText(text);
  }
  finishStatusBar(text) {
    this.updateStatusBar(text);
    this.statusClearTimer = setTimeout(() => {
      this.statusBarEl?.detach();
      this.statusBarEl = null;
      this.statusClearTimer = null;
    }, 1e4);
  }
  async detectAndSaveAbsyncCli() {
    new import_obsidian.Notice("Apple Books Notes Sync: detecting absync CLI...", 4e3);
    try {
      const cli = await this.detectAbsyncCli();
      this.settings.absyncPath = cli.command;
      await this.saveSettings();
      new import_obsidian.Notice(`Apple Books Notes Sync: absync CLI set to ${cli.command}`, 1e4);
      return true;
    } catch (error) {
      if (error instanceof CliResolutionError) {
        new CliSetupModal(this.app, this.buildCliSetupDetails(error.failure)).open();
        return false;
      }
      const message = error instanceof Error ? error.message : String(error);
      new CommandResultModal(this.app, "Apple Books Notes Sync: absync CLI detection failed", message).open();
      return false;
    }
  }
  async testConfiguredAbsyncCli() {
    try {
      const cli = await this.resolveAbsyncCli();
      new import_obsidian.Notice(`Apple Books Notes Sync: \u2713 absync CLI works (${cli.version}).`, 8e3);
    } catch (error) {
      if (error instanceof CliResolutionError) {
        new CommandResultModal(
          this.app,
          "Apple Books Notes Sync: CLI path test failed",
          [
            "The configured absync CLI path did not work.",
            "",
            "Click Detect in this plugin's settings, or paste the path from Terminal:",
            "  command -v absync",
            ...error.failure.configuredPath ? ["", `Configured path: ${error.failure.configuredPath}`] : []
          ].join("\n")
        ).open();
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      new CommandResultModal(this.app, "Apple Books Notes Sync: CLI path test failed", message).open();
    }
  }
  async resolveAbsyncCli() {
    const configured = this.settings.absyncPath?.trim();
    if (!configured) {
      throw new CliResolutionError("absync CLI path is required.", {
        checked: [],
        configuredPath: null,
        incompatibleError: null
      });
    }
    const command = this.expandHome(configured);
    const resolved = await this.probeCli(command);
    if (resolved) {
      return resolved;
    }
    throw new CliResolutionError(`Configured absync CLI was not usable: ${command}`, {
      checked: [command],
      configuredPath: command,
      incompatibleError: null
    });
  }
  async detectAbsyncCli() {
    const candidates = await this.getCliCandidates();
    let incompatibleCliError = null;
    for (const candidate of candidates) {
      try {
        const resolved = await this.probeCli(candidate);
        if (resolved) {
          return resolved;
        }
      } catch (error) {
        if (!incompatibleCliError && error instanceof Error) {
          incompatibleCliError = error;
        }
      }
    }
    if (incompatibleCliError) {
      throw new CliResolutionError(incompatibleCliError.message, {
        checked: candidates,
        configuredPath: this.settings.absyncPath ? this.expandHome(this.settings.absyncPath) : null,
        incompatibleError: incompatibleCliError.message
      });
    }
    throw new CliResolutionError("absync CLI was not found.", {
      checked: candidates,
      configuredPath: this.settings.absyncPath ? this.expandHome(this.settings.absyncPath) : null,
      incompatibleError: null
    });
  }
  async getCliCandidates() {
    const candidates = [
      "absync",
      "/opt/homebrew/bin/absync",
      "/usr/local/bin/absync",
      import_node_path3.default.join(import_node_os.default.homedir(), ".npm-global", "bin", "absync"),
      import_node_path3.default.join(import_node_os.default.homedir(), ".local", "bin", "absync")
    ];
    candidates.unshift(...await this.resolveCliCandidatesFromShell());
    candidates.push(...await this.resolveCliCandidatesFromNpmPrefix());
    candidates.push(...await this.resolveCliCandidatesFromNvm());
    return [...new Set(candidates)];
  }
  async resolveCliCandidatesFromShell() {
    const result = await this.runProcess(
      "/bin/zsh",
      ["-lc", "command -v absync; npm config get prefix 2>/dev/null"],
      this.getVaultDir(),
      5e3
    );
    if (result.exitCode !== 0) {
      return [];
    }
    const lines = result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    return lines.flatMap((line, index) => {
      if (index === 0 && line.endsWith("/absync")) {
        return [line];
      }
      if (line === "undefined" || line === "null") {
        return [];
      }
      return [import_node_path3.default.join(line, "bin", "absync")];
    });
  }
  async resolveCliCandidatesFromNpmPrefix() {
    const npmCandidates = [
      "/opt/homebrew/bin/npm",
      "/usr/local/bin/npm"
    ];
    const results = [];
    for (const npmCommand of npmCandidates) {
      if (npmCommand.endsWith("node")) {
        continue;
      }
      const result = await this.runProcess(npmCommand, ["config", "get", "prefix"], this.getVaultDir(), 5e3);
      if (result.exitCode !== 0) {
        continue;
      }
      const prefix = result.stdout.trim().split(/\r?\n/)[0];
      if (prefix && prefix !== "undefined" && prefix !== "null") {
        results.push(import_node_path3.default.join(prefix, "bin", "absync"));
      }
    }
    return results;
  }
  async resolveCliCandidatesFromNvm() {
    const versionsDir = import_node_path3.default.join(import_node_os.default.homedir(), ".nvm", "versions", "node");
    try {
      const entries = await import_promises2.default.readdir(versionsDir, { withFileTypes: true });
      return entries.filter((entry) => entry.isDirectory()).map((entry) => import_node_path3.default.join(versionsDir, entry.name, "bin", "absync")).sort().reverse();
    } catch {
      return [];
    }
  }
  async probeCli(command) {
    const result = await this.runProcess(command, ["--version"], this.getVaultDir(), 5e3);
    if (result.exitCode !== 0) {
      return null;
    }
    const version = this.parseVersion(result.stdout);
    if (!version) {
      return null;
    }
    this.assertCompatibleCliVersion(version, command);
    return { command, version };
  }
  parseVersion(output) {
    return output.match(/\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?/)?.[0] ?? null;
  }
  assertCompatibleCliVersion(cliVersion, command) {
    const pluginVersion = this.manifest.version;
    const cli = this.parseSemver(cliVersion);
    const plugin = this.parseSemver(pluginVersion);
    if (!cli || !plugin) {
      return;
    }
    const cliIsOlder = cli.major < plugin.major || cli.major === plugin.major && cli.minor < plugin.minor || cli.major === plugin.major && cli.minor === plugin.minor && cli.patch < plugin.patch;
    const incompatibleMajor = cli.major !== plugin.major;
    const incompatibleZeroMinor = plugin.major === 0 && cli.minor !== plugin.minor;
    if (!cliIsOlder && !incompatibleMajor && !incompatibleZeroMinor) {
      return;
    }
    throw new Error(
      [
        `absync CLI version ${cliVersion} is not compatible with plugin version ${pluginVersion}.`,
        `CLI path: ${command}`,
        "Update the CLI with:",
        "  npm install -g apple-books-notes-sync"
      ].join("\n")
    );
  }
  parseSemver(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) {
      return null;
    }
    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3])
    };
  }
  runProcess(command, args, cwd, optionsOrTimeout = {}) {
    return new Promise((resolve) => {
      const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout } : optionsOrTimeout;
      const env = this.buildProcessEnv(command);
      const child = (0, import_node_child_process.spawn)(command, args, { cwd, env, windowsHide: true });
      let stdout = "";
      let stderr = "";
      let settled = false;
      let timeout = null;
      const finish = (result) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeout) {
          clearTimeout(timeout);
        }
        resolve(result);
      };
      if ((options.timeoutMs ?? 0) > 0) {
        timeout = setTimeout(() => {
          child.kill();
          finish({ exitCode: null, stdout, stderr: `${stderr}
Timed out after ${options.timeoutMs}ms.`.trim() });
        }, options.timeoutMs);
      }
      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on("data", (chunk) => {
        stdout += chunk;
        options.onStdout?.(chunk);
      });
      child.stderr?.on("data", (chunk) => {
        stderr += chunk;
        options.onStderr?.(chunk);
      });
      child.on("error", (error) => {
        finish({ exitCode: null, stdout, stderr: error.message });
      });
      child.on("close", (exitCode) => {
        finish({ exitCode, stdout, stderr });
      });
    });
  }
  buildProcessEnv(command) {
    const commonPaths = [
      ...command && import_node_path3.default.isAbsolute(command) ? [import_node_path3.default.dirname(command)] : [],
      "/opt/homebrew/bin",
      "/usr/local/bin",
      "/usr/bin",
      "/bin",
      "/usr/sbin",
      "/sbin",
      import_node_path3.default.join(import_node_os.default.homedir(), ".npm-global", "bin"),
      import_node_path3.default.join(import_node_os.default.homedir(), ".local", "bin")
    ];
    const pathValue = [process.env.PATH, ...commonPaths].filter(Boolean).join(":");
    return { ...process.env, PATH: pathValue };
  }
  expandHome(input) {
    if (input === "~") {
      return import_node_os.default.homedir();
    }
    if (input.startsWith("~/")) {
      return import_node_path3.default.join(import_node_os.default.homedir(), input.slice(2));
    }
    return input;
  }
  buildCliSetupDetails(failure) {
    return [
      "Apple Books Notes Sync needs the absync command line tool.",
      "",
      "Install or update it from Terminal:",
      "  npm install -g apple-books-notes-sync",
      "",
      "Find the installed path from Terminal:",
      "  command -v absync",
      "",
      "Then either:",
      "  1. Click Detect in this plugin's settings.",
      "  2. Or paste the command output into absync CLI path.",
      "",
      "The absync CLI path setting is required before Plan, Sync, or Doctor can run.",
      "",
      "Common nvm path example:",
      "  ~/.nvm/versions/node/<version>/bin/absync",
      ...failure?.configuredPath ? ["", `Configured path: ${failure.configuredPath}`] : [],
      ...failure?.incompatibleError ? ["", "Version issue:", failure.incompatibleError] : [],
      ...failure?.checked?.length ? ["", "Checked paths:", ...failure.checked.map((item) => `  ${item}`)] : []
    ].join("\n");
  }
  async runVisibleCommand(command, action, options = { reportDialogOnSuccess: true }) {
    if (this.commandRunning) {
      new import_obsidian.Notice("Apple Books Notes Sync: another absync command is still running.", 8e3);
      return;
    }
    this.commandRunning = true;
    new import_obsidian.Notice(`Apple Books Notes Sync: running ${command}...`, 4e3);
    const lines = [`Command: ${command}`, `Started: ${(/* @__PURE__ */ new Date()).toISOString()}`, ""];
    try {
      const result = await action();
      lines.push("", result.details);
      const logPath = await this.safeWriteCommandLog(command, lines.join("\n"));
      const title = `Apple Books Notes Sync: ${command}`;
      const details = `${lines.join("\n")}

Log file: ${logPath}`;
      this.finishStatusBar(`ABS ${result.status === "warning" ? "warning" : "done"}: ${command}`);
      new import_obsidian.Notice(`Apple Books Notes Sync: ${command} ${result.notice}`, result.status === "warning" ? 2e4 : 1e4);
      if (options.reportDialogOnSuccess || result.status === "warning") {
        new CommandResultModal(this.app, title, details).open();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error && error.stack ? error.stack : message;
      lines.push("", "FAILED", stack);
      const logPath = await this.safeWriteCommandLog(command, lines.join("\n"));
      const details = `${message}

Log file: ${logPath}`;
      console.error(`[Apple Books Notes Sync] ${command} failed`, error);
      this.finishStatusBar(`ABS failed: ${command}`);
      new import_obsidian.Notice(`Apple Books Notes Sync: ${message}`, 3e4);
      if (error instanceof CliResolutionError) {
        new CliSetupModal(this.app, `${this.buildCliSetupDetails(error.failure)}

${details}`).open();
      } else {
        new CommandResultModal(this.app, `Apple Books Notes Sync: ${command} failed`, details).open();
      }
    } finally {
      this.commandRunning = false;
    }
  }
  async safeWriteCommandLog(command, content) {
    try {
      return await this.writeCommandLog(command, content);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Apple Books Notes Sync] failed to write ${command} log`, error);
      return `not written (${message})`;
    }
  }
  async writeCommandLog(command, content) {
    const logDir = import_node_path3.default.join(getPluginDir(this.getVaultDir()), "logs");
    await import_promises2.default.mkdir(logDir, { recursive: true });
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const commandName = command.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
    const logPath = import_node_path3.default.join(logDir, `${timestamp}-${commandName}.log`);
    await import_promises2.default.writeFile(logPath, `${content}
`, "utf8");
    return logPath;
  }
  formatPlan(plan) {
    return [
      "Command: absync plan",
      `Output: ${plan.outputDir}`,
      "",
      "Changed:",
      ...this.formatPlanItems(plan.changed),
      "",
      "Removed:",
      ...this.formatPlanItems(plan.removed),
      "",
      "Unchanged:",
      `  ${plan.unchanged.length} books`,
      "",
      `Summary: total=${plan.summary.totalBooks}, changed=${plan.summary.changedBooks}, unchanged=${plan.summary.unchangedBooks}, removed=${plan.summary.removedBooks}`
    ].join("\n");
  }
  formatPlanItems(items) {
    if (items.length === 0) {
      return ["  none"];
    }
    return items.map((item) => {
      const outputPath = item.bookFileRelativePath ? ` -> ${item.bookFileRelativePath}` : "";
      return `  - [${item.format}] ${item.title} (${item.reason})${outputPath}`;
    });
  }
};
var CommandResultModal = class extends import_obsidian.Modal {
  constructor(app, titleText, details) {
    super(app);
    this.titleText = titleText;
    this.details = details;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.titleText });
    const pre = contentEl.createEl("pre");
    pre.setText(this.details);
    pre.style.whiteSpace = "pre-wrap";
    pre.style.maxHeight = "60vh";
    pre.style.overflow = "auto";
    new import_obsidian.Setting(contentEl).addButton((button) => {
      button.setButtonText("Copy details").onClick(() => {
        const clipboard = navigator.clipboard;
        void clipboard?.writeText(this.details);
        new import_obsidian.Notice("Apple Books Notes Sync: command details copied.", 4e3);
      });
    });
  }
};
var CliSetupModal = class extends import_obsidian.Modal {
  constructor(app, details) {
    super(app);
    this.details = details;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Apple Books Notes Sync: CLI setup" });
    const pre = contentEl.createEl("pre");
    pre.setText(this.details);
    pre.style.whiteSpace = "pre-wrap";
    pre.style.maxHeight = "60vh";
    pre.style.overflow = "auto";
    new import_obsidian.Setting(contentEl).addButton((button) => {
      button.setButtonText("Copy install command").onClick(() => {
        const clipboard = navigator.clipboard;
        void clipboard?.writeText("npm install -g apple-books-notes-sync");
        new import_obsidian.Notice("Apple Books Notes Sync: install command copied.", 4e3);
      });
    }).addButton((button) => {
      button.setButtonText("Copy path command").onClick(() => {
        const clipboard = navigator.clipboard;
        void clipboard?.writeText("command -v absync");
        new import_obsidian.Notice("Apple Books Notes Sync: path command copied.", 4e3);
      });
    });
  }
};
var AppleBooksNotesSyncSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Managed folder").setDesc("Folder inside the current vault where generated notes and assets are written.").addText((text) => {
      text.setPlaceholder("Apple Books Notes").setValue(this.plugin.settings.managedDirName).onChange((value) => {
        void (async () => {
          this.plugin.settings.managedDirName = value.trim() || getDefaultPluginSettings().managedDirName;
          await this.plugin.saveSettings();
        })();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Books Base").setDesc("Create the Obsidian Bases view for synced book notes.").addButton((button) => {
      button.setButtonText("Create Books.base").onClick(() => {
        void this.plugin.createBooksBase();
      });
    });
    new import_obsidian.Setting(containerEl).setName("absync CLI path").setDesc("Required full path to absync. Use Detect to find and save it automatically.").addText((text) => {
      text.setPlaceholder("/opt/homebrew/bin/absync").setValue(this.plugin.settings.absyncPath ?? "").onChange((value) => {
        void (async () => {
          const trimmed = value.trim();
          if (trimmed.length > 0) {
            this.plugin.settings.absyncPath = trimmed;
          } else {
            delete this.plugin.settings.absyncPath;
          }
          await this.plugin.saveSettings();
        })();
      });
    }).addButton((button) => {
      button.setButtonText("Detect").onClick(() => {
        void (async () => {
          if (await this.plugin.detectAndSaveAbsyncCli()) {
            this.display();
          }
        })();
      });
    }).addButton((button) => {
      button.setButtonText("Test").onClick(() => {
        void this.plugin.testConfiguredAbsyncCli();
      });
    });
    new import_obsidian.Setting(containerEl).setName("PDF notes").setDesc("Controls whether PDF annotations are synced and which renderer is used for PDF page images.").addDropdown((dropdown) => {
      dropdown.addOptions({
        disabled: "disabled",
        auto: "auto",
        swift: "swift",
        mutool: "MuPDF",
        poppler: "Poppler"
      }).setValue(this.plugin.settings.syncPdfNotes ? this.plugin.settings.pdfRenderBackend : "disabled").onChange((value) => {
        void (async () => {
          if (value === "disabled") {
            this.plugin.settings.syncPdfNotes = false;
            this.plugin.settings.pdfRenderBackend = "auto";
          } else {
            this.plugin.settings.syncPdfNotes = true;
            this.plugin.settings.pdfRenderBackend = value;
          }
          await this.plugin.saveSettings();
        })();
      });
    });
    new import_obsidian.Setting(containerEl).setName("PDF page opener").setDesc("App used when opening a PDF page link from generated notes.").addDropdown((dropdown) => {
      dropdown.addOptions({
        edge: "Microsoft Edge",
        chrome: "Google Chrome",
        default: "Default app"
      }).setValue(this.plugin.settings.pdfPageLinkTarget).onChange((value) => {
        void (async () => {
          this.plugin.settings.pdfPageLinkTarget = value;
          await this.plugin.saveSettings();
        })();
      });
    });
  }
};
//# sourceMappingURL=main.js.map
/* nosourcemap */