import { apiService } from '../api-service';
import { Label, LabelsApiResponse } from '@data-contracts/backend/label-contracts';
import { v4 } from 'uuid';

export const getLabels: (municipality: string, namespace: string) => Promise<LabelsApiResponse> = async (municipality, namespace) => {
  const url = `/supportmanagement/municipality/${municipality}/namespace/${namespace}/labels`;

  console.log('Fetching labels from', url);

  const result = apiService
    .get<LabelsApiResponse>(url)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Error occurred when fetching namespaces', e);
      throw e;
    });

  result.then((labels) => addUuidToAllLabels(labels.labelStructure));

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

  return result;
};
