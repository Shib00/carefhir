import React, { useState, useEffect } from 'react';
import { PageHeader, Breadcrumbs, Card, Icon, Subheading } from '@innovaccer/design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Summary.css';
import {
  getPatientData,
  getVitalsData,
  getEncounterData,
  getConditionData,
  getImmunizationData,
  getAllergyIntoleranceData
} from '../api';
import PatientInfo from '../components/PatientInfo';
//import Vitals from '../components/Vitals';
//import Encounter from '../components/Encounter';
//import Condition from '../components/Condition';
//import Immunization from '../components/Immunization';
import Info from '../components/Info';
import {
  ImmunizationTable,
  AllergyIntoleranceTable,
  VitalsTable,
  Encounters,
  Condition
} from '@innovaccer/fhir-components';

const Summary = () => {
  let history = useHistory();
  const params = useParams();
  const patientId = params.id;
  const getServer = () => {
    const server = localStorage.getItem('fhirServer');
    return server ? server : '';
  };

  const getHeaders = () => {
    const data = localStorage.getItem('serverHeaders');
    return data ? data : '{}';
  };

  const [fhirServer, setServer] = useState(getServer());
  const [serverHeaders, setHeaders] = useState(getHeaders());

  // state for data
  const [patientData, setPatientData] = useState(null);
  const [vitalsData, setVitalsData] = useState([]);
  const [encounterData, setEncounterData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [immunizationData, setImmunizationData] = useState([]);
  const [allergyIntoleranceData, setAllergyIntoleranceData] = useState([]);

  // state for error
  const [error, setError] = useState(false);

  // state for loading
  const [patientLoading, setPatientLoading] = useState(true);
  const [vitalsLoading, setVitalsLoading] = useState(true);
  const [encounterLoading, setEncounterLoading] = useState(true);
  const [conditionLoading, setConditionLoading] = useState(true);
  const [immuneLoading, setImmuneLoading] = useState(true);
  const [allergyIntoleranceLoading, setAllergyIntoleranceLoading] = useState(true);

  useEffect(() => {
    setServer(getServer());
    setHeaders(getHeaders());

    if (getServer()) {
      getPatientData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setPatientData(data.data);
          setPatientLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getVitalsData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setVitalsData(data.data);
          setVitalsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getEncounterData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data && data.data.entry ? data.data.entry.map((e) => e.resource) : [];
          setEncounterData(filtered);
          setEncounterLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getConditionData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data.entry.map((e) => e.resource);
          setConditionData(filtered);
          setConditionLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getImmunizationData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setImmunizationData(data.data);
          setImmuneLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getAllergyIntoleranceData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setAllergyIntoleranceData(data.data);
          setAllergyIntoleranceLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    } else {
      history.push('/');
    }
  }, [localStorage.getItem('fhirServer')]);

  const breadcrumbData = [
    {
      label: 'Home',
      link: '/'
    }
  ];

  const pageheaderOptions = {
    title: `Patient Summary`,
    breadcrumbs: <Breadcrumbs list={breadcrumbData} onClick={(link) => history.push(link)} />
  };
  return error ? (
    <Info text="Something went wrong" icon="error" />
  ) : (
    <div className="Summary">
      <PageHeader {...pageheaderOptions} />
      <div className="Summary-body">
        <PatientInfo data={patientData} loading={patientLoading} />
        <Encounters
          fhirServer={`${fhirServer}`}
          serverHeaders={{}}
          resources={encounterData}
          loading={encounterLoading}
        />
        <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
          <Condition resources={conditionData} loading={conditionLoading} />
        </div>
        <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
          <ImmunizationTable resources={immunizationData.entry} loading={immuneLoading} />
        </div>
        <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
          <AllergyIntoleranceTable resources={allergyIntoleranceData.entry} loading={allergyIntoleranceLoading} />
        </div>
        <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
          <VitalsTable resources={vitalsData.entry} loading={vitalsLoading} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
