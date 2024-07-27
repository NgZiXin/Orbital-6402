import * as yup from "yup";

const addAgendaValidationSchema = yup.object({
  header: yup.string().required("Header is required"),
  agendaDate: yup.date().required("Agenda date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  body: yup.string().required("Body is required"),
});

export default addAgendaValidationSchema;
