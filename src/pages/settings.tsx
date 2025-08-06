import { useState } from "react";

const SettingsPage = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="!min-h-screen !bg-gray-800 !text-white !p-8">
      <div className="!max-w-4xl !mx-auto">
        <h1 className="!text-3xl !font-bold !text-yellow-400 !mb-6">
          Settings
        </h1>

        <h3 className="!text-2xl !font-bold !text-red-600 !mb-6">
          *This is a placeholder page*
        </h3>

        <div className="bg-gray-700 !p-6 !rounded-xl !shadow-lg !space-y-6">
          <div>
            <label className="!block !text-sm !font-medium !text-gray-300 !mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="!w-full !px-4 !py-2 !rounded-lg !bg-gray-800 !border !border-gray-600 !text-white !placeholder-gray-500 focus:!outline-none focus:!ring-2 focus:!ring-yellow-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="!block !text-sm !font-medium !text-gray-300 !mb-2">
              Notifications
            </label>
            <select
              className="!w-full !px-4 !py-2 !rounded-lg !bg-gray-800 !border !border-gray-600 !text-white focus:!outline-none focus:!ring-2 focus:!ring-yellow-400"
              defaultValue="enabled"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="text-right">
            <button className="!bg-yellow-400 !text-gray-900 !px-6 !py-2 !rounded-lg !font-semibold hover:!bg-yellow-300 !transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
