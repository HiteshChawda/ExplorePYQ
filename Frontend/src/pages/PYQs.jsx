import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadPyq from "../components/UploadPyq";
import { getPyqs } from "../pages/services/pyq.api";
import { useAuth } from "../context/AuthContext";
import "../styles/Pyq.css";

const Pyqs = () => {
  const { role } = useAuth();
  const isCreator = role === "creator";

  const [pyqs, setPyqs] = useState([]);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchPyqs();
  }, []);

  const fetchPyqs = async () => {
    try {
      const response = await getPyqs();
      setPyqs(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const groupPyqs = (list) => {
    const groups = {};

    list.forEach((pyq) => {
      const branchKey = pyq.branch.trim().toLowerCase();
      const subjectKey = pyq.subject.trim().toLowerCase();

      if (!groups[branchKey]) {
        groups[branchKey] = {
          displayName: pyq.branch.trim(),
          subjects: {},
        };
      }

      if (!groups[branchKey].subjects[subjectKey]) {
        groups[branchKey].subjects[subjectKey] = {
          displayName: pyq.subject.trim(),
          items: [],
        };
      }

      groups[branchKey].subjects[subjectKey].items.push(pyq);
    });

    return groups;
  };

  const grouped = groupPyqs(pyqs);

  const toggleBranch = (branchKey) => {
    setExpandedBranch(expandedBranch === branchKey ? null : branchKey);
    setExpandedSubject(null);
  };

  const toggleSubject = (subjectKey) => {
    setExpandedSubject(expandedSubject === subjectKey ? null : subjectKey);
  };

  return (
    <>
      <Navbar />

      <main className="pyq-page">
        <div className="pyq-layout">
          <div className="pyq-feed">
            <h2 className="pyq-feed-title">Branch wise PYQs</h2>

            {Object.keys(grouped).length === 0 && (
              <p className="pyq-empty">No PYQs uploaded yet.</p>
            )}

            {Object.entries(grouped).map(([branchKey, branch]) => (
              <div key={branchKey} className="branch-block">
                <div
                  className="branch-row"
                  onClick={() => toggleBranch(branchKey)}
                >
                  <div className="branch-pill">{branch.displayName}</div>
                  <button className="chevron-circle" type="button">
                    <span
                      className={`chevron ${
                        expandedBranch === branchKey ? "open" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </div>

                {expandedBranch === branchKey && (
                  <div className="subject-list">
                    {Object.entries(branch.subjects).map(
                      ([subjectKey, subject]) => (
                        <div key={subjectKey} className="subject-block">
                          <div
                            className="subject-row"
                            onClick={() => toggleSubject(subjectKey)}
                          >
                            <span className="subject-name">
                              <span className="bullet">•</span>
                              {subject.displayName}
                            </span>
                            <button className="subject-chevron" type="button">
                              <span
                                className={`chevron ${
                                  expandedSubject === subjectKey ? "open" : ""
                                }`}
                              >
                                ▼
                              </span>
                            </button>
                          </div>

                          {expandedSubject === subjectKey && (
                            <div className="pyq-file-list">
                              {subject.items.map((pyq) => (
                                <a
                                  key={pyq._id}
                                  href={pyq.pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pyq-file-item"
                                >
                                  📄 Sem {pyq.semester}, {pyq.year}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isCreator && (
            <div className="upload-section">
              <UploadPyq fetchPyqs={fetchPyqs} />
            </div>
          )}

          {isCreator && showUpload && (
            <div
              className="pyq-modal-backdrop"
              onClick={() => setShowUpload(false)}
            >
              <div
                className="pyq-modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="pyq-modal-close"
                  type="button"
                  onClick={() => setShowUpload(false)}
                  aria-label="Close upload form"
                >
                  ×
                </button>

                <UploadPyq fetchPyqs={fetchPyqs} />
              </div>
            </div>
          )}
        </div>

        {isCreator && (
          <button
            className="pyq-fab"
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            aria-label="Toggle upload PYQ form"
          >
            {showUpload ? "×" : "+"}
          </button>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Pyqs;
