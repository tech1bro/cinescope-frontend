// src/components/ReviewList.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ReviewList = ({ reviews, onLike, onUnlike, currentUserId }: any) => {
  if (!reviews.length) return <p className="text-sm text-gray-500">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <div key={review._id} className="p-4 border rounded bg-white shadow">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              <strong>{review.user.name}</strong> • {formatDistanceToNow(new Date(review.createdAt))} ago
              {review.spoilers && <span className="ml-2 text-red-500 text-xs">Spoilers</span>}
            </div>
            <div className="text-yellow-500 font-semibold">Rating: {review.rating}/10</div>
          </div>
          <h3 className="text-md font-bold mt-2">{review.title}</h3>
          <p className="text-sm text-gray-800">{review.content}</p>
          <div className="flex items-center mt-2 space-x-4">
            <button
              className="text-indigo-600 text-sm"
              onClick={() =>
                review.likes.some((like: any) => like.user === currentUserId)
                  ? onUnlike(review._id)
                  : onLike(review._id)
              }
            >
              {review.likes.some((like: any) => like.user === currentUserId) ? 'Unlike' : 'Like'} ({review.likesCount})
            </button>
            {review.isEdited && <span className="text-xs text-gray-400">Edited</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
