import { apiService } from '../api-service';
import { Label, LabelsApiResponse } from '@data-contracts/backend/label-contracts';
import { v4 } from 'uuid';


const sortLabels = (labelStructure: Label[]) => {
  labelStructure?.forEach((label: Label) => {
    if (!label.isActualLabel) {
      label.labels = sortLabels(label.labels);
    }
  });

  if (labelStructure) {
	labelStructure = labelStructure.toSorted((a, b) => compareLabels(a, b));
  }
  return labelStructure;
};

const compareLabels = (a: Label, b: Label) => {
	const labelDiff = Number(b.isActualLabel) - Number(a.isActualLabel); // Sort actual labels to be displayed before members with children
	if (labelDiff != 0) {
		return labelDiff;
	}  
	return a.displayName.localeCompare(b.displayName); // If no differense then sort on display name
};

/**
  * Adds a uuid to each label object so we can keep track of them
 * @param labels the labels to add uuid to
 */
const addUuidToAllLabels = (labels: Label[]) => {
  if (!labels) {
      return;
  } 

  labels.map((label) => {
    label.uuid = v4();
    if (label.labels != null) {
      addUuidToAllLabels(label.labels);
    }
  });
};

const markActualLabels = (labelStructure: Label[]) => {
  labelStructure?.forEach((label: Label) => {
    if (label.labels === undefined || label.labels.length == 0) {
      label.isActualLabel = true;
    } else {
      label.isActualLabel = false;
      markActualLabels(label.labels);
    }
  });
}

export const getLabels: (municipality: string, namespace: string) => Promise<LabelsApiResponse> = async (municipality, namespace) => {
  const url = `/supportmanagement/municipality/${municipality}/namespace/${namespace}/labels`;

  console.log('Fetching labels from', url);

  const result = apiService
    .get<LabelsApiResponse>(url)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Error occurred when fetching labels', e);
      throw e;
    });

  result.then((labels) => markActualLabels(labels.labelStructure))
  result.then((labels) => addUuidToAllLabels(labels.labelStructure));
  result.then((labels) => sortLabels(labels.labelStructure));
  
  return result;
};
