import React, { useState, useEffect } from "react";
import { colors } from "../colors.js";
import { Icon } from "./RenderIcon.jsx";

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ count, color = colors.accent }) =>
  count > 0 ? (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        background: color + "28",
        color,
        borderRadius: 10,
        padding: "1px 7px",
        marginLeft: 8,
        minWidth: 20,
        textAlign: "center",
      }}
    >
      {count}
    </span>
  ) : null;

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1.4,
      color: colors.textDim,
      textTransform: "uppercase",
      padding: "16px 16px 6px",
      userSelect: "none",
    }}
  >
    {children}
  </div>
);

// ─── NavItem ──────────────────────────────────────────────────────────────────
export const NavItem = ({ icon, label, active, count, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 12px 8px 14px",
        background: active
          ? colors.accent + "18"
          : hovered
          ? colors.surfaceHover
          : "transparent",
        border: "none",
        borderLeft: active
          ? `2px solid ${colors.accent}`
          : "2px solid transparent",
        borderRadius: "0 6px 6px 0",
        cursor: "pointer",
        transition: "all 0.15s",
        color: active ? colors.accent : colors.textDim,
      }}
    >
      <Icon name={icon} size={15} style={{ opacity: 0.9 }} />
      <span
        style={{
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          color: active ? colors.accent : colors.textMuted,
          flex: 1,
          textAlign: "left",
        }}
      >
        {label}
      </span>
      <Badge count={count} />
    </button>
  );
};

// ─── DropdownItem ─────────────────────────────────────────────────────────────
const DropdownItem = ({
  label,
  active,
  badge,
  onClick,
  borderBottom,
  borderTop,
  accentColor,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 14px",
        cursor: "pointer",
        fontSize: 13,
        background: active
          ? colors.accent + "18"
          : hovered
          ? colors.surfaceHover
          : "transparent",
        color: accentColor || (active ? colors.accent : colors.textMuted),
        borderBottom: borderBottom ? `1px solid ${colors.border}` : "none",
        borderTop: borderTop ? `1px solid ${colors.border}` : "none",
        transition: "background 0.1s",
      }}
    >
      {label}
      {badge}
    </div>
  );
};

