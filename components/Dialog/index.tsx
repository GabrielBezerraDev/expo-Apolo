import { X } from "@tamagui/lucide-icons";
import { ButtonTheme } from "components/Button";
import { Dialog, DialogProps } from "tamagui"; // or '@tamagui/dialog'

interface IDialogComponent extends DialogProps {
  contentDialog: React.ReactNode;
  genericComponentWithDialog: React.ReactNode;
  descriptionModal?: string;
  titleModal: string;
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
            width={"70%"}
            bordered
            py="$4"
            px="$6"
            elevate
            rounded="$6"
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
            gap={"$3"}
          >
            <Dialog.Close asChild>
              <ButtonTheme
                rounded={"$radius.10"}
                elevation={5}
                icon={<X />}
                circular
                position="absolute"
                r={"2%"}
                t={"4%"}
              ></ButtonTheme>
            </Dialog.Close>
            <Dialog.Title fontSize={'$6'}>{props.titleModal}</Dialog.Title>
            {props.descriptionModal && (
              <Dialog.Description>{props.descriptionModal}</Dialog.Description>
            )}
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
