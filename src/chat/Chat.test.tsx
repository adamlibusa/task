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

  test('Chat calls the API via fetch', async () => {
    render(<Chat />)
    // Wait for the "Ja" button - just to make sure the first card is loaded
    await screen.findByText('Ja')

    const textInput = screen.getByTestId('chat-input')

    fireEvent.change(textInput, {target: {value: 'ja'}})
    screen.getByTestId('submit-button').click()
    await screen.findByText('OK')

    // At this point, we loaded the external flow steps (shouldn't do it in the tests, I know, I know) and can mock
    // fetch to see it if gets called
    const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue(null)

    fireEvent.change(textInput, {target: {value: 'ok'}})
    screen.getByTestId('submit-button').click()
    await screen.findByText(/Benötigen Sie eine Haftplichtversicherung?./)

    fireEvent.change(textInput, {target: {value: 'nein'}})
    screen.getByTestId('submit-button').click()
    await screen.findByText(/Benötigen Sie eine Kasko?./)

    expect(mockedFetch).toHaveBeenNthCalledWith(1, "https://virtserver.swaggerhub.com/L8475/task/1.0.0/conversation", {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"liability","value":false}'
    })
  })
})
