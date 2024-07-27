import { ScrollView } from "react-native";
import { Formik, FormikHelpers } from "formik";
import { useLoading } from "@/hooks/useLoading";
import { getToken } from "@/utility/general/userToken";
import SubmitButton from "../../general/submit";
import HeaderField from "../fragments/addAgendaFields/header";
import AgendaDateField from "../fragments/addAgendaFields/agendaDate";
import StartEndTimesField from "../fragments/addAgendaFields/startEndTimes";
import BodyField from "../fragments/addAgendaFields/body";
import addAgendaValidationSchema from "../validationSchema/addAgenda";

interface EditAgendaFormValues {
  header: string;
  agendaDate?: Date;
  startTime: string;
  endTime: string;
  body: string;
}

interface EditAgendaFormProps {
  setAgendaModal: (newValue: boolean) => void;
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
  databaseId: number;
}

export default function EditAgendaForm({
  setAgendaModal,
  setUpdateFlag,
  databaseId,
}: EditAgendaFormProps) {
  const { showLoading, hideLoading } = useLoading();
  const handleSubmit = async (
    values: EditAgendaFormValues,
    actions: FormikHelpers<EditAgendaFormValues>
  ): Promise<void> => {
    try {
      showLoading();

      // Update date to UTC+8
      const date = values.agendaDate as Date;
      date.setHours(date.getHours() + 8);

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

      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}calendar/${databaseId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      // Backend raises an error
      if (!response.ok) {
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
          } as EditAgendaFormValues
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
              text="Edit Agenda"
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
}
