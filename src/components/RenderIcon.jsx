import React from "react";

// Wraps the Iconify web component via React.createElement to avoid JSX
// namespace issues with custom elements.
const Icon = ({ name, size = 16, style = {}, color }) =>
  React.createElement("iconify-icon", {
    icon: name,
    width: size,
    height: size,
    style: {
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
      color: color || "currentColor",
      ...style,
    },
  });

// Smart renderer: handles both emoji strings and Iconify icon names
export const RenderIcon = ({ icon, size = 20, style = {}, color }) => {
  if (icon && icon.includes && icon.includes(":")) {
    return <Icon name={icon} size={size} style={style} color={color} />;
  }
  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        display: "inline-block",
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
    </span>
  );
};

export { Icon };
