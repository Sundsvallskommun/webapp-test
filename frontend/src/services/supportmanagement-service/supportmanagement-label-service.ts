import { apiService } from '../api-service';
import { Label, LabelSaveRequest, LabelsApiResponse } from '@data-contracts/backend/label-contracts';
import { LabelInterface, LabelSaveRequestInterface } from '@interfaces/supportmanagement.label';
import { v4 } from 'uuid';

const sortLabels = (labelStructure: LabelInterface[]) => {
  labelStructure?.forEach((label: LabelInterface) => {
    if (!label.isLeaf) {
      label.labels = sortLabels(label.labels);
    }
  });

  if (labelStructure) {
    labelStructure = labelStructure.toSorted((a, b) => compareLabels(a, b));
  }
  return labelStructure;
};

const compareLabels = (a: LabelInterface, b: LabelInterface): number => {
  const labelDiff = Number(b.isLeaf) - Number(a.isLeaf); // Sort leafs to be displayed before members with children
  if (labelDiff != 0) {
    return labelDiff;
  }  
  return a.displayName.localeCompare(b.displayName); // If no differense then sort on display name
};

const mapToLabelInterfaces: (data: Label[]) => LabelInterface[] = (data) => {
  return data?.map(mapToLabelInterface);
};

const mapToLabelInterface: (data: Label) => LabelInterface = (data) => ({
  uuid: v4(),
  classification: data.classification,
  prefix: extractPrefix(data.name),
  name: extractName(data.name),
  displayName: data.displayName,
  isLeaf: data.labels === undefined || data.labels.length == 0,
  isNew: false,
  labels: mapToLabelInterfaces(data.labels)
});

const extractName = (name: string): string => {
  if (name && name.lastIndexOf('.') != -1) {
    return name.substring(name.lastIndexOf('.') + 1);
  }
  return name;
};

const extractPrefix = (name: string): string => {
  if (name && name.lastIndexOf('.') != -1) {
    return name.substring(0, name.lastIndexOf('.'));
  }
  return null;
};

export const getLabels: (municipality: string, namespace: string) => Promise<LabelInterface[]> = async (municipality, namespace) => {
  const url = `/supportmanagement/municipality/${municipality}/namespace/${namespace}/labels`;
  const result = apiService
    .get<LabelsApiResponse>(url)
    .then((res) => mapToLabelInterfaces(res.data.labelStructure))
    .catch((e) => {
      console.error('Error occurred when fetching labels', e);
      throw e;
    });

  result.then((labels) => {
    sortLabels(labels);
  })

  return result;
};

const mapToLabels: (data: LabelInterface[]) => Label[] = (data) => {
  return data?.map(mapToLabel);
};

const mapToLabel: (data: LabelInterface) => Label = (data) => ({
  classification: data.classification,
  name: data.prefix ? data.prefix + '.' + data.name : data.name,
  displayName: data.displayName,
  labels: mapToLabels(data.labels)
});

export const createLabels: (municipalityId: string, namespace: string, request: LabelSaveRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/labels`;

  await apiService
    .post<LabelSaveRequest>(url, {
      labels: mapToLabels(request.labels)
    })
    .catch((e) => {
      console.error('Error occurred when creating labels', e);
      throw e;
    });

  await new Promise(r => setTimeout(r, 500)); 
};

export const updateLabels: (municipalityId: string, namespace: string, request: LabelSaveRequestInterface) => Promise<void> = async (municipalityId, namespace, request) => {
  const url = `supportmanagement/municipality/${municipalityId}/namespace/${namespace}/labels`;

  await apiService
    .put<LabelSaveRequest>(url, {
      labels: mapToLabels(request.labels)
    })
    .catch((e) => {
      console.error('Error occurred when updating labels', e);
      throw e;
    });

  await new Promise(r => setTimeout(r, 500)); 
};
