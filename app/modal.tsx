import { useModal } from 'hooks/useModal'

export default function ModalScreen() {
  const {contentModal} = useModal();
  return contentModal
}
