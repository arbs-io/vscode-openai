import * as React from 'react'
import {
  Avatar,
  Chat,
  ChatItemProps,
  Divider,
  ShorthandCollection,
} from '@fluentui/react-northstar'
import { AcceptIcon, EyeIcon } from '@fluentui/react-icons-northstar'

const status = {
  color: 'green',
  icon: <AcceptIcon />,
  title: 'Available',
}

const robinAvatar = {
  image:
    'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobinCounts.jpg',
  status: { color: 'green', icon: <AcceptIcon /> },
}

const items: ShorthandCollection<ChatItemProps> = [
  {
    gutter: (
      <Avatar name="Andrew Butson (Software Developer)" status={status} />
    ),
    message: (
      <Chat.Message
        content="Hello"
        author="Cecil Folk"
        timestamp="Yesterday, 10:15 PM"
        mine
      />
    ),
    contentPosition: 'end',
    attached: 'top',
    key: 'message-id-1',
  },
  {
    gutter: (
      <Avatar name="Andrew Butson (Software Developer)" status={status} />
    ),
    message: (
      <Chat.Message
        content="I'm back!"
        author="Cecil Folk"
        timestamp="Yesterday, 10:15 PM"
        mine
      />
    ),
    contentPosition: 'end',
    attached: true,
    key: 'message-id-2',
  },
  {
    gutter: (
      <Avatar name="Andrew Butson (Software Developer)" status={status} />
    ),
    message: (
      <Chat.Message
        content={{
          content: (
            <div>
              What do you think about <a href="#">www.goodFood.com</a>?
            </div>
          ),
        }}
        author="Cecil Folk"
        timestamp="Yesterday, 10:15 PM"
        mine
      />
    ),
    contentPosition: 'end',
    attached: 'bottom',
    key: 'message-id-3',
  },
  {
    gutter: <Avatar name="Software Engineer (OpenAI)" status={status} />,
    message: (
      <Chat.Message
        content="Hi"
        author="Robin Counts"
        timestamp="Yesterday, 10:15 PM"
      />
    ),
    attached: 'top',
    key: 'message-id-4',
  },
  {
    gutter: <Avatar name="Software Engineer (OpenAI)" status={status} />,
    message: (
      <Chat.Message
        content="Help me write a DAVINCI prompt to add comments to the source code which I will include in the prompt. The prompt to only add comments in the code. The prompt should only return the original code with the comments included. We do not require an overview, problems, output or any other additional information, only the original source code with the comments next to each line of code. The comments should only be included if the code is complex enough to require an explanation."
        author="Robin Counts"
        timestamp="Yesterday, 10:15 PM"
      />
    ),
    attached: true,
    key: 'message-id-5',
  },
  {
    gutter: <Avatar name="Software Engineer (OpenAI)" status={status} />,
    message: (
      <Chat.Message
        content={
          <div>
            I also like <a href="#">www.goodFood2.com</a>.
          </div>
        }
        author="Robin Counts"
        timestamp="Yesterday, 10:15 PM"
      />
    ),
    attached: 'bottom',
    key: 'message-id-6',
  },
  {
    gutter: (
      <Avatar name="Andrew Butson (Software Developer)" status={status} />
    ),
    message: (
      <Chat.Message
        content="Would you like to grab lunch there?"
        author="Cecil Folk"
        timestamp="Yesterday, 10:16 PM"
        mine
      />
    ),
    contentPosition: 'end',
    key: 'message-id-7',
  },
  {
    gutter: <Avatar name="Software Engineer (OpenAI)" status={status} />,
    message: (
      <Chat.Message
        content="Sure! Let's try it."
        author="Robin Counts"
        timestamp="Yesterday, 10:15 PM"
      />
    ),
    key: 'message-id-8',
  },
  {
    children: <Divider content="Today" color="brand" important />,
    key: 'message-id-9',
  },
  {
    gutter: <Avatar name="Software Engineer (OpenAI)" status={status} />,
    message: (
      <Chat.Message
        content="Ok, let's go."
        author="Cecil Folk"
        timestamp="Today, 11:15 PM"
        mine
      />
    ),
    contentPosition: 'end',
    key: 'message-id-10',
  },
]

const ChatExample = () => <Chat items={items} />

export default ChatExample
