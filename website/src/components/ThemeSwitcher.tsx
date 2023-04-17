import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import tailwindConfig from "../../tailwind.config.js";

const themes = tailwindConfig.daisyui.themes;

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setCurrentTheme(storedTheme);
    themeChange(false);
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value;
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    themeChange(false);
  };

  return (
    <div className="my-auto">
      <select
        id="theme-switcher"
        className="select font-normal"
        value={currentTheme}
        onChange={handleThemeChange}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;
