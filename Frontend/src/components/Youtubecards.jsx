import React from "react";
import "../styles/YoutubeCards.css";

const channels = [
  {
    name: "Gate Smashers",
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_mZfqpNqtGLksLQfMbW7UVFgub_poGNE-YU_RAoV_NdUII=s160-c-k-c0x00ffffff-no-rj",
    link: "https://www.youtube.com/@GateSmashers",
  },
  {
    name: "Apna College",
    image:
      "https://yt3.googleusercontent.com/FEcjRtez5od8UowDo6tTt9WlE-MrIFEmcwPMTORmK9Swk6KCklOmA3xfIG9WuLWfNYfNThQE=s160-c-k-c0x00ffffff-no-rj",
    link: "https://www.youtube.com/@ApnaCollegeOfficial",
  },
  {
    name: "5 Minutes Engineering",
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_kwjOJ6-8S_Hl0Awwn_OA43X8pnFAAjDgFrPGDzZHzmDw=s160-c-k-c0x00ffffff-no-rj",
    link: "https://www.youtube.com/@5MinutesEngineering",
  },
  {
    name: "Kunal Kushwaha",
    image:
      "https://yt3.googleusercontent.com/O8WpyZ5fkSpxQJDMA1N1WZeUp4foB4LTDeaQrRlZX_Ue4GTyMnz2J2yi4kXR4BNpGI55uzEs=s160-c-k-c0x00ffffff-no-rj",
    link: "https://www.youtube.com/@KunalKushwaha",
  },
];

const YoutubeCards = () => {
  return (
    <section className="youtube-section">

      <h2>Popular YouTube Channels</h2>

      <div className="youtube-grid">
        {channels.map((channel, index) => (
          <div className="youtube-card" key={index}>

            <img src={channel.image} alt={channel.name} />

            <h3>{channel.name}</h3>

            <a
              href={channel.link}
              target="_blank"
              rel="noreferrer"
            >
              Visit Channel
            </a>

          </div>
        ))}
      </div>

    </section>
  );
};

export default YoutubeCards;