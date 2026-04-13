import React, { useState } from "react";
import { colors } from "../colors.js";
import { Icon, RenderIcon } from "../components/RenderIcon.jsx";
import {
  NavItem, SectionLabel, CycleSelector, Badge, PageHeader,
  Btn, StatusPill, FilterPill, Card, Modal, Field, Input,
  Toggle, SectionDivider, DangerZone, InfoBox, SectionCard,
} from "../components/Sidebar.jsx";
import {
  PlatformToolsContent,
  PlatformPromptsContent,
  PlatformActorsContent,
  PlatformUsersContent,
  PlatformBotsContent,
  PlatformKnowledgeContent,
  PlatformDatabasesContent,
  PlatformTeamsContent,
} from "../components/Platform.jsx";

// ─── Proposals Data ──────────────────────────────────────────────────────────

const PROPOSALS = [
  {
    id: "p1",
    title: "Add Korean War Gallery to History Section",
    desc: "Create a dedicated gallery within the History tab showcasing the 2nd Cavalry's role during the Korean War era, including garrison duties in Germany and training operations.",
    status: "Active",
    author: "Jay Hill",
    created: "2026-03-15",
    endsAt: "2026-04-15",
    votesFor: 127,
    votesAgainst: 14,
    totalVoters: 4377,
    category: "Content",
    priority: "High",
    linkedExperience: "History Tab → New Gallery",
  },
  {
    id: "p2",
    title: "Create Women in the Regiment Feature",
    desc: "Develop a special feature highlighting the contributions of women who served with and supported the 2nd Cavalry Regiment across all eras of service.",
    status: "Active",
    author: "Tim White",
    created: "2026-03-20",
    endsAt: "2026-04-20",
    votesFor: 203,
    votesAgainst: 8,
    totalVoters: 4377,
    category: "Content",
    priority: "High",
    linkedExperience: "History Tab → Featured Stories",
  },
  {
    id: "p3",
    title: "Launch Quarterly Virtual Reunion Events",
    desc: "Establish regular virtual reunion gatherings using the Events tab, with themed discussions, guest speakers from different eras, and interactive Q&A sessions with the Dragoon Guide.",
    status: "Active",
    author: "Dave Gettman",
    created: "2026-03-25",
    endsAt: "2026-04-25",
    votesFor: 312,
    votesAgainst: 22,
    totalVoters: 4377,
    category: "Community",
    priority: "Medium",
    linkedExperience: "Events Tab → Virtual Reunions",
  },
  {
    id: "p4",
    title: "Add Interactive Timeline for Border Patrols",
    desc: "Build an interactive, scrollable timeline showing Cold War border patrol routes, key incidents, and personal stories from troopers who served on the Iron Curtain.",
    status: "Active",
    author: "John Walker",
    created: "2026-04-01",
    endsAt: "2026-05-01",
    votesFor: 89,
    votesAgainst: 3,
    totalVoters: 4377,
    category: "Feature",
    priority: "Medium",
    linkedExperience: "History Tab → Interactive Timeline",
  },
  {
    id: "p5",
    title: "Expand MOH Section with Video Testimonials",
    desc: "Enhance the Medal of Honor section with video testimonials from family members and historians, plus detailed battle maps for each citation.",
    status: "Active",
    author: "Harry Warner",
    created: "2026-04-05",
    endsAt: "2026-05-05",
    votesFor: 156,
    votesAgainst: 5,
    totalVoters: 4377,
    category: "Content",
    priority: "High",
    linkedExperience: "History Tab → Medal of Honor",
  },
  {
    id: "p6",
    title: "Create Mentorship Matching System",
    desc: "Build a system that pairs active-duty troopers with veterans for mentorship, using the Community tab's groups feature to facilitate connections across generations.",
    status: "Passed",
    author: "Frank Podlaha",
    created: "2026-02-10",
    endsAt: "2026-03-10",
    votesFor: 278,
    votesAgainst: 31,
    totalVoters: 4377,
    category: "Community",
    priority: "High",
    linkedExperience: "Community Tab → Mentorship Groups",
  },
  {
    id: "p7",
    title: "Add Family Member Access Tier",
    desc: "Create a special membership tier for family members of regiment veterans, giving them access to history, events, and community features with appropriate privacy controls.",
    status: "Passed",
    author: "Gerard Kaminski",
    created: "2026-01-20",
    endsAt: "2026-02-20",
    votesFor: 341,
    votesAgainst: 45,
    totalVoters: 4377,
    category: "Governance",
    priority: "Medium",
    linkedExperience: "Service Tab → Family Access",
  },
  {
    id: "p8",
    title: "Integrate Regimental Store",
    desc: "Add a marketplace section for official 2nd Cavalry merchandise, with proceeds supporting the association's mission and veteran support programs.",
    status: "Draft",
    author: "Gray Worcester",
    created: "2026-04-10",
    endsAt: null,
    votesFor: 0,
    votesAgainst: 0,
    totalVoters: 4377,
    category: "Commerce",
    priority: "Low",
    linkedExperience: "New Tab → Regimental Store",
  },
];

const PROPOSAL_CATEGORIES = ["All", "Content", "Feature", "Community", "Commerce", "Governance"];

