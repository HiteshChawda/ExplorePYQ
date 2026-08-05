const PyqCard = ({ pyq }) => {

    return (

        <div className="pyq-card">

            <div className="pyq-header">

                <h3>{pyq.subject}</h3>

                <small>

                    Uploaded by {pyq.owner.fullName}

                </small>

            </div>

            <p>

                <strong>Branch:</strong> {pyq.branch}

            </p>

            <p>

                <strong>Semester:</strong> {pyq.semester}

            </p>

            <p>

                <strong>Year:</strong> {pyq.year}

            </p>

            <p>

                Uploaded on

                {" "}

                {new Date(pyq.createdAt).toLocaleDateString()}

            </p>

            <a
                href={pyq.pdf}
                target="_blank"
                rel="noopener noreferrer"
            >
                📄 View PDF
            </a>

        </div>

    );
};

export default PyqCard;