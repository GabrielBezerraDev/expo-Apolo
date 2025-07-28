import { IMetaData } from "./IMetaData";

export interface IModelDataItem {
  keyData: string;
  description: string;
}

export interface IModelData {
  modelName: string;
  modelDataList: IModelDataItem[];
  metaData: IMetaData;
}
