import React, { useEffect, useState } from "react";
import "../styles/Hero.css";

const HeroSection = () => {
  const words = ["PDFs", "Notes", "PYQs"];

  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 60 : 120);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Welcome to <span>Explore PYQ</span>
        </h1>

        <h2>
          Get <span className="typing">{text}</span>
        </h2>

        <p className="hero-subtitle">
          Your trusted platform that helps you prepare smarter
          and perform better in examinations.
        </p>

        <p className="hero-description">
          Preparing for exams can be challenging, but Project_one
          makes it easier. Find well-organized Notes, Previous Year
          Question Papers, PDFs, and study resources that help you
          understand important concepts and exam patterns.
          Start learning smarter and move one step closer to your
          academic success.
        </p>

      </div>

    </section>
  );
};

export default HeroSection;