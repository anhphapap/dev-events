"use client";
import { useState } from "react";
import { bookEvent } from "@/lib/actions/booking.action";

const BookEvent = ({ eventId }: { eventId: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await bookEvent({ eventId, email });
    if (response.success) {
      setSubmitted(true);
      setMsg(response.message);
    } else {
      setError(response.message);
    }
  };

  return (
    <div id="book-event">
      {submitted && msg ? (
        <p className="text-green-500">{msg}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
