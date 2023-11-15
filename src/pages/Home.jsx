import React, { createRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";
import { makeStyles } from "@material-ui/core/styles";
import esLocale from "@fullcalendar/core/locales/es";
import AppointmentForm from "../components/AppointmentForm";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axiosClient from "../config/axios";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  homeContainer: {
    width: "80%",
    height: "80vh",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "100vh",
    },
  },
}));

class Home extends React.Component {
  state = {
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    isUpdateMode: false,
    weekendsVisible: true,
    currentEvents: [],
    locale: "es", //español por defecto
    showAppointmentForm: false,
    selectedDate: null,
    patients: [],
    psychologists: [],
    appointments: [],
  };

  componentDidMount() {
    Promise.all([this.fetchPatients(), this.fetchPsychologists()]).then(() => {
      this.loadAppointments();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedEvent !== this.state.selectedEvent &&
      this.state.patients.length > 0 &&
      this.state.psychologists.length > 0
    ) {
      this.setState({ isUpdateMode: true });
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  handleEventDidMount = (eventInfo) => {
    const status = eventInfo.event.extendedProps.status;
    const eventElement = eventInfo.el;

    switch (status) {
      case "active":
        eventElement.style.backgroundColor = "#130663";
        break;
      case "in_progress":
        eventElement.style.backgroundColor = "green";
        break;
      case "cancelled":
        eventElement.style.backgroundColor = "red";
        break;
      default:
        break;
    }
  };

  validatePatient = (patient) => {
    if (!patient || !patient.id || !patient.name) {
      return null;
    }
    return patient;
  };

  validatePsychologist = (psychologist) => {
    if (!psychologist || !psychologist.id || !psychologist.name) {
      return null;
    }
    return psychologist;
  };

  validateStatus = (status) => {
    const validStatuses = ["active", "cancelled", "in_progress"];
    if (!status || !validStatuses.includes(status)) {
      return null;
    }
    return status;
  };

  validateNotes = (notes) => {
    if (!notes || typeof notes !== "string") {
      return null;
    }
    return notes;
  };

  validatePriceCop = (price_cop) => {
    if (!price_cop) {
      return null;
    }
    return price_cop;
  };

  fetchUserAppointments = async () => {

    try {
      const response = await axiosClient.get(
        "/psychologists/get-user-appointments"
      );
      const appointments = response.data;

      // Usa appointments directamente para crear calendarEvents
      const calendarEvents = appointments.map((appointment) => {
        const patient = this.validatePatient(
          this.state.patients.find((p) => p.id === appointment.patient_id)
        );
        const psychologist = this.validatePsychologist(
          this.state.psychologists.find(
            (p) => p.id === appointment.psychologist_id
          )
        );
        const title = patient
          ? `Cita con ${patient.name}`
          : `Cita con ${appointment.patient_id}`;
        return {
          id: appointment.id,
          title,
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
          status: this.validateStatus(appointment.status),
          patient: patient,
          psychologist: psychologist,
          notes: this.validateNotes(appointment.notes),
          price_cop: this.validatePriceCop(appointment.price_cop),
        };
      });
      this.setState({ currentEvents: calendarEvents });
    } catch (error) {
      console.error("Error al obtener las citas del usuario:", error);
    }
  };

  fetchAdminAppointments = async () => {
    try {
      const response = await axiosClient.get(
        "/psychologists/get-admin-appointments"
      );
      const appointments = response.data;

      const calendarEvents = appointments.map((appointment) => {
        const patient = this.validatePatient(
          this.state.patients.find((p) => p.id === appointment.patient_id)
        );
        const psychologist = this.validatePsychologist(
          this.state.psychologists.find(
            (p) => p.id === appointment.psychologist_id
          )
        );
        const title = patient
          ? `Cita con  ${patient.name}`
          : `Cita con  ${appointment.patient_id}`;

        return {
          id: appointment.id,
          title,
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
          status: this.validateStatus(appointment.status),
          patient: patient,
          psychologist: psychologist,
          notes: this.validateNotes(appointment.notes),
          price_cop: this.validatePriceCop(appointment.price_cop),
        };
      });

      this.setState({ currentEvents: calendarEvents });
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };

  loadAppointments = async () => {
    const userRole = localStorage.getItem("role");
    if (userRole === "administrador") {
      await this.fetchAdminAppointments();
    } else {
      await this.fetchUserAppointments();
    }
  };

  fetchPatients = async () => {
    try {
      const response = await axiosClient.get(
        "/psychologists/get-admin-patients"
      );
      const patients = response.data;
      this.setState({ patients });
      return patients;
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    }
  };

  fetchPsychologists = async () => {
    try {
      const response = await axiosClient.get(
        "/psychologists/get-psychologists"
      );
      const psychologists = response.data;
      this.setState({ psychologists });
      return psychologists;
    } catch (error) {
      console.error("Error al obtener los Psicólogos:", error);
    }
  };

  calendarRef = createRef();

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    this.setState({
      selectedEvent: null,
      selectedDate: selectInfo.startStr,
      selectedEnd: selectInfo.endStr,
      allDay: selectInfo.allDay,
      showAppointmentForm: true,
    });
  };
  // handleDateSelect = (selectInfo) => {
  //   let calendarApi = selectInfo.view.calendar;
  //   calendarApi.unselect(); // clear date selection
  //   if (confirm("¿Desea bloquear la fecha seleccionada?")) {
  //     calendarApi.addEvent({
  //       title: "Bloqueado",
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: true,
  //       display: "background", // Esto crea un evento de fondo
  //       color: "#ff9f89", // Puedes personalizar el color de fondo aquí
  //     });
  //   } else {
  //     this.setState({
  //       selectedEvent: null,
  //       selectedDate: selectInfo.startStr,
  //       selectedEnd: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //       showAppointmentForm: true,
  //     });
  //   }
  // };

  handleEventDrop = async (info) => {
    const newStartTime = info.event.start.toISOString();
    const newEndTime = info.event.end.toISOString();
    const eventId = info.event.id;
    const status = info.event.extendedProps.status;
    const notes = info.event.extendedProps.notes;
    const price_cop = info.event.extendedProps.price_cop;
    const patient_id = info.event.extendedProps.patient.id;
    const psychologist_id = info.event.extendedProps.psychologist.id;

    try {
      await axiosClient.patch(`/psychologists/update-appointment/${eventId}`, {
        start_time: newStartTime,
        end_time: newEndTime,
        status,
        notes,
        price_cop,
        patient_id,
        psychologist_id,
      });
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
    }
  };
  handleCloseAppointmentForm = () => {
    this.setState({
      isUpdateMode: false,
      showAppointmentForm: false,
      selectedDate: null,
    });
  };

  handleCreateAppointment = async (formData) => {
    const {
      patientId,
      psychologistId,
      start,
      end,
      allDay,
      status,
      notes,
      price_cop,
    } = formData;
    try {
      // if(localStorage.role === 'administrador'){
      await axiosClient.post("/psychologists/create-appointment", {
        patient_id: patientId.id,
        psychologist_id: psychologistId.id,
        start_time: start,
        end_time: end,
        status: status,
        notes: notes,
        price_cop: price_cop,
      });
      // }

      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Cita creada con éxito",
        snackbarSeverity: "success",
      });
    } catch (error) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Error al crear la cita:",
        snackbarSeverity: "error",
      });
      console.error("Error al crear la cita:", error);
    }
    const calendarApi = this.calendarRef.current.getApi();
    const newEvent = {
      title: `Cita con ${patientId.name}`,
      start,
      end,
      allDay,
      status,
      notes,
      price_cop,
    };
    calendarApi.addEvent(newEvent);

    this.setState({
      currentEvents: [...this.state.currentEvents, newEvent],
    });
  };

  handleDeleteAppointment = async (selectedEvent) => {
    const eventId = selectedEvent.id;

    try {
      await axiosClient.delete(`/psychologists/delete-appointment/${eventId}`);
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Cita eliminada con éxito",
        snackbarSeverity: "success",
      });
    } catch (error) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Error al eliminar la cita:",
        snackbarSeverity: "error",
      });
    }

    const calendarApi = this.calendarRef.current.getApi();
    const event = calendarApi.getEventById(eventId);
    event.remove();
  };

