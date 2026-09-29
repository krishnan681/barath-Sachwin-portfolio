import { useState } from "react";
import "./Tools.css";
import { getR2Url } from "../../config/r2";

const TOOLS = [
  { id: "tool-1", name: "After Effects", src: getR2Url("tools/images/1.png"), delay: "0s" },
  { id: "tool-2", name: "Illustrator", src: getR2Url("tools/images/2.png"), delay: "0.2s" },
  { id: "tool-3", name: "Premiere Pro", src: getR2Url("tools/images/3.png"), delay: "0.4s" },
  { id: "tool-4", name: "Photoshop", src: getR2Url("tools/images/4.png"), delay: "0.1s" },
  { id: "tool-5", name: "CorelDraw", src: getR2Url("tools/images/5.png"), delay: "0.3s" },
];

export default function Tools() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="tools">
      <div className="container-fluid px-0">
        <div className="title" data-aos="fade-up">
          <div className="bg-text">Tools</div>
          <h1 className="main-title">Expertise</h1>
        </div>

        <div className="TE-heading text-center" data-aos="fade-up" data-aos-delay="100">
          <p>
            <span>Mastery across industry-standard creative software and post-production suites</span>
            <span>delivering high-impact visual design, color grading, and dynamic motion graphics.</span>
          </p>
        </div>

        <div className="toolbar-wrapper">
          <div className="dock-container">
            <ul className="toolbar">
              {TOOLS.map((tool, i) => (
                <li
                  key={tool.id}
                  className={`toolbarItem ${hoveredIdx === i ? "is-hovered" : ""}`}
                  style={{ animationDelay: tool.delay }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Floating Tooltip badge */}
                  <div className="tool-tooltip">
                    <span>{tool.name}</span>
                  </div>

                  <div className="tool-icon-box">
                    <img
                      className="toolbarImg"
                      src={tool.src}
                      alt={tool.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <span className="tool-name">{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}