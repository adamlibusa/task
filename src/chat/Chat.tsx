import {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import {IChatMessage, IFlowStep, IFlowStepOption} from './Chat.interface';
import {finalStep, initialFlowStepMessages} from './flowStepMessages'
import style from './Chat.module.scss'

/**
 * Remove whitespaces, interpunction and convert to lowercase
 */
const normalizeText = (text: string) => text.replace(/[\s\.!?\:\-\(\)]/g, '').toLowerCase()

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

  const postBotMessage = (nextStepId: number | boolean, messagesAsParam: IChatMessage[]) => {
    const flowStep = flowSteps.find(step => step.id === nextStepId) ?? finalStep
    const newMessage: IChatMessage = {
      flowStep,
      text: '',
      participant: 'bot'
    }
    setMessages(messagesAsParam.concat([newMessage]))
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
    const newMessages: IChatMessage[] = messages.concat([newMessage])
    setMessages(newMessages)
    setInputText('')

    // Check if the user's message isn't an answer to one of the bot's questions
    const lastMessageWithFlowStep = getLastMessageWithFlowStep()
    const answerOption = findOptionThisUserMessageIsAnswerTo(text, lastMessageWithFlowStep?.flowStep)
    if (answerOption) {
      postBotMessage(answerOption.nextId, newMessages)
    }
  }

  const getLastMessageWithFlowStep = () => {
    const messagesWithFlowSteps = messages.filter(m => m.flowStep)
    if (messagesWithFlowSteps) {
      return messagesWithFlowSteps[messagesWithFlowSteps.length - 1]
    } else {
      return null
    }
  }

  const isLastMessageWithFlowStep = (message: IChatMessage) => {
    const lastMessageWithFlowSteps = getLastMessageWithFlowStep()
    if (lastMessageWithFlowSteps?.flowStep?.id === message?.flowStep?.id) {
      return true
    }
    return false
  }

  const findOptionThisUserMessageIsAnswerTo = (text: string, flowStep: IFlowStep | undefined) => {
    if (!flowStep || !flowStep.valueOptions || flowStep.valueOptions.length === 0) {
      return false
    }
    const bareText = normalizeText(text)
    return flowStep?.valueOptions?.find(option => normalizeText(option.text) === bareText)
  }

  return (
    <Container className={style.Chat}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write our bot some stuff
        </Typography>

        {messages.map(message => (
          <Card className="chat-bubble" key={messages.indexOf(message)}>
            <CardContent>
              {message?.flowStep?.mediaUrl ? (
                <img src={message?.flowStep?.mediaUrl} alt="Not the droids you were looking for" title="Not the droids you were looking for" />
              ) : null}
              <Typography variant="body2" color="textSecondary" component="p">
                {message?.flowStep?.text ?? message.text}
              </Typography>
            </CardContent>
            <CardActions>
              {message?.flowStep?.uiType === 'button' ? (
                message?.flowStep?.valueOptions?.map(option => (
                  <Button
                    key={option.value.toString()}
                    size="small" color="primary"
                    onClick={() => postBotMessage(option.nextId, messages)}
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
