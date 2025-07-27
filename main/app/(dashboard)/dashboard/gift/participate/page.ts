"use client";

import { useState } from "react";

export default function ParticipatePage() {
    const [step, setStep] = useState<"lookup" | "claim" | "done">("lookup");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [gift, setGift] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [claim, setClaim] = useState({
        phone: "",
        wallet: "",
        account: ""
    });

    const handleLookup = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pool/check", {
                method: "POST",
                body: JSON.stringify({ email, name }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (data?.gift) {
                setGift(data.gift);
                setStep("claim");
            } else {
                alert("No gift found for this user.");
            }
        } catch (err) {
            alert("Error checking for gift.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClaim = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pool/claim", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    name,
                    ...claim,
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                setStep("done");
            } else {
                alert("Failed to submit claim.");
            }
        } catch (err) {
            alert("Submission error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "max-w-md mx-auto p-6" >
        <h1 className="text-2xl font-bold mb-4" >🎁 Participate in Gift Draw </h1>

    {
        step === "lookup" && (
            <>
            <label className="block mb-2" >
                Name:
        <input
              type="text"
        className = "w-full border p-2 mt-1"
        value = { name }
        onChange = {(e) => setName(e.target.value)
    }
            />
        </label>

        < label className = "block mb-4" >
            Email:
    <input
              type="email"
    className = "w-full border p-2 mt-1"
    value = { email }
    onChange = {(e) => setEmail(e.target.value)
}
            />
    </label>

    < button
onClick = { handleLookup }
disabled = { loading }
className = "bg-blue-600 text-white px-4 py-2 rounded"
    >
    { loading? "Checking...": "Check Gift" }
    </button>
    </>
      )}

{
    step === "claim" && (
        <>
        <div className="mb-4" >
            <h2 className="text-lg font-semibold" >🎉 You've won:</h2>
                < p className = "mt-2" >
                    <strong>{ gift.name } </strong> - {gift.description}
                    </p>
                    </div>

                    < label className = "block mb-2" >
                        Phone Number:
    <input
              type="text"
    className = "w-full border p-2 mt-1"
    value = { claim.phone }
    onChange = {(e) => setClaim({ ...claim, phone: e.target.value })
}
            />
    </label>

    < label className = "block mb-2" >
        Wallet Address:
<input
              type="text"
className = "w-full border p-2 mt-1"
value = { claim.wallet }
onChange = {(e) => setClaim({ ...claim, wallet: e.target.value })}
            />
    </label>

    < label className = "block mb-4" >
        Account Number:
<input
              type="text"
className = "w-full border p-2 mt-1"
value = { claim.account }
onChange = {(e) => setClaim({ ...claim, account: e.target.value })}
            />
    </label>

    < button
onClick = { handleSubmitClaim }
disabled = { loading }
className = "bg-green-600 text-white px-4 py-2 rounded"
    >
    { loading? "Submitting...": "Submit Claim" }
    </button>
    </>
      )}

{
    step === "done" && (
        <div className="text-center" >
            <h2 className="text-xl font-semibold text-green-700 mb-2" >
            ✅ Claim submitted successfully!
        </h2>
        < p > We will contact you shortly.</p>
            </div>
      )
}
</div>
  );
}
