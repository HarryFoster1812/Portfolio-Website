import React, { useEffect, useRef, useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { ThemePreview } from "./ThemePreview";
import { useTheme, resetTheme } from "@/providers/ThemeContext";

interface SettingsModalProps {
  onClose: () => void;
}

type ColorName = keyof ThemeColors;

const themePresets: Record<string, ThemeColors> = {
  Default: {
    background: "#ffffff",
    primary: "#3b82f6",
    secondary: "#6366f1",
    text: "#111827",
    mutedText: "#6b7280",
    card: "#f9fafb",
  },

  Ocean: {
    background: "#f0f9ff",
    primary: "#0284c7",
    secondary: "#06b6d4",
    text: "#0c4a6e",
    mutedText: "#64748b",
    card: "#ffffff",
  },

  Forest: {
    background: "#f0fdf4",
    primary: "#16a34a",
    secondary: "#22c55e",
    text: "#14532d",
    mutedText: "#64748b",
    card: "#ffffff",
  },

  Purple: {
    background: "#faf5ff",
    primary: "#9333ea",
    secondary: "#a855f7",
    text: "#3b0764",
    mutedText: "#6b7280",
    card: "#ffffff",
  },

  Sunset: {
    background: "#fff7ed",
    primary: "#f97316",
    secondary: "#fb7185",
    text: "#431407",
    mutedText: "#78716c",
    card: "#ffffff",
  },

  Dark: {
    background: "#111827",
    primary: "#3b82f6",
    secondary: "#6366f1",
    text: "#f9fafb",
    mutedText: "#9ca3af",
    card: "#1f2937",
  },
};

const colorSettings: {
  key: ColorName;
  label: string;
  description: string;
}[] = [
  {
    key: "background",
    label: "Background",
    description: "Main application background",
  },
  {
    key: "primary",
    label: "Primary",
    description: "Buttons, navigation and accents",
  },
  {
    key: "secondary",
    label: "Secondary",
    description: "Secondary actions and borders",
  },
  {
    key: "text",
    label: "Text",
    description: "Main text colour",
  },
  {
    key: "mutedText",
    label: "Muted Text",
    description: "Secondary and supporting text",
  },
  {
    key: "card",
    label: "Card",
    description: "Cards, panels and containers",
  },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { colors, updateColor, resetTheme } = useTheme();

  const [activeColor, setActiveColor] = useState<ColorName | null>(null);

  const [selectedPreset, setSelectedPreset] = useState("Custom");

  const pickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (colorName: ColorName, color: ColorResult) => {
    updateColor(colorName, color.hex);
    setSelectedPreset("Custom");
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = event.target.value;

    if (!presetName) {
      return;
    }

    const preset = themePresets[presetName];

    if (!preset) {
      return;
    }

    resetTheme(preset);
    setSelectedPreset(presetName);
    setActiveColor(null);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Close colour picker when clicking outside it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setActiveColor(null);
      }
    };

    if (activeColor) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeColor]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-settings-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2
              id="theme-settings-title"
              className="text-lg font-semibold text-gray-900"
            >
              Theme Settings
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Customise the colours used throughout your application.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close settings"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Theme preset */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Theme</h3>

                <p className="text-xs text-gray-500">
                  Start with a preset or customise the colours below.
                </p>
              </div>

              <select
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                <option value="Custom">Custom</option>

                {Object.keys(themePresets).map((presetName) => (
                  <option key={presetName} value={presetName}>
                    {presetName}
                  </option>
                ))}
              </select>
            </section>

            {/* Colours */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Colours</h3>

                <p className="text-xs text-gray-500">
                  Click a colour swatch to edit it.
                </p>
              </div>

              <div className="divide-y divide-gray-100 overflow-visible rounded-xl border border-gray-200">
                {colorSettings.map(({ key, label, description }) => {
                  const isActive = activeColor == key;

                  return (
                    <div
                      key={key}
                      className="relative flex items-center gap-3 px-4 py-3"
                    >
                      {/* Colour swatch + picker */}
                      <div
                        ref={isActive ? pickerRef : undefined}
                        className="relative shrink-0"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveColor(isActive ? null : key)}
                          className="relative h-10 w-10 rounded-lg border border-black/10 shadow-sm transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                          style={{
                            backgroundColor: colors[key],
                          }}
                          aria-label={`Edit ${label} colour`}
                        />

                        {/* Picker */}
                        {isActive && (
                          <div
                            className="absolute bottom-full left-0 z-[100] mb-3"
                            onMouseDown={(event) => {
                              event.stopPropagation();
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            {/* Arrow */}
                            <div className="absolute -bottom-2 left-4 h-4 w-4 rotate-45 border-b border-r border-gray-200 bg-white" />

                            <div className="relative rounded-xl border border-gray-200 bg-white p-2 shadow-2xl">
                              <ChromePicker
                                color={colors[key]}
                                onChange={(color) =>
                                  handleColorChange(key, color)
                                }
                                disableAlpha
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {label}
                        </div>

                        <div className="truncate text-xs text-gray-500">
                          {description}
                        </div>
                      </div>

                      {/* Hex */}
                      <button
                        type="button"
                        onClick={() => {
                          console.log(
                            `Setting ${key} to ${isActive ? "Off" : "On"}`,
                          );

                          setActiveColor(isActive ? null : key);
                        }}
                        className="rounded-md px-2 py-1 font-mono text-xs uppercase text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        {colors[key]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Preview */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Preview</h3>

                <p className="text-xs text-gray-500">
                  See how your theme looks throughout the application.
                </p>
              </div>

              <ThemePreview colors={colors} />
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500">
            Changes are applied instantly.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
