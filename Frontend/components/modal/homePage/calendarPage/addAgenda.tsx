import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import AddAgendaForm from "@/components/form/full/addAgenda";

interface AddAgendaModalProps {
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
}

export default function AddAgendaModal({ setUpdateFlag }: AddAgendaModalProps) {
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisibility(true)}
        activeOpacity={0.7}
        style={styles.addButton}
      >
        <Ionicons name="add-outline" size={28} style={styles.icon} />
      </TouchableOpacity>

      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.headerWrapper}>
          <Text style={globalStyles.header}>Add New Agenda</Text>
          <TouchableOpacity onPress={() => setVisibility(false)}>
            <Ionicons name="close-circle-outline" size={25}></Ionicons>
          </TouchableOpacity>
        </View>

        <AddAgendaForm
          setAgendaModal={setVisibility}
          setUpdateFlag={setUpdateFlag}
        />
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    ...globalStyles.cardV2,
    position: "absolute",
    bottom: "3.5%",
    right: "6%",
    // Bring it to the front
    zIndex: 999,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },

  icon: {
    position: "relative",
    top: "20%",
    left: "20%",
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
});
