// src/components/ReviewForm.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ReviewForm = ({ tmdbId, onSuccess, existingReview = null }: any) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [content, setContent] = useState(existingReview?.content || '');
  const [spoilers, setSpoilers] = useState(existingReview?.spoilers || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = existingReview ? `/api/reviews/${existingReview._id}` : '/api/reviews';
      const method = existingReview ? 'put' : 'post';
      await axios[method](url, { tmdbId, rating, title, content, spoilers });
      toast.success(`Review ${existingReview ? 'updated' : 'created'} successfully`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">{existingReview ? 'Edit Review' : 'Write a Review'}</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Your review..."
        className="w-full p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="number"
        min={1}
        max={10}
        className="w-full p-2 border rounded"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={spoilers}
          onChange={() => setSpoilers(!spoilers)}
        />
        <span>Contains spoilers</span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? 'Submitting...' : existingReview ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default ReviewForm;