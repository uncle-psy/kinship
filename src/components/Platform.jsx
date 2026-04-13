import React, { useState } from "react";
import { colors } from "../colors.js";
import { Icon, RenderIcon } from "./RenderIcon.jsx";
import {
  Badge, StatusPill, Btn, PageHeader, Field, Input, Toggle,
  SectionDivider, DangerZone, InfoBox, SectionCard, FilterPill,
  Card, Modal,
} from "./Sidebar.jsx";

// ─── Data constants ────────────────────────────────────────────────────────────

const CONNECTORS = [
  { id: "bluesky", name: "BlueSky", icon: "simple-icons:bluesky", account: "@dragoonbase.bsky.social", status: "Connected", category: "Social" },
  { id: "telegram", name: "Telegram", icon: "simple-icons:telegram", account: "DragoonBaseBot", status: "Connected", category: "Messaging" },
  { id: "google", name: "Google Workspace", icon: "simple-icons:google", account: "admin@dragoonbase.org", status: "Connected", category: "Productivity" },
  { id: "linkedin", name: "LinkedIn", icon: "simple-icons:linkedin", account: "Chrome plugin required", status: "Pending Setup", category: "Social" },
  { id: "solana", name: "Solana", icon: "◎", account: "mainnet-beta", status: "Connected", category: "Commerce" },
];

const PLATFORM_TOOLS_DATA = [
  {
    id: "meeting-facilitator",
    name: "Meeting Facilitator",
    icon: "🎙️",
    category: "Communication",
    status: "Active",
    version: "1.2.0",
    availability: "Platform-wide",
    addedBy: "moto",
    addedOn: "2025-11-10",
    cyclesUsing: 3,
    desc: "Listens to live meetings and offers real-time guidance on communication patterns, collaboration health, and HEARTS alignment.",
    heartsAligned: ["H", "E", "A", "T"],
    canAddTo: ["Cycle", "Scene"],
    triggers: ["long-monologue", "cross-talk", "tension-signal", "silence"],
    outputModes: ["sidebar", "facilitator-dm", "chat-overlay"],
  },
  {
    id: "pattern-tracker",
    name: "Pattern Tracker",
    icon: "lucide:activity",
    category: "Analytics",
    status: "Active",
    version: "0.9.1",
    availability: "Platform-wide",
    addedBy: "moto",
    addedOn: "2025-12-04",
    cyclesUsing: 5,
    desc: "Tracks recurring interaction patterns across sessions and surfaces insights about member growth trajectories.",
    heartsAligned: ["R", "Si", "So"],
    canAddTo: ["Cycle"],
    triggers: [],
    outputModes: ["dashboard-widget", "actor-context"],
  },
  {
    id: "ritual-timer",
    name: "Ritual Timer",
    icon: "lucide:timer",
    category: "Facilitation",
    status: "Active",
    version: "1.0.3",
    availability: "Platform-wide",
    addedBy: "Eloy",
    addedOn: "2026-01-18",
    cyclesUsing: 7,
    desc: "Manages timed ritual structures — opening rounds, silence periods, closing reflections — with configurable pacing and cues.",
    heartsAligned: ["H", "A", "Si"],
    canAddTo: ["Cycle", "Scene"],
    triggers: [],
    outputModes: ["chat-overlay", "facilitator-dm"],
  },
];

const AVAILABLE_CONNECTORS = [
  { id: "discord", name: "Discord", icon: "simple-icons:discord", auth: "OAuth", desc: "Community channels, bots, and voice", category: "Messaging" },
  { id: "slack", name: "Slack", icon: "simple-icons:slack", auth: "OAuth", desc: "Team messaging and workflow automation", category: "Messaging" },
  { id: "notion", name: "Notion", icon: "simple-icons:notion", auth: "OAuth", desc: "Docs, databases, and wikis", category: "Productivity" },
  { id: "github", name: "GitHub", icon: "simple-icons:github", auth: "OAuth", desc: "Repos, issues, and pull requests", category: "Developer" },
  { id: "stripe", name: "Stripe", icon: "simple-icons:stripe", auth: "API Key", desc: "Payments, subscriptions, and invoices", category: "Commerce" },
  { id: "zoom", name: "Zoom", icon: "simple-icons:zoom", auth: "OAuth", desc: "Video meetings and webinars", category: "Video" },
  { id: "calendly", name: "Calendly", icon: "simple-icons:calendly", auth: "OAuth", desc: "Scheduling and booking links", category: "Scheduling" },
  { id: "youtube", name: "YouTube", icon: "simple-icons:youtube", auth: "OAuth", desc: "Video publishing and live streaming", category: "Media" },
  { id: "airtable", name: "Airtable", icon: "simple-icons:airtable", auth: "API Key", desc: "Flexible database and spreadsheets", category: "Productivity" },
  { id: "webhooks", name: "Custom Webhook", icon: "lucide:webhook", auth: "Webhook URL", desc: "Send data to any HTTP endpoint", category: "Developer" },
  { id: "hubspot", name: "HubSpot", icon: "simple-icons:hubspot", auth: "OAuth", desc: "CRM, contacts, and marketing", category: "Productivity" },
  { id: "luma", name: "Luma", icon: "✨", auth: "API Key", desc: "Events, RSVPs, and community gatherings", category: "Scheduling" },
];

const connectorCategories = ["All", "Messaging", "Video", "Productivity", "Commerce", "Scheduling", "Media", "Developer"];

const authColors = { OAuth: colors.blue, "API Key": colors.purple, "Webhook URL": colors.cyan };

const PROMPTS = [
  {
    id: "dragoon-guide",
    name: "Dragoon Guide Core Behavior",
    status: "Active",
    icon: "🐴",
    scope: "All cycles · All actors",
    lastEdited: "2 days ago",
    content: "You are the Dragoon Guide, the primary AI companion for the 2nd Cavalry Regiment heritage app. You are warm, knowledgeable, and deeply respectful of military service. You help veterans and family members explore 190 years of regimental history, connect with fellow troopers, and access support services. Always honor the sacrifice and service of every era — from the Mexican-American War through Desert Storm and beyond. Use the regiment's motto 'Toujours Prêt' (Always Ready) as your guiding principle.",
  },
  {
    id: "va-navigator",
    name: "VA Benefits Navigator Protocol",
    status: "Active",
    icon: "🏥",
    scope: "Service tab · VA Benefits Navigator actor",
    lastEdited: "1 week ago",
    content: "You are the VA Benefits Navigator, a specialized assistant helping veterans understand and access their earned benefits. Always provide accurate, up-to-date information about VA healthcare, disability claims, education benefits (GI Bill), home loans, and burial benefits. Never provide legal or medical advice — direct users to appropriate VA resources and VSOs. Be patient, empathetic, and thorough. Many veterans are navigating these systems for the first time.",
  },
  {
    id: "historical-accuracy",
    name: "Historical Accuracy & Sensitivity",
    status: "Active",
    icon: "📜",
    scope: "All cycles · History actors",
    lastEdited: "3 days ago",
    content: "All historical content must be factually accurate and sourced from verified regimental records. When discussing battles, casualties, or sensitive topics like POW/MIA, maintain respectful tone. Never speculate about classified operations. Present multiple perspectives when covering controversial periods. Always distinguish between verified facts and oral history/personal accounts.",
  },
  {
    id: "community-guidelines",
    name: "Community Interaction Guidelines",
    status: "Active",
    icon: "👥",
    scope: "All actors · Community features",
    lastEdited: "5 days ago",
    content: "Foster connection among troopers across all eras of service. Encourage sharing of stories and experiences while respecting privacy boundaries. Never pressure members to share combat experiences. Support the transition from service to civilian life. Facilitate mentorship between generations of cavalrymen.",
  },
];

const PLATFORM_ACTORS = [
  {
    id: "dragoon-guide",
    name: "Dragoon Guide",
    emoji: "🐴",
    type: "Guide",
    model: "claude-opus-4-5-20251101",
    status: "Active",
    memory: "Persistent",
    facets: ["H", "E", "A", "R", "T", "Si", "So"],
    desc: "The primary AI companion for the regiment. Helps troopers explore 190 years of history, connect with fellow veterans, and navigate the app.",
    persona: "You are the Dragoon Guide, the trusted AI companion of the 2nd Cavalry Regiment community. You carry deep knowledge of the regiment's 190-year history from the Mexican-American War through modern deployments...",
    instructions: "Welcome every trooper with respect for their service. Help them explore history, connect with others, and find what they need. Use military terminology naturally but explain it when talking to family members...",
    constraints: "Never claim to have served. Never minimize anyone's service experience. Never share private member information. Always direct crisis situations to the VA Crisis Line.",
  },
  {
    id: "va-navigator",
    name: "VA Benefits Navigator",
    emoji: "🏥",
    type: "Specialist",
    model: "claude-sonnet-4-5-20250929",
    status: "Active",
    memory: "Persistent",
    facets: ["H", "E", "R", "T"],
    desc: "Specialized assistant for navigating VA benefits, claims, healthcare, and support services for regiment veterans.",
    persona: "You are the VA Benefits Navigator, dedicated to helping 2nd Cavalry veterans and their families access their earned benefits...",
    instructions: "Be thorough and patient. Many veterans are unfamiliar with the claims process. Provide step-by-step guidance. Always include relevant phone numbers and websites...",
    constraints: "Never provide legal or medical advice. Never guarantee claim outcomes. Always recommend consulting with an accredited VSO for complex cases.",
  },
];

const ACTOR_TYPES = [
  { id: "Guide", icon: "🧭", desc: "Facilitates experiences, holds space, and supports member journeys with warmth and presence" },
  { id: "Bridge", icon: "🌉", desc: "Connects members across cycles, translates contexts, and facilitates cross-community exchange" },
  { id: "Specialist", icon: "🔬", desc: "Deep expertise in a specific domain — answers questions, provides analysis, offers structured guidance" },
  { id: "Ceremonial", icon: "🕯️", desc: "Holds ritual space, opens and closes sessions, marks transitions and milestones" },
];

