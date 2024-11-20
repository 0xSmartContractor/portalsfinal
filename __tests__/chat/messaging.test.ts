import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { io } from 'socket.io-client';
import ChatPage from '@/app/dashboard/chat/page';

jest.mock('socket.io-client');

describe('Chat System', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(() => {
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('establishes socket connection on mount', () => {
    render(<ChatPage />);
    expect(io).toHaveBeenCalledWith('http://localhost:3000', {
      path: '/api/socket',
    });
  });

  it('sends and receives messages', async () => {
    render(<ChatPage />);

    // Send message
    fireEvent.change(screen.getByPlaceholder(/type your message/i), {
      target: { value: 'Hello team!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith('message', {
      content: 'Hello team!',
    });

    // Receive message
    const mockMessage = {
      id: '1',
      content: 'Hello back!',
      user: { name: 'Jane' },
      createdAt: new Date().toISOString(),
    };

    // Simulate receiving message
    const messageHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'message'
    )[1];
    messageHandler(mockMessage);

    await waitFor(() => {
      expect(screen.getByText('Hello back!')).toBeInTheDocument();
    });
  });

  it('handles image uploads', async () => {
    render(<ChatPage />);

    const file = new File(['test image'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-input');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('message', {
        content: expect.any(String),
        isImage: true,
      });
    });
  });

  it('shows read receipts', async () => {
    render(<ChatPage />);

    const mockReadReceipt = {
      messageId: '1',
      user: { name: 'Jane' },
      readAt: new Date().toISOString(),
    };

    const readReceiptHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'readReceipt'
    )[1];
    readReceiptHandler(mockReadReceipt);

    await waitFor(() => {
      expect(screen.getByText(/read by 1 person/i)).toBeInTheDocument();
    });
  });
});