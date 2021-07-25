import {IFlowStep} from './Chat.interface'

export const initialFlowStepMessages: IFlowStep[] = [{
  "id": 0,
  "name": "",
  "text": "Hallöchen. Ich bin ein neuer Versicherungsbot. Willkomen! Zuerst die wichtigste Frage: Gefallen Ihnen Star Wars?",
  "uiType": "button",
  "valueType": "boolean",
  "valueOptions": [
    {
      "nextId": 50,
      "value": true,
      "text": "Ja"
    },
    {
      "nextId": 51,
      "value": false,
      "text": "Nein"
    }
  ],
  "mediaUrl": undefined
}, {
  "id": 50,
  "name": "",
  "text": "Sehr gut. In diesem Fall können wir weitermachen. Ich werde Ihnen ein paar Fragen stellen. Passt es so?",
  "uiType": "button",
  "valueType": "boolean",
  "valueOptions": [
    {
      "nextId": 100,
      "value": true,
      "text": "OK"
    },
  ],
  "mediaUrl": undefined
}, {
  "id": 51,
  "name": "",
  "text": "Das tut mir leid, aber ich denke nicht, dass ich Ihnen helfen kann. Möge die Macht mit Ihnen sein.",
  "uiType": "button",
  "valueType": "boolean",
  "valueOptions": [
    {
      "nextId": false,
      "value": false,
      "text": "OK :("
    },
  ],
  "mediaUrl": undefined
}]

export const finalStep: IFlowStep = {
  "id": 1_000_000,
  "name": "",
  "text": "Das wird wahrscheinlich alles von meiner Seite. Vielen Dank und ich wünsche Ihnen einen schönen Tag!",
  "uiType": "readonly",
  "valueType": undefined,
  "valueOptions": undefined,
  "mediaUrl": undefined
}
