import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './App.css';

import { id, i, init } from "@instantdb/react";



const APP_ID = "1a3ca935-0836-4123-935e-5cfc895226b5";



// Optional: Declare your schema!
const schema = i.schema({
  entities: {
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number(),
      contactId : i.any()
    }),
  },
});



const db = init({ appId: APP_ID, schema });




const Chat = () => {
  const { contactId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const query = {
    todos: {
      $: {
        where: {
          contactId: contactId,
        },
      },
    },
  };
  const { isLoading, error, data } = db.useQuery( query );

  console.log(data,'data');
  
  useEffect(() => {
    const fetchMessages = async () => {
      // Fetch messages from InstantDB
      // const response = await axios.get(`https://api.instantdb.com/messages/${contactId}`, {
      //   headers: { "AppID": "1a3ca935-0836-4123-935e-5cfc895226b5" },
      // });
      // const response = await axios.get(`https://api.instantdb.com/messages/${contactId}`, {
      //   headers: { "AppID": '1a3ca935-0836-4123-935e-5cfc895226b5' },
      // });
      // console.log(response,'response');
      
      setMessages(data?.todos);
      console.log(messages,'message');
      
    };

    fetchMessages();
  }, [data?.todos]);




  const sendMessage = async () => {

    setNewMessage('')
    addTodo(newMessage);
  
  };


  const addTodo = async (text) => {
    console.log(text,'text');
    
    let res = await db.transact(
      db.tx.todos[id()].update({
        text,
        done: false,
        createdAt: Date.now(),
        contactId : contactId
      })
    );
    console.log(res,'res');
    
    
  }


  return (
      <>
      <div className="container-fluid " >
        <div className="row">
        <div className="chat-window">
      <div className="chat-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <img src="https://via.placeholder.com/40" alt="Chat" className="rounded-circle me-2"/>
          <span>{contactId}</span>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        <i className="bi bi-three-dots"></i>
      </div>
      <div className="chat-messages">
        <div className="message sent">
      
           {messages && messages.map((msg)=>(
            <div key={msg.id}>
              <strong>{msg.sender}:</strong>{msg.text}
            </div>
          ))}
        </div>
        {/* <div className="message received">
          <p>I’m good, thanks! What about you?</p>
        </div> */}
      </div>
      <div className="chat-input">
        <input type="text" className="form-control" placeholder="Type a message" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
        <button className="btn btn-success" onClick={sendMessage} type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
        </svg>
        </button>
      </div>
    </div>
        </div>
      </div>
      </>




    // <div>
    //   <h2>Chat with {contactId}</h2>
    //   <div className="messages">
    //     {messages.map((msg) => (
    //       <div key={msg.id}>
    //         <strong>{msg.sender}:</strong> {msg.text}
    //       </div>
    //     ))}
    //   </div>
    //   <input
    //     type="text"
    //     value={newMessage}
    //     onChange={(e) => setNewMessage(e.target.value)}
    //     placeholder="Type a message"
    //   />
    //   <button onClick={sendMessage}>Send</button>
    // </div>
  );
};

export default Chat;
