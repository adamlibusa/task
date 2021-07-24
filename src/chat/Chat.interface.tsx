export interface IMessage {
  id: number,
  name: string,
  text: string,
  uiType: 'button',
  valueType: 'boolean' | 'string' | 'number',
  valueOptions: IMessageValueOptions[],
}

export interface IMessageValueOptions {
  nextId: number | boolean;
  value: number | boolean | string;
  text: string;
}