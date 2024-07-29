import { Modal, StyleProp, View, ViewStyle } from "react-native";
import { modalStyles } from "../../../styles/modal";

interface GeneralModalTemplateProps {
  visibleState: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  forWrapper?: boolean;
  children: React.ReactNode;
}

export default function GeneralModalTemplate({
  visibleState,
  additionalStyles,
  forWrapper,
  children,
}: GeneralModalTemplateProps) {
  return (
    <>
      <Modal animationType="fade" visible={visibleState} transparent={true}>
        <View
          style={[
            modalStyles.modalWrapper,
            forWrapper ? additionalStyles : undefined,
          ]}
        >
          <View
            style={[
              modalStyles.modalContent,
              forWrapper ? undefined : additionalStyles,
            ]}
          >
            {children}
          </View>
        </View>
      </Modal>
    </>
  );
}