// ─── CycleSelector ────────────────────────────────────────────────────────────
export const CycleSelector = ({
  current,
  onSwitch,
  isWizard,
  extraCycles = [],
  onNewCycle,
  onNewPlatform,
}) => {
  const [open, setOpen] = useState(false);
  const builtInCycles = [
    { id: "mountain", name: "🏔️  Mountain Temple", type: "cycle" },
    { id: "ocean", name: "🌊  Ocean Depths", type: "cycle" },
    { id: "forest", name: "🌲  Dark Forest", type: "cycle" },
  ];
  const allCycles = [...builtInCycles, ...extraCycles];

  const FIXED_NAMES = {
    platform: "⚙️  Platform Settings",
    personal: "🌿  Personal Work",
    apps: "📱  Apps",
  };
  const selected =
    allCycles.find((c) => c.id === current) || {
      name: FIXED_NAMES[current] || builtInCycles[0].name,
    };

  const SectionHdr = ({ label, first }) => (
    <div
      style={{
        padding: first ? "10px 14px 4px" : "10px 14px 4px",
        fontSize: 10,
        fontWeight: 700,
        color: colors.textDim,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        borderTop: first ? "none" : `1px solid ${colors.border}`,
        marginTop: first ? 0 : 2,
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        margin: "10px 12px 4px",
        userSelect: "none",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "10px 12px",
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${colors.borderHover}`,
          borderRadius: 9999,
          cursor: "pointer",
          color: colors.text,
        }}
      >
        <span
          style={{
            fontSize: 13,
            flex: 1,
            textAlign: "left",
            fontWeight: 600,
          }}
        >
          {selected.name}
        </span>
        <Icon
          name={open ? "lucide:chevron-up" : "lucide:chevron-down"}
          size={12}
          style={{ color: colors.textDim }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#0D0B4A",
            border: `1px solid ${colors.borderHover}`,
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Platforms */}
          <SectionHdr label="Platforms" first />
          {isWizard && (
            <DropdownItem
              label="⚙️  Platform Settings"
              active={current === "platform"}
              badge={
                <span
                  style={{
                    fontSize: 10,
                    marginLeft: 8,
                    color: colors.warning,
                    background: colors.warning + "22",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  WIZARD
                </span>
              }
              onClick={() => {
                onSwitch("platform");
                setOpen(false);
              }}
            />
          )}
          {!isWizard && (
            <DropdownItem
              label="⚙️  Platform Settings"
              active={current === "platform"}
              onClick={() => {
                onSwitch("platform");
                setOpen(false);
              }}
            />
          )}
          <DropdownItem
            label="+ New Platform"
            onClick={() => {
              setOpen(false);
              onNewPlatform && onNewPlatform();
            }}
            accentColor={colors.textDim}
          />

          {/* Cycles */}
          <SectionHdr label="Cycles" />
          <div style={{ maxHeight: 160, overflowY: "auto" }}>
            {allCycles.map((c) => (
              <DropdownItem
                key={c.id}
                label={c.name}
                active={current === c.id}
                onClick={() => {
                  onSwitch(c.id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <DropdownItem
            label="+ New Cycle"
            onClick={() => {
              setOpen(false);
              onNewCycle && onNewCycle();
            }}
            accentColor={colors.textDim}
          />

          {/* Personal */}
          <SectionHdr label="Personal" />
          <DropdownItem
            label="🌿  Personal Work"
            active={current === "personal"}
            onClick={() => {
              onSwitch("personal");
              setOpen(false);
            }}
          />

          {/* Apps */}
          <SectionHdr label="Apps" />
          <DropdownItem
            label="📱  Apps"
            active={current === "apps"}
            onClick={() => {
              onSwitch("apps");
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── StatusPill ───────────────────────────────────────────────────────────────
export const StatusPill = ({ status }) => {
  const isGood = ["Connected", "Active", "Ingested", "Published", "Installed"].includes(status);
  const isPending = ["Pending Setup", "Draft", "Not Installed"].includes(status);
  const color = isGood ? colors.green : isPending ? colors.warning : colors.textDim;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: 99,
        background: color + "22",
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {status}
    </span>
  );
};

// ─── Btn ──────────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = "primary", size = "md", danger = false, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  const pad = size === "sm" ? "6px 14px" : "8px 18px";
  const fs = size === "sm" ? 12 : 13;
  if (danger)
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: pad,
          background: hovered ? colors.red + "33" : "transparent",
          color: colors.red,
          border: `1px solid ${colors.red}44`,
          borderRadius: 7,
          fontSize: fs,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
          fontFamily: "inherit",
          ...style,
        }}
      >
        {children}
      </button>
    );
  if (variant === "primary")
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: pad,
          background: hovered ? colors.accentHover : colors.accent,
          color: "#fff",
          border: "none",
          borderRadius: 7,
          fontSize: fs,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
          fontFamily: "inherit",
          ...style,
        }}
      >
        {children}
      </button>
    );
  // variant === "secondary" | "ghost" | anything else
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: pad,
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
        color: colors.textMuted,
        border: `1px solid ${colors.border}`,
        borderRadius: 7,
        fontSize: fs,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─── PageHeader ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, children, onBack }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 28,
    }}
  >
    <div>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: colors.textDim,
            fontSize: 12,
            cursor: "pointer",
            padding: "0 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "inherit",
          }}
        >
          ‹ Back
        </button>
      )}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.text,
          margin: 0,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 13, color: colors.textDim, margin: "5px 0 0" }}>
          {subtitle}
        </p>
      )}
    </div>
    {children && (
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {children}
      </div>
    )}
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
export const Field = ({ label, children, hint }) => (
  <div style={{ marginBottom: 20 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: colors.textMuted,
        marginBottom: 6,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </label>
    {children}
    {hint && (
      <p style={{ fontSize: 11, color: colors.textDim, marginTop: 5 }}>{hint}</p>
    )}
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ value, placeholder, type = "text", readOnly, onChange }) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    readOnly={readOnly}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "9px 12px",
      background: readOnly ? colors.surfaceActive : colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 7,
      color: readOnly ? colors.textDim : colors.text,
      fontSize: 13,
      outline: "none",
      cursor: readOnly ? "default" : "text",
    }}
  />
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
export const Toggle = ({ label, enabled, onChange, hint }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "14px 16px",
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      marginBottom: 8,
    }}
  >
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: colors.textMuted }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 3 }}>
          {hint}
        </div>
      )}
    </div>
    <div
      onClick={() => onChange(!enabled)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: enabled ? colors.accent : "rgba(255,255,255,0.1)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
        marginLeft: 16,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: enabled ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </div>
  </div>
);

// ─── SectionDivider ───────────────────────────────────────────────────────────
export const SectionDivider = ({ label }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: colors.textDim,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      margin: "28px 0 14px",
      paddingBottom: 8,
      borderBottom: `1px solid ${colors.border}`,
    }}
  >
    {label}
  </div>
);

// ─── DangerZone ───────────────────────────────────────────────────────────────
export const DangerZone = ({ children }) => (
  <div
    style={{
      marginTop: 36,
      padding: "16px 20px",
      background: colors.red + "0A",
      border: `1px solid ${colors.red}33`,
      borderRadius: 10,
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: colors.red,
        letterSpacing: 1.1,
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      Danger Zone
    </div>
    {children}
  </div>
);

// ─── InfoBox ──────────────────────────────────────────────────────────────────
export const InfoBox = ({ children, color = colors.warning }) => (
  <div
    style={{
      padding: "12px 16px",
      background: color + "0D",
      border: `1px solid ${color}33`,
      borderRadius: 8,
      marginBottom: 20,
    }}
  >
    <span style={{ fontSize: 12, color }}>{children}</span>
  </div>
);

// ─── SectionCard ─────────────────────────────────────────────────────────────
// A simple titled card wrapper used across Platform detail pages.
export const SectionCard = ({ title, children, style = {} }) => (
  <div
    style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
      overflow: "hidden",
      ...style,
    }}
  >
    {title && (
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: colors.textDim,
          letterSpacing: 1.1,
          textTransform: "uppercase",
          padding: "12px 16px 10px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {title}
      </div>
    )}
    <div style={{ padding: "14px 16px" }}>{children}</div>
  </div>
);

// ─── FilterPill ───────────────────────────────────────────────────────────────
export const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 14px",
      borderRadius: 99,
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      background: active ? colors.accent + "22" : "transparent",
      color: active ? colors.accent : colors.textDim,
      border: `1px solid ${active ? colors.accent + "55" : colors.border}`,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
    }}
  >
    {label}
  </button>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: "20px",
      cursor: onClick ? "pointer" : "default",
      transition: onClick ? "border-color 0.15s" : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, width = 480, children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(5,5,18,0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        width,
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
          {title}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: colors.textDim,
            cursor: "pointer",
          }}
        >
          <Icon name="lucide:x" size={18} />
        </button>
      </div>
      <div style={{ padding: "18px 22px", overflowY: "auto" }}>{children}</div>
    </div>
  </div>
);
