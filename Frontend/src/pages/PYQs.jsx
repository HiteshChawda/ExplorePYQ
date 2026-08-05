import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadPyq from "../components/UploadPyq";
import PyqCard from "../components/PyqCard";
import { getPyqs } from "../pages/services/pyq.api";
import "../styles/Pyq.css";

const Pyqs = () => {

    const [pyqs, setPyqs] = useState([]);

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

    return (
        <>
            <Navbar />

            <main className="pyq-page">

                <div className="pyq-layout">

                    <div className="pyq-feed">

                        {pyqs.map((pyq) => (

                            <PyqCard
                                key={pyq._id}
                                pyq={pyq}
                            />

                        ))}

                    </div>

                    <div className="upload-section">

                        <UploadPyq
                            fetchPyqs={fetchPyqs}
                        />

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
};

export default Pyqs;