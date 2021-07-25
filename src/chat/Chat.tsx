import {useEffect, useState} from 'react'
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
import {IChatMessage, IFlowStep} from './Chat.interface';
import {finalStep, initialFlowStepMessages} from './flowStepMessages'
import style from './Chat.module.scss'



function Chat() {
  const [inputText, setInputText] = useState<string>('')
  const [flowSteps, setFlowSteps] = useState<IFlowStep[]>([])
  const [messages, setMessages] = useState<IChatMessage[]>([])

  /**
   * Load the initial messages
   */
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mzronek/task/main/flow.json')
      .then(data => data.json())
      .then(loadedFlowSteps => initialFlowStepMessages.concat(loadedFlowSteps))
      .then(allFlowSteps => allFlowSteps.sort((a: IFlowStep, b: IFlowStep) => a.id - b.id))
      .then(sortedFlowSteps => {
        setFlowSteps(sortedFlowSteps)

        // Add the 1st flow step as the initial message
        const firstFlowStep = sortedFlowSteps[0]
        const newMessage: IChatMessage = {
          flowStep: firstFlowStep,
          text: '',
          participant: 'bot'
        }
        setMessages([newMessage])
      })
  }, [])

  const postBotMessage = (nextStepId: number | boolean) => {
    const flowStep = flowSteps.find(step => step.id === nextStepId) ?? finalStep
    const newMessage: IChatMessage = {
      flowStep,
      text: '',
      participant: 'bot'
    }
    setMessages(messages.concat([newMessage]))
  }

  const postUserMessage = (text: string) => {
    if (!text) {
      return
    }
    const newMessage: IChatMessage = {
      flowStep: undefined,
      text,
      participant: 'me'
    }
    setMessages(messages.concat([newMessage]))
    setInputText('')
  }

  const isLastMessageWithFlowStep = (message: IChatMessage) => {
    const messagesWithFlowSteps = messages.filter(m => m.flowStep)
    if (messagesWithFlowSteps.length === 0) {
      return false
    }
    if (messagesWithFlowSteps[messagesWithFlowSteps.length - 1]?.flowStep?.id === message?.flowStep?.id) {
      return true
    }
    return false
  }

  return (
    <Container className={style.Chat}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write our bot some stuff
        </Typography>

        {messages.map(message => (
          <Card className="chat-bubble">
            <CardActionArea>
              <CardMedia
                image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {message?.flowStep?.text ?? message.text}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {message?.flowStep?.uiType === 'button' ? (
                message?.flowStep?.valueOptions?.map(option => (
                  <Button size="small" color="primary" onClick={() => postBotMessage(option.nextId)}
                          disabled={!isLastMessageWithFlowStep(message)}
                  >
                    {option.text}
                  </Button>
                ))
              ) : ''}
            </CardActions>
          </Card>
        ))}

        <TextField
          id="chat-input"
          label="Write your message here"
          fullWidth
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              postUserMessage(inputText)
            }
          }}
        />
        <div className="buttons">
          <Button className="send-button" variant="contained" color="primary"
                  onClick={(e) => postUserMessage(inputText)}>
            Send
          </Button>
        </div>
      </Box>
    </Container>
  );
}

export default Chat;
