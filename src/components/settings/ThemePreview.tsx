import React from "react";

interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  text: string;
  mutedText: string;
  card: string;
}

interface ThemePreviewProps {
  colors: ThemeColors;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ colors }) => {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
        Preview
      </h3>

      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          borderColor: colors.secondary,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: colors.primary,
            color: colors.text,
          }}
        >
          <div className="font-semibold">My App</div>

          <div className="flex gap-3 text-sm">
            <span>Home</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Heading */}
          <div>
            <h4
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              Welcome back
            </h4>

            <p className="mt-1 text-sm" style={{ color: colors.mutedText }}>
              This is how your theme will look throughout the application.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.secondary,
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium" style={{ color: colors.text }}>
                Example Card
              </div>

              <span
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.text,
                }}
              >
                Active
              </span>
            </div>

            <p className="text-sm" style={{ color: colors.mutedText }}>
              Card backgrounds, secondary colours and muted text are shown here.
            </p>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.text,
                }}
              >
                Primary Button
              </button>

              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.text,
                }}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Text examples */}
          <div>
            <p className="text-sm" style={{ color: colors.text }}>
              Normal text using your text colour.
            </p>

            <p className="mt-1 text-xs" style={{ color: colors.mutedText }}>
              Muted text for descriptions and supporting information.
            </p>
          </div>

          {/* Colour palette */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="h-8 w-full rounded-md border border-black/10"
                  style={{ backgroundColor: color }}
                  title={color}
                />

                <span
                  className="mt-1 block truncate text-[10px]"
                  style={{ color: colors.mutedText }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
