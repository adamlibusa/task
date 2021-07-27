import {fireEvent, render, screen} from '@testing-library/react'
import Chat from './Chat'


describe('Chat', () => {
  test('contains the right static text', () => {
    render(<Chat />)
    const element = screen.getByText(/Sie können auf die Buttons klicken, oder die Antwort als eine Message schreiben, um die Fragen zu antworten/)
    expect(element).toBeInTheDocument()
  })

  test('clicking on the first "Ja" shows another card', async () => {
    render(<Chat />)
    const jaButton = await screen.findByText('Ja')
    jaButton.click()

    const secondCard = await screen.findByText(/Sehr gut. In diesem Fall können wir weitermachen. Ich werde Ihnen ein paar Fragen stellen./)
    expect(secondCard).toBeInTheDocument()
  })

  test('typing the answer in the input field shows another card', async () => {
    render(<Chat />)
    // Wait for the "Ja" button - just to make sure the first card is loaded
    await screen.findByText('Ja')

    const textInput = screen.getByTestId('chat-input')
    fireEvent.change(textInput, {target: {value: 'nein'}})
    screen.getByTestId('submit-button').click()

    const secondCard = await screen.findByText(/Das tut mir leid, aber ich denke nicht, dass ich Ihnen helfen kann./)
    expect(secondCard).toBeInTheDocument()
  })
})
