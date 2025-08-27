import React, { useState } from "react";
import {
  User,
  Bell,
  Volume2,
  Monitor,
  Gamepad2,
  Globe,
  Save,
  RotateCcw,
  Info,
} from "lucide-react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    username: "",
    email: "",
    notifications: true,
    soundEnabled: true,
    volume: 75,
    theme: "dark",
    language: "english",
    autoSave: true,
    showTips: true,
    resolution: "1920x1080",
    fullscreen: false,
    vsync: true,
  });

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  const handleReset = () => {
    console.log("Resetting to defaults");
  };

  return (
    <div className="!flex-1 !bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900 !min-h-screen">
      <div className="!p-8">
        {/* Header */}
        <div className="!mb-8">
          <h1 className="!text-4xl !font-bold !bg-gradient-to-r !from-yellow-400 !to-yellow-600 !bg-clip-text !text-transparent !mb-2">
            Settings
          </h1>
          <p className="!text-slate-400 !text-lg">
            Customize your StratMap experience
          </p>
        </div>

        <div className="!grid !grid-cols-1 !xl:grid-cols-2 !gap-8">
          {/* Account Settings */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <User className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">Account</h2>
            </div>

            <div className="!space-y-4">
              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter your username"
                  className="!w-full !bg-slate-700/50 !border !border-slate-600/50 !rounded-xl !py-3 !px-4 !text-white !placeholder-slate-400 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                />
              </div>

              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="!w-full !bg-slate-700/50 !border !border-slate-600/50 !rounded-xl !py-3 !px-4 !text-white !placeholder-slate-400 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <Bell className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">
                Notifications
              </h2>
            </div>

            <div className="!space-y-4">
              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">Push Notifications</p>
                  <p className="!text-sm !text-slate-400">
                    Receive strategy updates and alerts
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("notifications", !settings.notifications)
                  }
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.notifications ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.notifications
                        ? "!translate-x-6"
                        : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">Show Tips</p>
                  <p className="!text-sm !text-slate-400">
                    Display helpful tips and tutorials
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("showTips", !settings.showTips)
                  }
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.showTips ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.showTips ? "!translate-x-6" : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <Volume2 className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">Audio</h2>
            </div>

            <div className="!space-y-4">
              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">Sound Effects</p>
                  <p className="!text-sm !text-slate-400">
                    Enable UI sound effects
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("soundEnabled", !settings.soundEnabled)
                  }
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.soundEnabled ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.soundEnabled
                        ? "!translate-x-6"
                        : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Master Volume: {settings.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) =>
                    handleInputChange("volume", parseInt(e.target.value))
                  }
                  className="!w-full !h-2 !bg-slate-600 !rounded-lg !appearance-none !cursor-pointer !slider"
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <Monitor className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">Display</h2>
            </div>

            <div className="!space-y-4">
              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className="!w-full !bg-slate-700/50 !border !border-slate-600/50 !rounded-xl !py-3 !px-4 !text-white focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Resolution
                </label>
                <select
                  value={settings.resolution}
                  onChange={(e) =>
                    handleInputChange("resolution", e.target.value)
                  }
                  className="!w-full !bg-slate-700/50 !border !border-slate-600/50 !rounded-xl !py-3 !px-4 !text-white focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                >
                  <option value="1920x1080">1920 x 1080</option>
                  <option value="2560x1440">2560 x 1440</option>
                  <option value="3840x2160">3840 x 2160</option>
                </select>
              </div>

              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">Fullscreen</p>
                  <p className="!text-sm !text-slate-400">
                    Run in fullscreen mode
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("fullscreen", !settings.fullscreen)
                  }
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.fullscreen ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.fullscreen ? "!translate-x-6" : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <Gamepad2 className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">Gameplay</h2>
            </div>

            <div className="!space-y-4">
              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">Auto-Save</p>
                  <p className="!text-sm !text-slate-400">
                    Automatically save strategies
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("autoSave", !settings.autoSave)
                  }
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.autoSave ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.autoSave ? "!translate-x-6" : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="!flex !items-center !justify-between">
                <div>
                  <p className="!text-white !font-medium">V-Sync</p>
                  <p className="!text-sm !text-slate-400">
                    Synchronize with display refresh rate
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange("vsync", !settings.vsync)}
                  className={`!relative !inline-flex !h-6 !w-11 !items-center !rounded-full !transition-colors !duration-200 ${
                    settings.vsync ? "!bg-yellow-500" : "!bg-slate-600"
                  }`}
                >
                  <span
                    className={`!inline-block !h-4 !w-4 !transform !rounded-full !bg-white !transition-transform !duration-200 ${
                      settings.vsync ? "!translate-x-6" : "!translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="!bg-slate-800/50 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/50 !p-6">
            <div className="!flex !items-center !gap-3 !mb-6">
              <div className="!w-10 !h-10 !bg-yellow-500/20 !rounded-xl !flex !items-center !justify-center">
                <Globe className="!w-5 !h-5 !text-yellow-400" />
              </div>
              <h2 className="!text-xl !font-semibold !text-white">
                Language & Region
              </h2>
            </div>

            <div className="!space-y-4">
              <div>
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  className="!w-full !bg-slate-700/50 !border !border-slate-600/50 !rounded-xl !py-3 !px-4 !text-white focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                >
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                  <option value="german">Deutsch</option>
                  <option value="japanese">日本語</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="!flex !gap-4 !mt-8 !justify-end">
          <button
            onClick={handleReset}
            className="!bg-slate-700/50 hover:!bg-slate-600/50 !text-slate-300 hover:!text-white border !border-slate-600/50 hover:!border-slate-500/50 !font-semibold !py-3 !px-6 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2"
          >
            <RotateCcw className="!w-4 !h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="!bg-gradient-to-r !from-yellow-500 !to-yellow-600 hover:!from-yellow-400 hover:!to-yellow-500 !text-slate-900 !font-semibold !py-3 !px-6 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2 !shadow-lg hover:!shadow-yellow-500/25"
          >
            <Save className="!w-4 !h-4" />
            Save Changes
          </button>
        </div>

        {/* Info Banner */}
        <div className="!mt-8 !bg-yellow-500/10 !border !border-yellow-500/20 !rounded-2xl !p-4">
          <div className="!flex !items-start !gap-3">
            <Info className="!w-5 !h-5 !text-yellow-400 !mt-0.5 !flex-shrink-0" />
            <div>
              <p className="!text-yellow-400 !font-medium !mb-1">
                Settings Preview
              </p>
              <p className="!text-yellow-300/80 !text-sm">
                This is a placeholder settings page. The controls are not
                functional, just for demonstration purposes. Future updates will
                include full settings management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
