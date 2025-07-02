import { Button } from "@components/shadcn/button";
import Link from "next/link";
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
    <Link href={route}>
      <Button>{children}</Button>
    </Link>
  );
};
