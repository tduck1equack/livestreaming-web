import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

interface DialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: string | React.ReactNode;
}

export const CustomDialog: React.FC<DialogProps> = ({
  trigger,
  title,
  description,
  children,
}: DialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="my-2.5 flex-row justify-center">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
