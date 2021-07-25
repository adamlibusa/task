export interface IFlowStep {
  id: number;
  name: string;
  text: string;
  uiType: 'button';
  valueType: 'boolean' | 'string' | 'number';
  valueOptions: IFlowStepOptions[];
  mediaUrl?: string;
}

export interface IFlowStepOptions {
  nextId: number | boolean;
  value: number | boolean | string;
  text: string;
}

export interface IChatMessage {
  flowStep?: IFlowStep;
  text: string;
  participant: 'bot' | 'me';
}