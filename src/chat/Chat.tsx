import {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import {IChatMessage, IFlowStep, IFlowStepOption} from './Chat.interface';
import {finalStep, initialFlowStepMessages} from './flowStepMessages'
import ChatBubble from '../chat-bubble/ChatBubble';
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
      .then(enrichBoringLoadedDataWithGifs)
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

  const enrichBoringLoadedDataWithGifs = (loadedFlowSteps: IFlowStep[]) => loadedFlowSteps.map((step: IFlowStep) => {
    let mediaUrl
    if (step.id === 100) {
      mediaUrl = '/img/clumsy-jar-jar.gif'
    } else if (step.id === 200) {
      mediaUrl = '/img/obi-riding.gif'
    }
    return {
      ...step,
      send: true,
      mediaUrl,
    }
  })

  const postBotMessage = async (startingStep: IFlowStep, option: IFlowStepOption, messagesAsParam: IChatMessage[]) => {
    const nextStepId: number | boolean = option.nextId

    const flowStep = flowSteps.find(step => step.id === nextStepId) ?? finalStep
    if (startingStep.send) {
      await sendChoice(startingStep, option)
    }
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
    if (lastMessageWithFlowStep?.flowStep && answerOption) {
      postBotMessage(lastMessageWithFlowStep.flowStep, answerOption, newMessages)
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

  const sendChoice = async (flowStep: IFlowStep, option: IFlowStepOption) =>
    fetch('https://virtserver.swaggerhub.com/L8475/task/1.0.0/conversation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: flowStep.name, value: option.value})
    })

  return (
    <Container className={style.Chat}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sie können auf die Buttons klicken, oder die Antwort als eine Message schreiben, um die Fragen zu antworten
        </Typography>

        {messages.map(message => (
          <ChatBubble
            messages={messages}
            message={message}
            postBotMessage={postBotMessage}
            isLastMessageWithFlowStep={isLastMessageWithFlowStep}
          />
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
