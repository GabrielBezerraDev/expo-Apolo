import { Dialog, DialogProps } from "tamagui"; // or '@tamagui/dialog'

interface IDialogComponent extends DialogProps {
  contentDialog: React.ReactNode;
  genericComponentWithDialog: React.ReactNode;

}

export const DialogComponent = ({ props }: { props: IDialogComponent }) => {
  return (
    <Dialog modal>
      {props.genericComponentWithDialog}

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          bg="$shadow6"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            paddingVertical="$4"
            paddingHorizontal="$6"
            elevate
            borderRadius="$6"
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
              Make changes to your profile here. Click save when you're done.
            </Dialog.Description>

            {props.contentDialog}

          </Dialog.Content>
        </Dialog.FocusScope>
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
