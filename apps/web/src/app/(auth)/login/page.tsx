"use client";

import { CustomDialog } from "@/components/custom/Dialog/dialog";
import { LoginForm } from "@/components/custom/Form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div>
      <CustomDialog
        title="Login to StreamTube"
        trigger={<Button>Login</Button>}
      >
        <LoginForm />
      </CustomDialog>
    </div>
  );
}
