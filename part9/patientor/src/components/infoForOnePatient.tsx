import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Patient,
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  NewEntry,
} from "../types";
import {
  useStateValue,
  getPatient,
  setDiagnosisList,
  addEntry,
} from "../state";
import { apiBaseUrl } from "../constants";
import { Icon, Segment, Button } from "semantic-ui-react";
import { AddEntryModal } from "../AddPatientModal";

export interface MatchParams {
  id: string;
}
type color = "green" | "red" | "yellow" | "black" | "orange";
const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  let heartColor: color;
  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      heartColor = "green";
      break;
    case HealthCheckRating.LowRisk:
      heartColor = "yellow";
      break;
    case HealthCheckRating.HighRisk:
      heartColor = "orange";
      break;
    case HealthCheckRating.CriticalRisk:
      heartColor = "red";
      break;
    default:
      heartColor = "black";
  }
  return (
    <Segment>
      <h2>
        {entry.date} <Icon name="user md" />
      </h2>
      <h3> {entry.specialist} </h3>
      <small> {entry.description} </small>
      <br />
      <Icon name="heart" color={heartColor} />
    </Segment>
  );
};
const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Segment>
      <h2>
        {entry.date} <Icon name="hospital" />
      </h2>
      <h3> {entry.specialist} </h3>
      <Segment>
        <h4>
          Discharge date:
          <span style={{ fontWeight: "normal" }}> {entry.discharge.date} </span>
        </h4>
        <h4>
          Discharge criteria:{" "}
          <span style={{ fontWeight: "normal" }}>
            {" "}
            {entry.discharge.criteria}{" "}
          </span>
        </h4>
      </Segment>
      <small> {entry.description} </small>
    </Segment>
  );
};
const OccupationHealthCare: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <Segment>
      <h2>
        {entry.date} <Icon name="stethoscope" /> {entry.employerName}
      </h2>
      <h3> {entry.specialist} </h3>
      {entry.sickLeave ? (
        <Segment>
          <h3>Sick Leave</h3>
          <p>start date : {entry.sickLeave.startDate}</p>
          <p>end date: {entry.sickLeave.endDate}</p>
        </Segment>
      ) : null}
      <small> {entry.description} </small>
    </Segment>
  );
};
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "Hospital":
      return <Hospital entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationHealthCare entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const InfoForOnePatient: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
  const { id } = useParams<{ id: string }>();
  const [{ patient, diagnosis }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(getPatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosis } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnosis`
        );
        dispatch(setDiagnosisList(diagnosis));
      } catch (e) {
        console.error(e);
        setError(e.response.data);
      }
    };
    fetchDiagnosisList();
    fetchPatient();
  }, [dispatch, id]);
  if (!patient || !diagnosis) {
    return <div>Loading...</div>;
  }
  const submitNewEntry = async (values: NewEntry) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      dispatch(addEntry(newEntry, patient.id));
      closeModal();
    } catch (e) {
      // console.error(e.response.data);
      console.log(e.response);
      setError(e.response.data);
    }
  };

  return (
    <div>
      <div>
        <h1>
          {patient.name}
          <Icon name={patient.gender === "male" ? "mars" : "venus"} />
        </h1>
        <p>ssn: {patient.ssn} </p>
        <p>occupation: {patient.occupation} </p>
        <h2>
          entries{" "}
          <div>
            <AddEntryModal
              modalOpen={modalOpen}
              onSubmit={submitNewEntry}
              error={error}
              onClose={closeModal}
            />
            <Button onClick={() => openModal()}>Add New Entry</Button>
          </div>
        </h2>
        <div>
          {patient.entries.map((entry) => (
            <div key={entry.id}>
              <EntryDetails entry={entry} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default InfoForOnePatient;
