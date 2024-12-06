"use client";
import { useState } from 'react';

export default function GiftingStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState('');
  const [duration, setDuration] = useState('');
  const [dispenseOption, setDispenseOption] = useState('immediately');
  const [giftAmount, setGiftAmount] = useState<number | null>(null);
  const [splits, setSplits] = useState<number | null>(null);
  const [giftLink, 
    // setGiftLink
] = useState('https://giftingapp.com/your-link');
  const [copied, setCopied] = useState(false);
  
  const steps = [
    { id: 1, title: 'Gift Amount' },
    { id: 2, title: 'Gift Details' },
    { id: 3, title: 'Timing' },
    { id: 4, title: 'Share & Track' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value ? `${e.target.value} days` : '');
  };

  const handleDateChange = (e) => {
    // Handle the selected date
  };

  const isPastDate = (date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(date).setHours(0, 0, 0, 0) < today;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stepper Header */}
      <ol className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <li
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex-1 flex items-center cursor-pointer ${
              index + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                index + 1 <= currentStep
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300'
              }`}
            >
              {index + 1}
            </span>
            <span className="ml-3">{step.title}</span>
          </li>
        ))}
      </ol>

      {/* Stepper Content */}
      <div className="border p-6 rounded-lg bg-white shadow-sm">
      {currentStep === 1 && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Gift Amount</h2>
    <div className="flex items-center space-x-4">
      <input
        type="number"
        className="flex-1 h-12 px-4 border rounded-md"
        placeholder="Enter gift amount"
        value={giftAmount !== null ? giftAmount : ""}
        onChange={(e) => setGiftAmount(Number(e.target.value))}
      />
      <button className="bg-green-600 text-white px-6 py-2 rounded-md">
        Pay Now
      </button>
    </div>
    <div className="mt-4">
      <label className="block text-sm font-medium mb-2">Number of Splits</label>
      <input
        type="number"
        className="w-full h-12 px-4 border rounded-md"
        placeholder="Enter number of participants"
        value={splits !== null ? splits : ""}
        onChange={(e) => setSplits(Number(e.target.value))}
      />
    </div>
    {giftAmount && splits && (
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <p className="text-sm">
          Each participant will receive:{" "}
          <strong>
            {isNaN(giftAmount / splits)
              ? "Invalid amount or splits"
              : (giftAmount / splits).toFixed(2)}{" "}
            currency
          </strong>
        </p>
      </div>
    )}
  </div>
)}


        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Gift Details</h2>
            <div className="mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Image Preview</span>
                </div>
              )}
              <input
                type="file"
                className="w-full h-12 px-4 border rounded-md"
                onChange={handleImageUpload}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full h-12 px-4 border rounded-md"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full h-12 px-4 border rounded-md"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full h-24 px-4 border rounded-md"
                placeholder="Enter description"
              ></textarea>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Timing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Gifting Duration
              </label>
              <input
                type="number"
                className="w-full h-12 px-4 border rounded-md"
                placeholder="Enter gifting duration"
                onChange={handleDurationChange}
              />
              {duration && <p className="text-sm text-gray-500 mt-1">{duration}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Dispense Time
              </label>
              <select
                className="w-full h-12 px-4 border rounded-md mb-4"
                onChange={(e) => setDispenseOption(e.target.value)}
              >
                <option value="immediately">Immediately</option>
                <option value="schedule">Choose Date & Time</option>
                <option value="task" disabled>
                  After Task is Done (Coming Soon)
                </option>
              </select>
              {dispenseOption === 'schedule' && (
                <input
                  type="date"
                  className="w-full h-12 px-4 border rounded-md"
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]} // Disable past dates
                />
              )}
            </div>
          </div>
        )}

{currentStep === 4 && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Share & Track</h2>
    <div className="mb-4">
      <p className="text-sm text-gray-600">
        Share your gift link with friends and family:
      </p>
      <div className="flex items-center mt-4 space-x-2">
        <input
          type="text"
          className="flex-1 h-12 px-4 border rounded-md"
          value={giftLink}
          readOnly
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(giftLink);
            setCopied(true); // Update feedback
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      {copied && <p className="text-green-600 mt-2">Link copied to clipboard!</p>}
    </div>
    <div className="flex space-x-4 mt-6">
      <a
        href="https://facebook.com"
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Facebook
      </a>
      <a
        href="https://twitter.com"
        className="text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Twitter
      </a>
      <a
        href="https://instagram.com"
        className="text-pink-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>
      <a
        href="https://linkedin.com"
        className="text-blue-700 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </div>
  </div>
)}

      </div>

      {/* Stepper Controls */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="px-6 py-2 bg-gray-100 rounded-md disabled:opacity-50"
          disabled={currentStep === 1}
        >
          Previous
        </button>
        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => alert('Tracking Gifting...')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md"
          >
            Track Gifting
          </button>
        )}
      </div>
    </div>
  );
}
