// This is a temporary Calendar Page. Upon revision of the calendar page in the future, please delete this.

import { Text, View } from "react-native";
import { useState } from "react";
import AgendaCalendar from "@/components/general/agendaCalendar";
import AddAgendaModal from "@/components/modal/homePage/calendarPage/addAgenda";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";

export default function Calendar() {
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      {/* For offset */}
      <View style={{ marginTop: 40, flex: 1 }}>
        <PageHeader topText="Planner" bottomText="Personal Calendar" />
        <View style={{ position: "relative", bottom: 28, marginBottom: -28 }}>
          <Text style={globalStyles.para}>
            View your calendar and your current workout agenda!
          </Text>
        </View>
        <AgendaCalendar
            updateFlag={updateFlag}
            setUpdateFlag={setUpdateFlag}
          />
          <AddAgendaModal setUpdateFlag={setUpdateFlag} />
        </View>
    </View>
  );
}
