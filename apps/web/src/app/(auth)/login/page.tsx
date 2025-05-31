"use client";

import { CustomDialog } from "@components/custom/Dialog/custom-dialog";
import { LoginForm } from "@components/custom/Form";
import { Button } from "@components/ui/button";
import { RedirectButton } from "@components/custom/Redirect/redirect-button";
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
