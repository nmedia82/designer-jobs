import React, { useState } from "react";

const AdminSettings = ({ Settings, onSettingsChange }) => {
  const handleToggleAutomaticMode = () => {
    // setAutomaticModeEnabled(!automaticModeEnabled);
    const settings = { ...Settings, automatic_mode: !Settings.automatic_mode };
    onSettingsChange(settings);
  };

  return (
    <div>
      <h2>Settings</h2>
      <p>Automatic Mode: {Settings.automatic_mode ? "Enabled" : "Disabled"}</p>
      <label>
        <input
          type="checkbox"
          checked={Settings.automatic_mode}
          onChange={handleToggleAutomaticMode}
        />
        Enable Automatic Mode
      </label>
    </div>
  );
};

export default AdminSettings;
