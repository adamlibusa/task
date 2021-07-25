export interface IFlowStepMessage {
  id: number;
  name: string;
  text: string;
  uiType: 'button';
  valueType: 'boolean' | 'string' | 'number';
  valueOptions: IFlowStepOptions[];
}

export interface IFlowStepOptions {
  nextId: number | boolean;
  value: number | boolean | string;
  text: string;
}

export interface IChatMessage {
  message: IFlowStepMessage,
  participant: 'bot' | 'me';
  mediaUrl?: string;
  shown: boolean;
}