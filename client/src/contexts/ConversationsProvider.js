import React, { useContext, useEffect, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage('conversations', []);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();

  const socket = useSocket();

  const createConversation = (ids) => {
    setConversations((prev) => {
      return [...prev, { recipients: ids, messages: [] }];
    });
  };

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipientId) => {
      const contact = contacts.find((contact) => contact.id === recipientId);
      const name = (contact && contact.name) || recipientId;
      return { recipientId, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((ct) => ct.name === message.sender);
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, fromMe, senderName: name };
    });

    conversation.selected = index === selectedConversationIndex;
    return { ...conversation, messages: messages, recipients: recipients };
  });

  const arraysEqual = (firstArray, secondArray) => {
    if (firstArray.length !== secondArray.length) return false;
    firstArray.sort();
    secondArray.sort();
    return firstArray.every((element, index) => {
      return element == secondArray[index];
    });
  };

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        let madeChange = false;
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((convo) => {
          if (arraysEqual(recipients, convo.recipients)) {
            madeChange = true;
            return { ...convo, messages: [...convo.messages, newMessage] };
          }
          return convo;
        });
        if (madeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (socket == null) return;
    socket.on('recieve-message', (data) => {
      addMessageToConversation(data);
      console.log('HERE');
    });
    return () => {
      socket.off('recieve-message');
    };
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipients, text) => {
    socket.emit('send-message', { recipients, text });
    addMessageToConversation({ recipients, text, sender: id });
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations: formattedConversations,
        createConversation,
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        selectedConversation: formattedConversations[selectedConversationIndex],
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
