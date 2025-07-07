import { Dialog, DialogProps } from 'tamagui' // or '@tamagui/dialog'

interface IDialogComponent extends DialogProps{
    contentDialog: React.ReactNode;
    genericComponentWithDialog: React.ReactNode;
}

export const DialogComponent = ({props}:{props:IDialogComponent}) => {
  return (
    <Dialog>

    {props.genericComponentWithDialog}

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title />
          <Dialog.Description />
          <Dialog.Close />
          {props.contentDialog}
        </Dialog.Content>
      </Dialog.Portal>

      {/* optionally change to sheet when small screen */}
      {/* <Dialog.Adapt when="maxMd">
        <Dialog.Sheet>
          <Dialog.Sheet.Frame>
            <Dialog.Adapt.Contents />
          </Dialog.Sheet.Frame>
          <Dialog.Sheet.Overlay />
        </Dialog.Sheet>
      </Dialog.Adapt> */}
    </Dialog>
  );
};
