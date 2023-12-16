import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import loading from "./assets/react.svg"

interface IChat {
  text: {
    role: string
    content?: string
    url?: string
  }
}

function App() {
  const [text, setText] = useState("")
  const [chat, setChat] = useState<IChat[]>(JSON.parse(window.localStorage.getItem("chat")) || [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    toBottomOfTheBox()
  }, [])

  useEffect(() => {
    window.localStorage.setItem("chat", JSON.stringify(chat))
  }, [chat])

  const toBottomOfTheBox = (): void => {
    const objDiv = document.querySelector(".chat")
    // objDiv.scrollTop = objDiv.scrollHeight
    objDiv.scrollTo({
      top: objDiv.scrollHeight,
      behavior: "smooth"
    });
  }

  const handleSend = async () => {
    if (text.trim() === "") return
    setIsLoading(true)
    setChat(curr => [...curr, { text: { role: "user", content: text } }])
    try {
      await axios.post("http://localhost:3001/send-message", {
        content: text
      })
        .then(res => res.data)
        .then(res => {
          setChat(curr => [...curr, res])
        })
    } catch (error) {
      alert(error)
    }
    setText("")
    setIsLoading(false)
    toBottomOfTheBox()
  }

  const createImage = async () => {
    if (text.trim() === "") return
    setIsLoading(true)
    setChat(curr => [...curr, { text: { role: "user", content: text } }])
    try {
      await axios.post("http://localhost:3001/create-image", {
        content: text
      })
        .then(res => res.data)
        .then(res => {
          setChat(curr => [...curr, res])
        })
    } catch (error) {
      alert(error)
    }
    setText("")
    setIsLoading(false)
    toBottomOfTheBox()
  }

  const handleImageOpening = (url: string) => {
    window.open(url, '_blank');
  }

  return (
    <div className="container">

      <div className="chat">
        {
          chat && chat.length > 0 ?
            chat && chat.map((item, index) => (
              item.text?.role === "assistant" ?
                item.text?.url ?
                  <div onClick={() => handleImageOpening(item.text.url)} className="msg msg__assitant" key={index} >
                    <img style={{ cursor: "pointer" }} width={512} height="auto" src={`${item.text.url}`} alt="something else" />
                    <Editor />
                  </div>
                  :
                  <div className="msg msg__assitant" key={index} dangerouslySetInnerHTML={{ __html: item.text?.content }}></div>
                :
                (<div className="msg msg__user" key={index}>{item.text?.content}</div>)
            ))
            :
            <div className="hi__msg">Hi, how can I help you?</div>
        }
        {
          isLoading && (
            <div className="msg msg__assitant" >
              <img src={loading} alt="Loading..." />
            </div>
          )
        }
        <div className="input__box">
          <div>
            <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Write your prompt" />
          </div>
          <div className="buttons">
            <button disabled={isLoading ? true : false} onClick={handleSend}>Send</button>
            <button disabled={isLoading ? true : false} onClick={createImage}>Create an Image</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
