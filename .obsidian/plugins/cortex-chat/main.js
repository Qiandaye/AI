const {
  ItemView,
  Menu,
  MarkdownView,
  MarkdownRenderer,
  Modal,
  Notice,
  Platform,
  Plugin,
  PluginSettingTab,
  SecretComponent,
  Setting,
  setIcon,
  requestUrl
} = require("obsidian");
// BEGIN CORTEX CHAT BUNDLED LIBS
const __cortexChatModules = Object.create(null);
const __cortexChatModuleCache = Object.create(null);

function __cortexChatDefine(id, factory) {
  __cortexChatModules[id] = factory;
}

function __cortexChatRequire(id) {
  if (!__cortexChatModules[id]) {
    return require(id);
  }
  if (!__cortexChatModuleCache[id]) {
    const module = { exports: {} };
    __cortexChatModuleCache[id] = module;
    __cortexChatModules[id](module, module.exports, __cortexChatRequire);
  }
  return __cortexChatModuleCache[id].exports;
}

__cortexChatDefine('./lib/i18n', function(module, exports, require) {
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];

const PROMPTS = {
  en: {
    role:
      "Act as an assistant embedded in a personal Obsidian vault. Your job is to help think, organize, write, and execute tasks using the vault context.",
    context:
      "Answer in the user's language. Prioritize explicit context: active note, @ references, outgoing links, shared memory, and recent sessions. Do not invent note content that was not provided.",
    behavior:
      "If critical context is missing, say so and ask for the minimum needed. Distinguish observed facts, inferences, and recommendations. Prefer actionable, concise, useful answers.",
    safety:
      "Protect sensitive data and avoid persisting secrets. If an action may modify important content or delete information, explain the risk and require clear intent before acting.",
    output:
      "Give clear answers with light structure when helpful. Reference notes, paths, or sections when useful. Avoid filler and do not expose hidden reasoning; summarize only the necessary reasons.",
    memory:
      "Use memory as auxiliary context, not as absolute truth. If you detect preferences, decisions, or project state, integrate them carefully and avoid duplicating obsolete information."
  },
  es: {
    role:
      "Actúa como un asistente integrado en una bóveda personal de Obsidian. Tu trabajo es ayudar a pensar, organizar, escribir y ejecutar tareas usando el contexto de la bóveda.",
    context:
      "Responde en el idioma del usuario. Usa primero el contexto explícito: nota activa, referencias @, enlaces salientes, memoria compartida y sesiones recientes. No inventes contenido de notas que no se hayan proporcionado.",
    behavior:
      "Si falta contexto crítico, dilo y pide lo mínimo necesario. Distingue hechos observados, inferencias y recomendaciones. Prioriza respuestas accionables, breves y útiles.",
    safety:
      "Protege datos sensibles y evita persistir secretos. Si una acción puede modificar contenido importante o borrar información, explica el riesgo y exige una intención clara antes de actuar.",
    output:
      "Da respuestas claras, con estructura ligera cuando ayude. Referencia notas, rutas o secciones cuando proceda. Evita relleno y no muestres razonamiento oculto; resume solo las razones necesarias.",
    memory:
      "Usa la memoria como contexto auxiliar, no como fuente absoluta. Si detectas preferencias, decisiones o estado de proyectos, intégralo con cuidado y evita duplicar información obsoleta."
  }
};

const I18N = {
  en: {
    languageEnglish: "English",
    languageSpanish: "Spanish",
    languageAuto: "Automatic",
    appTitle: "Cortex",
    emptyGreeting: "Hey there",
    contextDetails: "Context details",
    selectPreset: "Select preset",
    selectVaultFolder: "Select vault folder",
    folderContextAdded: "Folder context added: {folder}",
    folderContextCleared: "Folder context removed.",
    noVaultFolders: "No vault folders available.",
    droppedContextAdded: "Context added: {path}",
    dropContextHint: "Drop vault notes, PDFs, files, or folders here to add them as context.",
    unsupportedDrop: "Could not resolve the dropped item inside this vault.",
    close: "Close",
    folderSearchLimited: "Showing {visible} of {total} folders. Type to narrow the list.",
    resetSystemPrompt: "Restore prompt for current language",
    openChat: "Open Cortex Chat",
    newTab: "New tab",
    closeTab: "Close tab",
    tabLimitReached: "Maximum {count} tabs allowed.",
    untitledTab: "New chat",
    askCurrentNote: "Ask about current note",
    insertLastResponse: "Insert response into note",
    viewMemoryUsed: "View memory used for last response",
    configureCodex: "Configure Codex OAuth",
    consistencyDiagnostics: "Consistency diagnostics",
    connectionSecurity: "Connection and security",
    basicSettings: "Basic",
    advancedSettings: "Advanced",
    backendUrl: "Backend URL",
    backendUrlDesc: "Central backend address. If it fails and the backend is local, the plugin can use direct local mode.",
    deviceState: "Device state",
    deviceStateDesc: "Device: {state} · ID: {id}",
    registered: "registered",
    pending: "pending",
    generatedAutomatically: "(will be generated automatically)",
    repairLocalConfig: "Repair local configuration",
    registerNow: "Register now",
    deviceId: "Device ID",
    deviceIdDesc: "Stable local identifier generated automatically. It is not synced through Obsidian Sync.",
    allowRemoteBackend: "Allow remote backend",
    allowRemoteBackendDesc: "Keep disabled unless you use a remote HTTPS backend under your control.",
    response: "Response",
    defaultWorkMode: "Default work mode",
    defaultWorkModeDesc:
      "Planner acts as a copilot and does not modify content on its own. Execute works without additional prompts and requires backups before touching files.",
    planner: "Planner",
    execute: "Execute",
    readMode: "Read Mode",
    writeMode: "Write Mode",
    toggleWorkMode: "Toggle work mode",
    copilot: "Copilot",
    unrestricted: "Unrestricted",
    skills: "Skills",
    skillsTitle: "Codex Skills",
    skillsDesc: "Vault skills are Markdown instructions stored under _cortex/skills. Cortex injects enabled skills as context; it does not execute scripts.",
    skillsEnabled: "Enable vault skills",
    skillsRoot: "Skills folder",
    skillsRootDesc: "Vault folder that contains skill folders with SKILL.md files.",
    enabledSkills: "Enabled skills",
    enabledSkillsDesc: "Comma-separated skill IDs to inject into the prompt.",
    maxSkillContextChars: "Maximum skill context characters",
    maxSkillContextCharsDesc: "Total character budget for enabled SKILL.md files.",
    noSkillsFound: "No skills found in {root}.",
    skillContextSummary: "{enabled} active of {total} skills",
    missingEnabledSkills: "Enabled skills not found: {ids}",
    mcpTitle: "MCP experiment",
    mcpDesc: "Experimental MCP planning settings. Tool execution is disabled until a permission model is implemented.",
    mcpEnabled: "Enable MCP experiment",
    mcpServers: "MCP servers",
    mcpServersDesc: "Experimental JSON array for future MCP servers. Cortex stores it but does not execute MCP tools yet.",
    mcpReadOnlyToolsOnly: "Read-only MCP tools only",
    showDiagnostics: "Show diagnostics in panel",
    showDiagnosticsDesc: "Shows backend, device, and current context in the chat header.",
    folderRoots: "Folder reference roots",
    folderRootsDesc: "Comma-separated vault folders that the assistant may load when the user asks to review a folder.",
    maxFolderReferences: "Maximum folder files",
    maxFolderReferencesDesc: "Maximum files added as context when a vault folder is selected.",
    maxFolderContextChars: "Folder context character budget",
    maxFolderContextCharsDesc: "Total extracted characters allowed for selected folder context. Files beyond the budget are kept as metadata.",
    systemPrompt: "System Prompt",
    systemPromptDesc: "These sections are composed in fixed order and shared between devices through data.json.",
    promptRole: "Role",
    promptRoleDesc: "Base identity and scope of the assistant inside the vault.",
    promptContext: "Context",
    promptContextDesc: "How active note, references, memory, and sessions should be prioritized.",
    promptBehavior: "Behavior",
    promptBehaviorDesc: "Response criteria, operating tone, and initiative level.",
    promptSafety: "Safety",
    promptSafetyDesc: "Limits for sensitive data, risky actions, or persistence.",
    promptOutput: "Output",
    promptOutputDesc: "Expected response format and style.",
    promptMemory: "Memory",
    promptMemoryDesc: "How to use shared memory without over-trusting it.",
    pluginScale: "Plugin scale",
    visualScale: "Visual scale",
    visualScaleDesc: "Panel-specific scale. You can also use Ctrl/Cmd +, Ctrl/Cmd - and Ctrl/Cmd 0 inside the chat.",
    uiDensity: "UI density",
    uiDensityDesc: "Controls how compact the Cortex shell feels without changing the overall scale.",
    densityCompact: "Compact",
    densityComfortable: "Comfortable",
    tabBarPosition: "Tab bar position",
    tabBarPositionDesc: "Places tabs in the header by default or above the workbench as a fallback.",
    tabBarHeader: "Header",
    tabBarComposer: "Workbench",
    contextRetrieval: "Context and retrieval",
    contextManifest: "Context manifest",
    contextManifestDesc: "Shows and persists the exact sources used by each assistant response.",
    includeActiveNote: "Active note",
    includeActiveNoteDesc: "Allow the active note preview to be sent as context.",
    includeLinks: "Outgoing links",
    includeLinksDesc: "Allow notes linked from the active note to be included as context.",
    includeMentions: "@ references",
    includeMentionsDesc: "Allow explicit @note and @pdf references from the message.",
    includeFolders: "Folder context",
    includeFoldersDesc: "Allow configured folders to be loaded when the request asks for folder-level review.",
    includePinned: "Pinned snippets",
    includePinnedDesc: "Allow previous assistant answers pinned from message actions to travel as explicit context.",
    includeMemory: "Shared memory",
    includeMemoryDesc: "Allow local Cortex memory files to be injected into Codex prompts.",
    includeRecentSessions: "Recent sessions",
    includeRecentSessionsDesc: "Allow recent exchanges in this thread to be injected into Codex prompts.",
    includeRag: "Local related notes",
    includeRagDesc: "Suggest and include a small local related-note set before sending. Disabled by default.",
    ragIndexEnabled: "Local RAG index",
    ragIndexEnabledDesc: "Store a lightweight keyword index in `_cortex/index` for faster related-note retrieval.",
    ragIndexMaxNotes: "Indexed note limit",
    ragIndexMaxNotesDesc: "Maximum Markdown notes maintained in the local RAG index.",
    rebuildRagIndex: "Rebuild local index",
    ragIndexStatus: "RAG index: {status}",
    ragIndexReady: "{count} notes indexed · {time}",
    ragIndexNotBuilt: "not built yet",
    ragIndexBuilding: "Building local RAG index...",
    ragIndexBuilt: "Local RAG index rebuilt.",
    ragIndexFailed: "Could not rebuild RAG index: {error}",
    ragCandidateLimit: "Related-note limit",
    ragCandidateLimitDesc: "Maximum local notes added by the lightweight vault search pass.",
    contextExclusions: "Context exclusions",
    contextExclusionsDesc: "Comma-separated path fragments or glob-ish patterns that must never enter context.",
    safetySettings: "Safety",
    approvedEditsOnly: "Approve edits before applying",
    approvedEditsOnlyDesc: "Preview assistant insertions and create a backup before writing into a note.",
    promptProfile: "Prompt profile",
    promptProfileDesc: "Adds a compact operating preset on top of your editable system prompt.",
    profileResearcher: "Researcher",
    profileEditor: "Editor",
    profilePlanner: "Planner",
    profileSafeExecutor: "Safe executor",
    reset100: "Reset 100%",
    advancedLocal: "Advanced local",
    localBootstrapToken: "Local bootstrap token",
    localBootstrapTokenDesc: "Advanced diagnostic. It is autogenerated if SecretStorage is unavailable. It is not synced.",
    localBackendBootstrapScript: "Local backend bootstrap script",
    localBackendBootstrapScriptDesc:
      "Local script that may start the backend only after explicit local consent. It is not synced.",
    allowLocalBootstrapScript: "Allow local bootstrap script",
    allowLocalBootstrapScriptDesc: "Disabled by default. Enable only if you trust the configured local script.",
    trustCodexVault: "Allow Codex vault trust",
    trustCodexVaultDesc: "Disabled by default. Enable to let the plugin add this vault to Codex trusted projects.",
    localCodexCommand: "Local Codex command",
    localCodexCommandDesc: "Local Codex command. Use `codex` for the official CLI installed with npm.",
    openAssistant: "Open assistant",
    check: "Check",
    tokenSecret: "Token secret",
    tokenSecretDesc: "Local SecretStorage name that stores the device token. It is not synced.",
    maxContextChars: "Max context chars",
    maxContextCharsDesc: "Maximum active-note characters sent to the assistant on each request.",
    language: "Language",
    languageDesc: "Automatic uses Obsidian/browser language when available. Supported languages: English and Spanish.",
    askPlaceholder: "Ask Cortex...",
    inputHint: "Enter sends · Shift+Enter new line · @note · #folder",
    sendMessage: "Send message",
    ready: "Ready",
    setup: "Setup",
    error: "Error",
    context: "Context",
    activeContext: "Active context",
    contextPending: "Pending context",
    contextToSend: "Context that will be sent",
    contextLoaded: "Context loaded: {path}",
    noMarkdownOpen: "No open Markdown note found.",
    newChatReady: "New chat ready.",
    hide: "Hide",
    details: "Details",
    hideContextDetails: "Hide context details",
    viewContextDetails: "View context details",
    activeNote: "Active note",
    links: "Links",
    references: "References",
    noNote: "no note",
    noRefs: "0 references",
    referenceCount: "{count} references",
    chatEmpty: "The conversation will appear here. The chat prioritizes the active note and its references.",
    you: "You",
    responseCopied: "Response copied.",
    insertResponse: "Insert this response",
    copyResponse: "Copy this response",
    useAsContext: "Use as context",
    preparingResponse: "Preparing response",
    openEditableNote: "Open an editable note before inserting the response.",
    responseInserted: "Response inserted into the note.",
    writeMessageFirst: "Write a message before sending.",
    sendingToAgent: "Sending message to the assistant",
    preparingContext: "Preparing context",
    codexThinking: "Cortex is thinking",
    codexPreparingResponse: "Cortex is preparing the response",
    processSending: "Sending the chat to Cortex",
    processPreparingContext: "Preparing vault context",
    processAnalyzingContent: "Cortex is analyzing the content",
    processPreparingResponse: "Cortex is preparing the response",
    unrestrictedActive: "Unrestricted mode active: changes will not ask for additional confirmation.",
    history: "History",
    recentChats: "Recent chats",
    noRecentChats: "No recent chats yet.",
    openConversation: "Open conversation",
    activeTabLabel: "Active",
    contextWorkbench: "Context workbench",
    manifestUsed: "Context used",
    manifestDetails: "View context manifest",
    manifestNone: "No context manifest is available for this response.",
    manifestSummary: "{count} source(s): {sources}",
    manifestActiveNote: "Active note",
    manifestLinks: "Links",
    manifestMentions: "Mentions",
    manifestFolders: "Folders",
    folderFilesSummary: "{folder} · {count} files · {chars} chars",
    folderContextBudgetReached: "Folder context budget reached; preview omitted.",
    unsupportedFileContext: "File selected as context. Text extraction is not available for .{extension} files.",
    folderContextTruncated: "Folder context truncated",
    manifestMemory: "Memory",
    manifestSessions: "Sessions",
    manifestSkills: "Skills",
    manifestRag: "Related",
    manifestPinned: "Pinned",
    sourceDisabled: "off",
    sourceEnabled: "on",
    ragCandidates: "Related candidates",
    pinnedContext: "Pinned context",
    pinnedContextAdded: "Response pinned as context.",
    pinnedContextRemoved: "Context source removed.",
    removeContextSource: "Remove context source",
    remove: "Remove",
    noPinnedContext: "No pinned snippets yet.",
    reviewInsertTitle: "Review note insertion",
    reviewInsertDesc: "Cortex will create a backup and log the approved change before applying this insertion.",
    targetNote: "Target note",
    preview: "Preview",
    diffPreview: "Diff preview",
    linesAdded: "{count} line(s) added",
    linesRemoved: "{count} line(s) removed",
    apply: "Apply",
    cancel: "Cancel",
    editRejected: "Insertion cancelled.",
    backupCreated: "Backup created: {path}",
    changeLogged: "Approved change logged: {path}",
    commandExpanded: "Command expanded: {command}",
    unresolvedReferences: "Could not resolve these @ references: {refs}",
    requestFailed: "Could not complete the request: {error}",
    memoryUsed: "Memory used",
    noMemoryContext: "No memory context is available for this response.",
    memoryFiles: "Memory files",
    recentSessions: "Recent sessions",
    noConsistencyIssues: "No consistency issues detected.",
    diagnosticsUnavailable: "Local diagnostics are not available in this environment.",
    issuesDetected: "{count} issue(s) detected.",
    openSettingsSelectPlugin: "Open Obsidian settings and select Cortex Chat.",
    localBackendReset: "Non-portable local paths were reset on this device.",
    codexLocalProvider: "Codex local",
    codexOauthProvider: "Codex OAuth",
    backendProvider: "Backend",
    serverProvider: "Server",
    serverFallbackProvider: "Server fallback",
    localFallbackProvider: "Local fallback",
    fast: "Fast",
    thinking: "Thinking",
    noLastResponseCopy: "There is no response to copy yet.",
    noLastResponseInsert: "There is no response to insert yet.",
    noLastResponseMemory: "There is no response with memory context yet.",
    memoryLoadFailed: "Could not load memory used: {error}",
    setupMobileTitle: "Remote backend setup",
    setupDesktopTitle: "Prepare Cortex",
    setupDesktopDesc:
      "Cortex prepares the local Codex connection, opens login when needed, and keeps technical details hidden unless you need them.",
    setupPrepare: "Prepare Cortex",
    setupInstall: "1. Install/update Codex",
    setupDiagnose: "Diagnose Codex",
    setupLogin: "2. Start OAuth",
    setupTest: "3. Test Codex",
    setupRegister: "Register device",
    setupRefresh: "Refresh status",
    setupRepairFlatpak: "Copy Flatpak repair command",
    setupToggleDiagnostics: "Show/hide full diagnostics",
    setupClearLog: "Clear log",
    setupPlatform: "System: {platform}",
    setupHumanPlatform: "Detected system: {platform}",
    setupChecks: "Setup checks",
    setupLog: "Setup log",
    setupLogEmpty: "No setup actions yet.",
    setupNode: "Node.js",
    setupNpm: "npm",
    setupNpmOptionalDetail: "Only needed to install/update",
    setupStrategy: "Strategy: {strategy}",
    setupDiagnostics: "Diagnostics: {summary}",
    setupRuntime: "Runtime: {runtime}",
    setupHostPermission: "Host permission: {status}",
    setupFlatpakRepair: "Flatpak repair: {command}",
    setupFlatpakNeedsRepair: "Obsidian Flatpak needs host permission before Cortex can run Codex.",
    setupFlatpakBlocked: "Blocked",
    setupFlatpakAllowed: "Allowed",
    setupFlatpakRepairCopied: "Flatpak repair command copied.",
    setupCli: "Codex CLI",
    setupOauth: "OAuth",
    setupExecution: "Execution test",
    setupDevice: "Device registration",
    setupBackend: "Backend",
    setupOk: "OK",
    setupPending: "Pending",
    setupFailed: "Failed",
    setupOptional: "Optional",
    setupManualCommand: "Manual command: {command}",
    backendStatus: "Backend: {url}",
    status: "Status: {status}",
    version: "Version: {version}",
    lastCheck: "Last check: {time}",
    localOnlyDesktop: "Local Codex CLI is only available on desktop.",
    remoteHttpsRequiredMobile: "Remote HTTPS backend is required on mobile/iOS.",
    remoteHttpsRequired: "Configure a remote HTTPS backend and allow remote backends.",
    mobileUnavailable: "Mobile mode is not available: {error}",
    remoteBackendReady: "Remote backend available.",
    remoteBackendNotReady: "Remote backend is not ready.",
    codexReady: "Codex is ready.",
    codexNotReady: "Codex is not ready. Use install/update.",
    codexInstalledNoOauth: "Codex CLI is installed, but OAuth is missing.",
    codexFound: "Codex CLI found.",
    codexLoginDetected: "Codex OAuth detected.",
    codexLoginPending: "Codex OAuth pending.",
    setupLoginOpenedStatus: "Login opened. Finish it in the external window, then return and refresh status.",
    oauthCheckFailed: "Could not check Codex OAuth.",
    installingCodex: "Installing or updating Codex CLI. This may take a few minutes.",
    codexInstalled: "Codex CLI installed or updated.",
    codexInstallFailed: "Could not install Codex CLI from Obsidian.",
    oauthLaunched: "Codex OAuth launched in an external window.",
    testingCodex: "Testing Codex with a minimal request.",
    codexOauthOk: "Codex OAuth works correctly.",
    codexExecutionFailed: "Codex still cannot execute correctly.",
    deviceRegistered: "Local device registered.",
    deviceRegisterFailed: "Could not register local device. Start the backend and try again.",
    backupFailed: "Could not create the note backup: {error}",
    sensitiveContextRedacted: "Sensitive data was redacted before persisting or sending context: {types}",
    folderReview: "Cortex is reviewing folder {folder}",
    configuredFolderToken: "folder",
    lastNoteHelp: "Last note seen: {note}. Use @NoteName or quick actions to pin context.",
    dataJsonHasLocalKey: "`{path}` still contains `{key}`, which should be local and not synced.",
    duplicateSessionsDetected: "{count} logically duplicated session(s) found from Sync conflicts in `_cortex/sessions`.",
    memoryFileMissingSchema: "`_cortex/memory/{category}.md` is missing a schema version and will be treated as degraded.",
    memoryFileNonCanonical: "`_cortex/memory/{category}.md` contains {count} non-canonical entries that will be ignored when shared memory is used.",
    indexEmpty: "`_cortex/index` is empty or not being used yet.",
    indexUnreadable: "`_cortex/index` does not exist or cannot be read.",
    outboxStale: "`_cortex/outbox` keeps {count} temporary file(s) older than 24h.",
    workModeExecutePrompt:
      "Active work mode: Execute / Unrestricted.\nYou may act without asking for additional confirmation, but before editing or deleting any file or note you must create a backup of the affected file.\n{backupInstruction}\nIf the backup cannot be created first, do not modify or delete the file and explain the block.",
    workModeExecuteBackupPath: "Store those copies in: {backupRoot}, preserving the file path relative to the vault.",
    workModeExecuteBackupGeneric: "Store those copies in a session backup folder, preserving the file path relative to the vault.",
    workModePlannerPrompt:
      "Active work mode: Planner / Copilot.\nDo not modify, delete, rename, or rewrite vault files unless the user asks for it clearly and explicitly.",
    noCodexNoContext:
      "I could not use local Codex and there is not enough content to answer well.\n\nNext steps:\n- open a note with relevant context\n- use an @ reference to add a note",
    localBackupModeNote: "Note: this response uses local backup mode, not the full Codex flow.",
    relevantContextFound: "I found this relevant context:",
    referenceDocument: "Reference document: {doc}.",
    localDeviceRegisteredStatus: "Local device registered.",
    localDevicePendingStatus: "Local configuration pending: {error}",
    noDeviceToken: "Local configuration pending: no device token is available.",
    codexNoJson: "Codex did not return JSON.",
    codexNoOk: "Codex did not return OK.",
    codexNoOutput: "Codex did not return output.",
    localFallbackDesktopOnly: "Local Codex CLI fallback is only available on desktop.",
    vaultPathUnavailable: "Could not resolve the local vault path for local mode.",
    backupFilePathUnavailable: "Could not resolve the file path to create the backup.",
    backupVaultPathUnavailable: "Could not resolve the local vault path to create the backup."
    ,
    localCodexUnavailableDetail:
      "{classification} The backend is not accessible and local mode could not use Codex. Detail: {detail}"
  },
  es: {
    languageEnglish: "Inglés",
    languageSpanish: "Español",
    languageAuto: "Automático",
    appTitle: "Cortex",
    emptyGreeting: "Hola",
    contextDetails: "Detalles de contexto",
    selectPreset: "Seleccionar preset",
    selectVaultFolder: "Seleccionar carpeta de la vault",
    folderContextAdded: "Contexto de carpeta añadido: {folder}",
    folderContextCleared: "Contexto de carpeta eliminado.",
    noVaultFolders: "No hay carpetas disponibles en la vault.",
    droppedContextAdded: "Contexto añadido: {path}",
    dropContextHint: "Suelta notas, PDFs, archivos o carpetas de la vault para añadirlos como contexto.",
    unsupportedDrop: "No he podido resolver el elemento arrastrado dentro de esta vault.",
    close: "Cerrar",
    folderSearchLimited: "Mostrando {visible} de {total} carpetas. Escribe para afinar la lista.",
    resetSystemPrompt: "Restaurar prompt del idioma actual",
    openChat: "Abrir Cortex Chat",
    newTab: "Nueva pestaña",
    closeTab: "Cerrar pestaña",
    tabLimitReached: "Máximo {count} pestañas permitidas.",
    untitledTab: "Chat nuevo",
    askCurrentNote: "Preguntar sobre nota actual",
    insertLastResponse: "Insertar respuesta en la nota",
    viewMemoryUsed: "Ver memoria usada para la última respuesta",
    configureCodex: "Configurar Codex OAuth",
    consistencyDiagnostics: "Diagnóstico de consistencia",
    connectionSecurity: "Conexión y seguridad",
    basicSettings: "Básico",
    advancedSettings: "Avanzado",
    backendUrl: "Backend URL",
    backendUrlDesc: "Dirección del backend central. Si falla y el backend es local, el plugin puede usar modo local directo.",
    deviceState: "Estado de dispositivo",
    deviceStateDesc: "Dispositivo: {state} · ID: {id}",
    registered: "registrado",
    pending: "pendiente",
    generatedAutomatically: "(se generará automáticamente)",
    repairLocalConfig: "Reparar configuración local",
    registerNow: "Registrar ahora",
    deviceId: "Device ID",
    deviceIdDesc: "Identificador estable local generado automáticamente. No se sincroniza por Obsidian Sync.",
    allowRemoteBackend: "Permitir backend remoto",
    allowRemoteBackendDesc: "Déjalo desactivado salvo que uses un backend remoto HTTPS bajo tu control.",
    response: "Respuesta",
    defaultWorkMode: "Modo de trabajo por defecto",
    defaultWorkModeDesc:
      "Planificador actúa como copiloto sin modificar nada por su cuenta. Ejecutar trabaja sin pedir permisos adicionales y exige backups previos si toca archivos.",
    planner: "Planificador",
    execute: "Ejecutar",
    readMode: "Modo Lectura",
    writeMode: "Modo Escritura",
    toggleWorkMode: "Cambiar modo de trabajo",
    copilot: "Copiloto",
    unrestricted: "Sin restricciones",
    skills: "Skills",
    skillsTitle: "Skills de Codex",
    skillsDesc: "Las skills de la vault son instrucciones Markdown guardadas en _cortex/skills. Cortex inyecta las skills activas como contexto; no ejecuta scripts.",
    skillsEnabled: "Activar skills de vault",
    skillsRoot: "Carpeta de skills",
    skillsRootDesc: "Carpeta de la vault que contiene carpetas de skill con archivos SKILL.md.",
    enabledSkills: "Skills activas",
    enabledSkillsDesc: "IDs de skills separados por comas que se inyectarán en el prompt.",
    maxSkillContextChars: "Caracteres máximos de contexto de skills",
    maxSkillContextCharsDesc: "Presupuesto total de caracteres para los archivos SKILL.md activos.",
    noSkillsFound: "No se han encontrado skills en {root}.",
    skillContextSummary: "{enabled} activas de {total} skills",
    missingEnabledSkills: "Skills activas no encontradas: {ids}",
    mcpTitle: "Experimento MCP",
    mcpDesc: "Ajustes experimentales de planificación MCP. La ejecución de herramientas queda desactivada hasta implementar un modelo de permisos.",
    mcpEnabled: "Activar experimento MCP",
    mcpServers: "Servidores MCP",
    mcpServersDesc: "Array JSON experimental para futuros servidores MCP. Cortex lo guarda, pero todavía no ejecuta herramientas MCP.",
    mcpReadOnlyToolsOnly: "Solo herramientas MCP de lectura",
    showDiagnostics: "Mostrar diagnóstico en el panel",
    showDiagnosticsDesc: "Muestra backend, dispositivo y contexto actual en la cabecera del chat.",
    folderRoots: "Raíces de carpetas referenciables",
    folderRootsDesc: "Carpetas de la vault, separadas por comas, que el asistente puede cargar cuando pidas revisar una carpeta.",
    maxFolderReferences: "Archivos máximos por carpeta",
    maxFolderReferencesDesc: "Máximo de archivos añadidos como contexto cuando se selecciona una carpeta de la vault.",
    maxFolderContextChars: "Presupuesto de caracteres de carpeta",
    maxFolderContextCharsDesc: "Caracteres extraídos totales permitidos para el contexto de carpeta. Los archivos fuera del límite se mantienen como metadatos.",
    systemPrompt: "System Prompt",
    systemPromptDesc: "Estas secciones se combinan en orden fijo y se comparten entre equipos mediante data.json.",
    promptRole: "Rol",
    promptRoleDesc: "Identidad base y ámbito del asistente dentro de la vault.",
    promptContext: "Contexto",
    promptContextDesc: "Cómo debe priorizar nota activa, referencias, memoria y sesiones.",
    promptBehavior: "Comportamiento",
    promptBehaviorDesc: "Criterios de respuesta, tono operativo y nivel de iniciativa.",
    promptSafety: "Seguridad",
    promptSafetyDesc: "Límites al tratar datos sensibles, acciones riesgosas o persistencia.",
    promptOutput: "Salida",
    promptOutputDesc: "Formato y estilo esperados en las respuestas.",
    promptMemory: "Memoria",
    promptMemoryDesc: "Cómo usar la memoria compartida sin sobreconfiar en ella.",
    pluginScale: "Escala del plugin",
    visualScale: "Escala visual",
    visualScaleDesc: "Escala propia del panel. También puedes usar Ctrl/Cmd +, Ctrl/Cmd - y Ctrl/Cmd 0 dentro del chat.",
    uiDensity: "Densidad de interfaz",
    uiDensityDesc: "Controla lo compacta que se siente la shell de Cortex sin cambiar la escala general.",
    densityCompact: "Compacta",
    densityComfortable: "Cómoda",
    tabBarPosition: "Posición de pestañas",
    tabBarPositionDesc: "Coloca las pestañas en la cabecera por defecto o sobre el área de trabajo como alternativa.",
    tabBarHeader: "Cabecera",
    tabBarComposer: "Área de trabajo",
    contextRetrieval: "Contexto y recuperación",
    contextManifest: "Manifiesto de contexto",
    contextManifestDesc: "Muestra y persiste las fuentes exactas usadas por cada respuesta del asistente.",
    includeActiveNote: "Nota activa",
    includeActiveNoteDesc: "Permite enviar la vista previa de la nota activa como contexto.",
    includeLinks: "Enlaces salientes",
    includeLinksDesc: "Permite incluir como contexto las notas enlazadas desde la nota activa.",
    includeMentions: "Referencias @",
    includeMentionsDesc: "Permite referencias explícitas @nota y @pdf desde el mensaje.",
    includeFolders: "Contexto de carpeta",
    includeFoldersDesc: "Permite cargar carpetas configuradas cuando la petición pide revisar una carpeta.",
    includePinned: "Fragmentos fijados",
    includePinnedDesc: "Permite enviar como contexto explícito respuestas anteriores fijadas desde acciones de mensaje.",
    includeMemory: "Memoria compartida",
    includeMemoryDesc: "Permite inyectar archivos de memoria local de Cortex en prompts de Codex.",
    includeRecentSessions: "Sesiones recientes",
    includeRecentSessionsDesc: "Permite inyectar intercambios recientes de este hilo en prompts de Codex.",
    includeRag: "Notas relacionadas locales",
    includeRagDesc: "Sugiere e incluye un conjunto pequeño de notas relacionadas antes de enviar. Desactivado por defecto.",
    ragIndexEnabled: "Índice RAG local",
    ragIndexEnabledDesc: "Guarda un índice ligero de palabras clave en `_cortex/index` para recuperar notas relacionadas más rápido.",
    ragIndexMaxNotes: "Límite de notas indexadas",
    ragIndexMaxNotesDesc: "Máximo de notas Markdown mantenidas en el índice RAG local.",
    rebuildRagIndex: "Reconstruir índice local",
    ragIndexStatus: "Índice RAG: {status}",
    ragIndexReady: "{count} notas indexadas · {time}",
    ragIndexNotBuilt: "sin construir aún",
    ragIndexBuilding: "Construyendo índice RAG local...",
    ragIndexBuilt: "Índice RAG local reconstruido.",
    ragIndexFailed: "No se pudo reconstruir el índice RAG: {error}",
    ragCandidateLimit: "Límite de notas relacionadas",
    ragCandidateLimitDesc: "Máximo de notas locales añadidas por la búsqueda ligera en la vault.",
    contextExclusions: "Exclusiones de contexto",
    contextExclusionsDesc: "Fragmentos de ruta o patrones simples, separados por comas, que nunca deben entrar al contexto.",
    safetySettings: "Seguridad",
    approvedEditsOnly: "Aprobar cambios antes de aplicar",
    approvedEditsOnlyDesc: "Previsualiza inserciones del asistente y crea backup antes de escribir en una nota.",
    promptProfile: "Perfil de prompt",
    promptProfileDesc: "Añade un preset operativo compacto sobre tu system prompt editable.",
    profileResearcher: "Investigador",
    profileEditor: "Editor",
    profilePlanner: "Planner",
    profileSafeExecutor: "Executor seguro",
    reset100: "Reset 100%",
    advancedLocal: "Avanzado local",
    localBootstrapToken: "Local bootstrap token",
    localBootstrapTokenDesc: "Diagnóstico avanzado. Se autogenera si SecretStorage no está disponible. No se sincroniza.",
    localBackendBootstrapScript: "Local backend bootstrap script",
    localBackendBootstrapScriptDesc:
      "Script local que puede arrancar el backend solo tras consentimiento local explícito. No se sincroniza.",
    allowLocalBootstrapScript: "Permitir script local de arranque",
    allowLocalBootstrapScriptDesc: "Desactivado por defecto. Actívalo solo si confías en el script local configurado.",
    trustCodexVault: "Permitir confianza de vault en Codex",
    trustCodexVaultDesc: "Desactivado por defecto. Permite que el plugin añada esta vault a los proyectos de confianza de Codex.",
    localCodexCommand: "Comando local de Codex",
    localCodexCommandDesc: "Comando local de Codex. Usa `codex` para el CLI oficial instalado por npm.",
    openAssistant: "Abrir asistente",
    check: "Comprobar",
    tokenSecret: "Token secret",
    tokenSecretDesc: "Nombre local del secreto en SecretStorage que contiene el token del dispositivo. No se sincroniza.",
    maxContextChars: "Max context chars",
    maxContextCharsDesc: "Número máximo de caracteres de la nota activa que se enviarán al asistente en cada consulta.",
    language: "Idioma",
    languageDesc: "Automático usa el idioma de Obsidian/navegador cuando está disponible. Idiomas soportados: inglés y español.",
    askPlaceholder: "Pregunta a Cortex...",
    inputHint: "Enter envía · Shift+Enter línea · @nota · #carpeta",
    sendMessage: "Enviar mensaje",
    ready: "Listo",
    setup: "Configurar",
    error: "Error",
    context: "Contexto",
    activeContext: "Contexto activo",
    contextPending: "Contexto pendiente",
    contextToSend: "Contexto que se enviará",
    contextLoaded: "Contexto cargado: {path}",
    noMarkdownOpen: "No he encontrado una nota Markdown abierta.",
    newChatReady: "Chat nuevo preparado.",
    hide: "Ocultar",
    details: "Detalles",
    hideContextDetails: "Ocultar detalles de contexto",
    viewContextDetails: "Ver detalles de contexto",
    activeNote: "Nota",
    links: "Enlaces",
    references: "Referencias",
    noNote: "sin nota",
    noRefs: "0 referencias",
    referenceCount: "{count} referencias",
    chatEmpty: "La conversación aparecerá aquí. El chat prioriza el contexto de la nota activa y sus referencias.",
    you: "Tú",
    responseCopied: "Respuesta copiada.",
    insertResponse: "Insertar esta respuesta",
    copyResponse: "Copiar esta respuesta",
    useAsContext: "Usar como contexto",
    preparingResponse: "Preparando respuesta",
    openEditableNote: "Abre una nota editable antes de insertar la respuesta.",
    responseInserted: "Respuesta insertada en la nota.",
    writeMessageFirst: "Escribe un mensaje antes de enviar.",
    sendingToAgent: "Enviando mensaje al asistente",
    preparingContext: "Preparando contexto",
    codexThinking: "Cortex está pensando",
    codexPreparingResponse: "Cortex está preparando la respuesta",
    processSending: "Enviando el chat a Cortex",
    processPreparingContext: "Preparando el contexto de la bóveda",
    processAnalyzingContent: "Cortex está analizando el contenido",
    processPreparingResponse: "Cortex está preparando la respuesta",
    unrestrictedActive: "Sin restricciones activo: si hay cambios, se ejecutarán sin pedir confirmación adicional.",
    history: "Historial",
    recentChats: "Chats recientes",
    noRecentChats: "Todavía no hay chats recientes.",
    openConversation: "Abrir conversación",
    activeTabLabel: "Activa",
    contextWorkbench: "Mesa de contexto",
    manifestUsed: "Contexto usado",
    manifestDetails: "Ver manifiesto de contexto",
    manifestNone: "No hay manifiesto de contexto para esta respuesta.",
    manifestSummary: "{count} fuente(s): {sources}",
    manifestActiveNote: "Nota activa",
    manifestLinks: "Enlaces",
    manifestMentions: "Menciones",
    manifestFolders: "Carpetas",
    folderFilesSummary: "{folder} · {count} archivos · {chars} caracteres",
    folderContextBudgetReached: "Presupuesto de contexto de carpeta agotado; preview omitida.",
    unsupportedFileContext: "Archivo seleccionado como contexto. La extracción de texto no está disponible para archivos .{extension}.",
    folderContextTruncated: "Contexto de carpeta truncado",
    manifestMemory: "Memoria",
    manifestSessions: "Sesiones",
    manifestSkills: "Skills",
    manifestRag: "Relacionadas",
    manifestPinned: "Fijados",
    sourceDisabled: "off",
    sourceEnabled: "on",
    ragCandidates: "Candidatas relacionadas",
    pinnedContext: "Contexto fijado",
    pinnedContextAdded: "Respuesta fijada como contexto.",
    pinnedContextRemoved: "Fuente de contexto eliminada.",
    removeContextSource: "Quitar fuente de contexto",
    remove: "Quitar",
    noPinnedContext: "Todavía no hay fragmentos fijados.",
    reviewInsertTitle: "Revisar inserción en nota",
    reviewInsertDesc: "Cortex creará una copia de seguridad y registrará el cambio aprobado antes de aplicar esta inserción.",
    targetNote: "Nota destino",
    preview: "Vista previa",
    diffPreview: "Vista diff",
    linesAdded: "{count} línea(s) añadida(s)",
    linesRemoved: "{count} línea(s) eliminada(s)",
    apply: "Aplicar",
    cancel: "Cancelar",
    editRejected: "Inserción cancelada.",
    backupCreated: "Backup creado: {path}",
    changeLogged: "Cambio aprobado registrado: {path}",
    commandExpanded: "Comando expandido: {command}",
    unresolvedReferences: "No he podido resolver estas referencias @: {refs}",
    requestFailed: "No se pudo completar la petición: {error}",
    memoryUsed: "Memoria usada",
    noMemoryContext: "No hay contexto de memoria disponible para esta respuesta.",
    memoryFiles: "Archivos de memoria",
    recentSessions: "Sesiones recientes",
    noConsistencyIssues: "No se han detectado incidencias de consistencia.",
    diagnosticsUnavailable: "Diagnóstico local no disponible en este entorno.",
    issuesDetected: "Se han detectado {count} incidencias.",
    openSettingsSelectPlugin: "Abre los ajustes de Obsidian y selecciona Cortex Chat.",
    localBackendReset: "Se han reseteado rutas locales no portables al cargar este equipo.",
    codexLocalProvider: "Codex local",
    codexOauthProvider: "Codex OAuth",
    backendProvider: "Backend",
    serverProvider: "Servidor",
    serverFallbackProvider: "Respaldo servidor",
    localFallbackProvider: "Respaldo local",
    fast: "Rápido",
    thinking: "Pensar",
    noLastResponseCopy: "Todavía no hay una respuesta para copiar.",
    noLastResponseInsert: "Todavía no hay una respuesta para insertar.",
    noLastResponseMemory: "Todavía no hay una respuesta con contexto de memoria.",
    memoryLoadFailed: "No se pudo cargar la memoria usada: {error}",
    setupMobileTitle: "Configurar backend remoto",
    setupDesktopTitle: "Preparar Cortex",
    setupDesktopDesc:
      "Cortex prepara la conexión local con Codex, abre el inicio de sesión cuando hace falta y oculta el detalle técnico salvo que lo necesites.",
    setupPrepare: "Preparar Cortex",
    setupInstall: "1. Instalar/actualizar Codex",
    setupDiagnose: "Diagnosticar Codex",
    setupLogin: "2. Iniciar OAuth",
    setupTest: "3. Probar Codex",
    setupRegister: "Registrar dispositivo",
    setupRefresh: "Actualizar estado",
    setupRepairFlatpak: "Copiar reparación Flatpak",
    setupToggleDiagnostics: "Mostrar/ocultar diagnóstico completo",
    setupClearLog: "Limpiar log",
    setupPlatform: "Sistema: {platform}",
    setupHumanPlatform: "Sistema detectado: {platform}",
    setupChecks: "Comprobaciones de configuración",
    setupLog: "Log de configuración",
    setupLogEmpty: "Todavía no hay acciones de configuración.",
    setupNode: "Node.js",
    setupNpm: "npm",
    setupNpmOptionalDetail: "Solo necesario para instalar/actualizar",
    setupStrategy: "Estrategia: {strategy}",
    setupDiagnostics: "Diagnóstico: {summary}",
    setupRuntime: "Runtime: {runtime}",
    setupHostPermission: "Permiso host: {status}",
    setupFlatpakRepair: "Reparación Flatpak: {command}",
    setupFlatpakNeedsRepair: "Obsidian Flatpak necesita permiso de host antes de que Cortex pueda ejecutar Codex.",
    setupFlatpakBlocked: "Bloqueado",
    setupFlatpakAllowed: "Permitido",
    setupFlatpakRepairCopied: "Comando de reparación Flatpak copiado.",
    setupCli: "Codex CLI",
    setupOauth: "OAuth",
    setupExecution: "Prueba de ejecución",
    setupDevice: "Registro de dispositivo",
    setupBackend: "Backend",
    setupOk: "OK",
    setupPending: "Pendiente",
    setupFailed: "Fallido",
    setupOptional: "Opcional",
    setupManualCommand: "Comando manual: {command}",
    backendStatus: "Backend: {url}",
    status: "Estado: {status}",
    version: "Versión: {version}",
    lastCheck: "Última comprobación: {time}",
    localOnlyDesktop: "Codex CLI local solo está disponible en escritorio.",
    remoteHttpsRequiredMobile: "En móvil/iOS hace falta un backend remoto HTTPS.",
    remoteHttpsRequired: "Configura un backend remoto HTTPS y activa backends remotos.",
    mobileUnavailable: "Modo móvil no disponible: {error}",
    remoteBackendReady: "Backend remoto disponible.",
    remoteBackendNotReady: "El backend remoto no está listo.",
    codexReady: "Codex está listo.",
    codexNotReady: "Codex CLI no está listo. Usa Instalar/actualizar.",
    codexInstalledNoOauth: "Codex CLI está instalado, pero falta OAuth.",
    codexFound: "Codex CLI encontrado.",
    codexLoginDetected: "OAuth de Codex detectado.",
    codexLoginPending: "OAuth de Codex pendiente.",
    setupLoginOpenedStatus: "Inicio de sesión abierto. Complétalo en la ventana externa y vuelve para actualizar el estado.",
    oauthCheckFailed: "No se pudo comprobar OAuth de Codex.",
    installingCodex: "Instalando o actualizando Codex CLI. Puede tardar unos minutos.",
    codexInstalled: "Codex CLI instalado o actualizado.",
    codexInstallFailed: "No se pudo instalar Codex CLI desde Obsidian.",
    oauthLaunched: "OAuth de Codex lanzado en una ventana externa.",
    testingCodex: "Probando Codex con una petición mínima.",
    codexOauthOk: "Codex OAuth funciona correctamente.",
    codexExecutionFailed: "Codex todavía no ejecuta correctamente.",
    deviceRegistered: "Dispositivo local registrado.",
    deviceRegisterFailed: "No se pudo registrar el dispositivo local. Arranca el backend y vuelve a intentarlo.",
    backupFailed: "No se ha podido crear la copia previa de la nota: {error}",
    sensitiveContextRedacted: "Se han redactado datos sensibles antes de persistir o reenviar contexto: {types}",
    folderReview: "Cortex está revisando la carpeta {folder}",
    configuredFolderToken: "carpeta",
    lastNoteHelp: "Última nota vista: {note}. Usa @NombreNota o las acciones rápidas para anclar el contexto.",
    dataJsonHasLocalKey: "`{path}` aún contiene `{key}`, que debería ser local y no sincronizarse.",
    duplicateSessionsDetected: "Hay {count} sesiones duplicadas lógicamente por conflictos de Sync en `_cortex/sessions`.",
    memoryFileMissingSchema: "`_cortex/memory/{category}.md` no tiene versión de esquema y se tratará como degradado.",
    memoryFileNonCanonical: "`_cortex/memory/{category}.md` contiene {count} entradas no canónicas que el plugin ignorará al usar memoria compartida.",
    indexEmpty: "`_cortex/index` está vacío o no se está usando todavía.",
    indexUnreadable: "`_cortex/index` no existe o no se puede leer.",
    outboxStale: "`_cortex/outbox` conserva {count} temporales con más de 24h.",
    workModeExecutePrompt:
      "Modo de trabajo activo: Ejecutar / Sin restricciones.\nPuedes actuar sin pedir permiso adicional, pero antes de editar o borrar cualquier archivo o nota debes crear una copia de seguridad del archivo afectado.\n{backupInstruction}\nSi no puedes crear la copia previa, no modifiques ni borres el archivo y explica el bloqueo.",
    workModeExecuteBackupPath: "Guarda esas copias dentro de: {backupRoot} preservando la ruta relativa del archivo dentro de la vault.",
    workModeExecuteBackupGeneric: "Guarda esas copias dentro de una carpeta de backup de la sesión preservando la ruta relativa del archivo dentro de la vault.",
    workModePlannerPrompt:
      "Modo de trabajo activo: Planificador / Copiloto.\nNo modifiques, borres, renombres ni reescribas archivos de la vault salvo que el usuario lo pida de forma clara y explícita.",
    noCodexNoContext:
      "No he podido usar Codex local y tampoco tengo contenido suficiente para responder bien.\n\nSiguientes pasos:\n- abre una nota con contexto relevante\n- usa una referencia @ para añadir una nota",
    localBackupModeNote: "Nota: esta respuesta usa un modo local de respaldo, no el flujo completo con Codex.",
    relevantContextFound: "He encontrado este contexto relevante:",
    referenceDocument: "Documento de referencia: {doc}.",
    localDeviceRegisteredStatus: "Dispositivo local registrado.",
    localDevicePendingStatus: "Configuración local pendiente: {error}",
    noDeviceToken: "Configuración local pendiente: no hay token de dispositivo disponible.",
    codexNoJson: "Codex no devolvió JSON.",
    codexNoOk: "Codex no devolvió OK.",
    codexNoOutput: "Codex no devolvió salida.",
    localFallbackDesktopOnly: "El respaldo local con Codex CLI solo está disponible en escritorio.",
    vaultPathUnavailable: "No he podido resolver la ruta local de la vault para usar el modo local.",
    backupFilePathUnavailable: "No he podido resolver la ruta del archivo para crear la copia de seguridad.",
    backupVaultPathUnavailable: "No he podido resolver la ruta local de la vault para crear la copia de seguridad."
    ,
    localCodexUnavailableDetail:
      "{classification} El backend no está accesible y el modo local tampoco ha podido usar Codex. Detalle: {detail}"
  }
};

function normalizeLanguage(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.startsWith("es")) {
    return "es";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  return DEFAULT_LANGUAGE;
}

function detectObsidianLanguage() {
  const candidates = [];
  try {
    candidates.push(globalThis?.document?.documentElement?.lang);
  } catch {}
  try {
    candidates.push(globalThis?.localStorage?.getItem?.("language"));
  } catch {}
  try {
    candidates.push(globalThis?.moment?.locale?.());
  } catch {}
  try {
    candidates.push(globalThis?.navigator?.language);
  } catch {}
  for (const candidate of candidates) {
    if (candidate) {
      return normalizeLanguage(candidate);
    }
  }
  return DEFAULT_LANGUAGE;
}

function resolveLanguage(mode) {
  if (mode === "es" || mode === "en") {
    return mode;
  }
  return detectObsidianLanguage();
}

function formatTemplate(template, params = {}) {
  return String(template || "").replace(/\{([^}]+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`
  );
}

function createTranslator(getLanguage) {
  return function translate(key, params = {}) {
    const language = resolveLanguage(typeof getLanguage === "function" ? getLanguage() : getLanguage);
    const template = I18N[language]?.[key] ?? I18N[DEFAULT_LANGUAGE]?.[key] ?? key;
    return formatTemplate(template, params);
  };
}

function getDefaultSystemPromptSections(languageMode = "auto") {
  const language = resolveLanguage(languageMode);
  return { ...(PROMPTS[language] || PROMPTS[DEFAULT_LANGUAGE]) };
}

module.exports = {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  I18N,
  PROMPTS,
  createTranslator,
  detectObsidianLanguage,
  formatTemplate,
  getDefaultSystemPromptSections,
  normalizeLanguage,
  resolveLanguage
};
});

__cortexChatDefine('./lib/security', function(module, exports, require) {
function isForeignWindowsUserPath(value, homeDir = "") {
  const current = String(value || "").toLowerCase();
  const home = String(homeDir || "").toLowerCase();
  return current.startsWith("c:\\users\\") && Boolean(home) && !current.startsWith(home);
}

function isLocalBackendUrl(value) {
  try {
    const parsed = new URL(value);
    return ["127.0.0.1", "localhost", "::1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function validateBackendUrl(value, options = {}) {
  const parsed = new URL(value);
  const isLocal = isLocalBackendUrl(value);
  if (options.isMobile && isLocal) {
    throw new Error(options.messages?.mobileLocal || "Localhost is not available on mobile.");
  }
  if (isLocal) {
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(options.messages?.localProtocol || "Local backend must use http or https.");
    }
    return;
  }
  if (!options.allowRemoteBackend) {
    throw new Error(options.messages?.remoteDisabled || "Remote backends are disabled.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error(options.messages?.remoteHttps || "Remote backend must use HTTPS.");
  }
}

function normalizeFolderRoots(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  const roots = [];
  for (const item of source) {
    const normalized = String(item || "")
      .replaceAll("\\", "/")
      .replace(/^\/+|\/+$/g, "")
      .trim();
    if (
      !normalized ||
      normalized.startsWith("_cortex/") ||
      normalized === "_cortex" ||
      seen.has(normalized)
    ) {
      continue;
    }
    seen.add(normalized);
    roots.push(normalized);
  }
  return roots;
}

function parseFolderRootsInput(value) {
  return normalizeFolderRoots(value);
}

function formatFolderRoots(value) {
  return normalizeFolderRoots(value).join(", ");
}

const DEFAULT_EXCLUDED_PATH_SEGMENTS = new Set([
  "node_modules",
  ".git",
  ".obsidian",
  "_cortex",
  "dist",
  "build",
  ".cache",
  ".vite",
  "coverage"
]);

function isIgnoredVaultPath(filePath, extraSegments = []) {
  const extras = Array.isArray(extraSegments) ? extraSegments : [];
  const excluded = new Set([...DEFAULT_EXCLUDED_PATH_SEGMENTS, ...extras].map((item) => String(item).toLowerCase()));
  return String(filePath || "")
    .replaceAll("\\", "/")
    .split("/")
    .some((segment) => excluded.has(segment.toLowerCase()));
}

module.exports = {
  DEFAULT_EXCLUDED_PATH_SEGMENTS,
  formatFolderRoots,
  isForeignWindowsUserPath,
  isIgnoredVaultPath,
  isLocalBackendUrl,
  normalizeFolderRoots,
  parseFolderRootsInput,
  validateBackendUrl
};
});

__cortexChatDefine('./lib/context', function(module, exports, require) {
const { normalizeFolderRoots } = __cortexChatRequire('./lib/security');

function wantsFolderContext(message, roots = []) {
  const source = String(message || "").toLowerCase();
  const configuredRoots = normalizeFolderRoots(roots);
  return (
    configuredRoots.length > 0 &&
    (/(carpeta|folder|directorio|all notes|todas las notas|todos los archivos)/.test(source) ||
      configuredRoots.some((root) => source.includes(root.toLowerCase())))
  );
}

function isInsideConfiguredRoot(filePath, roots = []) {
  const normalizedPath = String(filePath || "").replaceAll("\\", "/");
  return normalizeFolderRoots(roots).some((root) => normalizedPath === root || normalizedPath.startsWith(`${root}/`));
}

function rootForPath(filePath, roots = []) {
  const normalizedPath = String(filePath || "").replaceAll("\\", "/");
  return normalizeFolderRoots(roots).find((root) => normalizedPath === root || normalizedPath.startsWith(`${root}/`)) || "";
}

module.exports = {
  isInsideConfiguredRoot,
  rootForPath,
  wantsFolderContext
};
});

__cortexChatDefine('./lib/agent-store', function(module, exports, require) {
const path = require("node:path");

const CORTEX_DATA_ROOT = "_cortex";

function agentPaths(vaultRoot) {
  const agentRoot = path.join(vaultRoot, CORTEX_DATA_ROOT);
  return {
    agentRoot,
    memoryRoot: path.join(agentRoot, "memory"),
    sessionsRoot: path.join(agentRoot, "sessions"),
    outboxRoot: path.join(agentRoot, "outbox"),
    indexRoot: path.join(agentRoot, "index")
  };
}

function sessionBackupRoot(createdAt, threadId, sessionId) {
  const date = new Date(createdAt || new Date().toISOString());
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return path.join(CORTEX_DATA_ROOT, "backups", year, month, day, `${threadId}-${sessionId}`).replaceAll("\\", "/");
}

module.exports = {
  CORTEX_DATA_ROOT,
  agentPaths,
  sessionBackupRoot
};
});

__cortexChatDefine('./lib/codex-cli', function(module, exports, require) {
function escapePowerShellSingleQuoted(value) {
  return String(value).replace(/'/g, "''");
}

function codexSandboxForMode(runOptions = {}) {
  return runOptions.interactionMode === "execute" ? "workspace-write" : "read-only";
}

function codexReasoningForEffort(runOptions = {}) {
  return runOptions.effort === "fast" ? "medium" : "high";
}

function buildCodexExecArgs(options = {}) {
  const sandbox = codexSandboxForMode(options.runOptions);
  const effort = codexReasoningForEffort(options.runOptions);
  const args = [
    "--ask-for-approval",
    "never",
    "exec"
  ];
  if (options.vaultRoot) {
    args.push("-C", options.vaultRoot);
  }
  args.push(
    "--skip-git-repo-check",
    "--sandbox",
    sandbox,
    "-c",
    `model_reasoning_effort="${effort}"`
  );
  if (options.outputPath) {
    args.push("--output-last-message", options.outputPath);
  }
  args.push("-");
  return args;
}

function buildCodexExecCommand(options) {
  const codexCommand = escapePowerShellSingleQuoted(options.codexCommand || "codex");
  const promptPath = escapePowerShellSingleQuoted(options.promptPath);
  const outputPath = escapePowerShellSingleQuoted(options.outputPath);
  const vaultRoot = escapePowerShellSingleQuoted(options.vaultRoot);
  const sandbox = codexSandboxForMode(options.runOptions);
  const effort = codexReasoningForEffort(options.runOptions);

  return [
    "$ErrorActionPreference = 'Stop'",
    "[Console]::InputEncoding = [System.Text.Encoding]::UTF8",
    "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8",
    `$promptPath = '${promptPath}'`,
    `$outputPath = '${outputPath}'`,
    `$vaultRoot = '${vaultRoot}'`,
    `Get-Content -Raw -Encoding utf8 -LiteralPath $promptPath | & '${codexCommand}' --ask-for-approval never exec -C $vaultRoot --skip-git-repo-check --sandbox ${sandbox} -c 'model_reasoning_effort="${effort}"' --output-last-message $outputPath -`
  ].join("\n");
}

function hasNonAscii(value) {
  return /[^\u0000-\u007f]/.test(String(value || ""));
}

function classifyLocalCodexFailure(detail, context = {}, messages = {}) {
  const source = String(detail || "");
  const lower = source.toLowerCase();
  const notePath = String(context.notePath || "");
  const hasUnicodePath = hasNonAscii(notePath);
  if (/login required|not authenticated|oauth pendiente|error loading configuration|not logged|not signed/i.test(source)) {
    return messages.notAuthenticated || "Codex local is not authenticated on this device.";
  }
  if (/timeout waiting for child process to exit|timed out|operation timed out/i.test(lower)) {
    return hasUnicodePath
      ? messages.timeoutUnicode || "Codex local timed out. Unicode paths or content may be involved."
      : messages.timeout || "Codex local timed out.";
  }
  if (/constrainedlanguage|propertysetter not supported in constrainedlanguage/i.test(lower)) {
    return messages.constrainedLanguage || "PowerShell is running in restricted mode and blocked Codex commands.";
  }
  if (/blocked by policy|rejected: blocked by policy|executionpolicy/i.test(lower)) {
    return messages.blockedPolicy || "Local policy blocked commands attempted by Codex.";
  }
  if (/\?\?/.test(source) || /visi\?\?|c\?\?maras|t\?\?cnica/i.test(source)) {
    return messages.encoding || "Unicode encoding degradation was detected in local execution.";
  }
  return messages.generic || "Codex local failed while answering with the injected context.";
}

function detectCodexPlatform(value) {
  const platform = String(value || "").toLowerCase();
  if (platform === "win32" || platform === "windows") {
    return "windows";
  }
  if (platform === "darwin" || platform === "macos") {
    return "macos";
  }
  if (platform === "linux") {
    return "linux";
  }
  return "unsupported";
}

module.exports = {
  buildCodexExecArgs,
  buildCodexExecCommand,
  classifyLocalCodexFailure,
  codexReasoningForEffort,
  codexSandboxForMode,
  detectCodexPlatform,
  escapePowerShellSingleQuoted,
  hasNonAscii
};
});

__cortexChatDefine('./lib/settings', function(module, exports, require) {
const { getDefaultSystemPromptSections, resolveLanguage, SUPPORTED_LANGUAGES } = __cortexChatRequire('./lib/i18n');
const { normalizeFolderRoots } = __cortexChatRequire('./lib/security');

const MEMORY_CATEGORIES = ["preferences", "projects", "people", "decisions", "recent"];
const CORTEX_SCHEMA_VERSION = "3";
const LOCAL_STATE_VERSION = "1";

const SHARED_SETTING_KEYS = [
  "backendUrl",
  "allowRemoteBackend",
  "maxContextChars",
  "defaultInteractionMode",
  "showDiagnostics",
  "localFallbackDelayMs",
  "maxFolderReferences",
  "maxFolderContextChars",
  "folderReferenceRoots",
  "systemPromptSections",
  "uiScale",
  "uiDensity",
  "tabBarPosition",
  "contextManifestEnabled",
  "contextIncludeActiveNote",
  "contextIncludeLinks",
  "contextIncludeMentions",
  "contextIncludeFolders",
  "contextIncludePinned",
  "contextIncludeMemory",
  "contextIncludeRecentSessions",
  "contextIncludeRag",
  "ragIndexEnabled",
  "ragIndexMaxNotes",
  "ragCandidateLimit",
  "contextExclusionPatterns",
  "approvedEditsOnly",
  "activePromptProfile",
  "skillsEnabled",
  "skillsRoot",
  "enabledSkillIds",
  "maxSkillContextChars",
  "mcpEnabled",
  "mcpServers",
  "mcpReadOnlyToolsOnly",
  "languageMode",
  "chatTabs",
  "activeChatTabId"
];

const LOCAL_SETTING_KEYS = [
  "deviceId",
  "deviceLabel",
  "deviceTokenSecretName",
  "localBootstrapToken",
  "localBackendBootstrapScript",
  "localBackendBootstrapAllowed",
  "localCodexCommand",
  "allowCodexVaultTrust",
  "codexSetupPrompted",
  "codexSetupCompleted",
  "codexStatus",
  "codexVersion",
  "nodeVersion",
  "npmVersion",
  "nodeAvailableOk",
  "npmAvailableOk",
  "localCodexCommandDisplay",
  "localCodexExecSpec",
  "codexDiagnosticSummary",
  "codexDiagnosticDetail",
  "flatpakHostBridgeOk",
  "flatpakHostBridgeBlocked",
  "codexLastCheck",
  "codexInstalledOk",
  "codexLoginOk",
  "codexExecutionOk",
  "deviceRegisteredOk",
  "codexSetupLog"
];

function buildDefaultSettings(pluginId) {
  return {
    backendUrl: "http://127.0.0.1:8787",
    deviceId: "",
    deviceLabel: "",
    deviceTokenSecretName: `${pluginId}-device-token`,
    allowRemoteBackend: false,
    maxContextChars: 2000,
    localBootstrapToken: "",
    localBackendBootstrapScript: "",
    localBackendBootstrapAllowed: false,
    defaultInteractionMode: "plan",
    showDiagnostics: true,
    localFallbackDelayMs: 900,
    maxFolderReferences: 80,
    maxFolderContextChars: 120000,
    folderReferenceRoots: [],
    localCodexCommand: "codex",
    allowCodexVaultTrust: false,
    codexSetupPrompted: false,
    codexSetupCompleted: false,
    codexStatus: "",
    codexVersion: "",
    nodeVersion: "",
    npmVersion: "",
    nodeAvailableOk: false,
    npmAvailableOk: false,
    localCodexCommandDisplay: "",
    localCodexExecSpec: null,
    codexDiagnosticSummary: "",
    codexDiagnosticDetail: "",
    flatpakHostBridgeOk: false,
    flatpakHostBridgeBlocked: false,
    codexLastCheck: "",
    codexInstalledOk: false,
    codexLoginOk: false,
    codexExecutionOk: false,
    deviceRegisteredOk: false,
    codexSetupLog: [],
    systemPromptSections: getDefaultSystemPromptSections("auto"),
    uiScale: 1,
    uiDensity: "compact",
    tabBarPosition: "header",
    contextManifestEnabled: true,
    contextIncludeActiveNote: true,
    contextIncludeLinks: true,
    contextIncludeMentions: true,
    contextIncludeFolders: true,
    contextIncludePinned: true,
    contextIncludeMemory: true,
    contextIncludeRecentSessions: true,
    contextIncludeRag: false,
    ragIndexEnabled: true,
    ragIndexMaxNotes: 600,
    ragCandidateLimit: 5,
    contextExclusionPatterns: [],
    approvedEditsOnly: true,
    activePromptProfile: "planner",
    skillsEnabled: false,
    skillsRoot: "_cortex/skills",
    enabledSkillIds: [],
    maxSkillContextChars: 12000,
    mcpEnabled: false,
    mcpServers: [],
    mcpReadOnlyToolsOnly: true,
    languageMode: "auto",
    chatTabs: [],
    activeChatTabId: ""
  };
}

function normalizeSystemPromptSections(value, languageMode = "auto") {
  const defaults = getDefaultSystemPromptSections(languageMode);
  const current = value && typeof value === "object" ? value : {};
  const normalized = {};
  for (const key of Object.keys(defaults)) {
    normalized[key] = typeof current[key] === "string" ? current[key] : defaults[key];
  }
  return normalized;
}

function normalizePromptText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isSameSystemPromptSections(left, right) {
  const defaults = getDefaultSystemPromptSections("en");
  return Object.keys(defaults).every((key) => normalizePromptText(left?.[key]) === normalizePromptText(right?.[key]));
}

function isDefaultSystemPromptSections(value) {
  if (!value || typeof value !== "object") {
    return true;
  }
  return SUPPORTED_LANGUAGES.some((language) =>
    isSameSystemPromptSections(normalizeSystemPromptSections(value, language), getDefaultSystemPromptSections(language))
  );
}

function normalizeSystemPromptForLanguage(value, languageMode = "auto") {
  if (!value || isDefaultSystemPromptSections(value)) {
    return getDefaultSystemPromptSections(languageMode);
  }
  return normalizeSystemPromptSections(value, languageMode);
}

function normalizeLanguageMode(value) {
  return value === "es" || value === "en" || value === "auto" ? value : "auto";
}

function normalizeUiDensity(value) {
  return value === "comfortable" ? "comfortable" : "compact";
}

function normalizeTabBarPosition(value) {
  return value === "composer" ? "composer" : "header";
}

function normalizePromptProfile(value) {
  return ["researcher", "editor", "planner", "safe-executor"].includes(value) ? value : "planner";
}

function normalizeRagCandidateLimit(value, fallback = 5) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 && numeric <= 20 ? Math.round(numeric) : fallback;
}

function normalizeRagIndexMaxNotes(value, fallback = 600) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 50 && numeric <= 5000 ? Math.round(numeric) : fallback;
}

function normalizeMaxFolderReferences(value, fallback = 80) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 3 && numeric <= 300 ? Math.round(numeric) : fallback;
}

function normalizeMaxFolderContextChars(value, fallback = 120000) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 10000 && numeric <= 500000 ? Math.round(numeric) : fallback;
}

function normalizeSkillsRoot(value, fallback = "_cortex/skills") {
  const normalized = String(value || fallback)
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "")
    .trim();
  return normalized || fallback;
}

function normalizeSkillIds(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(/[\n,]/);
  return Array.from(
    new Set(
      source
        .map((item) =>
          String(item || "")
            .replaceAll("\\", "/")
            .replace(/^\/+|\/+$/g, "")
            .trim()
        )
        .filter(Boolean)
    )
  ).slice(0, 80);
}

function normalizeMaxSkillContextChars(value, fallback = 12000) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 1000 && numeric <= 60000 ? Math.round(numeric) : fallback;
}

function normalizeMcpServers(value) {
  return Array.isArray(value)
    ? value
        .map((server) => ({
          id: String(server?.id || "").trim(),
          name: String(server?.name || "").trim(),
          url: String(server?.url || "").trim(),
          enabled: server?.enabled === true,
          readOnly: server?.readOnly !== false
        }))
        .filter((server) => server.id && server.url)
        .slice(0, 20)
    : [];
}

function normalizeExclusionPatterns(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 80);
  }
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 80);
}

function normalizeSettings(settings, defaults) {
  const next = { ...defaults, ...(settings || {}) };
  next.languageMode = normalizeLanguageMode(next.languageMode);
  next.uiDensity = normalizeUiDensity(next.uiDensity);
  next.tabBarPosition = normalizeTabBarPosition(next.tabBarPosition);
  next.contextManifestEnabled = next.contextManifestEnabled !== false;
  next.contextIncludeActiveNote = next.contextIncludeActiveNote !== false;
  next.contextIncludeLinks = next.contextIncludeLinks !== false;
  next.contextIncludeMentions = next.contextIncludeMentions !== false;
  next.contextIncludeFolders = next.contextIncludeFolders !== false;
  next.contextIncludePinned = next.contextIncludePinned !== false;
  next.contextIncludeMemory = next.contextIncludeMemory !== false;
  next.contextIncludeRecentSessions = next.contextIncludeRecentSessions !== false;
  next.contextIncludeRag = next.contextIncludeRag === true;
  next.maxFolderReferences = normalizeMaxFolderReferences(next.maxFolderReferences, defaults.maxFolderReferences);
  next.maxFolderContextChars = normalizeMaxFolderContextChars(next.maxFolderContextChars, defaults.maxFolderContextChars);
  next.ragIndexEnabled = next.ragIndexEnabled !== false;
  next.ragIndexMaxNotes = normalizeRagIndexMaxNotes(next.ragIndexMaxNotes, defaults.ragIndexMaxNotes);
  next.ragCandidateLimit = normalizeRagCandidateLimit(next.ragCandidateLimit, defaults.ragCandidateLimit);
  next.contextExclusionPatterns = normalizeExclusionPatterns(next.contextExclusionPatterns);
  next.approvedEditsOnly = next.approvedEditsOnly !== false;
  next.activePromptProfile = normalizePromptProfile(next.activePromptProfile);
  next.skillsEnabled = next.skillsEnabled === true;
  next.skillsRoot = normalizeSkillsRoot(next.skillsRoot, defaults.skillsRoot);
  next.enabledSkillIds = normalizeSkillIds(next.enabledSkillIds);
  next.maxSkillContextChars = normalizeMaxSkillContextChars(next.maxSkillContextChars, defaults.maxSkillContextChars);
  next.mcpEnabled = next.mcpEnabled === true;
  next.mcpServers = normalizeMcpServers(next.mcpServers);
  next.mcpReadOnlyToolsOnly = next.mcpReadOnlyToolsOnly !== false;
  next.systemPromptSections = normalizeSystemPromptForLanguage(next.systemPromptSections, next.languageMode);
  next.folderReferenceRoots = normalizeFolderRoots(next.folderReferenceRoots);
  next.chatTabs = Array.isArray(next.chatTabs) ? next.chatTabs : [];
  next.activeChatTabId = typeof next.activeChatTabId === "string" ? next.activeChatTabId : "";
  return next;
}

function getSettingsLanguage(settings) {
  return resolveLanguage(settings?.languageMode || "auto");
}

module.exports = {
  CORTEX_SCHEMA_VERSION,
  LOCAL_SETTING_KEYS,
  LOCAL_STATE_VERSION,
  MEMORY_CATEGORIES,
  SHARED_SETTING_KEYS,
  buildDefaultSettings,
  getSettingsLanguage,
  normalizeExclusionPatterns,
  normalizeLanguageMode,
  normalizeMaxFolderContextChars,
  normalizeMaxFolderReferences,
  normalizePromptProfile,
  normalizeRagCandidateLimit,
  normalizeRagIndexMaxNotes,
  normalizeSkillIds,
  normalizeSkillsRoot,
  normalizeMaxSkillContextChars,
  normalizeMcpServers,
  normalizeTabBarPosition,
  normalizeUiDensity,
  normalizeSettings,
  normalizeSystemPromptForLanguage,
  normalizeSystemPromptSections,
  isDefaultSystemPromptSections
};
});

// END CORTEX CHAT BUNDLED LIBS

const {
  createTranslator,
  getDefaultSystemPromptSections,
  resolveLanguage
} = __cortexChatRequire('./lib/i18n');
const {
  formatFolderRoots,
  isForeignWindowsUserPath,
  isIgnoredVaultPath,
  isLocalBackendUrl: isLocalBackendUrlValue,
  normalizeFolderRoots,
  parseFolderRootsInput,
  validateBackendUrl: validateBackendUrlValue
} = __cortexChatRequire('./lib/security');
const {
  isInsideConfiguredRoot,
  rootForPath,
  wantsFolderContext
} = __cortexChatRequire('./lib/context');
const {
  CORTEX_DATA_ROOT,
  agentPaths,
  sessionBackupRoot
} = __cortexChatRequire('./lib/agent-store');
const {
  buildCodexExecArgs: buildCodexExecArgsSafe,
  classifyLocalCodexFailure: classifyLocalCodexFailureSafe,
  detectCodexPlatform: detectCodexPlatformSafe
} = __cortexChatRequire('./lib/codex-cli');
const {
  CORTEX_SCHEMA_VERSION,
  LOCAL_SETTING_KEYS,
  LOCAL_STATE_VERSION,
  MEMORY_CATEGORIES,
  SHARED_SETTING_KEYS,
  buildDefaultSettings,
  normalizeExclusionPatterns,
  normalizeLanguageMode,
  normalizeMaxFolderContextChars,
  normalizeMaxFolderReferences,
  normalizePromptProfile,
  normalizeRagCandidateLimit,
  normalizeRagIndexMaxNotes,
  normalizeSkillIds,
  normalizeSkillsRoot,
  normalizeMaxSkillContextChars,
  normalizeMcpServers,
  normalizeSettings,
  normalizeSystemPromptForLanguage,
  normalizeSystemPromptSections
} = __cortexChatRequire('./lib/settings');

function optionalRequire(moduleName) {
  try {
    return require(moduleName);
  } catch {
    return null;
  }
}

const fs = optionalRequire("node:fs/promises");
const os = optionalRequire("node:os");
const path = optionalRequire("node:path");
const nodeCrypto = optionalRequire("node:crypto");
const zlib = optionalRequire("node:zlib");
const childProcess = optionalRequire("node:child_process");
const util = optionalRequire("node:util");
const execFileAsync =
  childProcess?.execFile && util?.promisify ? util.promisify(childProcess.execFile) : null;
const PLUGIN_ID = "cortex-chat";
const VIEW_TYPE = `${PLUGIN_ID}-view`;
const DEFAULT_SETTINGS = buildDefaultSettings(PLUGIN_ID);

const MIN_UI_SCALE = 0.85;
const MAX_UI_SCALE = 1.75;
const UI_SCALE_STEP = 0.1;
const MAX_CHAT_TABS = 3;
const PDF_PREVIEW_MAX_CHARS = 24000;
const PDF_STREAM_SCAN_LIMIT = 24;
const TEXT_CONTEXT_EXTENSIONS = new Set(["md", "txt", "csv", "tsv", "json", "xml", "yaml", "yml", "log"]);
const HTML_CONTEXT_EXTENSIONS = new Set(["html", "htm"]);
const FOLDER_FILE_PREVIEW_MAX_CHARS = 12000;

function makeId(prefix) {
  if (nodeCrypto?.randomBytes) {
    return `${prefix}_${nodeCrypto.randomBytes(6).toString("hex")}`;
  }
  const bytes = new Uint8Array(6);
  window.crypto?.getRandomValues?.(bytes);
  const random = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("") || String(Date.now());
  return `${prefix}_${random}`;
}

function randomHex(bytes = 16) {
  if (nodeCrypto?.randomBytes) {
    return nodeCrypto.randomBytes(bytes).toString("hex");
  }
  const buffer = new Uint8Array(bytes);
  window.crypto?.getRandomValues?.(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanDevicePart(value, fallback = "device") {
  const cleaned = String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return cleaned || fallback;
}

function getHostLabel() {
  try {
    return cleanDevicePart(os?.hostname?.() || "device");
  } catch {
    return "device";
  }
}

function generateDeviceId() {
  return `${getHostLabel()}-${randomHex(4)}`;
}

function generateDeviceToken() {
  return randomHex(32);
}

function summarize(text) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, 160);
}

function createDefaultChatTab(t = createTranslator("en")) {
  const now = new Date().toISOString();
  return {
    id: makeId("tab"),
    threadId: null,
    title: t("untitledTab"),
    createdAt: now,
    updatedAt: now,
    messages: [],
    context: null,
    contextSummary: "",
    pinnedContext: [],
    isActive: true,
    isStreaming: false,
    needsAttention: false
  };
}

function normalizeChatMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }
  const role = message.role === "assistant" ? "assistant" : "user";
  return {
    id: typeof message.id === "string" && message.id ? message.id : makeId("msg"),
    role,
    content: typeof message.content === "string" ? message.content : "",
    meta: message.meta && typeof message.meta === "object" ? message.meta : {}
  };
}

function normalizeChatTab(tab, t = createTranslator("en")) {
  if (!tab || typeof tab !== "object") {
    return createDefaultChatTab(t);
  }
  const fallback = createDefaultChatTab(t);
  const messages = Array.isArray(tab.messages)
    ? tab.messages.map(normalizeChatMessage).filter(Boolean).slice(-40)
    : [];
  return {
    id: typeof tab.id === "string" && tab.id ? tab.id : fallback.id,
    threadId: typeof tab.threadId === "string" ? tab.threadId : null,
    title: typeof tab.title === "string" && tab.title.trim() ? tab.title.trim().slice(0, 80) : fallback.title,
    createdAt: typeof tab.createdAt === "string" ? tab.createdAt : fallback.createdAt,
    updatedAt: typeof tab.updatedAt === "string" ? tab.updatedAt : fallback.updatedAt,
    messages,
    context: tab.context && typeof tab.context === "object" ? tab.context : null,
    contextSummary: typeof tab.contextSummary === "string" ? tab.contextSummary : "",
    pinnedContext: Array.isArray(tab.pinnedContext) ? tab.pinnedContext.slice(-12) : [],
    isActive: Boolean(tab.isActive),
    isStreaming: Boolean(tab.isStreaming),
    needsAttention: Boolean(tab.needsAttention)
  };
}

function titleFromMessage(message, fallback) {
  const stopWords = new Set([
    "a", "al", "de", "del", "el", "la", "las", "los", "un", "una", "unos", "unas", "y", "o", "que", "me", "mi", "mis",
    "the", "a", "an", "and", "or", "to", "of", "for", "with", "about", "this", "that"
  ]);
  const cleaned = String(message || "")
    .replace(/[@#][^\s]+/g, " ")
    .replace(/[A-Za-z]:[\\/][^\s]+/g, " ")
    .replace(/(?:^|\s)[\w.-]+(?:\/[\w .-]+)+/g, " ")
    .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word.toLowerCase()))
    .slice(0, 4);
  const title = words.join(" ");
  return title || fallback;
}

function normalizeForFingerprint(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function sha1(value) {
  const normalized = String(value || "");
  if (nodeCrypto?.createHash) {
    return nodeCrypto.createHash("sha1").update(normalized).digest("hex");
  }
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }
  return `fallback-${hash.toString(16)}`;
}

function sessionFingerprint(session) {
  return sha1(
    [
      normalizeForFingerprint(session.threadId),
      normalizeForFingerprint(session.createdAt),
      normalizeForFingerprint(session.notePath),
      normalizeForFingerprint(session.userMessage),
      normalizeForFingerprint(session.assistantMessage)
    ].join("\n")
  );
}

function composeSystemPrompt(sections, languageMode = "auto") {
  const normalized = normalizeSystemPromptSections(sections, languageMode);
  const lines = [];
  for (const [key, value] of Object.entries(normalized)) {
    const trimmed = String(value || "").trim();
    if (!trimmed) {
      continue;
    }
    lines.push(`[${key}]`);
    lines.push(trimmed);
    lines.push("");
  }
  return lines.join("\n").trim();
}

function getPromptProfileInstruction(profile) {
  const normalized = normalizePromptProfile ? normalizePromptProfile(profile) : "planner";
  const profiles = {
    researcher:
      "Prompt profile: Researcher. Prioritize source grounding, context gaps, evidence trails, and careful synthesis. Separate facts, inferences, and recommended next checks.",
    editor:
      "Prompt profile: Editor. Prioritize concise rewrites, structure, voice preservation, actionable improvements, and safe note edits that can be reviewed before applying.",
    planner:
      "Prompt profile: Planner. Prioritize diagnosis, sequencing, tradeoffs, acceptance criteria, and clear next actions before execution.",
    "safe-executor":
      "Prompt profile: Safe executor. Prefer concrete implementation steps, but propose changes with reviewable diffs or insertion previews before modifying vault content."
  };
  return profiles[normalized] || profiles.planner;
}

function expandSlashCommand(message) {
  const text = String(message || "").trim();
  const match = text.match(/^\/([a-z-]+)(?:\s+([\s\S]*))?$/i);
  if (!match) {
    return { command: "", message: text };
  }
  const command = match[1].toLowerCase();
  const rest = String(match[2] || "").trim();
  const commands = {
    summarize: "Summarize the provided or active context into a clear, compact note with key points and open questions.",
    rewrite: "Rewrite the provided text or active note section for clarity, flow, and usefulness while preserving meaning.",
    "extract-actions": "Extract concrete action items, owners if present, deadlines if present, and unresolved decisions from the context.",
    "build-context": "Build a context plan: list the active note, references, missing sources, and recommended next context to attach before answering."
  };
  if (!commands[command]) {
    return { command: "", message: text };
  }
  return {
    command,
    message: `${commands[command]}\n\nUser request:\n${rest || "(use the active context)"}`
  };
}

function referenceSourceBucket(reference) {
  const source = String(reference?.source || "");
  if (source.includes("mention")) {
    return "mentions";
  }
  if (source.includes("outgoing-link")) {
    return "links";
  }
  if (source === "folder") {
    return "folders";
  }
  if (source === "rag") {
    return "rag";
  }
  if (source === "pinned-response") {
    return "pinned";
  }
  return "references";
}

function tokenizeForRag(text, limit = 64) {
  const stopWords = new Set([
    "para",
    "como",
    "pero",
    "todo",
    "esta",
    "este",
    "that",
    "this",
    "with",
    "from",
    "have",
    "what",
    "when",
    "where",
    "sobre",
    "contexto",
    "nota"
  ]);
  const tokens = String(text || "")
    .toLowerCase()
    .match(/[a-záéíóúüñ0-9]{4,}/gi) || [];
  return [...new Set(tokens.filter((token) => !stopWords.has(token)))].slice(0, limit);
}

function buildInsertionDiffPreview(before, insertion, cursorOffset) {
  const safeBefore = String(before || "");
  const offset = Math.max(0, Math.min(Number(cursorOffset) || 0, safeBefore.length));
  const prefix = safeBefore.slice(Math.max(0, offset - 700), offset);
  const suffix = safeBefore.slice(offset, offset + 700);
  const addedLines = String(insertion || "").split("\n");
  const lines = [];
  if (prefix.trim()) {
    lines.push(...prefix.split("\n").slice(-8).map((line) => ` ${line}`));
  }
  lines.push(...addedLines.map((line) => `+${line}`));
  if (suffix.trim()) {
    lines.push(...suffix.split("\n").slice(0, 8).map((line) => ` ${line}`));
  }
  return {
    text: lines.join("\n"),
    added: addedLines.filter((line) => line.trim()).length,
    removed: 0
  };
}

function workModeLabel(interactionMode, t = createTranslator("en")) {
  return interactionMode === "execute" ? t("execute") : t("planner");
}

function workModeDetail(interactionMode, t = createTranslator("en")) {
  return interactionMode === "execute" ? t("unrestricted") : t("copilot");
}

function classifyEffort(message, context = {}, interactionMode = "plan") {
  let score = 0;
  const normalizedMessage = String(message || "").trim();
  const references = context.references || [];
  const notePreview = String(context.content || "");
  const pdfReferences = references.filter((reference) => (reference.kind || reference.fileType) === "pdf").length;

  if (interactionMode === "execute") {
    score += 2;
  }
  if (normalizedMessage.length > 240) {
    score += 1;
  }
  if (normalizedMessage.length > 700) {
    score += 1;
  }
  if (references.length >= 2) {
    score += 1;
  }
  if (references.length >= 5) {
    score += 1;
  }
  if (pdfReferences > 0) {
    score += 2;
  }
  if (notePreview.length > 2200) {
    score += 1;
  }
  if ((context.outgoingLinks || []).length >= 4) {
    score += 1;
  }
  if (
    /(analiza|analisis|compar|contrasta|sinteti|resume|planifica|arquitect|riesg|depura|investiga|normaliza|refactor|audita|diagn[oó]stic|explica|revisa|propon|eval[uú]a)/i.test(
      normalizedMessage
    )
  ) {
    score += 1;
  }
  if (interactionMode === "execute" && /(borra|elimina|edita|reescribe|actualiza|mueve|renombra|corrige|aplica|implementa)/i.test(normalizedMessage)) {
    score += 1;
  }

  return score >= 3 ? "thinking" : "fast";
}

function clampUiScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return DEFAULT_SETTINGS.uiScale;
  }
  return Math.min(MAX_UI_SCALE, Math.max(MIN_UI_SCALE, Math.round(numeric * 100) / 100));
}

function truncatePreviewText(text, maxChars, suffix = "") {
  const normalized = normalizeWhitespace(String(text || ""));
  if (!normalized) {
    return "";
  }
  if (!maxChars || normalized.length <= maxChars) {
    return normalized;
  }
  const trimmed = normalized.slice(0, Math.max(0, maxChars - suffix.length - 1)).trimEnd();
  return `${trimmed}${suffix || "…"}`;
}

function decodeBasicHtmlEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function htmlToPlainText(value) {
  return decodeBasicHtmlEntities(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  );
}

function extensionForFile(file) {
  return String(file?.extension || file?.path?.split(".").pop() || "").toLowerCase();
}

function isTextContextFile(file) {
  return TEXT_CONTEXT_EXTENSIONS.has(extensionForFile(file));
}

function isHtmlContextFile(file) {
  return HTML_CONTEXT_EXTENSIONS.has(extensionForFile(file));
}

function buildUnsupportedFilePreview(file, translator = null) {
  const extension = extensionForFile(file) || "file";
  const size = Number(file?.stat?.size || 0);
  const sizeText = size ? ` Size: ${size} bytes.` : "";
  const fallback = `File selected as context. Text extraction is not available for .${extension} files.${sizeText}`;
  return translator ? `${translator("unsupportedFileContext", { extension })}${sizeText}` : fallback;
}

function applyFolderContextBudget(references, maxChars, translator = null) {
  const budget = Number(maxChars);
  if (!Number.isFinite(budget) || budget <= 0) {
    return references;
  }
  let used = 0;
  return (references || []).map((reference) => {
    if (reference.source !== "folder") {
      return reference;
    }
    const preview = String(reference.preview || "");
    if (!preview) {
      return { ...reference, folderContextChars: 0 };
    }
    if (used >= budget) {
      return {
        ...reference,
        preview: translator ? translator("folderContextBudgetReached") : "Folder context budget reached; preview omitted.",
        folderContextChars: 0,
        folderContextTruncated: true,
        folderContextOmitted: true
      };
    }
    const remaining = budget - used;
    if (preview.length > remaining) {
      const truncated = truncatePreviewText(
        preview,
        remaining,
        translator ? `... [${translator("folderContextTruncated")}]` : "... [Folder context truncated]"
      );
      used += truncated.length;
      return {
        ...reference,
        preview: truncated,
        folderContextChars: truncated.length,
        folderContextTruncated: true
      };
    }
    used += preview.length;
    return {
      ...reference,
      folderContextChars: preview.length
    };
  });
}

function decodePdfLiteralString(value) {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char !== "\\") {
      result += char;
      continue;
    }
    const next = value[index + 1];
    if (!next) {
      break;
    }
    index += 1;
    if (/[0-7]/.test(next)) {
      let octal = next;
      while (index + 1 < value.length && octal.length < 3 && /[0-7]/.test(value[index + 1])) {
        octal += value[index + 1];
        index += 1;
      }
      result += String.fromCharCode(parseInt(octal, 8));
      continue;
    }
    const escaped = {
      n: "\n",
      r: "\r",
      t: "\t",
      b: "\b",
      f: "\f",
      "(": "(",
      ")": ")",
      "\\": "\\"
    }[next];
    result += escaped ?? next;
  }
  return result;
}

function decodePdfHexString(value) {
  const cleaned = String(value || "").replace(/[^0-9a-f]/gi, "");
  if (!cleaned) {
    return "";
  }
  const padded = cleaned.length % 2 === 1 ? `${cleaned}0` : cleaned;
  const bytes = [];
  for (let index = 0; index < padded.length; index += 2) {
    bytes.push(parseInt(padded.slice(index, index + 2), 16));
  }
  const buffer = Buffer.from(bytes);
  if (buffer.length >= 2) {
    const bom = buffer.slice(0, 2).toString("hex").toLowerCase();
    if (bom === "feff" || bom === "fffe") {
      const chars = [];
      for (let index = 2; index + 1 < buffer.length; index += 2) {
        chars.push(String.fromCharCode(buffer.readUInt16BE(index)));
      }
      return chars.join("");
    }
  }
  return buffer.toString("latin1");
}

function extractPdfTextFromStreamText(streamText, maxChars = PDF_PREVIEW_MAX_CHARS) {
  const blocks = String(streamText || "").match(/BT[\s\S]*?ET/g) || [];
  const sources = blocks.length ? blocks : [String(streamText || "")];
  const parts = [];
  for (const source of sources) {
    const tokens = source.match(/(?:\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]+>)/g) || [];
    for (const token of tokens) {
      let decoded = "";
      if (token.startsWith("(") && token.endsWith(")")) {
        decoded = decodePdfLiteralString(token.slice(1, -1));
      } else if (token.startsWith("<") && token.endsWith(">")) {
        decoded = decodePdfHexString(token.slice(1, -1));
      }
      decoded = String(decoded || "").replace(/[^\S\r\n]+/g, " ").trim();
      if (!decoded || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/.test(decoded)) {
        continue;
      }
      parts.push(decoded);
      if (parts.join(" ").length >= maxChars) {
        return truncatePreviewText(parts.join(" "), maxChars, "… [PDF truncado]");
      }
    }
  }
  return truncatePreviewText(parts.join(" "), maxChars, "… [PDF truncado]");
}

function escapeYamlString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function quoteShellArg(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function parseLastJsonObject(output) {
  const source = String(output || "").trim();
  const matches = source.match(/\{[^\r\n]*\}/g);
  if (!matches?.length) {
    throw new Error(source || "Codex no devolvió JSON.");
  }
  return JSON.parse(matches[matches.length - 1]);
}

function isPortableCodexCommand(value) {
  const current = String(value || "").trim().toLowerCase();
  return !current || current === "codex";
}

function toFrontmatter(data) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - "${escapeYamlString(item)}"`);
      }
      continue;
    }
    lines.push(`${key}: "${escapeYamlString(value || "")}"`);
  }
  lines.push("---");
  return lines.join("\n");
}

function buildSessionMarkdown(session) {
  return `${toFrontmatter({
    kind: "cortex-session",
    schema_version: session.schemaVersion || CORTEX_SCHEMA_VERSION,
    plugin_version: session.pluginVersion || "",
    session_id: session.sessionId,
    thread_id: session.threadId,
    created_at: session.createdAt,
    device_id: session.deviceId,
    content_fingerprint: session.contentFingerprint || sessionFingerprint(session),
    note_path: session.notePath || "",
    note_title: session.noteTitle || "",
    reference_paths: session.referencePaths || [],
    work_mode: session.workMode || "plan",
    effort: session.effort || "thinking",
    backup_policy: session.backupPolicy || "",
    backup_root: session.backupRoot || "",
    summary: session.summary || ""
  })}

# Session

## User

${session.userMessage}

## Assistant

${session.assistantMessage}

## Context

- Note path: ${session.notePath || "(none)"}
- References: ${(session.referencePaths || []).join(", ") || "(none)"}
- Work mode: ${session.workMode || "plan"}
- Effort: ${session.effort || "thinking"}
- Backup policy: ${session.backupPolicy || "(none)"}
- Backup root: ${session.backupRoot || "(none)"}

## Context Manifest

\`\`\`json
${JSON.stringify(session.contextManifest || {}, null, 2)}
\`\`\`
`;
}

function buildApprovedChangeMarkdown(change) {
  return `${toFrontmatter({
    kind: "cortex-approved-change",
    schema_version: CORTEX_SCHEMA_VERSION,
    plugin_version: change.pluginVersion || "",
    change_id: change.changeId,
    created_at: change.createdAt,
    target_path: change.targetPath || "",
    backup_path: change.backupPath || "",
    thread_id: change.threadId || "",
    session_id: change.sessionId || "",
    summary: change.summary || ""
  })}

# Approved Change

## Target

- Note path: ${change.targetPath || "(none)"}
- Backup: ${change.backupPath || "(none)"}

## Diff Preview

\`\`\`diff
${change.diffPreview || ""}
\`\`\`

## Inserted Content

\`\`\`markdown
${change.insertion || ""}
\`\`\`
`;
}

function buildMemoryMarkdown(category, bullets) {
  return `${toFrontmatter({
    kind: "cortex-memory",
    schema_version: CORTEX_SCHEMA_VERSION,
    category,
    updated_at: new Date().toISOString(),
    managed_by: "cortex-chat-local-fallback"
  })}

# ${category}

${(bullets || []).length ? bullets.map((bullet) => `- ${bullet}`).join("\n") : ""}
`;
}

function buildMemoryCandidateMarkdown(candidate) {
  const sections = [];
  for (const category of MEMORY_CATEGORIES) {
    const bullets = candidate.extracted?.[category] || [];
    if (!bullets.length) {
      continue;
    }
    sections.push(`## ${category}`);
    sections.push(bullets.map((bullet) => `- ${bullet}`).join("\n"));
    sections.push("");
  }

  return `${toFrontmatter({
    kind: "cortex-memory-candidate",
    schema_version: CORTEX_SCHEMA_VERSION,
    plugin_version: candidate.pluginVersion || "",
    session_id: candidate.sessionId || "",
    thread_id: candidate.threadId || "",
    created_at: candidate.createdAt || new Date().toISOString(),
    device_id: candidate.deviceId || "",
    source: "cortex-chat-local-fallback"
  })}

# memory-candidate

${sections.length ? sections.join("\n").trim() : "_No candidate memory extracted._"}
`;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { data: {}, body: markdown };
  }

  const data = {};
  const lines = match[1].split("\n");
  let currentArrayKey = null;

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentArrayKey) {
      const value = line.replace(/^\s*-\s+/, "").replace(/^"|"$/g, "");
      data[currentArrayKey].push(value);
      continue;
    }

    const keyValueMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (!keyValueMatch) {
      continue;
    }

    const key = keyValueMatch[1].trim();
    const rawValue = keyValueMatch[2].trim();
    if (!rawValue) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    currentArrayKey = null;
    data[key] = rawValue.replace(/^"|"$/g, "");
  }

  return {
    data,
    body: markdown.slice(match[0].length)
  };
}

function parseBulletLines(markdown) {
  return String(markdown || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2))
    .filter(Boolean);
}

function dedupeLimit(values, limit) {
  const result = [];
  const seen = new Set();
  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= limit) {
      break;
    }
  }
  return result;
}

function isPlaceholderBullet(value) {
  return /^no memory captured yet\.?$/i.test(String(value || "").trim());
}

function isReferenceBullet(value) {
  return /^reference used:/i.test(String(value || "").trim());
}

function looksLikePromptResidue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return [
    /^si quieres\b/,
    /^haz estos cambios\b/,
    /^crea(?:me)?\b/,
    /^a continuacion\b/,
    /^hemos completado\b/,
    /^##\s+/,
    /^\*\*cambios/,
    /^resumen del razonamiento:/,
    /^he (creado|añadido|dejado|sustituido)\b/,
    /^-+\s/,
    /^`pry-/,
    /^en \[/,
    /^1\.\s+en\b/,
    /^5\.\s+sustituye\b/
  ].some((pattern) => pattern.test(normalized));
}

function sanitizeMemoryBullets(category, bullets) {
  const issues = [];
  const cleaned = [];

  for (const bullet of bullets || []) {
    const normalized = cleanWikiLinks(bullet);
    if (!normalized) {
      continue;
    }
    if (isPlaceholderBullet(normalized)) {
      issues.push(`Eliminado placeholder en ${category}.`);
      continue;
    }
    if (isReferenceBullet(normalized)) {
      issues.push(`Eliminada referencia contextual no canónica en ${category}.`);
      continue;
    }
    if (category !== "recent" && looksLikePromptResidue(normalized)) {
      issues.push(`Eliminado residuo transitorio en ${category}.`);
      continue;
    }
    cleaned.push(normalized);
  }

  return {
    bullets: dedupeLimit(cleaned, category === "recent" ? 25 : 50),
    issues
  };
}

function heuristicMemoryFromExchange(payload) {
  const lines = `${payload.userMessage}\n${payload.assistantMessage}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const memory = {
    preferences: [],
    projects: [],
    people: [],
    decisions: [],
    recent: []
  };

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/(prefiero|me gusta|prefer|habitualmente|usually)/i.test(lower)) {
      memory.preferences.push(line);
    }
    if (/(proyecto|project|roadmap|milestone|speech)/i.test(lower)) {
      memory.projects.push(line);
    }
    if (/(equipo|team|cliente|customer|stakeholder|persona|people)/i.test(lower)) {
      memory.people.push(line);
    }
    if (/(decid|decision|acord|resolved|vamos a|we will)/i.test(lower)) {
      memory.decisions.push(line);
    }
  }

  memory.recent.push(payload.summary || summarize(payload.userMessage));
  return memory;
}

function splitIntoParagraphChunks(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function normalizeWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function cleanWikiLinks(text) {
  return normalizeWhitespace(
    String(text || "")
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/^"+|"+$/g, "")
      .replace(/\s*—\s*/g, " — ")
  );
}

function parseInlineList(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("[") || !raw.endsWith("]")) {
    return [];
  }

  return raw
    .slice(1, -1)
    .split(",")
    .map((item) => cleanWikiLinks(item.replace(/^"+|"+$/g, "")))
    .filter(Boolean);
}

function normalizeFrontmatterValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanWikiLinks(item)).filter(Boolean);
  }

  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const inlineList = parseInlineList(raw);
  if (inlineList.length) {
    return inlineList;
  }

  return cleanWikiLinks(raw);
}

function parseLooseFrontmatter(markdown) {
  const source = String(markdown || "");
  const match = /(^|\n)---\n([\s\S]*?)\n---\n?/.exec(source);
  if (!match) {
    return { data: {}, body: source, preamble: "" };
  }

  const fenceStart = match.index + match[1].length;
  const fenceEnd = fenceStart + match[0].length - match[1].length;
  const data = {};
  const lines = match[2].split("\n");
  let currentArrayKey = null;

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentArrayKey) {
      const value = line.replace(/^\s*-\s+/, "").replace(/^"|"$/g, "");
      data[currentArrayKey].push(value);
      continue;
    }

    const keyValueMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (!keyValueMatch) {
      continue;
    }

    const key = keyValueMatch[1].trim();
    const rawValue = keyValueMatch[2].trim();
    if (!rawValue) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    currentArrayKey = null;
    data[key] = rawValue.replace(/^"|"$/g, "");
  }

  return {
    data,
    body: source.slice(fenceEnd),
    preamble: source.slice(0, fenceStart).trim()
  };
}

function extractHeadingTitle(markdown) {
  const match = String(markdown || "").match(/^#\s+(.+)$/m);
  return match ? cleanWikiLinks(match[1]) : "";
}

function extractCalloutBody(markdown, label) {
  const lines = String(markdown || "").split(/\r?\n/);
  const labelLower = String(label || "").toLowerCase();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^>\s*\[![^\]]+\]\s*(.+)$/i);
    if (!match || !match[1].toLowerCase().includes(labelLower)) {
      continue;
    }

    const collected = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const current = lines[cursor];
      if (!current.startsWith(">")) {
        break;
      }
      collected.push(current.replace(/^>\s?/, ""));
    }
    return cleanWikiLinks(collected.join(" "));
  }

  return "";
}

function extractSection(markdown, heading) {
  const lines = String(markdown || "").split(/\r?\n/);
  const target = normalizeWhitespace(heading).toLowerCase();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("## ")) {
      continue;
    }

    const currentHeading = normalizeWhitespace(line.replace(/^##\s+/, "")).toLowerCase();
    if (currentHeading !== target) {
      continue;
    }

    const collected = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const current = lines[cursor];
      if (/^##\s+/.test(current)) {
        break;
      }
      collected.push(current);
    }
    return collected.join("\n").trim();
  }

  return "";
}

function extractLabeledValue(markdown, label) {
  const match = String(markdown || "").match(new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+)`, "i"));
  return match ? cleanWikiLinks(match[1]) : "";
}

function extractChecklistItems(markdown, limit, checked) {
  const matcher = checked ? /^\s*-\s+\[x\]\s+(.+)$/i : /^\s*-\s+\[\s\]\s+(.+)$/i;
  return String(markdown || "")
    .split(/\r?\n/)
    .map((line) => line.match(matcher))
    .filter(Boolean)
    .map((match) => cleanWikiLinks(match[1]))
    .filter(Boolean)
    .slice(0, limit);
}

function firstMeaningfulParagraph(markdown) {
  return splitIntoParagraphChunks(markdown)
    .map((chunk) => cleanWikiLinks(chunk))
    .find(Boolean);
}

function formatHumanList(values) {
  const items = dedupeLimit((values || []).map((value) => cleanWikiLinks(value)), 8);
  if (!items.length) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function buildStructuredSourceSummary(source) {
  const parsed = parseLooseFrontmatter(source.preview || "");
  const meta = Object.fromEntries(
    Object.entries(parsed.data || {}).map(([key, value]) => [key, normalizeFrontmatterValue(value)])
  );
  const title = extractHeadingTitle(parsed.body) || source.title || meta.nombre || "";
  const purpose = extractCalloutBody(parsed.body, "Propósito");
  const stateSection = extractSection(parsed.body, "Estado actual");
  const currentPhase = extractLabeledValue(stateSection, "Fase");
  const currentStatus = firstMeaningfulParagraph(
    stateSection
      .split(/\r?\n/)
      .filter((line) => !/^\*\*Fase\*\*/.test(line))
      .join("\n")
  );
  const betaCriteria = extractSection(parsed.body, "Criterio de salida a beta");
  const pendingBetaItems = extractChecklistItems(betaCriteria, 2, false);
  const completedBetaItems = extractChecklistItems(betaCriteria, 2, true);
  const projectType = Array.isArray(meta.tipo) ? meta.tipo[0] : meta.tipo;
  const status = Array.isArray(meta.estado) ? meta.estado[0] : meta.estado;
  const phase = Array.isArray(meta.fase) ? meta.fase[0] : meta.fase;
  const startDate = Array.isArray(meta.fecha_inicio) ? meta.fecha_inicio[0] : meta.fecha_inicio;
  const betaTarget = Array.isArray(meta.fecha_objetivo_beta) ? meta.fecha_objetivo_beta[0] : meta.fecha_objetivo_beta;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const related = Array.isArray(meta.relacionadas) ? meta.relacionadas : [];
  const tools = Array.isArray(meta.herramientas) ? meta.herramientas : [];
  const stack = Array.isArray(meta.stack) ? meta.stack : [];
  const preambleLinks = String(parsed.preamble || "")
    .split(/\r?\n/)
    .map((line) => cleanWikiLinks(line))
    .filter((line) => /\[\[/.test(line) || line);
  const referenceDoc = preambleLinks.length ? preambleLinks[0] : "";

  const introParts = [title];
  if (projectType) {
    introParts.push(`es un ${projectType}`);
  }
  if (status) {
    introParts.push(status);
  }
  const effectivePhase = currentPhase || phase;
  if (effectivePhase) {
    introParts.push(`en fase ${effectivePhase}`);
  }

  const lines = [];
  if (introParts.length) {
    lines.push(`${introParts.join(" ")}.`);
  }
  if (purpose) {
    lines.push(purpose);
  }
  if (betaTarget) {
    lines.push(`Objetivo beta: ${betaTarget}.`);
  }
  if (startDate) {
    lines.push(`Inicio: ${startDate}.`);
  }
  if (currentStatus) {
    lines.push(`Situación actual: ${currentStatus.replace(/[.。]+$/, "")}.`);
  }
  if (stack.length) {
    lines.push(`Stack principal: ${formatHumanList(stack)}.`);
  }
  if (tools.length) {
    lines.push(`Herramientas clave: ${formatHumanList(tools)}.`);
  }
  if (referenceDoc) {
    lines.push(`Documento de referencia: ${referenceDoc}.`);
  }
  if (related.length) {
    lines.push(`Notas relacionadas: ${formatHumanList(related)}.`);
  }
  if (pendingBetaItems.length) {
    lines.push(`Pendiente para salida a beta: ${formatHumanList(pendingBetaItems)}.`);
  } else if (completedBetaItems.length) {
    lines.push(`Aspectos ya cubiertos: ${formatHumanList(completedBetaItems)}.`);
  }
  if (tags.length) {
    lines.push(`Etiquetas: ${formatHumanList(tags.slice(0, 5))}.`);
  }

  return lines.filter(Boolean).join("\n");
}

function extractSourceFacts(source) {
  const parsed = parseLooseFrontmatter(source.preview || "");
  const meta = Object.fromEntries(
    Object.entries(parsed.data || {}).map(([key, value]) => [key, normalizeFrontmatterValue(value)])
  );
  const title = extractHeadingTitle(parsed.body) || source.title || meta.nombre || "";
  const purpose = extractCalloutBody(parsed.body, "Propósito");
  const stateSection = extractSection(parsed.body, "Estado actual");
  const betaCriteria = extractSection(parsed.body, "Criterio de salida a beta");
  const currentPhase = extractLabeledValue(stateSection, "Fase") || meta.fase || "";
  const pendingBetaItems = extractChecklistItems(betaCriteria, 6, false);
  const completedBetaItems = extractChecklistItems(betaCriteria, 4, true);
  const openSignals = String(parsed.body || "")
    .split(/\r?\n/)
    .map((line) => cleanWikiLinks(line.replace(/^\|\s*/, "").replace(/\s*\|$/, "").replace(/\s*\|\s*/g, " · ")))
    .filter((line) => /(abierto|pendiente|proceso|inestable|validar|bloqueo|bug|crítica|alta|roto)/i.test(line))
    .filter((line) => line.length > 12 && !/^[-:]+$/.test(line))
    .slice(0, 8);
  const todoSignals = String(parsed.body || "")
    .split(/\r?\n/)
    .map((line) => line.match(/^>\s*\[!todo\]\s*(.+)$/i))
    .filter(Boolean)
    .map((match) => cleanWikiLinks(match[1]))
    .slice(0, 6);

  return {
    title,
    purpose,
    type: Array.isArray(meta.tipo) ? meta.tipo[0] : meta.tipo,
    status: Array.isArray(meta.estado) ? meta.estado[0] : meta.estado,
    phase: Array.isArray(currentPhase) ? currentPhase[0] : currentPhase,
    betaTarget: Array.isArray(meta.fecha_objetivo_beta) ? meta.fecha_objetivo_beta[0] : meta.fecha_objetivo_beta,
    stack: Array.isArray(meta.stack) ? meta.stack : [],
    tools: Array.isArray(meta.herramientas) ? meta.herramientas : [],
    related: Array.isArray(meta.relacionadas) ? meta.relacionadas : [],
    pendingBetaItems,
    completedBetaItems,
    openSignals: dedupeLimit([...todoSignals, ...openSignals], 8)
  };
}

function bulletList(items, limit) {
  return dedupeLimit(items, limit)
    .map((item) => `- ${item}`)
    .join("\n");
}

function buildImprovementAnswer(source, message, runOptions) {
  const facts = extractSourceFacts(source);
  const effort = runOptions?.effort || "thinking";
  const mode = runOptions?.interactionMode || "plan";
  const limit = effort === "fast" ? 3 : 6;
  const title = facts.title || source.title || "esta nota";
  const blockers = facts.openSignals.length
    ? facts.openSignals
    : [
        "cerrar los elementos pendientes antes de abrir nuevos frentes",
        "hacer verificables los criterios de salida",
        "reducir ambiguedad entre plan, ejecucion y validacion"
      ];
  const priorities = [
    facts.phase ? `Alinear el trabajo real con la fase actual: ${facts.phase}.` : "",
    facts.betaTarget ? `Convertir el objetivo beta (${facts.betaTarget}) en una lista corta de pruebas de aceptacion.` : "",
    facts.pendingBetaItems.length ? `Cerrar pendientes de salida a beta: ${formatHumanList(facts.pendingBetaItems)}.` : "",
    facts.stack.length ? `Separar responsabilidades por herramienta: ${formatHumanList(facts.stack)}.` : "",
    "Registrar cada decision como criterio verificable en la nota, no como comentario suelto."
  ].filter(Boolean);
  const nextSteps =
    mode === "execute"
      ? [
          "Crear una seccion `## Siguiente ejecucion` con una unica tarea prioritaria.",
          "Marcar responsable, herramienta, dependencia y criterio de cierre.",
          "Mover cualquier mejora no critica a una lista posterior para proteger el cierre beta.",
          "Revisar la nota al final de la sesion y convertir avances en checkboxes cerrados."
        ]
      : [
          "Definir el criterio de exito de beta en 5 pruebas observables.",
          "Ordenar los bloqueos por impacto en usuario, no por facilidad tecnica.",
          "Separar bugs de producto, deuda visual y funcionalidad nueva.",
          "Planificar una sola iteracion cerrada antes de tocar nuevas features."
        ];
  const riskLines = [
    "El mayor riesgo es mezclar cierre beta con funcionalidades nuevas y perder capacidad de validacion.",
    "This note already contains enough context; the next step is to convert it into small operational decisions.",
    facts.tools.length ? `Usaria ${formatHumanList(facts.tools)} solo cuando cada herramienta tenga una responsabilidad clara.` : ""
  ].filter(Boolean);

  return [
    `## Diagnostico de ${title}`,
    facts.purpose || `La nota describe un ${facts.type || "proyecto"} ${facts.status || "activo"}.`,
    "",
    "## Puntos que mas conviene mejorar",
    bulletList(priorities, limit),
    "",
    "## Bloqueos o senales detectadas",
    bulletList(blockers, limit),
    "",
    mode === "execute" ? "## Ejecucion recomendada" : "## Plan recomendado",
    bulletList(nextSteps, effort === "fast" ? 3 : 4),
    "",
    "## Riesgos a vigilar",
    bulletList(riskLines, effort === "fast" ? 2 : 3)
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHeuristicAnswer(message, context, recentSessions, runOptions = {}) {
  const referenced = context.references || [];
  const notePreview = context.content || "";
  const sources = referenced.length
    ? referenced
    : notePreview
      ? [{ title: context.title || "", path: context.path || "", preview: notePreview }]
      : [];
  const asksForImprovement = /(mejor|mejorar|optimiza|optimizar|improve|upgrade|como puedo|cómo puedo|recomienda|siguiente paso|next step)/i.test(
    message
  );

  if (sources.length && asksForImprovement) {
    return sources.map((source) => buildImprovementAnswer(source, message, runOptions)).join("\n\n");
  }

  const structuredSources = referenced
    .map((reference) => buildStructuredSourceSummary(reference))
    .filter(Boolean);

  if (!structuredSources.length && notePreview) {
    const activeNoteSummary = buildStructuredSourceSummary({
      title: context.title || "",
      path: context.path || "",
      preview: notePreview
    });
    if (activeNoteSummary) {
      structuredSources.push(activeNoteSummary);
    }
  }

  if (structuredSources.length) {
    return structuredSources.join("\n\n");
  }

  const activeSource =
    referenced.length > 0
      ? referenced
          .map((reference) => `- ${reference.title}: ${splitIntoParagraphChunks(reference.preview).slice(0, 2).join(" ")}`)
          .join("\n")
      : splitIntoParagraphChunks(notePreview).slice(0, 4).join("\n\n");

  if (!activeSource) {
    return [
      "I could not use local Codex and there is not enough content to answer well.",
      "Try one of these options:",
      "- open the note before asking",
      "- use an @ reference"
    ].join("\n");
  }

  if (/resumen|summary|resume/i.test(message)) {
    return [
      "Resumen rápido basado en el contenido disponible:",
      "",
      activeSource.slice(0, 1800),
      "Nota: esta respuesta usa un modo local de respaldo, no el flujo completo con Codex."
    ].join("\n");
  }

  return [
    "I found this relevant context:",
    "",
    activeSource.slice(0, 1800),
    "",
    "Nota: esta respuesta usa un modo local de respaldo, no el flujo completo con Codex."
  ].join("\n");
}

function normalizeReferenceQuery(value) {
  return normalizeWhitespace(String(value || ""))
    .replace(/^[@#]+/, "")
    .replace(/^[\s,.;:!?()[\]{}]+|[\s,.;:!?()[\]{}]+$/g, "")
    .trim();
}

function scoreReferenceCandidate(file, query) {
  const normalizedQuery = normalizeReferenceQuery(query).toLowerCase();
  const basename = String(file?.basename || "").toLowerCase();
  const pathText = String(file?.path || "").toLowerCase();
  if (!normalizedQuery) {
    return 20;
  }
  if (basename === normalizedQuery) {
    return 0;
  }
  if (pathText === normalizedQuery || pathText.replace(/\.(md|pdf)$/i, "") === normalizedQuery) {
    return 1;
  }
  if (basename.startsWith(normalizedQuery)) {
    return 2;
  }
  if (pathText.includes(normalizedQuery)) {
    return 3;
  }
  if (basename.includes(normalizedQuery)) {
    return 4;
  }
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  if (words.length && words.every((word) => basename.includes(word) || pathText.includes(word))) {
    return 5;
  }
  return null;
}

function findBestReferenceMatch(query, files, locale = "en") {
  const normalizedQuery = normalizeReferenceQuery(query);
  if (!normalizedQuery) {
    return null;
  }
  return (files || [])
    .map((file) => ({ file, score: scoreReferenceCandidate(file, normalizedQuery) }))
    .filter((entry) => entry.score !== null)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }
      return String(left.file.path || "").localeCompare(String(right.file.path || ""), locale, { sensitivity: "base" });
    })[0] || null;
}

function extractAtReferenceMatches(text, files, locale = "en") {
  const source = String(text || "");
  const matches = [];
  const seen = new Set();
  const triggerRegex = /(^|\s)@/g;
  let trigger = null;
  while ((trigger = triggerRegex.exec(source))) {
    const atIndex = trigger.index + trigger[1].length;
    const nextTriggerIndex = source.slice(atIndex + 1).search(/(^|\s)[@#]/);
    const hardEnd = nextTriggerIndex === -1 ? source.length : atIndex + 1 + nextTriggerIndex;
    const rawSegment = source.slice(atIndex + 1, hardEnd).split(/\r?\n/)[0] || "";
    const segment = rawSegment.trim();
    if (!segment) {
      continue;
    }

    let best = null;
    for (let end = segment.length; end > 0; end -= 1) {
      const char = segment[end - 1];
      if (end !== segment.length && !/[\s,.;:!?()[\]{}-]/.test(char)) {
        continue;
      }
      const candidateQuery = normalizeReferenceQuery(segment.slice(0, end));
      if (!candidateQuery) {
        continue;
      }
      const match = findBestReferenceMatch(candidateQuery, files, locale);
      if (match) {
        best = { token: candidateQuery, file: match.file, score: match.score };
        break;
      }
    }

    if (best && !seen.has(best.file.path)) {
      seen.add(best.file.path);
      matches.push(best);
    } else if (!best) {
      const unresolved = normalizeReferenceQuery(segment.split(/\s{2,}/)[0] || segment);
      if (unresolved) {
        matches.push({ token: unresolved, file: null, unresolved: true });
      }
    }
  }
  return matches;
}

function mergeReferences(...groups) {
  const result = [];
  const seen = new Set();

  for (const group of groups) {
    for (const reference of group || []) {
      const key = reference?.path || reference?.title || reference?.token;
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      result.push(reference);
    }
  }

  return result;
}

class MemoryContextModal extends Modal {
  constructor(app, payload, t = createTranslator("en")) {
    super(app);
    this.payload = payload || { documents: [], recentSessions: [] };
    this.t = t;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.t("memoryUsed") });

    const docs = this.payload.documents || [];
    const sessions = this.payload.recentSessions || [];

    if (!docs.length && !sessions.length) {
      contentEl.createEl("p", { text: this.t("noMemoryContext") });
      return;
    }

    if (docs.length) {
      contentEl.createEl("h3", { text: this.t("memoryFiles") });
      const list = contentEl.createEl("ul");
      for (const doc of docs) {
        list.createEl("li", { text: `${doc.category || "memory"}: ${doc.path}` });
      }
    }

    if (sessions.length) {
      contentEl.createEl("h3", { text: "Sesiones recientes" });
      const list = contentEl.createEl("ul");
      for (const session of sessions) {
        list.createEl("li", {
          text: `${session.createdAt || ""} ${session.summary || session.path || ""}`.trim()
        });
      }
    }
  }
}

class ContextManifestModal extends Modal {
  constructor(app, manifest, t = createTranslator("en")) {
    super(app);
    this.manifest = manifest || null;
    this.t = t;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("cortex-chat-manifest-modal");
    contentEl.createEl("h2", { text: this.t("manifestUsed") });

    if (!this.manifest) {
      contentEl.createEl("p", { text: this.t("manifestNone") });
      return;
    }

    const summary = contentEl.createDiv({ cls: "cortex-chat-manifest-modal-summary" });
    summary.createEl("div", { text: this.manifest.summary || "" });
    summary.createEl("small", { text: this.manifest.createdAt || "" });

    const sources = this.manifest.sources || {};
    for (const [key, group] of Object.entries(sources)) {
      const items = group?.items || [];
      const sectionEl = contentEl.createDiv({ cls: "cortex-chat-manifest-section" });
      sectionEl.createEl("h3", { text: `${group.label || key} (${items.length})` });
      if (!items.length) {
        sectionEl.createEl("p", { text: group.enabled === false ? this.t("sourceDisabled") : this.t("noRefs") });
        continue;
      }
      const list = sectionEl.createEl("ul");
      for (const item of items.slice(0, 20)) {
        list.createEl("li", { text: [item.path, item.reason || item.source].filter(Boolean).join(" · ") });
      }
    }

    const rawEl = contentEl.createEl("details");
    rawEl.createEl("summary", { text: "JSON" });
    rawEl.createEl("pre", { text: JSON.stringify(this.manifest, null, 2) });
  }
}

class ApprovedInsertionModal extends Modal {
  constructor(app, plugin, payload) {
    super(app);
    this.plugin = plugin;
    this.payload = payload || {};
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("cortex-chat-approval-modal");
    contentEl.createEl("h2", { text: this.plugin.t("reviewInsertTitle") });
    contentEl.createEl("p", { text: this.plugin.t("reviewInsertDesc") });

    const targetEl = contentEl.createDiv({ cls: "cortex-chat-approval-target" });
    targetEl.createDiv({ cls: "cortex-chat-context-label", text: this.plugin.t("targetNote") });
    targetEl.createDiv({ cls: "cortex-chat-context-value", text: this.payload.filePath || this.plugin.t("noNote") });

    contentEl.createEl("h3", { text: this.plugin.t("preview") });
    contentEl.createEl("pre", {
      cls: "cortex-chat-approval-preview",
      text: this.payload.insertion || ""
    });
    if (this.payload.diffPreview) {
      const diffHeader = contentEl.createDiv({ cls: "cortex-chat-approval-diff-header" });
      diffHeader.createEl("h3", { text: this.plugin.t("diffPreview") });
      diffHeader.createEl("span", {
        text: [
          this.plugin.t("linesAdded", { count: this.payload.diffPreview.added || 0 }),
          this.plugin.t("linesRemoved", { count: this.payload.diffPreview.removed || 0 })
        ].join(" · ")
      });
      contentEl.createEl("pre", {
        cls: "cortex-chat-approval-preview cortex-chat-approval-diff",
        text: this.payload.diffPreview.text || ""
      });
    }

    const actionsEl = contentEl.createDiv({ cls: "cortex-chat-approval-actions" });
    const cancelButton = actionsEl.createEl("button", { cls: "mod-muted", text: this.plugin.t("cancel") });
    cancelButton.addEventListener("click", () => {
      new Notice(this.plugin.t("editRejected"));
      this.close();
    });
    const applyButton = actionsEl.createEl("button", { cls: "mod-cta", text: this.plugin.t("apply") });
    applyButton.addEventListener("click", async () => {
      applyButton.disabled = true;
      await this.payload.onApply?.();
      this.close();
    });
  }
}

class CodexSetupModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.showFullDiagnostics = false;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("cortex-chat-setup-modal");
    const mobile = this.plugin.isMobileRuntime();
    contentEl.createEl("h2", { text: mobile ? this.plugin.t("setupMobileTitle") : this.plugin.t("setupDesktopTitle") });
    contentEl.createEl("p", {
      text:
        mobile
          ? this.plugin.t("remoteHttpsRequiredMobile")
          : this.plugin.t("setupDesktopDesc")
    });

    this.statusEl = contentEl.createDiv({ cls: "cortex-chat-setup-status" });
    this.renderStatus();

    const actionsEl = contentEl.createDiv({ cls: "cortex-chat-setup-actions" });
    if (mobile) {
      this.addAction(actionsEl, this.plugin.t("openAssistant"), "allowRemoteBackend", async () => {
        this.plugin.openPluginSettings();
      });
      this.addAction(actionsEl, this.plugin.t("check"), "codexSetupCompleted", async () => {
        await this.plugin.checkRemoteBackendForMobile({ notify: true });
        this.renderStatus();
      });
      return;
    }
    void this.plugin.checkCodexStatus({ notify: false, log: false }).finally(() => {
      this.renderStatus();
    });
    this.addAction(actionsEl, this.plugin.t("setupPrepare"), "codexSetupCompleted", async () => {
      await this.plugin.prepareCodexSetup({ notify: true });
      this.renderStatus();
    }, "mod-cta");
    this.addAction(actionsEl, this.plugin.t("setupRefresh"), "codexSetupCompleted", async () => {
      await this.plugin.autoCheckCodexSetup({ notify: true });
      this.renderStatus();
    });
    this.addAction(actionsEl, this.plugin.t("setupToggleDiagnostics"), "", async () => {
      this.showFullDiagnostics = !this.showFullDiagnostics;
      this.renderStatus();
    });
  }

  renderStatus() {
    if (!this.statusEl) {
      return;
    }
    this.statusEl.empty();
    if (this.plugin.isMobileRuntime()) {
      this.statusEl.createDiv({ text: this.plugin.t("status", { status: this.plugin.getMobileBackendStatus() }) });
      this.statusEl.createDiv({ text: this.plugin.t("backendStatus", { url: this.plugin.settings.backendUrl || "(unset)" }) });
      return;
    }
    const platform = this.plugin.resolveSetupPlatform();
    this.statusEl.createDiv({ text: this.plugin.t("setupHumanPlatform", { platform: platform.label }) });
    const runtime = this.plugin.getLinuxRuntimeKind();
    if (runtime === "flatpak") {
      const hostPermission = this.plugin.settings.flatpakHostBridgeOk ? this.plugin.t("setupFlatpakAllowed") : this.plugin.t("setupFlatpakBlocked");
      this.statusEl.createDiv({ text: this.plugin.t("setupHostPermission", { status: hostPermission }) });
      if (!this.plugin.settings.flatpakHostBridgeOk) {
        const repairEl = this.statusEl.createDiv({ cls: "cortex-chat-setup-inline-action" });
        repairEl.createSpan({ text: this.plugin.t("setupFlatpakNeedsRepair") });
        const repairButton = repairEl.createEl("button", { text: this.plugin.t("setupRepairFlatpak") });
        repairButton.addEventListener("click", async () => {
          await this.plugin.copyFlatpakRepairCommand();
          this.renderStatus();
        });
      }
    }
    const rawStatus = this.plugin.settings.codexStatus || "";
    const isLocalBackendPending = /local configuration pending|configuración local pendiente/i.test(rawStatus);
    const status = isLocalBackendPending && (this.plugin.settings.codexInstalledOk || this.plugin.settings.codexLoginOk)
      ? this.plugin.t("codexLoginDetected")
      : rawStatus || this.plugin.t("pending");
    this.statusEl.createDiv({ text: this.plugin.t("status", { status }) });
    if (this.plugin.settings.codexLastCheck) {
      this.statusEl.createDiv({ text: this.plugin.t("lastCheck", { time: this.plugin.settings.codexLastCheck }) });
    }
    if (this.showFullDiagnostics) {
      this.renderSetupChecks();
      this.statusEl.createDiv({ text: this.plugin.t("setupRuntime", { runtime }) });
      if (this.plugin.settings.codexVersion) {
        this.statusEl.createDiv({ text: this.plugin.t("version", { version: this.plugin.settings.codexVersion }) });
      }
      if (this.plugin.settings.localCodexCommandDisplay) {
        this.statusEl.createDiv({ text: this.plugin.t("setupStrategy", { strategy: this.plugin.settings.localCodexCommandDisplay }) });
      }
      if (this.plugin.settings.codexDiagnosticSummary) {
        this.statusEl.createDiv({ text: this.plugin.t("setupDiagnostics", { summary: this.plugin.compactSetupText(this.plugin.settings.codexDiagnosticSummary, 360) }) });
      }
      if (this.plugin.settings.codexDiagnosticDetail) {
        this.statusEl.createEl("pre", {
          cls: "cortex-chat-setup-diagnostics",
          text: this.plugin.settings.codexDiagnosticDetail
        });
      }
      this.renderSetupLog();
      const clearButton = this.statusEl.createEl("button", { text: this.plugin.t("setupClearLog") });
      clearButton.addEventListener("click", async () => {
        await this.plugin.clearSetupLog();
        this.renderStatus();
      });
    }
  }

  renderSetupChecks() {
    const checksEl = this.statusEl.createDiv({ cls: "cortex-chat-setup-checks" });
    checksEl.createEl("h4", { text: this.plugin.t("setupChecks") });
    const checks = [
      [this.plugin.t("setupNode"), this.plugin.settings.nodeAvailableOk, this.plugin.settings.nodeVersion || this.plugin.t("setupPending")],
      [this.plugin.t("setupNpm"), this.plugin.settings.npmAvailableOk, this.plugin.settings.npmVersion || this.plugin.t("setupNpmOptionalDetail")],
      [this.plugin.t("setupCli"), this.plugin.settings.codexInstalledOk, this.plugin.settings.codexVersion || this.plugin.settings.localCodexCommandDisplay || this.plugin.t("setupPending")],
      [this.plugin.t("setupOauth"), this.plugin.settings.codexLoginOk, this.plugin.settings.codexLoginOk ? this.plugin.t("codexLoginDetected") : this.plugin.t("setupPending")],
      [this.plugin.t("setupExecution"), this.plugin.settings.codexExecutionOk, this.plugin.settings.codexExecutionOk ? this.plugin.t("codexOauthOk") : this.plugin.t("setupPending")],
      [this.plugin.t("setupDevice"), this.plugin.settings.deviceRegisteredOk, this.plugin.settings.deviceRegisteredOk ? this.plugin.t("registered") : this.plugin.t("setupOptional")],
      [this.plugin.t("setupBackend"), false, this.plugin.t("setupOptional")]
    ];
    for (const [label, ok, detail] of checks) {
      const rowEl = checksEl.createDiv({ cls: `cortex-chat-setup-check ${ok ? "is-ok" : "is-pending"}` });
      rowEl.createSpan({ text: `${ok ? this.plugin.t("setupOk") : this.plugin.t("setupPending")} · ${label}` });
      rowEl.createSpan({ text: detail || "" });
    }
  }

  renderSetupLog() {
    const logEl = this.statusEl.createDiv({ cls: "cortex-chat-setup-log" });
    logEl.createEl("h4", { text: this.plugin.t("setupLog") });
    const entries = this.plugin.getSetupLogEntries().slice(0, 3);
    if (!entries.length) {
      logEl.createDiv({ text: this.plugin.t("setupLogEmpty") });
      return;
    }
    for (const entry of entries) {
      const lineEl = logEl.createDiv({ cls: `cortex-chat-setup-log-line is-${entry.level || "info"}` });
      lineEl.createSpan({ text: `${entry.time || ""} · ${entry.action || ""}` });
      if (entry.detail) {
        lineEl.createDiv({ text: this.plugin.compactSetupText(entry.detail, 260) });
      }
    }
  }

  addAction(parentEl, label, statusKey, onClick, extraClass = "") {
    const button = parentEl.createEl("button", { cls: `cortex-chat-setup-action ${extraClass}`.trim() });
    this.renderActionButton(button, label, statusKey);
    button.addEventListener("click", async () => {
      button.disabled = true;
      this.renderActionButton(button, this.plugin.t("preparingResponse"), statusKey);
      try {
        await onClick();
      } catch (error) {
        new Notice(error.message);
      } finally {
        button.disabled = false;
        this.renderActionButton(button, label, statusKey);
        this.renderStatus();
      }
    });
  }

  renderActionButton(button, label, statusKey) {
    button.empty();
    const ok = Boolean(this.plugin.settings[statusKey]);
    button.createSpan({
      cls: `cortex-chat-setup-badge ${ok ? "is-ok" : "is-pending"}`,
      text: ok ? "✓" : "•"
    });
    button.createSpan({ text: label });
  }
}

class CortexChatView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tabs = [];
    this.activeTabId = "";
    this.messages = [];
    this.threadId = null;
    this.context = null;
    this.contextExpanded = false;
    this.isSending = false;
    this.mentionState = {
      open: false,
      type: "mention",
      query: "",
      range: null,
      items: [],
      selectedIndex: 0
    };
    this.lastPendingStatus = "";
    this.keydownHandler = null;
    this.historyMenuOpen = false;
    this.historyDocumentHandler = null;
    this.folderPickerEl = null;
    this.folderPickerOutsideHandler = null;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return this.plugin.t("appTitle");
  }

  getIcon() {
    return "bot";
  }

  async onOpen() {
    this.restoreTabs();
    this.render();
  }

  async onClose() {
    if (this.keydownHandler) {
      this.contentEl?.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.historyDocumentHandler) {
      this.contentEl?.ownerDocument?.removeEventListener("click", this.historyDocumentHandler);
      this.historyDocumentHandler = null;
    }
    this.closeFolderPicker();
  }

  async prepareContext(context) {
    this.setActiveTabState({
      context,
      threadId: null,
      messages: [],
      title: context?.title || context?.path || this.plugin.t("untitledTab"),
      contextSummary: this.describeContext(context)
    });
    this.plugin.setLastResponse(null);
    this.render();
  }

  appendMessage(role, content, meta = {}) {
    const id = makeId("msg");
    const tab = this.getActiveTab();
    tab.messages.push({ id, role, content, meta });
    tab.messages = tab.messages.slice(-40);
    tab.updatedAt = new Date().toISOString();
    this.syncActiveFields();
    void this.persistTabs();
    this.renderMessages();
    this.renderTabBar();
    return id;
  }

  updateMessage(id, content, meta = {}) {
    const tab = this.getActiveTab();
    const message = tab.messages.find((entry) => entry.id === id);
    if (!message) {
      return;
    }
    message.content = content;
    message.meta = { ...(message.meta || {}), ...meta };
    tab.updatedAt = new Date().toISOString();
    this.syncActiveFields();
    void this.persistTabs();
    this.renderMessages();
    this.renderTabBar();
  }

  restoreTabs() {
    const rawTabs = Array.isArray(this.plugin.settings.chatTabs) ? this.plugin.settings.chatTabs : [];
    this.tabs = rawTabs.map((tab) => normalizeChatTab(tab, this.plugin.t)).slice(0, MAX_CHAT_TABS);
    if (!this.tabs.length) {
      this.tabs = [createDefaultChatTab(this.plugin.t)];
    }
    const configuredActiveId = this.plugin.settings.activeChatTabId;
    const active = this.tabs.find((tab) => tab.id === configuredActiveId) || this.tabs.find((tab) => tab.isActive) || this.tabs[0];
    this.activeTabId = active.id;
    this.tabs.forEach((tab) => {
      tab.isActive = tab.id === this.activeTabId;
    });
    this.syncActiveFields();
    void this.persistTabs();
  }

  getActiveTab() {
    let tab = this.tabs.find((entry) => entry.id === this.activeTabId);
    if (!tab) {
      tab = this.tabs[0] || createDefaultChatTab(this.plugin.t);
      if (!this.tabs.length) {
        this.tabs.push(tab);
      }
      this.activeTabId = tab.id;
    }
    return tab;
  }

  getTab(tabId) {
    return this.tabs.find((entry) => entry.id === tabId) || null;
  }

  syncActiveFields() {
    const tab = this.getActiveTab();
    this.threadId = tab.threadId || null;
    this.messages = tab.messages || [];
    this.context = tab.context || null;
  }

  setActiveTabState(patch) {
    const tab = this.getActiveTab();
    this.setTabState(tab.id, patch);
  }

  setTabState(tabId, patch) {
    const tab = this.getTab(tabId);
    if (!tab) {
      return;
    }
    Object.assign(tab, patch, {
      updatedAt: new Date().toISOString()
    });
    tab.contextSummary = tab.contextSummary || this.describeContext(tab.context);
    if (tab.id === this.activeTabId) {
      this.syncActiveFields();
    }
    void this.persistTabs();
  }

  updateMessageInTab(tabId, id, content, meta = {}) {
    const tab = this.getTab(tabId);
    if (!tab) {
      return;
    }
    const message = tab.messages.find((entry) => entry.id === id);
    if (!message) {
      return;
    }
    message.content = content;
    message.meta = { ...(message.meta || {}), ...meta };
    tab.updatedAt = new Date().toISOString();
    if (tab.id === this.activeTabId) {
      this.syncActiveFields();
      this.renderMessages();
    } else {
      tab.needsAttention = true;
    }
    void this.persistTabs();
    this.renderTabBar();
  }

  serializeTabs() {
    return this.tabs.map((tab) => ({
      id: tab.id,
      threadId: tab.threadId || null,
      title: tab.title || this.plugin.t("untitledTab"),
      createdAt: tab.createdAt,
      updatedAt: tab.updatedAt,
      messages: (tab.messages || []).slice(-40),
      context: tab.context || null,
      contextSummary: tab.contextSummary || "",
      pinnedContext: (tab.pinnedContext || []).slice(-12),
      isActive: tab.id === this.activeTabId,
      isStreaming: Boolean(tab.isStreaming),
      needsAttention: Boolean(tab.needsAttention)
    }));
  }

  async persistTabs() {
    this.plugin.settings.chatTabs = this.serializeTabs();
    this.plugin.settings.activeChatTabId = this.activeTabId;
    await this.plugin.saveSettings();
  }

  describeContext(context) {
    if (!context) {
      return "";
    }
    const refs = context.references?.length || 0;
    return `${context.title || context.path || this.plugin.t("noNote")} · ${refs ? this.plugin.t("referenceCount", { count: refs }) : this.plugin.t("noRefs")}`;
  }

  applyUiScale() {
    if (!this.contentEl) {
      return;
    }
    this.contentEl.style.setProperty("--cortex-chat-scale", String(this.plugin.getUiScale()));
    this.contentEl.toggleClass("is-density-comfortable", this.getUiDensity() === "comfortable");
    this.contentEl.toggleClass("is-density-compact", this.getUiDensity() !== "comfortable");
    this.contentEl.toggleClass("is-tabbar-header", this.getTabBarPosition() === "header");
    this.contentEl.toggleClass("is-tabbar-composer", this.getTabBarPosition() === "composer");
  }

  getUiDensity() {
    return this.plugin.settings.uiDensity || DEFAULT_SETTINGS.uiDensity;
  }

  getTabBarPosition() {
    return this.plugin.settings.tabBarPosition || DEFAULT_SETTINGS.tabBarPosition;
  }

  registerScaleShortcuts() {
    if (!this.contentEl) {
      return;
    }
    if (this.keydownHandler) {
      this.contentEl.removeEventListener("keydown", this.keydownHandler);
    }
    this.keydownHandler = async (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }
      if (event.altKey) {
        return;
      }

      const key = String(event.key || "");
      if (key === "+" || key === "=") {
        event.preventDefault();
        await this.plugin.adjustUiScale(UI_SCALE_STEP);
        return;
      }
      if (key === "-" || key === "_") {
        event.preventDefault();
        await this.plugin.adjustUiScale(-UI_SCALE_STEP);
        return;
      }
      if (key === "0") {
        event.preventDefault();
        await this.plugin.resetUiScale();
      }
    };
    this.contentEl.addEventListener("keydown", this.keydownHandler);
  }

  getFolderReviewStatus(message, context) {
    const folderReference = (context?.references || []).find((reference) => reference.source === "folder");
    if (!folderReference) {
      const normalizedMessage = String(message || "").toLowerCase();
      if (!wantsFolderContext(normalizedMessage, this.plugin.settings.folderReferenceRoots)) {
        return "";
      }
      const roots = normalizeFolderRoots(this.plugin.settings.folderReferenceRoots);
      if (!roots.length) {
        return "";
      }
      return this.plugin.t("folderReview", { folder: roots[0] });
    }
    const firstSegment = String(folderReference.path || "")
      .split("/")
      .filter(Boolean)
      .slice(0, 2)
      .join("/");
    const label = firstSegment || folderReference.token || folderReference.title || this.plugin.t("configuredFolderToken");
    return this.plugin.t("folderReview", { folder: label });
  }

  setPendingStatus(id, status, meta = {}, tabId = this.activeTabId) {
    this.lastPendingStatus = meta.substatus || status;
    this.updateMessageInTab(tabId, id, "", {
      loading: true,
      status,
      ...meta
    });
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("cortex-chat-view");
    contentEl.setAttr("tabindex", "0");
    this.applyUiScale();
    this.registerScaleShortcuts();
    this.registerTooltipHandlers(contentEl);

    this.headerEl = contentEl.createDiv({ cls: "cortex-chat-header" });
    this.headerMainEl = this.headerEl.createDiv({ cls: "cortex-chat-header-main" });
    this.headerTabSlotEl = this.headerEl.createDiv({ cls: "cortex-chat-header-tabslot" });
    this.messagesEl = contentEl.createDiv({ cls: "cortex-chat-messages" });
    this.sendEl = contentEl.createDiv({ cls: "cortex-chat-send" });
    this.sendEl.setAttr("data-drop-hint", this.plugin.t("dropContextHint"));
    this.registerContextDropHandlers();
    this.tabBarEl = this.sendEl.createDiv({ cls: "cortex-chat-tabbar cortex-chat-tabbar--composer" });
    this.contextEl = this.sendEl.createDiv({ cls: "cortex-chat-context" });
    this.modeCardsEl = this.sendEl.createDiv({ cls: "cortex-chat-mode-cards" });
    this.renderModeCards();

    this.suggestionsEl = this.sendEl.createDiv({
      cls: "cortex-chat-suggestions suggestion-container"
    });
    this.suggestionsEl.hide();

    this.composerRowEl = this.sendEl.createDiv({ cls: "cortex-chat-composer-row" });
    this.inputEl = this.composerRowEl.createEl("textarea", {
      attr: {
        placeholder: this.plugin.t("askPlaceholder")
      }
    });
    this.inputEl.addClass("cortex-chat-input");

    this.inputEl.addEventListener("input", () => {
      this.autoResizeInput();
      this.updateMentionSuggestions();
    });

    this.inputEl.addEventListener("click", () => {
      this.updateMentionSuggestions();
    });

    this.inputEl.addEventListener("keydown", async (event) => {
      if (this.handleMentionNavigation(event)) {
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        await this.sendMessage();
      }
    });

    this.inputEl.addEventListener("blur", () => {
      window.setTimeout(() => this.hideMentionSuggestions(), 120);
    });

    this.sendButtonEl = this.composerRowEl.createEl("button", {
      cls: "cortex-chat-send-button",
      attr: { "aria-label": this.plugin.t("sendMessage") }
    });
    setIcon(this.sendButtonEl, "send-horizontal");
    this.sendButtonEl.addEventListener("click", async () => {
      await this.sendMessage();
    });
    this.composerToolbarEl = this.sendEl.createDiv({ cls: "cortex-chat-composer-toolbar" });

    this.renderHeader();
    this.renderTabBar();
    this.renderContext();
    this.renderComposerToolbar();
    this.renderMessages();
    this.autoResizeInput();
    if (this.isSending) {
      this.setSending(true);
    }
  }

  renderModeCards() {
    if (!this.modeCardsEl) {
      return;
    }

    this.modeCardsEl.empty();
    this.addSegmentedSetting({
      settingKey: "defaultInteractionMode",
      title: this.plugin.t("defaultWorkMode"),
      values: {
        plan: { label: this.plugin.t("planner"), detail: this.plugin.t("copilot") },
        execute: { label: this.plugin.t("execute"), detail: this.plugin.t("unrestricted") }
      }
    });
  }

  addSegmentedSetting(config) {
    const current = this.plugin.settings[config.settingKey] || DEFAULT_SETTINGS[config.settingKey];
    const active = config.values[current] || config.values[Object.keys(config.values)[0]];
    const groupEl = this.modeCardsEl.createDiv({ cls: "cortex-chat-mode-group cortex-chat-workmode-pill" });
    const headerEl = groupEl.createDiv({ cls: "cortex-chat-mode-group-header" });
    headerEl.createSpan({ cls: "cortex-chat-mode-group-title", text: config.title });
    if (active?.detail) {
      headerEl.createSpan({ cls: "cortex-chat-mode-group-hint", text: active.detail });
    }
    const segmentedEl = groupEl.createDiv({ cls: "cortex-chat-mode-segmented" });
    for (const [value, option] of Object.entries(config.values)) {
      const buttonEl = segmentedEl.createEl("button", {
        cls: `cortex-chat-mode-segment${value === current ? " is-active" : ""}`,
        attr: {
          "aria-label": `${config.title}: ${option.label}`,
          "aria-pressed": String(value === current),
          "data-tooltip": option.detail ? `${option.label} · ${option.detail}` : option.label
        }
      });
      buttonEl.createSpan({ cls: "cortex-chat-mode-segment-label", text: option.label });
      if (option.detail) {
        buttonEl.createSpan({ cls: "cortex-chat-mode-segment-detail", text: option.detail });
      }
      buttonEl.addEventListener("click", async () => {
        if (this.plugin.settings[config.settingKey] === value) {
          return;
        }
        this.plugin.settings[config.settingKey] = value;
        await this.plugin.saveSettings();
        this.renderModeCards();
        this.renderHeader();
      });
    }
  }

  getActiveProviderBadge() {
    const activeTab = this.getActiveTab();
    const lastAssistantMessage = [...(activeTab.messages || [])].reverse().find((entry) => entry.role === "assistant");
    return lastAssistantMessage?.meta?.label || this.plugin.t("codexOauthProvider");
  }

  ensureHistoryDismissHandler() {
    if (this.historyDocumentHandler) {
      return;
    }
    this.historyDocumentHandler = (event) => {
      if (!this.historyMenuOpen || !this.historyWrapEl) {
        return;
      }
      if (this.historyWrapEl.contains(event.target)) {
        return;
      }
      this.closeHistoryMenu();
    };
    this.contentEl?.ownerDocument?.addEventListener("click", this.historyDocumentHandler);
  }

  toggleHistoryMenu() {
    this.historyMenuOpen = !this.historyMenuOpen;
    this.renderHistoryMenu();
  }

  closeHistoryMenu() {
    if (!this.historyMenuOpen) {
      return;
    }
    this.historyMenuOpen = false;
    this.renderHistoryMenu();
  }

  getRecentTabEntries() {
    return [...this.tabs].sort((left, right) => {
      const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime();
      const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime();
      return rightTime - leftTime;
    });
  }

  formatTabTimestamp(tab) {
    const raw = tab.updatedAt || tab.createdAt;
    if (!raw) {
      return "";
    }
    try {
      return new Date(raw).toLocaleString();
    } catch {
      return "";
    }
  }

  renderHistoryMenu() {
    if (!this.historyMenuEl) {
      return;
    }
    this.historyMenuEl.empty();
    this.historyMenuEl.toggleClass("is-open", this.historyMenuOpen);
    if (!this.historyMenuOpen) {
      return;
    }
    this.historyMenuEl.createDiv({ cls: "cortex-chat-history-title", text: this.plugin.t("recentChats") });
    const entries = this.getRecentTabEntries();
    if (!entries.length) {
      this.historyMenuEl.createDiv({ cls: "cortex-chat-history-empty", text: this.plugin.t("noRecentChats") });
      return;
    }
    for (const tab of entries) {
      const itemEl = this.historyMenuEl.createEl("button", {
        cls: `cortex-chat-history-item${tab.id === this.activeTabId ? " is-active" : ""}`,
        attr: {
          "aria-label": this.plugin.t("openConversation"),
          "data-tooltip": `${tab.title || this.plugin.t("untitledTab")}${this.formatTabTimestamp(tab) ? ` · ${this.formatTabTimestamp(tab)}` : ""}`
        }
      });
      const titleRowEl = itemEl.createDiv({ cls: "cortex-chat-history-row" });
      titleRowEl.createSpan({ cls: "cortex-chat-history-item-title", text: tab.title || this.plugin.t("untitledTab") });
      if (tab.id === this.activeTabId) {
        titleRowEl.createSpan({ cls: "cortex-chat-history-item-badge", text: this.plugin.t("activeTabLabel") });
      }
      itemEl.createDiv({
        cls: "cortex-chat-history-item-meta",
        text: tab.contextSummary || this.formatTabTimestamp(tab) || this.plugin.t("openConversation")
      });
      itemEl.addEventListener("click", async () => {
        this.closeHistoryMenu();
        await this.activateTab(tab.id);
      });
    }
  }

  renderHeader() {
    if (!this.headerMainEl) {
      return;
    }
    this.headerMainEl.empty();
    if (this.headerDiagnosticsEl) {
      this.headerDiagnosticsEl.remove();
      this.headerDiagnosticsEl = null;
    }
    const leftEl = this.headerMainEl.createDiv({ cls: "cortex-chat-header-left" });
    const titleClusterEl = leftEl.createDiv({ cls: "cortex-chat-title-cluster" });
    titleClusterEl.createDiv({ cls: "cortex-chat-title", text: this.plugin.t("appTitle") });
    const state = this.getCodexState();
    const stateEl = titleClusterEl.createDiv({ cls: `cortex-chat-state is-${state.kind}` });
    stateEl.createSpan({ cls: "cortex-chat-state-dot" });
    stateEl.createSpan({ text: state.label });
    const isExecute = (this.plugin.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode) === "execute";
    if (isExecute) {
      const badgesEl = leftEl.createDiv({ cls: "cortex-chat-header-badges" });
      badgesEl.createDiv({ cls: "cortex-chat-header-mode-chip is-unrestricted", text: this.plugin.t("unrestricted") });
    }
  }

  getCodexState() {
    if (this.plugin.isMobileRuntime()) {
      return this.plugin.canUseRemoteBackend()
        ? { kind: "ready", label: this.plugin.t("backendProvider") }
        : { kind: "pending", label: this.plugin.t("setup") };
    }
    const status = String(this.plugin.settings.codexStatus || "").toLowerCase();
    if (this.plugin.settings.codexSetupCompleted || /probado correctamente|oauth detectado/.test(status)) {
      return { kind: "ready", label: this.plugin.t("ready") };
    }
    if (/local configuration pending|configuración local pendiente/.test(status) && (this.plugin.settings.codexInstalledOk || this.plugin.settings.codexLoginOk)) {
      return { kind: "pending", label: this.plugin.t("pending") };
    }
    if (/error|no disponible|no pudo|no se pudo/.test(status)) {
      return { kind: "error", label: this.plugin.t("error") };
    }
    return { kind: "pending", label: this.plugin.t("pending") };
  }

  renderTabBar() {
    if (!this.tabBarEl) {
      return;
    }
    this.tabBarEl.empty();
    this.tabBarEl.removeClass("is-hidden");
    this.tabs.forEach((tab, index) => {
      const title = tab.title && tab.title !== this.plugin.t("untitledTab") ? tab.title : String(index + 1);
      const button = this.tabBarEl.createEl("button", {
        cls: `cortex-chat-tab${tab.id === this.activeTabId ? " is-active" : ""}${tab.isStreaming ? " is-streaming" : ""}${tab.needsAttention ? " needs-attention" : ""}`,
        attr: {
          "aria-pressed": String(tab.id === this.activeTabId),
          "data-tooltip": tab.title || this.plugin.t("untitledTab")
        }
      });
      button.createSpan({ cls: "cortex-chat-tab-title", text: title });
      if (this.tabs.length > 1) {
        const close = button.createEl("button", {
          cls: "cortex-chat-tab-close",
          attr: {
            type: "button",
            "aria-label": this.plugin.t("closeTab"),
            "data-tooltip": this.plugin.t("closeTab")
          }
        });
        setIcon(close, "x");
        close.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          await this.closeTab(tab.id);
        });
      }
      button.addEventListener("click", async () => {
        await this.activateTab(tab.id);
      });
    });
    const addButton = this.tabBarEl.createEl("button", {
      cls: `cortex-chat-tab cortex-chat-tab-add${this.tabs.length >= MAX_CHAT_TABS ? " is-disabled" : ""}`,
      attr: {
        "aria-label": this.plugin.t("newTab"),
        "data-tooltip": this.tabs.length >= MAX_CHAT_TABS ? this.plugin.t("tabLimitTooltip", { count: MAX_CHAT_TABS }) : this.plugin.t("newTab")
      }
    });
    addButton.disabled = this.tabs.length >= MAX_CHAT_TABS;
    setIcon(addButton, "plus");
    addButton.addEventListener("click", async () => {
      if (this.tabs.length >= MAX_CHAT_TABS) {
        new Notice(this.plugin.t("tabLimitReached", { count: MAX_CHAT_TABS }));
        return;
      }
      await this.createNewTab();
    });
  }

  registerTooltipHandlers(rootEl) {
    this.hideTooltip();
    rootEl.addEventListener("pointerover", (event) => {
      const target = event.target?.closest?.("[data-tooltip]");
      if (!target || !rootEl.contains(target)) {
        return;
      }
      this.scheduleTooltip(target);
    });
    rootEl.addEventListener("pointerout", (event) => {
      const target = event.target?.closest?.("[data-tooltip]");
      if (!target) {
        return;
      }
      if (!event.relatedTarget || !target.contains(event.relatedTarget)) {
        this.hideTooltip();
      }
    });
    rootEl.addEventListener("pointermove", () => this.hideTooltip());
    rootEl.addEventListener("click", () => this.hideTooltip(), true);
    rootEl.addEventListener("keydown", () => this.hideTooltip(), true);
    rootEl.addEventListener("scroll", () => this.hideTooltip(), true);
  }

  scheduleTooltip(targetEl) {
    this.hideTooltip();
    const text = String(targetEl?.getAttribute?.("data-tooltip") || "").trim();
    if (!text) {
      return;
    }
    this.tooltipTimer = window.setTimeout(() => {
      this.showTooltip(targetEl, text);
    }, 2000);
  }

  showTooltip(targetEl, text) {
    if (!targetEl?.isConnected || !this.contentEl?.isConnected) {
      return;
    }
    const tooltipEl = this.contentEl.ownerDocument.createElement("div");
    tooltipEl.className = "cortex-chat-floating-tooltip";
    tooltipEl.textContent = text;
    this.contentEl.ownerDocument.body.appendChild(tooltipEl);
    this.tooltipEl = tooltipEl;
    this.positionTooltip(targetEl);
  }

  positionTooltip(targetEl) {
    if (!this.tooltipEl || !targetEl?.getBoundingClientRect) {
      return;
    }
    const rect = targetEl.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const margin = 8;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const left = Math.max(margin, Math.min(rect.left + rect.width / 2 - tooltipRect.width / 2, viewportWidth - tooltipRect.width - margin));
    const top = Math.max(margin, rect.top - tooltipRect.height - 10);
    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;
  }

  hideTooltip() {
    if (this.tooltipTimer) {
      window.clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
    this.tooltipEl?.remove();
    this.tooltipEl = null;
  }

  getPromptProfileOptions() {
    return [
      ["planner", this.plugin.t("profilePlanner")],
      ["researcher", this.plugin.t("profileResearcher")],
      ["editor", this.plugin.t("profileEditor")],
      ["safe-executor", this.plugin.t("profileSafeExecutor")]
    ];
  }

  getActivePromptProfileLabel() {
    const current = normalizePromptProfile(this.plugin.settings.activePromptProfile);
    return this.getPromptProfileOptions().find(([value]) => value === current)?.[1] || this.plugin.t("profilePlanner");
  }

  registerContextDropHandlers() {
    if (!this.sendEl) {
      return;
    }
    this.sendEl.addEventListener("dragover", (event) => {
      if (this.plugin.extractVaultPathFromDataTransfer(event.dataTransfer)) {
        event.preventDefault();
        this.sendEl.addClass("is-drag-over");
      }
    });
    this.sendEl.addEventListener("dragleave", (event) => {
      if (!this.sendEl.contains(event.relatedTarget)) {
        this.sendEl.removeClass("is-drag-over");
      }
    });
    this.sendEl.addEventListener("drop", async (event) => {
      const vaultPath = this.plugin.extractVaultPathFromDataTransfer(event.dataTransfer);
      this.sendEl.removeClass("is-drag-over");
      if (!vaultPath) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      await this.addDroppedVaultContext(vaultPath);
    });
  }

  async addDroppedVaultContext(vaultPath) {
    const item = this.app.vault.getAbstractFileByPath(vaultPath);
    if (!item) {
      new Notice(this.plugin.t("unsupportedDrop"));
      return;
    }
    if (item.children) {
      await this.selectFolderContext(item.path);
      return;
    }
    const baseContext = this.context || (await this.plugin.captureCurrentContext(false));
    const reference = await this.plugin.buildReferenceFromFile(item, "drop", item.basename || item.name || item.path);
    const nextContext = {
      ...baseContext,
      references: mergeReferences(baseContext.references || [], [reference])
    };
    this.setActiveTabState({
      context: nextContext,
      contextSummary: this.describeContext(nextContext)
    });
    this.renderContext();
    this.renderComposerToolbar();
    new Notice(this.plugin.t("droppedContextAdded", { path: item.path }));
  }

  renderComposerToolbar() {
    if (!this.composerToolbarEl) {
      return;
    }
    this.composerToolbarEl.empty();
    const leftEl = this.composerToolbarEl.createDiv({ cls: "cortex-chat-composer-toolbar-left" });
    const rightEl = this.composerToolbarEl.createDiv({ cls: "cortex-chat-composer-toolbar-right" });
    const presetButton = leftEl.createEl("button", {
      cls: "cortex-chat-toolbar-pill",
      text: this.getActivePromptProfileLabel(),
      attr: { "aria-label": this.plugin.t("selectPreset"), "data-tooltip": this.plugin.t("selectPreset") }
    });
    presetButton.addEventListener("click", (event) => this.openPresetMenu(event));
    const isExecute = (this.plugin.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode) === "execute";
    const modeButton = leftEl.createEl("button", {
      cls: `cortex-chat-mode-selector${isExecute ? " is-write" : " is-read"}`,
      attr: {
        "aria-label": this.plugin.t("toggleWorkMode"),
        "data-tooltip": this.plugin.t("toggleWorkMode")
      }
    });
    modeButton.createSpan({ cls: "cortex-chat-mode-selector-knob" });
    modeButton.createSpan({ cls: "cortex-chat-mode-selector-label", text: isExecute ? this.plugin.t("writeMode") : this.plugin.t("readMode") });
    modeButton.addEventListener("click", async () => {
      this.plugin.settings.defaultInteractionMode = isExecute ? "plan" : "execute";
      await this.plugin.saveSettings();
      this.renderComposerToolbar();
      this.renderHeader();
    });
    const skillsButton = leftEl.createEl("button", {
      cls: "cortex-chat-toolbar-pill",
      text: this.plugin.t("skills"),
      attr: { "aria-label": this.plugin.t("skillsTitle"), "data-tooltip": this.plugin.t("skillsTitle") }
    });
    skillsButton.addEventListener("click", (event) => this.openSkillsMenu(event));
    const folderButton = this.createIconButton(rightEl, "folder", this.plugin.t("selectVaultFolder"), "cortex-chat-toolbar-icon");
    folderButton.addEventListener("click", (event) => this.openFolderContextMenu(event));
    const noteButton = this.createIconButton(rightEl, "file-text", this.plugin.t("activeNote"), "cortex-chat-toolbar-icon");
    noteButton.addEventListener("click", async () => this.loadCurrentNoteContext());
    const mentionButton = this.createIconButton(rightEl, "at-sign", "@", "cortex-chat-toolbar-icon");
    mentionButton.addEventListener("click", () => this.insertMentionTrigger());
    this.historyWrapEl = rightEl.createDiv({ cls: "cortex-chat-history-wrap" });
    const historyButton = this.createIconButton(this.historyWrapEl, "history", this.plugin.t("history"), "cortex-chat-toolbar-icon");
    historyButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleHistoryMenu();
    });
    this.historyMenuEl = this.historyWrapEl.createDiv({ cls: "cortex-chat-history-menu" });
    const newChatButton = this.createIconButton(rightEl, "square-pen", this.plugin.t("newChatReady"), "cortex-chat-toolbar-icon");
    newChatButton.addEventListener("click", () => this.startNewChat());
    const actionsButton = this.createIconButton(rightEl, "settings", this.plugin.t("consistencyDiagnostics"), "cortex-chat-toolbar-icon");
    actionsButton.addEventListener("click", (event) => this.openActionsMenu(event));
    const detailsButton = rightEl.createEl("button", {
      cls: "cortex-chat-toolbar-pill",
      text: this.plugin.t("details"),
      attr: { "aria-label": this.plugin.t("contextDetails"), "data-tooltip": this.plugin.t("contextDetails") }
    });
    detailsButton.addEventListener("click", () => {
      this.contextExpanded = !this.contextExpanded;
      this.renderContext();
    });
    this.ensureHistoryDismissHandler();
    this.renderHistoryMenu();
  }

  openPresetMenu(event) {
    const menu = new Menu();
    const current = normalizePromptProfile(this.plugin.settings.activePromptProfile);
    for (const [value, label] of this.getPromptProfileOptions()) {
      menu.addItem((item) =>
        item
          .setTitle(label)
          .setChecked(current === value)
          .onClick(async () => {
            this.plugin.settings.activePromptProfile = value;
            await this.plugin.saveSettings();
            this.renderComposerToolbar();
          })
      );
    }
    menu.showAtMouseEvent(event);
  }

  async openSkillsMenu(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const menu = new Menu();
    const skills = await this.plugin.listVaultSkills();
    const enabledIds = new Set(normalizeSkillIds(this.plugin.settings.enabledSkillIds));
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("skillContextSummary", { enabled: enabledIds.size, total: skills.length }))
        .setDisabled(true)
    );
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("skillsEnabled"))
        .setChecked(this.plugin.settings.skillsEnabled === true)
        .onClick(async () => {
          this.plugin.settings.skillsEnabled = this.plugin.settings.skillsEnabled !== true;
          await this.plugin.saveSettings();
          this.renderComposerToolbar();
        })
    );
    if (!skills.length) {
      menu.addItem((item) => item.setTitle(this.plugin.t("noSkillsFound", { root: this.plugin.settings.skillsRoot || DEFAULT_SETTINGS.skillsRoot })).setDisabled(true));
      menu.addItem((item) =>
        item.setTitle(this.plugin.t("createExampleSkill")).onClick(async () => {
          await this.plugin.ensureExampleSkill();
          await this.plugin.saveSettings();
          new Notice(this.plugin.t("exampleSkillCreated"));
          this.renderComposerToolbar();
        })
      );
    }
    for (const skill of skills) {
      menu.addItem((item) =>
        item
          .setTitle(skill.name || skill.id)
          .setChecked(enabledIds.has(skill.id))
          .onClick(async () => {
            if (enabledIds.has(skill.id)) {
              enabledIds.delete(skill.id);
            } else {
              enabledIds.add(skill.id);
            }
            this.plugin.settings.enabledSkillIds = normalizeSkillIds(Array.from(enabledIds));
            this.plugin.settings.skillsEnabled = true;
            await this.plugin.saveSettings();
            this.renderComposerToolbar();
          })
      );
    }
    menu.showAtMouseEvent(event);
  }

  getVaultFolders() {
    return this.app.vault
      .getAllLoadedFiles()
      .filter((entry) => entry?.children && entry.path && !isIgnoredVaultPath(entry.path))
      .map((entry) => entry.path)
      .sort((left, right) => left.localeCompare(right, this.plugin.getLanguage(), { sensitivity: "base" }));
  }

  openFolderContextMenu(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (this.folderPickerEl) {
      this.closeFolderPicker();
      return;
    }
    const folders = this.getVaultFolders();
    const selected = normalizeFolderRoots(this.plugin.settings.folderReferenceRoots);
    const pickerEl = this.sendEl.createDiv({ cls: "cortex-chat-folder-picker" });
    this.folderPickerEl = pickerEl;
    const headerEl = pickerEl.createDiv({ cls: "cortex-chat-folder-picker-header" });
    headerEl.createDiv({ cls: "cortex-chat-folder-picker-title", text: this.plugin.t("selectVaultFolder") });
    const closeButton = this.createIconButton(headerEl, "x", this.plugin.t("close"), "cortex-chat-folder-picker-close");
    closeButton.addEventListener("click", () => this.closeFolderPicker());
    const searchEl = pickerEl.createEl("input", {
      cls: "cortex-chat-folder-picker-search",
      attr: {
        type: "search",
        placeholder: this.plugin.t("selectVaultFolder")
      }
    });
    const listEl = pickerEl.createDiv({ cls: "cortex-chat-folder-picker-list" });
    const limitEl = pickerEl.createDiv({ cls: "cortex-chat-folder-picker-limit" });
    const renderFolders = (query = "") => {
      const normalizedQuery = String(query || "").trim().toLowerCase();
      const matchedFolders = folders.filter((folder) => folder.toLowerCase().includes(normalizedQuery));
      const visibleFolders = matchedFolders.slice(0, 200);
      listEl.empty();
      limitEl.empty();
      if (!visibleFolders.length) {
        listEl.createDiv({ cls: "cortex-chat-folder-picker-empty", text: this.plugin.t("noVaultFolders") });
        return;
      }
      if (matchedFolders.length > visibleFolders.length) {
        limitEl.setText(
          this.plugin.t("folderSearchLimited", {
            visible: visibleFolders.length,
            total: matchedFolders.length
          })
        );
      }
      for (const folder of visibleFolders) {
        const itemEl = listEl.createEl("button", {
          cls: `cortex-chat-folder-picker-item${selected.includes(folder) ? " is-selected" : ""}`,
          attr: { type: "button", "aria-label": folder, "data-tooltip": folder }
        });
        const depth = Math.max(0, folder.split("/").length - 1);
        itemEl.style.paddingLeft = `${8 + Math.min(depth, 5) * 11}px`;
        itemEl.createSpan({ cls: "cortex-chat-folder-picker-name", text: folder.split("/").pop() || folder });
        itemEl.createSpan({ cls: "cortex-chat-folder-picker-path", text: folder });
        itemEl.addEventListener("click", async () => {
          await this.selectFolderContext(folder);
          this.closeFolderPicker();
        });
      }
    };
    if (!folders.length) {
      listEl.createDiv({ cls: "cortex-chat-folder-picker-empty", text: this.plugin.t("noVaultFolders") });
    } else {
      renderFolders();
    }
    searchEl.addEventListener("input", () => renderFolders(searchEl.value));
    if (selected.length) {
      const clearButton = pickerEl.createEl("button", {
        cls: "cortex-chat-folder-picker-clear",
        text: this.plugin.t("folderContextCleared"),
        attr: { type: "button" }
      });
      clearButton.addEventListener("click", async () => {
        await this.clearFolderContext();
        this.closeFolderPicker();
      });
    }
    window.setTimeout(() => searchEl.focus(), 0);
    const closeOnOutside = (outsideEvent) => {
      if (!this.folderPickerEl?.contains(outsideEvent.target)) {
        this.closeFolderPicker();
      }
    };
    this.folderPickerOutsideHandler = closeOnOutside;
    this.contentEl?.ownerDocument?.addEventListener("mousedown", closeOnOutside);
  }

  closeFolderPicker() {
    if (this.folderPickerOutsideHandler) {
      this.contentEl?.ownerDocument?.removeEventListener("mousedown", this.folderPickerOutsideHandler);
      this.folderPickerOutsideHandler = null;
    }
    this.folderPickerEl?.remove();
    this.folderPickerEl = null;
  }

  async selectFolderContext(folder) {
    const roots = normalizeFolderRoots([folder]);
    this.plugin.settings.folderReferenceRoots = roots;
    this.plugin.settings.contextIncludeFolders = true;
    await this.plugin.saveSettings();
    const baseContext = this.context || (await this.plugin.captureCurrentContext(false));
    const folderReferences = await this.plugin.resolveFolderReferences(`folder ${folder}`, baseContext.references || []);
    const nextContext = {
      ...baseContext,
      references: mergeReferences(baseContext.references || [], folderReferences)
    };
    this.setActiveTabState({
      context: nextContext,
      contextSummary: this.describeContext(nextContext)
    });
    this.renderContext();
    this.renderComposerToolbar();
    new Notice(this.plugin.t("folderContextAdded", { folder }));
  }

  async clearFolderContext() {
    this.plugin.settings.folderReferenceRoots = [];
    await this.plugin.saveSettings();
    const tab = this.getActiveTab();
    const nextContext = {
      ...(tab.context || {}),
      references: (tab.context?.references || []).filter((reference) => referenceSourceBucket(reference) !== "folders")
    };
    this.setActiveTabState({
      context: nextContext,
      contextSummary: this.describeContext(nextContext)
    });
    this.renderContext();
    this.renderComposerToolbar();
    new Notice(this.plugin.t("folderContextCleared"));
  }

  async activateTab(tabId) {
    if (!this.tabs.find((tab) => tab.id === tabId)) {
      return;
    }
    this.activeTabId = tabId;
    this.tabs.forEach((tab) => {
      tab.isActive = tab.id === tabId;
      if (tab.isActive) {
        tab.needsAttention = false;
      }
    });
    this.syncActiveFields();
    await this.persistTabs();
    this.render();
  }

  async createNewTab() {
    if (this.tabs.length >= MAX_CHAT_TABS) {
      new Notice(this.plugin.t("tabLimitReached", { count: MAX_CHAT_TABS }));
      return;
    }
    const tab = createDefaultChatTab(this.plugin.t);
    this.tabs.push(tab);
    await this.activateTab(tab.id);
  }

  async closeTab(tabId) {
    if (this.tabs.length <= 1) {
      await this.startNewChat();
      return;
    }
    const index = this.tabs.findIndex((tab) => tab.id === tabId);
    if (index === -1) {
      return;
    }
    const wasActive = this.tabs[index].id === this.activeTabId;
    this.tabs.splice(index, 1);
    if (wasActive) {
      const next = this.tabs[Math.max(0, index - 1)] || this.tabs[0];
      this.activeTabId = next.id;
    }
    this.syncActiveFields();
    await this.persistTabs();
    this.render();
  }

  renderQuickActions() {
    if (!this.quickActionsEl) {
      return;
    }
    this.quickActionsEl.empty();
    this.createQuickAction("message-square-plus", this.plugin.t("newChatReady"), () => this.startNewChat());
    this.createQuickAction("file-text", this.plugin.t("activeNote"), async () => this.loadCurrentNoteContext());
    this.createQuickAction("copy", this.plugin.t("copyResponse"), async () => {
      await this.plugin.copyLastResponse();
    });
    this.createQuickAction("corner-down-left", this.plugin.t("insertResponse"), async () => {
      await this.plugin.insertLastResponseIntoNote();
    });
  }

  createQuickAction(icon, ariaLabel, handler) {
    const button = this.quickActionsEl.createEl("button", {
      cls: "cortex-chat-quick-action",
      attr: { "aria-label": ariaLabel, "data-tooltip": ariaLabel }
    });
    setIcon(button, icon);
    button.addEventListener("click", handler);
    return button;
  }

  createIconButton(parentEl, icon, ariaLabel, className) {
    const button = parentEl.createEl("button", {
      cls: className,
      attr: { "aria-label": ariaLabel, "data-tooltip": ariaLabel }
    });
    setIcon(button, icon);
    return button;
  }

  async loadCurrentNoteContext() {
    const context = await this.plugin.captureCurrentContext(false);
    await this.prepareContext(context);
    new Notice(context.path ? this.plugin.t("contextLoaded", { path: context.path }) : this.plugin.t("noMarkdownOpen"));
  }

  insertMentionTrigger() {
    if (!this.inputEl) {
      return;
    }

    const value = this.inputEl.value || "";
    const caret = this.inputEl.selectionStart || value.length;
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const prefix = before && !/\s$/.test(before) ? " " : "";
    const insertion = `${prefix}@`;
    const nextCursor = before.length + insertion.length;
    this.inputEl.value = `${before}${insertion}${after}`;
    this.inputEl.focus();
    this.inputEl.setSelectionRange(nextCursor, nextCursor);
    this.autoResizeInput();
    this.updateMentionSuggestions();
  }

  startNewChat() {
    this.setActiveTabState({
      threadId: null,
      messages: [],
      context: null,
      contextSummary: "",
      title: this.plugin.t("untitledTab"),
      isStreaming: false,
      needsAttention: false
    });
    this.plugin.setLastResponse(null);
    this.render();
    new Notice(this.plugin.t("newChatReady"));
  }

  openActionsMenu(event) {
    const menu = new Menu();
    menu.addItem((item) =>
      item.setTitle(this.plugin.t("viewMemoryUsed")).setIcon("database").onClick(async () => {
        await this.plugin.showMemoryUsed();
      })
    );
    menu.addItem((item) =>
      item.setTitle(this.plugin.t("configureCodex")).setIcon("key").onClick(() => {
        new CodexSetupModal(this.app, this.plugin).open();
      })
    );
    menu.addItem((item) =>
      item.setTitle(this.plugin.t("check")).setIcon("refresh-cw").onClick(async () => {
        await this.plugin.autoCheckCodexSetup({ notify: true });
        this.renderHeader();
      })
    );
    menu.addItem((item) =>
      item.setTitle(this.plugin.t("consistencyDiagnostics")).setIcon("shield-alert").onClick(async () => {
        await this.plugin.openConsistencyDiagnostics();
      })
    );
    menu.addSeparator();
    menu.addItem((item) =>
      item.setTitle(this.plugin.t("openAssistant")).setIcon("settings").onClick(() => {
        this.plugin.openPluginSettings();
      })
    );
    menu.showAtMouseEvent(event);
  }

  createContextItem(parentEl, label, value, state = "") {
    const itemEl = parentEl.createDiv({ cls: `cortex-chat-context-item ${state}`.trim() });
    itemEl.createDiv({ cls: "cortex-chat-context-label", text: label });
    itemEl.createDiv({ cls: "cortex-chat-context-value", text: value });
  }

  getContextSummary() {
    const note = this.context?.title || this.plugin.lastMarkdownFile?.basename || this.plugin.t("noNote");
    const referenceCount = this.context?.references?.length || 0;
    const referenceLabel = referenceCount ? this.plugin.t("referenceCount", { count: referenceCount }) : this.plugin.t("noRefs");
    return `${note} · ${referenceLabel}`;
  }

  renderContextSourceChips(parentEl) {
    const chips = [
      ["contextIncludeActiveNote", this.plugin.t("includeActiveNote"), this.context?.path ? 1 : 0],
      ["contextIncludeLinks", this.plugin.t("links"), this.context?.outgoingLinks?.length || 0],
      ["contextIncludeMentions", "@", (this.context?.references || []).filter((reference) => referenceSourceBucket(reference) === "mentions").length],
      ["contextIncludeFolders", this.plugin.t("manifestFolders"), (this.context?.references || []).filter((reference) => referenceSourceBucket(reference) === "folders").length],
      ["contextIncludePinned", this.plugin.t("manifestPinned"), (this.context?.references || []).filter((reference) => referenceSourceBucket(reference) === "pinned").length],
      ["contextIncludeMemory", this.plugin.t("manifestMemory"), MEMORY_CATEGORIES.length],
      ["contextIncludeRecentSessions", this.plugin.t("manifestSessions"), 0],
      ["contextIncludeRag", this.plugin.t("manifestRag"), (this.context?.references || []).filter((reference) => referenceSourceBucket(reference) === "rag").length]
    ];
    const chipsEl = parentEl.createDiv({ cls: "cortex-chat-context-chips" });
    for (const [key, label, count] of chips) {
      const enabled = this.plugin.settings[key] !== false && (key !== "contextIncludeRag" || this.plugin.settings[key] === true);
      const chipEl = chipsEl.createEl("button", {
        cls: enabled ? "cortex-chat-context-chip is-enabled" : "cortex-chat-context-chip",
        text: `${label}${Number.isFinite(count) ? ` ${count}` : ""}`,
        attr: {
          "aria-pressed": String(enabled),
          "data-tooltip": enabled ? this.plugin.t("sourceEnabled") : this.plugin.t("sourceDisabled")
        }
      });
      chipEl.addEventListener("click", async () => {
        this.plugin.settings[key] = !enabled;
        await this.plugin.saveSettings();
        this.renderContext();
      });
    }
  }

  renderContext() {
    this.contextEl.empty();
    this.contextEl.classList.toggle("is-expanded", Boolean(this.contextExpanded));
    const summaryEl = this.contextEl.createDiv({ cls: "cortex-chat-context-summary" });
    summaryEl.setAttribute("role", "button");
    summaryEl.setAttribute("tabindex", "0");
    summaryEl.setAttribute("aria-expanded", String(this.contextExpanded));
    const toggleContext = () => {
      this.contextExpanded = !this.contextExpanded;
      this.renderContext();
    };
    summaryEl.addEventListener("click", toggleContext);
    summaryEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleContext();
      }
    });
    const summaryTextEl = summaryEl.createDiv({ cls: "cortex-chat-context-line" });
    const noteReady = Boolean(this.context?.path || this.plugin.lastMarkdownFile);
    const referenceReady = Boolean(this.context?.references?.length);
    const indicators = [
      ["file-text", noteReady, this.plugin.t("activeNote"), async () => this.loadCurrentNoteContext()],
      ["at-sign", referenceReady, "@", () => this.insertMentionTrigger()]
    ];
    for (const [icon, ready, label, handler] of indicators) {
      const indicatorEl = summaryTextEl.createEl("button", {
        cls: ready ? "cortex-chat-context-icon is-ready" : "cortex-chat-context-icon",
        attr: { "aria-label": label, "data-tooltip": label }
      });
      setIcon(indicatorEl, icon);
      indicatorEl.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await handler();
      });
    }
    summaryTextEl.createSpan({ cls: "cortex-chat-context-kicker", text: this.context?.path ? this.plugin.t("activeContext") : this.plugin.t("context") });
    summaryTextEl.createSpan({ cls: "cortex-chat-context-text", text: this.getContextSummary() });
    const toggleButton = this.createIconButton(
      summaryEl,
      this.contextExpanded ? "chevron-down" : "chevron-right",
      this.contextExpanded ? this.plugin.t("hideContextDetails") : this.plugin.t("viewContextDetails"),
      "cortex-chat-context-toggle"
    );
    toggleButton.setAttribute("aria-expanded", String(this.contextExpanded));
    toggleButton.createSpan({
      cls: "cortex-chat-context-toggle-label",
      text: this.contextExpanded ? this.plugin.t("hide") : this.plugin.t("details")
    });
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleContext();
    });

    const compactSourcesEl = this.contextEl.createDiv({ cls: "cortex-chat-context-strip" });
    this.renderContextSourceChips(compactSourcesEl);

    if (!this.contextExpanded) {
      return;
    }

    if (!this.context) {
      const lastNote = this.plugin.lastMarkdownFile?.path || this.plugin.t("noNote");
      this.contextEl.createDiv({ cls: "cortex-chat-context-title", text: this.plugin.t("contextPending") });
      this.contextEl.createDiv({
        cls: "cortex-chat-context-help",
        text: this.plugin.t("lastNoteHelp", { note: lastNote })
      });
      return;
    }

    const references = this.context.references || [];
    const mentions = references.filter((reference) => referenceSourceBucket(reference) === "mentions").length;
    const linked = references.filter((reference) => referenceSourceBucket(reference) === "links").length;
    const folders = references.filter((reference) => referenceSourceBucket(reference) === "folders").length;
    const rag = references.filter((reference) => referenceSourceBucket(reference) === "rag").length;
    const referenceSummary = references.length
      ? `${this.plugin.t("referenceCount", { count: references.length })} (${mentions} @, ${linked} ${this.plugin.t("links").toLowerCase()}, ${folders} ${this.plugin.t("manifestFolders").toLowerCase()}, ${rag} ${this.plugin.t("manifestRag")})`
      : this.plugin.t("noRefs");
    const outgoingSummary = this.context.outgoingLinks?.length
      ? `${this.context.outgoingLinks.length}: ${this.context.outgoingLinks.slice(0, 4).join(", ")}${
          this.context.outgoingLinks.length > 4 ? "..." : ""
        }`
      : this.plugin.t("noRefs");

    this.contextEl.createDiv({ cls: "cortex-chat-context-title", text: this.plugin.t("contextToSend") });
    const gridEl = this.contextEl.createDiv({ cls: "cortex-chat-context-grid" });
    this.createContextItem(gridEl, this.plugin.t("activeNote"), this.context.path || this.plugin.t("noNote"), this.context.path ? "is-ready" : "");
    this.createContextItem(gridEl, this.plugin.t("links"), outgoingSummary, this.context.outgoingLinks?.length ? "is-ready" : "");
    this.createContextItem(gridEl, this.plugin.t("references"), referenceSummary, references.length ? "is-ready" : "");

    if (references.length) {
      const sourcesEl = this.contextEl.createDiv({ cls: "cortex-chat-context-source-list" });
      const folderReferences = references.filter((reference) => referenceSourceBucket(reference) === "folders");
      const nonFolderReferences = references.filter((reference) => referenceSourceBucket(reference) !== "folders");
      if (folderReferences.length) {
        const folderGroups = new Map();
        for (const reference of folderReferences) {
          const root = reference.folderRoot || reference.token || this.plugin.t("configuredFolderToken");
          if (!folderGroups.has(root)) {
            folderGroups.set(root, []);
          }
          folderGroups.get(root).push(reference);
        }
        for (const [root, items] of folderGroups.entries()) {
          const charCount = items.reduce((total, item) => total + Number(item.folderContextChars || String(item.preview || "").length || 0), 0);
          const groupEl = sourcesEl.createDiv({ cls: "cortex-chat-context-folder-group" });
          groupEl.createDiv({
            cls: "cortex-chat-context-folder-title",
            text: this.plugin.t("folderFilesSummary", { folder: root, count: items.length, chars: charCount })
          });
          for (const reference of items) {
            this.createContextSourceRow(groupEl, reference);
          }
        }
      }
      const orderedReferences = [
        ...nonFolderReferences.filter((reference) => referenceSourceBucket(reference) !== "rag"),
        ...nonFolderReferences.filter((reference) => referenceSourceBucket(reference) === "rag")
      ];
      for (const reference of orderedReferences.slice(0, 40)) {
        this.createContextSourceRow(sourcesEl, reference);
      }
    }
  }

  createContextSourceRow(parentEl, reference) {
    const sourceEl = parentEl.createDiv({ cls: "cortex-chat-context-source-row" });
    const textEl = sourceEl.createDiv({ cls: "cortex-chat-context-source-main" });
    textEl.createSpan({ cls: "cortex-chat-context-source-path", text: reference.path });
    const kindLabel = reference.extension || reference.fileType || reference.kind || reference.source || "";
    sourceEl.createSpan({ cls: "cortex-chat-context-source-kind", text: kindLabel });
    const removeEl = sourceEl.createEl("button", {
      cls: "cortex-chat-context-source-remove",
      attr: {
        type: "button",
        "aria-label": this.plugin.t("removeContextSource"),
        "data-tooltip": this.plugin.t("removeContextSource")
      }
    });
    setIcon(removeEl, "x");
    removeEl.createSpan({ cls: "cortex-chat-context-source-remove-label", text: this.plugin.t("remove") || this.plugin.t("hide") });
    removeEl.addEventListener("click", async () => {
      await this.removeContextReference(reference.path);
    });
  }

  renderMessages() {
    if (!this.messagesEl) {
      return;
    }

    this.messagesEl.empty();
    if (!this.messages.length) {
      const emptyEl = this.messagesEl.createEl("div", { cls: "cortex-chat-empty-state" });
      emptyEl.createEl("div", { cls: "cortex-chat-empty-greeting", text: this.plugin.t("emptyGreeting") });
      return;
    }

    for (const message of this.messages) {
      const isAssistant = message.role === "assistant";
      const messageEl = this.messagesEl.createDiv({
        cls: `cortex-chat-message ${isAssistant ? "is-assistant" : "is-user"}`
      });
      const headerEl = messageEl.createDiv({ cls: "cortex-chat-message-header" });
      const metaEl = headerEl.createDiv({ cls: "cortex-chat-message-meta" });
      metaEl.createDiv({
        cls: "cortex-chat-role",
        text: isAssistant ? "Cortex" : this.plugin.t("you")
      });
      if (message.meta?.label) {
        metaEl.createDiv({ cls: "cortex-chat-message-chip", text: message.meta.label });
      }
      if (isAssistant && !message.meta?.loading && message.content) {
        const actionsEl = headerEl.createDiv({ cls: "cortex-chat-message-actions" });
        const copyButton = this.createIconButton(actionsEl, "copy", this.plugin.t("copyResponse"), "cortex-chat-message-action");
        copyButton.addEventListener("click", async () => {
          await navigator.clipboard.writeText(message.content);
          new Notice(this.plugin.t("responseCopied"));
        });
        const insertButton = this.createIconButton(actionsEl, "corner-down-left", this.plugin.t("insertResponse"), "cortex-chat-message-action");
        insertButton.addEventListener("click", async () => {
          await this.insertTextIntoActiveNote(message.content);
        });
        const useButton = this.createIconButton(actionsEl, "message-square-plus", this.plugin.t("useAsContext"), "cortex-chat-message-action");
        useButton.addEventListener("click", async () => {
          await this.pinResponseAsContext(message);
        });
        if (message.meta?.contextManifest) {
          const manifestButton = this.createIconButton(actionsEl, "list-checks", this.plugin.t("manifestDetails"), "cortex-chat-message-action");
          manifestButton.addEventListener("click", () => {
            new ContextManifestModal(this.app, message.meta.contextManifest, this.plugin.t).open();
          });
        }
      }
      const bodyEl = messageEl.createDiv({ cls: "cortex-chat-message-body" });
      if (message.meta?.loading) {
        bodyEl.createDiv({ cls: "cortex-chat-loading", text: message.meta.status || this.plugin.t("preparingResponse") });
        if (message.meta?.substatus) {
          bodyEl.createDiv({ cls: "cortex-chat-loading-chip", text: message.meta.substatus });
        }
        bodyEl.createDiv({ cls: "cortex-chat-loading-bar" });
      } else if (isAssistant) {
        void this.renderAssistantMessage(bodyEl, message.content);
      } else {
        bodyEl.setText(message.content);
      }
      if (message.meta?.detail) {
        const footerEl = messageEl.createDiv({ cls: "cortex-chat-message-detail" });
        footerEl.createSpan({ cls: "cortex-chat-message-detail-text", text: message.meta.detail });
        if (message.meta?.contextManifest?.summary) {
          const manifestEl = footerEl.createEl("button", {
            cls: "cortex-chat-manifest-pill",
            text: message.meta.contextManifest.summary,
            attr: { "aria-label": this.plugin.t("manifestDetails"), "data-tooltip": this.plugin.t("manifestDetails") }
          });
          manifestEl.addEventListener("click", () => {
            new ContextManifestModal(this.app, message.meta.contextManifest, this.plugin.t).open();
          });
        }
      }
    }

    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  async renderAssistantMessage(containerEl, content) {
    containerEl.empty();
    try {
      await MarkdownRenderer.render(this.app, content, containerEl, this.context?.path || "", this.plugin);
    } catch {
      containerEl.setText(content);
    }
  }

  async insertTextIntoActiveNote(content) {
    await this.plugin.approveInsertionIntoNote(content, {
      threadId: this.getActiveTab()?.threadId || "manual"
    });
  }

  async pinResponseAsContext(message) {
    const tab = this.getActiveTab();
    const source = {
      id: message.id || makeId("pin"),
      path: `pinned://${message.id || makeId("msg")}`,
      title: summarize(message.content || this.plugin.t("pinnedContext")),
      preview: String(message.content || "").slice(0, 4000),
      source: "pinned-response",
      kind: "snippet",
      reason: this.plugin.t("useAsContext")
    };
    tab.pinnedContext = mergeReferences(tab.pinnedContext || [], [source]).slice(-12);
    tab.context = {
      ...(tab.context || {}),
      references: mergeReferences(tab.context?.references || [], [source])
    };
    tab.contextSummary = this.describeContext(tab.context);
    this.syncActiveFields();
    await this.persistTabs();
    this.renderContext();
    new Notice(this.plugin.t("pinnedContextAdded"));
  }

  async removeContextReference(referencePath) {
    const tab = this.getActiveTab();
    const removePath = String(referencePath || "");
    tab.pinnedContext = (tab.pinnedContext || []).filter((reference) => reference.path !== removePath);
    if (tab.context?.references) {
      tab.context = {
        ...tab.context,
        references: tab.context.references.filter((reference) => reference.path !== removePath)
      };
    }
    tab.contextSummary = this.describeContext(tab.context);
    this.syncActiveFields();
    await this.persistTabs();
    this.renderContext();
    new Notice(this.plugin.t("pinnedContextRemoved"));
  }

  contextWithPinnedSources(context, tab = this.getActiveTab()) {
    const pinned = tab?.pinnedContext || [];
    if (!pinned.length) {
      return context || {};
    }
    return {
      ...(context || {}),
      references: mergeReferences(context?.references || [], pinned)
    };
  }

  appendToComposer(content) {
    if (!this.inputEl) {
      return;
    }
    const current = this.inputEl.value.trim();
    this.inputEl.value = current ? `${current}\n\n${content}` : content;
    this.inputEl.focus();
    this.autoResizeInput();
  }

  autoResizeInput() {
    if (!this.inputEl) {
      return;
    }

    this.inputEl.style.height = "0px";
    const nextHeight = Math.min(this.inputEl.scrollHeight, Math.round(window.innerHeight * 0.24));
    this.inputEl.style.height = `${Math.max(nextHeight, 40)}px`;
  }

  handleMentionNavigation(event) {
    if (!this.mentionState.open) {
      return false;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.mentionState.selectedIndex =
        (this.mentionState.selectedIndex + 1) % this.mentionState.items.length;
      this.renderMentionSuggestions();
      return true;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.mentionState.selectedIndex =
        (this.mentionState.selectedIndex - 1 + this.mentionState.items.length) % this.mentionState.items.length;
      this.renderMentionSuggestions();
      return true;
    }

    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      const selected = this.mentionState.items[this.mentionState.selectedIndex];
      if (selected) {
        this.insertMention(selected);
      }
      return true;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.hideMentionSuggestions();
      return true;
    }

    return false;
  }

  getActiveMentionRange() {
    if (!this.inputEl) {
      return null;
    }

    const value = this.inputEl.value || "";
    const caret = this.inputEl.selectionStart || value.length;
    const beforeCaret = value.slice(0, caret);
    const lineStart = Math.max(beforeCaret.lastIndexOf("\n"), beforeCaret.lastIndexOf("\r")) + 1;
    const currentLine = beforeCaret.slice(lineStart);
    const triggers = [...currentLine.matchAll(/(^|\s)([@#])/g)];
    const lastTrigger = triggers[triggers.length - 1];
    if (!lastTrigger) {
      return null;
    }

    const trigger = lastTrigger[2] || "@";
    const triggerIndex = lineStart + lastTrigger.index + lastTrigger[1].length;
    const query = beforeCaret.slice(triggerIndex + 1);
    if (/[@#]/.test(query)) {
      return null;
    }
    return {
      type: trigger === "#" ? "folder" : "mention",
      query: normalizeReferenceQuery(query),
      start: triggerIndex,
      end: caret
    };
  }

  updateMentionSuggestions() {
    const mention = this.getActiveMentionRange();
    if (!mention) {
      this.hideMentionSuggestions();
      return;
    }

    const candidates =
      mention.type === "folder"
        ? this.getVaultFolders()
            .filter((folder) => folder.toLowerCase().includes(String(mention.query || "").toLowerCase()))
            .slice(0, 200)
            .map((folder) => ({ type: "folder", path: folder, title: folder, basename: folder.split("/").pop() || folder }))
        : this.plugin.getMentionCandidates(mention.query).map((file) => ({ type: "mention", file }));
    if (!candidates.length) {
      this.hideMentionSuggestions();
      return;
    }

    this.mentionState = {
      open: true,
      type: mention.type,
      query: mention.query,
      range: mention,
      items: candidates,
      selectedIndex: Math.min(this.mentionState.selectedIndex || 0, candidates.length - 1)
    };

    this.renderMentionSuggestions();
  }

  hideMentionSuggestions() {
    this.mentionState.open = false;
    this.mentionState.type = "mention";
    this.mentionState.items = [];
    this.mentionState.range = null;
    if (this.suggestionsEl) {
      this.suggestionsEl.empty();
      this.suggestionsEl.hide();
    }
  }

  renderMentionSuggestions() {
    if (!this.suggestionsEl || !this.mentionState.open) {
      return;
    }

    this.suggestionsEl.empty();
    this.suggestionsEl.show();

    this.mentionState.items.forEach((candidate, index) => {
      const isFolder = candidate.type === "folder";
      const file = candidate.file || candidate;
      const itemEl = this.suggestionsEl.createDiv({
        cls: `suggestion-item cortex-chat-suggestion-item${isFolder ? " is-folder" : ""}${index === this.mentionState.selectedIndex ? " is-selected" : ""}`
      });

      itemEl.createDiv({
        cls: "suggestion-title",
        text: isFolder ? candidate.title : file.basename
      });
      itemEl.createDiv({
        cls: "suggestion-note cortex-chat-suggestion-note",
        text: isFolder ? this.plugin.t("selectVaultFolder") : file.path
      });

      itemEl.addEventListener("mouseenter", () => {
        this.mentionState.selectedIndex = index;
        this.renderMentionSuggestions();
      });

      itemEl.addEventListener("mousedown", (event) => {
        event.preventDefault();
        this.insertMention(candidate);
      });
    });
  }

  insertMention(candidate) {
    if (!this.inputEl || !this.mentionState.range) {
      return;
    }

    const isFolder = candidate?.type === "folder";
    const file = candidate?.file || candidate;
    const value = this.inputEl.value || "";
    const before = value.slice(0, this.mentionState.range.start);
    const after = value.slice(this.mentionState.range.end);
    const insertion = isFolder ? `#${candidate.path} ` : `@${file.basename} `;
    const nextValue = `${before}${insertion}${after}`;
    const nextCursor = before.length + insertion.length;

    this.inputEl.value = nextValue;
    this.inputEl.focus();
    this.inputEl.setSelectionRange(nextCursor, nextCursor);
    this.autoResizeInput();
    this.hideMentionSuggestions();
    if (isFolder) {
      void this.selectFolderContext(candidate.path);
    }
  }

  setSending(value) {
    this.isSending = value;
    if (this.sendButtonEl) {
      this.sendButtonEl.disabled = value;
      this.sendButtonEl.classList.toggle("is-sending", value);
      this.sendButtonEl.empty();
      setIcon(this.sendButtonEl, value ? "loader-2" : "send-horizontal");
    }
    if (this.inputEl) {
      this.inputEl.disabled = value;
    }
    if (this.quickActionsEl) {
      this.quickActionsEl.classList.toggle("is-disabled", value);
    }
  }

  async waitForMinimumDuration(startedAt, minimumMs) {
    const remaining = Math.max(0, minimumMs - (Date.now() - startedAt));
    if (remaining > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, remaining));
    }
  }

  responseMetaFor(response, elapsedMs, runOptions) {
    const rawProvider = response.raw?.provider || "";
    const label = response.localFallback
      ? this.plugin.t("codexLocalProvider")
      : rawProvider === "heuristic-fallback"
        ? this.plugin.t("serverFallbackProvider")
        : rawProvider === "codex-cli"
        ? this.plugin.t("codexOauthProvider")
        : this.plugin.t("serverProvider");
    const detailParts = [
      `${runOptions.effort === "fast" ? this.plugin.t("fast") : this.plugin.t("thinking")}`,
      `${workModeLabel(runOptions.interactionMode, this.plugin.t)}`,
      `${Math.max(1, Math.round(elapsedMs / 100) / 10)}s`
    ];
    if (response.sessionPath) {
      detailParts.push(response.sessionPath);
    }
    return {
      label,
      detail: detailParts.join(" · ")
    };
  }

  async sendMessage() {
    const message = this.inputEl?.value?.trim();
    if (!message) {
      new Notice(this.plugin.t("writeMessageFirst"));
      return;
    }
    if (this.isSending) {
      return;
    }

    this.appendMessage("user", message);
    const requestTabId = this.activeTabId;
    const activeTab = this.getActiveTab();
    if (!activeTab.threadId && activeTab.messages.length <= 1) {
      activeTab.title = titleFromMessage(message, this.plugin.t("untitledTab"));
    }
    activeTab.isStreaming = true;
    activeTab.updatedAt = new Date().toISOString();
    void this.persistTabs();
    this.renderTabBar();
    this.inputEl.value = "";
    this.autoResizeInput();
    this.hideMentionSuggestions();
    this.setSending(true);

    const startedAt = Date.now();
    const expanded = expandSlashCommand(message);
    const agentMessage = expanded.message;
    if (expanded.command) {
      new Notice(this.plugin.t("commandExpanded", { command: `/${expanded.command}` }));
    }
    const activeWorkMode = this.plugin.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode;
    const pendingId = this.appendMessage("assistant", "", {
      loading: true,
      label: workModeDetail(activeWorkMode, this.plugin.t),
      status: this.plugin.t("codexThinking"),
      substatus: this.plugin.t("processSending")
    });
    this.lastPendingStatus = this.plugin.t("processSending");
    if (!this.context?.path && !this.context?.references?.length) {
      this.setPendingStatus(pendingId, this.plugin.t("codexThinking"), {
        substatus: this.plugin.t("processPreparingContext")
      }, requestTabId);
      this.context = await this.plugin.captureCurrentContext(false);
      this.setTabState(requestTabId, {
        context: this.context,
        contextSummary: this.describeContext(this.context)
      });
      if (requestTabId === this.activeTabId) {
        this.renderHeader();
        this.renderContext();
      }
    }
    try {
      const requestTab = this.getTab(requestTabId);
      const requestContext = this.contextWithPinnedSources(requestTab?.context || this.context || {}, requestTab);
      const runOptions = this.plugin.getRunOptions(requestContext, agentMessage);
      const folderStatus = this.getFolderReviewStatus(agentMessage, requestContext);
      if (folderStatus) {
        this.setPendingStatus(pendingId, this.plugin.t("codexThinking"), {
          substatus: folderStatus
        }, requestTabId);
      }
      this.setPendingStatus(pendingId, this.plugin.t("codexThinking"), {
        substatus: this.plugin.t("processAnalyzingContent")
      }, requestTabId);
      const response = await this.plugin.sendMessageToAgent(requestTab?.threadId || null, agentMessage, requestContext, runOptions);
      const isFallback = response.localFallback || response.raw?.provider === "heuristic-fallback";
      this.setPendingStatus(pendingId, this.plugin.t("codexPreparingResponse"), {
        substatus: this.plugin.t("processPreparingResponse"),
        detail:
          runOptions.interactionMode === "execute"
            ? this.plugin.t("unrestrictedActive")
            : isFallback
              ? this.plugin.t("localFallbackProvider")
              : ""
      }, requestTabId);
      await this.waitForMinimumDuration(startedAt, isFallback ? this.plugin.settings.localFallbackDelayMs : 350);
      const responseContext = response.context || requestContext;
      this.setTabState(requestTabId, {
        threadId: response.threadId,
        context: responseContext,
        contextSummary: this.describeContext(responseContext),
        isStreaming: false,
        needsAttention: false
      });
      if (requestTabId === this.activeTabId) {
        this.renderHeader();
        this.renderContext();
      }
      this.updateMessageInTab(requestTabId, pendingId, response.answer, {
        loading: false,
        ...this.responseMetaFor(response, Date.now() - startedAt, runOptions),
        contextManifest: response.contextManifest || null
      });
      this.plugin.setLastResponse(response);

      if (response.unresolvedReferences?.length) {
        new Notice(this.plugin.t("unresolvedReferences", { refs: response.unresolvedReferences.join(", ") }));
      }

      if (response.security?.redacted) {
        new Notice(
          this.plugin.t("sensitiveContextRedacted", { types: response.security.detectedTypes.join(", ") })
        );
      }
    } catch (error) {
      this.setTabState(requestTabId, {
        isStreaming: false,
        needsAttention: false
      });
      this.updateMessageInTab(requestTabId, pendingId, `Error: ${error.message}`, {
        loading: false,
        label: this.plugin.t("error"),
        detail: `Fase: ${this.lastPendingStatus || "desconocida"} · La respuesta no se ha persistido como salida válida.`
      });
      new Notice(this.plugin.t("requestFailed", { error: error.message }));
    } finally {
      this.setTabState(requestTabId, {
        isStreaming: false
      });
      this.setSending(false);
    }
  }
}

class ConsistencyDiagnosticsModal extends Modal {
  constructor(app, report, t = createTranslator("en")) {
    super(app);
    this.report = report;
    this.t = t;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("cortex-chat-setup-modal");
    contentEl.createEl("h3", { text: this.t("consistencyDiagnostics") });
    contentEl.createEl("p", {
      text: this.report.summary
    });

    if (this.report.items.length) {
      const list = contentEl.createEl("ul");
      for (const item of this.report.items) {
        list.createEl("li", { text: `${item.severity.toUpperCase()}: ${item.message}` });
      }
    } else {
      contentEl.createEl("p", { text: this.t("noConsistencyIssues") });
    }
  }
}

class CortexChatSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const rootEl = this.containerEl;
    const t = this.plugin.t;
    rootEl.empty();
    rootEl.createEl("h3", { text: t("basicSettings") });

    new Setting(rootEl)
      .setName(t("language"))
      .setDesc(t("languageDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", t("languageAuto"))
          .addOption("en", t("languageEnglish"))
          .addOption("es", t("languageSpanish"))
          .setValue(this.plugin.settings.languageMode || DEFAULT_SETTINGS.languageMode)
          .onChange(async (value) => {
            const nextLanguageMode = normalizeLanguageMode(value);
            this.plugin.settings.systemPromptSections = normalizeSystemPromptForLanguage(
              this.plugin.settings.systemPromptSections,
              nextLanguageMode
            );
            this.plugin.settings.languageMode = nextLanguageMode;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(rootEl)
      .setName(t("defaultWorkMode"))
      .setDesc(t("defaultWorkModeDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("plan", t("planner"))
          .addOption("execute", t("execute"))
          .setValue(this.plugin.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode)
          .onChange(async (value) => {
            this.plugin.settings.defaultInteractionMode = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(rootEl)
      .setName(t("backendUrl"))
      .setDesc(t("backendUrlDesc"))
      .addText((text) =>
        text
          .setPlaceholder("http://127.0.0.1:8787")
          .setValue(this.plugin.settings.backendUrl)
          .onChange(async (value) => {
            this.plugin.settings.backendUrl = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(rootEl)
      .setName(t("allowRemoteBackend"))
      .setDesc(t("allowRemoteBackendDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.allowRemoteBackend).onChange(async (value) => {
          this.plugin.settings.allowRemoteBackend = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(rootEl)
      .setName(t("approvedEditsOnly"))
      .setDesc(t("approvedEditsOnlyDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.approvedEditsOnly)).onChange(async (value) => {
          this.plugin.settings.approvedEditsOnly = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    new Setting(rootEl)
      .setName("Codex OAuth")
      .setDesc(t("status", { status: this.plugin.settings.codexSetupCompleted ? t("codexReady") : this.plugin.settings.codexStatus || t("pending") }))
      .addButton((button) =>
        button.setButtonText(t("openAssistant")).onClick(() => {
          new CodexSetupModal(this.app, this.plugin).open();
        })
      );

    const advancedEl = rootEl.createEl("details", { cls: "cortex-chat-settings-advanced" });
    advancedEl.createEl("summary", { text: t("advancedSettings") });
    const containerEl = advancedEl.createDiv();
    containerEl.createEl("h3", { text: t("connectionSecurity") });

    new Setting(containerEl)
      .setName(t("backendUrl"))
      .setDesc(t("backendUrlDesc"))
      .addText((text) =>
        text
          .setPlaceholder("http://127.0.0.1:8787")
          .setValue(this.plugin.settings.backendUrl)
          .onChange(async (value) => {
            this.plugin.settings.backendUrl = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("deviceState"))
      .setDesc(
        t("deviceStateDesc", {
          state: this.plugin.settings.deviceRegisteredOk ? t("registered") : t("pending"),
          id: this.plugin.settings.deviceId || t("generatedAutomatically")
        })
      )
      .addButton((button) =>
        button.setButtonText(t("repairLocalConfig")).onClick(async () => {
          await this.plugin.repairLocalProvisioning();
          this.display();
        })
      )
      .addButton((button) =>
        button.setButtonText(t("registerNow")).onClick(async () => {
          await this.plugin.registerLocalDeviceIfPossible({ notify: true });
          this.display();
        })
      );

    new Setting(containerEl)
      .setName(t("deviceId"))
      .setDesc(t("deviceIdDesc"))
      .addText((text) => {
        text.setValue(this.plugin.settings.deviceId || `(${t("pending")})`);
        text.inputEl.disabled = true;
      });

    new Setting(containerEl)
      .setName(t("allowRemoteBackend"))
      .setDesc(t("allowRemoteBackendDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.allowRemoteBackend).onChange(async (value) => {
          this.plugin.settings.allowRemoteBackend = value;
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: t("response") });

    new Setting(containerEl)
      .setName(t("defaultWorkMode"))
      .setDesc(t("defaultWorkModeDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("plan", t("planner"))
          .addOption("execute", t("execute"))
          .setValue(this.plugin.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode)
          .onChange(async (value) => {
            this.plugin.settings.defaultInteractionMode = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("showDiagnostics"))
      .setDesc(t("showDiagnosticsDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.showDiagnostics)).onChange(async (value) => {
          this.plugin.settings.showDiagnostics = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("language"))
      .setDesc(t("languageDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", t("languageAuto"))
          .addOption("en", t("languageEnglish"))
          .addOption("es", t("languageSpanish"))
          .setValue(this.plugin.settings.languageMode || DEFAULT_SETTINGS.languageMode)
          .onChange(async (value) => {
            const nextLanguageMode = normalizeLanguageMode(value);
            this.plugin.settings.systemPromptSections = normalizeSystemPromptForLanguage(
              this.plugin.settings.systemPromptSections,
              nextLanguageMode
            );
            this.plugin.settings.languageMode = nextLanguageMode;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    containerEl.createEl("h3", { text: t("contextRetrieval") });

    const contextToggles = [
      ["contextManifestEnabled", t("contextManifest"), t("contextManifestDesc")],
      ["contextIncludeActiveNote", t("includeActiveNote"), t("includeActiveNoteDesc")],
      ["contextIncludeLinks", t("includeLinks"), t("includeLinksDesc")],
      ["contextIncludeMentions", t("includeMentions"), t("includeMentionsDesc")],
      ["contextIncludeFolders", t("includeFolders"), t("includeFoldersDesc")],
      ["contextIncludePinned", t("includePinned"), t("includePinnedDesc")],
      ["contextIncludeMemory", t("includeMemory"), t("includeMemoryDesc")],
      ["contextIncludeRecentSessions", t("includeRecentSessions"), t("includeRecentSessionsDesc")],
      ["contextIncludeRag", t("includeRag"), t("includeRagDesc")]
    ];

    for (const [key, name, description] of contextToggles) {
      new Setting(containerEl)
        .setName(name)
        .setDesc(description)
        .addToggle((toggle) =>
          toggle.setValue(Boolean(this.plugin.settings[key])).onChange(async (value) => {
            this.plugin.settings[key] = Boolean(value);
            await this.plugin.saveSettings();
            this.plugin.refreshAgentViews();
          })
        );
    }

    new Setting(containerEl)
      .setName(t("ragIndexEnabled"))
      .setDesc(t("ragIndexEnabledDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.ragIndexEnabled)).onChange(async (value) => {
          this.plugin.settings.ragIndexEnabled = Boolean(value);
          await this.plugin.saveSettings();
        })
      )
      .addButton((button) =>
        button.setButtonText(t("rebuildRagIndex")).onClick(async () => {
          await this.plugin.rebuildRagIndex({ notify: true });
          this.display();
        })
      );

    new Setting(containerEl)
      .setName(t("ragIndexStatus", { status: this.plugin.getRagIndexStatusLabel() }))
      .setDesc(t("ragIndexMaxNotesDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.ragIndexMaxNotes ?? DEFAULT_SETTINGS.ragIndexMaxNotes)).onChange(async (value) => {
          this.plugin.settings.ragIndexMaxNotes = normalizeRagIndexMaxNotes(value, DEFAULT_SETTINGS.ragIndexMaxNotes);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("ragCandidateLimit"))
      .setDesc(t("ragCandidateLimitDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.ragCandidateLimit ?? DEFAULT_SETTINGS.ragCandidateLimit)).onChange(async (value) => {
          this.plugin.settings.ragCandidateLimit = normalizeRagCandidateLimit(value, DEFAULT_SETTINGS.ragCandidateLimit);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("contextExclusions"))
      .setDesc(t("contextExclusionsDesc"))
      .addTextArea((text) => {
        text.setValue((this.plugin.settings.contextExclusionPatterns || []).join(", "));
        text.inputEl.rows = 3;
        text.inputEl.addClass("cortex-chat-settings-textarea");
        text.onChange(async (value) => {
          this.plugin.settings.contextExclusionPatterns = normalizeExclusionPatterns(value);
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(t("folderRoots"))
      .setDesc(t("folderRootsDesc"))
      .addText((text) =>
        text.setValue(formatFolderRoots(this.plugin.settings.folderReferenceRoots)).onChange(async (value) => {
          this.plugin.settings.folderReferenceRoots = parseFolderRootsInput(value);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("maxFolderReferences"))
      .setDesc(t("maxFolderReferencesDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.maxFolderReferences || DEFAULT_SETTINGS.maxFolderReferences)).onChange(async (value) => {
          this.plugin.settings.maxFolderReferences = normalizeMaxFolderReferences(value, DEFAULT_SETTINGS.maxFolderReferences);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("maxFolderContextChars"))
      .setDesc(t("maxFolderContextCharsDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.maxFolderContextChars || DEFAULT_SETTINGS.maxFolderContextChars)).onChange(async (value) => {
          this.plugin.settings.maxFolderContextChars = normalizeMaxFolderContextChars(value, DEFAULT_SETTINGS.maxFolderContextChars);
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: t("skillsTitle") });
    containerEl.createEl("p", { text: t("skillsDesc") });

    new Setting(containerEl)
      .setName(t("skillsEnabled"))
      .setDesc(t("enabledSkillsDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.skillsEnabled === true).onChange(async (value) => {
          this.plugin.settings.skillsEnabled = Boolean(value);
          await this.plugin.saveSettings();
          this.display();
        })
      );

    new Setting(containerEl)
      .setName(t("skillsRoot"))
      .setDesc(t("skillsRootDesc"))
      .addText((text) =>
        text.setValue(this.plugin.settings.skillsRoot || DEFAULT_SETTINGS.skillsRoot).onChange(async (value) => {
          this.plugin.settings.skillsRoot = normalizeSkillsRoot(value, DEFAULT_SETTINGS.skillsRoot);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("enabledSkills"))
      .setDesc(t("enabledSkillsDesc"))
      .addTextArea((text) => {
        text.setValue(normalizeSkillIds(this.plugin.settings.enabledSkillIds).join(", "));
        text.inputEl.rows = 2;
        text.inputEl.addClass("cortex-chat-settings-textarea");
        text.onChange(async (value) => {
          this.plugin.settings.enabledSkillIds = normalizeSkillIds(value);
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(t("maxSkillContextChars"))
      .setDesc(t("maxSkillContextCharsDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.maxSkillContextChars || DEFAULT_SETTINGS.maxSkillContextChars)).onChange(async (value) => {
          this.plugin.settings.maxSkillContextChars = normalizeMaxSkillContextChars(value, DEFAULT_SETTINGS.maxSkillContextChars);
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: t("mcpTitle") });
    containerEl.createEl("p", { text: t("mcpDesc") });

    new Setting(containerEl)
      .setName(t("mcpEnabled"))
      .setDesc(t("mcpDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.mcpEnabled === true).onChange(async (value) => {
          this.plugin.settings.mcpEnabled = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("mcpServers"))
      .setDesc(t("mcpServersDesc"))
      .addTextArea((text) => {
        text.setValue(JSON.stringify(this.plugin.settings.mcpServers || [], null, 2));
        text.inputEl.rows = 4;
        text.inputEl.addClass("cortex-chat-settings-textarea");
        text.onChange(async (value) => {
          try {
            this.plugin.settings.mcpServers = normalizeMcpServers(JSON.parse(value || "[]"));
            await this.plugin.saveSettings();
          } catch {
            // Keep the user's draft in the text area; invalid JSON is ignored until corrected.
          }
        });
      });

    new Setting(containerEl)
      .setName(t("mcpReadOnlyToolsOnly"))
      .setDesc(t("mcpDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.mcpReadOnlyToolsOnly !== false).onChange(async (value) => {
          this.plugin.settings.mcpReadOnlyToolsOnly = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: t("safetySettings") });

    new Setting(containerEl)
      .setName(t("approvedEditsOnly"))
      .setDesc(t("approvedEditsOnlyDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.approvedEditsOnly)).onChange(async (value) => {
          this.plugin.settings.approvedEditsOnly = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: t("systemPrompt") });
    containerEl.createEl("p", {
      text: t("systemPromptDesc")
    });

    new Setting(containerEl)
      .setName(t("resetSystemPrompt"))
      .setDesc(t("languageDesc"))
      .addButton((button) =>
        button.setButtonText(t("resetSystemPrompt")).onClick(async () => {
          this.plugin.settings.systemPromptSections = getDefaultSystemPromptSections(this.plugin.settings.languageMode);
          await this.plugin.saveSettings();
          this.display();
        })
      );

    new Setting(containerEl)
      .setName(t("promptProfile"))
      .setDesc(t("promptProfileDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("researcher", t("profileResearcher"))
          .addOption("editor", t("profileEditor"))
          .addOption("planner", t("profilePlanner"))
          .addOption("safe-executor", t("profileSafeExecutor"))
          .setValue(this.plugin.settings.activePromptProfile || DEFAULT_SETTINGS.activePromptProfile)
          .onChange(async (value) => {
            this.plugin.settings.activePromptProfile = normalizePromptProfile(value);
            await this.plugin.saveSettings();
          })
      );


    const promptFieldMeta = [
      ["role", t("promptRole"), t("promptRoleDesc")],
      ["context", t("promptContext"), t("promptContextDesc")],
      ["behavior", t("promptBehavior"), t("promptBehaviorDesc")],
      ["safety", t("promptSafety"), t("promptSafetyDesc")],
      ["output", t("promptOutput"), t("promptOutputDesc")],
      ["memory", t("promptMemory"), t("promptMemoryDesc")]
    ];

    for (const [key, name, description] of promptFieldMeta) {
      new Setting(containerEl)
        .setName(name)
        .setDesc(description)
        .addTextArea((text) => {
          text.setValue(this.plugin.settings.systemPromptSections?.[key] || "");
          text.inputEl.rows = 4;
          text.inputEl.addClass("cortex-chat-settings-textarea");
          text.onChange(async (value) => {
            this.plugin.settings.systemPromptSections = {
              ...normalizeSystemPromptSections(this.plugin.settings.systemPromptSections, this.plugin.settings.languageMode),
              [key]: value
            };
            await this.plugin.saveSettings();
          });
        });
    }

    containerEl.createEl("h3", { text: t("pluginScale") });

    new Setting(containerEl)
      .setName(t("visualScale"))
      .setDesc(t("visualScaleDesc"))
      .addText((text) => {
        text.setPlaceholder("1.0").setValue(this.plugin.getUiScale().toFixed(2));
        text.onChange(async (value) => {
          const numeric = Number(String(value).replace(",", "."));
          await this.plugin.setUiScale(Number.isFinite(numeric) ? numeric : DEFAULT_SETTINGS.uiScale);
          this.display();
        });
      })
      .addButton((button) =>
        button.setButtonText(t("reset100")).onClick(async () => {
          await this.plugin.resetUiScale();
          this.display();
        })
      );

    new Setting(containerEl)
      .setName(t("uiDensity"))
      .setDesc(t("uiDensityDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("compact", t("densityCompact"))
          .addOption("comfortable", t("densityComfortable"))
          .setValue(this.plugin.settings.uiDensity || DEFAULT_SETTINGS.uiDensity)
          .onChange(async (value) => {
            this.plugin.settings.uiDensity = value;
            await this.plugin.saveSettings();
            this.plugin.refreshAgentViewScale();
          })
      );

    new Setting(containerEl)
      .setName(t("tabBarPosition"))
      .setDesc(t("tabBarPositionDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("header", t("tabBarHeader"))
          .addOption("composer", t("tabBarComposer"))
          .setValue(this.plugin.settings.tabBarPosition || DEFAULT_SETTINGS.tabBarPosition)
          .onChange(async (value) => {
            this.plugin.settings.tabBarPosition = value;
            await this.plugin.saveSettings();
            this.plugin.refreshAgentViews();
          })
      );

    containerEl.createEl("h3", { text: t("advancedLocal") });

    new Setting(containerEl)
      .setName(t("localBootstrapToken"))
      .setDesc(t("localBootstrapTokenDesc"))
      .addText((text) => {
        text.setValue(this.plugin.settings.localBootstrapToken ? t("registered") : t("pending"));
        text.inputEl.disabled = true;
      });

    new Setting(containerEl)
      .setName(t("localBackendBootstrapScript"))
      .setDesc(t("localBackendBootstrapScriptDesc"))
      .addText((text) =>
        text.setValue(this.plugin.settings.localBackendBootstrapScript || "").onChange(async (value) => {
          this.plugin.settings.localBackendBootstrapScript = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("allowLocalBootstrapScript"))
      .setDesc(t("allowLocalBootstrapScriptDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.localBackendBootstrapAllowed)).onChange(async (value) => {
          this.plugin.settings.localBackendBootstrapAllowed = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("trustCodexVault"))
      .setDesc(t("trustCodexVaultDesc"))
      .addToggle((toggle) =>
        toggle.setValue(Boolean(this.plugin.settings.allowCodexVaultTrust)).onChange(async (value) => {
          this.plugin.settings.allowCodexVaultTrust = Boolean(value);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("localCodexCommand"))
      .setDesc(t("localCodexCommandDesc"))
      .addText((text) =>
        text.setValue(this.plugin.settings.localCodexCommand || "").onChange(async (value) => {
          this.plugin.settings.localCodexCommand = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Codex OAuth")
      .setDesc(t("status", { status: this.plugin.settings.codexStatus || t("pending") }) + (this.plugin.settings.codexVersion ? ` · ${this.plugin.settings.codexVersion}` : ""))
      .addButton((button) =>
        button.setButtonText(t("openAssistant")).onClick(() => {
          new CodexSetupModal(this.app, this.plugin).open();
        })
      )
      .addButton((button) =>
        button.setButtonText(t("check")).onClick(async () => {
          await this.plugin.checkCodexStatus();
          this.display();
        })
      );

    if (SecretComponent) {
      new Setting(containerEl)
        .setName(t("tokenSecret"))
        .setDesc(t("tokenSecretDesc"))
        .addComponent((el) =>
          new SecretComponent(this.app, el)
            .setValue(this.plugin.settings.deviceTokenSecretName)
            .onChange(async (value) => {
              this.plugin.settings.deviceTokenSecretName = value;
              await this.plugin.saveSettings();
            })
        );
    } else {
      new Setting(containerEl)
        .setName(t("tokenSecret"))
        .setDesc(t("tokenSecretDesc"))
        .addText((text) =>
          text.setValue(this.plugin.settings.deviceTokenSecretName).onChange(async (value) => {
            this.plugin.settings.deviceTokenSecretName = value.trim();
            await this.plugin.saveSettings();
          })
        );
    }

    new Setting(containerEl)
      .setName(t("maxContextChars"))
      .setDesc(t("maxContextCharsDesc"))
      .addText((text) =>
        text.setValue(String(this.plugin.settings.maxContextChars)).onChange(async (value) => {
          const numeric = Number(value);
          this.plugin.settings.maxContextChars =
            Number.isFinite(numeric) && numeric > 200 ? numeric : DEFAULT_SETTINGS.maxContextChars;
          await this.plugin.saveSettings();
        })
      );
  }
}

module.exports = class CortexChatPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.t = createTranslator(() => this.getLanguage());
    this.lastResponse = null;
    this.lastMarkdownView = null;
    this.lastMarkdownFile = null;
    this.ragIndexStatus = null;
    this.normalizePortableSettings();
    await this.ensureLocalIdentity();

    this.registerView(VIEW_TYPE, (leaf) => new CortexChatView(leaf, this));
    this.addSettingTab(new CortexChatSettingTab(this.app, this));

    this.addRibbonIcon("bot", this.t("openChat"), async () => {
      await this.activateView();
    });

    this.addCommand({
      id: "open-cortex-chat",
      name: this.t("openChat"),
      callback: async () => {
        await this.activateView();
      }
    });

    this.addCommand({
      id: "ask-about-current-note",
      name: this.t("askCurrentNote"),
      callback: async () => {
        const context = await this.captureCurrentContext(false);
        const view = await this.activateView();
        await view.prepareContext(context);
      }
    });

    this.addCommand({
      id: "insert-last-response",
      name: this.t("insertLastResponse"),
      editorCallback: async () => {
        await this.insertLastResponseIntoNote();
      }
    });

    this.addCommand({
      id: "view-memory-used",
      name: this.t("viewMemoryUsed"),
      callback: async () => {
        await this.showMemoryUsed();
      }
    });

    this.addCommand({
      id: "open-codex-setup",
      name: this.t("configureCodex"),
      callback: () => {
        new CodexSetupModal(this.app, this).open();
      }
    });

    this.addCommand({
      id: "run-consistency-diagnostics",
      name: this.t("consistencyDiagnostics"),
      callback: async () => {
        await this.openConsistencyDiagnostics();
      }
    });

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        const view = this.getMarkdownViewFromLeaf(leaf);
        if (view) {
          this.rememberMarkdownView(view);
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view?.file) {
          this.rememberMarkdownView(view);
        } else if (file?.extension === "md") {
          this.lastMarkdownFile = file;
        }
      })
    );

    this.app.workspace.onLayoutReady(async () => {
      this.refreshLastMarkdownView();
      if (this.isMobileRuntime()) {
        await this.checkRemoteBackendForMobile({ notify: false });
        if (!this.canUseRemoteBackend()) {
          new CodexSetupModal(this.app, this).open();
        }
        return;
      }
      const status = await this.autoCheckCodexSetup({ notify: false });
      if (!status.ready) {
        new CodexSetupModal(this.app, this).open();
      }
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  getLanguage() {
    return resolveLanguage(this.settings?.languageMode || DEFAULT_SETTINGS.languageMode);
  }

  async loadSettings() {
    const currentShared = Object.assign({}, await this.loadData());
    const shared = Object.assign({}, currentShared);
    const local = await this.loadLocalRuntimeState(shared);
    this.settings = normalizeSettings(Object.assign({}, shared, local), DEFAULT_SETTINGS);
    this.settings.languageMode = normalizeLanguageMode(this.settings.languageMode);
    this.settings.systemPromptSections = normalizeSystemPromptForLanguage(
      this.settings.systemPromptSections,
      this.settings.languageMode
    );
    this.settings.uiScale = clampUiScale(this.settings.uiScale);
    this.settings.uiDensity = this.settings.uiDensity === "comfortable" ? "comfortable" : DEFAULT_SETTINGS.uiDensity;
    this.settings.tabBarPosition = this.settings.tabBarPosition === "composer" ? "composer" : DEFAULT_SETTINGS.tabBarPosition;
    this.settings.contextManifestEnabled = this.settings.contextManifestEnabled !== false;
    this.settings.contextIncludeActiveNote = this.settings.contextIncludeActiveNote !== false;
    this.settings.contextIncludeLinks = this.settings.contextIncludeLinks !== false;
    this.settings.contextIncludeMentions = this.settings.contextIncludeMentions !== false;
    this.settings.contextIncludeFolders = this.settings.contextIncludeFolders !== false;
    this.settings.contextIncludePinned = this.settings.contextIncludePinned !== false;
    this.settings.contextIncludeMemory = this.settings.contextIncludeMemory !== false;
    this.settings.contextIncludeRecentSessions = this.settings.contextIncludeRecentSessions !== false;
    this.settings.contextIncludeRag = this.settings.contextIncludeRag === true;
    this.settings.maxFolderReferences = normalizeMaxFolderReferences(this.settings.maxFolderReferences, DEFAULT_SETTINGS.maxFolderReferences);
    this.settings.maxFolderContextChars = normalizeMaxFolderContextChars(this.settings.maxFolderContextChars, DEFAULT_SETTINGS.maxFolderContextChars);
    this.settings.ragIndexEnabled = this.settings.ragIndexEnabled !== false;
    this.settings.ragIndexMaxNotes = normalizeRagIndexMaxNotes(this.settings.ragIndexMaxNotes, DEFAULT_SETTINGS.ragIndexMaxNotes);
    this.settings.ragCandidateLimit = normalizeRagCandidateLimit(this.settings.ragCandidateLimit, DEFAULT_SETTINGS.ragCandidateLimit);
    this.settings.contextExclusionPatterns = normalizeExclusionPatterns(this.settings.contextExclusionPatterns);
    this.settings.approvedEditsOnly = this.settings.approvedEditsOnly !== false;
    this.settings.activePromptProfile = normalizePromptProfile(this.settings.activePromptProfile);
    this.settings.skillsEnabled = this.settings.skillsEnabled === true;
    this.settings.skillsRoot = normalizeSkillsRoot(this.settings.skillsRoot, DEFAULT_SETTINGS.skillsRoot);
    this.settings.enabledSkillIds = normalizeSkillIds(this.settings.enabledSkillIds);
    this.settings.maxSkillContextChars = normalizeMaxSkillContextChars(this.settings.maxSkillContextChars, DEFAULT_SETTINGS.maxSkillContextChars);
    this.settings.mcpEnabled = this.settings.mcpEnabled === true;
    this.settings.mcpServers = normalizeMcpServers(this.settings.mcpServers);
    this.settings.mcpReadOnlyToolsOnly = this.settings.mcpReadOnlyToolsOnly !== false;
    this.settings.folderReferenceRoots = normalizeFolderRoots(this.settings.folderReferenceRoots);
    this.normalizePortableSettings();
  }

  async saveSettings() {
    this.settings.languageMode = normalizeLanguageMode(this.settings.languageMode);
    this.settings.systemPromptSections = normalizeSystemPromptForLanguage(
      this.settings.systemPromptSections,
      this.settings.languageMode
    );
    this.settings.uiScale = clampUiScale(this.settings.uiScale);
    this.settings.uiDensity = this.settings.uiDensity === "comfortable" ? "comfortable" : DEFAULT_SETTINGS.uiDensity;
    this.settings.tabBarPosition = this.settings.tabBarPosition === "composer" ? "composer" : DEFAULT_SETTINGS.tabBarPosition;
    this.settings.contextManifestEnabled = this.settings.contextManifestEnabled !== false;
    this.settings.contextIncludeActiveNote = this.settings.contextIncludeActiveNote !== false;
    this.settings.contextIncludeLinks = this.settings.contextIncludeLinks !== false;
    this.settings.contextIncludeMentions = this.settings.contextIncludeMentions !== false;
    this.settings.contextIncludeFolders = this.settings.contextIncludeFolders !== false;
    this.settings.contextIncludePinned = this.settings.contextIncludePinned !== false;
    this.settings.contextIncludeMemory = this.settings.contextIncludeMemory !== false;
    this.settings.contextIncludeRecentSessions = this.settings.contextIncludeRecentSessions !== false;
    this.settings.contextIncludeRag = this.settings.contextIncludeRag === true;
    this.settings.maxFolderReferences = normalizeMaxFolderReferences(this.settings.maxFolderReferences, DEFAULT_SETTINGS.maxFolderReferences);
    this.settings.maxFolderContextChars = normalizeMaxFolderContextChars(this.settings.maxFolderContextChars, DEFAULT_SETTINGS.maxFolderContextChars);
    this.settings.ragIndexEnabled = this.settings.ragIndexEnabled !== false;
    this.settings.ragIndexMaxNotes = normalizeRagIndexMaxNotes(this.settings.ragIndexMaxNotes, DEFAULT_SETTINGS.ragIndexMaxNotes);
    this.settings.ragCandidateLimit = normalizeRagCandidateLimit(this.settings.ragCandidateLimit, DEFAULT_SETTINGS.ragCandidateLimit);
    this.settings.contextExclusionPatterns = normalizeExclusionPatterns(this.settings.contextExclusionPatterns);
    this.settings.approvedEditsOnly = this.settings.approvedEditsOnly !== false;
    this.settings.activePromptProfile = normalizePromptProfile(this.settings.activePromptProfile);
    this.settings.skillsEnabled = this.settings.skillsEnabled === true;
    this.settings.skillsRoot = normalizeSkillsRoot(this.settings.skillsRoot, DEFAULT_SETTINGS.skillsRoot);
    this.settings.enabledSkillIds = normalizeSkillIds(this.settings.enabledSkillIds);
    this.settings.maxSkillContextChars = normalizeMaxSkillContextChars(this.settings.maxSkillContextChars, DEFAULT_SETTINGS.maxSkillContextChars);
    this.settings.mcpEnabled = this.settings.mcpEnabled === true;
    this.settings.mcpServers = normalizeMcpServers(this.settings.mcpServers);
    this.settings.mcpReadOnlyToolsOnly = this.settings.mcpReadOnlyToolsOnly !== false;
    this.settings.folderReferenceRoots = normalizeFolderRoots(this.settings.folderReferenceRoots);
    this.normalizePortableSettings();
    await this.saveData(this.pickSettings(SHARED_SETTING_KEYS));
    await this.saveLocalRuntimeState(this.pickSettings(LOCAL_SETTING_KEYS));
  }

  pickSettings(keys) {
    const picked = {};
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
        picked[key] = this.settings[key];
      }
    }
    return picked;
  }

  getLocalStateDirectory(pluginId = PLUGIN_ID) {
    if (!os?.homedir || !path) {
      return "";
    }
    return path.join(os.homedir(), `.${pluginId}`);
  }

  getLocalStatePath(pluginId = PLUGIN_ID) {
    const directory = this.getLocalStateDirectory(pluginId);
    if (!directory) {
      return "";
    }
    const vaultRoot = this.getVaultRoot() || "unknown-vault";
    const suffix = sha1(`${pluginId}::${vaultRoot}`);
    return path.join(directory, `${suffix}.json`);
  }

  getLocalTempDirectory() {
    const directory = this.getLocalStateDirectory();
    if (directory) {
      return path.join(directory, "tmp");
    }
    return os?.tmpdir ? path.join(os.tmpdir(), "cortex-chat") : "";
  }

  async loadLocalRuntimeState(sharedSettings = {}) {
    const localStatePath = this.getLocalStatePath();
    const localState = {};
    let migrated = false;

    for (const key of LOCAL_SETTING_KEYS) {
      if (Object.prototype.hasOwnProperty.call(sharedSettings, key)) {
        localState[key] = sharedSettings[key];
        delete sharedSettings[key];
        migrated = true;
      }
    }

    if (!localStatePath || !fs) {
      return localState;
    }

    const mergeLocalStateFile = async (statePath) => {
      const raw = await fs.readFile(statePath, "utf8");
      const parsed = JSON.parse(raw);
      const payload = parsed?.state && typeof parsed.state === "object" ? parsed.state : parsed;
      for (const key of LOCAL_SETTING_KEYS) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          localState[key] = payload[key];
        }
      }
    };

    try {
      await mergeLocalStateFile(localStatePath);
    } catch {
      // No local state yet.
    }

    return localState;
  }

  async saveLocalRuntimeState(localState) {
    const localStatePath = this.getLocalStatePath();
    if (!localStatePath || !fs) {
      return;
    }

    await fs.mkdir(path.dirname(localStatePath), { recursive: true });
    await fs.writeFile(
      localStatePath,
      JSON.stringify(
        {
          version: LOCAL_STATE_VERSION,
          plugin: this.manifest?.id || PLUGIN_ID,
          vault: this.getVaultRoot(),
          updated_at: new Date().toISOString(),
          state: localState
        },
        null,
        2
      ),
      "utf8"
    );
  }

  isMobileRuntime() {
    return Boolean(Platform?.isMobile);
  }

  hasNodeRuntime() {
    return Boolean(fs && path && os && execFileAsync);
  }

  canUseLocalCodex() {
    return !this.isMobileRuntime() && this.hasNodeRuntime();
  }

  canUseRemoteBackend() {
    try {
      const parsed = new URL(this.settings.backendUrl || "");
      return this.settings.allowRemoteBackend && parsed.protocol === "https:" && !this.isLocalBackendUrl(this.settings.backendUrl);
    } catch {
      return false;
    }
  }

  getMobileBackendStatus() {
    if (!this.isMobileRuntime()) {
      return this.settings.codexStatus || "No comprobado";
    }
    return this.canUseRemoteBackend()
      ? this.t("remoteBackendReady")
      : this.t("remoteHttpsRequiredMobile");
  }

  async checkRemoteBackendForMobile(options = {}) {
    if (!this.isMobileRuntime()) {
      return this.autoCheckCodexSetup(options);
    }
    const notify = options.notify !== false;
    try {
      if (!this.canUseRemoteBackend()) {
        throw new Error(this.t("remoteHttpsRequiredMobile"));
      }
      const health = await requestUrl({
        url: `${this.settings.backendUrl.replace(/\/$/, "")}/health`,
        method: "GET"
      });
      const ok = health.status < 400;
      this.settings.codexSetupCompleted = ok;
      this.settings.codexStatus = ok ? this.t("remoteBackendReady") : `HTTP ${health.status}`;
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      if (notify) {
        new Notice(ok ? this.t("remoteBackendReady") : this.t("remoteBackendNotReady"));
      }
      return ok;
    } catch (error) {
      this.settings.codexSetupCompleted = false;
      this.settings.codexStatus = this.t("mobileUnavailable", { error: error.message });
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      if (notify) {
        new Notice(error.message);
      }
      return false;
    }
  }

  openPluginSettings() {
    if (this.app.setting?.open && this.app.setting?.openTabById) {
      this.app.setting.open();
      this.app.setting.openTabById(this.manifest.id);
    } else {
      new Notice(this.t("openSettingsSelectPlugin"));
    }
  }

  async openConsistencyDiagnostics() {
    const report = await this.collectConsistencyDiagnostics();
    new ConsistencyDiagnosticsModal(this.app, report, this.t).open();
  }

  async collectConsistencyDiagnostics() {
    const items = [];
    const shared = Object.assign({}, await this.loadData());
    for (const key of LOCAL_SETTING_KEYS) {
      if (Object.prototype.hasOwnProperty.call(shared, key)) {
        items.push({
          severity: "warn",
          message: this.t("dataJsonHasLocalKey", {
            path: ".obsidian/plugins/cortex-chat/data.json",
            key
          })
        });
      }
    }

    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot || !fs || !path) {
      return {
        summary: items.length ? this.t("issuesDetected", { count: items.length }) : this.t("diagnosticsUnavailable"),
        items
      };
    }

    const duplicateCount = await this.countDuplicateSessions(vaultRoot);
    if (duplicateCount > 0) {
      items.push({
        severity: "warn",
        message: this.t("duplicateSessionsDetected", { count: duplicateCount })
      });
    }

    const memoryIssues = await this.collectMemoryIssues(vaultRoot);
    items.push(...memoryIssues);

    const indexIssues = await this.collectIndexIssues(vaultRoot);
    items.push(...indexIssues);

    const outboxIssues = await this.collectOutboxIssues(vaultRoot);
    items.push(...outboxIssues);

    const skills = await this.listVaultSkills();
    const skillIds = new Set(skills.map((skill) => skill.id));
    const missingSkills = normalizeSkillIds(this.settings.enabledSkillIds).filter((id) => !skillIds.has(id));
    if (this.settings.skillsEnabled && missingSkills.length) {
      items.push({
        severity: "warn",
        message: this.t("missingEnabledSkills", { ids: missingSkills.join(", ") })
      });
    }

    if (this.localStatePortabilityReset) {
      items.push({
        severity: "info",
        message: this.t("localBackendReset")
      });
    }

    return {
      summary: items.length
        ? this.t("issuesDetected", { count: items.length })
        : this.t("noConsistencyIssues"),
      items
    };
  }

  async countDuplicateSessions(vaultRoot) {
    const sessionsRoot = agentPaths(vaultRoot).sessionsRoot;
    const files = await this.walkMarkdownFiles(sessionsRoot);
    const seen = new Set();
    let duplicates = 0;

    for (const filePath of files) {
      const markdown = await fs.readFile(filePath, "utf8");
      const parsed = parseFrontmatter(markdown);
      const fingerprint = parsed.data.content_fingerprint || sha1(normalizeForFingerprint(parsed.body));
      const sessionId = parsed.data.session_id || "";
      const key = sessionId || fingerprint;
      if (!key) {
        continue;
      }
      if (seen.has(key)) {
        duplicates += 1;
        continue;
      }
      seen.add(key);
    }

    return duplicates;
  }

  async collectMemoryIssues(vaultRoot) {
    const issues = [];
    const memoryRoot = agentPaths(vaultRoot).memoryRoot;
    for (const category of MEMORY_CATEGORIES) {
      const filePath = path.join(memoryRoot, `${category}.md`);
      let markdown = "";
      try {
        markdown = await fs.readFile(filePath, "utf8");
      } catch {
        continue;
      }
      const parsed = parseFrontmatter(markdown);
      const bullets = parseBulletLines(parsed.body);
      const sanitization = sanitizeMemoryBullets(category, bullets);
      if (!parsed.data.schema_version) {
        issues.push({
          severity: "info",
          message: this.t("memoryFileMissingSchema", { category })
        });
      }
      if (sanitization.issues.length) {
        issues.push({
          severity: "warn",
          message: this.t("memoryFileNonCanonical", { category, count: sanitization.issues.length })
        });
      }
    }
    return issues;
  }

  async collectIndexIssues(vaultRoot) {
    const issues = [];
    const indexRoot = agentPaths(vaultRoot).indexRoot;
    try {
      const entries = await fs.readdir(indexRoot, { withFileTypes: true });
      if (!entries.length) {
        issues.push({
          severity: "info",
          message: this.t("indexEmpty")
        });
      }
    } catch {
      issues.push({
        severity: "warn",
        message: this.t("indexUnreadable")
      });
    }
    return issues;
  }

  async collectOutboxIssues(vaultRoot) {
    const issues = [];
    const outboxRoot = agentPaths(vaultRoot).outboxRoot;
    let staleCount = 0;
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const files = await this.walkFiles(outboxRoot);
    for (const filePath of files) {
      try {
        const stat = await fs.stat(filePath);
        if (stat.mtimeMs < cutoff) {
          staleCount += 1;
        }
      } catch {
        // Ignore unreadable files.
      }
    }
    if (staleCount > 0) {
      issues.push({
        severity: "info",
        message: this.t("outboxStale", { count: staleCount })
      });
    }
    return issues;
  }

  normalizePortableSettings() {
    this.localStatePortabilityReset = false;
    this.normalizeCodexCommand();
    this.normalizeCodexExecSpec();
    this.normalizeLocalBackendBootstrapScript();
  }

  normalizeCodexCommand() {
    const current = String(this.settings.localCodexCommand || "").toLowerCase();
    const foreignWindowsUserPath = isForeignWindowsUserPath(current, os?.homedir?.() || "");
    if (current.includes("\\windowsapps\\") || current.endsWith("\\codex.exe") || foreignWindowsUserPath) {
      this.settings.localCodexCommand = "codex";
      this.localStatePortabilityReset = true;
    }
  }

  normalizeLocalBackendBootstrapScript() {
    if (isForeignWindowsUserPath(this.settings.localBackendBootstrapScript, os?.homedir?.() || "")) {
      this.settings.localBackendBootstrapScript = "";
      this.localStatePortabilityReset = true;
    }
  }

  normalizeCodexExecSpec() {
    const platform = this.getCodexPlatform();
    const spec = this.normalizeExecSpec(this.settings.localCodexExecSpec);
    if (spec && this.isExecSpecCompatibleWithPlatform(spec, platform)) {
      return;
    }
    if (spec || this.settings.localCodexCommandDisplay || this.settings.flatpakHostBridgeOk || this.settings.flatpakHostBridgeBlocked) {
      this.settings.localCodexExecSpec = null;
      this.settings.localCodexCommandDisplay = "";
      this.settings.flatpakHostBridgeOk = false;
      this.settings.flatpakHostBridgeBlocked = false;
      this.localStatePortabilityReset = true;
    }
  }

  setLastResponse(response) {
    this.lastResponse = response;
  }

  getMarkdownViewFromLeaf(leaf) {
    const view = leaf?.view;
    return view instanceof MarkdownView && view.file ? view : null;
  }

  rememberMarkdownView(view) {
    if (!(view instanceof MarkdownView) || !view.file) {
      return;
    }
    this.lastMarkdownView = view;
    this.lastMarkdownFile = view.file;
  }

  refreshLastMarkdownView() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView?.file) {
      this.rememberMarkdownView(activeView);
      return activeView;
    }

    if (this.lastMarkdownView?.file) {
      return this.lastMarkdownView;
    }

    const leaf = this.app.workspace
      .getLeavesOfType("markdown")
      .find((candidate) => candidate.view instanceof MarkdownView && candidate.view.file);
    if (leaf?.view) {
      this.rememberMarkdownView(leaf.view);
      return leaf.view;
    }

    return null;
  }

  getRunOptions(context = {}, message = "") {
    const interactionMode = this.settings.defaultInteractionMode || DEFAULT_SETTINGS.defaultInteractionMode;
    return {
      effort: classifyEffort(message, context, interactionMode),
      interactionMode,
      backupPolicy: interactionMode === "execute" ? "backup-per-file" : "none"
    };
  }

  getConfiguredSystemPrompt(runOptions = {}, backupRoot = "", skillContext = null) {
    const basePrompt = composeSystemPrompt(this.settings.systemPromptSections, this.settings.languageMode);
    const profileLines = ["[prompt-profile]", getPromptProfileInstruction(this.settings.activePromptProfile)];
    const backupInstruction = backupRoot
      ? this.t("workModeExecuteBackupPath", { backupRoot })
      : this.t("workModeExecuteBackupGeneric");
    const modeLines =
      runOptions.interactionMode === "execute"
        ? ["[work-mode]", this.t("workModeExecutePrompt", { backupInstruction })]
        : ["[work-mode]", this.t("workModePlannerPrompt")];
    const skillLines = this.formatSkillContextForPrompt(skillContext);
    return [basePrompt, profileLines.join("\n"), modeLines.join("\n"), skillLines].filter(Boolean).join("\n\n").trim();
  }

  skillIdFromPath(filePath) {
    const root = normalizeSkillsRoot(this.settings.skillsRoot || DEFAULT_SETTINGS.skillsRoot, DEFAULT_SETTINGS.skillsRoot);
    const normalizedPath = String(filePath || "").replaceAll("\\", "/");
    const prefix = `${root}/`;
    if (!normalizedPath.startsWith(prefix) || !normalizedPath.endsWith("/SKILL.md")) {
      return "";
    }
    return normalizedPath.slice(prefix.length, -"/SKILL.md".length).replace(/^\/+|\/+$/g, "");
  }

  async listVaultSkills() {
    const files = this.app.vault.getMarkdownFiles();
    const skills = [];
    for (const file of files) {
      const id = this.skillIdFromPath(file.path);
      if (!id) {
        continue;
      }
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter || {};
      skills.push({
        id,
        path: file.path,
        name: String(frontmatter.name || frontmatter.title || id).trim(),
        description: String(frontmatter.description || "").trim()
      });
    }
    return skills.sort((left, right) => left.id.localeCompare(right.id, this.getLanguage(), { sensitivity: "base" }));
  }

  async ensureExampleSkill() {
    const root = normalizeSkillsRoot(this.settings.skillsRoot || DEFAULT_SETTINGS.skillsRoot, DEFAULT_SETTINGS.skillsRoot);
    const folderPath = `${root}/example`;
    const skillPath = `${folderPath}/SKILL.md`;
    const existing = this.app.vault.getAbstractFileByPath(skillPath);
    if (existing) {
      return existing;
    }
    if (!this.app.vault.getAbstractFileByPath(folderPath)) {
      await this.app.vault.createFolder(folderPath);
    }
    const content = [
      "---",
      'name: "Example Skill"',
      'description: "Shows how to give Cortex reusable instructions from inside the vault."',
      "tags: [example, cortex]",
      "---",
      "",
      "# Example Skill",
      "",
      "Use this skill when the user asks for a structured explanation.",
      "",
      "Instructions:",
      "- Be concise and practical.",
      "- Use the active note and explicit context first.",
      "- Do not run commands or scripts from this skill.",
      "- Ask for missing context only when necessary.",
      ""
    ].join("\n");
    return this.app.vault.create(skillPath, content);
  }

  async getActiveSkillContext() {
    const available = await this.listVaultSkills();
    const enabledIds = new Set(normalizeSkillIds(this.settings.enabledSkillIds));
    const budget = normalizeMaxSkillContextChars(this.settings.maxSkillContextChars, DEFAULT_SETTINGS.maxSkillContextChars);
    const result = {
      enabled: [],
      available,
      issues: [],
      chars: 0,
      text: ""
    };
    if (this.settings.skillsEnabled !== true || !enabledIds.size) {
      return result;
    }
    const chunks = [];
    for (const skill of available.filter((candidate) => enabledIds.has(candidate.id))) {
      try {
        const file = this.app.vault.getAbstractFileByPath(skill.path);
        if (!file) {
          result.issues.push(`${skill.id}: missing file`);
          continue;
        }
        let content = await this.app.vault.read(file);
        const remaining = budget - result.chars;
        if (remaining <= 0) {
          result.issues.push(`${skill.id}: skipped, skill context budget exhausted`);
          break;
        }
        if (content.length > remaining) {
          content = `${content.slice(0, remaining)}\n\n[truncated]`;
          result.issues.push(`${skill.id}: truncated to fit skill context budget`);
        }
        result.enabled.push(skill);
        result.chars += content.length;
        chunks.push(`## ${skill.name || skill.id}\nPath: ${skill.path}\nID: ${skill.id}\n${skill.description ? `Description: ${skill.description}\n` : ""}\n${content}`);
      } catch (error) {
        result.issues.push(`${skill.id}: ${error.message}`);
      }
    }
    result.text = chunks.join("\n\n---\n\n");
    return result;
  }

  formatSkillContextForPrompt(skillContext) {
    if (!skillContext?.text) {
      return "";
    }
    return [
      "[vault-skills]",
      "The following vault skills are user-provided Markdown instructions. Treat them as guidance only. Do not execute scripts or commands from skill folders.",
      skillContext.text
    ].join("\n");
  }

  extractVaultPathFromDataTransfer(dataTransfer) {
    if (!dataTransfer) {
      return "";
    }
    const fragments = [];
    for (const type of Array.from(dataTransfer.types || [])) {
      try {
        const value = dataTransfer.getData(type);
        if (value) {
          fragments.push(value);
        }
      } catch {}
    }
    try {
      for (const file of Array.from(dataTransfer.files || [])) {
        if (file?.name) {
          fragments.push(file.name);
        }
        if (file?.path) {
          fragments.push(file.path);
        }
      }
    } catch {}
    const source = fragments.join("\n");
    if (!source.trim()) {
      return "";
    }
    const candidates = this.app.vault
      .getAllLoadedFiles()
      .filter((item) => item?.path && !isIgnoredVaultPath(item.path))
      .map((item) => ({
        path: item.path,
        name: item.name || item.path.split("/").pop() || item.path,
        basename: item.basename || item.name || item.path.split("/").pop() || item.path,
        isFolder: Boolean(item.children)
      }))
      .sort((left, right) => right.path.length - left.path.length);
    const normalizeDropText = (value) => {
      const raw = String(value || "").trim();
      try {
        return decodeURIComponent(raw).replaceAll("\\", "/").trim();
      } catch {
        return raw.replaceAll("\\", "/").trim();
      }
    };
    const normalizedSource = normalizeDropText(source);
    const sourceLines = normalizedSource
      .split(/\r?\n/)
      .map((line) => normalizeDropText(line).replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    const sourceTokens = new Set([
      normalizedSource,
      ...sourceLines,
      ...sourceLines.flatMap((line) => line.split(/[|,;\t]/).map((part) => normalizeDropText(part).replace(/^["']|["']$/g, "")))
    ].filter(Boolean));
    const matchFromText = (text) => {
      if (!text) {
        return "";
      }
      for (const candidate of candidates) {
        if (text.includes(candidate.path)) {
          return candidate.path;
        }
      }
      const exactPath = candidates.find((candidate) => sourceTokens.has(candidate.path));
      if (exactPath) {
        return exactPath.path;
      }
      const folderNameMatches = candidates.filter((candidate) =>
        candidate.isFolder && (sourceTokens.has(candidate.name) || sourceTokens.has(candidate.basename))
      );
      if (folderNameMatches.length === 1) {
        return folderNameMatches[0].path;
      }
      const fileNameMatches = candidates.filter((candidate) =>
        !candidate.isFolder && (sourceTokens.has(candidate.name) || sourceTokens.has(candidate.basename))
      );
      if (fileNameMatches.length === 1) {
        return fileNameMatches[0].path;
      }
      return "";
    };
    const directMatch = matchFromText(normalizedSource);
    if (directMatch) {
      return directMatch;
    }
    try {
      const parsed = JSON.parse(source);
      const flattened = [];
      const visit = (value) => {
        if (typeof value === "string") {
          flattened.push(value);
          return;
        }
        if (Array.isArray(value)) {
          value.forEach(visit);
          return;
        }
        if (value && typeof value === "object") {
          Object.values(value).forEach(visit);
        }
      };
      visit(parsed);
      const parsedSource = flattened.join("\n").replaceAll("\\", "/");
      const parsedMatch = matchFromText(normalizeDropText(parsedSource));
      if (parsedMatch) {
        return parsedMatch;
      }
    } catch {}
    return "";
  }

  getUiScale() {
    return clampUiScale(this.settings.uiScale);
  }

  getOpenAgentViews() {
    return this.app.workspace
      .getLeavesOfType(VIEW_TYPE)
      .map((leaf) => leaf.view)
      .filter((view) => view instanceof CortexChatView);
  }

  refreshAgentViewScale() {
    for (const view of this.getOpenAgentViews()) {
      view.applyUiScale?.();
    }
  }

  refreshAgentViews() {
    for (const view of this.getOpenAgentViews()) {
      view.render?.();
    }
  }

  async setUiScale(value) {
    this.settings.uiScale = clampUiScale(value);
    await this.saveSettings();
    this.refreshAgentViewScale();
  }

  async adjustUiScale(delta) {
    await this.setUiScale(this.getUiScale() + Number(delta || 0));
  }

  async resetUiScale() {
    await this.setUiScale(DEFAULT_SETTINGS.uiScale);
  }

  async copyLastResponse() {
    if (!this.lastResponse?.answer) {
      new Notice(this.t("noLastResponseCopy"));
      return;
    }
    await navigator.clipboard.writeText(this.lastResponse.answer);
    new Notice(this.t("responseCopied"));
  }

  resolveSetupPlatform() {
    if (Platform?.isWin) {
      return { id: "windows", label: "Windows", desktop: Boolean(Platform?.isDesktopApp) };
    }
    if (Platform?.isMacOS) {
      return { id: "macos", label: "macOS", desktop: Boolean(Platform?.isDesktopApp) };
    }
    if (Platform?.isLinux) {
      return { id: "linux", label: "Linux", desktop: Boolean(Platform?.isDesktopApp) };
    }
    const fallback = detectCodexPlatformSafe(os?.platform ? os.platform() : "");
    const labels = { windows: "Windows", macos: "macOS", linux: "Linux", unsupported: "Unsupported" };
    return { id: fallback, label: labels[fallback] || fallback, desktop: !this.isMobileRuntime() };
  }

  getCodexPlatform() {
    return this.resolveSetupPlatform().id;
  }

  getSetupLogEntries() {
    return Array.isArray(this.settings.codexSetupLog) ? this.settings.codexSetupLog : [];
  }

  compactSetupText(text, maxLength = 600) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized || normalized.length <= maxLength) {
      return normalized;
    }
    return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
  }

  async clearSetupLog() {
    this.settings.codexSetupLog = [];
    this.settings.codexSetupLogCleared = true;
    await this.saveSettings();
  }

  async appendSetupLog(action, detail = "", level = "info") {
    const entries = this.getSetupLogEntries();
    const normalizedAction = String(action || "");
    const normalizedDetail = this.compactSetupText(detail, 600);
    const now = Date.now();
    const duplicate = entries.find((entry) => {
      const entryTime = Date.parse(entry.time || "");
      return (
        entry.action === normalizedAction &&
        entry.detail === normalizedDetail &&
        entry.level === level &&
        Number.isFinite(entryTime) &&
        now - entryTime < 2000
      );
    });
    if (duplicate) {
      return;
    }
    const entry = {
      time: new Date(now).toISOString(),
      level,
      action: normalizedAction,
      detail: normalizedDetail
    };
    this.settings.codexSetupLog = [entry, ...entries].slice(0, 8);
    await this.saveSettings();
  }

  summarizeCommand(command, args = []) {
    return [command, ...(args || [])].filter(Boolean).join(" ");
  }

  assertSupportedLocalPlatform() {
    if (!this.canUseLocalCodex()) {
      throw new Error(this.t("localOnlyDesktop"));
    }
    const platform = this.getCodexPlatform();
    if (platform === "unsupported") {
      throw new Error(`Unsupported operating system for local Codex: ${os?.platform ? os.platform() : "unknown"}`);
    }
    return platform;
  }

  getLocalCommandPathEntries() {
    const entries = [];
    const addEntry = (entry) => {
      const value = String(entry || "").trim();
      if (value && !entries.includes(value)) {
        entries.push(value);
      }
    };
    for (const directory of String(globalThis?.process?.env?.PATH || "").split(path.delimiter || ":")) {
      addEntry(directory);
    }
    for (const home of this.getHomeDirectoryCandidates()) {
      for (const directory of [
        path.join(home, ".local", "share", "npm", "bin"),
        path.join(home, ".local", "bin"),
        path.join(home, ".npm-global", "bin"),
        path.join(home, ".npm", "bin"),
        path.join(home, "node_modules", ".bin")
      ]) {
        addEntry(directory);
      }
    }
    for (const directory of [
      "/opt/codex-desktop/resources/node-runtime/bin",
      "/run/host/usr/bin",
      "/app/bin",
      "/usr/local/bin",
      "/usr/bin",
      "/bin",
      "/opt/homebrew/bin"
    ]) {
      addEntry(directory);
    }
    return entries;
  }

  getLocalCommandEnv() {
    const env = Object.assign({}, globalThis?.process?.env || {});
    env.PATH = this.getLocalCommandPathEntries().join(path.delimiter || ":");
    return env;
  }

  async runLocalCommandDetailed(command, args = [], options = {}) {
    this.assertSupportedLocalPlatform();
    try {
      const { stdout, stderr } = await execFileAsync(command, args, {
        cwd: options.cwd || this.getVaultRoot() || undefined,
        env: options.env || this.getLocalCommandEnv(),
        windowsHide: true,
        timeout: options.timeout || 120000,
        maxBuffer: options.maxBuffer || 1024 * 1024 * 10
      });
      const output = `${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim();
      return {
        ok: true,
        stdout: stdout || "",
        stderr: stderr || "",
        output,
        code: 0,
        error: ""
      };
    } catch (error) {
      const stdout = error.stdout ? String(error.stdout) : "";
      const stderr = error.stderr ? String(error.stderr) : "";
      const output = `${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim();
      return {
        ok: false,
        stdout,
        stderr,
        output,
        code: Number.isFinite(error.code) ? error.code : null,
        error: error.message || String(error)
      };
    }
  }

  async runLocalCommandOrThrow(command, args = [], options = {}) {
    const result = await this.runLocalCommandDetailed(command, args, options);
    if (!result.ok) {
      throw new Error(result.output || result.error || `Command failed: ${this.summarizeCommand(command, args)}`);
    }
    return result.output;
  }

  async runLocalCommand(command, args = [], options = {}) {
    return this.runLocalCommandOrThrow(command, args, options);
  }

  async runExecSpec(spec, args = [], options = {}) {
    return this.runLocalCommand(spec.command, [...(spec.argsPrefix || []), ...(spec.args || []), ...(args || [])], options);
  }

  async runExecSpecDetailed(spec, args = [], options = {}) {
    return this.runLocalCommandDetailed(spec.command, [...(spec.argsPrefix || []), ...(spec.args || []), ...(args || [])], options);
  }

  summarizeExecSpec(spec, args = []) {
    return this.summarizeCommand(spec.command, [...(spec.argsPrefix || []), ...(spec.args || []), ...(args || [])]);
  }

  shellCommandFromExecSpec(spec, args = []) {
    return [spec.command, ...(spec.argsPrefix || []), ...(spec.args || []), ...(args || [])].map((part) => quoteShellArg(part)).join(" ");
  }

  normalizeExecSpec(spec) {
    if (!spec || typeof spec !== "object" || !spec.command) {
      return null;
    }
    return {
      command: String(spec.command || ""),
      argsPrefix: Array.isArray(spec.argsPrefix) ? spec.argsPrefix.map((arg) => String(arg)) : [],
      args: Array.isArray(spec.args) ? spec.args.map((arg) => String(arg)) : [],
      display: String(spec.display || this.summarizeCommand(spec.command, [...(spec.argsPrefix || []), ...(spec.args || [])])),
      kind: String(spec.kind || "command")
    };
  }

  isExecSpecCompatibleWithPlatform(spec, platform = this.getCodexPlatform()) {
    const normalized = this.normalizeExecSpec(spec);
    if (!normalized) {
      return false;
    }
    const command = normalized.command.toLowerCase();
    const kind = normalized.kind.toLowerCase();
    if (kind.startsWith("flatpak-host-")) {
      return platform === "linux" && this.isFlatpakRuntime();
    }
    if (platform === "windows") {
      if (normalized.argsPrefix.length) {
        return false;
      }
      if (command.includes("/") || command === "osascript" || command === "bash" || command.endsWith("\\bash.exe")) {
        return false;
      }
      if (["codex-shell", "codex-node"].includes(kind)) {
        return false;
      }
      return true;
    }
    if (platform === "macos") {
      if (command.includes("\\") || command === "cmd.exe" || command === "powershell.exe" || command === "powershell") {
        return false;
      }
      return !kind.startsWith("flatpak-host-");
    }
    if (platform === "linux") {
      if (command.includes("\\") || command === "cmd.exe" || command === "powershell.exe" || command === "powershell" || command === "osascript") {
        return false;
      }
      return true;
    }
    return false;
  }

  persistCodexExecSpec(spec) {
    const normalized = this.normalizeExecSpec(spec);
    this.settings.localCodexExecSpec = normalized;
    this.settings.localCodexCommandDisplay = normalized?.display || "";
    this.settings.localCodexCommand = normalized?.kind === "codex-wrapper" ? normalized.command : "codex";
    return normalized;
  }

  getProcessDiagnosticSnapshot() {
    const env = globalThis?.process?.env || {};
    const platform = this.resolveSetupPlatform();
    const execPath = String(globalThis?.process?.execPath || "");
    const flatpakInfoExists = Boolean(this.flatpakInfoExists);
    return {
      platform: platform.id,
      platformLabel: platform.label,
      runtime: this.getLinuxRuntimeKind(),
      execPath,
      path: String(env.PATH || ""),
      home: String(env.HOME || os?.homedir?.() || ""),
      shell: String(env.SHELL || ""),
      flatpakId: String(env.FLATPAK_ID || ""),
      flatpakInfoExists
    };
  }

  async refreshRuntimeFacts() {
    this.flatpakInfoExists = await this.fileExists("/.flatpak-info");
    return this.flatpakInfoExists;
  }

  isFlatpakRuntime() {
    const env = globalThis?.process?.env || {};
    const execPath = String(globalThis?.process?.execPath || "");
    return Boolean(env.FLATPAK_ID || execPath.startsWith("/app/") || this.flatpakInfoExists);
  }

  getLinuxRuntimeKind() {
    if (this.getCodexPlatform() !== "linux") {
      return this.getCodexPlatform();
    }
    if (this.isFlatpakRuntime()) {
      return "flatpak";
    }
    const env = globalThis?.process?.env || {};
    if (env.APPIMAGE || String(globalThis?.process?.execPath || "").toLowerCase().includes("appimage")) {
      return "appimage";
    }
    return "native";
  }

  getFlatpakRepairCommand() {
    return "flatpak override --user --talk-name=org.freedesktop.Flatpak md.obsidian.Obsidian";
  }

  isFlatpakHostBridgeBlockedText(value) {
    return /org\.freedesktop\.Flatpak|--host only works|ServiceUnknown/i.test(String(value || ""));
  }

  async copyFlatpakRepairCommand() {
    const command = this.getFlatpakRepairCommand();
    await navigator.clipboard.writeText(command);
    await this.appendSetupLog(this.t("setupRepairFlatpak"), command, "info");
    new Notice(this.t("setupFlatpakRepairCopied"));
  }

  async fileExists(filePath) {
    if (!filePath || !fs?.access) {
      return false;
    }
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  addUniquePathDetail(details, filePath, source = "") {
    const value = String(filePath || "").trim();
    if (!value || details.some((detail) => detail.path === value)) {
      return;
    }
    details.push({ path: value, source, exists: false });
  }

  addUniqueHomeCandidate(candidates, homePath) {
    const value = String(homePath || "").trim().replace(/\/+$/, "");
    if (!value || value === "/" || candidates.includes(value)) {
      return;
    }
    candidates.push(value);
  }

  getHomeDirectoryCandidates() {
    const candidates = [];
    const env = globalThis?.process?.env || {};
    const addHome = (value) => this.addUniqueHomeCandidate(candidates, value);
    addHome(env.HOME);
    addHome(os?.homedir?.());
    try {
      addHome(os?.userInfo?.()?.homedir);
    } catch {
      // userInfo can fail in restricted sandboxes.
    }

    const vaultRoot = this.getVaultRoot() || "";
    const match = vaultRoot.match(/^\/(home|var\/home)\/([^/]+)/);
    if (match) {
      const user = match[2];
      addHome(`/home/${user}`);
      addHome(`/var/home/${user}`);
      addHome(`/run/host/home/${user}`);
      addHome(`/run/host/var/home/${user}`);
    }

    for (const home of [...candidates]) {
      const homeMatch = home.match(/^\/(?:run\/host\/)?(?:var\/)?home\/([^/]+)/);
      if (homeMatch) {
        const user = homeMatch[1];
        addHome(`/home/${user}`);
        addHome(`/var/home/${user}`);
        addHome(`/run/host/home/${user}`);
        addHome(`/run/host/var/home/${user}`);
      }
    }
    return candidates;
  }

  async updatePathDetailsExistence(details) {
    for (const detail of details) {
      detail.exists = await this.fileExists(detail.path);
    }
    return details;
  }

  addUniqueCandidate(candidates, candidate) {
    const value = String(candidate || "").trim();
    if (value && !candidates.includes(value)) {
      candidates.push(value);
    }
  }

  addUniqueExecSpec(candidates, spec) {
    if (!spec?.command) {
      return;
    }
    const display = spec.display || this.summarizeExecSpec(spec);
    if (!candidates.some((candidate) => candidate.display === display)) {
      candidates.push(Object.assign({}, spec, { display }));
    }
  }

  async getBundledNodeCommand() {
    const bundled = "/opt/codex-desktop/resources/node-runtime/bin/node";
    if (await this.fileExists(bundled)) {
      return bundled;
    }
    return "";
  }

  async getFlatpakSpawnCommand() {
    if (!this.isFlatpakRuntime()) {
      return "";
    }
    for (const candidate of ["/usr/bin/flatpak-spawn", "/bin/flatpak-spawn", "/app/bin/flatpak-spawn", "flatpak-spawn"]) {
      if (candidate === "flatpak-spawn" || (await this.fileExists(candidate))) {
        return candidate;
      }
    }
    return "";
  }

  async getNpmCliPath() {
    const bundled = "/opt/codex-desktop/resources/node-runtime/lib/node_modules/npm/bin/npm-cli.js";
    if (await this.fileExists(bundled)) {
      return bundled;
    }
    return "";
  }

  async getCodexWrapperCandidateDetails() {
    const details = [];
    this.addUniquePathDetail(details, "codex", "portable");
    for (const home of this.getHomeDirectoryCandidates()) {
      for (const wrapper of [
        path.join(home, ".local", "share", "npm", "bin", "codex"),
        path.join(home, ".local", "bin", "codex"),
        path.join(home, ".npm-global", "bin", "codex"),
        path.join(home, ".npm", "bin", "codex")
      ]) {
        this.addUniquePathDetail(details, wrapper, `home ${home}`);
      }
    }
    for (const directory of this.getLocalCommandPathEntries()) {
      this.addUniquePathDetail(details, path.join(directory, "codex"), `PATH ${directory}`);
    }
    return this.updatePathDetailsExistence(details);
  }

  async getCodexCliScriptCandidateDetails() {
    const details = [];
    for (const home of this.getHomeDirectoryCandidates()) {
      for (const scriptPath of [
        path.join(home, ".local", "share", "npm", "lib", "node_modules", "@openai", "codex", "bin", "codex.js"),
        path.join(home, ".npm-global", "lib", "node_modules", "@openai", "codex", "bin", "codex.js"),
        path.join(home, ".npm", "lib", "node_modules", "@openai", "codex", "bin", "codex.js"),
        path.join(home, "node_modules", "@openai", "codex", "bin", "codex.js")
      ]) {
        this.addUniquePathDetail(details, scriptPath, `home ${home}`);
      }
    }
    for (const scriptPath of [
      "/usr/local/lib/node_modules/@openai/codex/bin/codex.js",
      "/app/lib/node_modules/@openai/codex/bin/codex.js",
      "/run/host/usr/local/lib/node_modules/@openai/codex/bin/codex.js",
      "/opt/homebrew/lib/node_modules/@openai/codex/bin/codex.js"
    ]) {
      this.addUniquePathDetail(details, scriptPath, "standard");
    }

    for (const wrapper of await this.getCodexWrapperCandidateDetails()) {
      if (wrapper.path === "codex" || !wrapper.exists) {
        continue;
      }
      try {
        const realPath = await fs.realpath(wrapper.path);
        this.addUniquePathDetail(details, realPath, `realpath ${wrapper.path}`);
      } catch {
        // Symlink resolution is best effort.
      }
      try {
        const linkTarget = await fs.readlink(wrapper.path);
        const resolvedTarget = path.isAbsolute(linkTarget) ? linkTarget : path.resolve(path.dirname(wrapper.path), linkTarget);
        this.addUniquePathDetail(details, resolvedTarget, `readlink ${wrapper.path}`);
      } catch {
        // readlink only works for symlinks.
      }
      const wrapperDir = path.dirname(wrapper.path);
      const npmPrefix = path.dirname(wrapperDir);
      this.addUniquePathDetail(
        details,
        path.join(npmPrefix, "lib", "node_modules", "@openai", "codex", "bin", "codex.js"),
        `derived ${wrapper.path}`
      );
    }

    for (const npmSpec of await this.getNpmExecSpecs()) {
      const result = await this.runExecSpecDetailed(npmSpec, ["root", "-g"], { timeout: 10000 });
      if (result.ok && result.output.trim()) {
        this.addUniquePathDetail(
          details,
          path.join(result.output.trim(), "@openai", "codex", "bin", "codex.js"),
          `npm root -g ${npmSpec.display}`
        );
      }
    }
    return this.updatePathDetailsExistence(details);
  }

  async getCodexCliScriptCandidates() {
    return (await this.getCodexCliScriptCandidateDetails())
      .filter((detail) => detail.exists)
      .map((detail) => detail.path);
  }

  getPathCommandCandidates(commandName) {
    const candidates = [];
    for (const directory of this.getLocalCommandPathEntries()) {
      if (directory) {
        this.addUniqueCandidate(candidates, path.join(directory, commandName));
      }
    }
    return candidates;
  }

  async resolveLinuxCommandCandidates(commandName) {
    const candidates = [];
    this.addUniqueCandidate(candidates, commandName);
    for (const pathCandidate of this.getPathCommandCandidates(commandName)) {
      this.addUniqueCandidate(candidates, pathCandidate);
    }

    const npmCandidates = commandName === "npm" ? candidates : await this.resolveLinuxCommandCandidates("npm");
    if (commandName !== "npm") {
      for (const npmCommand of npmCandidates) {
        try {
          const prefix = (await this.runLocalCommand(npmCommand, ["prefix", "-g"], { timeout: 10000 })).trim();
          if (prefix) {
            this.addUniqueCandidate(candidates, path.join(prefix, "bin", commandName));
          }
        } catch {
          // npm prefix is a best-effort hint.
        }
      }
    }

    const existing = [];
    for (const candidate of candidates) {
      if (candidate === commandName || (await this.fileExists(candidate))) {
        this.addUniqueCandidate(existing, candidate);
      }
    }
    return existing;
  }

  async getCodexCommandCandidates(configuredCommand = "") {
    const candidates = [];
    const addCandidate = (candidate) => this.addUniqueCandidate(candidates, candidate);
    addCandidate(configuredCommand || "codex");
    if (!isPortableCodexCommand(configuredCommand)) {
      addCandidate("codex");
    }
    const platform = this.getCodexPlatform();
    const possiblePaths =
      platform === "linux"
        ? (await this.getCodexWrapperCandidateDetails()).filter((detail) => detail.path === "codex" || detail.exists).map((detail) => detail.path)
        : platform === "windows"
        ? []
        : [
            ...this.getHomeDirectoryCandidates().flatMap((home) => [
              path.join(home, ".local", "share", "npm", "bin", "codex"),
              path.join(home, ".local", "bin", "codex"),
              path.join(home, ".npm-global", "bin", "codex"),
              path.join(home, ".npm", "bin", "codex"),
              path.join(home, "node_modules", ".bin", "codex")
            ]),
            "/usr/local/bin/codex",
            "/opt/homebrew/bin/codex"
          ];
    for (const candidatePath of possiblePaths) {
      if (candidatePath === "codex" || (await this.fileExists(candidatePath))) {
        addCandidate(candidatePath);
      }
    }
    return candidates;
  }

  async getNodeExecSpecs() {
    const specs = [];
    const addNodeSpec = async (command) => {
      if (command === "node" || (await this.fileExists(command))) {
        this.addUniqueExecSpec(specs, { command, args: [], display: command, kind: "node" });
      }
    };
    await addNodeSpec("node");
    for (const command of [
      "/usr/bin/node",
      "/app/bin/node",
      "/run/host/usr/bin/node",
      "/usr/local/bin/node",
      "/bin/node",
      "/opt/codex-desktop/resources/node-runtime/bin/node",
      "/opt/homebrew/bin/node"
    ]) {
      await addNodeSpec(command);
    }
    for (const candidate of await this.resolveLinuxCommandCandidates("node")) {
      await addNodeSpec(candidate);
    }
    return specs;
  }

  async getNpmExecSpecs() {
    const specs = [];
    const platform = this.getCodexPlatform();
    if (platform === "windows") {
      this.addUniqueExecSpec(specs, { command: "cmd.exe", args: ["/d", "/s", "/c", "npm.cmd"], display: "npm.cmd", kind: "npm" });
      this.addUniqueExecSpec(specs, { command: "cmd.exe", args: ["/d", "/s", "/c", "npm"], display: "npm", kind: "npm" });
      return specs;
    }
    for (const npmCommand of await this.resolveLinuxCommandCandidates("npm")) {
      this.addUniqueExecSpec(specs, { command: npmCommand, args: [], display: npmCommand, kind: "npm" });
    }
    const node = await this.getBundledNodeCommand();
    const npmCli = await this.getNpmCliPath();
    if (node && npmCli) {
      this.addUniqueExecSpec(specs, { command: node, args: [npmCli], display: `${node} ${npmCli}`, kind: "npm-node" });
    }
    return specs;
  }

  async resolveNpmExecSpec() {
    let lastError = null;
    for (const spec of await this.getNpmExecSpecs()) {
      try {
        const version = await this.runExecSpec(spec, ["--version"], { timeout: 10000 });
        this.settings.npmAvailableOk = true;
        this.settings.npmVersion = version.trim();
        return spec;
      } catch (error) {
        lastError = error;
      }
    }
    this.settings.npmAvailableOk = false;
    this.settings.npmVersion = "";
    if (lastError) {
      return null;
    }
    return null;
  }

  async resolveNodeExecSpec() {
    for (const spec of await this.getNodeExecSpecs()) {
      try {
        const version = await this.runExecSpec(spec, ["--version"], { timeout: 10000 });
        this.settings.nodeAvailableOk = true;
        this.settings.nodeVersion = version.trim();
        return spec;
      } catch {
        // Keep looking for a usable Node.js command.
      }
    }
    this.settings.nodeAvailableOk = false;
    this.settings.nodeVersion = "";
    return null;
  }

  async getCodexExecSpecs(configuredCommand = "") {
    const specs = [];
    const platform = this.getCodexPlatform();
    const saved = this.normalizeExecSpec(this.settings.localCodexExecSpec);
    if (saved && this.isExecSpecCompatibleWithPlatform(saved, platform)) {
      this.addUniqueExecSpec(specs, saved);
    }

    if (platform === "windows") {
      const addWindowsCodexCommand = (command, kind = "windows-codex") => {
        const value = String(command || "").trim();
        if (!value) {
          return;
        }
        this.addUniqueExecSpec(specs, {
          command: "cmd.exe",
          args: ["/d", "/s", "/c", value],
          display: `cmd.exe /d /s /c ${value}`,
          kind
        });
      };
      if (!isPortableCodexCommand(configuredCommand)) {
        addWindowsCodexCommand(configuredCommand, "windows-codex-configured");
      }
      addWindowsCodexCommand("codex.cmd", "windows-codex-cmd");
      addWindowsCodexCommand("codex", "windows-codex");
      return specs;
    }

    await this.refreshRuntimeFacts();
    if (this.isFlatpakRuntime()) {
      const flatpakSpawn = await this.getFlatpakSpawnCommand();
      if (flatpakSpawn) {
        this.addUniqueExecSpec(specs, {
          command: flatpakSpawn,
          argsPrefix: ["--host", "codex"],
          display: `${flatpakSpawn} --host codex`,
          kind: "flatpak-host-codex"
        });
        for (const wrapper of await this.getCodexWrapperCandidateDetails()) {
          if (wrapper.path !== "codex" && wrapper.exists) {
            this.addUniqueExecSpec(specs, {
              command: flatpakSpawn,
              argsPrefix: ["--host", wrapper.path],
              display: `${flatpakSpawn} --host ${wrapper.path}`,
              kind: "flatpak-host-wrapper"
            });
          }
        }
        for (const scriptPath of (await this.getCodexCliScriptCandidateDetails()).filter((detail) => detail.exists).map((detail) => detail.path)) {
          this.addUniqueExecSpec(specs, {
            command: flatpakSpawn,
            argsPrefix: ["--host", "node", scriptPath],
            display: `${flatpakSpawn} --host node ${scriptPath}`,
            kind: "flatpak-host-node"
          });
        }
      }
    }

    const nodeCommands = [];
    const addNodeCommand = async (candidate) => {
      if (candidate && !nodeCommands.includes(candidate) && (await this.fileExists(candidate))) {
        nodeCommands.push(candidate);
      }
    };
    for (const spec of await this.getNodeExecSpecs()) {
      if (spec.command !== "node") {
        await addNodeCommand(spec.command);
      }
    }
    await addNodeCommand("/usr/bin/node");
    await addNodeCommand("/app/bin/node");
    await addNodeCommand("/run/host/usr/bin/node");
    await addNodeCommand("/usr/local/bin/node");
    await addNodeCommand(await this.getBundledNodeCommand());
    await addNodeCommand("/opt/homebrew/bin/node");
    for (const candidate of await this.resolveLinuxCommandCandidates("node")) {
      if (candidate !== "node") {
        await addNodeCommand(candidate);
      }
    }

    for (const scriptPath of await this.getCodexCliScriptCandidates()) {
      for (const nodeCommand of nodeCommands) {
        this.addUniqueExecSpec(specs, {
          command: nodeCommand,
          args: [scriptPath],
          display: `${nodeCommand} ${scriptPath}`,
          kind: "codex-node"
        });
      }
    }

    for (const candidate of await this.getCodexCommandCandidates(configuredCommand)) {
      if (candidate !== "codex") {
        this.addUniqueExecSpec(specs, { command: candidate, args: [], display: candidate, kind: "codex-wrapper" });
      }
    }

    if (await this.fileExists("/bin/bash")) {
      const shellPath = [
        ...this.getHomeDirectoryCandidates().map((home) => path.join(home, ".local", "share", "npm", "bin")),
        "/usr/bin",
        "/bin",
        "/app/bin",
        "/run/host/usr/bin"
      ].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(":");
      this.addUniqueExecSpec(specs, {
        command: "/bin/bash",
        args: ["-lc", `PATH=${quoteShellArg(shellPath)}:$PATH codex "$@"`, "codex"],
        display: "/bin/bash -lc codex",
        kind: "codex-shell"
      });
    }
    return specs;
  }

  async diagnoseCodexCli(options = {}) {
    const notify = options.notify === true;
    const shouldLog = options.log === true;
    this.assertSupportedLocalPlatform();
    await this.refreshRuntimeFacts();
    await this.resolveNodeExecSpec();
    await this.resolveNpmExecSpec();
    const snapshot = this.getProcessDiagnosticSnapshot();
    const flatpakSpawn = this.isFlatpakRuntime() ? await this.getFlatpakSpawnCommand() : "";
    const scriptDetails = await this.getCodexCliScriptCandidateDetails();
    const wrapperDetails = await this.getCodexWrapperCandidateDetails();
    const nodeSpecs = await this.getNodeExecSpecs();
    const scriptsFound = scriptDetails.filter((detail) => detail.exists).length;
    const wrappersFound = wrapperDetails.filter((detail) => detail.path !== "codex" && detail.exists).length;
    const nodesFound = nodeSpecs.filter((spec) => spec.command !== "node").length;
    const candidates = await this.getCodexExecSpecs(options.configuredCommand || this.settings.localCodexCommand || "codex");
    const traces = [];
    let winner = null;
    let version = "";

    for (const spec of candidates) {
      const normalized = this.normalizeExecSpec(spec);
      if (!normalized) {
        continue;
      }
      const trace = {
        display: normalized.display,
        kind: normalized.kind,
        command: normalized.command,
        args: normalized.args,
        exists: normalized.command.includes("/") ? await this.fileExists(normalized.command) : null,
        ok: false,
        code: null,
        stdout: "",
        stderr: "",
        error: ""
      };
      const result = await this.runExecSpecDetailed(normalized, ["--version"], { timeout: 30000 });
      trace.ok = result.ok;
      trace.code = result.code;
      trace.stdout = result.stdout.trim();
      trace.stderr = result.stderr.trim();
      trace.error = result.error;
      traces.push(trace);
      if (result.ok) {
        const output = result.output;
        version = output
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .find((line) => /codex/i.test(line)) || output.trim();
        winner = normalized;
        break;
      }
    }

    const hostBridgeTrace = this.isFlatpakRuntime() && flatpakSpawn
      ? await this.runLocalCommandDetailed(flatpakSpawn, ["--host", "sh", "-lc", "command -v codex && codex --version"], { timeout: 30000 })
      : { ok: false, output: "", error: "" };
    const winnerUsesFlatpakHost = Boolean(winner?.kind && String(winner.kind).startsWith("flatpak-host-"));
    const hostBridgeBlocked = this.isFlatpakRuntime() && flatpakSpawn && !winnerUsesFlatpakHost && this.isFlatpakHostBridgeBlockedText(`${hostBridgeTrace.error}\n${hostBridgeTrace.stderr}\n${hostBridgeTrace.output}`);
    this.settings.flatpakHostBridgeOk = Boolean(hostBridgeTrace.ok || winnerUsesFlatpakHost);
    this.settings.flatpakHostBridgeBlocked = Boolean(hostBridgeBlocked);
    const flatpakCounts = this.isFlatpakRuntime()
      ? `; flatpak-info=${snapshot.flatpakInfoExists}; flatpak-spawn=${flatpakSpawn || "missing"}; codex via host=${hostBridgeTrace.ok ? "ok" : "fail"}`
      : "";
    const baseCounts = `runtime: ${snapshot.runtime}${flatpakCounts}; scripts encontrados: ${scriptsFound}/${scriptDetails.length}; nodes encontrados: ${nodesFound}/${nodeSpecs.length}; estrategias probadas: ${traces.length}`;
    const noScriptMessage = wrappersFound > 0 && scriptsFound === 0
      ? "Codex wrapper encontrado, pero no se pudo resolver codex.js desde el sandbox de Obsidian."
      : "";
    const summary = winner
      ? `OK ${winner.display} (${version}); ${baseCounts}`
      : `${hostBridgeBlocked ? `Obsidian Flatpak bloquea la ejecución de Codex del host. Ejecuta: ${this.getFlatpakRepairCommand()} y reinicia Obsidian.` : this.isFlatpakRuntime() && !flatpakSpawn ? "Obsidian Flatpak no puede ejecutar Codex del host. Usa la AppImage/deb de Obsidian o habilita flatpak-spawn/host access." : noScriptMessage || "Sin estrategia válida."} ${baseCounts}. Último error: ${traces[traces.length - 1]?.error || hostBridgeTrace.error || "sin detalle"}`;
    const compactSummary = winner
      ? `OK ${winner.display} (${version}); runtime=${snapshot.runtime}; permiso host=${this.settings.flatpakHostBridgeOk ? "OK" : "pendiente"}; estrategias=${traces.length}`
      : this.compactSetupText(summary, 360);
    this.settings.codexDiagnosticSummary = compactSummary;
    this.settings.codexDiagnosticDetail = [
      summary,
      `HOME=${snapshot.home || "(empty)"}`,
      `os.homedir=${os?.homedir?.() || "(empty)"}`,
      `process.execPath=${snapshot.execPath || "(empty)"}`,
      `PATH=${snapshot.path || "(empty)"}`
    ].join("\n");
    this.settings.codexLastCheck = new Date().toISOString();
    if (winner) {
      this.persistCodexExecSpec(winner);
      this.settings.codexVersion = version;
      this.settings.codexStatus = `${this.t("codexFound")} ${winner.display}`;
      this.settings.codexInstalledOk = true;
      this.settings.codexLoginOk = Boolean(this.settings.codexLoginOk);
      if (this.getCodexPlatform() === "windows") {
        this.settings.flatpakHostBridgeOk = false;
        this.settings.flatpakHostBridgeBlocked = false;
        this.settings.codexSetupLog = this.getSetupLogEntries().filter((entry) => !/flatpak-spawn|flatpak-info|codex via host/i.test(`${entry.action || ""}\n${entry.detail || ""}`));
      }
    } else {
      this.settings.codexInstalledOk = false;
      this.settings.codexLoginOk = false;
      this.settings.codexExecutionOk = false;
      this.settings.codexSetupCompleted = false;
      this.settings.codexStatus = hostBridgeBlocked
        ? "Obsidian Flatpak bloquea la ejecución de Codex del host."
        : this.isFlatpakRuntime() && !flatpakSpawn
        ? "Codex instalado, pero Obsidian Flatpak no puede ejecutar Node/Codex del host."
        : noScriptMessage || `Codex no disponible: ${summary}`;
    }
    await this.saveSettings();
    if (shouldLog) {
      const compactTrace = traces
        .slice(0, 8)
        .map((trace) => `${trace.ok ? "OK" : "FAIL"} ${trace.display} exists=${trace.exists}${trace.ok ? "" : ` => ${trace.error || trace.stderr || "error"}`}`)
        .join("\n");
      const scriptTrace = scriptDetails
        .slice(0, 12)
        .map((detail) => `${detail.exists ? "FOUND" : "MISS"} script ${detail.path} (${detail.source})`)
        .join("\n");
      const nodeTrace = nodeSpecs.map((spec) => `NODE ${spec.display}`).join("\n");
      const runtimeTrace = [
        `runtime=${snapshot.runtime}`,
        `process.execPath=${snapshot.execPath}`,
        `HOME=${snapshot.home}`,
        `PATH=${snapshot.path}`,
        ...(this.isFlatpakRuntime()
          ? [
              `/.flatpak-info exists=${snapshot.flatpakInfoExists}`,
              `flatpak-spawn=${flatpakSpawn || "missing"}`,
              `codex via host=${hostBridgeTrace.ok ? hostBridgeTrace.output : hostBridgeTrace.error}`
            ]
          : [])
      ].join("\n");
      const repairTrace = hostBridgeBlocked ? `Flatpak host bridge blocked. Run: ${this.getFlatpakRepairCommand()}` : "";
      this.settings.codexDiagnosticDetail = `${this.settings.codexDiagnosticDetail}\n${repairTrace}\n${runtimeTrace}\n${scriptTrace}\n${nodeTrace}\n${compactTrace}`.trim();
      await this.appendSetupLog(this.t("setupDiagnose"), compactSummary, winner ? "ok" : "error");
    }
    if (notify) {
      new Notice(summary);
    }
    return { ok: Boolean(winner), spec: winner, version, traces, snapshot, summary };
  }

  async resolveCodexExecSpec(configuredCommand = "") {
    const diagnostic = await this.diagnoseCodexCli({ notify: false, log: false, configuredCommand });
    if (diagnostic?.ok) {
      return { spec: diagnostic.spec, version: diagnostic.version, traces: diagnostic.traces };
    }
    throw new Error(diagnostic?.summary || "Codex command not found.");
  }

  async getNpmInstallCandidates() {
    const candidates = [];
    for (const spec of await this.getNpmExecSpecs()) {
      try {
        await this.runExecSpec(spec, ["--version"], { timeout: 10000 });
        candidates.push([spec, ["install", "-g", "@openai/codex"]]);
      } catch {
        // Keep looking for a usable npm.
      }
    }
    return candidates;
  }

  async runLocalCommandDetached(command, args = [], options = {}) {
    this.assertSupportedLocalPlatform();
    if (!childProcess?.spawn) {
      throw new Error(this.t("localOnlyDesktop"));
    }
    await new Promise((resolve, reject) => {
      const child = childProcess.spawn(command, args, {
        cwd: options.cwd || this.getVaultRoot() || undefined,
        env: this.getLocalCommandEnv(),
        detached: true,
        stdio: "ignore",
        windowsHide: false
      });
      child.once("error", reject);
      child.once("spawn", () => {
        child.unref();
        resolve();
      });
    });
  }

  async runCodexExec(options = {}, timeout = 180000) {
    this.assertSupportedLocalPlatform();
    if (!childProcess?.spawn) {
      throw new Error(this.t("localOnlyDesktop"));
    }
    const prompt = await fs.readFile(options.promptPath, "utf8");
    const codexSpec = options.codexSpec || (await this.resolveCodexExecSpec(options.codexCommand || this.settings.localCodexCommand || "codex")).spec;
    const args = buildCodexExecArgsSafe(options);
    const childArgs = [...(codexSpec.argsPrefix || []), ...(codexSpec.args || []), ...args];
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";
      let settled = false;
      const child = childProcess.spawn(codexSpec.command, childArgs, {
        cwd: options.vaultRoot || this.getVaultRoot() || undefined,
        env: this.getLocalCommandEnv(),
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      });
      const timer = setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        child.kill();
        reject(new Error("Codex local timed out."));
      }, timeout);
      child.stdout?.on("data", (chunk) => {
        stdout += chunk.toString("utf8");
      });
      child.stderr?.on("data", (chunk) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", (error) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        const output = `${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim();
        if (code === 0) {
          resolve(output);
        } else {
          const error = new Error(output || `Codex exited with code ${code}`);
          error.stdout = stdout;
          error.stderr = stderr;
          reject(error);
        }
      });
      child.stdin.end(prompt);
    });
  }

  async autoCheckCodexSetup(options = {}) {
    if (this.isMobileRuntime()) {
      const ready = await this.checkRemoteBackendForMobile(options);
      return { ready, installed: false, login: ready, execution: ready };
    }
    const notify = Boolean(options.notify);
    const install = await this.checkCodexStatus({ notify: false });
    if (!install) {
      if (notify) {
        new Notice(this.t("codexNotReady"));
      }
      return { ready: false, installed: false, login: false, execution: false };
    }

    const login = await this.checkCodexLoginStatus({ notify: false });
    if (!login) {
      this.settings.codexSetupCompleted = false;
      await this.saveSettings();
      if (notify) {
        new Notice(this.t("codexInstalledNoOauth"));
      }
      return { ready: false, installed: true, login: false, execution: false };
    }

    const ready = Boolean(this.settings.codexExecutionOk);
    this.settings.codexSetupCompleted = ready;
    if (ready) {
      this.settings.codexStatus = this.t("codexOauthOk");
    }
    await this.saveSettings();
    if (notify) {
      new Notice(ready ? this.t("codexReady") : this.t("codexLoginDetected"));
    }
    return { ready, installed: true, login: true, execution: ready };
  }

  async prepareCodexSetup(options = {}) {
    const notify = options.notify !== false;
    if (this.isMobileRuntime()) {
      const ready = await this.checkRemoteBackendForMobile({ notify });
      return { ready, installed: false, login: ready, execution: ready };
    }

    this.assertSupportedLocalPlatform();
    await this.diagnoseCodexCli({ notify: false, log: true });

    let install = await this.checkCodexStatus({ notify: false, log: false });
    if (!install) {
      await this.installOrUpdateCodex();
      install = await this.checkCodexStatus({ notify: false, log: false });
    }
    if (!install) {
      if (notify) {
        new Notice(this.t("codexNotReady"));
      }
      return { ready: false, installed: false, login: false, execution: false };
    }

    const login = await this.checkCodexLoginStatus({ notify: false });
    if (!login) {
      await this.launchCodexLogin();
      this.settings.codexSetupCompleted = false;
      this.settings.codexStatus = this.t("setupLoginOpenedStatus");
      await this.saveSettings();
      if (notify) {
        new Notice(this.t("setupLoginOpenedStatus"));
      }
      return { ready: false, installed: true, login: false, execution: false };
    }

    const output = await this.testCodexExecution({ notify: false });
    const execution = Boolean(output && this.settings.codexExecutionOk);
    if (execution && this.isLocalBackendUrl(this.settings.backendUrl)) {
      await this.registerLocalDeviceIfPossible({ notify: false });
    }
    if (notify) {
      new Notice(execution ? this.t("codexReady") : this.t("codexExecutionFailed"));
    }
    return {
      ready: execution,
      installed: true,
      login: true,
      execution
    };
  }

  async checkCodexStatus(options = {}) {
    const notify = options.notify !== false;
    const shouldLog = options.log !== false;
    try {
      this.assertSupportedLocalPlatform();
      this.normalizeCodexCommand();
      await this.resolveNodeExecSpec();
      await this.resolveNpmExecSpec();
      const configuredCodexCommand = this.settings.localCodexCommand || "codex";
      const parsed = await this.resolveCodexExecSpec(configuredCodexCommand);
      const spec = parsed.spec;
      this.settings.localCodexCommand = spec.kind === "codex-node" ? "codex" : spec.command;
      this.settings.localCodexCommandDisplay = spec.display || this.summarizeExecSpec(spec);
      this.settings.codexVersion = parsed.version || "";
      this.settings.codexStatus = `${this.t("codexFound")} ${this.settings.localCodexCommandDisplay || "PATH"}`;
      this.settings.codexLastCheck = new Date().toISOString();
      this.settings.codexInstalledOk = true;
      await this.saveSettings();
      if (shouldLog) {
        await this.appendSetupLog(this.t("setupCli"), `${this.t("codexFound")} ${this.settings.localCodexCommandDisplay || "PATH"} ${parsed.version || ""}`, "ok");
      }
      if (notify) {
        new Notice(this.t("codexFound"));
      }
      return parsed;
    } catch (error) {
      this.settings.codexStatus = `Codex no disponible: ${error.message}`;
      this.settings.codexLastCheck = new Date().toISOString();
      this.settings.codexInstalledOk = false;
      this.settings.codexLoginOk = false;
      this.settings.codexExecutionOk = false;
      this.settings.codexSetupCompleted = false;
      await this.saveSettings();
      if (shouldLog) {
        await this.appendSetupLog(this.t("setupCli"), error.message, "error");
      }
      if (notify) {
        new Notice(this.t("codexNotReady"));
      }
      return null;
    }
  }

  async checkCodexLoginStatus(options = {}) {
    const notify = options.notify !== false;
    try {
      this.assertSupportedLocalPlatform();
      const { spec } = await this.resolveCodexExecSpec(this.settings.localCodexCommand || "codex");
      const output = await this.runExecSpec(spec, ["login", "status"], { timeout: 30000 });
      const loginOk = !/(not logged|not signed|no auth|login required|error loading configuration|not authenticated)/i.test(output);
      this.settings.codexLoginOk = loginOk;
      this.settings.codexStatus = loginOk ? this.t("codexLoginDetected") : this.t("codexLoginPending");
      this.settings.codexLastCheck = new Date().toISOString();
      if (!loginOk) {
        this.settings.codexExecutionOk = false;
        this.settings.codexSetupCompleted = false;
      }
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupOauth"), this.settings.codexStatus, loginOk ? "ok" : "warn");
      if (notify) {
        new Notice(loginOk ? this.t("codexLoginDetected") : this.t("codexLoginPending"));
      }
      return loginOk;
    } catch (error) {
      this.settings.codexLoginOk = false;
      this.settings.codexExecutionOk = false;
      this.settings.codexSetupCompleted = false;
      this.settings.codexStatus = `${this.t("oauthCheckFailed")} ${error.message}`;
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupOauth"), error.message, "error");
      if (notify) {
        new Notice(this.t("oauthCheckFailed"));
      }
      return false;
    }
  }

  async ensureCodexVaultTrust() {
    if (!this.canUseLocalCodex()) {
      throw new Error(this.t("localOnlyDesktop"));
    }
    if (!this.settings.allowCodexVaultTrust) {
      return false;
    }
    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot) {
      return false;
    }

    const configDir = path.join(os.homedir(), ".codex");
    const configPath = path.join(configDir, "config.toml");
    const normalizedVault = vaultRoot.toLowerCase().replaceAll("\\", "\\\\");
    const projectBlock = `[projects.'${normalizedVault}']\ntrust_level = "trusted"\n`;

    await fs.mkdir(configDir, { recursive: true });
    let existing = "";
    try {
      existing = await fs.readFile(configPath, "utf8");
    } catch {
      existing = "";
    }

    if (existing.toLowerCase().includes(`[projects.'${normalizedVault}']`)) {
      return true;
    }

    const next = `${existing.trimEnd()}\n\n${projectBlock}`;
    await fs.writeFile(configPath, next.trimStart(), "utf8");
    return true;
  }

  async installOrUpdateCodex() {
    new Notice(this.t("installingCodex"));
    try {
      this.assertSupportedLocalPlatform();
      if (this.settings.flatpakHostBridgeBlocked) {
        const message = `Obsidian Flatpak bloquea la ejecución de Codex del host. Ejecuta: ${this.getFlatpakRepairCommand()} y reinicia Obsidian.`;
        this.settings.codexStatus = message;
        this.settings.codexLastCheck = new Date().toISOString();
        await this.saveSettings();
        await this.appendSetupLog(this.t("setupInstall"), message, "error");
        new Notice(message);
        return "";
      }
      const existingCodex = await this.checkCodexStatus({ notify: false, log: false });
      if (existingCodex) {
        const npmSpec = await this.resolveNpmExecSpec();
        if (!npmSpec) {
          const message = "Codex CLI encontrado. npm no disponible para actualizar; se omite instalación.";
          this.settings.codexStatus = message;
          this.settings.codexLastCheck = new Date().toISOString();
          await this.saveSettings();
          await this.appendSetupLog(this.t("setupInstall"), message, "ok");
          new Notice(message);
          return "";
        }
      }
      const npmCandidates = await this.getNpmInstallCandidates();
      if (!npmCandidates.length) {
        throw new Error("npm not found. Install Node.js/npm first. Linux: sudo pacman -S nodejs npm (Arch/EndeavourOS), sudo apt install nodejs npm (Debian/Ubuntu), sudo dnf install nodejs npm (Fedora).");
      }
      let output = "";
      let lastError = null;
      let installCommand = "";
      for (const [npmSpec, npmArgs] of npmCandidates) {
        try {
          installCommand = this.summarizeExecSpec(npmSpec, npmArgs);
          output = await this.runExecSpec(npmSpec, npmArgs, { timeout: 300000 });
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (lastError) {
        throw lastError;
      }
      this.settings.codexStatus = this.t("codexInstalled");
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupInstall"), installCommand ? `${this.t("codexInstalled")} (${installCommand})` : this.t("codexInstalled"), "ok");
      new Notice(this.t("codexInstalled"));
      await this.checkCodexStatus({ log: false });
      return output;
    } catch (error) {
      const permissionHint =
        this.getCodexPlatform() !== "windows" && /eacces|permission denied|operation not permitted/i.test(String(error.message || ""))
          ? " npm global no tiene permisos; instala Codex manualmente o configura npm global sin sudo."
          : "";
      this.settings.codexStatus = `${this.t("codexInstallFailed")} ${error.message}${permissionHint}`;
      this.settings.codexLastCheck = new Date().toISOString();
      this.settings.codexSetupCompleted = false;
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupInstall"), `${error.message}${permissionHint}`, "error");
      new Notice(this.t("codexInstallFailed"));
      throw error;
    }
  }

  async launchCodexLogin() {
    const platform = this.assertSupportedLocalPlatform();
    const { spec: codexSpec } = await this.resolveCodexExecSpec(this.settings.localCodexCommand || "codex");
    const codexCommand = this.shellCommandFromExecSpec(codexSpec, ["login"]);
    if (platform === "windows") {
      const windowsLoginCommand = this.summarizeExecSpec(codexSpec, ["login"]);
      await this.appendSetupLog(this.t("setupLogin"), `cmd.exe /d /s /c start Cortex Codex Login cmd.exe /k ${windowsLoginCommand}`, "info");
      await this.runLocalCommandDetached("cmd.exe", ["/d", "/s", "/c", "start", "Cortex Codex Login", "cmd.exe", "/k", windowsLoginCommand]);
    } else if (platform === "macos") {
      const script = `tell application "Terminal" to do script ${JSON.stringify(codexCommand)}\ntell application "Terminal" to activate`;
      await this.appendSetupLog(this.t("setupLogin"), `osascript Terminal: ${codexCommand}`, "info");
      await this.runLocalCommand("osascript", ["-e", script], { timeout: 30000 });
    } else {
      const flatpakSpawn = this.isFlatpakRuntime() ? await this.getFlatpakSpawnCommand() : "";
      if (flatpakSpawn) {
        const hostTerminals = [
          [flatpakSpawn, ["--host", "xfce4-terminal", "-e", "codex login"]],
          [flatpakSpawn, ["--host", "x-terminal-emulator", "-e", "codex", "login"]],
          [flatpakSpawn, ["--host", "gnome-terminal", "--", "codex", "login"]],
          [flatpakSpawn, ["--host", "konsole", "-e", "codex", "login"]],
          [flatpakSpawn, ["--host", "alacritty", "-e", "codex", "login"]],
          [flatpakSpawn, ["--host", "kitty", "codex", "login"]],
          [flatpakSpawn, ["--host", "xterm", "-e", "codex login"]]
        ];
        let hostLaunched = false;
        let hostLastError = null;
        for (const [terminal, args] of hostTerminals) {
          try {
            await this.runLocalCommandDetached(terminal, args);
            await this.appendSetupLog(this.t("setupLogin"), this.summarizeCommand(terminal, args), "info");
            hostLaunched = true;
            break;
          } catch (error) {
            hostLastError = error;
          }
        }
        if (!hostLaunched) {
          await this.appendSetupLog(this.t("setupLogin"), this.t("setupManualCommand", { command: "codex login" }), "warn");
          throw new Error(`No host terminal emulator found. Run manually on the host: codex login${hostLastError ? ` (${hostLastError.message})` : ""}`);
        }
        this.settings.codexStatus = this.t("oauthLaunched");
        this.settings.codexLastCheck = new Date().toISOString();
        await this.saveSettings();
        await this.appendSetupLog(this.t("setupLogin"), this.t("oauthLaunched"), "ok");
        new Notice(this.t("oauthLaunched"));
        return;
      }
      const terminalCandidates = [
        ["xfce4-terminal", ["-e", codexCommand]],
        ["x-terminal-emulator", ["-e", codexSpec.command, ...(codexSpec.args || []), "login"]],
        ["gnome-terminal", ["--", codexSpec.command, ...(codexSpec.args || []), "login"]],
        ["konsole", ["-e", codexSpec.command, ...(codexSpec.args || []), "login"]],
        ["alacritty", ["-e", codexSpec.command, ...(codexSpec.args || []), "login"]],
        ["kitty", [codexSpec.command, ...(codexSpec.args || []), "login"]],
        ["xterm", ["-e", codexCommand]]
      ];
      let launched = false;
      let lastError = null;
      for (const [terminal, args] of terminalCandidates) {
        try {
          await this.appendSetupLog(this.t("setupLogin"), this.summarizeCommand(terminal, args), "info");
          await this.runLocalCommandDetached(terminal, args);
          launched = true;
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (!launched) {
        await this.appendSetupLog(this.t("setupLogin"), this.t("setupManualCommand", { command: codexCommand }), "warn");
        throw new Error(`No terminal emulator found. Run manually: ${codexCommand}${lastError ? ` (${lastError.message})` : ""}`);
      }
    }
    this.settings.codexStatus = this.t("oauthLaunched");
    this.settings.codexLastCheck = new Date().toISOString();
    await this.saveSettings();
    await this.appendSetupLog(this.t("setupLogin"), this.t("oauthLaunched"), "ok");
    new Notice(this.t("oauthLaunched"));
  }

  async testCodexExecution(options = {}) {
    const notify = options.notify !== false;
    if (!this.canUseLocalCodex()) {
      if (notify) {
        new Notice(this.t("localOnlyDesktop"));
      }
      throw new Error(this.t("localOnlyDesktop"));
    }
    if (notify) {
      new Notice(this.t("testingCodex"));
    }
    try {
      if (!this.settings.codexInstalledOk || !this.settings.localCodexCommand || this.settings.localCodexCommand === "codex") {
        const install = await this.checkCodexStatus({ notify: false, log: false });
        if (!install) {
          throw new Error(this.settings.codexStatus || "Codex CLI not found.");
        }
      }
      await this.ensureCodexVaultTrust();
      const vaultRoot = this.getVaultRoot();
      const tempRoot = this.getLocalTempDirectory() || agentPaths(vaultRoot).outboxRoot;
      const promptPath = path.join(tempRoot, `${makeId("codex_test")}.txt`);
      const outputPath = path.join(tempRoot, `${makeId("codex_test_result")}.txt`);
      await fs.mkdir(tempRoot, { recursive: true });
      await fs.writeFile(promptPath, "Responde exactamente: OK", "utf8");
      const output = await this.runCodexExec(
        {
          codexCommand: this.settings.localCodexCommand || "codex",
          promptPath,
          outputPath,
          vaultRoot,
          runOptions: { effort: "fast", interactionMode: "plan" }
        },
        180000
      );
      let finalMessage = "";
      try {
        finalMessage = await fs.readFile(outputPath, "utf8");
      } catch {
        finalMessage = output;
      }
      if (!/OK/i.test(output)) {
        if (!/OK/i.test(finalMessage)) {
          throw new Error(finalMessage || output || this.t("codexNoOk"));
        }
      }
      await Promise.allSettled([fs.unlink(promptPath), fs.unlink(outputPath)]);
      this.settings.codexSetupCompleted = true;
      this.settings.codexLoginOk = true;
      this.settings.codexExecutionOk = true;
      this.settings.codexStatus = this.t("codexOauthOk");
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupTest"), this.t("codexOauthOk"), "ok");
      if (notify) {
        new Notice(this.t("codexOauthOk"));
      }
      return output;
    } catch (error) {
      this.settings.codexSetupCompleted = false;
      this.settings.codexExecutionOk = false;
      this.settings.codexStatus = `${this.t("codexExecutionFailed")} ${error.message}`;
      this.settings.codexLastCheck = new Date().toISOString();
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupTest"), error.message, "error");
      if (notify) {
        new Notice(this.t("codexExecutionFailed"));
        throw error;
      }
      return null;
    }
  }

  async activateView() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      await leaf.setViewState({
        type: VIEW_TYPE,
        active: true
      });
    }
    this.app.workspace.revealLeaf(leaf);
    return leaf.view;
  }

  async captureCurrentContext() {
    const view = this.refreshLastMarkdownView();
    const file = view?.file || this.lastMarkdownFile;
    if (!file) {
      return {
        path: "",
        title: "",
        content: "",
        outgoingLinks: [],
        references: []
      };
    }

    const editor = view?.editor;
    const content = editor ? editor.getValue() : await this.app.vault.cachedRead(file);
    const outgoingLinks = this.extractOutgoingLinks(content);
    const references = await this.resolveOutgoingLinkReferences(outgoingLinks, file.path);

    return {
      path: file.path,
      title: file.basename,
      content: content.slice(0, this.settings.maxContextChars),
      outgoingLinks,
      references
    };
  }

  extractOutgoingLinks(content) {
    const source = String(content || "");
    const wikiLinks = [...source.matchAll(/\[\[([^\]#|]+).*?\]\]/g)].map((match) => match[1].trim());
    const markdownLinks = [...source.matchAll(/\[[^\]]+\]\((?!https?:\/\/|mailto:)([^)#]+)(?:#[^)]*)?\)/gi)].map(
      (match) => {
        const raw = match[1].replace(/^<|>$/g, "").replace(/\.md$/i, "").trim();
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      }
    );

    return [...new Set([...wikiLinks, ...markdownLinks].filter(Boolean))].slice(0, 30);
  }

  getReferenceableFiles() {
    return this.app.vault
      .getFiles()
      .filter((file) => !isIgnoredVaultPath(file.path))
      .filter((file) => ["md", "pdf"].includes(String(file.extension || "").toLowerCase()));
  }

  getReferenceKind(file) {
    const extension = extensionForFile(file);
    if (extension === "pdf") {
      return "pdf";
    }
    if (extension === "md") {
      return "markdown";
    }
    if (isHtmlContextFile(file)) {
      return "html";
    }
    if (isTextContextFile(file)) {
      return "text";
    }
    return "file";
  }

  async buildReferenceFromFile(file, source, token = "", options = {}) {
    const kind = this.getReferenceKind(file);
    const maxChars = Number(options.maxChars || 0);
    let preview = "";
    if (kind === "pdf") {
      preview = await this.extractPdfPreview(file, maxChars || PDF_PREVIEW_MAX_CHARS);
    } else if (kind === "markdown") {
      const content = await this.app.vault.cachedRead(file);
      preview = truncatePreviewText(content, maxChars || 2500);
    } else if (kind === "html") {
      preview = await this.extractHtmlPreview(file, maxChars || 2500);
    } else if (kind === "text") {
      preview = await this.extractTextFilePreview(file, maxChars || 2500);
    } else {
      preview = buildUnsupportedFilePreview(file, this.t.bind(this));
    }
    return {
      token: token || file.basename,
      path: file.path,
      title: file.basename,
      preview,
      source,
      kind,
      fileType: kind,
      extension: extensionForFile(file),
      size: file.stat?.size || 0
    };
  }

  async extractTextFilePreview(file, maxChars = 2500) {
    try {
      const content = await this.app.vault.cachedRead(file);
      return truncatePreviewText(content, maxChars);
    } catch (error) {
      return `[Text file not readable: ${error.message}]`;
    }
  }

  async extractHtmlPreview(file, maxChars = 2500) {
    try {
      const content = await this.app.vault.cachedRead(file);
      return truncatePreviewText(htmlToPlainText(content), maxChars);
    } catch (error) {
      return `[HTML file not readable: ${error.message}]`;
    }
  }

  async extractPdfPreview(file, maxChars = PDF_PREVIEW_MAX_CHARS) {
    try {
      const adapter = this.app.vault.adapter;
      const binary = await adapter.readBinary(file.path);
      const buffer = Buffer.isBuffer(binary) ? binary : Buffer.from(binary);
      const extracted = this.extractPdfTextFromBuffer(buffer, maxChars);
      if (extracted) {
        return extracted;
      }
      return "[PDF sin texto extraíble en esta versión]";
    } catch (error) {
      return `[PDF no extraíble: ${error.message}]`;
    }
  }

  extractPdfTextFromBuffer(buffer, maxChars = PDF_PREVIEW_MAX_CHARS) {
    if (!buffer?.length) {
      return "";
    }
    const binary = buffer.toString("binary");
    const previews = [];
    const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
    let match = null;
    let scanned = 0;
    while ((match = streamRegex.exec(binary)) && scanned < PDF_STREAM_SCAN_LIMIT) {
      scanned += 1;
      const prefix = binary.slice(Math.max(0, match.index - 180), match.index);
      const rawBuffer = Buffer.from(match[1], "binary");
      const candidates = [];
      if (/\/FlateDecode/i.test(prefix) && zlib?.inflateSync) {
        try {
          candidates.push(zlib.inflateSync(rawBuffer));
        } catch {
          try {
            candidates.push(zlib.inflateRawSync(rawBuffer));
          } catch {
            // Ignore this compressed stream and continue.
          }
        }
      } else {
        candidates.push(rawBuffer);
      }
      for (const candidate of candidates) {
        const text = extractPdfTextFromStreamText(candidate.toString("binary"), maxChars);
        if (text) {
          previews.push(text);
          if (previews.join(" ").length >= maxChars) {
            return truncatePreviewText(previews.join(" "), maxChars, "… [PDF truncado]");
          }
        }
      }
    }

    if (!previews.length) {
      const fallback = extractPdfTextFromStreamText(binary, maxChars);
      if (fallback) {
        previews.push(fallback);
      }
    }

    return truncatePreviewText(previews.join(" "), maxChars, "… [PDF truncado]");
  }

  async resolveOutgoingLinkReferences(outgoingLinks, sourcePath) {
    const references = [];
    for (const link of outgoingLinks || []) {
      const file = this.app.metadataCache.getFirstLinkpathDest(link, sourcePath || "");
      if (!file || file.path === sourcePath || isIgnoredVaultPath(file.path)) {
        continue;
      }

      const source = this.getReferenceKind(file) === "pdf" ? "pdf-outgoing-link" : "outgoing-link";
      references.push(await this.buildReferenceFromFile(file, source, link));

      if (references.length >= 8) {
        break;
      }
    }

    return references;
  }

  getMentionCandidates(query) {
    const normalizedQuery = normalizeReferenceQuery(query).toLowerCase();
    const files = this.getReferenceableFiles();

    return files
      .map((file) => {
        const score = scoreReferenceCandidate(file, normalizedQuery);
        if (score === null) {
          return null;
        }

        return { file, score };
      })
      .filter(Boolean)
      .sort((left, right) => {
        if (left.score !== right.score) {
          return left.score - right.score;
        }
        return left.file.path.localeCompare(right.file.path, this.getLanguage(), { sensitivity: "base" });
      })
      .slice(0, 8)
      .map((entry) => entry.file);
  }

  async getSecretToken(secretName = this.settings.deviceTokenSecretName) {
    const getter =
      this.app.secretStorage && this.app.secretStorage.get
        ? this.app.secretStorage.get.bind(this.app.secretStorage)
        : null;
    if (!getter || !secretName) {
      return "";
    }
    return (await Promise.resolve(getter(secretName))) || "";
  }

  async setSecretToken(secretName, token) {
    const setter =
      this.app.secretStorage && this.app.secretStorage.set
        ? this.app.secretStorage.set.bind(this.app.secretStorage)
        : null;
    if (!setter || !secretName || !token) {
      return false;
    }
    await Promise.resolve(setter(secretName, token));
    return true;
  }

  async ensureLocalIdentity(options = {}) {
    let changed = false;
    if (!this.settings.deviceId) {
      this.settings.deviceId = generateDeviceId();
      changed = true;
    }
    if (!this.settings.deviceLabel) {
      this.settings.deviceLabel = getHostLabel();
      changed = true;
    }
    if (!this.settings.deviceTokenSecretName) {
      this.settings.deviceTokenSecretName = `${PLUGIN_ID}-device-token`;
      changed = true;
    }

    let token = await this.getSecretToken(this.settings.deviceTokenSecretName);
    if (!token && this.settings.localBootstrapToken) {
      token = this.settings.localBootstrapToken;
    }
    if (!token) {
      token = generateDeviceToken();
      changed = true;
    }

    const storedInSecret = await this.setSecretToken(this.settings.deviceTokenSecretName, token).catch(() => false);
    if (!storedInSecret && this.settings.localBootstrapToken !== token) {
      this.settings.localBootstrapToken = token;
      changed = true;
    }
    if (storedInSecret && this.settings.localBootstrapToken) {
      this.settings.localBootstrapToken = "";
      changed = true;
    }

    if (changed || options.save) {
      await this.saveSettings();
    }
    return { deviceId: this.settings.deviceId, token };
  }

  async registerLocalDeviceIfPossible(options = {}) {
    if (this.isMobileRuntime() || !this.isLocalBackendUrl(this.settings.backendUrl)) {
      return false;
    }
    await this.ensureLocalBackendRunning();
    const identity = await this.ensureLocalIdentity();
    try {
      const response = await requestUrl({
        url: `${this.settings.backendUrl.replace(/\/$/, "")}/auth/register-device`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: identity.deviceId,
          token: identity.token,
          label: this.settings.deviceLabel || identity.deviceId
        })
      });
      if (response.status >= 400) {
        throw new Error(response.text || `HTTP ${response.status}`);
      }
      this.settings.deviceRegisteredOk = true;
      if (!this.settings.codexStatus || /token|configuración local pendiente|local configuration pending/i.test(this.settings.codexStatus)) {
        this.settings.codexStatus = this.t("localDeviceRegisteredStatus");
      }
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupRegister"), this.t("deviceRegistered"), "ok");
      if (options.notify) {
        new Notice(this.t("deviceRegistered"));
      }
      return true;
    } catch (error) {
      this.settings.deviceRegisteredOk = false;
      if (options.notify || !this.settings.codexStatus) {
        this.settings.codexStatus = this.t("localDevicePendingStatus", { error: error.message });
      }
      await this.saveSettings();
      await this.appendSetupLog(this.t("setupRegister"), error.message, options.notify ? "error" : "warn");
      if (options.notify) {
        new Notice(this.t("deviceRegisterFailed"));
      }
      return false;
    }
  }

  async repairLocalProvisioning() {
    this.settings.deviceId = generateDeviceId();
    this.settings.deviceLabel = getHostLabel();
    this.settings.localBootstrapToken = generateDeviceToken();
    this.settings.deviceRegisteredOk = false;
    await this.setSecretToken(this.settings.deviceTokenSecretName, this.settings.localBootstrapToken).catch(() => false);
    await this.saveSettings();
    return this.registerLocalDeviceIfPossible({ notify: true });
  }

  async getDeviceToken() {
    await this.ensureLocalIdentity();
    const token = await this.getSecretToken(this.settings.deviceTokenSecretName);
    if (token) {
      return token;
    }

    if (this.isLocalBackendUrl(this.settings.backendUrl) && this.settings.localBootstrapToken) {
      return this.settings.localBootstrapToken;
    }

    throw new Error(this.t("noDeviceToken"));
  }

  async apiRequest(method, endpoint, body, options = {}) {
    if (this.isMobileRuntime() && !this.canUseRemoteBackend()) {
      throw new Error(this.t("remoteHttpsRequired"));
    }
    await this.ensureLocalBackendRunning();
    if (this.isLocalBackendUrl(this.settings.backendUrl) && !options.skipLocalRegistration) {
      await this.registerLocalDeviceIfPossible({ notify: false });
    }
    const token = await this.getDeviceToken();
    const url = `${this.settings.backendUrl.replace(/\/$/, "")}${endpoint}`;
    this.validateBackendUrl(url);

    const response = await requestUrl({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Device-Id": this.settings.deviceId
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (response.status >= 400) {
      throw new Error(response.text || `HTTP ${response.status}`);
    }

    return response.json;
  }

  async ensureLocalBackendRunning() {
    if (this.isMobileRuntime()) {
      return;
    }
    if (!this.isLocalBackendUrl(this.settings.backendUrl)) {
      return;
    }

    try {
      const health = await requestUrl({
        url: `${this.settings.backendUrl.replace(/\/$/, "")}/health`,
        method: "GET"
      });
      if (health.status < 400) {
        return;
      }
    } catch {
      // Try bootstrapping below.
    }

    if (!this.settings.localBackendBootstrapScript || !this.settings.localBackendBootstrapAllowed) {
      return;
    }

    try {
      const script = this.settings.localBackendBootstrapScript;
      const platform = this.getCodexPlatform();
      if (platform === "windows") {
        childProcess?.execFile?.("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", script]);
      } else {
        childProcess?.execFile?.(script, [], { cwd: this.getVaultRoot() || undefined });
      }
    } catch {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1800));
  }

  validateBackendUrl(value) {
    validateBackendUrlValue(value, {
      allowRemoteBackend: this.settings.allowRemoteBackend,
      isMobile: this.isMobileRuntime(),
      messages: {
        mobileLocal: this.t("remoteHttpsRequiredMobile"),
        localProtocol: "Local backend must use http or https.",
        remoteDisabled: "Remote backends are disabled in plugin settings.",
        remoteHttps: "Remote backend must use HTTPS."
      }
    });
  }

  isLocalBackendUrl(value) {
    return isLocalBackendUrlValue(value);
  }

  isContextPathExcluded(filePath) {
    const normalizedPath = String(filePath || "").replaceAll("\\", "/").toLowerCase();
    if (!normalizedPath) {
      return false;
    }
    for (const pattern of this.settings.contextExclusionPatterns || []) {
      const normalizedPattern = String(pattern || "").replaceAll("\\", "/").toLowerCase().trim();
      if (!normalizedPattern) {
        continue;
      }
      const loosePattern = normalizedPattern.replace(/\*/g, "");
      if (normalizedPath.includes(loosePattern) || normalizedPath.includes(normalizedPattern)) {
        return true;
      }
    }
    return false;
  }

  applyContextSourcePolicy(context = {}) {
    const filtered = { ...context };
    const references = Array.isArray(context.references) ? context.references : [];
    const removed = [];

    if (!this.settings.contextIncludeActiveNote || this.isContextPathExcluded(filtered.path)) {
      if (filtered.path) {
        removed.push({ path: filtered.path, source: "active-note" });
      }
      filtered.path = "";
      filtered.title = "";
      filtered.content = "";
      filtered.outgoingLinks = [];
    }

    filtered.references = references.filter((reference) => {
      const bucket = referenceSourceBucket(reference);
      const pathExcluded = this.isContextPathExcluded(reference.path);
      const disabled =
        (bucket === "links" && !this.settings.contextIncludeLinks) ||
        (bucket === "mentions" && !this.settings.contextIncludeMentions) ||
        (bucket === "folders" && !this.settings.contextIncludeFolders) ||
        (bucket === "pinned" && !this.settings.contextIncludePinned) ||
        (bucket === "rag" && !this.settings.contextIncludeRag);
      if (pathExcluded || disabled) {
        removed.push({ path: reference.path, source: reference.source, reason: pathExcluded ? "excluded" : "disabled" });
        return false;
      }
      return true;
    });

    if (!this.settings.contextIncludeLinks) {
      filtered.outgoingLinks = [];
    }

    filtered.policy = {
      removed,
      exclusions: this.settings.contextExclusionPatterns || []
    };
    return filtered;
  }

  contextManifestSourceLabels() {
    return {
      activeNote: this.t("manifestActiveNote"),
      links: this.t("manifestLinks"),
      mentions: this.t("manifestMentions"),
      folders: this.t("manifestFolders"),
      pinned: this.t("manifestPinned"),
      memory: this.t("manifestMemory"),
      sessions: this.t("manifestSessions"),
      skills: this.t("manifestSkills"),
      rag: this.t("manifestRag")
    };
  }

  buildContextManifest(context = {}, details = {}) {
    if (this.settings.contextManifestEnabled === false) {
      return null;
    }

    const labels = this.contextManifestSourceLabels();
    const references = Array.isArray(context.references) ? context.references : [];
    const sourceGroup = (label, enabled, items) => ({
      label,
      enabled,
      items: (items || []).map((item) => ({
        path: item.path || "",
        title: item.title || "",
        source: item.source || "",
        reason: item.reason || item.token || "",
        fileType: item.fileType || item.kind || "",
        extension: item.extension || "",
        chars: item.folderContextChars || 0,
        truncated: item.folderContextTruncated === true
      }))
    });

    const sources = {
      activeNote: sourceGroup(labels.activeNote, this.settings.contextIncludeActiveNote !== false, context.path ? [{ path: context.path, title: context.title, source: "active-note" }] : []),
      links: sourceGroup(labels.links, this.settings.contextIncludeLinks !== false, references.filter((reference) => referenceSourceBucket(reference) === "links")),
      mentions: sourceGroup(labels.mentions, this.settings.contextIncludeMentions !== false, references.filter((reference) => referenceSourceBucket(reference) === "mentions")),
      folders: sourceGroup(labels.folders, this.settings.contextIncludeFolders !== false, references.filter((reference) => referenceSourceBucket(reference) === "folders")),
      pinned: sourceGroup(labels.pinned, this.settings.contextIncludePinned !== false, references.filter((reference) => referenceSourceBucket(reference) === "pinned")),
      memory: sourceGroup(labels.memory, this.settings.contextIncludeMemory !== false, details.memoryDocuments || []),
      sessions: sourceGroup(labels.sessions, this.settings.contextIncludeRecentSessions !== false, details.recentSessions || []),
      skills: sourceGroup(
        labels.skills,
        this.settings.skillsEnabled === true,
        (details.skillContext?.enabled || []).map((skill) => ({
          path: skill.path,
          title: skill.name || skill.id,
          source: "skill",
          reason: skill.id
        }))
      ),
      rag: sourceGroup(labels.rag, this.settings.contextIncludeRag === true, references.filter((reference) => referenceSourceBucket(reference) === "rag"))
    };

    const used = Object.values(sources).filter((group) => group.items.length);
    const summarySources = used.map((group) => `${group.label} ${group.items.length}`);
    return {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      summary: this.t("manifestSummary", {
        count: used.reduce((total, group) => total + group.items.length, 0),
        sources: summarySources.join(", ") || this.t("noRefs")
      }),
      runOptions: details.runOptions || {},
      unresolvedReferences: details.unresolvedReferences || [],
      removed: context.policy?.removed || [],
      exclusions: this.settings.contextExclusionPatterns || [],
      sources
    };
  }

  getRagIndexPath(vaultRoot = this.getVaultRoot()) {
    if (!vaultRoot || !path) {
      return "";
    }
    return path.join(agentPaths(vaultRoot).indexRoot, "vault-keywords.json");
  }

  getRagIndexStatusLabel() {
    if (this.ragIndexStatus?.count) {
      return this.t("ragIndexReady", {
        count: this.ragIndexStatus.count,
        time: this.ragIndexStatus.updatedAt ? new Date(this.ragIndexStatus.updatedAt).toLocaleString() : ""
      });
    }
    return this.t("ragIndexNotBuilt");
  }

  async readRagIndex(vaultRoot = this.getVaultRoot()) {
    if (!fs || !vaultRoot) {
      return { schemaVersion: 1, updatedAt: "", entries: {} };
    }
    try {
      const raw = await fs.readFile(this.getRagIndexPath(vaultRoot), "utf8");
      const parsed = JSON.parse(raw);
      const entries = parsed?.entries && typeof parsed.entries === "object" ? parsed.entries : {};
      this.ragIndexStatus = { count: Object.keys(entries).length, updatedAt: parsed.updatedAt || "" };
      return { schemaVersion: 1, updatedAt: parsed.updatedAt || "", entries };
    } catch {
      this.ragIndexStatus = null;
      return { schemaVersion: 1, updatedAt: "", entries: {} };
    }
  }

  async writeRagIndex(vaultRoot, index) {
    if (!fs || !vaultRoot) {
      return;
    }
    const indexPath = this.getRagIndexPath(vaultRoot);
    await fs.mkdir(path.dirname(indexPath), { recursive: true });
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf8");
    this.ragIndexStatus = {
      count: Object.keys(index.entries || {}).length,
      updatedAt: index.updatedAt || ""
    };
  }

  async rebuildRagIndex(options = {}) {
    if (options.notify) {
      new Notice(this.t("ragIndexBuilding"));
    }
    try {
      const index = await this.buildOrUpdateRagIndex({ force: true });
      if (options.notify) {
        new Notice(this.t("ragIndexBuilt"));
      }
      return index;
    } catch (error) {
      if (options.notify) {
        new Notice(this.t("ragIndexFailed", { error: error.message }));
      }
      throw error;
    }
  }

  async buildOrUpdateRagIndex(options = {}) {
    if (!this.settings.ragIndexEnabled || !fs) {
      return { schemaVersion: 1, updatedAt: "", entries: {} };
    }
    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot) {
      return { schemaVersion: 1, updatedAt: "", entries: {} };
    }
    await this.ensureAgentStructure(vaultRoot);
    const currentIndex = options.force ? { entries: {} } : await this.readRagIndex(vaultRoot);
    const entries = {};
    const maxNotes = normalizeRagIndexMaxNotes(this.settings.ragIndexMaxNotes, DEFAULT_SETTINGS.ragIndexMaxNotes);
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => !isIgnoredVaultPath(file.path) && !this.isContextPathExcluded(file.path))
      .sort((left, right) => (right.stat?.mtime || 0) - (left.stat?.mtime || 0))
      .slice(0, maxNotes);

    for (const file of files) {
      const previous = currentIndex.entries?.[file.path];
      if (!options.force && previous?.mtime === file.stat?.mtime && previous?.size === file.stat?.size) {
        entries[file.path] = previous;
        continue;
      }
      let content = "";
      try {
        content = await this.app.vault.cachedRead(file);
      } catch {
        content = "";
      }
      const preview = content.slice(0, 2500);
      const tokens = tokenizeForRag(`${file.basename} ${file.path} ${preview}`, 80);
      entries[file.path] = {
        path: file.path,
        title: file.basename,
        mtime: file.stat?.mtime || 0,
        size: file.stat?.size || 0,
        tokens,
        preview: preview.slice(0, 900)
      };
    }

    const index = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      maxNotes,
      entries
    };
    await this.writeRagIndex(vaultRoot, index);
    return index;
  }

  scoreRagEntry(entry, tokens) {
    const entryTokens = new Set(entry.tokens || []);
    const pathText = `${entry.title || ""} ${entry.path || ""}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (entryTokens.has(token)) {
        score += 2;
      }
      if (pathText.includes(token)) {
        score += 4;
      }
    }
    return score;
  }

  async suggestRagReferences(message, context = {}, existingReferences = []) {
    if (this.settings.contextIncludeRag !== true || !this.settings.ragCandidateLimit) {
      return [];
    }
    const limit = normalizeRagCandidateLimit(this.settings.ragCandidateLimit, DEFAULT_SETTINGS.ragCandidateLimit);
    if (limit <= 0) {
      return [];
    }
    const query = `${message || ""} ${context.title || ""} ${context.content || ""}`.toLowerCase();
    const tokens = tokenizeForRag(query, 30);
    if (!tokens.length) {
      return [];
    }

    const existingPaths = new Set([
      context.path,
      ...(existingReferences || []).map((reference) => reference.path)
    ].filter(Boolean));
    const index = await this.buildOrUpdateRagIndex({ force: false });
    const indexedCandidates = Object.values(index.entries || [])
      .filter((entry) => !existingPaths.has(entry.path))
      .map((entry) => ({ entry, score: this.scoreRagEntry(entry, tokens) }))
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score || String(left.entry.path).localeCompare(String(right.entry.path)))
      .slice(0, limit);
    const references = [];
    for (const candidate of indexedCandidates) {
      const file = this.app.vault.getAbstractFileByPath(candidate.entry.path);
      if (!file) {
        continue;
      }
      const reference = await this.buildReferenceFromFile(file, "rag", this.t("ragCandidates"));
      reference.reason = `score ${candidate.score}`;
      if (candidate.entry.preview && !reference.preview) {
        reference.preview = candidate.entry.preview.slice(0, 2500);
      }
      references.push(reference);
    }
    return references;
  }

  async sendMessageToAgent(threadId, message, baseContext, preparedRunOptions = null) {
    const referenceResolution = await this.resolveAtReferences(message);
    const baseReferences = baseContext.references || [];
    const referencesBeforeFolder = mergeReferences(baseReferences, referenceResolution.references);
    const folderReferences = await this.resolveFolderReferences(message, referencesBeforeFolder);
    const referencesBeforeRag = mergeReferences(baseReferences, referenceResolution.references, folderReferences);
    const ragReferences = await this.suggestRagReferences(message, baseContext, referencesBeforeRag);
    const rawContext = {
      ...baseContext,
      references: mergeReferences(baseReferences, referenceResolution.references, folderReferences, ragReferences)
    };
    const context = this.applyContextSourcePolicy(rawContext);
    const runOptions = preparedRunOptions || this.getRunOptions(context, message);
    const skillContext = await this.getActiveSkillContext();
    const systemPrompt = this.getConfiguredSystemPrompt(runOptions, "", skillContext);
    const requestManifest = this.buildContextManifest(context, {
      runOptions,
      unresolvedReferences: referenceResolution.unresolved,
      skillContext
    });

    try {
      const localFallbackAvailable = this.canUseLocalCodex() && this.isLocalBackendUrl(this.settings.backendUrl);
      let activeThreadId = threadId;
      if (!activeThreadId) {
        const started = await this.apiRequest("POST", "/chat/start", {
          notePath: context.path || "",
          title: context.title || ""
        }, { skipLocalRegistration: localFallbackAvailable });
        activeThreadId = started.threadId;
      }

      const response = await this.apiRequest("POST", "/chat/message", {
        threadId: activeThreadId,
        message,
        noteContext: context,
        runOptions,
        systemPrompt
      }, { skipLocalRegistration: localFallbackAvailable });

      return {
        ...response,
        threadId: response.threadId || activeThreadId,
        context,
        contextManifest: response.contextManifest || requestManifest,
        unresolvedReferences: referenceResolution.unresolved
      };
    } catch (error) {
      if (!this.shouldUseLocalFallback(error)) {
        throw error;
      }

      const localResponse = await this.sendLocalMessage(threadId || makeId("thread"), message, context, runOptions, skillContext);
      return {
        ...localResponse,
        localFallback: true,
        context,
        contextManifest: localResponse.contextManifest || requestManifest,
        unresolvedReferences: referenceResolution.unresolved
      };
    }
  }

  shouldUseLocalFallback(error) {
    if (!this.canUseLocalCodex()) {
      return false;
    }
    if (!this.isLocalBackendUrl(this.settings.backendUrl)) {
      return false;
    }
    return true;
  }

  async resolveAtReferences(text) {
    const files = this.getReferenceableFiles();
    const matches = extractAtReferenceMatches(text, files, this.getLanguage());
    const references = [];
    const unresolved = [];

    for (const match of matches) {
      if (!match.file) {
        unresolved.push(match.token);
        continue;
      }
      const source = this.getReferenceKind(match.file) === "pdf" ? "pdf-mention" : "mention";
      references.push(await this.buildReferenceFromFile(match.file, source, match.token));
    }

    return {
      references,
      unresolved
    };
  }

  async resolveFolderReferences(text, existingReferences = []) {
    const roots = normalizeFolderRoots(this.settings.folderReferenceRoots);

    if (!wantsFolderContext(text, roots)) {
      return [];
    }

    const existingPaths = new Set((existingReferences || []).map((reference) => reference.path));
    const files = this.app.vault
      .getFiles()
      .filter((file) => isInsideConfiguredRoot(file.path, roots))
      .filter((file) => !isIgnoredVaultPath(file.path))
      .filter((file) => !this.isContextPathExcluded(file.path))
      .filter((file) => !existingPaths.has(file.path))
      .sort((left, right) => {
        return left.path.localeCompare(right.path, this.getLanguage(), { sensitivity: "base" });
      })
      .slice(0, normalizeMaxFolderReferences(this.settings.maxFolderReferences, DEFAULT_SETTINGS.maxFolderReferences));

    const references = [];
    for (const file of files) {
      const root = rootForPath(file.path, roots);
      const reference = await this.buildReferenceFromFile(file, "folder", root || this.t("configuredFolderToken"), {
        maxChars: FOLDER_FILE_PREVIEW_MAX_CHARS
      });
      reference.folderRoot = root || this.t("configuredFolderToken");
      references.push(reference);
    }

    return applyFolderContextBudget(
      references,
      normalizeMaxFolderContextChars(this.settings.maxFolderContextChars, DEFAULT_SETTINGS.maxFolderContextChars),
      this.t.bind(this)
    );
  }

  async sendLocalMessage(threadId, message, context, runOptions, skillContext = null) {
    if (!this.canUseLocalCodex()) {
      throw new Error(this.t("localFallbackDesktopOnly"));
    }
    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot) {
      throw new Error(this.t("vaultPathUnavailable"));
    }

    await this.ensureAgentStructure(vaultRoot);
    const memoryDocuments = this.settings.contextIncludeMemory === false ? [] : await this.readMemoryDocuments(vaultRoot);
    const recentSessions =
      this.settings.contextIncludeRecentSessions === false ? [] : await this.readRecentSessions(vaultRoot, threadId, 6);
    const sessionId = makeId("session");
    const createdAt = new Date().toISOString();
    const backupRoot = this.getSessionBackupRoot(createdAt, threadId, sessionId);
    if (runOptions.interactionMode === "execute") {
      await fs.mkdir(path.join(vaultRoot, backupRoot), { recursive: true });
    }
    const answer = await this.runLocalCodex(message, context, memoryDocuments, recentSessions, runOptions, backupRoot, skillContext);
    const summary = summarize(`${message} ${answer}`);
    const contextManifest = this.buildContextManifest(context, {
      runOptions,
      memoryDocuments,
      recentSessions,
      skillContext
    });
    const sessionPath = await this.writeLocalSession(vaultRoot, {
      sessionId,
      threadId,
      createdAt,
      deviceId: this.settings.deviceId,
      notePath: context.path || "",
      noteTitle: context.title || "",
      userMessage: message,
      assistantMessage: answer,
      referencePaths: (context.references || []).map((reference) => reference.path),
      workMode: runOptions.interactionMode,
      effort: runOptions.effort,
      backupPolicy: runOptions.backupPolicy || "none",
      backupRoot,
      contextManifest,
      summary
    });

    await this.updateLocalMemory(vaultRoot, {
      createdAt,
      deviceId: this.settings.deviceId,
      sessionId,
      threadId,
      userMessage: message,
      assistantMessage: answer,
      summary,
      references: context.references || []
    });

    return {
      threadId,
      sessionId,
      sessionPath,
      answer,
      raw: {
        provider: "plugin-local"
      },
      security: {
        redacted: false,
        detectedTypes: []
      },
      contextManifest,
      memoryContext: {
        documents: memoryDocuments.map((document) => ({
          path: document.path,
          category: document.category
        }))
      }
    };
  }

  getVaultRoot() {
    const adapter = this.app.vault.adapter;
    return adapter && adapter.basePath ? adapter.basePath : "";
  }

  async walkFiles(rootPath) {
    const files = [];

    async function walk(currentPath) {
      let entries = [];
      try {
        entries = await fs.readdir(currentPath, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    }

    await walk(rootPath);
    return files;
  }

  async walkMarkdownFiles(rootPath) {
    const files = await this.walkFiles(rootPath);
    return files.filter((filePath) => filePath.endsWith(".md"));
  }

  async ensureAgentStructure(vaultRoot) {
    const { memoryRoot, sessionsRoot, outboxRoot, indexRoot } = agentPaths(vaultRoot);

    await Promise.all([
      fs.mkdir(memoryRoot, { recursive: true }),
      fs.mkdir(sessionsRoot, { recursive: true }),
      fs.mkdir(outboxRoot, { recursive: true }),
      fs.mkdir(indexRoot, { recursive: true })
    ]);

    for (const category of MEMORY_CATEGORIES) {
      const filePath = path.join(memoryRoot, `${category}.md`);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, buildMemoryMarkdown(category, []), "utf8");
      }
    }
  }

  async readMemoryDocuments(vaultRoot) {
    const memoryRoot = agentPaths(vaultRoot).memoryRoot;
    const documents = [];

    for (const category of MEMORY_CATEGORIES) {
      const filePath = path.join(memoryRoot, `${category}.md`);
      let markdown = "";
      try {
        markdown = await fs.readFile(filePath, "utf8");
      } catch {
        markdown = "";
      }
      const parsed = parseFrontmatter(markdown);
      const sanitization = sanitizeMemoryBullets(category, parseBulletLines(parsed.body));
      const degraded = !parsed.data.schema_version || sanitization.issues.length > 0;
      documents.push({
        category,
        path: path.relative(vaultRoot, filePath).replaceAll("\\", "/"),
        text: buildMemoryMarkdown(category, sanitization.bullets),
        degraded,
        issues: sanitization.issues
      });
    }

    return documents;
  }

  async readRecentSessions(vaultRoot, threadId, limit) {
    const sessionsRoot = agentPaths(vaultRoot).sessionsRoot;
    const files = await this.walkMarkdownFiles(sessionsRoot);
    const deduped = new Map();

    for (const filePath of files) {
      const markdown = await fs.readFile(filePath, "utf8");
      const parsed = parseFrontmatter(markdown);
      if (parsed.data.thread_id !== threadId) {
        continue;
      }
      const sessionId = parsed.data.session_id || "";
      const fingerprint = parsed.data.content_fingerprint || sha1(normalizeForFingerprint(parsed.body));
      const dedupeKey = sessionId || fingerprint || path.basename(filePath).replace(/\s+\(\d+\)(?=\.md$)/, "");
      const current = {
        path: path.relative(vaultRoot, filePath).replaceAll("\\", "/"),
        createdAt: parsed.data.created_at,
        summary: parsed.data.summary || "",
        sessionId,
        fingerprint
      };
      const previous = deduped.get(dedupeKey);
      if (!previous) {
        deduped.set(dedupeKey, current);
        continue;
      }
      const previousPath = previous.path || "";
      const currentPath = current.path || "";
      const previousIsConflictCopy = /\(\d+\)\.md$/.test(previousPath);
      const currentIsConflictCopy = /\(\d+\)\.md$/.test(currentPath);
      if (previousIsConflictCopy && !currentIsConflictCopy) {
        deduped.set(dedupeKey, current);
      }
    }

    return Array.from(deduped.values())
      .sort((left, right) => String(left.createdAt || "").localeCompare(String(right.createdAt || "")))
      .slice(-limit);
  }

  getSessionBackupRoot(createdAt, threadId, sessionId) {
    return sessionBackupRoot(createdAt, threadId, sessionId);
  }

  async backupVaultFile(filePath, options = {}) {
    const normalizedPath = String(filePath || "").replaceAll("\\", "/").replace(/^\/+/, "");
    if (!normalizedPath) {
      throw new Error(this.t("backupFilePathUnavailable"));
    }
    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot) {
      throw new Error(this.t("backupVaultPathUnavailable"));
    }
    const sourcePath = path.join(vaultRoot, normalizedPath);
    const relativeBackupRoot =
      options.backupRoot ||
      this.getSessionBackupRoot(options.createdAt || new Date().toISOString(), options.threadId || "manual", options.sessionId || makeId("manual"));
    const targetPath = path.join(vaultRoot, relativeBackupRoot, normalizedPath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    return path.join(relativeBackupRoot, normalizedPath).replaceAll("\\", "/");
  }

  async runLocalCodex(message, context, memoryDocuments, recentSessions, runOptions, backupRoot = "", skillContext = null) {
    const systemPrompt = this.getConfiguredSystemPrompt(runOptions, backupRoot, skillContext);
    const prompt = [
      "System prompt:",
      systemPrompt || "(empty)",
      "",
      "Operational constraints:",
      "Use only the provided note context, referenced notes, shared memory, and recent sessions.",
      "If references are provided, treat them as part of the active context.",
      "Do not inspect the filesystem, list directories, or run shell commands unless the user explicitly asked for shell-level inspection and the provided context is insufficient.",
      "Assume the injected paths and previews may contain non-ASCII characters. Do not try to re-resolve or normalize them via shell commands.",
      "If the provided context is insufficient, say what is missing instead of trying to discover it by executing tools.",
      runOptions?.effort === "fast"
        ? "Use a fast, direct answer with only the highest value details."
        : "Reason carefully before answering, but do not expose hidden chain-of-thought; provide a concise reasoning summary and clear next steps.",
      runOptions?.interactionMode === "execute"
        ? "The user selected execution mode: prefer concrete actions, drafts, patches, checklists, and direct next changes. If you edit or delete files, create backups first."
        : "The user selected plan mode: prefer diagnosis, tradeoffs, sequencing, and acceptance criteria before execution.",
      "",
      "Response controls:",
      JSON.stringify(runOptions || {}, null, 2),
      "",
      "Backup workspace:",
      backupRoot || "(not applicable)",
      "",
      "Active note context:",
      JSON.stringify(
        {
          path: context.path || "",
          title: context.title || "",
          outgoing_links: context.outgoingLinks || [],
          note_preview: context.content || ""
        },
        null,
        2
      ),
      "",
      "Referenced notes:",
      JSON.stringify(
        (context.references || []).map((reference) => ({
          path: reference.path,
          title: reference.title,
          preview: reference.preview,
          source: reference.source,
          kind: reference.kind || reference.fileType || "markdown"
        })),
        null,
        2
      ),
      "",
      "Shared memory:",
      JSON.stringify(memoryDocuments, null, 2),
      "",
      "Active vault skills:",
      skillContext?.text || "(none)",
      skillContext?.issues?.length ? `Skill issues:\n${skillContext.issues.join("\n")}` : "",
      "",
      "Recent sessions in this thread:",
      JSON.stringify(recentSessions, null, 2),
      "",
      "User request:",
      message
    ].join("\n");

    const vaultRoot = this.getVaultRoot();
    const tempRoot = this.getLocalTempDirectory() || agentPaths(vaultRoot).outboxRoot;
    const promptPath = path.join(tempRoot, `${makeId("codex_prompt")}.txt`);
    const outputPath = path.join(tempRoot, `${makeId("codex_output")}.txt`);
    try {
      await this.ensureCodexVaultTrust();
      await fs.mkdir(path.dirname(promptPath), { recursive: true });
      await fs.writeFile(promptPath, prompt, "utf8");
      const output = await this.runCodexExec(
        {
          codexCommand: this.settings.localCodexCommand || "codex",
          promptPath,
          outputPath,
          vaultRoot,
          runOptions
        },
        180000
      );
      let finalMessage = "";
      try {
        finalMessage = await fs.readFile(outputPath, "utf8");
      } catch {
        finalMessage = output;
      }

      const answer = String(finalMessage || output || "").trim();
      if (!answer) {
        throw new Error(this.t("codexNoOutput"));
      }

      return answer;
    } catch (error) {
      const detail = [error.message, error.stdout, error.stderr].filter(Boolean).join(" | ");
      const classified = classifyLocalCodexFailureSafe(detail, { notePath: context.path || "" });
      throw new Error(this.t("localCodexUnavailableDetail", { classification: classified, detail }));
    } finally {
      try {
        await fs.unlink(promptPath);
      } catch {
        // Best effort cleanup.
      }
      try {
        await fs.unlink(outputPath);
      } catch {
        // Best effort cleanup.
      }
    }
  }

  async writeLocalSession(vaultRoot, session) {
    const date = new Date(session.createdAt);
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const filename = `${session.createdAt.replace(/[:.]/g, "-")}-${session.threadId}-${session.sessionId}.md`;
    const relativePath = path.join(CORTEX_DATA_ROOT, "sessions", year, month, day, filename).replaceAll("\\", "/");
    const absolutePath = path.join(vaultRoot, relativePath);

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(
      absolutePath,
      buildSessionMarkdown({
        ...session,
        schemaVersion: CORTEX_SCHEMA_VERSION,
        pluginVersion: this.manifest?.version || "",
        contentFingerprint: session.contentFingerprint || sessionFingerprint(session)
      }),
      "utf8"
    );
    return relativePath;
  }

  async updateLocalMemory(vaultRoot, payload) {
    const extracted = heuristicMemoryFromExchange(payload);
    const date = new Date(payload.createdAt || new Date().toISOString());
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const candidatesRoot = path.join(vaultRoot, CORTEX_DATA_ROOT, "index", "memory-candidates", year, month, day);
    const fileName = `${(payload.createdAt || new Date().toISOString()).replace(/[:.]/g, "-")}-${payload.threadId}-${payload.sessionId}.md`;
    await fs.mkdir(candidatesRoot, { recursive: true });
    await fs.writeFile(
      path.join(candidatesRoot, fileName),
      buildMemoryCandidateMarkdown({
        extracted,
        createdAt: payload.createdAt,
        deviceId: payload.deviceId,
        pluginVersion: this.manifest?.version || "",
        sessionId: payload.sessionId,
        threadId: payload.threadId
      }),
      "utf8"
    );
  }

  async writeApprovedChangeLog(payload) {
    const vaultRoot = this.getVaultRoot();
    if (!vaultRoot || !fs || !path) {
      return "";
    }
    await this.ensureAgentStructure(vaultRoot);
    const createdAt = payload.createdAt || new Date().toISOString();
    const date = new Date(createdAt);
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const changeId = payload.changeId || makeId("change");
    const relativePath = path
      .join(CORTEX_DATA_ROOT, "outbox", "approved-changes", year, month, day, `${createdAt.replace(/[:.]/g, "-")}-${changeId}.md`)
      .replaceAll("\\", "/");
    const absolutePath = path.join(vaultRoot, relativePath);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(
      absolutePath,
      buildApprovedChangeMarkdown({
        ...payload,
        changeId,
        createdAt,
        pluginVersion: this.manifest?.version || ""
      }),
      "utf8"
    );
    return relativePath;
  }

  async approveInsertionIntoNote(content, options = {}) {
    const view = this.refreshLastMarkdownView();
    if (!view || !view.editor) {
      new Notice(this.t("openEditableNote"));
      return;
    }

    const insertion = `\n\n${content}\n`;
    const cursor = view.editor.getCursor();
    const cursorOffset = view.editor.posToOffset ? view.editor.posToOffset(cursor) : 0;
    const currentContent = view.editor.getValue ? view.editor.getValue() : "";
    const diffPreview = buildInsertionDiffPreview(currentContent, insertion, cursorOffset);
    const applyInsertion = async () => {
      let backupPath = "";
      if (view.file?.path) {
        try {
          backupPath = await this.backupVaultFile(view.file.path, {
            createdAt: new Date().toISOString(),
            threadId: options.threadId || this.lastResponse?.threadId || "manual",
            sessionId: options.sessionId || this.lastResponse?.sessionId || makeId("manual")
          });
          new Notice(this.t("backupCreated", { path: backupPath }));
        } catch (error) {
          new Notice(this.t("backupFailed", { error: error.message }));
          return;
        }
      }
      let changeLogPath = "";
      try {
        changeLogPath = await this.writeApprovedChangeLog({
          createdAt: new Date().toISOString(),
          targetPath: view.file?.path || "",
          backupPath,
          threadId: options.threadId || this.lastResponse?.threadId || "manual",
          sessionId: options.sessionId || this.lastResponse?.sessionId || makeId("manual"),
          summary: summarize(content),
          insertion,
          diffPreview: diffPreview.text
        });
      } catch {
        changeLogPath = "";
      }
      view.editor.replaceRange(insertion, cursor);
      new Notice(this.t("responseInserted"));
      if (changeLogPath) {
        new Notice(this.t("changeLogged", { path: changeLogPath }));
      }
    };

    if (this.settings.approvedEditsOnly === false) {
      await applyInsertion();
      return;
    }

    new ApprovedInsertionModal(this.app, this, {
      filePath: view.file?.path || "",
      insertion,
      diffPreview,
      onApply: applyInsertion
    }).open();
  }

  async insertLastResponseIntoNote() {
    if (!this.lastResponse?.answer) {
      new Notice(this.t("noLastResponseInsert"));
      return;
    }
    await this.approveInsertionIntoNote(this.lastResponse.answer, {
      threadId: this.lastResponse.threadId || "manual",
      sessionId: this.lastResponse.sessionId || makeId("manual")
    });
  }

  async showMemoryUsed() {
    if (!this.lastResponse?.threadId) {
      new Notice(this.t("noLastResponseMemory"));
      return;
    }

    if (this.lastResponse.localFallback) {
      new MemoryContextModal(this.app, {
        documents: this.lastResponse.memoryContext?.documents || [],
        recentSessions: []
      }, this.t).open();
      return;
    }

    try {
      const context = await this.apiRequest(
        "GET",
        `/memory/context/${encodeURIComponent(this.lastResponse.threadId)}`
      );
      new MemoryContextModal(this.app, context, this.t).open();
    } catch (error) {
      new Notice(this.t("memoryLoadFailed", { error: error.message }));
    }
  }
};

/* nosourcemap */