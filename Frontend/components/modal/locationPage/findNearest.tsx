import { Modal, Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState, useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import FindNearestForm from "@/components/form/full/findNearest";

export default function FindNearestModal({setWebviewUri}: any) {
  const [findNearestModal, setFindNearestModal] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setFindNearestModal(true)}
        text="Find Nearest Gym / Park"
        style={{ position: "relative", bottom: 45, marginBottom: -35 }}
      />

      {findNearestModal == true && (
        <Modal
          animationType="fade"
          visible={findNearestModal}
          transparent={true}
        >
          <View style={modalStyles.modalWrapper}>
            <View
              style={{
                ...modalStyles.modalContent,
                paddingLeft: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    ...globalStyles.header,
                    position: "relative",
                    left: 9,
                  }}
                >
                  Find Nearest Gym & Park
                </Text>
                <TouchableOpacity onPress={() => setFindNearestModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <FindNearestForm setWebviewUri={setWebviewUri} setFindNearestModal={setFindNearestModal} />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
