"use client";

import { useState, useEffect, useRef } from "react";
import { Comment } from "@/types";
import { md } from "./md";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentCommentId: string) => void;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const hasReplies = comment.replies && comment.replies.length > 0;

  useEffect(() => {
    let date: Date;
    
    if (typeof comment.timestamp === 'string') {
      // Try to parse the date string
      const parsedDate = new Date(comment.timestamp);
      date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    } else if (comment.timestamp instanceof Date) {
      date = comment.timestamp;
    } else if (comment.timestamp && typeof comment.timestamp === 'object') {
      // Handle Firestore Timestamp format
      const ts = comment.timestamp as any;
      if (ts._seconds) {
        date = new Date(ts._seconds * 1000);
      } else {
        date = new Date();
      }
    } else {
      date = new Date();
    }
    
    setFormattedDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [comment.timestamp]);

  const displayName = comment.commenterName || "Anonymous";

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{displayName}</span>
            {comment.fromAdmin && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Admin
              </span>
            )}
            {comment.editedByAdmin && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Edited
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <div
          className="text-gray-700 prose prose-sm max-w-none mb-3"
          dangerouslySetInnerHTML={{ __html: md.render(comment.text) }}
        />
        <button
          onClick={() => onReply(comment.id)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Reply
        </button>
      </div>
      
      {hasReplies && (
        <div className="mt-2">
          {isExpanded ? (
            <>
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
              {depth >= 2 && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                >
                  Show less
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  
  const recaptchaWidgetId = useRef<string | null>(null);
  const recaptchaTokenRef = useRef<string | null>(null);

  // Sync token ref with state
  useEffect(() => {
    recaptchaTokenRef.current = recaptchaToken;
  }, [recaptchaToken]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Initialize reCAPTCHA v3
  useEffect(() => {
    let mounted = true;
    
    const initRecaptcha = () => {
      if (!mounted) return;
      
      if (typeof window !== 'undefined' && 
          window.grecaptcha && 
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        // reCAPTCHA v3 is ready, no explicit widget initialization needed
        // We'll execute it when user tries to submit
      }
    };

    // Wait for reCAPTCHA script to be loaded
    if (typeof window !== 'undefined') {
      if (window.grecaptcha) {
        // Script already loaded
        const timer = setTimeout(initRecaptcha, 100);
        return () => {
          mounted = false;
          clearTimeout(timer);
        };
      } else {
        // Wait for script to load
        const checkRecaptcha = setInterval(() => {
          if (window.grecaptcha) {
            clearInterval(checkRecaptcha);
            initRecaptcha();
          }
        }, 100);

        const timeout = setTimeout(() => {
          clearInterval(checkRecaptcha);
          if (mounted) {
            setRecaptchaError('reCAPTCHA failed to load. Please refresh the page.');
          }
        }, 5000); // 5 second timeout

        return () => {
          mounted = false;
          clearInterval(checkRecaptcha);
          clearTimeout(timeout);
        };
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setRecaptchaError('Please enter a comment.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setRecaptchaError(null);

    // Execute reCAPTCHA v3 and get token
    if (typeof window !== 'undefined' && 
        window.grecaptcha && 
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      
      try {
        const token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: 'submit_comment' }
        );
        
        // Submit with reCAPTCHA token
        submitComment(token);
      } catch (error) {
        setRecaptchaError('Failed to execute reCAPTCHA. Please try again.');
        setSubmitting(false);
      }
    } else {
      setRecaptchaError('reCAPTCHA not initialized. Please refresh the page.');
      setSubmitting(false);
    }
  };

  const submitComment = async (token: string) => {

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
          commenterName: commenterName.trim() || undefined,
          recaptchaToken: token,
          parentCommentId: replyingTo,
        }),
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Maximum 10 requests per day.');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const data = await response.json();
      
      // Add the new comment to the list
      if (replyingTo) {
        const addReplyToComment = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data.comment],
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            }
            return comment;
          });
        };
        setComments(addReplyToComment(comments));
      } else {
        setComments([...comments, data.comment]);
      }

      // Reset form
      setCommentText('');
      setCommenterName('');
      setReplyingTo(null);
      setRecaptchaToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  if (loading) {
    return (
      <div className="max-w-[768px] w-full mx-auto mt-12 px-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[768px] w-full mx-auto mt-12 px-6">
      <div className="border-t border-gray-300 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {recaptchaError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            {recaptchaError}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          {replyingTo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Replying to a comment
              </span>
              <button
                type="button"
                onClick={handleCancelReply}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="commenterName" className="block text-sm font-medium text-gray-700 mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              id="commenterName"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-gray-400">(Markdown supported)</span>
            </label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your comment..."
            />
          </div>

          {/* reCAPTCHA v3 is invisible, executed on submit */}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}