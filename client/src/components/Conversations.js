import { useConversations } from '../contexts/ConversationsProvider';
import { ListGroup } from 'react-bootstrap';

function Conversations() {
  const { conversations, selectConversationIndex } = useConversations();

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => {
        return (
          <ListGroup.Item
            key={index}
            onClick={() => selectConversationIndex(index)}
            action
            active={conversation.selected}
          >
            {conversation.recipients.map((recipient) => recipient.name).join(', ')}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default Conversations;
