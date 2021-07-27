export interface IFlowStep {
  id: number;
  name: string;
  text: string;
  uiType: 'button' | 'readonly';
  valueType?: 'boolean' | 'string' | 'number';
  valueOptions?: IFlowStepOption[];
  mediaUrl?: string;
  send: boolean;
}

export interface IFlowStepOption {
  nextId: number | boolean;
  value: number | boolean | string;
  text: string;
}

export interface IChatMessage {
  flowStep?: IFlowStep;
  text: string;
  participant: 'bot' | 'me';
}