handleUpdateAppointmentWithButton = async (updatedData) => {
    const eventId = updatedData?.id;
    if (!eventId) {
      console.error("No se pudo encontrar el ID del evento");
      return;
    }

    try {
      await axiosClient.patch(
        `/psychologists/update-appointment-form/${eventId}`,
        {
          start_time: updatedData.start,
          end_time: updatedData.end,
          status: updatedData.status,
          notes: updatedData.notes,
          price_cop: updatedData.price_cop,
          patient_id: updatedData.patient.id,
          psychologist_id: updatedData.psychologist.id,
        }
      );
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Cita actualizada con éxito",
        snackbarSeverity: "success",
      });
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
    }
    const calendarApi = this.calendarRef.current.getApi();
    const selectedEvent = calendarApi.getEventById(eventId);
    selectedEvent.setProp(
      "title",
      `Cita con paciente ${updatedData.patient?.name}`
    );
    selectedEvent.setStart(updatedData.start);
    selectedEvent.setEnd(updatedData.end);
    selectedEvent.setExtendedProp("status", updatedData.status);
    selectedEvent.setExtendedProp("notes", updatedData.notes);
    selectedEvent.setExtendedProp("price_cop", updatedData.price_cop);
    calendarApi.refetchEvents();
  };

  handleEventClick = (clickInfo) => {
    const selectedEvent = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      patient: clickInfo.event.extendedProps.patient,
      psychologist: clickInfo.event.extendedProps.psychologist,
      status: clickInfo.event.extendedProps.status,
      notes: clickInfo.event.extendedProps.notes,
      price_cop: clickInfo.event.extendedProps.price_cop,
    };
    this.setState({
      selectedEvent,
      selectedDate: clickInfo.event.start.toISOString(),
      selectedEnd: clickInfo.event.end.toISOString(),
      showAppointmentForm: true,
    });
  };

  handleLenguageChange = () => {
    this.setState({
      locale: this.state.locale === "es" ? "en" : "es",
    });
  };

  render() {
    const { classes } = this.props;
    const { currentEvents } = this.state;
    return (
      <div>
        <div className={classes.homeContainer}>
          <FullCalendar
            ref={this.calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              end: "timeGridDay,timeGridWeek,dayGridMonth,listDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            events={currentEvents}
            select={this.handleDateSelect}
            eventDrop={this.handleEventDrop}
            eventContent={renderEventContent}
            eventClick={this.handleEventClick}
            eventDidMount={this.handleEventDidMount}
            //eventColor="#130663"
            eventTextColor="#FFFFFF"
            eventBorderColor="#000000"
            height={"100vh"}
            locales={[esLocale]}
            locale={this.state.locale}
          />
          {this.state.showAppointmentForm && (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <AppointmentForm
                isUpdateMode={this.state.isUpdateMode}
                open={this.state.showAppointmentForm}
                onClose={this.handleCloseAppointmentForm}
                onCreate={this.handleCreateAppointment}
                onUpdate={this.handleUpdateAppointment}
                onUpdateWithButton={this.handleUpdateAppointmentWithButton}
                onDelete={this.handleDeleteAppointment}
                selectedDate={this.state.selectedDate}
                selectedEnd={this.state.selectedEnd}
                allDay={this.state.allDay}
                patients={this.state.patients}
                psychologists={this.state.psychologists}
                selectedEvent={this.state.selectedEvent}
              />
            </MuiPickersUtilsProvider>
          )}
          <Snackbar
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={this.handleSnackbarClose}
              severity={this.state.snackbarSeverity}
            >
              {this.state.snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

function renderEventContent(eventInfo) {
  // Formatear la fecha y hora de inicio y finalización
  const startTime = formatDate(eventInfo.event.start, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = formatDate(eventInfo.event.end, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div style={{ color: "white", fontSize: "0.6rem" }}>
      <div>
        <b>{`${startTime} - ${endTime}`}</b>
      </div>
      <div>
        <i>{eventInfo.event.title}</i>
      </div>
    </div>
  );
}

export default function HomeWithStyles(props) {
  const classes = useStyles();
  return <Home classes={classes} {...props} />;
}
