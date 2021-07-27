import {render, screen} from '@testing-library/react'
import Chat from './Chat'


describe('Chat', () => {
  test('contains the right static text', () => {
    render(<Chat />)
    const linkElement = screen.getByText(/Sie können auf die Buttons klicken, oder die Antwort als eine Message schreiben, um die Fragen zu antworten/)
    expect(linkElement).toBeInTheDocument()
  })

  test('clicking on the first "Ja" shows another card', async () => {
    render(<Chat />)
    const jaButton = await screen.findByText('Ja')
    jaButton.click()

    const linkElement = await screen.findByText(/Sehr gut. In diesem Fall können wir weitermachen. Ich werde Ihnen ein paar Fragen stellen./)
    expect(linkElement).toBeInTheDocument()
  })
})
