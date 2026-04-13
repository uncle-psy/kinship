  // ─── Vibes System ────────────────────────────────────────────────────────────
  if (page === "progress") {

    const SCOPE_META = {
      network:    { label: "Network",    icon: "lucide:globe",    color: "#F59E0B", desc: "Constitutional invariants for the entire ecosystem" },
      platform:   { label: "Platform",   icon: "lucide:layers",   color: "#3B82F6", desc: "Platform-wide tonal envelope" },
      project:    { label: "Project",    icon: "lucide:folder",   color: "#8B5CF6", desc: "Thematic and methodological constraints" },
      experience: { label: "Experience", icon: "lucide:compass",  color: "#10B981", desc: "Room tone for specific interactions" },
      agent:      { label: "Agent",      icon: "lucide:bot",      color: "#EC4899", desc: "Persona-level expression bounds" },
    };
    const SCOPES = ["network","platform","project","experience","agent"];

    const AFFECT_DIMS = [
      { key: "warmth",   label: "Warmth",     lo: "Cool",      hi: "Warm"       },
      { key: "energy",   label: "Energy",     lo: "Still",     hi: "Electric"   },
      { key: "tone",     label: "Tone",       lo: "Solemn",    hi: "Playful"    },
      { key: "direct",   label: "Directness", lo: "Gentle",    hi: "Direct"     },
      { key: "challenge",label: "Challenge",  lo: "Nurturing", hi: "Demanding"  },
      { key: "ritual",   label: "Ritual",     lo: "Casual",    hi: "Ceremonial" },
    ];

    const GUARDRAIL_DEFS = [
      { id: "no-coercion",        label: "No coercive persuasion or manipulation",             cat: "Safety" },
      { id: "anti-sycophancy",    label: "Anti-sycophancy — prioritize truth over agreement",  cat: "Epistemic" },
      { id: "no-extraction",      label: "No dark-pattern engagement optimization",            cat: "Safety" },
      { id: "autonomy",           label: "Protect user autonomy and meaningful choice",        cat: "Safety" },
      { id: "antibypass",         label: "Spiritual antibypass — no grandiosity or inflation",  cat: "Spiritual" },
      { id: "reality-testing",    label: "Require grounding and reality-testing",               cat: "Spiritual" },
      { id: "crisis-pathway",     label: "Escalate to human support when crisis detected",     cat: "Safety" },
      { id: "epistemic-humility", label: "Epistemic humility — no confident fabrication",      cat: "Epistemic" },
      { id: "no-shame",           label: "No shaming, demeaning, or humiliating language",     cat: "Relational" },
      { id: "consent-boundaries", label: "Enforce consent and boundary respect",               cat: "Relational" },
      { id: "no-delusion",        label: "No delusion co-creation or reinforcement",           cat: "Epistemic" },
      { id: "trauma-informed",    label: "Trauma-informed interaction guarantees",              cat: "Safety" },
    ];

    const VIBES_INIT = [
      {
        id: "kinship-constitution", name: "Kinship Constitution", scope: "network",
        desc: "The master vibes — non-negotiable invariants defining how this ecosystem relates to humans and to itself. Even adversarial sub-experiences are nested inside this cooperative frame.",
        color: "#F59E0B", status: "active",
        affect: { warmth: 70, energy: 50, tone: 45, direct: 55, challenge: 50, ritual: 40 },
        guardrails: ["no-coercion","anti-sycophancy","no-extraction","autonomy","antibypass","reality-testing","crisis-pathway","epistemic-humility","no-shame","consent-boundaries","no-delusion","trauma-informed"],
        norms: [
          { type: "require", text: "Non-extraction social contract" },
          { type: "require", text: "Ecosystem cooperation — compete locally, never undermine network trust" },
          { type: "require", text: "Reality-respecting compassion" },
          { type: "prohibit", text: "Delusion co-creation or reinforcement" },
          { type: "prohibit", text: "Sycophantic agreement over truth" },
        ],
        maxIntensity: 80, pacing: "adaptive",
      },
      {
        id: "growth-space", name: "Growth Space", scope: "platform",
        desc: "Clinical-adjacent, gentle, growth-oriented. For platforms focused on personal development, therapeutic exploration, and structured inner work.",
        color: "#3B82F6", status: "active",
        affect: { warmth: 80, energy: 30, tone: 35, direct: 40, challenge: 35, ritual: 55 },
        guardrails: ["no-coercion","anti-sycophancy","autonomy","crisis-pathway","consent-boundaries","trauma-informed"],
        norms: [
          { type: "encourage", text: "Reflective listening" },
          { type: "encourage", text: "Motivational interviewing techniques" },
          { type: "require", text: "Consent before deep psychological work" },
          { type: "prohibit", text: "Dismissive or invalidating language" },
        ],
        maxIntensity: 60, pacing: "slow",
      },
      {
        id: "creative-playground", name: "Creative Playground", scope: "platform",
        desc: "Playful, experimental, expressive. For platforms centered on creative exploration, improvisation, and collaborative art-making.",
        color: "#06B6D4", status: "active",
        affect: { warmth: 65, energy: 80, tone: 85, direct: 50, challenge: 30, ritual: 15 },
        guardrails: ["no-coercion","no-extraction","autonomy","no-shame"],
        norms: [
          { type: "encourage", text: "Spontaneous expression" },
          { type: "encourage", text: "Collaborative improvisation" },
          { type: "prohibit", text: "Judgment of creative attempts" },
        ],
        maxIntensity: 90, pacing: "dynamic",
      },
      {
        id: "shadow-integration", name: "Shadow Integration", scope: "project",
        desc: "Deep, contemplative, psychologically intense. For exploring difficult emotions, unconscious patterns, and personal transformation through structured containers.",
        color: "#8B5CF6", status: "active",
        affect: { warmth: 70, energy: 25, tone: 15, direct: 65, challenge: 60, ritual: 75 },
        guardrails: ["no-coercion","anti-sycophancy","antibypass","reality-testing","crisis-pathway","consent-boundaries","no-delusion"],
        norms: [
          { type: "require", text: "Consent before deep psychological work" },
          { type: "require", text: "Grounding prompts in liminal contexts" },
          { type: "encourage", text: "Repair attempts after rupture" },
          { type: "prohibit", text: "Reinforcement of implausible beliefs" },
        ],
        maxIntensity: 70, pacing: "slow",
      },
      {
        id: "leadership-crucible", name: "Leadership Crucible", scope: "project",
        desc: "Challenging, direct, accountability-focused. For rites-of-passage, leadership development, and capacity-building where growth requires pressure.",
        color: "#EF4444", status: "active",
        affect: { warmth: 50, energy: 75, tone: 30, direct: 90, challenge: 85, ritual: 60 },
        guardrails: ["no-coercion","anti-sycophancy","autonomy","no-shame","consent-boundaries"],
        norms: [
          { type: "encourage", text: "Direct, specific feedback grounded in observation" },
          { type: "require", text: "Restorative closure after challenge" },
          { type: "prohibit", text: "Shaming as motivational strategy" },
        ],
        maxIntensity: 85, pacing: "dynamic",
      },
      {
        id: "ceremony-container", name: "Ceremony Container", scope: "experience",
        desc: "Sacred, slow, high ritual intensity. The room tone for ceremonies, rites, and group containers where participants enter a shared liminal space together.",
        color: "#10B981", status: "active",
        affect: { warmth: 75, energy: 20, tone: 10, direct: 35, challenge: 30, ritual: 95 },
        guardrails: ["no-coercion","antibypass","reality-testing","consent-boundaries","no-shame","trauma-informed"],
        norms: [
          { type: "require", text: "Tone signaled before entry" },
          { type: "require", text: "Cultural sensitivity acknowledgment" },
          { type: "encourage", text: "Collective synchrony and grounding" },
          { type: "prohibit", text: "Breaking container without group consent" },
        ],
        maxIntensity: 50, pacing: "slow",
      },
      {
        id: "arena-mode", name: "Arena Mode", scope: "experience",
        desc: "Competitive, electric, high energy. For game sessions, challenges, and adversarial experiences — always nested inside the deeper cooperative frame.",
        color: "#F97316", status: "active",
        affect: { warmth: 35, energy: 95, tone: 70, direct: 80, challenge: 90, ritual: 20 },
        guardrails: ["no-coercion","no-extraction","autonomy","no-shame"],
        norms: [
          { type: "require", text: "Restorative closure after competition" },
          { type: "require", text: "Cooperation constraint — no undermining network trust" },
          { type: "prohibit", text: "Humiliation or sabotage" },
        ],
        maxIntensity: 95, pacing: "fast",
      },
      {
        id: "gentle-guide", name: "Gentle Guide", scope: "agent",
        desc: "Warm, patient, nurturing. For holding space, reflective questioning, and supporting growth without pushing. Uses autonomy-supportive conversational moves.",
        color: "#EC4899", status: "active",
        affect: { warmth: 90, energy: 20, tone: 50, direct: 25, challenge: 15, ritual: 35 },
        guardrails: ["no-coercion","anti-sycophancy","crisis-pathway","consent-boundaries"],
        norms: [
          { type: "encourage", text: "Reflective listening and open questions" },
          { type: "encourage", text: "Autonomy-supportive questioning" },
          { type: "prohibit", text: "Unsolicited advice or direction" },
        ],
        maxIntensity: 40, pacing: "slow",
      },
      {
        id: "fierce-ally", name: "Fierce Ally", scope: "agent",
        desc: "Direct, challenging, deeply caring. Sees potential and refuses to let you settle. Precise, invested, honest — the demanding friend who holds you accountable.",
        color: "#A855F7", status: "active",
        affect: { warmth: 60, energy: 70, tone: 35, direct: 85, challenge: 80, ritual: 30 },
        guardrails: ["no-coercion","anti-sycophancy","autonomy","no-shame"],
        norms: [
          { type: "encourage", text: "Direct, specific feedback" },
          { type: "require", text: "Care must be evident even in challenge" },
          { type: "prohibit", text: "Mockery, derision, or contempt" },
        ],
        maxIntensity: 80, pacing: "dynamic",
      },
    ];

    const [vibes, setVibes] = useState(VIBES_INIT);
    const [view, setView] = useState(null);
    const [scopeFilter, setFilter] = useState("all");
    const [mainTab, setMainTab] = useState("library");

    // ── VibeCard (proper component for hooks) ──────────────────────────────
    const VibeCard = ({ v, onClick }) => {
      const [hov, setHov] = useState(false);
      const s = SCOPE_META[v.scope];
      return (
        <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{ padding: "18px 20px", background: hov ? colors.surfaceHover : colors.surface, border: `1px solid ${hov ? s.color + "66" : colors.border}`, borderRadius: 12, cursor: "pointer", transition: "all .15s", borderLeft: `3px solid ${s.color}`, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{v.name}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: s.color + "18", color: s.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.desc}</div>
            </div>
            <Icon name="lucide:chevron-right" size={14} style={{ color: colors.textDim, flexShrink: 0, marginTop: 4 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {AFFECT_DIMS.map(d => (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 8, color: colors.textDim, width: 42, textAlign: "right", flexShrink: 0 }}>{d.label}</span>
                <div style={{ flex: 1, height: 3, background: colors.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${v.affect[d.key]}%`, background: s.color, borderRadius: 2, transition: "width .2s" }} />
                </div>
                <span style={{ fontSize: 8, color: colors.textDim, width: 16, flexShrink: 0 }}>{v.affect[d.key]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: colors.textDim }}>{v.guardrails.length} guardrails</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: colors.textDim }}>{v.norms.length} norms</span>
            {v.pacing && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: colors.textDim }}>{v.pacing}</span>}
          </div>
        </div>
      );
    };

    // ── VibeEditor ─────────────────────────────────────────────────────────
    const VibeEditor = ({ vibe, isNew, onBack }) => {
      const [name, setName] = useState(vibe?.name || "");
      const [scope, setScope] = useState(vibe?.scope || "experience");
      const [desc, setDesc] = useState(vibe?.desc || "");
      const [vColor, setVColor] = useState(vibe?.color || SCOPE_META.experience.color);
      const [affect, setAffect] = useState(vibe?.affect || { warmth: 50, energy: 50, tone: 50, direct: 50, challenge: 50, ritual: 50 });
      const [guardrails, setGuardrails] = useState(vibe?.guardrails || ["no-coercion","autonomy","no-shame","consent-boundaries"]);
      const [norms, setNorms] = useState(vibe?.norms || []);
      const [maxInt, setMaxInt] = useState(vibe?.maxIntensity ?? 70);
      const [pacing, setPacing] = useState(vibe?.pacing || "adaptive");
      const [tab, setTab] = useState("identity");
      const [saving, setSaving] = useState(false);
      const [confirmDel, setConfDel] = useState(false);
      const [newNormText, setNewNormText] = useState("");
      const [newNormType, setNewNormType] = useState("encourage");

      const COLOR_OPTS = ["#F59E0B","#3B82F6","#8B5CF6","#10B981","#EC4899","#EF4444","#06B6D4","#F97316","#A855F7","#6FC3FF","#A8E063","#F7DC6F"];
      const PACING_OPTS = [
        { id: "slow", label: "Slow", desc: "Contemplative, measured" },
        { id: "adaptive", label: "Adaptive", desc: "Context-responsive" },
        { id: "dynamic", label: "Dynamic", desc: "Active, varied rhythm" },
        { id: "fast", label: "Fast", desc: "Energetic, rapid-fire" },
      ];

      const toggleGuardrail = id => setGuardrails(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
      const removeNorm = i => setNorms(norms.filter((_, j) => j !== i));
      const addNorm = () => { if (newNormText.trim()) { setNorms([...norms, { type: newNormType, text: newNormText.trim() }]); setNewNormText(""); } };

      const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
          const updated = { id: vibe?.id || name.toLowerCase().replace(/\s+/g, "-"), name, scope, desc, color: vColor, status: "active", affect, guardrails, norms, maxIntensity: maxInt, pacing };
          if (isNew) setVibes(prev => [...prev, updated]);
          else setVibes(prev => prev.map(v => v.id === vibe.id ? updated : v));
          setSaving(false);
          onBack();
        }, 500);
      };

      const TABS = [
        { id: "identity", label: "Identity" },
        { id: "affect",   label: "Affect Posture" },
        { id: "norms",    label: "Norms & Guardrails" },
      ];
      const sm = SCOPE_META[scope];

      return (
        <div style={{ maxWidth: 720 }}>
          <PageHeader title={isNew ? "New Vibe" : `Edit: ${vibe.name}`} subtitle={isNew ? "Create a reusable vibe contract that agents and experiences can embody" : "Changes cascade to all agents and experiences using this vibe"} onBack={onBack}>
            {!isNew && <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, background: sm.color + "18", color: sm.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{sm.label}</span>}
          </PageHeader>

          <div style={{ display: "flex", gap: 0, marginBottom: 24, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
            {TABS.map((t, i) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "11px 8px", background: tab === t.id ? colors.accent + "18" : "transparent", border: "none", borderRight: i < TABS.length - 1 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit" }}>
                <span style={{ fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? colors.accent : colors.textMuted }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Identity ── */}
          {tab === "identity" && (
            <div>
              <SectionDivider label="Identity" />
              <Field label="Name" hint="The name for this vibe contract — shown when attaching to agents or experiences.">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gentle Guide" />
              </Field>
              <Field label="Scope" hint="Which level of the hierarchy this vibe operates at. Higher scopes constrain lower ones.">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {SCOPES.map(s => {
                    const m = SCOPE_META[s];
                    return (
                      <button key={s} onClick={() => { setScope(s); setVColor(m.color); }}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: scope === s ? m.color + "18" : colors.surface, border: `1px solid ${scope === s ? m.color : colors.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
                        <Icon name={m.icon} size={13} style={{ color: scope === s ? m.color : colors.textDim }} />
                        <span style={{ fontSize: 12, fontWeight: scope === s ? 600 : 400, color: scope === s ? m.color : colors.textMuted }}>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: colors.textDim, marginTop: 6 }}>{SCOPE_META[scope].desc}</div>
              </Field>
              <Field label="Description" hint="Explain what this vibe contract embodies — the emotional, relational, and social physics it creates.">
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  placeholder="e.g. A warm, patient environment for reflective growth — autonomy-supportive questioning without unsolicited advice."
                  style={{ width: "100%", padding: "9px 12px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, color: colors.text, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }} />
              </Field>
              <Field label="Color">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COLOR_OPTS.map(c => (
                    <button key={c} onClick={() => setVColor(c)}
                      style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${vColor === c ? "#fff" : "transparent"}`, background: c, cursor: "pointer", outline: vColor === c ? `2px solid ${c}` : "none" }} />
                  ))}
                </div>
              </Field>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <Btn onClick={handleSave}>{saving ? "Saving..." : isNew ? "Create Vibe" : "Save Changes"}</Btn>
                <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
              </div>
            </div>
          )}

          {/* ── Affect Posture ── */}
          {tab === "affect" && (
            <div>
              <SectionDivider label="Affect Dimensions" />
              <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 18, lineHeight: 1.6 }}>
                Set the emotional coordinates for this vibe. These dimensions shape how agents express themselves — their tone, pacing, and relational style.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {AFFECT_DIMS.map(d => (
                  <div key={d.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{d.label}</span>
                      <span style={{ fontSize: 12, color: sm.color, fontWeight: 700 }}>{affect[d.key]}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, color: colors.textDim, width: 60, textAlign: "right" }}>{d.lo}</span>
                      <input type="range" min={0} max={100} value={affect[d.key]}
                        onChange={e => setAffect({ ...affect, [d.key]: parseInt(e.target.value) })}
                        style={{ flex: 1, accentColor: sm.color, height: 4 }} />
                      <span style={{ fontSize: 10, color: colors.textDim, width: 60 }}>{d.hi}</span>
                    </div>
                  </div>
                ))}
              </div>

              <SectionDivider label="Expression Bounds" />
              <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 14, lineHeight: 1.6 }}>
                Set limits on how intensely this vibe can express, and the pacing style agents should use.
              </p>
              <Field label="Maximum Intensity" hint={`Capped at ${maxInt}% — even high-energy personas stay within this bound.`}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min={10} max={100} value={maxInt}
                    onChange={e => setMaxInt(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: sm.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: sm.color, width: 36, textAlign: "right" }}>{maxInt}%</span>
                </div>
              </Field>
              <Field label="Pacing Style" hint="How the agent modulates conversational rhythm under this vibe.">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {PACING_OPTS.map(p => (
                    <button key={p.id} onClick={() => setPacing(p.id)}
                      style={{ padding: "8px 14px", background: pacing === p.id ? sm.color + "18" : colors.surface, border: `1px solid ${pacing === p.id ? sm.color : colors.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
                      <div style={{ fontSize: 12, fontWeight: pacing === p.id ? 600 : 400, color: pacing === p.id ? sm.color : colors.textMuted }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <Btn onClick={handleSave}>{saving ? "Saving..." : "Save Changes"}</Btn>
                <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
              </div>
            </div>
          )}

          {/* ── Norms & Guardrails ── */}
          {tab === "norms" && (
            <div>
              <SectionDivider label="Hard Guardrails" />
              <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 14, lineHeight: 1.6 }}>
                Non-negotiable constraints enforced at runtime — agents cannot override them. Higher-scope guardrails are inherited automatically.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                {GUARDRAIL_DEFS.map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: guardrails.includes(g.id) ? colors.surface : "transparent", border: `1px solid ${guardrails.includes(g.id) ? sm.color + "33" : colors.borderSubtle}`, borderRadius: 8 }}>
                    <Toggle value={guardrails.includes(g.id)} onChange={() => toggleGuardrail(g.id)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: guardrails.includes(g.id) ? colors.text : colors.textDim }}>{g.label}</div>
                    </div>
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 6, background: "rgba(255,255,255,0.04)", color: colors.textDim }}>{g.cat}</span>
                  </div>
                ))}
              </div>

              <SectionDivider label="Relational Norms" />
              <p style={{ fontSize: 12, color: colors.textDim, marginBottom: 14, lineHeight: 1.6 }}>
                Soft norms that shape interaction patterns. Encouraged behaviors are modeled; required behaviors are enforced; prohibited behaviors are blocked.
              </p>
              {norms.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {norms.map((n, i) => {
                    const tc = n.type === "encourage" ? colors.green : n.type === "require" ? colors.blue : colors.red;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: tc + "15", color: tc, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, flexShrink: 0 }}>{n.type}</span>
                        <span style={{ fontSize: 12, color: colors.textMuted, flex: 1 }}>{n.text}</span>
                        <button onClick={() => removeNorm(i)} style={{ background: "none", border: "none", color: colors.textDim, cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 24 }}>
                <select value={newNormType} onChange={e => setNewNormType(e.target.value)}
                  style={{ padding: "6px 8px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMuted, fontSize: 11, outline: "none", fontFamily: "inherit" }}>
                  <option value="encourage">Encourage</option>
                  <option value="require">Require</option>
                  <option value="prohibit">Prohibit</option>
                </select>
                <input value={newNormText} onChange={e => setNewNormText(e.target.value)} placeholder="Add a relational norm..."
                  onKeyDown={e => e.key === "Enter" && addNorm()}
                  style={{ flex: 1, padding: "6px 10px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                <Btn variant="secondary" size="sm" onClick={addNorm}>Add</Btn>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <Btn onClick={handleSave}>{saving ? "Saving..." : "Save Changes"}</Btn>
                <Btn variant="secondary" onClick={onBack}>Cancel</Btn>
              </div>

              {!isNew && (
                <div style={{ marginTop: 32, padding: "20px 24px", background: colors.red + "08", border: `1px solid ${colors.red}22`, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.red, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Danger Zone</div>
                  {!confirmDel ? (
                    <>
                      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>Removing this vibe detaches it from all agents and experiences currently using it.</p>
                      <Btn danger onClick={() => setConfDel(true)}>Delete Vibe</Btn>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: colors.red, fontWeight: 500, marginBottom: 12 }}>Delete "{vibe.name}" and detach from all references?</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn danger onClick={() => { setVibes(prev => prev.filter(v => v.id !== vibe.id)); onBack(); }}>Confirm Delete</Btn>
                        <Btn variant="secondary" onClick={() => setConfDel(false)}>Cancel</Btn>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

    // ── Router ────────────────────────────────────────────────────────────
    if (view === "new") return <VibeEditor isNew onBack={() => setView(null)} />;
    const editVibe = vibes.find(v => v.id === view);
    if (editVibe) return <VibeEditor vibe={editVibe} onBack={() => setView(null)} />;

    // ── Dashboard ─────────────────────────────────────────────────────────
    const filtered = scopeFilter === "all" ? vibes : vibes.filter(v => v.scope === scopeFilter);
    const totalGuardrails = new Set(vibes.flatMap(v => v.guardrails)).size;
    const totalNorms = vibes.reduce((s, v) => s + v.norms.length, 0);

    return (
      <div>
        <PageHeader title="Vibes" subtitle="Define the relational norms, affective tone, and social physics of your ecosystem — reusable contracts that agents and experiences embody">
          <Btn onClick={() => setView("new")}>+ Create Vibe</Btn>
        </PageHeader>

        {/* Main tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
          {[
            { id: "library",   label: "Library",   icon: "lucide:layout-grid" },
            { id: "cascade",   label: "Cascade",   icon: "lucide:git-merge" },
            { id: "scorecard", label: "Scorecard",  icon: "lucide:activity" },
          ].map((t, i) => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 8px", background: mainTab === t.id ? colors.accent + "18" : "transparent", border: "none", borderRight: i < 2 ? `1px solid ${colors.border}` : "none", cursor: "pointer", fontFamily: "inherit" }}>
              <Icon name={t.icon} size={13} style={{ color: mainTab === t.id ? colors.accent : colors.textDim }} />
              <span style={{ fontSize: 13, fontWeight: mainTab === t.id ? 600 : 400, color: mainTab === t.id ? colors.accent : colors.textMuted }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Library ── */}
        {mainTab === "library" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setFilter("all")}
                style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${scopeFilter === "all" ? colors.accent : colors.border}`, background: scopeFilter === "all" ? colors.accent + "15" : "transparent", color: scopeFilter === "all" ? colors.accent : colors.textDim, fontSize: 12, fontWeight: scopeFilter === "all" ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                All ({vibes.length})
              </button>
              {SCOPES.map(s => {
                const m = SCOPE_META[s];
                const c = vibes.filter(v => v.scope === s).length;
                return (
                  <button key={s} onClick={() => setFilter(s)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 20, border: `1px solid ${scopeFilter === s ? m.color : colors.border}`, background: scopeFilter === s ? m.color + "15" : "transparent", color: scopeFilter === s ? m.color : colors.textDim, fontSize: 12, fontWeight: scopeFilter === s ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                    <Icon name={m.icon} size={11} style={{ color: scopeFilter === s ? m.color : colors.textDim }} />
                    {m.label} ({c})
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Total Vibes",  value: String(vibes.length),                          icon: "lucide:sparkles",       color: colors.accent },
                { label: "Guardrails",    value: String(totalGuardrails),                       icon: "lucide:shield",         color: colors.green },
                { label: "Norms",         value: String(totalNorms),                            icon: "lucide:heart-handshake",color: colors.purple },
                { label: "Scope Coverage",value: new Set(vibes.map(v => v.scope)).size + "/5",  icon: "lucide:layers",         color: colors.cyan },
                { label: "Active",        value: String(vibes.filter(v => v.status === "active").length), icon: "lucide:zap",  color: colors.warning },
              ].map((s, i) => (
                <div key={i} style={{ padding: "14px 16px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <Icon name={s.icon} size={13} style={{ color: s.color }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase" }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{s.value}</div>
                </div>
              ))}
            </div>

            <SectionDivider label={`Vibe Contracts (${filtered.length})`} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 12 }}>
              {filtered.map(v => <VibeCard key={v.id} v={v} onClick={() => setView(v.id)} />)}
              <div onClick={() => setView("new")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "24px", border: `2px dashed ${colors.border}`, borderRadius: 12, cursor: "pointer", color: colors.textDim, transition: "all .15s", minHeight: 180 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textDim; }}>
                <Icon name="lucide:plus-circle" size={24} />
                <span style={{ fontSize: 13 }}>Create Vibe</span>
              </div>
            </div>
          </>
        )}

        {/* ── Cascade ── */}
        {mainTab === "cascade" && (() => {
          const cascadePath = [
            { scope: "network",    vibeId: "kinship-constitution" },
            { scope: "platform",   vibeId: "growth-space" },
            { scope: "project",    vibeId: "shadow-integration" },
            { scope: "experience", vibeId: "ceremony-container" },
            { scope: "agent",      vibeId: "gentle-guide" },
          ];
          const effGuardrails = new Set();
          const effNorms = [];
          let effAffect = {};
          AFFECT_DIMS.forEach(d => { effAffect[d.key] = 0; });
          let cnt = 0;
          cascadePath.forEach(({ vibeId }) => {
            const v = vibes.find(vb => vb.id === vibeId);
            if (v) {
              v.guardrails.forEach(g => effGuardrails.add(g));
              v.norms.forEach(n => effNorms.push(n));
              AFFECT_DIMS.forEach(d => { effAffect[d.key] += v.affect[d.key]; });
              cnt++;
            }
          });
          if (cnt > 0) AFFECT_DIMS.forEach(d => { effAffect[d.key] = Math.round(effAffect[d.key] / cnt); });

          return (
            <div>
              <div style={{ marginBottom: 20, padding: "16px 20px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>
                  Vibes cascade like CSS: each level inherits from above, adds its own constraints, and passes an <span style={{ color: colors.accent, fontWeight: 600 }}>effective vibe contract</span> downward. Invariants are non-negotiable; local expression is flexible within bounds. When an agent enters a new context, a <span style={{ color: colors.accent, fontWeight: 600 }}>vibe handshake</span> computes which parts of its persona are admissible.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {cascadePath.map(({ scope, vibeId }, i) => {
                  const sm = SCOPE_META[scope];
                  const v = vibes.find(vb => vb.id === vibeId);
                  if (!v) return null;
                  return (
                    <React.Fragment key={scope}>
                      <div style={{ padding: "16px 20px", background: colors.surface, border: `1px solid ${sm.color}33`, borderLeft: `3px solid ${sm.color}`, borderRadius: 10, position: "relative" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <Icon name={sm.icon} size={14} style={{ color: sm.color }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: sm.color, textTransform: "uppercase" }}>{sm.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{v.name}</span>
                        </div>
                        <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 8, lineHeight: 1.5 }}>{v.desc}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: sm.color + "12", color: sm.color }}>{v.guardrails.length} guardrails</span>
                          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: sm.color + "12", color: sm.color }}>{v.norms.length} norms</span>
                          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: sm.color + "12", color: sm.color }}>max {v.maxIntensity}%</span>
                          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: sm.color + "12", color: sm.color }}>{v.pacing}</span>
                        </div>
                      </div>
                      {i < cascadePath.length - 1 && (
                        <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                          <div style={{ width: 2, height: 20, background: colors.border }} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                <div style={{ width: 2, height: 24, background: colors.accent }} />
              </div>

              <div style={{ padding: "20px 24px", background: colors.accent + "08", border: `2px solid ${colors.accent}44`, borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Icon name="lucide:shield-check" size={16} style={{ color: colors.accent }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.accent }}>Effective Vibe Contract</span>
                  <span style={{ fontSize: 10, color: colors.textDim }}>— computed at runtime for this path</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 8 }}>Affect Blend</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {AFFECT_DIMS.map(d => (
                        <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 9, color: colors.textDim, width: 50, textAlign: "right" }}>{d.label}</span>
                          <div style={{ flex: 1, height: 4, background: colors.border, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${effAffect[d.key]}%`, background: colors.accent, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 9, color: colors.accent, fontWeight: 600, width: 18 }}>{effAffect[d.key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 8 }}>Active Guardrails ({effGuardrails.size})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {[...effGuardrails].slice(0, 8).map(gId => {
                        const g = GUARDRAIL_DEFS.find(gd => gd.id === gId);
                        return g ? (
                          <div key={gId} style={{ fontSize: 10, color: colors.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ color: colors.green, fontSize: 6 }}>●</span> {g.label.split("—")[0].trim()}
                          </div>
                        ) : null;
                      })}
                      {effGuardrails.size > 8 && <span style={{ fontSize: 10, color: colors.textDim }}>+{effGuardrails.size - 8} more</span>}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase", marginBottom: 8 }}>Accumulated Norms ({effNorms.length})</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {effNorms.map((n, i) => {
                      const tc = n.type === "encourage" ? colors.green : n.type === "require" ? colors.blue : colors.red;
                      return <span key={i} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: tc + "12", color: tc, border: `1px solid ${tc}22` }}>{n.type}: {n.text}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Scorecard ── */}
        {mainTab === "scorecard" && (
          <div>
            <div style={{ marginBottom: 20, padding: "16px 20px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>
                The Vibes Scorecard monitors ecosystem health in real time. Every interaction feeds the measurement layer — a multi-objective system that treats vibes as <span style={{ color: colors.accent, fontWeight: 600 }}>control variables</span>, not aesthetic labels. No single metric is optimized in isolation; the system maintains a Pareto balance with hard constraints.
              </div>
            </div>

            <SectionDivider label="Health Metrics" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Affect Coherence",     value: "94%",  desc: "Agent expressions match vibe contracts",  icon: "lucide:heart-pulse",    color: colors.green },
                { label: "Guardrail Compliance",  value: "100%", desc: "Zero runtime violations detected",       icon: "lucide:shield-check",   color: colors.green },
                { label: "Sycophancy Risk",       value: "Low",  desc: "Truth-over-agreement ratio healthy",     icon: "lucide:alert-triangle", color: colors.green },
                { label: "Psychological Safety",  value: "87%",  desc: "Group risk-taking without punishment",   icon: "lucide:users",          color: colors.blue },
                { label: "Alliance Proxy",        value: "82%",  desc: "Digital therapeutic alliance measure",   icon: "lucide:handshake",      color: colors.purple },
                { label: "Repair Success",        value: "91%",  desc: "Rupture-and-repair completion rate",     icon: "lucide:heart",          color: colors.cyan },
              ].map((m, i) => (
                <div key={i} style={{ padding: "16px 18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Icon name={m.icon} size={13} style={{ color: m.color }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: colors.textDim, textTransform: "uppercase" }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: colors.textDim }}>{m.desc}</div>
                </div>
              ))}
            </div>

            <SectionDivider label="Monitoring Signals" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Dialogue Signals",    items: ["Toxicity & harassment detection", "Coercion markers", "Consent & boundary violations", "Repair attempts", "Validation vs escalation"], color: colors.green },
                { label: "Relational Process",   items: ["Turn-taking fairness", "Responsiveness & attunement", "Escalation trajectories", "Non-shaming feedback patterns"], color: colors.blue },
                { label: "Epistemic Risk",       items: ["Hallucination risk in factual claims", "Sycophancy markers", "Implausible belief reinforcement", "Confident fabrication detection"], color: colors.purple },
                { label: "Safety Signals",       items: ["Self-harm ideation detection", "Crisis indicators & escalation", "Delusion escalation patterns", "Vulnerable user detection"], color: colors.red },
              ].map((cat, i) => (
                <div key={i} style={{ padding: "16px 18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: colors.text }}>{cat.label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.items.map((item, j) => (
                      <div key={j} style={{ fontSize: 11, color: colors.textDim, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: cat.color, fontSize: 6 }}>●</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <SectionDivider label="Enforcement Layers" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Compile-Time", desc: "Creator-time validation: flag disallowed vibe combinations before deployment (e.g. high spiritual authority + high intimacy + no reality-check guardrails).", icon: "lucide:check-circle", color: colors.green },
                { label: "Runtime Guardrails", desc: "Every message passes through input interpretation, generation, and output evaluation. Responses violating constraints are blocked or rewritten.", icon: "lucide:shield", color: colors.blue },
                { label: "Vibe Repair", desc: "When rupture occurs: pause escalation, reflect, restore consent, offer choices (continue, break, switch agents, human moderator), log for learning.", icon: "lucide:refresh-ccw", color: colors.purple },
              ].map((e, i) => (
                <div key={i} style={{ padding: "16px 18px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Icon name={e.icon} size={14} style={{ color: e.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: colors.text }}>{e.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5 }}>{e.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }