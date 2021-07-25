import {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import style from './Chat.module.scss'
import {IChatMessage, IFlowStepMessage} from './Chat.interface';


const initialFlowStepMessages: IChatMessage[] = [{
  "message": {
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
    ]
  },
  "participant": "bot",
  "mediaUrl": undefined,
  "shown": true
}, {
  "message": {
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
    ]
  },
  "participant": "bot",
  "mediaUrl": undefined,
  "shown": false
}, {
  "message": {
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
    ]
  },
  "participant": "bot",
  "mediaUrl": undefined,
  "shown": false
}]

function Chat() {
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([])

  /**
   * Load the initial messages
   */
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mzronek/task/main/flow.json')
      .then(data => data.json())
      .then(loadedMessages => loadedMessages.map((message: IFlowStepMessage) => ({
        message,
        participant: 'bot',
        mediaUrl: null,
        shown: false,
      })))
      .then(loadedChatMessages => initialFlowStepMessages.concat(loadedChatMessages))
      .then(allMessages => allMessages.sort((a: IChatMessage, b: IChatMessage) => a.message.id - b.message.id))
      .then(chatMessages => setChatMessages(chatMessages))
  }, [])

  const respond = (messageId: number | boolean) => {
    if (messageId === false) {
      console.log('we are done here')
      return
    }
    setChatMessages(chatMessages.map((m: IChatMessage) => {
      if (m.message.id === messageId) {
        return ({...m, shown: true})
      } else {
        return m
      }
    }))
  }

  return (
    <Container className={style.Chat}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write our bot some stuff
        </Typography>

        {chatMessages.map(chatMessage => (
          chatMessage.shown ? (
            <Card className="chat-bubble">
              <CardActionArea>
                <CardMedia
                  image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {chatMessage.message.text}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {chatMessage.message.uiType === 'button' ? (
                  chatMessage.message.valueOptions.map(option => (
                    <Button size="small" color="primary" onClick={() => respond(option.nextId)}>
                      {option.text}
                    </Button>
                  ))
                ) : ''}
              </CardActions>
            </Card>
          ) : null
        ))}

        <TextField id="chat-input" label="Write your message here" fullWidth />
        <div className="buttons">
          <Button className="send-button" variant="contained" color="primary">
            Send
          </Button>
        </div>
      </Box>
    </Container>
  );
}

export default Chat;
