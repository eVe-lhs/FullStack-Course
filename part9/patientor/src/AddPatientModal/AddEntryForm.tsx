import React, { useState } from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { useStateValue } from "../state";
import {
  TextField,
  DiagnosisSelection,
  TypeOption,
  types,
  NumberField,
  SelectTypes,
} from "./FormField";
import { NewEntry } from "../types";
import * as Yup from "yup";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}
const typeOptions: TypeOption[] = [
  { value: types.Hospital, label: "Hospital" },
  { value: types.HealthCheck, label: "HealthCheck" },
  { value: types.OccupationalHealthcare, label: "OccupationalHealthcare" },
];
// const assertNever = (value: never): never => {
//   throw new Error(
//     `Unhandled discriminated union member: ${JSON.stringify(value)}`
//   );
// };

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnosis }] = useStateValue();
  const [type, setType] = useState("HeathCheck");

  let EntryForm: React.FC;
  let validationSchema;
  let initialValues: NewEntry;
  interface BaseInitials {
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<string>;
  }
  const baseInitials: BaseInitials = {
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [""],
  };
  const basicSchema = {
    description: Yup.string().required("Field Required"),
    date: Yup.string().required("Field Required"),
    specialist: Yup.string().required("Field Required"),
  };

  const HospitalSchema = Yup.object().shape({
    ...basicSchema,
    discharge: Yup.object().shape({
      date: Yup.string().required("Field Required"),
      criteria: Yup.string().required("Field Required"),
    }),
  });
  const OccupatinalSchema = Yup.object().shape({
    ...basicSchema,
    employerName: Yup.string().required("Field Required"),
  });
  const HealthCheckSchema = Yup.object().shape({
    ...basicSchema,
  });
  const HospitalEntryForm: React.FC = () => {
    return (
      <div>
        <Field
          label="Discharge-Date"
          placeholder="YYYY-MM-DD"
          name="discharge.date"
          component={TextField}
        />
        <Field
          label="Criteria"
          placeholder="Criteria"
          name="discharge.criteria"
          component={TextField}
        />
      </div>
    );
  };
  const HealthCheckForm: React.FC = () => {
    return (
      <Field
        label="healthCheckRating"
        name="healthCheckRating"
        component={NumberField}
        min={0}
        max={3}
      />
    );
  };
  const OccupationalHealthCareForm: React.FC = () => {
    return (
      <div>
        <Field
          label="Employer Name"
          placeholder="Employer Name"
          name="employerName"
          component={TextField}
        />
        <h4>Sick Leave</h4>
        <Field
          label="Start Date"
          placeholder="YYYY-MM-DD"
          name="sickLeave.startDate"
          component={TextField}
        />
        <Field
          label="End Date"
          placeholder="YYYY-MM-DD"
          name="sickLeave.endDate"
          component={TextField}
        />
      </div>
    );
  };
  if (type === "Hospital") {
    EntryForm = HospitalEntryForm;
    initialValues = {
      ...baseInitials,
      type: "Hospital",
      discharge: {
        date: "",
        criteria: "",
      },
    };
    validationSchema = HospitalSchema;
  } else if (type === "OccupationalHealthcare") {
    EntryForm = OccupationalHealthCareForm;
    initialValues = {
      ...baseInitials,
      type: "OccupationalHealthcare",
      employerName: "",
      sickLeave: {
        startDate: "",
        endDate: "",
      },
    };
    validationSchema = OccupatinalSchema;
  } else {
    EntryForm = HealthCheckForm;
    initialValues = {
      ...baseInitials,
      type: "HealthCheck",
      healthCheckRating: 0,
    };
    validationSchema = HealthCheckSchema;
  }
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      // validate={(values) => {
      //   const requiredError = "Field is required";
      //   type nested = {
      //     [field: string]: nested | string;
      //   };
      //   const errors: nested = {};
      //   interface HealthCheckErrors extends BaseInitials {
      //     healthCheckRating: string;
      //   }
      //   if (!values.description) {
      //     errors.description = requiredError;
      //   }
      //   if (!values.date) {
      //     errors.date = requiredError;
      //   }
      //   if (!values.specialist) {
      //     errors.specialist = requiredError;
      //   }
      //   switch (values.type) {
      //     case "Hospital":
      //       {
      //         if (!values.discharge.date) {
      //           (errors.discharge as nested).date = requiredError;
      //         }
      //         if (!values.discharge.criteria) {
      //           (errors.discharge as nested).criteria = requiredError;
      //         }
      //       }
      //       break;
      //     case "HealthCheck":
      //       break;
      //     case "OccupationalHealthcare":
      //       {
      //         if (!values.employerName) {
      //           errors.employerName = requiredError;
      //         }
      //       }
      //       break;
      //     default:
      //       return assertNever(values);
      //   }
      //   console.log(errors);
      //   return errors;
      // }}
      enableReinitialize
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />
            <SelectTypes
              label="Types"
              name="type"
              options={typeOptions}
              onChange={onChange}
            />
            {/* <label>Type</label>
            <select
              name="type"
              className="ui dropdown"
              onChange={(e) => setType(e.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label || option.value}
                </option>
              ))}
            </select> */}
            <EntryForm />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
