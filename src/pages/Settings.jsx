import React, { useState } from "react";

const Settings = () => {
  const [automaticModeEnabled, setAutomaticModeEnabled] = useState(false);

  const handleToggleAutomaticMode = () => {
    setAutomaticModeEnabled(!automaticModeEnabled);
  };

  return (
    <div>
      <h2>Settings</h2>
      <p>Automatic Mode: {automaticModeEnabled ? "Enabled" : "Disabled"}</p>
      <label>
        <input
          type="checkbox"
          checked={automaticModeEnabled}
          onChange={handleToggleAutomaticMode}
        />
        Enable Automatic Mode
      </label>
    </div>
  );
};

export default Settings;
