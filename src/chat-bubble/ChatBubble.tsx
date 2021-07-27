import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@material-ui/core';
import {IChatMessage, IFlowStep, IFlowStepOption} from '../chat/Chat.interface';
import style from './ChatBubble.module.scss'

interface ChatBubbleProps {
  messages: IChatMessage[],
  message: IChatMessage,
  postBotMessage: (startingStep: IFlowStep, option: IFlowStepOption, messagesAsParam: IChatMessage[]) => void;
  isLastMessageWithFlowStep: (message: IChatMessage) => boolean;
}

function ChatBubble(props: ChatBubbleProps) {
  const {messages, message, postBotMessage, isLastMessageWithFlowStep} = props

  return (
    <Card className={style.ChatBubble} key={messages.indexOf(message)}>
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
          message?.flowStep?.valueOptions?.map((option: IFlowStepOption) => (
            <Button
              key={option.value.toString()}
              size="small" color="primary"
              onClick={() => postBotMessage(message?.flowStep as IFlowStep, option, messages)}
              disabled={!isLastMessageWithFlowStep(message)}
            >
              {option.text}
            </Button>
          ))
        ) : ''}
      </CardActions>
    </Card>
  )
}

export default ChatBubble