const MODEL_OPTIONS = [
  { value: "claude-opus-4-5-20251101", label: "Claude Opus 4.5", hint: "Most capable · slower" },
  { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5", hint: "Balanced · recommended" },
  { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", hint: "Fastest · lightest" },
];

const MEMORY_OPTIONS = [
  { value: "Persistent", label: "Persistent", desc: "Remembers across all sessions indefinitely" },
  { value: "Session", label: "Session", desc: "Remembers within a session only; resets after" },
  { value: "None", label: "No Memory", desc: "Each interaction starts fresh with no context" },
];

const EMOJIS = ["🌐","💚","🧭","🌉","🔬","🕯️","🎙️","🌀","🌊","🏔️","🌲","⚡","🦋","🌱","✨","🎭","🎵","🔮"];

const PLATFORM_USERS = [
  { id: 1, name: "Gray Worcester", email: "gray@dragoonbase.org", role: "Wizard", status: "Active", joined: "2024-01-10", cycles: 5, lastSeen: "Today" },
  { id: 2, name: "Dave Gettman", email: "dave@dragoonbase.org", role: "Creator", status: "Active", joined: "2024-01-15", cycles: 4, lastSeen: "Today" },
  { id: 3, name: "Tim White", email: "tim@2dcav.org", role: "Creator", status: "Active", joined: "2024-02-20", cycles: 3, lastSeen: "Yesterday" },
  { id: 4, name: "Harry Warner", email: "harry@2dcav.org", role: "Moderator", status: "Active", joined: "2024-03-05", cycles: 3, lastSeen: "Today" },
  { id: 5, name: "Joe Deskevich", email: "joe@2dcav.org", role: "Creator", status: "Active", joined: "2024-03-18", cycles: 2, lastSeen: "2 days ago" },
  { id: 6, name: "Frank Podlaha", email: "frank@2dcav.org", role: "Member", status: "Active", joined: "2024-04-01", cycles: 2, lastSeen: "Today" },
  { id: 7, name: "Gerard Kaminski", email: "gerard@example.com", role: "Member", status: "Active", joined: "2024-04-15", cycles: 1, lastSeen: "3 days ago" },
  { id: 8, name: "Jay Hill", email: "jay@example.com", role: "Member", status: "Active", joined: "2024-05-02", cycles: 2, lastSeen: "Yesterday" },
  { id: 9, name: "John Walker", email: "john@example.com", role: "Member", status: "Active", joined: "2024-05-10", cycles: 1, lastSeen: "1 week ago" },
  { id: 10, name: "Sarah Chen", email: "sarah@kinship.today", role: "Guest", status: "Active", joined: "2024-06-02", cycles: 0, lastSeen: "Today" },
  { id: 11, name: "Eloy", email: "eloy@kinship.today", role: "Creator", status: "Active", joined: "2024-06-15", cycles: 3, lastSeen: "Yesterday" },
  { id: 12, name: "moto", email: "moto@kinship.today", role: "Wizard", status: "Active", joined: "2024-01-01", cycles: 5, lastSeen: "Today" },
];

const roleColors = {
  Wizard: colors.accent,
  Creator: colors.purple,
  Member: colors.cyan,
  Moderator: colors.green,
  Guest: colors.blue,
  Visitor: colors.textDim,
};

const PLATFORM_BOTS = [
  { id: "dragoon-guide", name: "Dragoon Guide", symbol: "🐴", model: "claude-opus-4-5-20251101", status: "Active", cyclesUsing: 5 },
  { id: "va-navigator", name: "VA Benefits Navigator", symbol: "🏥", model: "claude-sonnet-4-5-20250929", status: "Active", cyclesUsing: 3 },
  { id: "archivist", name: "The Archivist", symbol: "📜", model: "claude-haiku-4-5-20251001", status: "Active", cyclesUsing: 4 },
  { id: "herald", name: "Herald", symbol: "📣", model: "claude-haiku-4-5-20251001", status: "Active", cyclesUsing: 5 },
  { id: "reunion-coordinator", name: "Reunion Coordinator", symbol: "🎖️", model: "claude-sonnet-4-5-20250929", status: "Active", cyclesUsing: 2 },
  { id: "memorial-guide", name: "Memorial Guide", symbol: "🕯️", model: "claude-opus-4-5-20251101", status: "Draft", cyclesUsing: 0 },
  { id: "training-instructor", name: "Training Instructor", symbol: "⚔️", model: "claude-haiku-4-5-20251001", status: "Inactive", cyclesUsing: 0 },
  { id: "family-liaison", name: "Family Liaison", symbol: "👨‍👩‍👧", model: "claude-sonnet-4-5-20250929", status: "Draft", cyclesUsing: 0 },
];

const modelLabels = {
  "claude-opus-4-5-20251101": "Opus 4.5",
  "claude-sonnet-4-5-20250929": "Sonnet 4.5",
  "claude-haiku-4-5-20251001": "Haiku 4.5",
};

const KNOWLEDGE_ITEMS = [
  { id: "k1", name: "2nd Cavalry Regiment History Archive", type: "document", format: "PDF", icon: "📚", source: "2nd-cav-history-complete.pdf", scope: "Platform-wide", size: "14.8 MB", pages: 312, added: "2025-08-15", addedBy: "Gray Worcester", status: "Indexed", chunks: 847 },
  { id: "k2", name: "Medal of Honor Citations Database", type: "document", format: "PDF", icon: "🎖️", source: "moh-citations-2nd-dragoons.pdf", scope: "Platform-wide", size: "2.4 MB", pages: 42, added: "2025-09-02", addedBy: "Jay Hill", status: "Indexed", chunks: 128 },
  { id: "k3", name: "Cold War Border Operations Reference", type: "document", format: "PDF", icon: "🛡️", source: "cold-war-border-ops.pdf", scope: "Platform-wide", size: "6.1 MB", pages: 156, added: "2025-09-20", addedBy: "Dave Gettman", status: "Indexed", chunks: 412 },
  { id: "k4", name: "Battle of 73 Easting After-Action Report", type: "document", format: "PDF", icon: "⚔️", source: "73-easting-aar.pdf", scope: "Platform-wide", size: "890 KB", pages: 28, added: "2025-10-05", addedBy: "Tim White", status: "Indexed", chunks: 84 },
  { id: "k5", name: "VA Benefits & Services Guide 2026", type: "link", format: "Web", icon: "🔗", source: "https://va.gov/benefits", scope: "Platform-wide", size: "—", pages: null, added: "2025-11-14", addedBy: "Gray Worcester", status: "Indexed", chunks: 56 },
  { id: "k6", name: "Cavalry Traditions & Customs Manual", type: "document", format: "DOCX", icon: "📋", source: "cavalry-traditions-manual.docx", scope: "Platform-wide", size: "1.1 MB", pages: 24, added: "2025-12-01", addedBy: "Harry Warner", status: "Indexed", chunks: 72 },
  { id: "k7", name: "Association Membership Analytics", type: "ai-generated", format: "DOCX", icon: "lucide:bot", source: "AI-generated · 2026-01-15", scope: "Platform-wide", size: "340 KB", pages: 8, added: "2026-01-15", addedBy: "Dragoon Guide (AI)", status: "Indexed", chunks: 22 },
  { id: "k8", name: "Regimental Crest & Heraldry Reference", type: "document", format: "PDF", icon: "lucide:newspaper", source: "heraldry-reference.pdf", scope: "Platform-wide", size: "4.2 MB", pages: 36, added: "2026-02-10", addedBy: "Joe Deskevich", status: "Processing", chunks: 0 },
];

const sourceTypeLabels = {
  document: "Uploaded",
  link: "Ingested from URL",
  "ai-generated": "AI-Generated Research",
};

const PLATFORM_DATABASES = [
  { id: "pinecone-main", name: "Pinecone (Main)", engine: "Pinecone", purpose: "Vector search for knowledge retrieval and semantic memory", status: "Connected", collections: 3, records: "1.2M", lastSync: "2 min ago" },
  { id: "mongo-members", name: "MongoDB (Members)", engine: "MongoDB", purpose: "Member profiles, preferences, and interaction history", status: "Connected", collections: 8, records: "12.4K", lastSync: "5 min ago" },
  { id: "postgres-core", name: "PostgreSQL (Core)", engine: "PostgreSQL", purpose: "Platform settings, cycle configs, and relational data", status: "Connected", collections: 24, records: "89K", lastSync: "1 min ago" },
  { id: "supabase-realtime", name: "Supabase (Realtime)", engine: "Supabase", purpose: "Live session data, presence, and real-time event streams", status: "Degraded", collections: 5, records: "4.1K", lastSync: "12 min ago" },
];

const engineColors = {
  Pinecone: colors.green,
  MongoDB: colors.green,
  PostgreSQL: colors.blue,
  Supabase: colors.cyan,
};

const PERMISSION_CATEGORIES = [
  { id: "platform", label: "Platform", perms: ["manage_platform_settings", "view_platform_analytics", "manage_integrations", "view_audit_log"] },
  { id: "cycles", label: "Cycles", perms: ["create_cycles", "edit_any_cycle", "delete_cycles", "archive_cycles", "view_all_cycles"] },
  { id: "members", label: "Members", perms: ["invite_members", "remove_members", "edit_member_roles", "view_member_data", "export_member_data"] },
  { id: "content", label: "Content", perms: ["publish_content", "edit_any_content", "delete_content", "moderate_content"] },
  { id: "commerce", label: "Commerce", perms: ["manage_commerce", "view_transactions", "issue_refunds", "manage_memberships"] },
  { id: "actors", label: "Actors & AI", perms: ["manage_actors", "edit_prompts", "deploy_actors", "view_actor_logs"] },
];

const MAGE_ONLY_PERMS = new Set(["manage_platform_settings", "manage_integrations", "view_audit_log", "delete_cycles", "remove_members", "edit_member_roles", "export_member_data", "delete_content", "manage_commerce", "issue_refunds", "manage_actors", "edit_prompts", "deploy_actors"]);
const WIZARD_PERMS = new Set(["view_platform_analytics", "create_cycles", "edit_any_cycle", "archive_cycles", "view_all_cycles", "invite_members", "view_member_data", "publish_content", "edit_any_content", "moderate_content", "view_transactions", "manage_memberships", "view_actor_logs"]);
const PRODUCER_PERMS = new Set(["create_cycles", "view_all_cycles", "invite_members", "view_member_data", "publish_content", "edit_any_content", "view_transactions", "view_actor_logs"]);
const GUIDE_PERMS = new Set(["view_all_cycles", "view_member_data", "publish_content", "moderate_content", "view_actor_logs"]);

const PLATFORM_ROLES = [
  { id: "mage", label: "Mage", icon: "🧙", color: colors.accent, desc: "Full platform control. Can do everything.", perms: new Set([...MAGE_ONLY_PERMS, ...WIZARD_PERMS]) },
  { id: "wizard", label: "Wizard", icon: "✨", color: colors.purple, desc: "Senior operator. Manages cycles, members, content, and most platform features.", perms: WIZARD_PERMS },
  { id: "producer", label: "Producer", icon: "🎬", color: colors.cyan, desc: "Creates and manages cycles. Can invite members and manage content.", perms: PRODUCER_PERMS },
  { id: "guide", label: "Guide", icon: "🧭", color: colors.green, desc: "Facilitates within cycles. Limited platform-level access.", perms: GUIDE_PERMS },
];

const TEAM_MEMBERS = [
  { id: 1, name: "moto", email: "moto@kinship.today", role: "mage", joined: "2024-01-10", lastActive: "Today" },
  { id: 2, name: "Eloy", email: "eloy@kinship.today", role: "wizard", joined: "2024-02-14", lastActive: "Yesterday" },
  { id: 3, name: "Yuki Tanaka", email: "yuki@example.com", role: "producer", joined: "2024-07-01", lastActive: "Yesterday" },
  { id: 4, name: "Amara Diallo", email: "amara@example.com", role: "guide", joined: "2024-04-18", lastActive: "2 days ago" },
];

const PENDING_INVITES = [
  { id: 1, email: "new-creator@example.com", role: "producer", sentOn: "2026-01-20", sentBy: "moto" },
];

const CURRENT_USER_ROLE = "mage";

const COIN_DATA = {
  symbol: "DRGN",
  name: "Dragoon Coin",
  supply: 500000000,
  price: 0.0068,
  circulation: 87200000,
  holders: 4377,
  mintAddress: "DRGNxM7...9aB3",
  treasuryAddress: "TREASxK9...7mN2",
  treasuryBalance: 412800000,
  decimals: 6,
};

const WALLET_CONFIG = {
  provider: "Privy",
  embeddedWallets: true,
  custodialMode: true,
  selfCustodyOpt: true,
  gasSponsorship: true,
  fiatOnramp: true,
  onrampProvider: "Moonpay",
};

const MARKETPLACE_FEES = {
  platformFee: 2.5,
  creatorRoyalty: 10,
  secondaryRoyalty: 5,
  minimumPrice: 0.001,
  settlementCurrency: "KNSHP",
  autoRoyaltyEnforcement: true,
};

const BONDING_CURVE = {
  defaultCurve: "Linear",
  initialPrice: 0.001,
  slope: 0.0000001,
  maxPrice: null,
  reserveRatio: 0.3,
  buyTax: 2,
  sellTax: 4,
};

const MEMBERSHIP_LEVELS = [
  { id: "explorer", name: "Explorer", icon: "🌱", price: 0, currency: "free", perks: ["Access to public scenes", "Basic actor interactions", "Community feed"], color: colors.textDim },
  { id: "wanderer", name: "Wanderer", icon: "🌊", price: 50, currency: "KNSHP", perks: ["All Explorer perks", "Join private cycles", "Extended memory with Kaytee", "Monthly group ritual"], color: colors.cyan },
  { id: "initiate", name: "Initiate", icon: "🔥", price: 250, currency: "KNSHP", perks: ["All Wanderer perks", "Create personal cycles", "Priority actor access", "Quarterly 1:1 with Kaytee", "Early access to new templates"], color: colors.purple },
  { id: "sovereign", name: "Sovereign", icon: "👑", price: 1000, currency: "KNSHP", perks: ["All Initiate perks", "Unlimited cycle creation", "Custom actor configuration", "Direct access to platform team", "Co-creation opportunities"], color: colors.accent },
];

const SPECIAL_OFFERS = [
  { id: "founding", name: "Founding Member", discount: 40, validUntil: "2026-03-01", usedBy: 23, maxUses: 50 },
  { id: "creator-grant", name: "Creator Grant", discount: 100, validUntil: "2026-06-01", usedBy: 5, maxUses: 10 },
];

const COUPONS = [
  { code: "HEARTS2026", discount: 20, type: "percent", uses: 45, maxUses: 100, expires: "2026-12-31" },
  { code: "WELCOME50", discount: 50, type: "KNSHP", uses: 89, maxUses: null, expires: null },
  { code: "FOUNDINGMAGE", discount: 100, type: "percent", uses: 3, maxUses: 5, expires: "2026-03-01" },
];

const PLATFORM_OFFERINGS = [
  { id: "o1", name: "Dragoon Guide 1:1 History Deep Dive", type: "Session", price: 50, currency: "DRGN", status: "Active", sales: 47 },
  { id: "o2", name: "VA Benefits Navigation Session", type: "Session", price: 0, currency: "free", status: "Active", sales: 134 },
  { id: "o3", name: "New Trooper Onboarding Quest", type: "Quest", price: 0, currency: "free", status: "Active", sales: 289 },
  { id: "o4", name: "Reunion Planning Package", type: "Service", price: 200, currency: "DRGN", status: "Active", sales: 12 },
  { id: "o5", name: "Custom Unit History Research", type: "Service", price: 150, currency: "DRGN", status: "Active", sales: 23 },
  { id: "o6", name: "Memorial & Heritage Workshop", type: "Workshop", price: 100, currency: "DRGN", status: "Active", sales: 8 },
  { id: "o7", name: "Monthly Toujours Thursday Access", type: "Subscription", price: 25, currency: "DRGN/mo", status: "Active", sales: 67 },
  { id: "o8", name: "Regimental Merchandise Pack", type: "Physical", price: 75, currency: "DRGN", status: "Draft", sales: 0 },
];

const PLATFORM_TEMPLATES = [
  {
    id: "quest-intro-arc",
    type: "Quest",
    icon: "📖",
    name: "Introduction Arc",
    desc: "A multi-step onboarding quest that orients new members to a cycle's purpose, introduces the guide actor, and surfaces their first HEARTS reflection.",
    status: "Published",
    visibility: "Platform-wide",
    creator: "moto",
    created: "2024-06-15",
    updated: "2025-11-02",
    version: "1.3",
    usedIn: 7,
    tags: ["onboarding", "HEARTS", "reflection"],
    content: {
      steps: [
        { title: "Welcome & Orientation", desc: "Guide introduces the cycle's purpose and atmosphere. Member selects an initial intention." },
        { title: "First Reflection", desc: "Kaytee asks a single open question about what brought the member here. No pressure to respond at depth." },
        { title: "HEARTS Check-in", desc: "Member chooses up to two HEARTS facets that feel most alive for them right now." },
        { title: "Meeting the Space", desc: "A short walkthrough of the cycle's scenes and what each offers." },
        { title: "First Step", desc: "Member chooses their first scene or activity. Quest completes." },
      ],
      estimatedTime: "15–20 min",
      recommendedActors: ["Kaytee", "Platform Core"],
      objectives: ["Orient the member", "Surface initial intention", "Establish HEARTS baseline"],
    },
  },
  {
    id: "scene-meditation-garden",
    type: "Scene",
    icon: "🏞️",
    name: "Meditation Garden",
    desc: "A calm, unhurried space for solitary reflection or gentle guided practice. Works well as an anchor scene in cycles centered on inner work.",
    status: "Published",
    visibility: "Platform-wide",
    creator: "moto",
    created: "2024-07-01",
    updated: "2025-10-18",
    version: "2.0",
    usedIn: 5,
    tags: ["meditation", "solo", "reflection", "HEARTS-Si"],
    content: {
      ambiance: "Still and soft. Natural textures. No urgency. The feeling of early morning before any noise arrives.",
      moodKeywords: ["calm", "spacious", "inward", "unhurried", "safe"],
      recommendedActors: ["Kaytee"],
      suggestedActivities: ["Breath awareness", "HEARTS reflection prompt", "Journaling space", "Silence timer"],
      heartsAlignment: ["H", "Si"],
      lightingHint: "Diffuse morning light. Low contrast. No sharp edges.",
    },
  },
  {
    id: "actor-wise-guide",
    type: "Actor",
    icon: "🧙",
    name: "Wise Guide",
    desc: "A contemplative elder-archetype actor for cycles where depth of inquiry is more important than pace. Preconfigured with strong Harmony and Synthesis-Inward facets.",
    status: "Draft",
    visibility: "Platform-wide",
    creator: "moto",
    created: "2024-08-20",
    updated: "2026-01-05",
    version: "0.7",
    usedIn: 0,
    tags: ["elder", "guide", "depth", "HEARTS-H", "HEARTS-Si"],
    content: {
      actorType: "Guide",
      emoji: "🧙",
      model: "claude-opus-4-5-20251101",
      memory: "Persistent",
      facets: ["H", "R", "Si"],
      persona: "You are an elder. You have walked a long path and carry knowledge without urgency. You do not rush. You ask more than you tell. You are comfortable with silence.",
      instructions: "Hold space for the member without rushing toward resolution. Ask one question at a time. Honor what is said before offering any perspective. Trust that the member knows their own path — your role is to illuminate, not to direct.",
      constraints: "Never moralize. Never interpret what wasn't offered. Never reduce someone's experience to a category or pattern. Avoid advice that sounds like a framework.",
    },
  },
  {
    id: "scene-trading-post",
    type: "Scene",
    icon: "🏪",
    name: "Trading Post",
    desc: "A lively exchange space where members can browse offerings, trade, and engage with commerce features. Designed for cycles with active marketplace activity.",
    status: "Published",
    visibility: "Platform-wide",
    creator: "Eloy",
    created: "2024-09-10",
    updated: "2025-12-01",
    version: "1.1",
    usedIn: 3,
    tags: ["commerce", "exchange", "social", "HEARTS-So"],
    content: {
      ambiance: "Warm and social. The energy of a marketplace — active but not overwhelming. A sense that value is being exchanged in multiple directions.",
      moodKeywords: ["social", "exchange", "abundance", "discovery"],
      recommendedActors: ["Platform Core"],
      suggestedActivities: ["Browse offerings", "Make an offer", "Check wallet", "Trade with another member"],
      heartsAlignment: ["E", "So"],
      lightingHint: "Warm amber. Active. Inviting.",
    },
  },
  {
    id: "starter-mountain-temple",
    type: "Cycle Starter",
    icon: "🏔️",
    name: "Mountain Temple Starter",
    desc: "A full starter kit for inner-work cycles. Bundles a Meditation Garden scene, the Introduction Arc quest, and a Wise Guide actor into a ready-to-launch package.",
    status: "Published",
    visibility: "Platform-wide",
    creator: "moto",
    created: "2025-01-12",
    updated: "2026-01-20",
    version: "1.0",
    usedIn: 2,
    tags: ["starter", "inner-work", "meditation", "onboarding"],
    content: {
      bundledTemplates: [
        { type: "Scene", name: "Meditation Garden", id: "scene-meditation-garden" },
        { type: "Quest", name: "Introduction Arc", id: "quest-intro-arc" },
        { type: "Actor", name: "Wise Guide", id: "actor-wise-guide" },
      ],
      cycleTheme: "Contemplative inner work with gentle HEARTS-centered facilitation",
      recommendedFor: "Cycles focused on self-reflection, emotional regulation, or personal growth",
    },
  },
];

const TEMPLATE_TYPE_COLORS = {
  Quest: colors.purple,
  Scene: colors.green,
  Actor: colors.cyan,
  "Cycle Starter": colors.accent,
};

// ─── Connector detail pages ────────────────────────────────────────────────────

export const BlueSkyDetail = ({ onBack }) => {
  const [handle, setHandle] = useState("@kinship.bsky.social");
  const [autoPost, setAutoPost] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [dms, setDms] = useState(false);
  const [replies, setReplies] = useState(true);

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="🦋 BlueSky" subtitle="Social posting, mention monitoring, replying and direct messaging for the Platform Core actor." onBack={onBack}>
        <StatusPill status="Connected" />
      </PageHeader>
      <SectionDivider label="Account" />
      <Field label="Connected Handle" hint="The Platform Core actor will post and respond as this account.">
        <Input value={handle} onChange={e => setHandle(e.target.value)} />
      </Field>
      <Field label="App Password" hint="Generated in BlueSky settings → Privacy and security → App passwords.">
        <div style={{ display: "flex", gap: 8 }}>
          <Input value="••••••••••••••••••••••" type="password" readOnly />
          <Btn variant="secondary" size="sm">Rotate</Btn>
        </div>
      </Field>
      <Field label="DID (Decentralized Identifier)" hint="Auto-resolved from your handle. Read-only.">
        <Input value="did:plc:z72i7hdynmk6r22z27h6tvur" readOnly />
      </Field>
      <SectionDivider label="Permissions" />
      <Toggle label="Post to feed" enabled={autoPost} onChange={setAutoPost} hint="Platform Core can post on behalf of this account" />
      <Toggle label="Read mentions" enabled={mentions} onChange={setMentions} hint="Platform Core receives and responds to @mentions" />
      <Toggle label="Send & receive DMs" enabled={dms} onChange={setDms} hint="Platform Core can handle direct messages" />
      <Toggle label="Reply to threads" enabled={replies} onChange={setReplies} hint="Platform Core can participate in reply chains" />
      <SectionDivider label="Test Connection" />
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Btn variant="secondary">Send Test Post</Btn>
        <Btn variant="secondary">Verify Credentials</Btn>
      </div>
      <p style={{ fontSize: 12, color: colors.textDim }}>Last verified: 2 hours ago — OK</p>
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>Save Changes</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>
      <DangerZone>
        <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Disconnecting BlueSky will prevent the Kinship Core from posting or receiving mentions on this platform. Any queued posts will be dropped.</p>
        <Btn danger>Disconnect BlueSky</Btn>
      </DangerZone>
    </div>
  );
};

export const TelegramDetail = ({ onBack }) => {
  const [botName, setBotName] = useState("KinshipBot");
  const [webhook, setWebhook] = useState("https://api.kinship.today/webhooks/telegram");
  const [groupReply, setGroupReply] = useState(true);
  const [privateMsg, setPrivateMsg] = useState(true);
  const [commands, setCommands] = useState(true);

  const channels = [
    { name: "Kinship Community", type: "Group", members: 234, status: "Active" },
    { name: "Creator Updates", type: "Channel", members: 89, status: "Active" },
    { name: "Support", type: "Group", members: 45, status: "Active" },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="✈️ Telegram" subtitle="Bot-based messaging for the Platform Core actor to reach members via Telegram" onBack={onBack}>
        <StatusPill status="Connected" />
      </PageHeader>
      <SectionDivider label="Bot Configuration" />
      <Field label="Bot Username">
        <Input value={botName} onChange={e => setBotName(e.target.value)} />
      </Field>
      <Field label="Bot Token" hint="Get this from @BotFather on Telegram. Changing this will disconnect all active sessions.">
        <div style={{ display: "flex", gap: 8 }}>
          <Input value="7412••••••••••••••••••••••••••••••••••" readOnly />
          <Btn variant="secondary" size="sm">Replace</Btn>
        </div>
      </Field>
      <Field label="Webhook URL" hint="Telegram will POST updates to this endpoint. Auto-configured.">
        <Input value={webhook} readOnly />
      </Field>
      <SectionDivider label="Capabilities" />
      <Toggle label="Respond in group chats" enabled={groupReply} onChange={setGroupReply} hint="Bot participates in groups it has been added to" />
      <Toggle label="Handle private messages" enabled={privateMsg} onChange={setPrivateMsg} hint="Users can DM the bot directly" />
      <Toggle label="Respond to slash commands" enabled={commands} onChange={setCommands} hint="/ask, /status, /help and custom commands" />
      <SectionDivider label="Connected Channels & Groups" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {channels.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 16 }}>{c.type === "Channel" ? "📢" : "👥"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>{c.type} · {c.members} members</div>
            </div>
            <StatusPill status={c.status} />
            <button style={{ background: "none", border: "none", color: colors.textDim, cursor: "pointer", fontSize: 12 }}>Remove</button>
          </div>
        ))}
      </div>
      <Btn variant="secondary" size="sm">+ Add Channel or Group</Btn>
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>Save Changes</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>
      <DangerZone>
        <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Disconnecting Telegram removes the bot from all groups and stops all message handling. Active conversations will not receive a goodbye message.</p>
        <Btn danger>Disconnect Telegram</Btn>
      </DangerZone>
    </div>
  );
};

