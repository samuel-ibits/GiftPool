export default function ContributionPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">Course Contribution & Campaign</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Start Campaign Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Start a New Campaign</h2>
                    <p className="text-gray-700 mb-4">
                        Launch a new campaign to fund the development or improvement of a course.
                        Define your goals, funding target, and course details.
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Create Campaign
                    </button>
                </div>

                {/* Contribute to a Course Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Contribute to an Existing Course</h2>
                    <p className="text-gray-700 mb-4">
                        Support a course you believe in by contributing funds. Browse active campaigns
                        and help bring educational content to life.
                    </p>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Browse Campaigns
                    </button>
                </div>
            </div>
        </div>
    );
}
