"use client";

import { RedirectButton } from "@components/custom/Redirect/redirect-button";
import { Button } from "@components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      Current theme: {theme}
      <Button
        variant={"outline"}
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
        content="dafs"
      >
        Toggle Theme
      </Button>
      <RedirectButton route="/login">Login</RedirectButton>
    </div>
  );
}