export const GoogleDetail = ({ onBack }) => {
  const [gmail, setGmail] = useState(true);
  const [calendar, setCalendar] = useState(true);
  const [meet, setMeet] = useState(false);
  const [drive, setDrive] = useState(false);

  const scopes = [
    { scope: "gmail.send", description: "Send email as connected account", active: gmail },
    { scope: "gmail.readonly", description: "Read inbox for replies and context", active: gmail },
    { scope: "calendar.events", description: "Create and read calendar events", active: calendar },
    { scope: "calendar.readonly", description: "Check availability", active: calendar },
    { scope: "meet.readonly", description: "Access meeting links and schedules", active: meet },
    { scope: "drive.file", description: "Read and create files Platform Core generates", active: drive },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="📧 Google Workspace" subtitle="Gmail, Calendar, Meet, and Drive access for the Platform Core actor" onBack={onBack}>
        <StatusPill status="Connected" />
      </PageHeader>
      <SectionDivider label="Connected Account" />
      <Field label="Google Account">
        <div style={{ display: "flex", gap: 8 }}>
          <Input value="admin@kinship.today" readOnly />
          <Btn variant="secondary" size="sm">Switch Account</Btn>
        </div>
      </Field>
      <Field label="OAuth Status" hint="Authorization was last granted 14 days ago.">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Input value="Authorized — expires in 16 days" readOnly />
          <Btn variant="secondary" size="sm">Re-authorize</Btn>
        </div>
      </Field>
      <SectionDivider label="Enabled Services" />
      <Toggle label="Gmail" enabled={gmail} onChange={setGmail} hint="Platform Core can send and read emails on behalf of this account" />
      <Toggle label="Google Calendar" enabled={calendar} onChange={setCalendar} hint="Platform Core can check availability and create events" />
      <Toggle label="Google Meet" enabled={meet} onChange={setMeet} hint="Platform Core can generate Meet links and join schedules" />
      <Toggle label="Google Drive" enabled={drive} onChange={setDrive} hint="Platform Core can create and access files in Drive" />
      <SectionDivider label="Active OAuth Scopes" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {scopes.filter(s => s.active).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <code style={{ fontSize: 11, color: colors.accent, background: colors.accent + "12", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{s.scope}</code>
            <span style={{ fontSize: 12, color: colors.textDim, alignSelf: "center" }}>{s.description}</span>
          </div>
        ))}
        {scopes.filter(s => s.active).length === 0 && (
          <p style={{ fontSize: 13, color: colors.textDim }}>No services enabled — enable a service above to see its scopes.</p>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>Save & Re-authorize</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>
      <DangerZone>
        <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Revoking access will immediately stop Platform Core from sending email, accessing calendars, or interacting with Drive on behalf of this Google account.</p>
        <Btn danger>Revoke Google Access</Btn>
      </DangerZone>
    </div>
  );
};

export const LinkedInDetail = ({ onBack }) => {
  const [mode, setMode] = useState("personal");
  const [pluginInstalled, setPluginInstalled] = useState(false);

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="💼 LinkedIn" subtitle="LinkedIn posting and outreach via Chrome plugin" onBack={onBack}>
        <StatusPill status="Pending Setup" />
      </PageHeader>
      <InfoBox color={colors.blue}>
        ℹ️  LinkedIn requires the Kinship Chrome Extension to be installed and signed in. This is because LinkedIn's API does not support automated posting for most account types.
      </InfoBox>
      <SectionDivider label="Chrome Extension" />
      <div style={{ padding: "20px", background: colors.surface, border: `1px solid ${pluginInstalled ? colors.green + "44" : colors.border}`, borderRadius: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🧩</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>Kinship Chrome Extension</div>
            <div style={{ fontSize: 12, color: colors.textDim, marginTop: 3 }}>
              {pluginInstalled ? "Detected — signed in as David Levine" : "Not detected in this browser"}
            </div>
          </div>
          <StatusPill status={pluginInstalled ? "Installed" : "Not Installed"} />
        </div>
        {!pluginInstalled && (
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Btn>Install from Chrome Web Store</Btn>
            <button onClick={() => setPluginInstalled(true)} style={{ background: "none", border: "none", color: colors.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Simulate install →
            </button>
          </div>
        )}
        {pluginInstalled && (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm">View Extension Settings</Btn>
            <Btn variant="secondary" size="sm">Sign Out</Btn>
          </div>
        )}
      </div>
      <SectionDivider label="Account Type" />
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["personal", "company"].map(m => (
          <div key={m} onClick={() => setMode(m)}
            style={{ flex: 1, padding: "14px 16px", background: mode === m ? colors.accent + "18" : colors.surface, border: `1px solid ${mode === m ? colors.accent : colors.border}`, borderRadius: 9, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{m === "personal" ? "👤" : "🏢"}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: mode === m ? colors.accent : colors.textMuted }}>{m === "personal" ? "Personal Profile" : "Company Page"}</div>
            <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>
              {m === "personal" ? "Post as an individual" : "Post as your organization"}
            </div>
          </div>
        ))}
      </div>
      {pluginInstalled && (
        <>
          <SectionDivider label="Connected Profile" />
          <Field label={mode === "personal" ? "LinkedIn Profile" : "Company Page"}>
            <div style={{ display: "flex", gap: 8 }}>
              <Input value={mode === "personal" ? "David Levine — linkedin.com/in/davidlevine" : "Select a company page..."} readOnly={mode === "personal"} />
              {mode === "company" && <Btn variant="secondary" size="sm">Browse</Btn>}
            </div>
          </Field>
          <SectionDivider label="Capabilities" />
          <Toggle label="Publish posts" enabled={true} onChange={() => {}} hint="Platform Core can draft and publish posts to LinkedIn" />
          <Toggle label="Comment on posts" enabled={false} onChange={() => {}} hint="Platform Core can reply to comments and engage threads" />
          <Toggle label="Send connection requests" enabled={false} onChange={() => {}} hint="Platform Core can send invitations on behalf of this account" />
          <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
            <Btn>Save Configuration</Btn>
            <Btn variant="secondary">Cancel</Btn>
          </div>
        </>
      )}
      {!pluginInstalled && (
        <div style={{ padding: "24px", background: colors.surface, border: `1px dashed ${colors.border}`, borderRadius: 10, textAlign: "center", marginTop: 8 }}>
          <p style={{ fontSize: 13, color: colors.textDim }}>Install the Chrome Extension to continue LinkedIn setup.</p>
        </div>
      )}
      {pluginInstalled && (
        <DangerZone>
          <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Disconnecting LinkedIn removes Platform Core's access and stops all posting activity. The Chrome Extension will remain installed.</p>
          <Btn danger>Disconnect LinkedIn</Btn>
        </DangerZone>
      )}
    </div>
  );
};

export const SolanaDetail = ({ onBack }) => {
  const [network, setNetwork] = useState("mainnet-beta");
  const [customRpc, setCustomRpc] = useState(false);
  const [rpcUrl, setRpcUrl] = useState("https://api.mainnet-beta.solana.com");
  const [walletVisible, setWalletVisible] = useState(false);
  const [embeddedWallet, setEmbeddedWallet] = useState(true);
  const [custodial, setCustodial] = useState(true);

  const networks = [
    { id: "mainnet-beta", label: "Mainnet Beta", hint: "Live production network" },
    { id: "devnet", label: "Devnet", hint: "Testing with free SOL" },
    { id: "testnet", label: "Testnet", hint: "Staging environment" },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="◎ Solana" subtitle="Blockchain wallet, coin infrastructure, and on-chain transactions" onBack={onBack}>
        <StatusPill status="Connected" />
      </PageHeader>
      <SectionDivider label="Network" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {networks.map(n => (
          <div key={n.id} onClick={() => setNetwork(n.id)}
            style={{ flex: 1, padding: "12px 14px", background: network === n.id ? colors.accent + "18" : colors.surface, border: `1px solid ${network === n.id ? colors.accent : colors.border}`, borderRadius: 9, cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: network === n.id ? colors.accent : colors.textMuted }}>{n.label}</div>
            <div style={{ fontSize: 11, color: colors.textDim, marginTop: 3 }}>{n.hint}</div>
          </div>
        ))}
      </div>
      <Toggle label="Use custom RPC endpoint" enabled={customRpc} onChange={v => { setCustomRpc(v); if (!v) setRpcUrl("https://api.mainnet-beta.solana.com"); }}
        hint="Override the default public RPC with your own (recommended for production)" />
      {customRpc && (
        <Field label="RPC Endpoint URL" hint="Helius, QuickNode, Triton, or your own node.">
          <Input value={rpcUrl} onChange={e => setRpcUrl(e.target.value)} placeholder="https://your-rpc.helius.xyz/?api-key=..." />
        </Field>
      )}
      <SectionDivider label="Platform Wallet" />
      <Field label="Platform Hot Wallet Address" hint="Used for paying transaction fees on behalf of users. Keep funded.">
        <div style={{ display: "flex", gap: 8 }}>
          <Input value={walletVisible ? "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" : "7xKXtg•••••••••••••••••••••••••••••sgAsU"} readOnly />
          <Btn variant="secondary" size="sm" onClick={() => setWalletVisible(!walletVisible)}>{walletVisible ? "Hide" : "Show"}</Btn>
        </div>
      </Field>
      <Field label="Current Balance">
        <Input value="12.45 SOL  ·  ~$1,892 USD" readOnly />
      </Field>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Btn variant="secondary" size="sm">Fund Wallet</Btn>
        <Btn variant="secondary" size="sm">View on Explorer</Btn>
        <Btn variant="secondary" size="sm">Export Keys</Btn>
      </div>
      <SectionDivider label="Embedded Wallet Settings" />
      <Toggle label="Enable embedded wallets for members" enabled={embeddedWallet} onChange={setEmbeddedWallet}
        hint="Each member gets a non-custodial wallet created on signup" />
      <Toggle label="Custodial mode for new members" enabled={custodial} onChange={setCustodial}
        hint="Platform holds keys until member opts into self-custody. Reduces friction for onboarding." />
      <SectionDivider label="Kinship Coin (KNSHP)" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {[
          { label: "Token Mint Address", value: "KNSHPxM7...9aB3" },
          { label: "Total Supply", value: "1,000,000,000 KNSHP" },
          { label: "Circulating Supply", value: "234,500,000 KNSHP" },
          { label: "Current Price", value: "$0.0042 USD" },
          { label: "Default Bonding Curve", value: "Linear (slope: 0.000001)" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", padding: "10px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, gap: 16 }}>
            <span style={{ fontSize: 12, color: colors.textDim, width: 180, flexShrink: 0 }}>{r.label}</span>
            <span style={{ fontSize: 12, color: colors.text, fontWeight: 500 }}>{r.value}</span>
          </div>
        ))}
      </div>
      <Btn variant="secondary" size="sm">Configure Bonding Curve</Btn>
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>Save Changes</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>
      <DangerZone>
        <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Disconnecting Solana will disable all on-chain transactions, coin creation, and embedded wallets across the platform. This will break Commerce for all cycles.</p>
        <Btn danger>Disconnect Solana</Btn>
      </DangerZone>
    </div>
  );
};

// ─── Tool detail pages ─────────────────────────────────────────────────────────

export const MeetingFacilitatorDetail = ({ onBack }) => {
  const tool = PLATFORM_TOOLS_DATA.find(t => t.id === "meeting-facilitator");
  const [listenMode, setListenMode] = useState("transcript");
  const [outputMode, setOutputMode] = useState("sidebar");
  const [responseMode, setResponseMode] = useState("suggest");
  const [triggerToggles, setTriggerToggles] = useState({ "long-monologue": true, "cross-talk": false, "tension-signal": true, "silence": false });
  const [heartsCheck, setHeartsCheck] = useState(true);
  const [saveState, setSaveState] = useState(null);

  const triggerLabels = {
    "long-monologue": { label: "Long Monologue", hint: "One voice speaking for more than 90 seconds without acknowledgment" },
    "cross-talk": { label: "Cross-Talk", hint: "Multiple participants speaking simultaneously for more than 5 seconds" },
    "tension-signal": { label: "Tension Signal", hint: "Language patterns indicating conflict, defensiveness, or distress" },
    "silence": { label: "Extended Silence", hint: "No speech detected for more than 30 seconds after an open question" },
  };
  const outputLabels = {
    sidebar: "Sidebar (visible to all)",
    "facilitator-dm": "DM to Facilitator only",
    "chat-overlay": "Chat overlay (all participants)",
  };
  const responseModeLabels = {
    suggest: { label: "Suggest", desc: "Kaytee offers guidance but participants decide whether to act" },
    intervene: { label: "Intervene", desc: "Kaytee can speak directly in the meeting channel when a trigger fires" },
    "observe-only": { label: "Observe Only", desc: "Kaytee tracks patterns silently — no output during the meeting" },
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title={tool.name} iconEl={<RenderIcon icon={tool.icon} size={28} />} subtitle={tool.desc} onBack={onBack}>
        <StatusPill status={tool.status} />
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Category", value: tool.category },
          { label: "Version", value: tool.version },
          { label: "Cycles Using", value: `${tool.cyclesUsing} active` },
          { label: "Can Add To", value: tool.canAddTo.join(", ") },
          { label: "Added By", value: tool.addedBy },
          { label: "Added On", value: tool.addedOn },
        ].map((f, i) => (
          <div key={i} style={{ padding: "10px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>HEARTS Alignment</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Facets this tool actively monitors and supports during meetings</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["H","E","A","R","T","Si","So"].map(f => {
            const active = tool.heartsAligned.includes(f);
            return (
              <span key={f} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: active ? colors.accent + "20" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? colors.accent + "60" : colors.border}`, color: active ? colors.accent : colors.textDim }}>
                {f}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>How it Works</div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.7, marginBottom: 16 }}>
          When added to a Cycle or Scene, Meeting Facilitator attaches to the active session's audio or transcript feed. It runs continuous analysis in the background, tracking the conversational dynamics between participants. When configured triggers fire, it routes guidance to the selected output channel — either subtly (DM to facilitator) or openly (sidebar or chat).
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>Input Mode</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {[["transcript", "📝 Live Transcript", "Works with auto-generated captions — no audio access required"], ["audio", "🎤 Audio Stream", "Direct audio analysis — richer signal detection, requires permission"]].map(([val, label, hint]) => (
            <div key={val} onClick={() => setListenMode(val)}
              style={{ flex: 1, padding: "12px 14px", background: listenMode === val ? colors.accent + "12" : colors.bg, border: `1px solid ${listenMode === val ? colors.accent + "60" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: listenMode === val ? colors.accent : colors.textMuted, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>{hint}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Triggers</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div onClick={() => setHeartsCheck(!heartsCheck)}
            style={{ width: 36, height: 20, borderRadius: 10, background: heartsCheck ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s" }}>
            <div style={{ position: "absolute", top: 3, left: heartsCheck ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>HEARTS alignment detection</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>Flags when the conversation's overall emotional tone diverges from the configured facets</div>
          </div>
        </div>
        {Object.entries(triggerLabels).map(([key, { label, hint }]) => (
          <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
            <div onClick={() => setTriggerToggles(t => ({ ...t, [key]: !t[key] }))}
              style={{ width: 36, height: 20, borderRadius: 10, background: triggerToggles[key] ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0, marginTop: 2 }}>
              <div style={{ position: "absolute", top: 3, left: triggerToggles[key] ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>{hint}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Output & Response</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Where guidance appears</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
          {Object.entries(outputLabels).map(([val, label]) => (
            <div key={val} onClick={() => setOutputMode(val)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: outputMode === val ? colors.accent + "10" : colors.bg, border: `1px solid ${outputMode === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${outputMode === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {outputMode === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <span style={{ fontSize: 13, color: outputMode === val ? colors.text : colors.textMuted }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Response mode</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(responseModeLabels).map(([val, { label, desc }]) => (
            <div key={val} onClick={() => setResponseMode(val)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: responseMode === val ? colors.accent + "10" : colors.bg, border: `1px solid ${responseMode === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${responseMode === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {responseMode === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: responseMode === val ? colors.text : colors.textMuted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Platform Availability</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>Meeting Facilitator is available for creators to add to any Cycle or Scene. Creators configure per-cycle settings themselves.</div>
        <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: colors.blue }}>ℹ️ This tool is active in <strong>3 cycles</strong> — Mountain Temple, Ocean Depths, and CATFAWN Ceremony. Creators control their own trigger and output settings per cycle.</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Btn onClick={() => setSaveState("saved")}>{saveState === "saved" ? "✓ Saved" : "Save Settings"}</Btn>
        <Btn variant="secondary">View Usage Across Platform</Btn>
      </div>
    </div>
  );
};

export const PatternTrackerDetail = ({ onBack }) => {
  const tool = PLATFORM_TOOLS_DATA.find(t => t.id === "pattern-tracker");
  const [window_, setWindow] = useState("60d");
  const [patterns, setPatterns] = useState({ comms: true, hearts: true, engagement: false, themes: true });
  const [sensitivity, setSensitivity] = useState("medium");
  const [surfaceTo, setSurfaceTo] = useState("facilitator");
  const [memberVisible, setMemberVisible] = useState(false);
  const [freq, setFreq] = useState("after-session");
  const [saveState, setSaveState] = useState(null);

  const patternTypes = [
    { key: "comms", label: "Communication Style Shifts", hint: "Changes in a member's typical expression patterns — brevity, directness, tone" },
    { key: "hearts", label: "HEARTS Facet Drift", hint: "Movement in how a member's engagement maps to each HEARTS dimension over time" },
    { key: "engagement", label: "Engagement Volume", hint: "Rises and drops in participation rate across sessions" },
    { key: "themes", label: "Recurring Themes", hint: "Topics or emotional territory that appear repeatedly across sessions" },
  ];
  const sensLabels = {
    low:    { label: "Low", desc: "Only flags significant, sustained changes (3+ sessions)" },
    medium: { label: "Medium", desc: "Balanced — catches meaningful drift without over-reporting" },
    high:   { label: "High", desc: "Flags early signals — more alerts, more detail" },
  };
  const surfaceOpts = [
    { val: "member",      label: "Member Profile Dashboard", desc: "Each member sees their own pattern data" },
    { val: "facilitator", label: "Facilitator Digest",        desc: "Weekly summary sent to cycle facilitators" },
    { val: "actor",       label: "Actor Context",             desc: "Insights injected silently into actor system prompts" },
    { val: "all",         label: "All of the Above",          desc: "Broadest coverage" },
  ];
  const freqOpts = [
    { val: "after-session", label: "After Each Session", desc: "Analysis runs at end of every session" },
    { val: "daily",         label: "Daily",              desc: "Nightly batch across all sessions from the day" },
    { val: "weekly",        label: "Weekly",             desc: "Sunday digest — lower noise, broader patterns only" },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title={tool.name} iconEl={<RenderIcon icon={tool.icon} size={24} />} subtitle={tool.desc} onBack={onBack}>
        <StatusPill status={tool.status} />
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Category",     value: tool.category },
          { label: "Version",      value: tool.version },
          { label: "Cycles Using", value: `${tool.cyclesUsing} active` },
          { label: "Can Add To",   value: tool.canAddTo.join(", ") },
          { label: "Added By",     value: tool.addedBy },
          { label: "Added On",     value: tool.addedOn },
        ].map((f, i) => (
          <div key={i} style={{ padding: "10px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>HEARTS Alignment</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Facets this tool actively tracks and surfaces insights about</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["H","E","A","R","T","Si","So"].map(f => {
            const active = tool.heartsAligned.includes(f);
            return (
              <span key={f} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: active ? colors.accent + "20" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? colors.accent + "60" : colors.border}`, color: active ? colors.accent : colors.textDim }}>
                {f}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>How it Works</div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.7, marginBottom: 16 }}>
          Pattern Tracker runs after sessions end, scanning interaction data for recurring structures in how members participate, communicate, and engage. It does not monitor in real-time — it looks across sessions over time, building a longitudinal picture of each member's patterns. Insights are surfaced to the designated audience on the configured schedule.
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>Observation Window</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["30d","30 days"],["60d","60 days"],["90d","90 days"],["all","All time"]].map(([val, label]) => (
            <div key={val} onClick={() => setWindow_(val)}
              style={{ flex: 1, padding: "10px 8px", textAlign: "center", background: window_ === val ? colors.accent + "14" : colors.bg, border: `1px solid ${window_ === val ? colors.accent + "60" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: window_ === val ? colors.accent : colors.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Pattern Types</div>
        {patternTypes.map(pt => (
          <div key={pt.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
            <div onClick={() => setPatterns(p => ({ ...p, [pt.key]: !p[pt.key] }))}
              style={{ width: 36, height: 20, borderRadius: 10, background: patterns[pt.key] ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0, marginTop: 2 }}>
              <div style={{ position: "absolute", top: 3, left: patterns[pt.key] ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{pt.label}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>{pt.hint}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Sensitivity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(sensLabels).map(([val, { label, desc }]) => (
            <div key={val} onClick={() => setSensitivity(val)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: sensitivity === val ? colors.accent + "10" : colors.bg, border: `1px solid ${sensitivity === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${sensitivity === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {sensitivity === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: sensitivity === val ? colors.text : colors.textMuted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Surface Insights To</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {surfaceOpts.map(({ val, label, desc }) => (
            <div key={val} onClick={() => setSurfaceTo(val)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: surfaceTo === val ? colors.accent + "10" : colors.bg, border: `1px solid ${surfaceTo === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${surfaceTo === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {surfaceTo === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: surfaceTo === val ? colors.text : colors.textMuted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => setMemberVisible(!memberVisible)}
            style={{ width: 36, height: 20, borderRadius: 10, background: memberVisible ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s" }}>
            <div style={{ position: "absolute", top: 3, left: memberVisible ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>Members can view their own pattern data</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>If off, pattern insights are facilitator-only</div>
          </div>
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Analysis Frequency</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {freqOpts.map(({ val, label, desc }) => (
            <div key={val} onClick={() => setFreq(val)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: freq === val ? colors.accent + "10" : colors.bg, border: `1px solid ${freq === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${freq === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {freq === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: freq === val ? colors.text : colors.textMuted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Platform Availability</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>Pattern Tracker is available for cycle creators to enable. Each cycle's facilitator can fine-tune sensitivity and visibility within their own context.</div>
        <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: colors.blue }}>ℹ️ Currently active in <strong>5 cycles</strong>. Member-visible patterns are off by default — facilitators must opt in per cycle.</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Btn onClick={() => setSaveState("saved")}>{saveState === "saved" ? "✓ Saved" : "Save Settings"}</Btn>
        <Btn variant="secondary">View Insights Dashboard</Btn>
      </div>
    </div>
  );
};

export const RitualTimerDetail = ({ onBack }) => {
  const tool = PLATFORM_TOOLS_DATA.find(t => t.id === "ritual-timer");
  const [cueType, setCueType] = useState("chat");
  const [timingMode, setTimingMode] = useState("strict");
  const [facilitatorControl, setFacilitatorControl] = useState(true);
  const [memberVisible, setMemberVisible] = useState(true);
  const [preAlert, setPreAlert] = useState("30s");
  const [saveState, setSaveState] = useState(null);

  const defaultStructures = [
    { id: "opening-round", label: "Opening Round", desc: "Each member takes 60–90 seconds to share their current state before the main session begins", icon: "🌅", duration: "8–12 min" },
    { id: "closing-circle", label: "Closing Circle", desc: "Structured closing — one word, one insight, or one appreciation each — before the session ends", icon: "🌙", duration: "5–10 min" },
    { id: "silence", label: "Silence Period", desc: "A timed pause for reflection, meditation, or journaling", icon: "🤫", duration: "3–15 min" },
    { id: "popcorn", label: "Popcorn Round", desc: "Anyone speaks when moved to — no order, no pressure — with a shared timer visible to all", icon: "🍿", duration: "Custom" },
  ];
  const cueOpts = [
    { val: "chat",    label: "Chat Message",          desc: "Actor posts a transition message in the session channel" },
    { val: "sound",   label: "Sound Cue",             desc: "A soft chime plays for all participants (requires audio)" },
    { val: "sidebar", label: "Sidebar Notification",  desc: "A quiet sidebar update visible without interrupting flow" },
    { val: "actor",   label: "Actor Announcement",    desc: "The cycle's primary actor formally announces the transition" },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title={tool.name} iconEl={<RenderIcon icon={tool.icon} size={24} />} subtitle={tool.desc} onBack={onBack}>
        <StatusPill status={tool.status} />
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Category",     value: tool.category },
          { label: "Version",      value: tool.version },
          { label: "Cycles Using", value: `${tool.cyclesUsing} active` },
          { label: "Can Add To",   value: tool.canAddTo.join(", ") },
          { label: "Added By",     value: tool.addedBy },
          { label: "Added On",     value: tool.addedOn },
        ].map((f, i) => (
          <div key={i} style={{ padding: "10px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>HEARTS Alignment</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Facets this tool supports through pacing, structure, and intentional transitions</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["H","E","A","R","T","Si","So"].map(f => {
            const active = tool.heartsAligned.includes(f);
            return (
              <span key={f} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: active ? colors.accent + "20" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? colors.accent + "60" : colors.border}`, color: active ? colors.accent : colors.textDim }}>
                {f}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>How it Works</div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.7 }}>
          Ritual Timer gives creators a library of timed ritual structures they can embed into cycles and scenes. When a ritual begins, the timer runs in the background — cuing transitions, alerting participants, and keeping the facilitator informed without requiring manual timekeeping. Platform defaults set here can be overridden by creators within their own cycle settings.
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Default Ritual Library</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 16 }}>These structures are available to all cycles using this tool. Creators can configure timing within each structure per-cycle.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {defaultStructures.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 9 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{s.label}</div>
                  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: colors.textDim, border: `1px solid ${colors.border}` }}>{s.duration}</span>
                </div>
                <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
              <StatusPill status="Active" />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Transition Cues</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Default method used to signal the end of a timer segment</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {cueOpts.map(({ val, label, desc }) => (
            <div key={val} onClick={() => setCueType(val)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: cueType === val ? colors.accent + "10" : colors.bg, border: `1px solid ${cueType === val ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${cueType === val ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {cueType === val && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: cueType === val ? colors.text : colors.textMuted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Timing & Control</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Timing Mode</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["strict","Strict","Timer runs unpaused — facilitator can only extend after it completes"],["flexible","Flexible","Facilitator can pause, extend, or skip at any point"]].map(([val, label, hint]) => (
              <div key={val} onClick={() => setTimingMode(val)}
                style={{ flex: 1, padding: "12px 14px", background: timingMode === val ? colors.accent + "12" : colors.bg, border: `1px solid ${timingMode === val ? colors.accent + "60" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: timingMode === val ? colors.accent : colors.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{hint}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Pre-Transition Alert</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["none","None"],["30s","30 sec"],["60s","60 sec"]].map(([val, label]) => (
              <div key={val} onClick={() => setPreAlert(val)}
                style={{ flex: 1, padding: "10px 8px", textAlign: "center", background: preAlert === val ? colors.accent + "14" : colors.bg, border: `1px solid ${preAlert === val ? colors.accent + "60" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: preAlert === val ? colors.accent : colors.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setFacilitatorControl(!facilitatorControl)}
              style={{ width: 36, height: 20, borderRadius: 10, background: facilitatorControl ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s" }}>
              <div style={{ position: "absolute", top: 3, left: facilitatorControl ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>Facilitator can adjust timer in real-time</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>If off, timers run exactly as configured — no in-session changes</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setMemberVisible(!memberVisible)}
              style={{ width: 36, height: 20, borderRadius: 10, background: memberVisible ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s" }}>
              <div style={{ position: "absolute", top: 3, left: memberVisible ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>Countdown visible to all participants</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>If off, only the facilitator sees the running timer</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Platform Availability</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>Ritual Timer is the most-used tool on the platform. Creators can override any of these defaults within their own cycle or scene settings.</div>
        <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: colors.blue }}>ℹ️ Currently active in <strong>7 cycles</strong>. The Opening Round and Closing Circle structures are used in every active cycle.</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Btn onClick={() => setSaveState("saved")}>{saveState === "saved" ? "✓ Saved" : "Save Settings"}</Btn>
        <Btn variant="secondary">Manage Ritual Library</Btn>
      </div>
    </div>
  );
};

// ─── Sub-components (hooks-in-map fixes) ──────────────────────────────────────

const ConnectorListItem = ({ t, onSelectTool }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelectTool(t.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={t.icon} size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{t.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{t.account}</div>
      </div>
      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: colors.textDim, border: `1px solid ${colors.border}` }}>{t.category}</span>
      <StatusPill status={t.status} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

const PlatformToolListItem = ({ t, onSelectPlatformTool }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelectPlatformTool(t.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={t.icon} size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{t.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{t.desc}</div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {t.heartsAligned.map(f => (
          <span key={f} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: colors.accent + "14", color: colors.accent, fontWeight: 700 }}>{f}</span>
        ))}
      </div>
      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: colors.textDim, border: `1px solid ${colors.border}` }}>{t.category}</span>
      <StatusPill status={t.status} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

const AvailConnItem = ({ conn, onSelect, authColors: aC }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(conn.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={conn.icon} size={26} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{conn.name}</span>
          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: (aC[conn.auth] || colors.accent) + "18", color: aC[conn.auth] || colors.accent, fontWeight: 700 }}>{conn.auth}</span>
        </div>
        <div style={{ fontSize: 11, color: colors.textDim }}>{conn.desc}</div>
      </div>
    </div>
  );
};

const ToolTypeCard = ({ opt, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(opt.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: "24px 22px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.accent + "60" : colors.border}`, borderRadius: 12, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={opt.icon} size={36} style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{opt.label}</div>
      <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>{opt.desc}</div>
    </div>
  );
};

const BuiltinToolRow = ({ t }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: hovered && t.available ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered && t.available ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: t.available ? "pointer" : "default", transition: "all 0.15s", opacity: t.available ? 1 : 0.55 }}>
      <RenderIcon icon={t.icon} size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{t.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{t.desc}</div>
      </div>
      {t.available ? <Btn variant="secondary" style={{ fontSize: 11 }}>Enable</Btn> : <StatusPill status="Active" />}
    </div>
  );
};

// ─── Platform Tools list ───────────────────────────────────────────────────────

const PlatformToolsList = ({ onSelectTool, onAddConnector, onAddTool, onSelectPlatformTool }) => {
  const [tab, setTab] = useState("connectors");
  return (
    <div>
      <PageHeader title="Platform Tools & Connectors" subtitle="External services and internal tools available across all cycles">
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "connectors" && <Btn onClick={onAddConnector}>+ Add Connector</Btn>}
          {tab === "tools" && <Btn onClick={onAddTool}>+ Add Tool</Btn>}
        </div>
      </PageHeader>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", alignSelf: "flex-start", width: "fit-content" }}>
        {[{ id: "connectors", label: "🔌 Connectors", count: CONNECTORS.length }, { id: "tools", label: "🛠️ Platform Tools", count: PLATFORM_TOOLS_DATA.length }].map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "10px 20px", background: tab === t.id ? colors.accent + "18" : "transparent", border: "none", borderRight: i === 0 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>
            <span style={{ fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? colors.accent : colors.textMuted }}>{t.label}</span>
            <span style={{ marginLeft: 6, fontSize: 11, color: colors.textDim }}>({t.count})</span>
          </button>
        ))}
      </div>
      {tab === "connectors" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CONNECTORS.map(t => <ConnectorListItem key={t.id} t={t} onSelectTool={onSelectTool} />)}
        </div>
      )}
      {tab === "tools" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PLATFORM_TOOLS_DATA.map(t => <PlatformToolListItem key={t.id} t={t} onSelectPlatformTool={onSelectPlatformTool} />)}
        </div>
      )}
    </div>
  );
};

export const PlatformToolsContent = () => {
  const [view, setView] = useState("list");
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedPlatformTool, setSelectedPlatformTool] = useState(null);

  if (view === "add-connector") return <AddConnectorFlow onBack={() => setView("list")} />;
  if (view === "add-tool") return <AddToolFlow onBack={() => setView("list")} />;
  if (view === "tool-detail") {
    if (selectedTool === "bluesky") return <BlueSkyDetail onBack={() => { setView("list"); setSelectedTool(null); }} />;
    if (selectedTool === "telegram") return <TelegramDetail onBack={() => { setView("list"); setSelectedTool(null); }} />;
    if (selectedTool === "google") return <GoogleDetail onBack={() => { setView("list"); setSelectedTool(null); }} />;
    if (selectedTool === "linkedin") return <LinkedInDetail onBack={() => { setView("list"); setSelectedTool(null); }} />;
    if (selectedTool === "solana") return <SolanaDetail onBack={() => { setView("list"); setSelectedTool(null); }} />;
  }
  if (view === "platform-tool-detail") {
    if (selectedPlatformTool === "meeting-facilitator") return <MeetingFacilitatorDetail onBack={() => { setView("list"); setSelectedPlatformTool(null); }} />;
    if (selectedPlatformTool === "pattern-tracker") return <PatternTrackerDetail onBack={() => { setView("list"); setSelectedPlatformTool(null); }} />;
    if (selectedPlatformTool === "ritual-timer") return <RitualTimerDetail onBack={() => { setView("list"); setSelectedPlatformTool(null); }} />;
  }
  return (
    <PlatformToolsList
      onSelectTool={id => { setSelectedTool(id); setView("tool-detail"); }}
      onAddConnector={() => setView("add-connector")}
      onAddTool={() => setView("add-tool")}
      onSelectPlatformTool={id => { setSelectedPlatformTool(id); setView("platform-tool-detail"); }}
    />
  );
};

// ─── Add Connector flow ────────────────────────────────────────────────────────

const AddConnectorFlow = ({ onBack }) => {
  const [catFilter, setCatFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [authStep, setAuthStep] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [connectorName, setConnectorName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const filtered = catFilter === "All" ? AVAILABLE_CONNECTORS : AVAILABLE_CONNECTORS.filter(c => c.category === catFilter);

  if (connected && selected) {
    const conn = AVAILABLE_CONNECTORS.find(c => c.id === selected);
    return (
      <div style={{ maxWidth: 560 }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <RenderIcon icon={conn.icon} size={56} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Connected!</div>
          <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 28 }}>{conn.name} is now connected to Platform Core. Creators can start adding it to their cycles.</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Btn onClick={onBack}>Back to Tools & Connectors</Btn>
            <Btn variant="secondary" onClick={() => { setConnected(false); setSelected(null); setAuthStep(false); setApiKey(""); }}>Add Another</Btn>
          </div>
        </div>
      </div>
    );
  }

  if (authStep && selected) {
    const conn = AVAILABLE_CONNECTORS.find(c => c.id === selected);
    return (
      <div style={{ maxWidth: 560 }}>
        <button onClick={() => setAuthStep(false)} style={{ background: "none", border: "none", color: colors.accent, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: "inherit" }}>← Back to connector list</button>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 14 }}>
            <RenderIcon icon={conn.icon} size={32} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{conn.name}</div>
              <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{conn.desc}</div>
            </div>
          </div>
          <div style={{ padding: "20px 24px" }}>
            {conn.auth === "OAuth" && (
              <div>
                <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, lineHeight: 1.6 }}>You'll be redirected to {conn.name} to authorize Kinship. We'll request the minimum permissions needed.</div>
                <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8, marginBottom: 20, fontSize: 12, color: colors.blue }}>
                  🔒 Kinship will request read and write access to your {conn.name} account on behalf of Platform Core.
                </div>
                <Btn onClick={() => { setConnecting(true); setTimeout(() => { setConnecting(false); setConnected(true); }, 1600); }}>
                  {connecting ? "Connecting..." : `Connect with ${conn.name}`}
                </Btn>
              </div>
            )}
            {conn.auth === "API Key" && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Display Name</label>
                  <input value={connectorName} onChange={e => setConnectorName(e.target.value)} placeholder={`e.g. ${conn.name} Production`}
                    style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>API Key</label>
                  <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste your API key here"
                    style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
                  <div style={{ fontSize: 11, color: colors.textDim, marginTop: 6 }}>Keys are encrypted at rest and never shown again after saving.</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => { setConnecting(true); setTimeout(() => { setConnecting(false); setConnected(true); }, 1200); }}>
                    {connecting ? "Verifying..." : "Verify & Connect"}
                  </Btn>
                  <Btn variant="secondary" onClick={() => setAuthStep(false)}>Cancel</Btn>
                </div>
              </div>
            )}
            {conn.auth === "Webhook URL" && (
              <div>
                <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, lineHeight: 1.6 }}>Copy the webhook URL below and paste it into your external system's outbound webhook settings.</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Your Webhook Endpoint</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, fontFamily: "monospace", fontSize: 12, color: colors.textMuted }}>
                      https://api.kinship.systems/hooks/platform/incoming/abc123xyz
                    </div>
                    <Btn variant="secondary">Copy</Btn>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Signing Secret (optional)</label>
                  <input placeholder="From your external service"
                    style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => { setConnecting(true); setTimeout(() => { setConnecting(false); setConnected(true); }, 900); }}>Save Webhook</Btn>
                  <Btn variant="secondary" onClick={() => setAuthStep(false)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Add Connector" subtitle="Connect an external service to the platform. Connected services are available to all creators." onBack={onBack} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {connectorCategories.map(c => <FilterPill key={c} label={c} active={catFilter === c} onClick={() => setCatFilter(c)} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {filtered.map(conn => <AvailConnItem key={conn.id} conn={conn} onSelect={id => { setSelected(id); setAuthStep(true); }} authColors={authColors} />)}
      </div>
    </div>
  );
};

const AddToolFlow = ({ onBack }) => {
  const [toolType, setToolType] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Communication");
  const [inputType, setInputType] = useState("transcript");
  const [addTo, setAddTo] = useState({ Cycle: true, Scene: true });
  const [heartsSelected, setHeartsSelected] = useState(["H"]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const builtinTools = [
    { icon: "🎙️", name: "Meeting Facilitator", desc: "Real-time communication guidance during live sessions", available: false },
    { icon: "lucide:activity", name: "Pattern Tracker", desc: "Surfaces recurring interaction patterns across member sessions", available: false },
    { icon: "lucide:timer", name: "Ritual Timer", desc: "Timed ritual structures with configurable pacing and cues", available: false },
    { icon: "lucide:heart-pulse", name: "Mood Barometer", desc: "Tracks emotional temperature of a group in real time", available: true },
    { icon: "lucide:brain", name: "Reflection Prompter", desc: "Injects guided reflection questions at configured session moments", available: true },
    { icon: "📊", name: "Engagement Lens", desc: "Tracks participation balance and surfaces quieter voices", available: true },
  ];
  const categories = ["Communication", "Facilitation", "Analytics", "Learning", "Commerce", "Wellness"];
  const inputTypes = [
    { id: "transcript",  label: "📝 Transcript / Text", hint: "Reads live text, captions, or transcripts from sessions" },
    { id: "audio",       label: "🎤 Audio Stream",       hint: "Analyzes live audio — requires mic permission" },
    { id: "event-hook",  label: "⚡ Event Hook",          hint: "Responds to platform events (member joins, scene change, checkpoint reached)" },
    { id: "schedule",    label: "⏰ Scheduled",           hint: "Runs on a timer or at configured moments in a session" },
    { id: "api-call",    label: "🔌 API Call",            hint: "Triggered by an external system sending data to a webhook" },
  ];

  if (saved) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛠️</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Tool Created</div>
        <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 28 }}>"{name}" is now available for creators to add to their cycles and scenes. You can configure it further from the tool detail page.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn onClick={onBack}>Back to Tools & Connectors</Btn>
          <Btn variant="secondary" onClick={() => { setSaved(false); setName(""); setDesc(""); setToolType(null); }}>Create Another</Btn>
        </div>
      </div>
    );
  }

  if (!toolType) {
    return (
      <div>
        <PageHeader title="Add Platform Tool" subtitle="Add an existing built-in tool or create a custom one for your platform" onBack={onBack} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { id: "builtin", icon: "📦", label: "Built-in Tool", desc: "Enable an existing Kinship tool — Meeting Facilitator, Pattern Tracker, Ritual Timer, and more. Fully configured, ready to use." },
            { id: "custom",  icon: "🛠️", label: "Custom Tool",   desc: "Define a new tool specific to your platform — set its inputs, HEARTS alignment, trigger logic, and where creators can add it." },
          ].map(opt => <ToolTypeCard key={opt.id} opt={opt} onSelect={setToolType} />)}
        </div>
      </div>
    );
  }

  if (toolType === "builtin") {
    return (
      <div>
        <PageHeader title="Enable Built-in Tool" subtitle="Choose a Kinship tool to make available across your platform" onBack={() => setToolType(null)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {builtinTools.map((t, i) => <BuiltinToolRow key={i} t={t} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Create Custom Tool" subtitle="Define a new platform-wide tool creators can add to cycles and scenes" onBack={() => setToolType(null)} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Identity</div>
          <Field label="Tool Name" hint="What is this tool called? Keep it short and descriptive.">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Meeting Facilitator"
              style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
          </Field>
          <div style={{ marginTop: 14 }}>
            <Field label="Description" hint="One or two sentences on what this tool does and when it's useful.">
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="e.g. Listens to live meetings and offers real-time guidance on communication patterns and HEARTS alignment."
                style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Category" hint="Used to organize tools in the creator's library.">
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit" }}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Input Source</div>
          <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>How does this tool receive information to act on?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {inputTypes.map(it => (
              <div key={it.id} onClick={() => setInputType(it.id)}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: inputType === it.id ? colors.accent + "10" : colors.bg, border: `1px solid ${inputType === it.id ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${inputType === it.id ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {inputType === it.id && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: inputType === it.id ? colors.text : colors.textMuted, fontWeight: 500 }}>{it.label}</div>
                  <div style={{ fontSize: 11, color: colors.textDim }}>{it.hint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>HEARTS Alignment</div>
          <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Which HEARTS facets does this tool monitor or support?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["H","E","A","R","T","Si","So"].map(f => {
              const on = heartsSelected.includes(f);
              return (
                <div key={f} onClick={() => setHeartsSelected(prev => on ? prev.filter(x => x !== f) : [...prev, f])}
                  style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, cursor: "pointer", background: on ? colors.accent + "20" : "rgba(255,255,255,0.04)", border: `1px solid ${on ? colors.accent + "60" : colors.border}`, color: on ? colors.accent : colors.textDim }}>
                  {f}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Where Can Creators Add It?</div>
          <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>Choose the contexts where this tool can be attached.</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Cycle", "Scene", "Actor"].map(ctx => {
              const on = addTo[ctx];
              return (
                <div key={ctx} onClick={() => setAddTo(prev => ({ ...prev, [ctx]: !prev[ctx] }))}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: on ? colors.accent + "10" : colors.bg, border: `1px solid ${on ? colors.accent + "50" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: on ? colors.text : colors.textMuted, fontWeight: on ? 600 : 400 }}>{ctx}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setSaved(true); }, 1000); }}>
            {saving ? "Creating..." : "Create Tool"}
          </Btn>
          <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Prompts sub-components ───────────────────────────────────────────────────

const PromptContentTabs = ({ mode, setMode }) => {
  const tabs = [
    { id: "build",  label: "🔧 Build",         hint: "Structured fields" },
    { id: "type",   label: "✍️ Type / Paste",   hint: "Direct editing" },
    { id: "assist", label: "✨ AI Assist",       hint: "Prompt your edits" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 20, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
      {tabs.map((m, i) => (
        <button key={m.id} onClick={() => setMode(m.id)}
          style={{ flex: 1, padding: "12px 8px", background: mode === m.id ? colors.accent + "18" : "transparent", border: "none", borderRight: i < tabs.length - 1 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>
          <div style={{ fontSize: 13, fontWeight: mode === m.id ? 600 : 400, color: mode === m.id ? colors.accent : colors.textMuted }}>{m.label}</div>
          <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>{m.hint}</div>
        </button>
      ))}
    </div>
  );
};

const BuildMode = ({ fields, setFields }) => {
  const sections = [
    { key: "role",         label: "Role / Persona",         hint: "What kind of character or system is this? What is its primary purpose?",          placeholder: "e.g. You are a wise elder guide in the Mountain Temple cycle..." },
    { key: "context",      label: "Context & Background",   hint: "Relevant background the actor should always have in mind.",                        placeholder: "e.g. The Mountain Temple is a meditation-focused environment..." },
    { key: "instructions", label: "Core Instructions",      hint: "What should this actor do? How should it behave?",                                 placeholder: "e.g. Always greet members warmly. Ask open questions before offering advice..." },
    { key: "format",       label: "Output Format",          hint: "How should responses be structured, toned, or formatted?",                         placeholder: "e.g. Keep responses to 2-4 sentences unless the member asks for elaboration..." },
    { key: "constraints",  label: "Constraints & Rules",    hint: "Hard limits — things this actor must never do.",                                    placeholder: "e.g. Never claim to be human. Never diagnose medical or psychological conditions..." },
    { key: "examples",     label: "Examples (optional)",    hint: "Sample exchanges that demonstrate the intended behavior.",                           placeholder: "Member: I've been feeling really stuck lately.\nActor: That sounds heavy to carry. What does 'stuck' feel like for you right now?" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {sections.map(s => (
        <Field key={s.key} label={s.label} hint={s.hint}>
          <textarea value={fields[s.key] || ""} onChange={e => setFields({ ...fields, [s.key]: e.target.value })} placeholder={s.placeholder} rows={3}
            style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6, minHeight: 72 }} />
        </Field>
      ))}
    </div>
  );
};

const TypeMode = ({ value, onChange }) => (
  <Field label="Prompt Content" hint="Write or paste your full system prompt here. You can also edit content generated via AI Assist.">
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={"You are a Kinship actor on the Kinship platform...\n\nYour role is to...\n\nAlways...\nNever..."} rows={18}
      style={{ width: "100%", padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.7, fontFamily: "'Inter', monospace" }} />
  </Field>
);

const AIAssistMode = ({ existingContent, isNew }) => {
  const [instruction, setInstruction] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const suggestions = isNew
    ? ["Write a system prompt for a meditation guide actor", "Create safety guardrails for youth-focused interactions", "Build a prompt based on my uploaded documents"]
    : ["Make the tone warmer and less clinical", "Add a section about crisis de-escalation", "Strengthen the constraints around member privacy", "Rewrite to integrate HEARTS framework language"];
  return (
    <div>
      <div style={{ padding: "16px 18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 10, letterSpacing: 0.4, textTransform: "uppercase" }}>Describe what you want</div>
        <textarea value={instruction} onChange={e => setInstruction(e.target.value)}
          placeholder={isNew ? "Describe the system prompt you want to create..." : "Describe how you'd like to change this prompt..."}
          rows={4} style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setInstruction(s)}
              style={{ padding: "5px 10px", background: colors.accent + "12", border: `1px solid ${colors.accent}33`, borderRadius: 6, color: colors.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn onClick={() => { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200); }}>
            {generating ? "Generating..." : isNew ? "Generate Prompt" : "Generate Revision"}
          </Btn>
          {!isNew && <Btn variant="secondary">Show current prompt for reference</Btn>}
        </div>
      </div>
      {generated && (
        <div style={{ border: `1px solid ${colors.green}44`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", background: colors.green + "18", borderBottom: `1px solid ${colors.green}33`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: colors.green }}>{isNew ? "Generated Prompt" : "Suggested Revision"}</span>
            <span style={{ fontSize: 11, color: colors.textDim }}>Review before applying</span>
          </div>
          <div style={{ padding: "14px 16px", background: colors.surface }}>
            <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Inter', monospace", maxHeight: 280, overflowY: "auto" }}>
              {isNew
                ? "You are a meditation guide within the Mountain Temple cycle of the Kinship platform. You create and hold space for members to develop inner awareness, emotional regulation, and reflective practice.\n\nYour tone is warm, unhurried, and grounded. You speak simply and with care. You never rush a member through a difficult moment.\n\nCore behaviors:\n- Begin each interaction by checking in with the member's current state\n- Use open questions rather than prescriptive advice\n- Honor silence and pauses as productive\n- Draw on the HEARTS framework, especially Harmony and Synthesis Inward\n\nConstraints:\n- Never diagnose psychological conditions\n- Never claim to replace professional therapy\n- If a member shows signs of acute distress, follow platform escalation protocols"
                : existingContent + "\n\n--- REVISION BELOW ---\n\n[The revised version would appear here with the requested changes highlighted.]"}
            </div>
          </div>
          <div style={{ padding: "10px 16px", background: colors.surface, borderTop: `1px solid ${colors.borderSubtle}`, display: "flex", gap: 8 }}>
            <Btn size="sm">Accept & Apply to Type/Paste</Btn>
            <Btn variant="secondary" size="sm">Refine Further</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setGenerated(false)}>Discard</Btn>
          </div>
        </div>
      )}
      {!generated && !generating && (
        <InfoBox color={colors.blue}>
          {isNew
            ? "AI Assist can generate a full system prompt from your description and uploaded documents. After generating, you can accept it into the Type/Paste tab for further manual editing."
            : "AI Assist reads the current prompt content plus any uploaded source documents, then generates a revised version based on your instructions. You review and accept before anything changes."}
        </InfoBox>
      )}
    </div>
  );
};

const SourceDocuments = ({ files, setFiles }) => {
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(files.length > 0);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: files.length > 0 ? colors.accent + "10" : colors.surface, border: `1px solid ${files.length > 0 ? colors.accent + "33" : colors.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
        <span style={{ fontSize: 14 }}>📎</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: colors.textMuted, flex: 1, textAlign: "left" }}>Source Documents {files.length > 0 && `(${files.length})`}</span>
        <span style={{ fontSize: 12, color: colors.textDim }}>{files.length === 0 ? "Upload reference docs" : expanded ? "▾" : "▸"}</span>
      </button>
      {(expanded || files.length === 0) && (
        <div style={{ marginTop: 8 }}>
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFiles([...files, ...Array.from(e.dataTransfer.files).map(f => f.name)]); setExpanded(true); }}
            style={{ border: `2px dashed ${dragging ? colors.accent : colors.border}`, borderRadius: 9, padding: files.length > 0 ? "16px" : "28px 16px", textAlign: "center", background: dragging ? colors.accent + "08" : colors.surface, transition: "all 0.15s", cursor: "pointer" }}>
            {files.length === 0 && <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>}
            <div style={{ fontSize: 12, color: colors.textMuted }}>Drop files here or <button onClick={() => { setFiles([...files, "uploaded-doc.pdf"]); setExpanded(true); }} style={{ background: "none", border: "none", color: colors.accent, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>browse</button></div>
            <div style={{ fontSize: 11, color: colors.textDim, marginTop: 3 }}>PDF, DOCX, TXT, MD — contents feed into Build and AI Assist</div>
          </div>
          {files.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: colors.surface, border: `1px solid ${colors.green}33`, borderRadius: 7 }}>
                  <span style={{ fontSize: 14 }}>📄</span>
                  <span style={{ flex: 1, fontSize: 12, color: colors.textMuted }}>{f}</span>
                  <StatusPill status="Ingested" />
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: colors.textDim, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PromptEditor = ({ prompt, onBack, isNew }) => {
  const [name, setName] = useState(prompt?.name || "");
  const [scope, setScope] = useState(prompt?.scope || "All cycles · All actors");
  const [contentMode, setContentMode] = useState(isNew ? "build" : "type");
  const [buildFields, setBuildFields] = useState({
    role: "", context: "", instructions: "", format: "", constraints: "", examples: "",
    ...(prompt?.id === "safety" ? { role: "You are a Kinship actor operating within the Kinship platform. You must always maintain safety, respect, and care in all interactions.", constraints: "Never provide harmful, dangerous, or deceptive information. Prioritize member wellbeing above engagement metrics.\n\nIf a member appears to be in distress, acknowledge their feelings and gently suggest appropriate support resources." } : {}),
    ...(prompt?.id === "hearts" ? { role: "Ground all interactions in the HEARTS framework.", context: "H — Harmony · E — Empowerment · A — Artistry · R — Reason · T — Trust · S (In) — Synthesis Inward · S (Out) — Synthesis Outward", instructions: "Weight your responses according to this actor's HEARTS facet configuration." } : {}),
  });
  const [typeContent, setTypeContent] = useState(prompt?.content || "");
  const [uploadFiles, setUploadFiles] = useState([]);

  return (
    <div style={{ maxWidth: 700 }}>
      <PageHeader
        title={isNew ? "New System Prompt" : `Edit: ${prompt.name}`}
        subtitle={isNew ? "Add a prompt that all actors across all cycles will inherit" : "Changes will apply to all actors on next sync"}
        onBack={onBack}
      >
        {!isNew && <StatusPill status={prompt.status} />}
      </PageHeader>
      <SectionDivider label="Identity" />
      <Field label="Prompt Name">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Emotional Support Guidelines" />
      </Field>
      <Field label="Scope" hint="Which cycles and actors inherit this prompt.">
        <select value={scope} onChange={e => setScope(e.target.value)}
          style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.textMuted, fontSize: 13, outline: "none" }}>
          <option>All cycles · All actors</option>
          <option>All cycles · Specific actor types</option>
          <option>Selected cycles only</option>
        </select>
      </Field>
      <SectionDivider label="Source Documents" />
      <SourceDocuments files={uploadFiles} setFiles={setUploadFiles} />
      <p style={{ fontSize: 11, color: colors.textDim, marginTop: 4, marginBottom: 8 }}>Uploaded documents are available as context for AI Assist and are appended to the compiled prompt.</p>
      <SectionDivider label="Prompt Content" />
      <PromptContentTabs mode={contentMode} setMode={setContentMode} />
      {contentMode === "build" && <BuildMode fields={buildFields} setFields={setBuildFields} />}
      {contentMode === "type" && <TypeMode value={typeContent} onChange={setTypeContent} />}
      {contentMode === "assist" && <AIAssistMode existingContent={typeContent} isNew={isNew} />}
      {!isNew && (
        <>
          <SectionDivider label="Usage" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
            {[
              { label: "Cycles using this prompt",   value: "All (3 active)" },
              { label: "Actors inheriting this prompt", value: "14 actors" },
              { label: "Last modified",              value: prompt.lastEdited },
              { label: "Overrides at cycle level",   value: "None — augmented by 2 cycles" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", padding: "9px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, gap: 16 }}>
                <span style={{ fontSize: 12, color: colors.textDim, width: 220, flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>{isNew ? "Create Prompt" : "Save Changes"}</Btn>
        <Btn variant="secondary">Cancel</Btn>
        {!isNew && <Btn variant="secondary">Preview Compiled Prompt</Btn>}
      </div>
      {!isNew && (
        <DangerZone>
          <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
            Deleting this prompt removes it from all cycles immediately. Actors that relied on it will fall back to their individual configurations.
          </p>
          <Btn danger>Delete Prompt</Btn>
        </DangerZone>
      )}
    </div>
  );
};

// ── Extracted sub-component: fixes hooks-in-map violation #1 ──────────────────
const PromptListRow = ({ p, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={p.icon} size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{p.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{p.scope} · Edited {p.lastEdited}</div>
      </div>
      <StatusPill status={p.status} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

export const PlatformPromptsContent = () => {
  const [view, setView] = useState(null);

  if (view === "new") return <PromptEditor isNew onBack={() => setView(null)} />;
  const editing = PROMPTS.find(p => p.id === view);
  if (editing) return <PromptEditor prompt={editing} onBack={() => setView(null)} />;

  return (
    <div>
      <PageHeader title="Platform System Prompts" subtitle="Base-layer prompts inherited by all cycles. These can be augmented but not overridden.">
        <Btn onClick={() => setView("new")}>+ Add New</Btn>
      </PageHeader>
      <InfoBox color={colors.blue}>
        ℹ️  Cycle-level prompts extend these — they add context and behavior on top. Creators cannot remove or contradict what's set here.
      </InfoBox>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PROMPTS.map(p => <PromptListRow key={p.id} p={p} onClick={() => setView(p.id)} />)}
      </div>
    </div>
  );
};

// ─── Actors ───────────────────────────────────────────────────────────────────

// ── Extracted sub-component: fixes hooks-in-map violation #2 ──────────────────
const ActorTypeCard = ({ t, actorType, setActorType }) => {
  const [hov, setHov] = useState(false);
  const on = actorType === t.id;
  return (
    <div onClick={() => setActorType(t.id)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "14px 16px", background: on ? colors.accent + "12" : hov ? colors.surfaceHover : colors.surface, border: `1px solid ${on ? colors.accent + "60" : colors.border}`, borderRadius: 9, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={t.icon} size={22} style={{ marginBottom: 6 }} />
      <div style={{ fontSize: 13, fontWeight: 600, color: on ? colors.accent : colors.text, marginBottom: 3 }}>{t.id}</div>
      <div style={{ fontSize: 11, color: colors.textDim }}>{t.desc}</div>
    </div>
  );
};

const ActorEditor = ({ actor, onBack, isNew }) => {
  const [name, setName] = useState(actor?.name || "");
  const [emoji, setEmoji] = useState(actor?.emoji || "🎙️");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [actorType, setActorType] = useState(actor?.type || null);
  const [model, setModel] = useState(actor?.model || "claude-sonnet-4-5-20250929");
  const [memory, setMemory] = useState(actor?.memory || "Persistent");
  const [role, setRole] = useState(actor?.role || "");
  const [persona, setPersona] = useState(actor?.persona || "");
  const [activeFacets, setActiveFacets] = useState(actor?.facets || []);
  const [canOrchestrate, setCanOrchestrate] = useState(actor?.canOrchestrate ?? false);
  const [promptTab, setPromptTab] = useState("type");
  const [reachable, setReachable] = useState({
    bluesky:  actor?.tools?.includes("🦋") ?? false,
    telegram: actor?.tools?.includes("✈️") ?? false,
    email:    actor?.tools?.includes("📧") ?? false,
    inapp: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allFacets = ["H","E","A","R","T","Si","So"];
  const toggleFacet = (f) => setActiveFacets(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  const facetLabels = { H: "Harmony", E: "Empowerment", A: "Artistry", R: "Reason", T: "Trust", Si: "Synthesis In", So: "Synthesis Out" };

  if (saved && isNew) return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{name || "New Actor"} created</div>
      <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 28 }}>This actor is now available across all cycles. Creators can reference it from their cycle settings.</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Btn onClick={onBack}>Back to Platform Actors</Btn>
        <Btn variant="secondary" onClick={() => { setSaved(false); setName(""); setEmoji("🎙️"); setActorType(null); }}>Create Another</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader
        title={isNew ? "New Platform Actor" : `Edit: ${actor.name}`}
        subtitle={isNew ? "Platform actors are available across all cycles and cannot be scoped to a single experience" : "Changes apply platform-wide"}
        onBack={onBack}
      >
        {!isNew && <StatusPill status={actor.status} />}
        {actor?.locked && (
          <span style={{ fontSize: 11, color: colors.warning, background: colors.warning + "18", border: `1px solid ${colors.warning}33`, padding: "3px 10px", borderRadius: 99 }}>⚡ System Actor</span>
        )}
      </PageHeader>

      {actor?.locked && (
        <InfoBox color={colors.warning}>
          ⚡ Platform Core is a system actor created automatically when the platform is initialized. Its core function cannot be removed, but persona, instructions, model, and channel access are all configurable.
        </InfoBox>
      )}

      {!isNew && actor?.stats && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
          {[
            { label: "Messages Sent",   value: actor.stats.messages.toLocaleString() },
            { label: "Active Channels", value: actor.stats.activeChannels },
            { label: "Last Active",     value: actor.stats.lastActive },
            { label: "Cycles Serving",  value: actor.stats.cyclesServing },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</div>
              <div style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {isNew && (
        <>
          <SectionDivider label="Actor Type" />
          <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Choose the type that best describes this actor's primary role. This shapes defaults and how creators can use it.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {ACTOR_TYPES.map(t => <ActorTypeCard key={t.id} t={t} actorType={actorType} setActorType={setActorType} />)}
          </div>
        </>
      )}

      <SectionDivider label="Identity" />
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Avatar</div>
          <div onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ width: 54, height: 54, borderRadius: 14, background: colors.surface, border: `1px solid ${showEmojiPicker ? colors.accent : colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, cursor: "pointer" }}>
            {emoji}
          </div>
          {showEmojiPicker && (
            <div style={{ position: "absolute", zIndex: 10, background: colors.surfaceHover, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 10, display: "flex", flexWrap: "wrap", gap: 4, width: 200, marginTop: 4 }}>
              {EMOJIS.map(e => (
                <span key={e} onClick={() => { setEmoji(e); setShowEmojiPicker(false); }} style={{ fontSize: 20, cursor: "pointer", padding: 4, borderRadius: 6, background: emoji === e ? colors.accent + "20" : "transparent" }}>{e}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Name">
            <Input value={name} onChange={e => setName(e.target.value)} readOnly={actor?.locked} placeholder="e.g. Kaytee" />
          </Field>
        </div>
      </div>
      <Field label="Role" hint="One sentence on what this actor does across the platform.">
        <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Primary guide and support system across all cycles" />
      </Field>

      <SectionDivider label="Model & Memory" />
      <Field label="Language Model" hint="The AI model powering this actor's responses.">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MODEL_OPTIONS.map(m => (
            <div key={m.value} onClick={() => setModel(m.value)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: model === m.value ? colors.accent + "10" : colors.surface, border: `1px solid ${model === m.value ? colors.accent + "50" : colors.border}`, borderRadius: 7, cursor: "pointer" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${model === m.value ? colors.accent : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {model === m.value && <div style={{ width: 6, height: 6, borderRadius: 3, background: colors.accent }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: model === m.value ? colors.text : colors.textMuted }}>{m.label}</div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{m.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </Field>
      <div style={{ marginTop: 14 }}>
        <Field label="Memory Scope" hint="How long this actor retains context about members.">
          <div style={{ display: "flex", gap: 8 }}>
            {MEMORY_OPTIONS.map(m => (
              <div key={m.value} onClick={() => setMemory(m.value)}
                style={{ flex: 1, padding: "10px 12px", background: memory === m.value ? colors.accent + "12" : colors.surface, border: `1px solid ${memory === m.value ? colors.accent + "60" : colors.border}`, borderRadius: 8, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: memory === m.value ? colors.accent : colors.textMuted, marginBottom: 3 }}>{m.value}</div>
                <div style={{ fontSize: 10, color: colors.textDim }}>{m.hint}</div>
              </div>
            ))}
          </div>
        </Field>
      </div>

      <SectionDivider label="HEARTS Facets" />
      <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Select the HEARTS dimensions this actor is tuned to. These shape tone, priorities, and how it detects alignment gaps.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {allFacets.map(f => {
          const active = activeFacets.includes(f);
          return (
            <div key={f} onClick={() => toggleFacet(f)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", background: active ? colors.accent + "18" : colors.surface, border: `1px solid ${active ? colors.accent : colors.border}`, borderRadius: 9, cursor: "pointer", transition: "all 0.15s", minWidth: 64 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: active ? colors.accent : colors.textDim }}>{f}</span>
              <span style={{ fontSize: 10, color: active ? colors.accent : colors.textDim, textAlign: "center" }}>{facetLabels[f]}</span>
            </div>
          );
        })}
      </div>

      <SectionDivider label="Orchestration" />
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div onClick={() => setCanOrchestrate(!canOrchestrate)}
            style={{ width: 36, height: 20, borderRadius: 10, background: canOrchestrate ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0, marginTop: 2 }}>
            <div style={{ position: "absolute", top: 3, left: canOrchestrate ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 2 }}>Can orchestrate other actors</div>
            <div style={{ fontSize: 12, color: colors.textDim }}>When enabled, this actor can route members to other actors, trigger tools, and coordinate activity across the platform. Requires Wizard approval to activate in production.</div>
          </div>
        </div>
      </div>

      <SectionDivider label="System Prompt" />
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}` }}>
          {[["type", "✍️ Type / Paste"], ["assist", "✨ AI Assist"], ["link", "🔗 Link Existing"]].map(([id, label], i) => (
            <button key={id} onClick={() => setPromptTab(id)}
              style={{ flex: 1, padding: "11px 8px", background: promptTab === id ? colors.accent + "14" : "transparent", border: "none", borderRight: i < 2 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ fontSize: 12, fontWeight: promptTab === id ? 600 : 400, color: promptTab === id ? colors.accent : colors.textMuted }}>{label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: 16 }}>
          {promptTab === "type" && (
            <textarea value={isNew ? persona : `${actor?.persona || ""}\n\n${actor?.instructions || ""}\n\nConstraints:\n${actor?.constraints || ""}`}
              onChange={() => {}} rows={8}
              placeholder={"You are [Name] — a platform actor on Kinship...\n\nYour role is to...\n\nAlways...\nNever..."}
              style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, resize: "vertical", lineHeight: 1.7, fontFamily: "'Inter', monospace", boxSizing: "border-box" }} />
          )}
          {promptTab === "assist" && (
            <div>
              <textarea rows={3} placeholder={isNew ? "Describe the actor's purpose, voice, and key behaviors — Kaytee will draft a system prompt..." : `Describe how to revise ${actor?.name}'s system prompt...`}
                style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {(isNew
                  ? ["Write a prompt for a ceremonial guide", "Create a Bridge actor for social media", "Draft a trauma-informed facilitation prompt"]
                  : ["Make the tone warmer", "Strengthen the constraints section", "Add orchestration guidance"]
                ).map((s, i) => (
                  <button key={i} style={{ padding: "4px 10px", background: colors.accent + "12", border: `1px solid ${colors.accent}33`, borderRadius: 6, color: colors.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                ))}
              </div>
              <Btn>Generate Prompt</Btn>
            </div>
          )}
          {promptTab === "link" && (
            <div>
              <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>Link an existing system prompt from Platform Settings. Changes to the prompt there will automatically apply to this actor.</p>
              <select style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", marginBottom: 10 }}>
                <option value="">— Select a system prompt —</option>
                <option value="safety">Global Safety & Guardrails</option>
                <option value="hearts">HEARTS Framework Base</option>
                <option value="actor-defaults">Actor Behavioral Defaults</option>
              </select>
              {!isNew && actor?.systemPromptId && (
                <div style={{ padding: "10px 14px", background: colors.green + "08", border: `1px solid ${colors.green}33`, borderRadius: 8, fontSize: 12, color: colors.green }}>
                  ✓ Currently linked to "<strong>{actor.systemPromptId === "safety" ? "Global Safety & Guardrails" : "Actor Behavioral Defaults"}</strong>"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SectionDivider label="Channel Access" />
      <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 12 }}>External channels this actor can reach members through. Each requires its platform connector to be active.</p>
      <Toggle label="BlueSky" enabled={reachable.bluesky} onChange={v => setReachable({...reachable, bluesky: v})} hint="Post, reply, and DM via the connected BlueSky account" />
      <Toggle label="Telegram" enabled={reachable.telegram} onChange={v => setReachable({...reachable, telegram: v})} hint="Send and receive messages via the connected Telegram bot" />
      <Toggle label="Email (Google Workspace)" enabled={reachable.email} onChange={v => setReachable({...reachable, email: v})} hint="Send and receive email via the connected Google account" />
      <Toggle label="In-app (always on)" enabled={true} onChange={() => {}} hint="Always available inside Kinship Today — cannot be disabled" />

      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setSaved(true); }, 900); }}>
          {saving ? (isNew ? "Creating..." : "Saving...") : isNew ? "Create Actor" : "Save Changes"}
        </Btn>
        <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
      </div>

      {!actor?.locked && !isNew && (
        <DangerZone>
          <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
            Removing this platform actor will immediately end all active conversations it is handling across all cycles.
          </p>
          <Btn danger>Remove Actor</Btn>
        </DangerZone>
      )}
    </div>
  );
};

// ── Extracted sub-component: fixes hooks-in-map violation #3 ──────────────────
const ActorListRow = ({ a, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: colors.accent + "18", border: `1px solid ${colors.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <RenderIcon icon={a.emoji} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{a.name}</span>
          {a.locked && <span style={{ fontSize: 10, color: colors.warning, background: colors.warning + "18", padding: "2px 7px", borderRadius: 4 }}>⚡ System</span>}
          <span style={{ fontSize: 10, color: colors.purple, background: colors.purple + "14", padding: "2px 7px", borderRadius: 4 }}>{a.type}</span>
        </div>
        <div style={{ fontSize: 12, color: colors.textDim }}>{a.role}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 5, fontSize: 11, color: colors.textDim }}>
          <span>🌐 {a.scenes}</span>
          <span>📡 {a.reachable}</span>
          {a.stats && <span style={{ color: colors.textDim }}>💬 {a.stats.messages.toLocaleString()} msgs</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, marginRight: 8, flexWrap: "wrap", maxWidth: 120, justifyContent: "flex-end" }}>
        {a.facets.map((f, j) => (
          <span key={j} style={{ fontSize: 9, fontWeight: 700, width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: colors.accent + "20", color: colors.accent, border: `1px solid ${colors.accent}30` }}>{f}</span>
        ))}
      </div>
      <StatusPill status={a.status} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

export const PlatformActorsContent = () => {
  const [view, setView] = useState(null);

  if (view === "new") return <ActorEditor isNew onBack={() => setView(null)} />;
  const editing = PLATFORM_ACTORS.find(a => a.id === view);
  if (editing) return <ActorEditor actor={editing} onBack={() => setView(null)} />;

  return (
    <div>
      <PageHeader title="Platform Actors" subtitle="Actors that operate across all cycles — not scoped to any one experience.">
        <Btn onClick={() => setView("new")}>+ New Actor</Btn>
      </PageHeader>
      <InfoBox color={colors.blue}>
        ℹ️ Platform actors are available in every cycle. Creators can reference them from their cycle settings but cannot modify them.
      </InfoBox>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PLATFORM_ACTORS.map(a => <ActorListRow key={a.id} a={a} onClick={() => setView(a.id)} />)}
      </div>
    </div>
  );
};

// ─── Users ────────────────────────────────────────────────────────────────────

const MemberDetail = ({ user, onBack }) => {
  const [tab, setTab] = useState("profile");
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [notes, setNotes] = useState(user.notes || "");
  const [warnMsg, setWarnMsg] = useState("");
  const [showWarnBox, setShowWarnBox] = useState(false);

  const rc = roleColors[role] || colors.blue;
  const selectStyle = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.textMuted, fontSize: 13, outline: "none" };
  const actionRow = (icon, label, desc, btnLabel, btnColor, onClick) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
      <span style={{ width: 28, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}><RenderIcon icon={icon} size={16} /></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{label}</div>
        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 1 }}>{desc}</div>
      </div>
      <button onClick={onClick} style={{ padding: "5px 14px", borderRadius: 7, border: `1px solid ${btnColor}40`, background: btnColor + "14", color: btnColor, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{btnLabel}</button>
    </div>
  );
  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", background: tab === id ? colors.accent : "rgba(255,255,255,0.07)", color: tab === id ? "#fff" : colors.textMuted, fontSize: 12, fontWeight: tab === id ? 600 : 400, cursor: "pointer" }}>{label}</button>
  );
  const CYCLES_IN = ["Mountain Temple", "Ocean Depths", "Dark Forest"].slice(0, user.cycles);

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title={user.name} subtitle={`${user.email} · Joined ${user.joined}`} onBack={onBack} backLabel="Members">
        <StatusPill status={status} />
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22 }}>
        {[["Cycles", user.cycles], ["Messages", user.messages.toLocaleString()], ["Quests", user.quests], ["Warnings", user.warnings]].map(([label, val]) => (
          <div key={label} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 9, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: label === "Warnings" && user.warnings > 0 ? colors.warning : colors.accent }}>{val}</div>
            <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <TabBtn id="profile" label="Profile" />
        <TabBtn id="activity" label="Activity" />
        <TabBtn id="moderation" label="Moderation" />
        <TabBtn id="access" label="Access & Security" />
      </div>
      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="Account">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 5 }}>Role</div>
                <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                  <option>Visitor</option><option>Guest</option><option>Member</option><option>Creator</option><option>Moderator</option><option>Wizard</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 5 }}>Status</div>
                <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                  <option>Active</option><option>Pending</option><option>Suspended</option><option>Banned</option>
                </select>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Internal Notes">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Notes visible only to Wizards and Guides..." style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 12px", color: colors.textMuted, fontSize: 13, resize: "vertical", outline: "none" }} />
          </SectionCard>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn>Save Changes</Btn>
            <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
          </div>
        </div>
      )}
      {tab === "activity" && (
        <SectionCard title="Cycle Membership">
          {CYCLES_IN.length > 0 ? CYCLES_IN.map(c => (
            <div key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
              <span style={{ fontSize: 13, color: colors.textMuted }}>{c}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, background: "none", color: colors.textDim, cursor: "pointer" }}>View Progress</button>
                <button style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${colors.red}40`, background: colors.red + "10", color: colors.red, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          )) : <div style={{ fontSize: 13, color: colors.textDim }}>Not enrolled in any cycles.</div>}
          <div style={{ marginTop: 12 }}>
            <Btn variant="secondary">+ Enroll in a Cycle</Btn>
          </div>
        </SectionCard>
      )}
      {tab === "moderation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="Actions">
            {actionRow("lucide:alert-triangle", "Issue a Warning", "Send the member a formal warning message", "Send Warning", colors.warning, () => setShowWarnBox(w => !w))}
            {showWarnBox && (
              <div style={{ padding: "12px 0 4px" }}>
                <textarea value={warnMsg} onChange={e => setWarnMsg(e.target.value)} rows={3} placeholder="Describe the reason for the warning..." style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.warning}44`, borderRadius: 8, padding: "9px 12px", color: colors.textMuted, fontSize: 13, resize: "vertical", outline: "none" }} />
                <Btn style={{ marginTop: 8, background: colors.warning, border: "none" }}>Send Warning</Btn>
              </div>
            )}
            {actionRow("lucide:mail", "Send Direct Message", "Send a private message from the platform", "Message", colors.blue, () => {})}
            {actionRow("lucide:ban", "Suspend Account", "Immediately revokes access. Member can be reinstated.", user.status === "Suspended" ? "Reactivate Instead" : "Suspend", colors.warning, () => {})}
            {actionRow("lucide:hammer", "Ban Account", "Permanently blocks this account from the platform", "Ban", colors.red, () => {})}
            {actionRow("lucide:trash-2", "Delete Account", "Permanently removes all data. Cannot be undone.", "Delete", colors.red, () => {})}
          </SectionCard>
          {user.warnings > 0 && (
            <SectionCard title="Warning History">
              <div style={{ padding: "10px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: colors.warning }}>Warning #1</span>
                  <span style={{ fontSize: 11, color: colors.textDim }}>Oct 14, 2025</span>
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Community guideline violation: off-topic content in sacred space.</div>
              </div>
            </SectionCard>
          )}
        </div>
      )}
      {tab === "access" && (
        <SectionCard title="Security">
          {actionRow("lucide:key-round", "Reset Password", `Send a password reset link to ${user.email}`, "Send Reset", colors.blue, () => {})}
          {actionRow("lucide:smartphone", "Revoke Sessions", "Force sign-out from all devices immediately", "Revoke All", colors.warning, () => {})}
          {actionRow("lucide:lock", "Reset 2FA", "Clear any two-factor authentication setup", "Reset 2FA", colors.textMuted, () => {})}
          {actionRow("lucide:clipboard-list", "Export Data", "Download a full data export for this account", "Export", colors.textMuted, () => {})}
          <div style={{ padding: "12px 0 4px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7 }}>Login History</div>
            {[["2026-02-25 14:32", "Chrome · macOS", "San Francisco, CA"], ["2026-02-24 09:11", "iOS App", "San Francisco, CA"], ["2026-02-20 22:04", "Chrome · macOS", "San Francisco, CA"]].map(([time, client, loc]) => (
              <div key={time} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textDim, padding: "6px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                <span>{time}</span><span>{client}</span><span>{loc}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

const InviteGuestFlow = ({ onBack }) => {
  const [mode, setMode] = useState("single");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Guest");
  const [cycle, setCycle] = useState("");
  const [message, setMessage] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [sent, setSent] = useState(false);

  const inputStyle = { background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.border}`, borderRadius: 8, padding: "9px 12px", color: colors.text, fontSize: 13, width: "100%", outline: "none" };
  const labelStyle = { fontSize: 11, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 };
  const CYCLES_LIST = ["Mountain Temple", "Ocean Depths", "Dark Forest"];
  const bulkCount = bulkEmails.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean).length;

  if (sent) return (
    <div style={{ textAlign: "center", padding: "60px 40px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{mode === "bulk" ? "📨" : "✅"}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        {mode === "bulk" ? `${bulkCount} invitations queued` : "Invitation sent"}
      </div>
      <div style={{ fontSize: 13, color: colors.textDim, marginBottom: 32 }}>
        {mode === "bulk" ? `Each address will receive a personalized invitation as ${role}.` : `${email} will receive an invitation to join as ${role}.`}
        {cycle && ` They'll be added to ${cycle} upon accepting.`}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn onClick={() => { setSent(false); setEmail(""); setBulkEmails(""); setMessage(""); }}>Invite Another</Btn>
        <Btn variant="secondary" onClick={onBack}>Done</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 580 }}>
      <PageHeader title="Invite a Guest" subtitle="Guests become members once they accept and complete onboarding" onBack={onBack} backLabel="Members" />
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4 }}>
        {[["single", "Single Invite"], ["bulk", "Bulk Invite"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: mode === id ? colors.accent : "transparent", color: mode === id ? "#fff" : colors.textMuted, fontSize: 13, fontWeight: mode === id ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>{label}</button>
        ))}
      </div>
      {mode === "single" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionCard title="Invitation Details">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={labelStyle}>Email address</div>
                <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="guest@example.com" type="email" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Starting role</div>
                  <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle }}>
                    <option>Visitor</option><option>Guest</option><option>Member</option>
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Add to cycle (optional)</div>
                  <select value={cycle} onChange={e => setCycle(e.target.value)} style={{ ...inputStyle }}>
                    <option value="">— No cycle —</option>
                    {CYCLES_LIST.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div style={labelStyle}>Personal message (optional)</div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Add a note to appear in the invitation email..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          </SectionCard>
          <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>Invitation preview</div>
            <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.7 }}>
              <span style={{ color: colors.text }}>moto</span> has invited you to join Kinship as a <span style={{ color: colors.accent }}>{role}</span>.
              {cycle && <> You'll be enrolled in <span style={{ color: colors.accent }}>{cycle}</span> once you accept.</>}
              {message && <><br /><br /><em style={{ color: colors.textDim }}>"{message}"</em></>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => email && setSent(true)}>Send Invitation</Btn>
            <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
          </div>
        </div>
      )}
      {mode === "bulk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionCard title="Bulk Invite">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={labelStyle}>Email addresses</div>
                <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>Paste or type one per line, or separate with commas or semicolons.</div>
                <textarea value={bulkEmails} onChange={e => setBulkEmails(e.target.value)} rows={8} placeholder={"alice@example.com\nbob@example.com\ncarol@example.com"} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }} />
                {bulkCount > 0 && <div style={{ fontSize: 12, color: colors.accent, marginTop: 6 }}>{bulkCount} address{bulkCount !== 1 ? "es" : ""} detected</div>}
              </div>
              <div>
                <div style={labelStyle}>Or upload a CSV</div>
                <div style={{ border: `2px dashed ${colors.border}`, borderRadius: 9, padding: "20px", textAlign: "center", color: colors.textDim, fontSize: 13, cursor: "pointer" }}>
                  📂 Drop a .csv file here, or click to browse
                  <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>First column should be email. Optional: name, role, cycle.</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Default role</div>
                  <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle }}>
                    <option>Visitor</option><option>Guest</option><option>Member</option>
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Add all to cycle (optional)</div>
                  <select value={cycle} onChange={e => setCycle(e.target.value)} style={{ ...inputStyle }}>
                    <option value="">— No cycle —</option>
                    {CYCLES_LIST.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div style={labelStyle}>Shared message (optional)</div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="A short note included in every invitation..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          </SectionCard>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => bulkCount > 0 && setSent(true)}>Send {bulkCount > 0 ? bulkCount : ""} Invitation{bulkCount !== 1 ? "s" : ""}</Btn>
            <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Extracted sub-component: fixes hooks-in-map violation #4 ──────────────────
const UserRow = ({ u, isSelected, onToggle, onManage, roleColors: rC }) => {
  const [hovered, setHovered] = useState(false);
  const rc = rC[u.role] || colors.blue;
  const Checkbox = ({ checked, onChange }) => (
    <div onClick={onChange} style={{ width: 17, height: 17, borderRadius: 4, border: `2px solid ${checked ? colors.accent : "rgba(255,255,255,0.2)"}`, background: checked ? colors.accent : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.12s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1, fontWeight: 700 }}>✓</span>}
    </div>
  );
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "grid", gridTemplateColumns: "28px 2fr 2.2fr 1fr 1fr 1.1fr 72px", padding: "10px 14px", alignItems: "center", gap: 10, background: isSelected ? colors.accent + "0A" : hovered ? colors.surfaceHover : "transparent", borderBottom: `1px solid ${colors.borderSubtle}`, transition: "background 0.12s" }}>
      <Checkbox checked={isSelected} onChange={onToggle} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: rc + "28", border: `1px solid ${rc}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: rc, flexShrink: 0 }}>
          {u.name.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
        {u.warnings > 0 && <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 9, color: colors.warning, background: colors.warning + "18", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}><Icon name="lucide:alert-triangle" size={9} />{u.warnings}</span>}
      </div>
      <div style={{ fontSize: 12, color: colors.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
      <div><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 9999, background: rc + "22", color: rc }}>{u.role}</span></div>
      <div><StatusPill status={u.status} /></div>
      <div style={{ fontSize: 12, color: colors.textDim }}>{u.lastLogin}</div>
      <button onClick={onManage} style={{ padding: "4px 10px", background: "none", border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Manage</button>
    </div>
  );
};

export const PlatformUsersContent = () => {
  const [view, setView] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null);

  if (view === "invite") return <InviteGuestFlow onBack={() => setView(null)} />;
  const managing = PLATFORM_USERS.find(u => u.id === view);
  if (managing) return <MemberDetail user={managing} onBack={() => setView(null)} />;

  const filtered = PLATFORM_USERS.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.status === filter || u.role === filter || u.type === filter;
    return matchSearch && matchFilter;
  });
  const allChecked = filtered.length > 0 && filtered.every(u => selected.has(u.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(filtered.map(u => u.id)));
  const toggleOne = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selCount = selected.size;
  const Checkbox = ({ checked, onChange }) => (
    <div onClick={onChange} style={{ width: 17, height: 17, borderRadius: 4, border: `2px solid ${checked ? colors.accent : "rgba(255,255,255,0.2)"}`, background: checked ? colors.accent : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.12s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1, fontWeight: 700 }}>✓</span>}
    </div>
  );
  const BULK_ACTIONS = [
    { id: "warn",         label: "⚠️ Warn",             color: colors.warning },
    { id: "suspend",      label: "🚫 Suspend",           color: colors.warning },
    { id: "ban",          label: "🔨 Ban",               color: colors.red },
    { id: "reactivate",   label: "✅ Reactivate",         color: colors.green },
    { id: "message",      label: "📨 Message",            color: colors.blue },
    { id: "change-role",  label: "🔁 Change Role",        color: colors.purple },
    { id: "enroll",       label: "➕ Enroll in Cycle",   color: colors.cyan },
    { id: "remove-cycle", label: "➖ Remove from Cycle",  color: colors.textDim },
    { id: "export",       label: "📤 Export",             color: colors.textDim },
    { id: "delete",       label: "🗑️ Delete",            color: colors.red },
  ];
  const members  = PLATFORM_USERS.filter(u => u.type === "Member").length;
  const guests   = PLATFORM_USERS.filter(u => u.type === "Guest").length;
  const visitors = PLATFORM_USERS.filter(u => u.type === "Visitor").length;

  return (
    <div>
      <PageHeader title="Members & Guests" subtitle={`${members} members · ${guests} guests · ${visitors} visitors`}>
        <Btn onClick={() => setView("invite")}>+ Invite Guest</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[["All", PLATFORM_USERS.length, "All"], ["Member", members, "Member"], ["Guest", guests, "Guest"], ["Visitor", visitors, "Visitor"], ["Active", PLATFORM_USERS.filter(u=>u.status==="Active").length, "Active"], ["Pending", PLATFORM_USERS.filter(u=>u.status==="Pending").length, "Pending"], ["Suspended", PLATFORM_USERS.filter(u=>u.status==="Suspended").length, "Suspended"]].map(([label, count, f]) => (
          <button key={label} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 16, border: "none", background: filter === f ? colors.accent : "rgba(255,255,255,0.07)", color: filter === f ? "#fff" : colors.textMuted, fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: "pointer" }}>
            {label} <span style={{ opacity: 0.7 }}>{count}</span>
          </button>
        ))}
      </div>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Icon name="lucide:search" size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: colors.textDim, pointerEvents: "none" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          style={{ width: "100%", padding: "8px 12px 8px 32px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, outline: "none" }} />
      </div>
      {selCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: colors.accent + "14", border: `1px solid ${colors.accent}30`, borderRadius: 9, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.accent, marginRight: 4 }}>{selCount} selected</span>
          {BULK_ACTIONS.map(a => (
            <button key={a.id} onClick={() => setBulkAction(a.id)}
              style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${a.color}40`, background: a.color + "14", color: a.color, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {a.label}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", padding: "5px 10px", borderRadius: 7, border: `1px solid ${colors.border}`, background: "none", color: colors.textDim, fontSize: 12, cursor: "pointer" }}>Clear</button>
        </div>
      )}
      {bulkAction && (
        <div style={{ padding: "14px 16px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 9, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: colors.text, marginBottom: 10 }}>
            Apply <strong>{BULK_ACTIONS.find(a=>a.id===bulkAction)?.label}</strong> to {selCount} selected {selCount === 1 ? "person" : "people"}?
            {bulkAction === "change-role" && <select style={{ marginLeft: 10, padding: "4px 8px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 12 }}><option>Visitor</option><option>Guest</option><option>Member</option><option>Creator</option></select>}
            {bulkAction === "enroll" && <select style={{ marginLeft: 10, padding: "4px 8px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 12 }}><option>Mountain Temple</option><option>Ocean Depths</option><option>Dark Forest</option></select>}
            {bulkAction === "warn" && <input placeholder="Reason..." style={{ marginLeft: 10, padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.text, fontSize: 12, width: 220 }} />}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => { setBulkAction(null); setSelected(new Set()); }}>Confirm</Btn>
            <Btn variant="secondary" onClick={() => setBulkAction(null)}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "28px 2fr 2.2fr 1fr 1fr 1.1fr 72px", padding: "9px 14px", borderBottom: `1px solid ${colors.borderSubtle}`, gap: 10, alignItems: "center" }}>
          <Checkbox checked={allChecked} onChange={toggleAll} />
          {["Name", "Email", "Role", "Status", "Last Login", ""].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {filtered.map(u => (
          <UserRow key={u.id} u={u} isSelected={selected.has(u.id)} onToggle={() => toggleOne(u.id)} onManage={() => setView(u.id)} roleColors={roleColors} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "32px 16px", textAlign: "center", color: colors.textDim, fontSize: 13 }}>No people match your filters.</div>
        )}
      </div>
    </div>
  );
};

// ─── Platform Bots ────────────────────────────────────────────────────────────

const BotDetail = ({ bot, isNew, onBack }) => {
  const [name, setName] = useState(bot?.name || "");
  const [symbol, setSymbol] = useState(bot?.symbol || "");
  const [model, setModel] = useState(bot?.model || "claude-sonnet-4-5-20250929");
  const [status, setStatus] = useState(bot?.status || "Active");
  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader
        title={isNew ? "Register New Bot" : bot.name}
        subtitle={isNew ? "Add a bot to the global platform registry" : `${bot.symbol} · Owner: ${bot.owner} · ${bot.cycles} active cycle${bot.cycles !== 1 ? "s" : ""}`}
        onBack={onBack}
      >
        {!isNew && <StatusPill status={bot.status} />}
      </PageHeader>
      <SectionDivider label="Bot Identity" />
      <Field label="Bot Name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cosmic Humanity" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Symbol" hint="Short uppercase identifier used across the platform.">
          <Input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="e.g. COSMO" />
        </Field>
        <Field label="Bot Status">
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.textMuted, fontSize: 13, outline: "none" }}>
            <option>Active</option><option>Inactive</option><option>Suspended</option>
          </select>
        </Field>
      </div>
      <SectionDivider label="Model Configuration" />
      <Field label="Default Model" hint="The Claude model this bot uses by default. Can be overridden per-cycle.">
        <select value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.textMuted, fontSize: 13, outline: "none" }}>
          <option value="claude-opus-4-5-20251101">claude-opus-4-5-20251101 — Opus 4.5 (most capable)</option>
          <option value="claude-sonnet-4-5-20250929">claude-sonnet-4-5-20250929 — Sonnet 4.5 (balanced)</option>
          <option value="claude-haiku-4-5-20251001">claude-haiku-4-5-20251001 — Haiku 4.5 (fastest)</option>
        </select>
      </Field>
      {!isNew && (
        <>
          <SectionDivider label="Ownership & Usage" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Owner"><Input value={bot.owner} readOnly /></Field>
            <Field label="Active Cycles"><Input value={bot.cycles === 0 ? "Not deployed in any cycles" : `${bot.cycles} cycle${bot.cycles !== 1 ? "s" : ""}`} readOnly /></Field>
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        <Btn>{isNew ? "Register Bot" : "Save Changes"}</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>
      {!isNew && (
        <DangerZone>
          <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
            Deactivating this bot suspends it in all cycles where it is deployed. Removal is permanent and will disconnect it from {bot.cycles} active cycle{bot.cycles !== 1 ? "s" : ""}.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn danger>Deactivate Bot</Btn>
            <Btn danger>Remove from Platform</Btn>
          </div>
        </DangerZone>
      )}
    </div>
  );
};

// BotRow — fixes hooks-in-map violation #5 (was inside filtered.map in PlatformBotsContent)
const BotRow = ({ b, i, filteredLength, onManage }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div key={b.id} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "grid", gridTemplateColumns: "90px 2fr 2fr 1fr 70px 1fr 72px", padding: "12px 16px", alignItems: "center", background: hovered ? colors.surfaceHover : "transparent", borderBottom: i < filteredLength - 1 ? `1px solid ${colors.borderSubtle}` : "none", transition: "background 0.12s" }}>
      <div><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, padding: "3px 7px", borderRadius: 5, background: colors.accent + "22", color: colors.accent, fontFamily: "monospace" }}>{b.symbol}</span></div>
      <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{b.name}</div>
      <div><span style={{ fontSize: 11, color: colors.textDim, padding: "2px 7px", background: colors.surfaceHover, borderRadius: 4, border: `1px solid ${colors.borderSubtle}`, fontFamily: "monospace" }}>{modelLabels[b.model] || b.model}</span></div>
      <div style={{ fontSize: 12, color: colors.textDim }}>{b.owner}</div>
      <div style={{ fontSize: 12, color: b.cycles === 0 ? colors.textDim : colors.text }}>{b.cycles === 0 ? "—" : b.cycles}</div>
      <div><StatusPill status={b.status} /></div>
      <button onClick={() => onManage(b.id)} style={{ padding: "4px 10px", background: "none", border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Manage</button>
    </div>
  );
};

export const PlatformBotsContent = () => {
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState("All");

  if (view === "new") return <BotDetail isNew onBack={() => setView(null)} />;
  const editing = PLATFORM_BOTS.find(b => b.id === view);
  if (editing) return <BotDetail bot={editing} onBack={() => setView(null)} />;

  const filtered = filter === "All" ? PLATFORM_BOTS : PLATFORM_BOTS.filter(b => b.status === filter);

  return (
    <div>
      <PageHeader title="Bots (Global)" subtitle="All bots registered on this platform across all cycles">
        <Btn onClick={() => setView("new")}>+ Register Bot</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["All", "Active", "Inactive", "Suspended"].map(f => <FilterPill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
      </div>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "90px 2fr 2fr 1fr 70px 1fr 72px", padding: "9px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
          {["Symbol", "Name", "Model", "Owner", "Cycles", "Status", ""].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {filtered.map((b, i) => (
          <BotRow key={b.id} b={b} i={i} filteredLength={filtered.length} onManage={setView} />
        ))}
      </div>
    </div>
  );
};

// ─── Platform Knowledge Base ──────────────────────────────────────────────────

const KnowledgeDocDetail = ({ doc, onBack }) => {
  const [scope, setScope] = useState(doc.scope);
  const [confirmRemove, setConfirmRemove] = useState(false);
  return (
    <div style={{ maxWidth: 660 }}>
      <PageHeader title={doc.name} subtitle={`${sourceTypeLabels[doc.type]} · Added ${doc.added} by ${doc.addedBy}`} onBack={onBack}>
        <StatusPill status={doc.status} />
      </PageHeader>

      <SectionDivider label="Document Info" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Format", value: doc.format },
          { label: "Size", value: doc.size },
          { label: "Pages", value: doc.pages ? doc.pages : "—" },
        ].map((f, i) => (
          <div key={i} style={{ padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{f.value}</div>
          </div>
        ))}
      </div>

      <SectionDivider label="Ingestion Status" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 4 }}>Vector Chunks</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: doc.chunks > 0 ? colors.green : colors.textDim }}>{doc.chunks > 0 ? `${doc.chunks} chunks indexed` : "Processing..."}</div>
        </div>
        <div style={{ padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 4 }}>Source</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {doc.type === "link" ? doc.source : doc.type === "ai-generated" ? "AI Research by Kaytee" : "Direct upload"}
          </div>
        </div>
      </div>
      {doc.status === "Processing" && (
        <div style={{ padding: "12px 16px", background: colors.accent + "12", border: `1px solid ${colors.accent}33`, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>⏳</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: colors.accent }}>Ingestion in progress</div>
              <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>Document is being chunked and indexed into the vector store. This usually takes 1-3 minutes.</div>
            </div>
          </div>
        </div>
      )}

      <SectionDivider label="Availability" />
      <Field label="Scope" hint="Which cycles can access this knowledge.">
        <select value={scope} onChange={e => setScope(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.textMuted, fontSize: 13, outline: "none" }}>
          <option>All cycles</option>
          <option>Selected cycles only</option>
        </select>
      </Field>

      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <Btn variant="secondary">📥 Download Original</Btn>
        {doc.type === "ai-generated" && <Btn variant="secondary">📥 Download as DOCX</Btn>}
        <Btn variant="secondary">🔄 Re-ingest</Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn>Save Changes</Btn>
        <Btn variant="secondary">Cancel</Btn>
      </div>

      <DangerZone>
        {!confirmRemove ? (
          <>
            <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
              Removing this document deletes it from the vector store and makes it unavailable to all actors across all cycles.
            </p>
            <Btn danger onClick={() => setConfirmRemove(true)}>Remove from Knowledge Base</Btn>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: colors.red, fontWeight: 500, marginBottom: 12 }}>
              Are you sure? This will remove {doc.chunks} indexed chunks and cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn danger>Confirm Removal</Btn>
              <Btn variant="secondary" onClick={() => setConfirmRemove(false)}>Cancel</Btn>
            </div>
          </>
        )}
      </DangerZone>
    </div>
  );
};

const KnowledgeAddNew = ({ onBack }) => {
  const [addMode, setAddMode] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const addModes = [
    { id: "upload", label: "📎 Upload", hint: "PDF, DOCX, TXT, MD" },
    { id: "link", label: "🔗 Link / URL", hint: "Ingest from web" },
    { id: "ai", label: "🤖 AI Research", hint: "Generate knowledge" },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title="Add to Knowledge Base" subtitle="Upload documents, ingest links, or generate research with AI" onBack={onBack} />

      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        {addModes.map((m, i) => (
          <button key={m.id} onClick={() => setAddMode(m.id)}
            style={{ flex: 1, padding: "12px 8px", background: addMode === m.id ? colors.accent + "18" : "transparent", border: "none", borderRight: i < addModes.length - 1 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>
            <div style={{ fontSize: 13, fontWeight: addMode === m.id ? 600 : 400, color: addMode === m.id ? colors.accent : colors.textMuted }}>{m.label}</div>
            <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>{m.hint}</div>
          </button>
        ))}
      </div>

      {addMode === "upload" && (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFiles([...files, ...Array.from(e.dataTransfer.files).map(f => f.name)]); }}
            style={{ border: `2px dashed ${dragging ? colors.accent : colors.border}`, borderRadius: 10, padding: "44px 20px", textAlign: "center", background: dragging ? colors.accent + "08" : colors.surface, transition: "all 0.15s", marginBottom: 16, cursor: "pointer" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📎</div>
            <div style={{ fontSize: 14, color: colors.textMuted, fontWeight: 500 }}>Drop files here</div>
            <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>PDF, DOCX, TXT, or MD — files will be chunked and indexed into the vector store</div>
            <button onClick={() => setFiles([...files, "Kaytee System Prompt.pdf"])}
              style={{ marginTop: 16, padding: "8px 18px", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Browse files
            </button>
          </div>
          {files.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: colors.surface, border: `1px solid ${colors.green}33`, borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <span style={{ flex: 1, fontSize: 13, color: colors.textMuted }}>{f}</span>
                  <StatusPill status="Ready" />
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: colors.textDim, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn>Ingest {files.length} Document{files.length > 1 ? "s" : ""}</Btn>
              <Btn variant="secondary">Cancel</Btn>
            </div>
          )}
        </div>
      )}

      {addMode === "link" && (
        <div>
          <Field label="URL" hint="Paste a link and Kinship will crawl the page, extract content, and index it.">
            <div style={{ display: "flex", gap: 8 }}>
              <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com/research-paper" />
              <Btn variant="secondary" size="sm" onClick={() => { if (linkUrl) { setLinks([...links, { url: linkUrl, status: "Queued" }]); setLinkUrl(""); } }}>+ Add</Btn>
            </div>
          </Field>
          {links.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, marginBottom: 16 }}>
              {links.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 14 }}>🔗</span>
                  <span style={{ flex: 1, fontSize: 12, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</span>
                  <StatusPill status={l.status} />
                  <button onClick={() => setLinks(links.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: colors.textDim, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {links.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn>Ingest {links.length} Link{links.length > 1 ? "s" : ""}</Btn>
              <Btn variant="secondary">Cancel</Btn>
            </div>
          )}
          <InfoBox color={colors.blue}>
            Links are crawled and their text content is extracted. JavaScript-rendered pages, paywalled content, and login-protected pages may not ingest fully. You can re-ingest a link at any time to pick up updated content.
          </InfoBox>
        </div>
      )}

      {addMode === "ai" && (
        <div>
          <div style={{ padding: "18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 10, letterSpacing: 0.4, textTransform: "uppercase" }}>Research prompt</div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe what you want researched. Kaytee will generate a knowledge document you can use as-is or download and edit."
              rows={5}
              style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6 }}
            />
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {["Research care frameworks in EdTech", "Summarize Indigenous pedagogical principles", "Compare relational vs transactional AI approaches", "Survey community-based governance models"].map((s, i) => (
                <button key={i} onClick={() => setAiPrompt(s)}
                  style={{ padding: "4px 10px", background: colors.accent + "12", border: `1px solid ${colors.accent}33`, borderRadius: 6, color: colors.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => { setAiGenerating(true); setTimeout(() => { setAiGenerating(false); setAiResult(true); }, 1500); }}>
                {aiGenerating ? "Researching..." : "Generate Research Document"}
              </Btn>
            </div>
          </div>

          {aiResult && (
            <div style={{ border: `1px solid ${colors.green}44`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", background: colors.green + "18", borderBottom: `1px solid ${colors.green}33`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.green }}>Generated: Research Document</span>
                <span style={{ fontSize: 11, color: colors.textDim }}>~8 pages · 3,400 words</span>
              </div>
              <div style={{ padding: "14px 16px", background: colors.surface }}>
                <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.7, maxHeight: 220, overflowY: "auto" }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Comparative Analysis: Care Frameworks in Education Technology</div>
                  <div style={{ color: colors.textDim, fontSize: 12 }}>
                    This document surveys emerging measurement frameworks that prioritize human development and relational health over engagement metrics...
                    <br /><br />
                    <span style={{ fontStyle: "italic" }}>[Preview truncated — full document available for review]</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 16px", background: colors.surface, borderTop: `1px solid ${colors.borderSubtle}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Btn size="sm">Add to Knowledge Base</Btn>
                <Btn variant="secondary" size="sm">📥 Download as DOCX</Btn>
                <Btn variant="secondary" size="sm">Edit Before Adding</Btn>
                <Btn variant="secondary" size="sm" onClick={() => setAiResult(null)}>Discard</Btn>
              </div>
            </div>
          )}

          {!aiResult && !aiGenerating && (
            <InfoBox color={colors.purple}>
              Kaytee will research your topic and produce a structured document. You can add it directly to the knowledge base, download it as a Word doc for manual editing, or refine it with follow-up prompts before ingesting.
            </InfoBox>
          )}
        </div>
      )}
    </div>
  );
};

// KnowledgeRow — fixes hooks-in-map violation #6 (was inside filtered.map in PlatformKnowledgeContent)
const KnowledgeRow = ({ d, onView }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onView(d.id)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={d.icon} size={20} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{d.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>
          {d.format} · {d.size} · Added {d.added} by {d.addedBy}
          {d.chunks > 0 && <span> · {d.chunks} chunks</span>}
        </div>
      </div>
      <StatusPill status={d.status} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

export const PlatformKnowledgeContent = () => {
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState("All");

  if (view === "new") return <KnowledgeAddNew onBack={() => setView(null)} />;
  const doc = KNOWLEDGE_ITEMS.find(d => d.id === view);
  if (doc) return <KnowledgeDocDetail doc={doc} onBack={() => setView(null)} />;

  const typeFilters = ["All", "Uploaded", "Links", "AI-Generated"];
  const filtered = KNOWLEDGE_ITEMS.filter(d => {
    if (filter === "All") return true;
    if (filter === "Uploaded") return d.type === "document";
    if (filter === "Links") return d.type === "link";
    if (filter === "AI-Generated") return d.type === "ai-generated";
    return true;
  });

  return (
    <div>
      <PageHeader title="Platform Knowledge Base" subtitle="Documents, links, and research available to all actors across all cycles">
        <Btn onClick={() => setView("new")}>+ Add New</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {typeFilters.map(f => <FilterPill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(d => (
          <KnowledgeRow key={d.id} d={d} onView={setView} />
        ))}
      </div>
    </div>
  );
};

// ─── Platform Databases ───────────────────────────────────────────────────────

const DatabaseDetail = ({ db, onBack }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div>
      <PageHeader title={db.name} subtitle={db.usage} onBack={onBack}>
        <StatusPill status={db.status} />
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Engine", value: db.engine },
          { label: "Type", value: db.type },
          { label: "Region", value: db.region },
          { label: "Version", value: db.version },
          { label: "Created", value: db.created },
          { label: "Last Sync", value: db.lastSync },
          { label: "Owner", value: db.owner },
          { label: "Stats", value: db.stats },
        ].map((f, i) => (
          <div key={i} style={{ padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{f.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Connection</div>
        <div style={{ padding: "10px 14px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, fontFamily: "monospace", fontSize: 12, color: colors.textDim, wordBreak: "break-all", marginBottom: 12 }}>
          {db.engine === "Pinecone" && "pinecone://kinship-prod.us-east-1.pinecone.io"}
          {db.engine === "MongoDB" && "mongodb+srv://kinship-prod.xxxxx.mongodb.net/kinship"}
          {db.engine === "PostgreSQL" && "postgresql://kinship-prod.us-east-1.rds.amazonaws.com:5432/kinship"}
          {db.engine === "Supabase" && "https://xxxxx.supabase.co"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary">Test Connection</Btn>
          <Btn variant="secondary">View Logs</Btn>
        </div>
      </div>

      {db.engine === "Pinecone" && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Namespaces</div>
          {["knowledge-base", "system-prompts", "actor-memory"].map((ns, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontFamily: "monospace", color: colors.textMuted }}>{ns}</span>
              </div>
              <span style={{ fontSize: 11, color: colors.textDim }}>{[5200, 3800, 3000][i]} vectors</span>
            </div>
          ))}
        </div>
      )}

      {db.engine === "MongoDB" && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Collections</div>
          {[{ name: "users", docs: 347 }, { name: "sessions", docs: 182 }, { name: "roles", docs: 8 }, { name: "auth_tokens", docs: 310 }].map((col, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: colors.textMuted }}>{col.name}</span>
              <span style={{ fontSize: 11, color: colors.textDim }}>{col.docs} documents</span>
            </div>
          ))}
        </div>
      )}

      {db.engine === "PostgreSQL" && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Tables</div>
          {[{ name: "cycle_state", rows: 892 }, { name: "actor_checkpoints", rows: 1240 }, { name: "context_windows", rows: 756 }, { name: "orchestration_logs", rows: 312 }].map((tbl, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: colors.textMuted }}>{tbl.name}</span>
              <span style={{ fontSize: 11, color: colors.textDim }}>{tbl.rows} rows</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 14 }}>Sync & Maintenance</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary">Force Sync</Btn>
          <Btn variant="secondary">Run Backup</Btn>
          <Btn variant="secondary">View Metrics</Btn>
        </div>
      </div>

      <div style={{ background: colors.red + "08", border: `1px solid ${colors.red}33`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.red, marginBottom: 6 }}>Danger Zone</div>
        <p style={{ fontSize: 12, color: colors.textDim, margin: "0 0 12px" }}>Disconnecting this database will remove Platform Core's access. Data in the external service is preserved.</p>
        {!confirmDelete ? (
          <Btn variant="danger" onClick={() => setConfirmDelete(true)}>Disconnect Database</Btn>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="danger">Confirm Disconnect</Btn>
            <Btn variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// EngineCard — fixes hooks-in-map violation #7 (was inside managedEngines.map in DatabaseAddNew)
const EngineCard = ({ eng, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(eng.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <RenderIcon icon={eng.icon} size={28} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{eng.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{eng.desc}</div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {eng.types.map(t => (
          <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9999, background: "rgba(255,255,255,0.06)", color: colors.textDim, border: `1px solid ${colors.border}` }}>{t}</span>
        ))}
      </div>
      <span style={{ color: colors.textDim }}>›</span>
    </div>
  );
};

const DatabaseAddNew = ({ onBack }) => {
  const [tab, setTab] = useState("managed");
  const [engine, setEngine] = useState(null);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const tabs = [
    { id: "managed", label: "Managed Service" },
    { id: "external", label: "External Connection" },
  ];

  const managedEngines = [
    { id: "pinecone", name: "Pinecone", icon: "🌲", desc: "Vector database for embeddings and semantic search", types: ["Vector"] },
    { id: "mongodb", name: "MongoDB", icon: "🍃", desc: "Document database for flexible schemas and nested data", types: ["Document"] },
    { id: "postgresql", name: "PostgreSQL", icon: "🐘", desc: "Relational database for structured data and complex queries", types: ["Relational"] },
    { id: "supabase", name: "Supabase", icon: "⚡", desc: "Postgres with auth, realtime, and edge functions built in", types: ["Relational", "Auth"] },
    { id: "redis", name: "Redis", icon: "🔴", desc: "In-memory cache and message broker for real-time state", types: ["Cache", "Pub/Sub"] },
  ];

  return (
    <div>
      <PageHeader title="Add New Database" subtitle="Connect a managed service or external database" onBack={onBack}>
        <div style={{ display: "flex", gap: 4, padding: 3, background: "rgba(255,255,255,0.06)", borderRadius: 8 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setEngine(null); }}
              style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", border: "none", background: tab === t.id ? colors.accent : "transparent", color: tab === t.id ? "#fff" : colors.textDim }}>
              {t.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {tab === "managed" && !engine && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 8 }}>Select a database engine</div>
          {managedEngines.map(eng => (
            <EngineCard key={eng.id} eng={eng} onSelect={setEngine} />
          ))}
        </div>
      )}

      {tab === "managed" && engine && (
        <div>
          <button onClick={() => setEngine(null)} style={{ background: "none", border: "none", color: colors.accent, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: "inherit" }}>← Back to engine selection</button>
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <RenderIcon icon={managedEngines.find(e => e.id === engine)?.icon} size={24} />
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{managedEngines.find(e => e.id === engine)?.name}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Database Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Actor Memory Store"
                style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Purpose</label>
              <textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="What will this database be used for?"
                style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", minHeight: 60, resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Region</label>
              <select style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit" }}>
                <option>us-east-1 (Virginia)</option>
                <option>us-west-2 (Oregon)</option>
                <option>eu-west-1 (Ireland)</option>
                <option>ap-southeast-1 (Singapore)</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <Btn>Provision & Connect</Btn>
              <Btn variant="secondary" onClick={() => setEngine(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {tab === "external" && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>Connect to an existing database using a connection string</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Database Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production Analytics"
              style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Engine Type</label>
            <select style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "inherit" }}>
              <option>PostgreSQL</option>
              <option>MongoDB</option>
              <option>MySQL</option>
              <option>Pinecone</option>
              <option>Redis</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: colors.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Connection String</label>
            <input placeholder="postgresql://user:pass@host:5432/dbname"
              style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
          </div>
          <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: colors.blue }}>🔒 Connection strings are encrypted at rest and never exposed in the UI after saving.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn>Test & Connect</Btn>
            <Btn variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// DatabaseRow — fixes hooks-in-map violation #8 (was inside filtered.map in PlatformDatabasesContent)
const DatabaseRow = ({ db, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
      onClick={() => onSelect(db.id)}>
      <RenderIcon icon={db.icon} size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{db.name}</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{db.stats}</div>
      </div>
      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 9999, background: (engineColors[db.engine] || colors.accent) + "18", color: engineColors[db.engine] || colors.accent, fontWeight: 600 }}>{db.type}</span>
      <StatusPill status={db.status} />
      <Btn variant="secondary" style={{ fontSize: 11, padding: "5px 12px" }}>Manage</Btn>
    </div>
  );
};

export const PlatformDatabasesContent = () => {
  const [view, setView] = useState("list");
  const [selectedDb, setSelectedDb] = useState(null);
  const [filter, setFilter] = useState("All");

  if (view === "detail" && selectedDb) {
    const db = PLATFORM_DATABASES.find(d => d.id === selectedDb);
    return db ? <DatabaseDetail db={db} onBack={() => { setView("list"); setSelectedDb(null); }} /> : null;
  }
  if (view === "add") return <DatabaseAddNew onBack={() => setView("list")} />;

  const filters = ["All", "Vector", "Document", "Relational"];
  const filtered = filter === "All" ? PLATFORM_DATABASES : PLATFORM_DATABASES.filter(d => d.type === filter);

  return (
    <div>
      <PageHeader title="Platform Databases" subtitle="Vector stores and structured databases shared across all cycles">
        <Btn onClick={() => setView("add")}>+ Add New</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {filters.map(f => <FilterPill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(db => (
          <DatabaseRow key={db.id} db={db} onSelect={id => { setSelectedDb(id); setView("detail"); }} />
        ))}
      </div>
    </div>
  );
};

// ─── Platform Teams & Roles ───────────────────────────────────────────────────

const RoleBadge = ({ roleId, size = "sm" }) => {
  const role = PLATFORM_ROLES.find(r => r.id === roleId);
  if (!role) return null;
  const pad = size === "lg" ? "5px 14px" : "3px 9px";
  const fs = size === "lg" ? 13 : 10;
  return (
    <span style={{ fontSize: fs, padding: pad, borderRadius: 6, background: role.color + "18", color: role.color, fontWeight: 700, border: `1px solid ${role.color}33`, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {role.icon} {role.name}
    </span>
  );
};

const PermissionGrid = ({ enabledPerms, mageOnly = false, readOnly = false, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {PERMISSION_CATEGORIES.map(cat => (
      <div key={cat.id}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>{cat.label}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {cat.perms.map(perm => {
            const isMageOnly = MAGE_ONLY_PERMS.has(perm.id);
            const isEnabled = enabledPerms.has(perm.id);
            const isLocked = readOnly || (isMageOnly && !mageOnly);
            return (
              <div key={perm.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: isEnabled ? colors.accent + "06" : "transparent", borderRadius: 7, opacity: isLocked && !isEnabled ? 0.45 : 1 }}>
                <div onClick={() => !isLocked && onChange && onChange(perm.id, !isEnabled)}
                  style={{ width: 32, height: 18, borderRadius: 9, background: isEnabled ? colors.accent : "rgba(255,255,255,0.10)", cursor: isLocked ? "default" : "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 2, left: isEnabled ? 16 : 2, width: 14, height: 14, borderRadius: 7, background: isEnabled ? "#fff" : "rgba(255,255,255,0.5)", transition: "left 0.15s" }} />
                </div>
                <span style={{ fontSize: 12, color: isEnabled ? colors.textMuted : colors.textDim, flex: 1 }}>{perm.label}</span>
                {isMageOnly && (
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: colors.pink + "18", color: colors.pink, fontWeight: 700 }}>Mage only</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const RoleEditor = ({ role, onBack }) => {
  const isMage = role.id === "mage";
  const isMageUser = CURRENT_USER_ROLE === "mage";
  const [perms, setPerms] = useState(new Set(role.perms));
  const [desc, setDesc] = useState(role.desc);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Save Changes");

  const togglePerm = (permId, val) => {
    const next = new Set(perms);
    val ? next.add(permId) : next.delete(permId);
    setPerms(next);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader
        title={`${role.icon} ${role.name}`}
        subtitle={role.isTemplate ? "Template role — permissions apply by default but can be overridden per team member" : "Core role — permissions apply to all holders of this role"}
        onBack={onBack}
      >
        <RoleBadge roleId={role.id} size="lg" />
      </PageHeader>

      {isMage && (
        <InfoBox color={colors.pink}>
          🔮 The Mage role is fixed. Its permissions cannot be modified — it must retain full access to all Mage-only functions. There can only be one Mage on a platform.
        </InfoBox>
      )}
      {role.id === "wizard" && (
        <InfoBox color={colors.warning}>
          ⚡ Wizard permissions apply platform-wide. Mage-only functions (assigning Wizard, editing Platform Core) are locked and cannot be granted to Wizards.
        </InfoBox>
      )}
      {role.isTemplate && (
        <InfoBox color={colors.blue}>
          ℹ️ {role.name} is a template. These default permissions apply when assigning this role, but Wizards can adjust individual permissions per team member after assignment.
        </InfoBox>
      )}

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <Field label="Description" hint="Shown in the invite flow and on the team member's profile.">
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} readOnly={isMage}
            style={{ width: "100%", padding: "9px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", opacity: isMage ? 0.6 : 1 }} />
        </Field>
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Permissions</div>
        <PermissionGrid enabledPerms={perms} mageOnly={isMageUser && isMage} readOnly={isMage} onChange={togglePerm} />
      </div>

      {!isMage && (
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setSaveLabel("✓ Saved"); setTimeout(() => setSaveLabel("Save Changes"), 2000); }, 700); }}>
            {saving ? "Saving..." : saveLabel}
          </Btn>
          <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
        </div>
      )}
    </div>
  );
};

const TeamMemberDetail = ({ member, onBack }) => {
  const role = PLATFORM_ROLES.find(r => r.id === member.role);
  const isMageUser = CURRENT_USER_ROLE === "mage";
  const isWizardUser = CURRENT_USER_ROLE === "wizard" || isMageUser;
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [customPerms, setCustomPerms] = useState(new Set(role?.perms || []));
  const [permOverride, setPermOverride] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Save Changes");

  const canChangeRole = isWizardUser;
  const canAssignWizard = isMageUser;

  const togglePerm = (permId, val) => {
    const next = new Set(customPerms);
    val ? next.add(permId) : next.delete(permId);
    setCustomPerms(next);
  };

  const availableRoles = PLATFORM_ROLES.filter(r => {
    if (r.id === "mage") return false;
    if (r.id === "wizard" && !canAssignWizard) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title={member.name} subtitle={member.email} onBack={onBack}>
        <RoleBadge roleId={member.role} size="lg" />
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 }}>
        {[
          { label: "Joined Team", value: member.joined },
          { label: "Last Active", value: member.lastActive },
          { label: "Status", value: member.status },
        ].map((s, i) => (
          <div key={i} style={{ padding: "10px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</div>
            <div style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {canChangeRole && member.role !== "mage" && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Role</div>
          <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>
            {canAssignWizard ? "You can assign any role including Wizard." : "You can assign Producer or Guide. Only a Mage can assign the Wizard role."}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {availableRoles.map(r => (
              <div key={r.id} onClick={() => { setSelectedRole(r.id); setCustomPerms(new Set(r.perms)); }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: selectedRole === r.id ? r.color + "10" : colors.bg, border: `1px solid ${selectedRole === r.id ? r.color + "50" : colors.border}`, borderRadius: 8, cursor: "pointer" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${selectedRole === r.id ? r.color : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {selectedRole === r.id && <div style={{ width: 6, height: 6, borderRadius: 3, background: r.color }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{r.icon} {r.name}</span>
                    {r.isTemplate && <span style={{ fontSize: 9, color: colors.textDim, background: "rgba(255,255,255,0.07)", padding: "2px 6px", borderRadius: 4 }}>template</span>}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textDim }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {!canAssignWizard && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: colors.pink + "06", border: `1px solid ${colors.pink}22`, borderRadius: 7, fontSize: 11, color: colors.pink }}>
              🔮 Assigning the Wizard role requires Mage access.
            </div>
          )}
        </div>
      )}

      {member.role === "mage" && (
        <InfoBox color={colors.pink}>
          🔮 This member holds the Mage role. Only a Mage can transfer or remove the Mage role.
        </InfoBox>
      )}

      {PLATFORM_ROLES.find(r => r.id === selectedRole)?.isTemplate && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Permission Overrides</div>
              <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>Customize permissions for this member specifically. Overrides the {PLATFORM_ROLES.find(r => r.id === selectedRole)?.name} defaults.</div>
            </div>
            <div onClick={() => setPermOverride(!permOverride)}
              style={{ width: 36, height: 20, borderRadius: 10, background: permOverride ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: permOverride ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
          </div>
          {permOverride && (
            <PermissionGrid enabledPerms={customPerms} mageOnly={false} readOnly={false} onChange={togglePerm} />
          )}
        </div>
      )}

      {member.role !== "mage" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <Btn onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setSaveLabel("✓ Saved"); setTimeout(() => setSaveLabel("Save Changes"), 2000); }, 700); }}>
            {saving ? "Saving..." : saveLabel}
          </Btn>
          <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
        </div>
      )}

      {member.role !== "mage" && (
        <div style={{ background: colors.red + "08", border: `1px solid ${colors.red}33`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.red, marginBottom: 6 }}>Danger Zone</div>
          <p style={{ fontSize: 12, color: colors.textDim, margin: "0 0 12px" }}>Removing {member.name} from the team revokes all team permissions immediately. Their member account is preserved.</p>
          {!confirmRemove ? (
            <Btn variant="danger" onClick={() => setConfirmRemove(true)}>Remove from Team</Btn>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="danger">Confirm Remove</Btn>
              <Btn variant="secondary" onClick={() => setConfirmRemove(false)}>Cancel</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InviteMemberFlow = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [permOverride, setPermOverride] = useState(false);
  const [customPerms, setCustomPerms] = useState(new Set());
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isMageUser = CURRENT_USER_ROLE === "mage";

  const invitableRoles = PLATFORM_ROLES.filter(r => {
    if (r.id === "mage") return false;
    if (r.id === "wizard" && !isMageUser) return false;
    return true;
  });

  const roleObj = PLATFORM_ROLES.find(r => r.id === selectedRole);

  if (sent) return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>📨</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Invite sent</div>
      <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 6 }}>
        An invitation was sent to <strong style={{ color: colors.textMuted }}>{email}</strong> with the <strong style={{ color: roleObj?.color }}>{roleObj?.icon} {roleObj?.name}</strong> role.
      </div>
      <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 28 }}>The invite expires in 7 days. You can resend or cancel it from the Members list.</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Btn onClick={onBack}>Back to Team</Btn>
        <Btn variant="secondary" onClick={() => { setSent(false); setEmail(""); setSelectedRole(null); setPermOverride(false); setMessage(""); }}>Invite Another</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <PageHeader title="Invite Team Member" subtitle="Invites are sent by email. The recipient must have or create a Kinship account." onBack={onBack} />

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <Field label="Email Address" hint="Must match their Kinship account email or the email they'll use to sign up.">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="e.g. name@example.com"
            style={{ width: "100%", padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
        </Field>
        <div style={{ marginTop: 14 }}>
          <Field label="Personal Message (optional)" hint="Included in the invite email.">
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="e.g. Hi — we'd love to have you help facilitate on Kinship..."
              style={{ width: "100%", padding: "9px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
          </Field>
        </div>
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Assign Role</div>
        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 14 }}>
          {isMageUser
            ? "As Mage, you can assign any role up to and including Wizard."
            : "As Wizard, you can assign Producer or Guide. Only a Mage can grant the Wizard role."}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {invitableRoles.map(r => (
            <div key={r.id} onClick={() => { setSelectedRole(r.id); setCustomPerms(new Set(r.perms)); }}
              style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: selectedRole === r.id ? r.color + "10" : colors.bg, border: `1px solid ${selectedRole === r.id ? r.color + "50" : colors.border}`, borderRadius: 9, cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${selectedRole === r.id ? r.color : colors.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {selectedRole === r.id && <div style={{ width: 7, height: 7, borderRadius: 4, background: r.color }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", align: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{r.name}</span>
                  {r.isTemplate && <span style={{ fontSize: 9, color: colors.textDim, background: "rgba(255,255,255,0.07)", padding: "2px 6px", borderRadius: 4, border: `1px solid ${colors.border}` }}>template · customizable</span>}
                </div>
                <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5 }}>{r.desc}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {[...r.perms].slice(0, 5).map(pid => {
                    const label = PERMISSION_CATEGORIES.flatMap(c => c.perms).find(p => p.id === pid)?.label;
                    return label ? <span key={pid} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: colors.textDim }}>{label}</span> : null;
                  })}
                  {r.perms.size > 5 && <span style={{ fontSize: 9, color: colors.textDim }}>+{r.perms.size - 5} more</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {roleObj?.isTemplate && selectedRole && (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: permOverride ? 16 : 0 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Customize Permissions</div>
              <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>Adjust the default {roleObj.name} permissions for this specific invite.</div>
            </div>
            <div onClick={() => setPermOverride(!permOverride)}
              style={{ width: 36, height: 20, borderRadius: 10, background: permOverride ? colors.accent : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: permOverride ? 18 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left 0.15s" }} />
            </div>
          </div>
          {permOverride && (
            <PermissionGrid enabledPerms={customPerms} mageOnly={false} readOnly={false}
              onChange={(id, val) => { const n = new Set(customPerms); val ? n.add(id) : n.delete(id); setCustomPerms(n); }} />
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <Btn
          onClick={() => { if (!email || !selectedRole) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 900); }}
          style={{ opacity: !email || !selectedRole ? 0.5 : 1 }}>
          {sending ? "Sending..." : "Send Invite"}
        </Btn>
        <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
      </div>
    </div>
  );
};

// TeamMemberRow — fixes hooks-in-map violation #9 (was inside TEAM_MEMBERS.map in PlatformTeamsContent)
const TeamMemberRow = ({ m, onSelect }) => {
  const role = PLATFORM_ROLES.find(r => r.id === m.role);
  const [hovered, setHovered] = useState(false);
  const initials = m.name.slice(0, 2).toUpperCase();
  const isSelf = m.id === "moto";
  return (
    <div onClick={() => onSelect(m.id)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: (role?.color || colors.accent) + "20", border: `1px solid ${(role?.color || colors.accent)}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: role?.color || colors.accent }}>
        {initials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{m.name}</span>
          {isSelf && <span style={{ fontSize: 9, color: colors.textDim, background: "rgba(255,255,255,0.07)", padding: "2px 6px", borderRadius: 4 }}>you</span>}
        </div>
        <div style={{ fontSize: 12, color: colors.textDim }}>{m.email}</div>
        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 3 }}>Last active {m.lastActive}</div>
      </div>
      <RoleBadge roleId={m.role} />
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim }} />
    </div>
  );
};

// RoleRow — fixes hooks-in-map violation #10 (was inside PLATFORM_ROLES.map in PlatformTeamsContent)
const RoleRow = ({ role, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const holders = TEAM_MEMBERS.filter(m => m.role === role.id);
  return (
    <div onClick={() => onSelect(role.id)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", background: hovered ? colors.surfaceHover : colors.surface, border: `1px solid ${hovered ? role.color + "40" : colors.border}`, borderRadius: 12, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: role.color + "16", border: `1px solid ${role.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{role.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: role.color }}>{role.name}</span>
          {role.isTemplate && <span style={{ fontSize: 9, color: colors.textDim, background: "rgba(255,255,255,0.07)", padding: "2px 7px", borderRadius: 4, border: `1px solid ${colors.border}` }}>template</span>}
          {role.locked && <span style={{ fontSize: 9, color: colors.warning, background: colors.warning + "14", padding: "2px 7px", borderRadius: 4 }}>locked</span>}
        </div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5, marginBottom: 10 }}>{role.desc}</div>
        <div style={{ display: "flex", align: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: colors.textDim }}>{role.perms.size} permissions</span>
          <span style={{ fontSize: 11, color: colors.textDim }}>{holders.length} {holders.length === 1 ? "member" : "members"}{holders.length > 0 ? `: ${holders.map(h => h.name).join(", ")}` : ""}</span>
        </div>
      </div>
      <span style={{ color: colors.textDim, fontSize: 16, marginTop: 10 }}>›</span>
    </div>
  );
};

export const PlatformTeamsContent = () => {
  const [tab, setTab] = useState("members");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);

  const isMageUser = CURRENT_USER_ROLE === "mage";
  const isWizardUser = CURRENT_USER_ROLE === "wizard" || isMageUser;

  if (view === "invite") return <InviteMemberFlow onBack={() => setView("list")} />;
  if (view === "member" && selected) {
    const m = TEAM_MEMBERS.find(m => m.id === selected);
    return m ? <TeamMemberDetail member={m} onBack={() => { setView("list"); setSelected(null); }} /> : null;
  }
  if (view === "role" && selected) {
    const r = PLATFORM_ROLES.find(r => r.id === selected);
    return r ? <RoleEditor role={r} onBack={() => { setView("list"); setSelected(null); }} /> : null;
  }

  return (
    <div>
      <PageHeader title="Teams & Roles" subtitle="Platform team membership and role permissions">
        {isWizardUser && tab === "members" && <Btn onClick={() => setView("invite")}>+ Invite Member</Btn>}
      </PageHeader>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
        {[{ id: "members", label: "👥 Members", count: TEAM_MEMBERS.length }, { id: "roles", label: "🔑 Roles", count: PLATFORM_ROLES.length }].map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "10px 24px", background: tab === t.id ? colors.accent + "16" : "transparent", border: "none", borderRight: i === 0 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? colors.accent : colors.textMuted }}>{t.label}</span>
            <span style={{ marginLeft: 6, fontSize: 11, color: colors.textDim }}>({t.count})</span>
          </button>
        ))}
      </div>

      {tab === "members" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Active Team Members</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {TEAM_MEMBERS.map(m => (
              <TeamMemberRow key={m.id} m={m} onSelect={id => { setSelected(id); setView("member"); }} />
            ))}
          </div>

          {isWizardUser && PENDING_INVITES.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Pending Invites</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PENDING_INVITES.map((inv, i) => {
                  const role = PLATFORM_ROLES.find(r => r.id === inv.role);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 9, opacity: 0.9 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.06)", border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📨</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{inv.email}</div>
                        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>Sent by {inv.sentBy} · expires {inv.expires}</div>
                      </div>
                      <RoleBadge roleId={inv.role} />
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="secondary" style={{ fontSize: 10, padding: "4px 10px" }}>Resend</Btn>
                        <Btn variant="secondary" style={{ fontSize: 10, padding: "4px 10px", color: colors.red }}>Cancel</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "roles" && (
        <div>
          <div style={{ padding: "10px 14px", background: colors.blue + "08", border: `1px solid ${colors.blue}33`, borderRadius: 8, fontSize: 12, color: colors.blue, marginBottom: 18 }}>
            ℹ️ Producer and Guide are role templates — their default permissions can be adjusted per team member after assignment. Mage and Wizard permissions are applied uniformly to all holders.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PLATFORM_ROLES.map(role => (
              <RoleRow key={role.id} role={role} onSelect={id => { setSelected(id); setView("role"); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