// ─── Proposals Page ──────────────────────────────────────────────────────────

const ProposalRow = ({ p, onClick }) => {
  const [hov, setHov] = useState(false);
  const statusColor = p.status === "Active" ? colors.green : p.status === "Passed" ? colors.blue : colors.warning;
  const catColors = { Content: colors.purple, Feature: colors.cyan, Community: colors.green, Commerce: colors.accent, Governance: colors.pink };
  const pct = p.votesFor + p.votesAgainst > 0 ? Math.round((p.votesFor / (p.votesFor + p.votesAgainst)) * 100) : 0;
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", background: hov ? colors.surfaceHover : colors.surface, border: `1px solid ${hov ? colors.borderHover : colors.border}`, borderRadius: 12, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: statusColor + "16", border: `1px solid ${statusColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {p.status === "Active" ? "🗳️" : p.status === "Passed" ? "✅" : "📝"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{p.title}</span>
          <StatusPill status={p.status} />
        </div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: catColors[p.category] || colors.textDim, background: (catColors[p.category] || colors.textDim) + "18", padding: "2px 8px", borderRadius: 4 }}>{p.category}</span>
          <span style={{ fontSize: 11, color: colors.textDim }}>by {p.author}</span>
          {p.status !== "Draft" && (
            <>
              <span style={{ fontSize: 11, color: colors.green, fontWeight: 600 }}>👍 {p.votesFor}</span>
              <span style={{ fontSize: 11, color: colors.red }}>👎 {p.votesAgainst}</span>
              {pct > 0 && <span style={{ fontSize: 11, color: pct >= 70 ? colors.green : colors.warning, fontWeight: 600 }}>{pct}% approval</span>}
            </>
          )}
        </div>
        {p.status === "Active" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${colors.green}, ${colors.green}cc)`, width: `${pct}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        )}
      </div>
      <Icon name="lucide:chevron-right" size={16} style={{ color: colors.textDim, marginTop: 12 }} />
    </div>
  );
};

