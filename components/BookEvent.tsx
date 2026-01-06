"use client";
import { useState } from "react";

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p>Thank you for booking your spot</p>
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
