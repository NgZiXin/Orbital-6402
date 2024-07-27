import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import EditAgendaForm from "@/components/form/full/editAgenda";

interface EditAgendaModalProps {
  visibility: boolean;
  setVisibility: (newValue: boolean) => void;
  databaseId: number;
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
}

export default function EditAgendaModal({
  visibility,
  setVisibility,
  databaseId,
  setUpdateFlag,
}: EditAgendaModalProps) {
  return (
    <>
      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.headerWrapper}>
          <Text style={globalStyles.header}>Edit Existing Agenda</Text>
          <TouchableOpacity onPress={() => setVisibility(false)}>
            <Ionicons name="close-circle-outline" size={25}></Ionicons>
          </TouchableOpacity>
        </View>

        <EditAgendaForm
          setAgendaModal={setVisibility}
          setUpdateFlag={setUpdateFlag}
          databaseId={databaseId}
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
