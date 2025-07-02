"use client";

import { CustomDialog } from "@components/custom/dialog/custom-dialog";
import { LoginForm } from "@components/custom/form";
import { Button } from "@components/shadcn/button";
import { RedirectButton } from "@components/custom/button/redirect-button";
const LoginPage = () => {
  return (
    <div>
      <CustomDialog title="Login to StreamTube" trigger={"Login"}>
        <LoginForm />
      </CustomDialog>

      <RedirectButton route="/users">Userlist</RedirectButton>
    </div>
  );
};

export default LoginPage;
