import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { modalStyles } from "../../styles/modal";
import { globalStyles } from "../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BmiModal() {
  const [bmiModal, setBMIModal] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setBMIModal(true)}>
        <Ionicons name="information-circle-outline" size={18} color="red" />
      </TouchableOpacity>

      {bmiModal == true && (
        <Modal animationType="fade" visible={bmiModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View style={modalStyles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={globalStyles.header}>Body Mass Index (BMI)</Text>
                <TouchableOpacity onPress={() => setBMIModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={globalStyles.para}>
                  BMI is an estimate of body fat based on height and weight. It
                  can help determine whether a person is at an unhealthy or
                  healthy weight. However, it is not without its limitations.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://www.healthline.com/health/body-mass-index#Body-Mass-Index-for-Adults"
                    )
                  }
                >
                  <Text style={{ ...globalStyles.para, color: "red" }}>
                    Click me to learn more!
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
