import { Button } from "@components/ui/button";
import React from "react";

interface RedirectButtonProps {
  children: React.ReactNode;
  route: string;
}

export const RedirectButton: React.FC<RedirectButtonProps> = ({
  children,
  route,
}: RedirectButtonProps) => {
  return (
    <a href={route}>
      <Button>{children}</Button>
    </a>
  );
};