const ProposalDetail = ({ proposal, onBack }) => {
  const [voted, setVoted] = useState(null);
  const pct = proposal.votesFor + proposal.votesAgainst > 0 ? Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100) : 0;
  const participation = proposal.votesFor + proposal.votesAgainst;
  const participationPct = Math.round((participation / proposal.totalVoters) * 100);

  return (
    <div style={{ maxWidth: 660 }}>
      <PageHeader title={proposal.title} subtitle={`Proposed by ${proposal.author} · ${proposal.created}`} onBack={onBack}>
        <StatusPill status={proposal.status} />
      </PageHeader>

      <SectionCard title="Description" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.7 }}>{proposal.desc}</div>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Category", value: proposal.category },
          { label: "Priority", value: proposal.priority },
          { label: "Linked Experience", value: proposal.linkedExperience },
        ].map((f, i) => (
          <div key={i} style={{ padding: "12px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{f.value}</div>
          </div>
        ))}
      </div>

      {proposal.status !== "Draft" && (
        <>
          <SectionDivider label="Voting Results" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.green }}>{proposal.votesFor}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>For</div>
            </div>
            <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.red }}>{proposal.votesAgainst}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>Against</div>
            </div>
            <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: pct >= 70 ? colors.green : colors.warning }}>{pct}%</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>Approval</div>
            </div>
            <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.textMuted }}>{participationPct}%</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>Participation</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textDim, marginBottom: 6 }}>
              <span>For ({pct}%)</span>
              <span>Against ({100 - pct}%)</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden", display: "flex" }}>
              <div style={{ height: "100%", background: colors.green, width: `${pct}%`, transition: "width 0.3s" }} />
              <div style={{ height: "100%", background: colors.red, flex: 1 }} />
            </div>
          </div>
        </>
      )}

      {proposal.status === "Active" && (
        <SectionCard title="Cast Your Vote" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setVoted("for")} variant={voted === "for" ? "primary" : "secondary"}
              style={voted === "for" ? { background: colors.green } : {}}>
              👍 Vote For
            </Btn>
            <Btn onClick={() => setVoted("against")} variant={voted === "against" ? "primary" : "secondary"}
              style={voted === "against" ? { background: colors.red } : {}}>
              👎 Vote Against
            </Btn>
          </div>
          {voted && (
            <div style={{ marginTop: 12, fontSize: 12, color: colors.green }}>
              ✓ Your vote has been recorded. This will be pushed to the front-end app for community tally.
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="Front-End App Mapping" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: colors.textMuted }}>Target:</span> {proposal.linkedExperience}
          </div>
          <div style={{ padding: "10px 14px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, fontFamily: "monospace", fontSize: 11, color: colors.textDim }}>
            {`// Proposal ${proposal.id} maps to front-end vote\n`}
            {`// Route: /community → Forum → Votes\n`}
            {`// Component: CommunityView.tsx\n`}
            {`// Status: ${proposal.status === "Passed" ? "Implemented" : "Pending vote completion"}`}
          </div>
        </div>
      </SectionCard>

      {proposal.endsAt && (
        <InfoBox color={colors.blue}>
          ℹ️ Voting {proposal.status === "Passed" ? "ended" : "ends"} on {proposal.endsAt}. Results are automatically pushed to the Dragoon Base front-end app.
        </InfoBox>
      )}
    </div>
  );
};

const ProposalsContent = () => {
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  if (view === "new") {
    return (
      <div style={{ maxWidth: 660 }}>
        <PageHeader title="New Proposal" subtitle="Create a proposal for the community to vote on" onBack={() => setView(null)} />
        <Field label="Title" hint="Short, clear title for the proposal">
          <Input placeholder="e.g., Add Vietnam Era Gallery" />
        </Field>
        <Field label="Description" hint="Explain what this proposal would add or change">
          <textarea style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", minHeight: 100, resize: "vertical", fontFamily: "inherit" }} placeholder="Describe the proposal in detail..." />
        </Field>
        <Field label="Category">
          <div style={{ display: "flex", gap: 6 }}>
            {PROPOSAL_CATEGORIES.filter(c => c !== "All").map(c => (
              <FilterPill key={c} label={c} active={false} onClick={() => {}} />
            ))}
          </div>
        </Field>
        <Field label="Priority">
          <div style={{ display: "flex", gap: 6 }}>
            {["Low", "Medium", "High"].map(p => (
              <FilterPill key={p} label={p} active={false} onClick={() => {}} />
            ))}
          </div>
        </Field>
        <Field label="Linked Experience" hint="Which part of the front-end app will this affect?">
          <Input placeholder="e.g., History Tab → New Section" />
        </Field>
        <Field label="Voting Duration">
          <div style={{ display: "flex", gap: 6 }}>
            {["7 days", "14 days", "30 days"].map(d => (
              <FilterPill key={d} label={d} active={d === "30 days"} onClick={() => {}} />
            ))}
          </div>
        </Field>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Btn onClick={() => setView(null)}>Submit as Draft</Btn>
          <Btn variant="secondary" onClick={() => setView(null)}>Publish for Voting</Btn>
        </div>
      </div>
    );
  }

  const detail = PROPOSALS.find(p => p.id === view);
  if (detail) return <ProposalDetail proposal={detail} onBack={() => setView(null)} />;

  const filtered = PROPOSALS.filter(p => {
    const matchCat = filter === "All" || p.category === filter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchCat && matchStatus;
  });

  const activeCount = PROPOSALS.filter(p => p.status === "Active").length;
  const passedCount = PROPOSALS.filter(p => p.status === "Passed").length;
  const totalVotes = PROPOSALS.reduce((sum, p) => sum + p.votesFor + p.votesAgainst, 0);

  return (
    <div>
      <PageHeader title="Proposals" subtitle="Community proposals that map to votes in the Dragoon Base front-end app">
        <Btn onClick={() => setView("new")}>+ New Proposal</Btn>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Active", value: activeCount, color: colors.green },
          { label: "Passed", value: passedCount, color: colors.blue },
          { label: "Total Proposals", value: PROPOSALS.length, color: colors.textMuted },
          { label: "Total Votes Cast", value: totalVotes, color: colors.accent },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{s.label}</div>
          </div>
        ))}
      </div>

      <InfoBox color={colors.cyan}>
        🗳️ Proposals created here are pushed to the Dragoon Base front-end app as community votes. Members vote via Community → Forum → Votes in the mobile app.
      </InfoBox>

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {["All", "Active", "Passed", "Draft"].map(s => (
          <FilterPill key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {PROPOSAL_CATEGORIES.map(c => (
          <FilterPill key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => (
          <ProposalRow key={p.id} p={p} onClick={() => setView(p.id)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: colors.textDim }}>
            No proposals match the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Vibes Page ──────────────────────────────────────────────────────────────

const VIBES_DATA = [
  { id: "regimental-honor", name: "Regimental Honor", scope: "Platform", color: colors.accent, status: "Active", desc: "Core behavioral contract ensuring all interactions honor military service, sacrifice, and the regiment's 190-year legacy.", affect: { warmth: 75, energy: 45, tone: 35, direct: 60, challenge: 30, ritual: 55 } },
  { id: "battle-buddy", name: "Battle Buddy Mode", scope: "Community", color: colors.green, status: "Active", desc: "Peer support mode — warm, direct, non-judgmental. Designed for veteran-to-veteran conversation support.", affect: { warmth: 85, energy: 40, tone: 30, direct: 70, challenge: 20, ritual: 25 } },
  { id: "ceremony-mode", name: "Ceremony & Memorial", scope: "Events", color: colors.purple, status: "Active", desc: "Formal, reverent tone for memorial events, Taps ceremonies, and honoring fallen troopers.", affect: { warmth: 65, energy: 20, tone: 15, direct: 40, challenge: 10, ritual: 95 } },
  { id: "reunion-energy", name: "Reunion Energy", scope: "Events", color: colors.cyan, status: "Active", desc: "High-energy, social mode for reunion events — stories, laughter, and camaraderie across eras.", affect: { warmth: 90, energy: 85, tone: 80, direct: 55, challenge: 15, ritual: 30 } },
  { id: "historian-mode", name: "Historian Mode", scope: "History", color: colors.blue, status: "Active", desc: "Precise, factual, research-oriented tone for deep historical exploration and documentation.", affect: { warmth: 50, energy: 35, tone: 25, direct: 75, challenge: 40, ritual: 20 } },
  { id: "new-trooper", name: "New Trooper Welcome", scope: "Onboarding", color: colors.pink, status: "Draft", desc: "Warm, patient, encouraging mode for onboarding new members to the platform and community.", affect: { warmth: 90, energy: 60, tone: 55, direct: 45, challenge: 10, ritual: 35 } },
];

const AFFECT_DIMS = [
  { key: "warmth", label: "Warmth", lo: "Cool", hi: "Warm" },
  { key: "energy", label: "Energy", lo: "Still", hi: "Electric" },
  { key: "tone", label: "Tone", lo: "Solemn", hi: "Playful" },
  { key: "direct", label: "Directness", lo: "Gentle", hi: "Direct" },
  { key: "challenge", label: "Challenge", lo: "Nurturing", hi: "Demanding" },
  { key: "ritual", label: "Ritual", lo: "Casual", hi: "Ceremonial" },
];

const VibeRow = ({ v, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", background: hov ? colors.surfaceHover : colors.surface, border: `1px solid ${hov ? v.color + "40" : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: v.color, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{v.name}</span>
          <span style={{ fontSize: 10, color: colors.textDim, background: "rgba(255,255,255,0.07)", padding: "2px 7px", borderRadius: 4 }}>{v.scope}</span>
          <StatusPill status={v.status} />
        </div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5 }}>{v.desc}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {AFFECT_DIMS.map(d => (
            <div key={d.key} style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: colors.textDim, marginBottom: 3 }}>{d.label}</div>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ height: "100%", borderRadius: 2, background: v.color, width: `${v.affect[d.key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VibesContent = () => {
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState("All");

  if (view === "new") {
    return (
      <div style={{ maxWidth: 660 }}>
        <PageHeader title="New Vibe" subtitle="Create a new behavioral contract" onBack={() => setView(null)} />
        <Field label="Name"><Input placeholder="e.g., Mission Briefing Mode" /></Field>
        <Field label="Scope">
          <div style={{ display: "flex", gap: 6 }}>
            {["Platform", "Community", "Events", "History", "Onboarding"].map(s => <FilterPill key={s} label={s} />)}
          </div>
        </Field>
        <SectionDivider label="Affect Dimensions" />
        {AFFECT_DIMS.map(d => (
          <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: colors.textDim, width: 80 }}>{d.label}</span>
            <span style={{ fontSize: 10, color: colors.textDim, width: 60 }}>{d.lo}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "100%", borderRadius: 3, background: colors.accent, width: "50%" }} />
            </div>
            <span style={{ fontSize: 10, color: colors.textDim, width: 60, textAlign: "right" }}>{d.hi}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}><Btn>Save Vibe</Btn><Btn variant="secondary" onClick={() => setView(null)}>Cancel</Btn></div>
      </div>
    );
  }

  const detail = VIBES_DATA.find(v => v.id === view);
  if (detail) {
    return (
      <div style={{ maxWidth: 660 }}>
        <PageHeader title={detail.name} subtitle={`Scope: ${detail.scope}`} onBack={() => setView(null)}>
          <StatusPill status={detail.status} />
        </PageHeader>
        <SectionCard title="Description" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.7 }}>{detail.desc}</div>
        </SectionCard>
        <SectionDivider label="Affect Profile" />
        {AFFECT_DIMS.map(d => (
          <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: colors.textDim, width: 80 }}>{d.label}</span>
            <span style={{ fontSize: 10, color: colors.textDim, width: 60 }}>{d.lo}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", position: "relative" }}>
              <div style={{ height: "100%", borderRadius: 3, background: detail.color, width: `${detail.affect[d.key]}%` }} />
            </div>
            <span style={{ fontSize: 10, color: colors.textDim, width: 60, textAlign: "right" }}>{d.hi}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: detail.color, width: 36, textAlign: "right" }}>{detail.affect[d.key]}%</span>
          </div>
        ))}
      </div>
    );
  }

  const scopes = ["All", "Platform", "Community", "Events", "History", "Onboarding"];
  const filtered = filter === "All" ? VIBES_DATA : VIBES_DATA.filter(v => v.scope === filter);

  return (
    <div>
      <PageHeader title="Vibes" subtitle="Behavioral contracts that shape how agents interact across different contexts">
        <Btn onClick={() => setView("new")}>+ New Vibe</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {scopes.map(s => <FilterPill key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(v => <VibeRow key={v.id} v={v} onClick={() => setView(v.id)} />)}
      </div>
    </div>
  );
};

// ─── Offerings Page ──────────────────────────────────────────────────────────

const OFFERINGS = [
  { id: "o1", name: "Dragoon Guide 1:1 History Deep Dive", type: "Session", price: 50, currency: "DRGN", status: "Active", sales: 47, icon: "🐴", desc: "Personalized deep dive into any era of 2nd Cavalry history with the Dragoon Guide AI." },
  { id: "o2", name: "VA Benefits Navigation Session", type: "Session", price: 0, currency: "free", status: "Active", sales: 134, icon: "🏥", desc: "Free guided session with the VA Benefits Navigator to understand your earned benefits." },
  { id: "o3", name: "New Trooper Onboarding Quest", type: "Quest", price: 0, currency: "free", status: "Active", sales: 289, icon: "📖", desc: "Interactive onboarding experience introducing new members to the regiment's community and history." },
  { id: "o4", name: "Reunion Planning Package", type: "Service", price: 200, currency: "DRGN", status: "Active", sales: 12, icon: "🎖️", desc: "Full-service reunion planning with AI coordination, event scheduling, and attendee management." },
  { id: "o5", name: "Custom Unit History Research", type: "Service", price: 150, currency: "DRGN", status: "Active", sales: 23, icon: "📜", desc: "AI-powered deep research into specific units, time periods, or individuals in regiment history." },
  { id: "o6", name: "Memorial & Heritage Workshop", type: "Workshop", price: 100, currency: "DRGN", status: "Active", sales: 8, icon: "🕯️", desc: "Guided workshop on preserving and sharing military heritage, memoirs, and family histories." },
  { id: "o7", name: "Monthly Toujours Thursday Access", type: "Subscription", price: 25, currency: "DRGN/mo", status: "Active", sales: 67, icon: "📅", desc: "Access to the monthly Toujours Thursday virtual gathering series with themed discussions." },
  { id: "o8", name: "Regimental Merchandise Pack", type: "Physical", price: 75, currency: "DRGN", status: "Draft", sales: 0, icon: "🛍️", desc: "Official 2nd Cavalry Association merchandise bundle including patches, coins, and apparel." },
];

const OfferingRow = ({ o, onClick }) => {
  const [hov, setHov] = useState(false);
  const typeColors = { Session: colors.purple, Quest: colors.green, Service: colors.cyan, Workshop: colors.accent, Subscription: colors.blue, Physical: colors.pink };
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: hov ? colors.surfaceHover : colors.surface, border: `1px solid ${hov ? colors.borderHover : colors.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: (typeColors[o.type] || colors.accent) + "16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{o.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{o.name}</div>
        <div style={{ fontSize: 11, color: colors.textDim }}>{o.desc}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: o.price === 0 ? colors.green : colors.accent }}>{o.price === 0 ? "Free" : `${o.price} ${o.currency}`}</div>
        <div style={{ fontSize: 11, color: colors.textDim }}>{o.sales} claimed</div>
      </div>
      <StatusPill status={o.status} />
    </div>
  );
};

const OfferingsContent = () => {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Session", "Quest", "Service", "Workshop", "Subscription", "Physical"];
  const filtered = filter === "All" ? OFFERINGS : OFFERINGS.filter(o => o.type === filter);
  const totalRevenue = OFFERINGS.reduce((sum, o) => sum + (o.price * o.sales), 0);

  return (
    <div>
      <PageHeader title="Offerings" subtitle="Products and services available to Dragoon Base members">
        <Btn>+ New Offering</Btn>
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.accent }}>{OFFERINGS.length}</div>
          <div style={{ fontSize: 11, color: colors.textDim }}>Total Offerings</div>
        </div>
        <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.green }}>{OFFERINGS.reduce((s, o) => s + o.sales, 0)}</div>
          <div style={{ fontSize: 11, color: colors.textDim }}>Total Claims</div>
        </div>
        <div style={{ padding: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.purple }}>{totalRevenue.toLocaleString()} DRGN</div>
          <div style={{ fontSize: 11, color: colors.textDim }}>Total Revenue</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {types.map(t => <FilterPill key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(o => <OfferingRow key={o.id} o={o} />)}
      </div>
    </div>
  );
};

// ─── Coins Page ──────────────────────────────────────────────────────────────

const CoinsContent = () => {
  const coin = {
    symbol: "DRGN",
    name: "Dragoon Coin",
    supply: 500000000,
    price: 0.0068,
    circulation: 87200000,
    holders: 4377,
    mintAddress: "DRGNxM7...9aB3",
    treasuryBalance: 412800000,
    change24h: "+2.4%",
    volume24h: "12,400 DRGN",
  };

  return (
    <div>
      <PageHeader title="Coins" subtitle="Manage the Dragoon Coin (DRGN) token economy">
        <Btn>Configure</Btn>
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Price", value: `$${coin.price}`, color: colors.green },
          { label: "Holders", value: coin.holders.toLocaleString(), color: colors.accent },
          { label: "Circulating", value: `${(coin.circulation / 1e6).toFixed(1)}M`, color: colors.cyan },
          { label: "Treasury", value: `${(coin.treasuryBalance / 1e6).toFixed(1)}M`, color: colors.purple },
        ].map((s, i) => (
          <div key={i} style={{ padding: "16px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{s.label}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Token Details" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Symbol", value: coin.symbol },
            { label: "Name", value: coin.name },
            { label: "Total Supply", value: coin.supply.toLocaleString() },
            { label: "Mint Address", value: coin.mintAddress },
            { label: "24h Change", value: coin.change24h },
            { label: "24h Volume", value: coin.volume24h },
          ].map((f, i) => (
            <div key={i} style={{ padding: "10px 12px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 7 }}>
              <div style={{ fontSize: 10, color: colors.textDim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500, fontFamily: f.label === "Mint Address" ? "monospace" : "inherit" }}>{f.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Distribution" style={{ marginBottom: 16 }}>
        {[
          { label: "Treasury Reserve", pct: 82.6, color: colors.purple },
          { label: "Community Rewards", pct: 8.2, color: colors.green },
          { label: "Team & Operations", pct: 5.1, color: colors.accent },
          { label: "Liquidity Pool", pct: 4.1, color: colors.cyan },
        ].map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: colors.textMuted, flex: 1 }}>{d.label}</span>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "100%", borderRadius: 2, background: d.color, width: `${d.pct}%` }} />
            </div>
            <span style={{ fontSize: 12, color: colors.textDim, width: 40, textAlign: "right" }}>{d.pct}%</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
};

// ─── Empower Page ────────────────────────────────────────────────────────────

const EmpowerContent = () => {
  const agents = [
    { id: "dragoon-guide", name: "Dragoon Guide", emoji: "🐴", knowledge: 8, tools: 3, status: "Configured" },
    { id: "va-navigator", name: "VA Benefits Navigator", emoji: "🏥", knowledge: 4, tools: 2, status: "Configured" },
    { id: "archivist", name: "The Archivist", emoji: "📜", knowledge: 6, tools: 1, status: "Configured" },
    { id: "herald", name: "Herald", emoji: "📣", knowledge: 2, tools: 4, status: "Configured" },
    { id: "reunion-coordinator", name: "Reunion Coordinator", emoji: "🎖️", knowledge: 3, tools: 2, status: "Partial" },
    { id: "memorial-guide", name: "Memorial Guide", emoji: "🕯️", knowledge: 0, tools: 0, status: "Not Configured" },
  ];

  return (
    <div>
      <PageHeader title="Empower" subtitle="Configure knowledge and tools for each agent" />
      <InfoBox color={colors.blue}>
        ℹ️ Assign knowledge bases and tools to each agent. Agents can only access resources explicitly granted here.
      </InfoBox>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {agents.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.accent + "16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 3 }}>{a.name}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: colors.textDim }}>
                <span>📚 {a.knowledge} knowledge bases</span>
                <span>🔧 {a.tools} tools</span>
              </div>
            </div>
            <StatusPill status={a.status} />
            <Btn variant="secondary" size="sm">Configure</Btn>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Align Page ──────────────────────────────────────────────────────────────

const AlignContent = () => {
  const workflows = [
    { id: "onboarding", name: "New Trooper Onboarding", agents: ["Dragoon Guide", "Herald"], status: "Active", triggers: "New member signup", desc: "Welcomes new members, introduces app features, connects to relevant groups based on service era." },
    { id: "va-referral", name: "VA Benefits Referral", agents: ["Dragoon Guide", "VA Navigator"], status: "Active", triggers: "Benefits question detected", desc: "Automatically hands off benefits-related queries from the Dragoon Guide to the specialized VA Navigator." },
    { id: "history-research", name: "History Research Pipeline", agents: ["Dragoon Guide", "Archivist"], status: "Active", triggers: "Deep history query", desc: "Routes complex historical questions through the Archivist for research, then returns summarized findings." },
    { id: "reunion-plan", name: "Reunion Planning Flow", agents: ["Reunion Coordinator", "Herald"], status: "Draft", triggers: "Reunion request", desc: "Coordinates reunion event creation, invitations, and logistics across the platform." },
    { id: "memorial", name: "Memorial & Tribute Flow", agents: ["Memorial Guide", "Herald"], status: "Draft", triggers: "Memorial request", desc: "Manages creation and publication of memorial tributes for fallen troopers." },
  ];

  return (
    <div>
      <PageHeader title="Align" subtitle="Configure agent workflows and orchestration patterns">
        <Btn>+ New Workflow</Btn>
      </PageHeader>
      <InfoBox color={colors.blue}>
        ℹ️ Workflows define how agents collaborate. When a trigger fires, agents execute in sequence or parallel.
      </InfoBox>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {workflows.map(w => (
          <div key={w.id} style={{ padding: "18px 20px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{w.name}</span>
              <StatusPill status={w.status} />
            </div>
            <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5, marginBottom: 10 }}>{w.desc}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: colors.textDim }}>Trigger: <span style={{ color: colors.accent }}>{w.triggers}</span></span>
              <span style={{ fontSize: 11, color: colors.textDim }}>Agents: {w.agents.map((a, i) => (
                <span key={i}><span style={{ color: colors.cyan }}>{a}</span>{i < w.agents.length - 1 ? " → " : ""}</span>
              ))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Experiences Page ────────────────────────────────────────────────────────

const ExperiencesContent = () => {
  const experiences = [
    { id: "dragoon-base", name: "Dragoon Base", status: "Live", icon: "🐴", desc: "The 2nd Cavalry Regiment heritage & community mobile app", scenes: 5, quests: 3, creator: "Gray Worcester", updated: "Apr 2026" },
    { id: "reunion-hub", name: "Reunion Hub", status: "Live", icon: "🎖️", desc: "Virtual reunion coordination and event management experience", scenes: 3, quests: 1, creator: "Dave Gettman", updated: "Mar 2026" },
    { id: "training-grounds", name: "Training Grounds", status: "Draft", icon: "⚔️", desc: "Interactive military history education experience for families and school groups", scenes: 2, quests: 0, creator: "Tim White", updated: "Feb 2026" },
  ];

  return (
    <div>
      <PageHeader title="Experiences" subtitle={`${experiences.length} experiences in Dragoon Base`}>
        <Btn>+ New Experience</Btn>
      </PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {experiences.map(e => (
          <Card key={e.id} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{e.name}</div>
                <StatusPill status={e.status} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.5, marginBottom: 12 }}>{e.desc}</div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: colors.textDim }}>
              <span>{e.scenes} Scenes</span>
              <span>{e.quests} Quests</span>
              <span>by {e.creator}</span>
              <span>{e.updated}</span>
            </div>
          </Card>
        ))}
        <Card style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, border: `1px dashed ${colors.border}` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>+</div>
            <div style={{ fontSize: 13, color: colors.textDim }}>New Experience</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Platform Settings Page ──────────────────────────────────────────────────

const PlatformSettingsContent = () => {
  const [tab, setTab] = useState("overview");
  const [name, setName] = useState("Dragoon Base");
  const [handle, setHandle] = useState("@dragoonbase");
  const [desc, setDesc] = useState("Creator studio for the 2nd Cavalry Regiment heritage & community platform. Building AI-powered experiences that honor 190 years of service.");

  const settingsTabs = [
    { id: "overview", label: "Overview" },
    { id: "theme", label: "Theme" },
    { id: "signals", label: "Signals" },
    { id: "users", label: "Users" },
    { id: "teams", label: "Teams" },
    { id: "databases", label: "Databases" },
    { id: "danger", label: "Danger Zone" },
  ];

  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Configure your Dragoon Base studio" />
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", flexWrap: "wrap" }}>
        {settingsTabs.map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "10px 18px", background: tab === t.id ? colors.accent + "16" : "transparent", border: "none", borderRight: i < settingsTabs.length - 1 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 12, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? colors.accent : colors.textMuted }}>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ maxWidth: 560 }}>
          <SectionDivider label="Platform Identity" />
          <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Handle"><Input value={handle} readOnly /></Field>
          <Field label="Description">
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", minHeight: 80, resize: "vertical", fontFamily: "inherit" }} />
          </Field>
          <SectionDivider label="Stats" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Members", value: "4,377" },
              { label: "Agents", value: "8" },
              { label: "Knowledge Bases", value: "8" },
              { label: "Experiences", value: "3" },
              { label: "Offerings", value: "8" },
              { label: "Proposals", value: PROPOSALS.length.toString() },
            ].map((s, i) => (
              <div key={i} style={{ padding: "12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>{s.value}</div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "users" && <PlatformUsersContent />}
      {tab === "teams" && <PlatformTeamsContent />}
      {tab === "databases" && <PlatformDatabasesContent />}
      {tab === "danger" && (
        <DangerZone>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: colors.red }}>Delete Platform</div><div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>Permanently delete this platform and all associated data.</div></div>
            <Btn danger>Delete Platform</Btn>
          </div>
        </DangerZone>
      )}
    </div>
  );
};

// ─── Library / Assets Page ───────────────────────────────────────────────────

const LibraryContent = () => {
  const assets = [
    { id: "a1", name: "Regiment Crest", type: "Image", format: "SVG", size: "24 KB", tags: ["branding", "heraldry"], uploaded: "2025-09-15" },
    { id: "a2", name: "Gold Spur Award Badge", type: "Image", format: "PNG", size: "126 KB", tags: ["awards", "tradition"], uploaded: "2025-10-02" },
    { id: "a3", name: "Battle of 73 Easting Map", type: "Image", format: "PNG", size: "2.1 MB", tags: ["battle", "desert-storm"], uploaded: "2025-10-18" },
    { id: "a4", name: "Cold War Patrol Route Map", type: "Image", format: "SVG", size: "89 KB", tags: ["cold-war", "border"], uploaded: "2025-11-05" },
    { id: "a5", name: "Taps Bugle Call", type: "Audio", format: "MP3", size: "1.2 MB", tags: ["ceremony", "audio"], uploaded: "2025-11-20" },
    { id: "a6", name: "Toujours Prêt Banner", type: "Image", format: "PNG", size: "340 KB", tags: ["branding", "motto"], uploaded: "2025-12-10" },
    { id: "a7", name: "Medal of Honor Star", type: "Image", format: "SVG", size: "18 KB", tags: ["moh", "awards"], uploaded: "2026-01-05" },
    { id: "a8", name: "Reunion Welcome Video", type: "Video", format: "MP4", size: "45.2 MB", tags: ["reunion", "video"], uploaded: "2026-02-15" },
  ];
  const [typeFilter, setTypeFilter] = useState("All");
  const types = ["All", "Image", "Audio", "Video"];
  const filtered = typeFilter === "All" ? assets : assets.filter(a => a.type === typeFilter);

  return (
    <div>
      <PageHeader title="Library" subtitle={`${assets.length} assets`}>
        <Btn>+ Upload</Btn>
      </PageHeader>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {types.map(t => <FilterPill key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {filtered.map(a => (
          <Card key={a.id} style={{ cursor: "pointer", padding: 14 }}>
            <div style={{ width: "100%", height: 80, borderRadius: 8, background: colors.bg, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 28, opacity: 0.5 }}>
                {a.type === "Image" ? "🖼️" : a.type === "Audio" ? "🎵" : "🎬"}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 3 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{a.format} · {a.size}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {a.tags.map(t => (
                <span key={t} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: colors.textDim }}>{t}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── Navigation Config ───────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Platform",
    items: [
      { id: "home", icon: "🐴", label: "Dragoon Base" },
      { id: "settings", icon: "lucide:settings", label: "Platform Settings" },
    ],
  },
  {
    label: "Agents",
    items: [
      { id: "agents", icon: "lucide:bot", label: "Agents" },
    ],
  },
  {
    label: "Clarity Process",
    items: [
      { id: "knowledge", icon: "lucide:book-open", label: "Inform" },
      { id: "prompts", icon: "lucide:message-square", label: "Instruct" },
      { id: "empower", icon: "lucide:zap", label: "Empower" },
      { id: "align", icon: "lucide:git-merge", label: "Align" },
    ],
  },
  {
    label: "Governance",
    items: [
      { id: "vibes", icon: "lucide:heart", label: "Vibes" },
      { id: "proposals", icon: "lucide:vote", label: "Proposals" },
      { id: "offerings", icon: "lucide:shopping-bag", label: "Offerings" },
      { id: "coins", icon: "lucide:coins", label: "Coins" },
    ],
  },
  {
    label: "Experiences",
    items: [
      { id: "experiences", icon: "lucide:compass", label: "Experiences" },
      { id: "library", icon: "lucide:image", label: "Library", count: 8 },
    ],
  },
];

// ─── App Shell ───────────────────────────────────────────────────────────────

export const App = () => {
  const [page, setPage] = useState("agents");
  const [selectorCycle, setSelectorCycle] = useState("dragoon-base");

  const PAGE_MAP = {
    settings: PlatformSettingsContent,
    agents: PlatformActorsContent,
    knowledge: PlatformKnowledgeContent,
    prompts: PlatformPromptsContent,
    empower: EmpowerContent,
    align: AlignContent,
    vibes: VibesContent,
    proposals: ProposalsContent,
    offerings: OfferingsContent,
    coins: CoinsContent,
    experiences: ExperiencesContent,
    library: LibraryContent,
    tools: PlatformToolsContent,
    bots: PlatformBotsContent,
    users: PlatformUsersContent,
    teams: PlatformTeamsContent,
    databases: PlatformDatabasesContent,
  };

  const ActivePage = PAGE_MAP[page];

  return (
    <div style={{ display: "flex", height: "100vh", background: colors.bg, color: colors.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: colors.bg, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: colors.accent, textTransform: "uppercase" }}>Kinship Studio</span>
        </div>

        {/* Cycle Selector */}
        <CycleSelector
          current={selectorCycle}
          onSwitch={(id) => {
            setSelectorCycle(id);
            if (id === "platform") setPage("settings");
          }}
          isWizard={true}
          extraCycles={[
            { id: "dragoon-base", name: "🐴  Dragoon Base", type: "cycle" },
            { id: "reunion-hub", name: "🎖️  Reunion Hub", type: "cycle" },
            { id: "training-grounds", name: "⚔️  Training Grounds", type: "cycle" },
          ]}
        />

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <SectionLabel>{section.label}</SectionLabel>
              {section.items.map(item => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={page === item.id}
                  count={item.count}
                  onClick={() => setPage(item.id)}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
        <div style={{ maxWidth: 900 }}>
          {page === "home" ? (
            <div>
              <PageHeader title="Dragoon Base" subtitle="Creator studio for the 2nd Cavalry Regiment heritage & community platform" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Members", value: "4,377", icon: "👥" },
                  { label: "Active Agents", value: "5", icon: "🤖" },
                  { label: "Knowledge Bases", value: "8", icon: "📚" },
                  { label: "Experiences", value: "3", icon: "🎮" },
                  { label: "Active Proposals", value: PROPOSALS.filter(p => p.status === "Active").length.toString(), icon: "🗳️" },
                  { label: "Total Offerings", value: "8", icon: "🛍️" },
                ].map((s, i) => (
                  <Card key={i} onClick={() => {
                    const pageMap = { Members: "users", "Active Agents": "agents", "Knowledge Bases": "knowledge", Experiences: "experiences", "Active Proposals": "proposals", "Total Offerings": "offerings" };
                    const target = pageMap[s.label];
                    if (target) setPage(target);
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.accent }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: colors.textDim }}>{s.label}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <SectionDivider label="Recent Activity" />
              {[
                { text: "New proposal: 'Integrate Regimental Store' created by Gray Worcester", time: "2 hours ago", icon: "🗳️" },
                { text: "VA Benefits Navigation Session claimed by 3 new members", time: "5 hours ago", icon: "🏥" },
                { text: "Regimental Crest & Heraldry Reference uploaded to knowledge base", time: "1 day ago", icon: "📚" },
                { text: "Herald bot sent reunion reminder to 312 members", time: "2 days ago", icon: "📣" },
                { text: "Proposal 'Create Women in the Regiment Feature' reached 200 votes", time: "3 days ago", icon: "✅" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <span style={{ fontSize: 16, marginTop: 2 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: colors.textMuted }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : ActivePage ? (
            <ActivePage />
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", color: colors.textDim }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Coming Soon</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>This section is under construction.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
