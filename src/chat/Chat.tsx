import {useEffect, useState} from 'react';
import {Box, Button, Container, TextField, Typography} from '@material-ui/core';
import style from './Chat.module.scss'
import {IMessage} from './Chat.interface';

function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([])

  /**
   * Load the initial messages
   */
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mzronek/task/main/flow.json')
      .then(data => data.json())
      .then(loadedMessages => loadedMessages.sort((a: IMessage, b: IMessage) => a.id < b.id))
      .then(orderedMessages => setMessages(orderedMessages))
  }, [])

  return (
    <Container className={style.Chat}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write our bot some stuff
        </Typography>
        {JSON.stringify(messages)}
        <TextField
          id="chat-input"
          label="Write your message here"
          fullWidth
          multiline
          rows={4}
        />
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
