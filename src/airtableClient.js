// src/airtableClient.js
import Airtable from 'airtable';

// The Personal Access Token is used as the apiKey
const personalAccessToken = process.env.REACT_APP_AIRTABLE_PAT;
const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey: personalAccessToken }).base(baseId);

export default base;