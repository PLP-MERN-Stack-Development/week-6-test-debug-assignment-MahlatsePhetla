import { render, screen, waitFor } from '@testing-library/react';
import PostsList from '../../components/PostsList';

beforeEach(() => {
  // Mock fetch globally before each test
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders posts after fetching', async () => {
  const fakePosts = [
    { _id: '1', title: 'Post 1', content: 'Content 1' },
    { _id: '2', title: 'Post 2', content: 'Content 2' },
  ];

  global.fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(fakePosts),
  });

  render(<PostsList />);

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  // Wait for posts to be rendered
  await waitFor(() => {
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

test('shows no posts message when empty array', async () => {
  global.fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce([]),
  });

  render(<PostsList />);

  await waitFor(() => {
    expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  });
});
