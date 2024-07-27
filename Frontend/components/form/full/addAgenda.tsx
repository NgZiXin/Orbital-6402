import { Alert, ScrollView } from "react-native";
import { Formik, FormikHelpers } from "formik";
import { useLoading } from "@/hooks/useLoading";
import { getToken } from "@/utility/general/userToken";
import SubmitButton from "../../general/submit";
import HeaderField from "../fragments/addAgendaFields/header";
import AgendaDateField from "../fragments/addAgendaFields/agendaDate";
import StartEndTimesField from "../fragments/addAgendaFields/startEndTimes";
import BodyField from "../fragments/addAgendaFields/body";
import addAgendaValidationSchema from "../validationSchema/addAgenda";

interface AddAgendaFormValues {
  header: string;
  agendaDate?: Date;
  startTime: string;
  endTime: string;
  body: string;
}

interface AddAgendaFormProps {
  setAgendaModal: (newValue: boolean) => void;
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
}

interface CalendarItem {
  id?: number;
  databaseId?: number;
  header: string;
  date: string;
  start_time: string;
  end_time: string;
  body: string;
}

export default function AddAgendaForm({
  setAgendaModal,
  setUpdateFlag,
}: AddAgendaFormProps) {
  const { showLoading, hideLoading } = useLoading();
  const handleSubmit = async (
    values: AddAgendaFormValues,
    actions: FormikHelpers<AddAgendaFormValues>
  ): Promise<void> => {
    try {
      showLoading();

      // Update date to UTC+8
      const date = values.agendaDate as Date;
      date.setHours(date.getHours() + 8);

      const token: string | null = await getToken("token");
      const getResponse = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}calendar/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Backend raises an error
      if (!getResponse.ok) {
        throw new Error("Network response was not ok");
      }

      // Successful response
      // Extract out the data response
      const dataArray: CalendarItem[] = await getResponse.json();
      console.log(dataArray);

      // Check for conflicts with existing entries
      const currStart = values.startTime;
      const currEnd = values.endTime;
      const currDate: string = values.agendaDate
        ?.toISOString()
        .split("T")[0] as string;

      let hasConflict: boolean = false;
      let conflictingTime = [];
      for (let i = 0; i < dataArray.length; i++) {
        const date = dataArray[i].date;
        const startTime = dataArray[i].start_time;
        const endTime = dataArray[i].end_time;

        if (date === currDate) {
          // Check for overlapping intervals
          if (currStart > endTime || currEnd < startTime) {
            continue;
          } else {
            hasConflict = true;
            console.log(startTime, endTime);
            conflictingTime.push(startTime);
            conflictingTime.push(endTime);
            break;
          }
        }
      }

      if (hasConflict) {
        const alertHeader = "Error!";
        const alertBody = `This agenda overlaps with an existing agenda from ${conflictingTime[0]} to ${conflictingTime[1]}`;
        Alert.alert(alertHeader, alertBody);
        return;
      }

      const body = {
        ...values,
        // Convert date to 'YYYY-MM-DD' format
        // To match database expected format
        date: values.agendaDate?.toISOString().split("T")[0],

        // Captialize start of every word for header
        header: values.header
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),

        // Ensure key matches backend field names
        start_time: values.startTime,
        end_time: values.endTime,
      };

      const fetchResponse = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}calendar/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      // Backend raises an error
      if (!fetchResponse.ok) {
        throw new Error("Network response was not ok");
      }

      // Successful response
      actions.resetForm();
      setAgendaModal(false);
      setUpdateFlag((prev) => !prev);

      // Catch other errors
    } catch (error: any) {
      console.error(error.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <Formik
        initialValues={
          {
            header: "",
            // Date initially set to undefined
            // So that required validation can be triggered
            agendaDate: undefined,
            startTime: "",
            endTime: "",
            body: "",
          } as AddAgendaFormValues
        }
        validationSchema={addAgendaValidationSchema}
        // Form validates on blur and submit only
        // Minimizing number of checks
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <HeaderField formikProps={formikProps} />
            <AgendaDateField formikProps={formikProps} />
            <StartEndTimesField formikProps={formikProps} />
            <BodyField formikProps={formikProps} />
            <SubmitButton
              onPressHandler={formikProps.handleSubmit}
              text="Add Agenda"
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
}
