"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to generate a random CAPTCHA of given length.
function generateCaptcha(length: number): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Component to render the CAPTCHA as an SVG with distortion.
const CaptchaSVG = ({ captcha }: { captcha: string }) => {
    const charCount = captcha.length;
    const width = charCount * 30 + 20; // extra padding
    const height = 60;

    // Generate a few random squiggly paths for noise.
    const paths = Array.from({ length: 3 }).map(() => {
        const startY = Math.random() * height;
        const controlY = startY + (Math.random() * 20 - 10);
        const endY = Math.random() * height;
        return `M0,${startY} Q${width / 2},${controlY} ${width},${endY}`;
    });

    return (
        <svg width={width} height={height} style={{ background: "#eee" }}>
            {/* Render the CAPTCHA text as one element */}
            <text
                x="10"
                y="40"
                fill="#000"
                style={{
                    fontSize: "24px",
                    fontFamily: "monospace",
                    textDecoration: "line-through",
                }}
            >
                {captcha}
            </text>
            {/* Render squiggly noise paths */}
            {paths.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    stroke="black"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.3"
                />
            ))}
        </svg>
    );
};

const Page = () => {
    const router = useRouter();
    const [captcha, setCaptcha] = useState("");
    const [answer, setAnswer] = useState("");
    const [captchaPassed, setCaptchaPassed] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    // Generate captcha on mount.
    useEffect(() => {
        setCaptcha(generateCaptcha(6));
    }, []);

    const handleCaptchaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (answer === captcha) {
            setCaptchaPassed(true);
        } else {
            alert("Captcha is incorrect. Please try again.");
            // Regenerate the captcha on failure
            setCaptcha(generateCaptcha(6));
            setAnswer("");
        }
    };

    const handleProceed = () => {
        if (termsAgreed) {
            router.push("/main");
        } else {
            alert("Please agree to the terms and conditions.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {!captchaPassed ? (
                <form
                    onSubmit={handleCaptchaSubmit}
                    className="bg-white shadow p-6 rounded w-full max-w-sm"
                >
                    <p className="mb-4">
                        Please enter the characters you see below:
                    </p>
                    <div className="mb-4 flex justify-center">
                        {/* Render the custom CAPTCHA SVG */}
                        <CaptchaSVG captcha={captcha} />
                    </div>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="border p-2 mb-4 w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded w-full"
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="bg-white shadow p-6 rounded w-full max-w-4xl">
                    <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
                    <div className="text-sm">
                        <p className="mb-4 font-bold">
                            University of Toronto Research Project Participation Consent Form
                        </p>
                        <p className="mb-4">
                            Researchers at the University of Toronto are studying how
                            people’s usage of Artificial Intelligence impacts their creative
                            thinking abilities. Nowadays, people are often offloading tedious
                            cognitive tasks to various AI tools to boost productivity and save
                            time. Our project investigates the implications this has on human
                            creativity.
                        </p>
                        <p className="mb-4">
                            You are invited to participate in this study if you are at least 18
                            years of age. As a participant, you will be asked to come up with
                            alternative methods of utilizing common household items besides
                            their intended use. You will also be asked to provide some
                            demographic information and general thoughts on this survey. By
                            taking part, you will help us better understand how we can guide
                            responsible AI development and usage.
                        </p>
                        <p className="mb-4">
                            There are no potential risks or preparatory requirements for
                            completing the study. We will have mechanisms in place to ensure
                            that information collected during the study will be kept separate
                            from identification, and not disclosed to anyone besides those
                            named below. No personally identifiable information will be
                            collected.
                        </p>
                        <p className="mb-4">
                            We expect the survey to take around 10 minutes to complete. If you
                            are a Prolific worker, you will receive the monetary amount detailed
                            on Prolific as compensation for your time. If you were recruited
                            offline, you will be entered into a draw for 5 USD Amazon gift cards.
                            Odds are detailed in the advertisement post, but you can expect a
                            winning probability of at least 30%.
                        </p>
                        <p className="mb-4">
                            As the results of this evaluation will be of interest to a wide
                            number of communities, we are asking your permission to include your
                            data in any reports that we publish, in a de-identified, aggregated
                            format. Your participation in this research study is voluntary. If
                            you do not give consent, you will not be asked to participate any
                            further and your results will not be part of the de-identified data
                            used for any published reports.
                        </p>
                        <p className="mb-4">
                            You may decline to participate or withdraw at any time without penalty.
                            If you decide to withdraw from the study after participating, you may do
                            so any time before the results are published. If you wish to withdraw
                            during your participation in Prolific, you may simply close the
                            browser window with the experiment and return the task.
                        </p>
                        <p className="mb-4">
                            Note that you will be compensated only after you have completed the
                            activity and have successfully verified your Prolific ID. Please allow
                            2-3 days for this process.
                        </p>
                        <p className="mb-4">
                            For an independent opinion regarding the research and the rights of
                            research participants, you may contact the University of Toronto
                            Research Oversight and Compliance Office - Human Research Ethics
                            Program via email (ethics.review@utoronto.ca) or phone (416-946-3273).
                        </p>
                        <p className="mb-4">
                            The research study you are participating in may be reviewed for quality
                            assurance to make sure that the required laws and guidelines are
                            followed. If chosen, (a) representative(s) of the Human Research
                            Ethics Program (HREP) may access study-related data and/or consent
                            materials as part of the review.
                        </p>
                        <p className="mb-4">
                            All information accessed by the HREP will be upheld to the same level
                            of confidentiality that has been stated by the research team.
                        </p>
                        <p className="mb-4">
                            The investigator involved in this study is Ashton Anderson
                            (ashton@cs.toronto.edu). The members of his research team responsible
                            for the experiment interface and survey are Harsh Kumar
                            (harsh@cs.toronto.edu) and Jace Mu
                            (jace.mu@mail.utoronto.ca). If you have any questions or concerns,
                            please contact either Harsh Kumar or Jace Mu.
                        </p>
                        <p className="mb-4">
                            Please print or save a copy of this form for your records.
                        </p>
                        <p className="mb-4">
                            By clicking to the survey, you agree that:
                            <br />
                            • You have read and understood the information on this sheet;
                            <br />
                            • You are at least 18 years of age;
                            <br />
                            • You consent to participation and data collection for the
                            aforementioned purposes;
                            <br />
                            • You may freely withdraw until the aforementioned date;
                            <br />
                            • You assign to the researchers all copyright of your survey
                            contributions for use in all current and future work stemming from
                            this project.
                        </p>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={termsAgreed}
                            onChange={(e) => setTermsAgreed(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="agree" className="text-sm">
                            I agree to the terms and conditions
                        </label>
                    </div>
                    <button
                        onClick={handleProceed}
                        className="bg-primary text-white px-4 py-2 rounded w-full"
                    >
                        Proceed
                    </button>
                </div>
            )}
        </div>
    );
};

export default Page;