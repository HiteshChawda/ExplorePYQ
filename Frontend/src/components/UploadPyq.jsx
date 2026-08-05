import { useState } from "react";
import { uploadPyq } from "../pages/services/pyq.api";

const UploadPyq = ({ fetchPyqs }) => {

    const [form, setForm] = useState({
        branch: "",
        semester: "",
        subject: "",
        year: "",
    });

    const [pdf, setPdf] = useState(null);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("branch", form.branch);
            formData.append("semester", form.semester);
            formData.append("subject", form.subject);
            formData.append("year", form.year);

            formData.append("pdf", pdf);

            const response = await uploadPyq(formData);

            alert(response.message);

            fetchPyqs();

            setForm({
                branch: "",
                semester: "",
                subject: "",
                year: "",
            });

            setPdf(null);

        } catch (err) {

            alert(err.response?.data?.message || "Upload Failed");

        }
    };

    return (

        <div className="upload-card">

            <h2>Upload PYQ</h2>

            <form onSubmit={handleSubmit}>

                <input
                    placeholder="Branch"
                    value={form.branch}
                    onChange={(e)=>setForm({...form,branch:e.target.value})}
                />

                <input
                    type="number"
                    placeholder="Semester"
                    value={form.semester}
                    onChange={(e)=>setForm({...form,semester:e.target.value})}
                />

                <input
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e)=>setForm({...form,subject:e.target.value})}
                />

                <input
                    type="number"
                    placeholder="Year"
                    value={form.year}
                    onChange={(e)=>setForm({...form,year:e.target.value})}
                />

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e)=>setPdf(e.target.files[0])}
                />

                <button>
                    Upload
                </button>

            </form>

        </div>

    );
};

export default UploadPyq;